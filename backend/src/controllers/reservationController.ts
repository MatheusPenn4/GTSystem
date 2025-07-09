import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';
import { createReservationSchema, updateReservationSchema } from '../validators/reservationValidator';

// Enums para status de reserva e pagamento (compatíveis com o schema do Prisma)
enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED'
}

const prisma = new PrismaClient();

/**
 * Controlador de reservas
 */
const reservationController = {
  /**
   * Obter todas as reservas
   */
  getAllReservations: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { parkingLotId, vehicleId, driverId, status, startDate, endDate } = req.query;
      
      // Construir filtros
      const where: any = {};
      
      // Filtrar por estacionamento
      if (parkingLotId) {
        where.parkingLotId = parkingLotId.toString();
      }
      
      // Filtrar por veículo
      if (vehicleId) {
        where.vehicleId = vehicleId.toString();
      }
      
      // Filtrar por motorista
      if (driverId) {
        where.driverId = driverId.toString();
      }
      
      // Filtrar por status
      if (status) {
        where.status = status.toString();
      }
      
      // Filtrar por período
      if (startDate || endDate) {
        where.OR = [];
        
        if (startDate && endDate) {
          // Reservas que ocorrem dentro do período especificado
          where.OR.push({
            AND: [
              { startTime: { gte: new Date(startDate.toString()) } },
              { endTime: { lte: new Date(endDate.toString()) } }
            ]
          });
          
          // Reservas que começam antes e terminam dentro do período
          where.OR.push({
            AND: [
              { startTime: { lt: new Date(startDate.toString()) } },
              { endTime: { gt: new Date(startDate.toString()) } },
              { endTime: { lte: new Date(endDate.toString()) } }
            ]
          });
          
          // Reservas que começam dentro e terminam depois do período
          where.OR.push({
            AND: [
              { startTime: { gte: new Date(startDate.toString()) } },
              { startTime: { lt: new Date(endDate.toString()) } },
              { endTime: { gt: new Date(endDate.toString()) } }
            ]
          });
          
          // Reservas que englobam todo o período
          where.OR.push({
            AND: [
              { startTime: { lt: new Date(startDate.toString()) } },
              { endTime: { gt: new Date(endDate.toString()) } }
            ]
          });
        } else if (startDate) {
          where.endTime = { gte: new Date(startDate.toString()) };
        } else if (endDate) {
          where.startTime = { lte: new Date(endDate.toString()) };
        }
      }
      
      // Verificar permissões - filtrar por empresa do usuário
      if (req.user.role !== 'ADMIN') {
        if (req.user.role === 'TRANSPORTADORA') {
          where.companyId = req.user.companyId;
        } else if (req.user.role === 'ESTACIONAMENTO') {
          where.parkingLot = {
            companyId: req.user.companyId
          };
        }
      }
      
      const reservations = await prisma.reservation.findMany({
        where,
        orderBy: {
          startTime: 'desc',
        },
        include: {
          parkingLot: {
            select: {
              name: true,
              address: true
            }
          },
          parkingSpace: {
            select: {
              spaceNumber: true,
              spaceType: true
            }
          },
          vehicle: {
            select: {
              licensePlate: true,
              brand: true,
              model: true
            }
          },
          driver: {
            select: {
              name: true,
              phone: true
            }
          },
          company: {
            select: {
              name: true
            }
          }
        }
      });
      
      return res.status(200).json(reservations);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Criar uma nova reserva
   */
  createReservation: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validar dados
      const validatedData = createReservationSchema.parse(req.body);
      
      // Converter strings de data para objetos Date
      const startTime = new Date(validatedData.startTime);
      const endTime = new Date(validatedData.endTime);
      
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
        throw new ApiError(400, 'Apenas empresas do tipo transportadora podem fazer reservas.');
      }
      
      // Verificar se o estacionamento existe e está ativo
      const parkingLot = await prisma.parkingLot.findUnique({
        where: { 
          id: validatedData.parkingLotId,
          isActive: true
        }
      });
      
      if (!parkingLot) {
        throw new ApiError(404, 'Estacionamento não encontrado ou inativo.');
      }
      
      // Verificar se o veículo existe, está ativo e pertence à empresa
      const vehicle = await prisma.vehicle.findFirst({
        where: { 
          id: validatedData.vehicleId,
          isActive: true,
          companyId
        }
      });
      
      if (!vehicle) {
        throw new ApiError(404, 'Veículo não encontrado, inativo ou não pertence à sua empresa.');
      }
      
      // Verificar se o motorista existe, está ativo e pertence à empresa
      const driver = await prisma.driver.findFirst({
        where: { 
          id: validatedData.driverId,
          isActive: true,
          companyId
        }
      });
      
      if (!driver) {
        throw new ApiError(404, 'Motorista não encontrado, inativo ou não pertence à sua empresa.');
      }
      
      // Verificar se o veículo já tem reserva para o período
      const existingVehicleReservation = await prisma.reservation.findFirst({
        where: {
          vehicleId: validatedData.vehicleId,
          status: {
            in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS']
          },
          OR: [
            {
              AND: [
                { startTime: { lte: startTime } },
                { endTime: { gt: startTime } }
              ]
            },
            {
              AND: [
                { startTime: { lt: endTime } },
                { endTime: { gte: endTime } }
              ]
            },
            {
              AND: [
                { startTime: { gte: startTime } },
                { endTime: { lte: endTime } }
              ]
            }
          ]
        }
      });
      
      if (existingVehicleReservation) {
        throw new ApiError(400, 'O veículo já possui uma reserva para este período.');
      }
      
      // Verificar se o motorista já tem reserva para o período
      const existingDriverReservation = await prisma.reservation.findFirst({
        where: {
          driverId: validatedData.driverId,
          status: {
            in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS']
          },
          OR: [
            {
              AND: [
                { startTime: { lte: startTime } },
                { endTime: { gt: startTime } }
              ]
            },
            {
              AND: [
                { startTime: { lt: endTime } },
                { endTime: { gte: endTime } }
              ]
            },
            {
              AND: [
                { startTime: { gte: startTime } },
                { endTime: { lte: endTime } }
              ]
            }
          ]
        }
      });
      
      if (existingDriverReservation) {
        throw new ApiError(400, 'O motorista já possui uma reserva para este período.');
      }
      
      // Se uma vaga específica foi solicitada, verificar disponibilidade
      let parkingSpaceId = validatedData.parkingSpaceId;
      
      if (parkingSpaceId) {
        // Verificar se a vaga existe, está ativa e pertence ao estacionamento
        const parkingSpace = await prisma.parkingSpace.findFirst({
          where: { 
            id: parkingSpaceId,
            isActive: true,
            isAvailable: true,
            parkingLotId: validatedData.parkingLotId
          }
        });
        
        if (!parkingSpace) {
          throw new ApiError(404, 'Vaga não encontrada, indisponível ou não pertence a este estacionamento.');
        }
        
        // Verificar se a vaga já está reservada para o período
        const existingSpaceReservation = await prisma.reservation.findFirst({
          where: {
            parkingSpaceId,
            status: {
              in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS']
            },
            OR: [
              {
                AND: [
                  { startTime: { lte: startTime } },
                  { endTime: { gt: startTime } }
                ]
              },
              {
                AND: [
                  { startTime: { lt: endTime } },
                  { endTime: { gte: endTime } }
                ]
              },
              {
                AND: [
                  { startTime: { gte: startTime } },
                  { endTime: { lte: endTime } }
                ]
              }
            ]
          }
        });
        
        if (existingSpaceReservation) {
          throw new ApiError(400, 'Esta vaga já está reservada para o período solicitado.');
        }
      }
      
      // Calcular preço estimado
      const durationInHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      const totalCost = parseFloat((durationInHours * Number(parkingLot.pricePerHour)).toFixed(2));
      
      // Criar a reserva
      const reservation = await prisma.reservation.create({
        data: {
          parkingLotId: validatedData.parkingLotId,
          parkingSpaceId,
          companyId,
          vehicleId: validatedData.vehicleId,
          driverId: validatedData.driverId,
          startTime,
          endTime,
          status: 'PENDING' as ReservationStatus,
          totalCost,
          paymentStatus: 'PENDING' as PaymentStatus,
          specialRequests: validatedData.specialRequests
        }
      });
      
      // Log da ação
      logger.info(`Reserva criada: ${reservation.id}`, { userId: req.user.id, action: 'create_reservation' });
      
      return res.status(201).json(reservation);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obter uma reserva específica
   */
  getReservationById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      const reservation = await prisma.reservation.findUnique({
        where: { id },
        include: {
          parkingLot: true,
          parkingSpace: true,
          vehicle: true,
          driver: true,
          company: {
            select: {
              name: true,
              phone: true,
              email: true
            }
          },
          transactions: true
        }
      });
      
      if (!reservation) {
        throw new ApiError(404, 'Reserva não encontrada.');
      }
      
      // Verificar permissões - se não for admin, verificar acesso
      if (req.user.role !== 'ADMIN') {
        const hasAccess = 
          (req.user.role === 'TRANSPORTADORA' && req.user.companyId === reservation.companyId) ||
          (req.user.role === 'ESTACIONAMENTO' && await checkParkingLotBelongsToCompany(reservation.parkingLotId, req.user.companyId));
        
        if (!hasAccess) {
          throw new ApiError(403, 'Acesso negado. Você não tem permissão para visualizar esta reserva.');
        }
      }
      
      return res.status(200).json(reservation);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Atualizar uma reserva
   */
  updateReservation: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      // Verificar se a reserva existe
      const reservation = await prisma.reservation.findUnique({
        where: { id },
        include: {
          parkingLot: true
        }
      });
      
      if (!reservation) {
        throw new ApiError(404, 'Reserva não encontrada.');
      }
      
      // Verificar permissões
      if (req.user.role !== 'ADMIN') {
        const hasAccess = 
          (req.user.role === 'TRANSPORTADORA' && req.user.companyId === reservation.companyId) ||
          (req.user.role === 'ESTACIONAMENTO' && await checkParkingLotBelongsToCompany(reservation.parkingLotId, req.user.companyId));
        
        if (!hasAccess) {
          throw new ApiError(403, 'Acesso negado. Você não tem permissão para atualizar esta reserva.');
        }
        
        // Transportadora só pode atualizar reservas pendentes
        if (req.user.role === 'TRANSPORTADORA' && reservation.status !== 'PENDING') {
          throw new ApiError(403, 'Você só pode modificar reservas que estejam pendentes.');
        }
        
        // Estacionamento tem restrições no que pode atualizar
        if (req.user.role === 'ESTACIONAMENTO') {
          // Apenas status, chegada e saída
          const allowedFields = ['status', 'actualArrival', 'actualDeparture'];
          const requestedFields = Object.keys(req.body);
          
          const hasInvalidFields = requestedFields.some(field => !allowedFields.includes(field));
          
          if (hasInvalidFields) {
            throw new ApiError(403, 'Você só pode atualizar o status e os horários de chegada/saída.');
          }
          
          // Verificar transições de status permitidas
          if (req.body.status) {
            const validTransitions: Record<string, string[]> = {
              'PENDING': ['CONFIRMED', 'CANCELLED'],
              'CONFIRMED': ['IN_PROGRESS', 'CANCELLED'],
              'IN_PROGRESS': ['COMPLETED', 'CANCELLED']
            };
            
            if (!validTransitions[reservation.status]?.includes(req.body.status)) {
              throw new ApiError(400, `Não é possível alterar o status de ${reservation.status} para ${req.body.status}.`);
            }
          }
        }
      }
      
      // Validar dados
      const validatedData = updateReservationSchema.parse(req.body);
      
      // Preparar dados para atualização
      const updateData: any = { ...validatedData };
      
      // Converter strings de data para objetos Date, se fornecidos
      if (updateData.startTime) updateData.startTime = new Date(updateData.startTime);
      if (updateData.endTime) updateData.endTime = new Date(updateData.endTime);
      if (updateData.actualArrival) updateData.actualArrival = new Date(updateData.actualArrival);
      if (updateData.actualDeparture) updateData.actualDeparture = new Date(updateData.actualDeparture);
      
      // Se houver mudança de período, recalcular o custo
      if (updateData.startTime || updateData.endTime) {
        const startTime = updateData.startTime || reservation.startTime;
        const endTime = updateData.endTime || reservation.endTime;
        
        const durationInHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
        updateData.totalCost = parseFloat((durationInHours * Number(reservation.parkingLot.pricePerHour)).toFixed(2));
      }
      
      // Se for alteração de status para COMPLETED, e não tiver actualDeparture, setar como agora
      if (updateData.status === 'COMPLETED' && !updateData.actualDeparture && !reservation.actualDeparture) {
        updateData.actualDeparture = new Date();
      }
      
      // Se for alteração de status para IN_PROGRESS, e não tiver actualArrival, setar como agora
      if (updateData.status === 'IN_PROGRESS' && !updateData.actualArrival && !reservation.actualArrival) {
        updateData.actualArrival = new Date();
      }
      
      // Atualizar a reserva
      const updatedReservation = await prisma.reservation.update({
        where: { id },
        data: updateData,
        include: {
          parkingLot: true,
          parkingSpace: true,
          vehicle: true,
          driver: true,
          company: {
            select: {
              name: true,
              phone: true,
              email: true
            }
          }
        }
      });
      
      // Log da ação
      logger.info(`Reserva atualizada: ${id}`, { userId: req.user.id, action: 'update_reservation' });
      
      return res.status(200).json(updatedReservation);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Cancelar uma reserva
   */
  cancelReservation: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      // Verificar se a reserva existe
      const reservation = await prisma.reservation.findUnique({
        where: { id }
      });
      
      if (!reservation) {
        throw new ApiError(404, 'Reserva não encontrada.');
      }
      
      // Verificar permissões
      if (req.user.role !== 'ADMIN') {
        const hasAccess = 
          (req.user.role === 'TRANSPORTADORA' && req.user.companyId === reservation.companyId) ||
          (req.user.role === 'ESTACIONAMENTO' && await checkParkingLotBelongsToCompany(reservation.parkingLotId, req.user.companyId));
        
        if (!hasAccess) {
          throw new ApiError(403, 'Acesso negado. Você não tem permissão para cancelar esta reserva.');
        }
      }
      
      // Verificar se a reserva pode ser cancelada
      if (reservation.status === 'COMPLETED' || reservation.status === 'CANCELLED') {
        throw new ApiError(400, `Não é possível cancelar uma reserva com status ${reservation.status}.`);
      }
      
      // Cancelar a reserva
      const cancelledReservation = await prisma.reservation.update({
        where: { id },
        data: { 
          status: 'CANCELLED' as ReservationStatus
        }
      });
      
      // Log da ação
      logger.info(`Reserva cancelada: ${id}`, { userId: req.user.id, action: 'cancel_reservation' });
      
      return res.status(200).json({ 
        message: 'Reserva cancelada com sucesso.',
        reservation: cancelledReservation
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Listar reservas da transportadora
   */
  getCompanyReservations: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verificar permissões
      if (req.user.role !== 'ADMIN' && req.user.role !== 'TRANSPORTADORA') {
        throw new ApiError(403, 'Acesso negado. Apenas administradores ou transportadoras podem acessar estas reservas.');
      }
      
      const { status, startDate, endDate } = req.query;
      
      // Construir filtros
      const where: any = {};
      
      // Filtrar por status
      if (status) {
        where.status = status.toString();
      }
      
      // Filtrar por período
      if (startDate) {
        where.startTime = { gte: new Date(startDate.toString()) };
      }
      
      if (endDate) {
        where.endTime = { lte: new Date(endDate.toString()) };
      }
      
      // Se não for admin, filtrar pela empresa do usuário
      if (req.user.role !== 'ADMIN') {
        where.companyId = req.user.companyId;
      } else if (req.query.companyId) {
        where.companyId = req.query.companyId.toString();
      }
      
      const reservations = await prisma.reservation.findMany({
        where,
        orderBy: {
          startTime: 'desc',
        },
        include: {
          parkingLot: {
            select: {
              name: true,
              address: true
            }
          },
          parkingSpace: {
            select: {
              spaceNumber: true,
              spaceType: true
            }
          },
          vehicle: {
            select: {
              licensePlate: true,
              brand: true,
              model: true
            }
          },
          driver: {
            select: {
              name: true,
              phone: true
            }
          }
        }
      });
      
      return res.status(200).json(reservations);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Listar reservas do estacionamento
   */
  getParkingLotReservations: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verificar permissões
      if (req.user.role !== 'ADMIN' && req.user.role !== 'ESTACIONAMENTO') {
        throw new ApiError(403, 'Acesso negado. Apenas administradores ou estacionamentos podem acessar estas reservas.');
      }
      
      const { parkingLotId, status, startDate, endDate } = req.query;
      
      // Construir filtros
      const where: any = {};
      
      // Filtrar por estacionamento
      if (parkingLotId) {
        where.parkingLotId = parkingLotId.toString();
        
        // Verificar se o estacionamento pertence à empresa do usuário
        if (req.user.role === 'ESTACIONAMENTO') {
          const hasAccess = await checkParkingLotBelongsToCompany(parkingLotId.toString(), req.user.companyId);
          
          if (!hasAccess) {
            throw new ApiError(403, 'Acesso negado. Este estacionamento não pertence à sua empresa.');
          }
        }
      } else if (req.user.role === 'ESTACIONAMENTO') {
        // Se não for especificado um estacionamento, listar de todos da empresa
        where.parkingLot = {
          companyId: req.user.companyId
        };
      }
      
      // Filtrar por status
      if (status) {
        where.status = status.toString();
      }
      
      // Filtrar por período
      if (startDate) {
        where.startTime = { gte: new Date(startDate.toString()) };
      }
      
      if (endDate) {
        where.endTime = { lte: new Date(endDate.toString()) };
      }
      
      const reservations = await prisma.reservation.findMany({
        where,
        orderBy: {
          startTime: 'desc',
        },
        include: {
          company: {
            select: {
              name: true,
              phone: true
            }
          },
          parkingLot: {
            select: {
              name: true,
              address: true
            }
          },
          parkingSpace: {
            select: {
              spaceNumber: true,
              spaceType: true
            }
          },
          vehicle: {
            select: {
              licensePlate: true,
              brand: true,
              model: true,
              vehicleType: true
            }
          },
          driver: {
            select: {
              name: true,
              phone: true
            }
          }
        }
      });
      
      return res.status(200).json(reservations);
    } catch (error) {
      next(error);
    }
  }
};

/**
 * Verificar se um estacionamento pertence a uma empresa
 */
async function checkParkingLotBelongsToCompany(parkingLotId: string, companyId?: string): Promise<boolean> {
  if (!companyId) return false;
  
  const parkingLot = await prisma.parkingLot.findUnique({
    where: { id: parkingLotId }
  });
  
  return parkingLot?.companyId === companyId;
}

export default reservationController;
