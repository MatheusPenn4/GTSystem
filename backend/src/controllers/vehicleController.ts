import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';
import { createVehicleSchema, updateVehicleSchema } from '../validators/vehicleValidator';

const prisma = new PrismaClient();

/**
 * Controlador de veículos
 */
const vehicleController = {
  /**
   * Obter todos os veículos
   */
  getAllVehicles: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, type, brand, model, active } = req.query;
      
      // Construir filtros
      const where: any = {};
      
      // Filtrar por status ativo/inativo
      if (active !== undefined) {
        where.isActive = active === 'true';
      }
      
      // Filtrar por tipo de veículo
      if (type) {
        where.vehicleType = type.toString();
      }
      
      // Filtrar por marca
      if (brand) {
        where.brand = {
          contains: brand.toString(),
          mode: 'insensitive'
        };
      }
      
      // Filtrar por modelo
      if (model) {
        where.model = {
          contains: model.toString(),
          mode: 'insensitive'
        };
      }
      
      // Filtrar por placa ou outros campos
      if (search) {
        where.OR = [
          { licensePlate: { contains: search.toString(), mode: 'insensitive' } },
          { brand: { contains: search.toString(), mode: 'insensitive' } },
          { model: { contains: search.toString(), mode: 'insensitive' } },
          { color: { contains: search.toString(), mode: 'insensitive' } },
        ];
      }
      
      // Verificar permissões - se não for admin, mostrar apenas veículos da própria empresa
      if (req.user.role !== 'ADMIN') {
        where.companyId = req.user.companyId;
      }
      
      const vehicles = await prisma.vehicle.findMany({
        where,
        orderBy: {
          licensePlate: 'asc',
        },
        include: {
          company: {
            select: {
              name: true
            }
          },
          driver: {
            select: {
              id: true,
              name: true,
              cpf: true
            }
          },
          _count: {
            select: {
              reservations: true
            }
          }
        }
      });
      
      return res.status(200).json(vehicles);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Criar um novo veículo
   */
  createVehicle: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Log de debug para verificar os dados recebidos
      console.log('DEBUG - Dados recebidos no createVehicle:');
      console.log('Body:', JSON.stringify(req.body, null, 2));
      console.log('User:', JSON.stringify(req.user, null, 2));
      
      // Validar dados
      try {
        const validatedData = createVehicleSchema.parse(req.body);
        console.log('Dados validados com sucesso:', JSON.stringify(validatedData, null, 2));
        
        // Determinar o companyId a ser usado
        // 1. Primeiro verifica se há companyId no corpo da requisição
        // 2. Se não houver, usa o companyId do usuário logado
        // 3. Se o usuário for admin, o companyId deve ser fornecido no corpo
        const companyId = req.body.companyId || req.user.companyId;
        
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
          throw new ApiError(400, 'Apenas empresas do tipo transportadora podem ter veículos.');
        }
        
        // Verificar se já existe veículo com esta placa
        const existingVehicle = await prisma.vehicle.findUnique({
          where: { licensePlate: validatedData.licensePlate }
        });
        
        if (existingVehicle) {
          throw new ApiError(400, 'Já existe um veículo com esta placa.');
        }
        
        // Se driverId foi fornecido, verificar se o motorista existe e pertence à mesma empresa
        if (validatedData.driverId) {
          const driver = await prisma.driver.findUnique({
            where: { 
              id: validatedData.driverId,
            }
          });
          
          if (!driver) {
            throw new ApiError(404, 'Motorista não encontrado.');
          }
          
          if (driver.companyId !== companyId) {
            throw new ApiError(400, 'O motorista deve pertencer à mesma empresa do veículo.');
          }
          
          if (!driver.isActive) {
            throw new ApiError(400, 'O motorista está inativo e não pode ser associado ao veículo.');
          }
        }
        
        // Criar o veículo
        const vehicle = await prisma.vehicle.create({
          data: {
            ...validatedData,
            companyId
          },
          include: {
            company: {
              select: {
                name: true
              }
            }
          }
        });
        
        // Log da ação
        logger.info(`Veículo criado: ${vehicle.id}`, { 
          userId: req.user.id, 
          action: 'create_vehicle',
          vehicleId: vehicle.id,
          licensePlate: vehicle.licensePlate
        });
        
        return res.status(201).json(vehicle);
      } catch (validationError) {
        console.error('Erro na validação dos dados:', validationError);
        next(validationError);
      }
    } catch (error) {
      console.error('Erro geral no createVehicle:', error);
      next(error);
    }
  },

  /**
   * Obter um veículo específico
   */
  getVehicleById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      const vehicle = await prisma.vehicle.findUnique({
        where: { id },
        include: {
          company: {
            select: {
              name: true,
              phone: true,
              email: true
            }
          },
          driver: {
            select: {
              id: true,
              name: true,
              cpf: true,
              cnh: true,
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
              }
            }
          }
        }
      });
      
      if (!vehicle) {
        throw new ApiError(404, 'Veículo não encontrado.');
      }
      
      // Verificar permissões - se não for admin, verificar se pertence à empresa do usuário
      if (req.user.role !== 'ADMIN' && req.user.companyId !== vehicle.companyId) {
        throw new ApiError(403, 'Acesso negado. Você só pode visualizar veículos da sua empresa.');
      }
      
      return res.status(200).json(vehicle);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Atualizar um veículo existente
   */
  updateVehicle: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      // Validar dados
      const validatedData = updateVehicleSchema.parse(req.body);
      
      // Verificar se o veículo existe
      const vehicle = await prisma.vehicle.findUnique({
        where: { id }
      });
      
      if (!vehicle) {
        throw new ApiError(404, 'Veículo não encontrado.');
      }
      
      // Verificar permissões - se não for admin, verificar se pertence à empresa do usuário
      if (req.user.role !== 'ADMIN' && req.user.companyId !== vehicle.companyId) {
        throw new ApiError(403, 'Acesso negado. Você só pode editar veículos da sua empresa.');
      }
      
      // Se a placa foi alterada, verificar se já existe outro veículo com esta placa
      if (validatedData.licensePlate && validatedData.licensePlate !== vehicle.licensePlate) {
        const existingVehicle = await prisma.vehicle.findUnique({
          where: { licensePlate: validatedData.licensePlate }
        });
        
        if (existingVehicle) {
          throw new ApiError(400, 'Já existe um veículo com esta placa.');
        }
      }
      
      // Se driverId foi fornecido, verificar se o motorista existe e pertence à mesma empresa
      if (validatedData.driverId !== undefined) {
        if (validatedData.driverId) {
          const driver = await prisma.driver.findUnique({
            where: { id: validatedData.driverId }
          });
          
          if (!driver) {
            throw new ApiError(404, 'Motorista não encontrado.');
          }
          
          if (driver.companyId !== vehicle.companyId) {
            throw new ApiError(400, 'O motorista deve pertencer à mesma empresa do veículo.');
          }
          
          if (!driver.isActive) {
            throw new ApiError(400, 'O motorista está inativo e não pode ser associado ao veículo.');
          }
        }
      }
      
      // Atualizar o veículo
      const updatedVehicle = await prisma.vehicle.update({
        where: { id },
        data: validatedData,
        include: {
          company: {
            select: {
              name: true
            }
          }
        }
      });
      
      // Log da ação
      logger.info(`Veículo atualizado: ${updatedVehicle.id}`, { 
        userId: req.user.id, 
        action: 'update_vehicle',
        vehicleId: updatedVehicle.id,
        licensePlate: updatedVehicle.licensePlate
      });
      
      return res.status(200).json(updatedVehicle);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Excluir um veículo (exclusão lógica)
   */
  deleteVehicle: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      // Verificar se o veículo existe
      const vehicle = await prisma.vehicle.findUnique({
        where: { id }
      });
      
      if (!vehicle) {
        throw new ApiError(404, 'Veículo não encontrado.');
      }
      
      // Verificar permissões - se não for admin, verificar se pertence à empresa do usuário
      if (req.user.role !== 'ADMIN' && req.user.companyId !== vehicle.companyId) {
        throw new ApiError(403, 'Acesso negado. Você só pode excluir veículos da sua empresa.');
      }
      
      // Verificar se há reservas ativas para este veículo
      const activeReservations = await prisma.reservation.count({
        where: {
          vehicleId: id,
          status: {
            in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS']
          }
        }
      });
      
      if (activeReservations > 0) {
        throw new ApiError(400, 'Não é possível excluir este veículo pois há reservas ativas associadas a ele.');
      }
      
      // Exclusão lógica - apenas marcar como inativo
      await prisma.vehicle.update({
        where: { id },
        data: { isActive: false }
      });
      
      // Log da ação
      logger.info(`Veículo excluído (lógico): ${id}`, { userId: req.user.id, action: 'delete_vehicle' });
      
      return res.status(200).json({ message: 'Veículo excluído com sucesso.' });
    } catch (error) {
      next(error);
    }
  }
};

export default vehicleController;
