import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';
import { createParkingLotSchema, updateParkingLotSchema, createParkingSpaceSchema, updateParkingSpaceSchema } from '../validators/parkingLotValidator';

const prisma = new PrismaClient();

/**
 * Controlador de estacionamentos
 */
const parkingLotController = {
  /**
   * Obter todos os estacionamentos
   */
  getAllParkingLots: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, active, priceMin, priceMax } = req.query;
      
      // Construir filtros
      const where: any = {};
      
      // Filtrar por status ativo/inativo
      if (active !== undefined) {
        where.isActive = active === 'true';
      }
      
      // Filtrar por preço
      if (priceMin || priceMax) {
        where.pricePerHour = {};
        if (priceMin) where.pricePerHour.gte = parseFloat(priceMin as string);
        if (priceMax) where.pricePerHour.lte = parseFloat(priceMax as string);
      }
      
      // Filtrar por nome ou endereço
      if (search) {
        where.OR = [
          { name: { contains: search.toString(), mode: 'insensitive' } },
          { address: { contains: search.toString(), mode: 'insensitive' } },
        ];
      }
      
      // Verificar permissões - se não for admin e for estacionamento, mostrar apenas próprios estacionamentos
      if (req.user.role !== 'ADMIN') {
        if (req.user.role === 'ESTACIONAMENTO') {
          where.companyId = req.user.companyId;
          // Por padrão, mostrar apenas estacionamentos ativos, a menos que explicitamente solicitado
          if (active === undefined) {
            where.isActive = true;
          }
        }
        // Para transportadoras, podem ver todos estacionamentos ativos
        else if (req.user.role === 'TRANSPORTADORA') {
          where.isActive = true;
        }
      }
      
      const parkingLots = await prisma.parkingLot.findMany({
        where,
        orderBy: {
          name: 'asc',
        },
        include: {
          company: {
            select: {
              name: true,
              phone: true,
              email: true
            }
          },
          _count: {
            select: {
              parkingSpaces: true
            }
          }
        }
      });
      
      return res.status(200).json(parkingLots);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Criar um novo estacionamento
   */
  createParkingLot: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verificar permissões - apenas admin ou empresa de estacionamento pode criar
      if (req.user.role !== 'ADMIN' && req.user.role !== 'ESTACIONAMENTO') {
        throw new ApiError(403, 'Acesso negado. Apenas administradores ou empresas de estacionamento podem criar estacionamentos.');
      }
      
      // Validar dados
      const validatedData = createParkingLotSchema.parse(req.body);
      
      // Se não for admin, usar companyId do usuário logado
      const companyId = req.user.role === 'ADMIN' && req.body.companyId 
        ? req.body.companyId 
        : req.user.companyId;
      
      // Verificar se a empresa existe e é do tipo estacionamento
      const company = await prisma.company.findUnique({
        where: { id: companyId }
      });
      
      if (!company) {
        throw new ApiError(404, 'Empresa não encontrada.');
      }
      
      if (company.companyType !== 'ESTACIONAMENTO') {
        throw new ApiError(400, 'Apenas empresas do tipo estacionamento podem ter estacionamentos.');
      }
      
      // Criar o estacionamento
      const parkingLot = await prisma.parkingLot.create({
        data: {
          ...validatedData,
          companyId,
          // Converter valor decimal
          pricePerHour: validatedData.pricePerHour
        }
      });
      
      // Log da ação
      logger.info(`Estacionamento criado: ${parkingLot.id}`, { userId: req.user.id, action: 'create_parking_lot' });
      
      return res.status(201).json(parkingLot);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obter um estacionamento específico
   */
  getParkingLotById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      const parkingLot = await prisma.parkingLot.findUnique({
        where: { id },
        include: {
          company: {
            select: {
              name: true,
              phone: true,
              email: true,
              address: true
            }
          },
          parkingSpaces: {
            where: {
              isActive: true
            }
          }
        }
      });
      
      if (!parkingLot) {
        throw new ApiError(404, 'Estacionamento não encontrado.');
      }
      
      // Verificar permissões - estacionamentos inativos só podem ser vistos por admin ou própria empresa
      if (!parkingLot.isActive && 
          req.user.role !== 'ADMIN' && 
          (req.user.role !== 'ESTACIONAMENTO' || req.user.companyId !== parkingLot.companyId)) {
        throw new ApiError(403, 'Acesso negado. Este estacionamento está inativo.');
      }
      
      return res.status(200).json(parkingLot);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Atualizar um estacionamento
   */
  updateParkingLot: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      // Verificar se o estacionamento existe
      const parkingLot = await prisma.parkingLot.findUnique({
        where: { id }
      });
      
      if (!parkingLot) {
        throw new ApiError(404, 'Estacionamento não encontrado.');
      }
      
      // Verificar permissões - apenas admin ou empresa dona do estacionamento pode atualizar
      if (req.user.role !== 'ADMIN' && 
          (req.user.role !== 'ESTACIONAMENTO' || req.user.companyId !== parkingLot.companyId)) {
        throw new ApiError(403, 'Acesso negado. Você só pode atualizar seus próprios estacionamentos.');
      }
      
      // Validar dados
      const validatedData = updateParkingLotSchema.parse(req.body);
      
      // Não-admin não pode mudar o status ativo
      if (req.user.role !== 'ADMIN' && 'isActive' in validatedData) {
        delete validatedData.isActive;
      }
      
      // Atualizar o estacionamento
      const updatedParkingLot = await prisma.parkingLot.update({
        where: { id },
        data: validatedData
      });
      
      // Log da ação
      logger.info(`Estacionamento atualizado: ${id}`, { userId: req.user.id, action: 'update_parking_lot' });
      
      return res.status(200).json(updatedParkingLot);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Excluir um estacionamento (exclusão lógica)
   */
  deleteParkingLot: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      // Verificar se o estacionamento existe
      const parkingLot = await prisma.parkingLot.findUnique({
        where: { id }
      });
      
      if (!parkingLot) {
        throw new ApiError(404, 'Estacionamento não encontrado.');
      }
      
      // Verificar permissões - apenas admin ou empresa dona do estacionamento pode excluir
      if (req.user.role !== 'ADMIN' && 
          (req.user.role !== 'ESTACIONAMENTO' || req.user.companyId !== parkingLot.companyId)) {
        throw new ApiError(403, 'Acesso negado. Você só pode excluir seus próprios estacionamentos.');
      }
      
      // Exclusão lógica - apenas marcar como inativo
      await prisma.parkingLot.update({
        where: { id },
        data: { isActive: false }
      });
      
      // Log da ação
      logger.info(`Estacionamento excluído (lógico): ${id}`, { userId: req.user.id, action: 'delete_parking_lot' });
      
      return res.status(200).json({ message: 'Estacionamento excluído com sucesso.' });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Listar vagas de um estacionamento
   */
  getParkingSpaces: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { available, type } = req.query;
      
      // Verificar se o estacionamento existe
      const parkingLot = await prisma.parkingLot.findUnique({
        where: { id }
      });
      
      if (!parkingLot) {
        throw new ApiError(404, 'Estacionamento não encontrado.');
      }
      
      // Verificar permissões para estacionamentos inativos
      if (!parkingLot.isActive && 
          req.user.role !== 'ADMIN' && 
          (req.user.role !== 'ESTACIONAMENTO' || req.user.companyId !== parkingLot.companyId)) {
        throw new ApiError(403, 'Acesso negado. Este estacionamento está inativo.');
      }
      
      // Construir filtros
      const where: any = {
        parkingLotId: id,
        isActive: true
      };
      
      // Filtrar por disponibilidade
      if (available !== undefined) {
        where.isAvailable = available === 'true';
      }
      
      // Filtrar por tipo de vaga
      if (type) {
        where.spaceType = type.toString();
      }
      
      const parkingSpaces = await prisma.parkingSpace.findMany({
        where,
        orderBy: {
          spaceNumber: 'asc'
        }
      });
      
      return res.status(200).json(parkingSpaces);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Criar uma vaga em um estacionamento
   */
  createParkingSpace: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: parkingLotId } = req.params;
      
      // Verificar se o estacionamento existe
      const parkingLot = await prisma.parkingLot.findUnique({
        where: { id: parkingLotId }
      });
      
      if (!parkingLot) {
        throw new ApiError(404, 'Estacionamento não encontrado.');
      }
      
      // Verificar permissões - apenas admin ou empresa dona do estacionamento pode adicionar vagas
      if (req.user.role !== 'ADMIN' && 
          (req.user.role !== 'ESTACIONAMENTO' || req.user.companyId !== parkingLot.companyId)) {
        throw new ApiError(403, 'Acesso negado. Você só pode adicionar vagas aos seus próprios estacionamentos.');
      }
      
      // Validar dados
      const validatedData = createParkingSpaceSchema.parse(req.body);
      
      // Verificar se já existe vaga com este número
      const existingSpace = await prisma.parkingSpace.findFirst({
        where: {
          parkingLotId,
          spaceNumber: validatedData.spaceNumber,
          isActive: true
        }
      });
      
      if (existingSpace) {
        throw new ApiError(400, 'Já existe uma vaga com este número neste estacionamento.');
      }
      
      // Criar a vaga
      const parkingSpace = await prisma.parkingSpace.create({
        data: {
          ...validatedData,
          parkingLotId
        }
      });
      
      // Atualizar contagem de vagas disponíveis no estacionamento
      if (validatedData.isAvailable !== false) {
        await prisma.parkingLot.update({
          where: { id: parkingLotId },
          data: {
            availableSpaces: {
              increment: 1
            },
            totalSpaces: {
              increment: 1
            }
          }
        });
      } else {
        // Incrementar apenas total se não disponível
        await prisma.parkingLot.update({
          where: { id: parkingLotId },
          data: {
            totalSpaces: {
              increment: 1
            }
          }
        });
      }
      
      // Log da ação
      logger.info(`Vaga criada: ${parkingSpace.id}`, { userId: req.user.id, action: 'create_parking_space' });
      
      return res.status(201).json(parkingSpace);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Atualizar uma vaga de estacionamento
   */
  updateParkingSpace: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: parkingLotId, spaceId } = req.params;
      
      // Verificar se a vaga existe
      const parkingSpace = await prisma.parkingSpace.findFirst({
        where: {
          id: spaceId,
          parkingLotId
        },
        include: {
          parkingLot: true
        }
      });
      
      if (!parkingSpace) {
        throw new ApiError(404, 'Vaga não encontrada.');
      }
      
      // Verificar permissões - apenas admin ou empresa dona do estacionamento pode atualizar vagas
      if (req.user.role !== 'ADMIN' && 
          (req.user.role !== 'ESTACIONAMENTO' || req.user.companyId !== parkingSpace.parkingLot.companyId)) {
        throw new ApiError(403, 'Acesso negado. Você só pode atualizar vagas dos seus próprios estacionamentos.');
      }
      
      // Validar dados
      const validatedData = updateParkingSpaceSchema.parse(req.body);
      
      // Verificar alteração de disponibilidade para atualizar contagens
      const wasAvailable = parkingSpace.isAvailable;
      const willBeAvailable = 'isAvailable' in validatedData ? validatedData.isAvailable : wasAvailable;
      
      // Atualizar disponibilidade no estacionamento se houver mudança
      if (wasAvailable !== willBeAvailable) {
        await prisma.parkingLot.update({
          where: { id: parkingLotId },
          data: {
            availableSpaces: {
              [willBeAvailable ? 'increment' : 'decrement']: 1
            }
          }
        });
      }
      
      // Atualizar a vaga
      const updatedParkingSpace = await prisma.parkingSpace.update({
        where: { id: spaceId },
        data: validatedData
      });
      
      // Log da ação
      logger.info(`Vaga atualizada: ${spaceId}`, { userId: req.user.id, action: 'update_parking_space' });
      
      return res.status(200).json(updatedParkingSpace);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Excluir uma vaga de estacionamento (exclusão lógica)
   */
  deleteParkingSpace: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: parkingLotId, spaceId } = req.params;
      
      // Verificar se a vaga existe
      const parkingSpace = await prisma.parkingSpace.findFirst({
        where: {
          id: spaceId,
          parkingLotId
        },
        include: {
          parkingLot: true
        }
      });
      
      if (!parkingSpace) {
        throw new ApiError(404, 'Vaga não encontrada.');
      }
      
      // Verificar permissões - apenas admin ou empresa dona do estacionamento pode excluir vagas
      if (req.user.role !== 'ADMIN' && 
          (req.user.role !== 'ESTACIONAMENTO' || req.user.companyId !== parkingSpace.parkingLot.companyId)) {
        throw new ApiError(403, 'Acesso negado. Você só pode excluir vagas dos seus próprios estacionamentos.');
      }
      
      // Verificar se há reservas ativas para esta vaga
      const activeReservations = await prisma.reservation.count({
        where: {
          parkingSpaceId: spaceId,
          status: {
            in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS']
          }
        }
      });
      
      if (activeReservations > 0) {
        throw new ApiError(400, 'Não é possível excluir esta vaga pois há reservas ativas associadas a ela.');
      }
      
      // Exclusão lógica - apenas marcar como inativo
      await prisma.parkingSpace.update({
        where: { id: spaceId },
        data: { isActive: false }
      });
      
      // Atualizar contagem de vagas no estacionamento
      await prisma.parkingLot.update({
        where: { id: parkingLotId },
        data: {
          totalSpaces: {
            decrement: 1
          },
          // Decrementar vagas disponíveis apenas se a vaga estava disponível
          ...(parkingSpace.isAvailable && {
            availableSpaces: {
              decrement: 1
            }
          })
        }
      });
      
      // Log da ação
      logger.info(`Vaga excluída (lógico): ${spaceId}`, { userId: req.user.id, action: 'delete_parking_space' });
      
      return res.status(200).json({ message: 'Vaga excluída com sucesso.' });
    } catch (error) {
      next(error);
    }
  }
};

export default parkingLotController;
