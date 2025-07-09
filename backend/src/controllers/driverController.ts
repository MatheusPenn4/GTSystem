import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';
import { createDriverSchema, updateDriverSchema } from '../validators/driverValidator';

const prisma = new PrismaClient();

/**
 * Controlador de motoristas
 */
const driverController = {
  /**
   * Obter todos os motoristas
   */
  getAllDrivers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, active } = req.query;
      
      // Construir filtros
      const where: any = {};
      
      // Filtrar por status ativo/inativo
      if (active !== undefined) {
        where.isActive = active === 'true';
      }
      
      // Filtrar por nome, CPF ou CNH
      if (search) {
        where.OR = [
          { name: { contains: search.toString(), mode: 'insensitive' } },
          { cpf: { contains: search.toString() } },
          { cnh: { contains: search.toString() } },
          { email: { contains: search.toString(), mode: 'insensitive' } },
          { phone: { contains: search.toString() } },
        ];
      }
      
      // Verificar permissões - se não for admin, mostrar apenas motoristas da própria empresa
      if (req.user.role !== 'ADMIN') {
        where.companyId = req.user.companyId;
      }
      
      const drivers = await prisma.driver.findMany({
        where,
        orderBy: {
          name: 'asc',
        },
        include: {
          company: {
            select: {
              name: true
            }
          },
          _count: {
            select: {
              reservations: true
            }
          }
        }
      });
      
      return res.status(200).json(drivers);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Criar um novo motorista
   */
  createDriver: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validar dados
      const validatedData = createDriverSchema.parse(req.body);
      
      // Se não for admin, usar companyId do usuário logado
      const companyId = req.user.role === 'ADMIN' && req.body.companyId 
        ? req.body.companyId 
        : req.user.companyId;
      
      if (!companyId) {
        throw new ApiError(400, 'ID da empresa não fornecido.');
      }
      
      // Verificar se a empresa existe e é do tipo transportadora
      const company = await prisma.company.findUnique({
        where: { id: companyId }
      });
      
      if (!company) {
        throw new ApiError(404, 'Empresa não encontrada.');
      }
      
      if (company.companyType !== 'TRANSPORTADORA') {
        throw new ApiError(400, 'Apenas empresas do tipo transportadora podem ter motoristas.');
      }
      
      // Verificar se já existe motorista com este CPF ou CNH
      const existingDriver = await prisma.driver.findFirst({
        where: {
          OR: [
            { cpf: validatedData.cpf },
            { cnh: validatedData.cnh }
          ]
        }
      });
      
      if (existingDriver) {
        if (existingDriver.cpf === validatedData.cpf) {
          throw new ApiError(400, 'Já existe um motorista com este CPF.');
        } else {
          throw new ApiError(400, 'Já existe um motorista com esta CNH.');
        }
      }
      
      // Criar o motorista
      const driver = await prisma.driver.create({
        data: {
          ...validatedData,
          companyId
        }
      });
      
      // Log da ação
      logger.info(`Motorista criado: ${driver.id}`, { userId: req.user.id, action: 'create_driver' });
      
      return res.status(201).json(driver);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obter um motorista específico
   */
  getDriverById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      const driver = await prisma.driver.findUnique({
        where: { id },
        include: {
          company: {
            select: {
              name: true,
              phone: true,
              email: true
            }
          },
          reservations: {
            where: {
              status: {
                in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS']
              }
            },
            select: {
              id: true,
              status: true,
              startTime: true,
              endTime: true,
              parkingLot: {
                select: {
                  name: true,
                  address: true
                }
              },
              vehicle: {
                select: {
                  licensePlate: true,
                  brand: true,
                  model: true
                }
              }
            }
          }
        }
      });
      
      if (!driver) {
        throw new ApiError(404, 'Motorista não encontrado.');
      }
      
      // Verificar permissões - se não for admin, verificar se pertence à empresa do usuário
      if (req.user.role !== 'ADMIN' && req.user.companyId !== driver.companyId) {
        throw new ApiError(403, 'Acesso negado. Você só pode visualizar motoristas da sua empresa.');
      }
      
      return res.status(200).json(driver);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Atualizar um motorista
   */
  updateDriver: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      // Verificar se o motorista existe
      const driver = await prisma.driver.findUnique({
        where: { id }
      });
      
      if (!driver) {
        throw new ApiError(404, 'Motorista não encontrado.');
      }
      
      // Verificar permissões - se não for admin, verificar se pertence à empresa do usuário
      if (req.user.role !== 'ADMIN' && req.user.companyId !== driver.companyId) {
        throw new ApiError(403, 'Acesso negado. Você só pode atualizar motoristas da sua empresa.');
      }
      
      // Validar dados
      const validatedData = updateDriverSchema.parse(req.body);
      
      // Não-admin não pode mudar o status ativo
      if (req.user.role !== 'ADMIN' && 'isActive' in validatedData) {
        delete validatedData.isActive;
      }
      
      // Atualizar o motorista
      const updatedDriver = await prisma.driver.update({
        where: { id },
        data: validatedData
      });
      
      // Log da ação
      logger.info(`Motorista atualizado: ${id}`, { userId: req.user.id, action: 'update_driver' });
      
      return res.status(200).json(updatedDriver);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Excluir um motorista (exclusão lógica)
   */
  deleteDriver: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      // Verificar se o motorista existe
      const driver = await prisma.driver.findUnique({
        where: { id }
      });
      
      if (!driver) {
        throw new ApiError(404, 'Motorista não encontrado.');
      }
      
      // Verificar permissões - se não for admin, verificar se pertence à empresa do usuário
      if (req.user.role !== 'ADMIN' && req.user.companyId !== driver.companyId) {
        throw new ApiError(403, 'Acesso negado. Você só pode excluir motoristas da sua empresa.');
      }
      
      // Verificar se há reservas ativas para este motorista
      const activeReservations = await prisma.reservation.count({
        where: {
          driverId: id,
          status: {
            in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS']
          }
        }
      });
      
      if (activeReservations > 0) {
        throw new ApiError(400, 'Não é possível excluir este motorista pois há reservas ativas associadas a ele.');
      }
      
      // Exclusão lógica - apenas marcar como inativo
      await prisma.driver.update({
        where: { id },
        data: { isActive: false }
      });
      
      // Log da ação
      logger.info(`Motorista excluído (lógico): ${id}`, { userId: req.user.id, action: 'delete_driver' });
      
      return res.status(200).json({ message: 'Motorista excluído com sucesso.' });
    } catch (error) {
      next(error);
    }
  }
};

export default driverController;
