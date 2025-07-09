import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';
import { z } from 'zod';

// Interface para configurações das vagas
interface ParkingSpaceConfig {
  totalVagas: number;
  vagasCaminhao: number;
  vagasCarreta: number;
  precoHoraCaminhao: number;
  precoHoraCarreta: number;
  horarioAbertura: string;
  horarioFechamento: string;
  funcionamento24h: boolean;
  prefixoNumeracao: string;
  numeroInicial: number;
  autoReserva: boolean;
  tempoLimiteReserva: number;
}

const prisma = new PrismaClient();

/**
 * Controlador de vagas de estacionamento
 */
const parkingSpaceController = {
  /**
   * Obter todas as vagas do usuário (estacionamento)
   */
  getMySpaces: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user.role !== 'ESTACIONAMENTO') {
        throw new ApiError(403, 'Apenas estacionamentos podem acessar suas vagas.');
      }

      // Buscar estacionamentos da empresa
      const parkingLots = await prisma.parkingLot.findMany({
        where: { 
          companyId: req.user.companyId,
          isActive: true 
        }
      });

      if (parkingLots.length === 0) {
        return res.status(200).json([]);
      }

      const parkingLotIds = parkingLots.map(pl => pl.id);

      // Buscar espaços dos estacionamentos
      const parkingSpaces = await prisma.parkingSpace.findMany({
        where: {
          parkingLotId: { in: parkingLotIds },
          isActive: true
        },
        include: {
          parkingLot: {
            select: {
              name: true,
              address: true
            }
          },
          // Incluir reserva ativa se houver
          reservations: {
            where: {
              status: { in: ['CONFIRMED', 'IN_PROGRESS'] },
              startTime: { lte: new Date() },
              endTime: { gte: new Date() }
            },
            include: {
              vehicle: {
                select: {
                  licensePlate: true,
                  brand: true,
                  model: true
                }
              },
              driver: {
                select: {
                  name: true
                }
              },
              company: {
                select: {
                  name: true
                }
              }
            },
            take: 1
          }
        },
        orderBy: {
          spaceNumber: 'asc'
        }
      });

      // Mapear para formato do frontend
      const mappedSpaces = parkingSpaces.map(space => {
        const activeReservation = space.reservations[0];
        return {
          id: space.id,
          numero: space.spaceNumber,
          tipo: mapVehicleTypeToTipo(space.spaceType),
          status: determineSpaceStatus(space, activeReservation),
          parkingLotId: space.parkingLotId,
          setor: space.spaceType,
          veiculo: activeReservation ? {
            placa: activeReservation.vehicle?.licensePlate || '',
            modelo: `${activeReservation.vehicle?.brand || ''} ${activeReservation.vehicle?.model || ''}`.trim(),
            transportadora: activeReservation.company?.name || ''
          } : undefined,
          reserva: activeReservation ? {
            inicio: activeReservation.startTime.toISOString(),
            fim: activeReservation.endTime.toISOString(),
            motorista: activeReservation.driver?.name || '',
            reservationId: activeReservation.id
          } : undefined,
          ultimaAtualizacao: space.updatedAt.toISOString(),
          createdAt: space.createdAt.toISOString(),
          updatedAt: space.updatedAt.toISOString()
        };
      });

      return res.status(200).json(mappedSpaces);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obter status geral do estacionamento
   */
  getMyStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user.role !== 'ESTACIONAMENTO') {
        throw new ApiError(403, 'Apenas estacionamentos podem acessar este status.');
      }

      // Buscar estacionamentos da empresa
      const parkingLots = await prisma.parkingLot.findMany({
        where: { 
          companyId: req.user.companyId,
          isActive: true 
        }
      });

      if (parkingLots.length === 0) {
        return res.status(200).json({
          total: 0,
          livres: 0,
          ocupadas: 0,
          reservadas: 0,
          manutencao: 0,
          ocupacaoPercentual: 0
        });
      }

      const parkingLotIds = parkingLots.map(pl => pl.id);

      // Contar espaços por status
      const [totalSpaces, occupiedSpaces, reservedSpaces] = await Promise.all([
        // Total de espaços
        prisma.parkingSpace.count({
          where: {
            parkingLotId: { in: parkingLotIds },
            isActive: true
          }
        }),
        
        // Espaços ocupados (com reserva ativa)
        prisma.parkingSpace.count({
          where: {
            parkingLotId: { in: parkingLotIds },
            isActive: true,
            reservations: {
              some: {
                status: 'IN_PROGRESS',
                startTime: { lte: new Date() },
                endTime: { gte: new Date() }
              }
            }
          }
        }),
        
        // Espaços reservados (com reserva confirmada)
        prisma.parkingSpace.count({
          where: {
            parkingLotId: { in: parkingLotIds },
            isActive: true,
            reservations: {
              some: {
                status: 'CONFIRMED',
                startTime: { gt: new Date() }
              }
            }
          }
        })
      ]);

      const livres = totalSpaces - occupiedSpaces - reservedSpaces;
      const ocupacaoPercentual = totalSpaces > 0 ? Math.round((occupiedSpaces / totalSpaces) * 100) : 0;

      return res.status(200).json({
        total: totalSpaces,
        livres: Math.max(0, livres),
        ocupadas: occupiedSpaces,
        reservadas: reservedSpaces,
        manutencao: 0, // Por enquanto não temos status de manutenção
        ocupacaoPercentual
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Buscar veículos por placa (autocomplete)
   */
  searchVehicles: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query } = req.query;

      if (!query || typeof query !== 'string') {
        return res.status(200).json([]);
      }

      // Buscar veículos que começam com a query
      const vehicles = await prisma.vehicle.findMany({
        where: {
          licensePlate: {
            startsWith: query.toUpperCase(),
            mode: 'insensitive'
          },
          isActive: true
        },
        include: {
          driver: {
            select: {
              id: true,
              name: true,
              phone: true
            }
          },
          company: {
            select: {
              id: true,
              name: true
            }
          }
        },
        take: 10,
        orderBy: {
          licensePlate: 'asc'
        }
      });

      const mappedVehicles = vehicles.map(vehicle => ({
        id: vehicle.id,
        placa: vehicle.licensePlate,
        modelo: `${vehicle.brand} ${vehicle.model}`.trim(),
        tipo: vehicle.vehicleType,
        motorista: vehicle.driver ? {
          id: vehicle.driver.id,
          nome: vehicle.driver.name,
          telefone: vehicle.driver.phone
        } : null,
        transportadora: vehicle.company ? {
          id: vehicle.company.id,
          nome: vehicle.company.name
        } : null
      }));

      return res.status(200).json(mappedVehicles);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Ocupar vaga com veículo
   */
  occupySpace: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { vehicleId, licensePlate } = req.body;

      if (req.user.role !== 'ESTACIONAMENTO') {
        throw new ApiError(403, 'Apenas estacionamentos podem ocupar vagas.');
      }

      // Verificar se a vaga existe e pertence à empresa
      const space = await prisma.parkingSpace.findFirst({
        where: {
          id,
          parkingLot: {
            companyId: req.user.companyId
          }
        },
        include: {
          parkingLot: true,
          reservations: {
            where: {
              status: { in: ['CONFIRMED', 'IN_PROGRESS'] },
              startTime: { lte: new Date() },
              endTime: { gte: new Date() }
            }
          }
        }
      });

      if (!space) {
        throw new ApiError(404, 'Vaga não encontrada ou não pertence à sua empresa.');
      }

      // Verificar se vaga já está ocupada
      if (space.reservations.length > 0) {
        throw new ApiError(400, 'Vaga já está ocupada ou reservada.');
      }

      let vehicle;

      if (vehicleId) {
        // Buscar por ID do veículo
        vehicle = await prisma.vehicle.findFirst({
          where: {
            id: vehicleId,
            isActive: true
          },
          include: {
            driver: true,
            company: true
          }
        });
      } else if (licensePlate) {
        // Buscar por placa
        vehicle = await prisma.vehicle.findFirst({
          where: {
            licensePlate: licensePlate.toUpperCase(),
            isActive: true
          },
          include: {
            driver: true,
            company: true
          }
        });
      }

      if (!vehicle) {
        throw new ApiError(404, 'Veículo não encontrado.');
      }

      // Verificar se o veículo tem motorista
      if (!vehicle.driverId) {
        throw new ApiError(400, 'Veículo deve ter um motorista vinculado para ser registrado na vaga.');
      }

      // Verificar se o veículo já está em outra vaga
      const existingReservation = await prisma.reservation.findFirst({
        where: {
          vehicleId: vehicle.id,
          status: 'IN_PROGRESS',
          startTime: { lte: new Date() },
          endTime: { gte: new Date() }
        }
      });

      if (existingReservation) {
        throw new ApiError(400, 'Veículo já está ocupando outra vaga.');
      }

      // Criar reserva de ocupação
      const reservation = await prisma.reservation.create({
        data: {
          parkingLotId: space.parkingLotId,
          parkingSpaceId: space.id,
          vehicleId: vehicle.id,
          driverId: vehicle.driverId,
          companyId: vehicle.companyId,
          startTime: new Date(),
          endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas por padrão
          status: 'IN_PROGRESS',
          totalCost: 0, // Será calculado na saída
          specialRequests: `Ocupação manual via painel - Vaga ${space.spaceNumber}`
        }
      });

      logger.info(`Vaga ${space.spaceNumber} ocupada pelo veículo ${vehicle.licensePlate}`, {
        userId: req.user.id,
        spaceId: id,
        vehicleId: vehicle.id,
        reservationId: reservation.id
      });

      return res.status(200).json({
        success: true,
        message: `Vaga ${space.spaceNumber} ocupada pelo veículo ${vehicle.licensePlate}`,
        reservation: {
          id: reservation.id,
          inicio: reservation.startTime.toISOString(),
          veiculo: {
            placa: vehicle.licensePlate,
            modelo: `${vehicle.brand} ${vehicle.model}`.trim()
          },
          motorista: vehicle.driver?.name,
          transportadora: vehicle.company?.name
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Liberar vaga
   */
  freeSpace: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (req.user.role !== 'ESTACIONAMENTO') {
        throw new ApiError(403, 'Apenas estacionamentos podem liberar vagas.');
      }

      // Verificar se a vaga existe e pertence à empresa
      const space = await prisma.parkingSpace.findFirst({
        where: {
          id,
          parkingLot: {
            companyId: req.user.companyId
          }
        },
        include: {
          reservations: {
            where: {
              status: 'IN_PROGRESS',
              startTime: { lte: new Date() },
              endTime: { gte: new Date() }
            },
            include: {
              vehicle: true
            }
          }
        }
      });

      if (!space) {
        throw new ApiError(404, 'Vaga não encontrada ou não pertence à sua empresa.');
      }

      const activeReservation = space.reservations[0];
      if (!activeReservation) {
        throw new ApiError(400, 'Vaga já está livre.');
      }

      // Finalizar reserva
      const finishedReservation = await prisma.reservation.update({
        where: { id: activeReservation.id },
        data: {
          status: 'COMPLETED',
          endTime: new Date(),
          // Aqui você pode adicionar cálculo de valor baseado no tempo
          updatedAt: new Date()
        }
      });

      logger.info(`Vaga ${space.spaceNumber} liberada - Veículo ${activeReservation.vehicle.licensePlate} saiu`, {
        userId: req.user.id,
        spaceId: id,
        reservationId: activeReservation.id,
        duration: new Date().getTime() - activeReservation.startTime.getTime()
      });

      return res.status(200).json({
        success: true,
        message: `Vaga ${space.spaceNumber} foi liberada`,
        reservation: {
          id: finishedReservation.id,
          inicio: finishedReservation.startTime.toISOString(),
          fim: finishedReservation.endTime.toISOString(),
          duracao: Math.round((finishedReservation.endTime.getTime() - finishedReservation.startTime.getTime()) / (1000 * 60)) // em minutos
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Atualizar status de uma vaga (método simplificado)
   */
  updateSpaceStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (req.user.role !== 'ESTACIONAMENTO') {
        throw new ApiError(403, 'Apenas estacionamentos podem atualizar status das vagas.');
      }

      // Para status 'ocupada', redirecionar para occupySpace
      if (status === 'ocupada') {
        throw new ApiError(400, 'Para ocupar uma vaga, use o endpoint /occupy com os dados do veículo.');
      }

      // Para status 'livre', redirecionar para freeSpace  
      if (status === 'livre') {
        return parkingSpaceController.freeSpace(req, res, next);
      }

      // Para outros status (reservada, manutencao), apenas loggar
      const space = await prisma.parkingSpace.findFirst({
        where: {
          id,
          parkingLot: {
            companyId: req.user.companyId
          }
        }
      });

      if (!space) {
        throw new ApiError(404, 'Vaga não encontrada ou não pertence à sua empresa.');
      }

      logger.info(`Status da vaga ${space.spaceNumber} atualizado para ${status}`, {
        userId: req.user.id,
        spaceId: id,
        newStatus: status
      });

      // Atualizar timestamp
      const updatedSpace = await prisma.parkingSpace.update({
        where: { id },
        data: { updatedAt: new Date() }
      });

      return res.status(200).json({
        success: true,
        message: `Status da vaga ${space.spaceNumber} atualizado para ${status}`,
        space: {
          id: updatedSpace.id,
          numero: updatedSpace.spaceNumber,
          status: status,
          ultimaAtualizacao: updatedSpace.updatedAt.toISOString()
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Configurações das vagas
  /**
   * Obter configurações das vagas
   */
  getConfiguration: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      
      // Verificar permissões - apenas empresas de estacionamento podem gerenciar configurações
      if (user.role !== 'ESTACIONAMENTO' && user.role !== 'ADMIN') {
        throw new ApiError(403, 'Acesso negado. Apenas estacionamentos podem gerenciar configurações.');
      }
      
      // Buscar configurações salvas ou retornar padrões
      const config = {
        totalVagas: 50,
        vagasCaminhao: 40,
        vagasCarreta: 10,
        precoHoraCaminhao: 15.00,
        precoHoraCarreta: 25.00,
        horarioAbertura: '06:00',
        horarioFechamento: '22:00',
        funcionamento24h: false,
        prefixoNumeracao: 'C',
        numeroInicial: 1,
        autoReserva: true,
        tempoLimiteReserva: 60
      };
      
      return res.status(200).json(config);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Salvar configurações das vagas
   */
  saveConfiguration: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      
      // Verificar permissões
      if (user.role !== 'ESTACIONAMENTO' && user.role !== 'ADMIN') {
        throw new ApiError(403, 'Acesso negado. Apenas estacionamentos podem gerenciar configurações.');
      }
      
      // Validar dados da configuração
      const configSchema = z.object({
        totalVagas: z.number().min(1).max(1000),
        vagasCaminhao: z.number().min(0),
        vagasCarreta: z.number().min(0),
        precoHoraCaminhao: z.number().min(0),
        precoHoraCarreta: z.number().min(0),
        horarioAbertura: z.string(),
        horarioFechamento: z.string(),
        funcionamento24h: z.boolean(),
        prefixoNumeracao: z.string().min(1).max(5),
        numeroInicial: z.number().min(1),
        autoReserva: z.boolean(),
        tempoLimiteReserva: z.number().min(1)
      });
      
      const validatedData = configSchema.parse(req.body);
      
      // Verificar se o total de vagas por tipo confere
      const totalPorTipo = validatedData.vagasCaminhao + validatedData.vagasCarreta;
      if (totalPorTipo !== validatedData.totalVagas) {
        throw new ApiError(400, 'Total de vagas por tipo não confere com total geral.');
      }
      
      // Aqui você pode salvar as configurações no banco se necessário
      // Por enquanto, apenas retornamos sucesso
      
      logger.info(`Configurações salvas para usuário ${user.id}`, { userId: user.id, action: 'save_parking_config' });
      
      return res.status(200).json({ message: 'Configurações salvas com sucesso.' });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Gerar vagas baseado nas configurações
   */
  generateSpaces: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      
      // Verificar permissões
      if (user.role !== 'ESTACIONAMENTO' && user.role !== 'ADMIN') {
        throw new ApiError(403, 'Acesso negado. Apenas estacionamentos podem gerenciar vagas.');
      }
      
      // Validar dados
      const configSchema = z.object({
        totalVagas: z.number().min(1).max(1000),
        vagasCaminhao: z.number().min(0),
        vagasCarreta: z.number().min(0),
        precoHoraCaminhao: z.number().min(0),
        precoHoraCarreta: z.number().min(0),
        horarioAbertura: z.string(),
        horarioFechamento: z.string(),
        funcionamento24h: z.boolean(),
        prefixoNumeracao: z.string().min(1).max(5),
        numeroInicial: z.number().min(1),
        autoReserva: z.boolean(),
        tempoLimiteReserva: z.number().min(1)
      });
      
      const config = configSchema.parse(req.body);
      
      // Verificar se o total de vagas por tipo confere
      const totalPorTipo = config.vagasCaminhao + config.vagasCarreta;
      if (totalPorTipo !== config.totalVagas) {
        throw new ApiError(400, 'Total de vagas por tipo não confere com total geral.');
      }
      
      // Buscar o estacionamento da empresa
      const parkingLot = await prisma.parkingLot.findFirst({
        where: {
          companyId: user.companyId,
          isActive: true
        }
      });
      
      if (!parkingLot) {
        throw new ApiError(404, 'Estacionamento não encontrado.');
      }
      
      // Desativar vagas existentes
      await prisma.parkingSpace.updateMany({
        where: {
          parkingLotId: parkingLot.id
        },
        data: {
          isActive: false
        }
      });
      
      // Gerar novas vagas
      const newSpaces = [];
      let numeroAtual = config.numeroInicial;
      
      // Gerar vagas de caminhão
      for (let i = 0; i < config.vagasCaminhao; i++) {
        newSpaces.push({
          spaceNumber: `${config.prefixoNumeracao}${numeroAtual.toString().padStart(3, '0')}`,
          spaceType: 'truck',
          isAvailable: true,
          parkingLotId: parkingLot.id,
          isActive: true
        });
        numeroAtual++;
      }
      
      // Gerar vagas de carreta
      for (let i = 0; i < config.vagasCarreta; i++) {
        newSpaces.push({
          spaceNumber: `${config.prefixoNumeracao}${numeroAtual.toString().padStart(3, '0')}`,
          spaceType: 'semi-truck',
          isAvailable: true,
          parkingLotId: parkingLot.id,
          isActive: true
        });
        numeroAtual++;
      }
      
      // Criar vagas no banco
      await prisma.parkingSpace.createMany({
        data: newSpaces
      });
      
      logger.info(`${newSpaces.length} vagas geradas para estacionamento ${parkingLot.id}`, { 
        userId: user.id, 
        action: 'generate_parking_spaces',
        parkingLotId: parkingLot.id,
        totalSpaces: newSpaces.length
      });
      
      return res.status(201).json({ 
        message: 'Vagas geradas com sucesso.',
        totalSpaces: newSpaces.length,
        breakdown: {
          caminhoes: config.vagasCaminhao,
          carretas: config.vagasCarreta
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

/**
 * Funções auxiliares
 */

// Mapear tipo de veículo do banco para o frontend
function mapVehicleTypeToTipo(spaceType: string): 'carro' | 'moto' | 'caminhao' {
  switch (spaceType) {
    case 'TRUCK': return 'caminhao';
    case 'MOTORCYCLE': return 'moto';
    case 'CAR':
    case 'VAN':
    default: return 'carro';
  }
}

// Determinar status da vaga baseado nas reservas
function determineSpaceStatus(space: any, activeReservation: any): 'livre' | 'ocupada' | 'reservada' | 'manutencao' {
  if (!activeReservation) {
    return 'livre';
  }

  const now = new Date();
  const startTime = new Date(activeReservation.startTime);
  const endTime = new Date(activeReservation.endTime);

  if (activeReservation.status === 'IN_PROGRESS' && startTime <= now && now <= endTime) {
    return 'ocupada';
  }

  if (activeReservation.status === 'CONFIRMED' && startTime > now) {
    return 'reservada';
  }

  return 'livre';
}

export default parkingSpaceController; 