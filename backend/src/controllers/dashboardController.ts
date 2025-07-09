import { Request, Response, NextFunction } from 'express';
import { PrismaClient, ReservationStatus, PaymentStatus } from '@prisma/client';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';
import { dashboardFilterSchema } from '../validators/dashboardValidator';

const prisma = new PrismaClient();

/**
 * Controlador de dashboard e métricas
 */
const dashboardController = {
  /**
   * Dashboard para administradores
   * Contém métricas gerais do sistema
   */
  getAdminDashboard: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verificar se o usuário é admin
      if (req.user.role !== 'ADMIN') {
        throw new ApiError(403, 'Acesso negado. Apenas administradores podem acessar este dashboard.');
      }

      // Obter parâmetros de filtro
      const { startDate, endDate, groupBy } = dashboardFilterSchema.parse(req.query);

      // Definir datas de início e fim para filtro
      const dateFilter: any = {};
      if (startDate) {
        dateFilter.gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.lte = new Date(endDate);
      }

      // Obter contagens gerais
      const [
        totalUsers,
        totalCompanies,
        totalParkingLots,
        totalReservations,
        activeReservations,
        completedReservations,
        totalRevenue,
        transportadoras,
        estacionamentos
      ] = await Promise.all([
        // Contagem de usuários ativos
        prisma.user.count({
          where: { isActive: true }
        }),

        // Contagem de empresas ativas
        prisma.company.count({
          where: { isActive: true }
        }),

        // Contagem de estacionamentos
        prisma.parkingLot.count({
          where: { isActive: true }
        }),

        // Total de reservas no período
        prisma.reservation.count({
          where: {
            createdAt: dateFilter
          }
        }),

        // Reservas ativas (pendentes, confirmadas ou em progresso)
        prisma.reservation.count({
          where: {
            status: {
              in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS']
            },
            createdAt: dateFilter
          }
        }),

        // Reservas concluídas
        prisma.reservation.count({
          where: {
            status: 'COMPLETED',
            createdAt: dateFilter
          }
        }),

        // Receita total do período (soma do total_cost das reservas concluídas)
        prisma.reservation.aggregate({
          where: {
            status: 'COMPLETED',
            paymentStatus: 'PAID',
            createdAt: dateFilter
          },
          _sum: {
            totalCost: true
          }
        }),

        // Contagem de transportadoras
        prisma.company.count({
          where: {
            companyType: 'TRANSPORTADORA',
            isActive: true
          }
        }),

        // Contagem de estacionamentos
        prisma.company.count({
          where: {
            companyType: 'ESTACIONAMENTO',
            isActive: true
          }
        })
      ]);

      // Obter tendência de reservas ao longo do tempo
      // Agrupar por mês, semana ou dia conforme solicitado
      let dateFormat;

      switch (groupBy) {
        case 'day':
          dateFormat = '%Y-%m-%d';
          break;
        case 'week':
          dateFormat = '%Y-W%W';
          break;
        case 'month':
          dateFormat = '%Y-%m';
          break;
        case 'year':
          dateFormat = '%Y';
          break;
        default:
          dateFormat = '%Y-%m';
      }

      // Obtendo tendência de reservas usando SQL bruto para formatação de data
      const reservationTrend = await prisma.$queryRaw`
        SELECT
          TO_CHAR(r."createdAt", ${dateFormat}) as period,
          COUNT(*) as count,
          SUM(CASE WHEN r."status" = 'COMPLETED' THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN r."paymentStatus" = 'PAID' THEN r."totalCost" ELSE 0 END) as revenue
        FROM "reservations" r
        WHERE r."createdAt" >= COALESCE(${dateFilter.gte || null}, r."createdAt")
        AND r."createdAt" <= COALESCE(${dateFilter.lte || null}, r."createdAt")
        GROUP BY period
        ORDER BY period
      `;

      // Obter os estacionamentos mais populares
      const topParkingLots = await prisma.parkingLot.findMany({
        select: {
          id: true,
          name: true,
          address: true,
          totalSpaces: true,
          availableSpaces: true,
          pricePerHour: true,
          _count: {
            select: {
              reservations: {
                where: {
                  createdAt: dateFilter
                }
              }
            }
          }
        },
        where: {
          isActive: true
        },
        orderBy: {
          reservations: {
            _count: 'desc'
          }
        },
        take: 5
      });

      // Obter taxas de conversão
      const conversionStats = {
        pendingToConfirmed: await getConversionRate('PENDING', 'CONFIRMED', dateFilter),
        confirmedToCompleted: await getConversionRate('CONFIRMED', 'COMPLETED', dateFilter),
        cancellationRate: await getCancellationRate(dateFilter)
      };

      // Montar resposta do dashboard
      const dashboard = {
        overview: {
          totalUsers,
          totalCompanies,
          transportadoras,
          estacionamentos,
          totalParkingLots,
          totalReservations,
          activeReservations,
          completedReservations,
          totalRevenue: totalRevenue._sum.totalCost || 0,
          occupancyRate: calculateOccupancyRate(activeReservations, totalParkingLots)
        },
        trends: {
          reservations: reservationTrend
        },
        topParkingLots: topParkingLots.map(pl => ({
          id: pl.id,
          name: pl.name,
          address: pl.address,
          totalSpaces: pl.totalSpaces,
          availableSpaces: pl.availableSpaces,
          pricePerHour: pl.pricePerHour,
          reservationCount: pl._count.reservations
        })),
        conversionStats
      };

      return res.status(200).json(dashboard);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Dashboard para empresas transportadoras
   * Contém métricas específicas de transportadora
   */
  getTransportadoraDashboard: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verificar se o usuário é de uma transportadora
      if (req.user.role !== 'TRANSPORTADORA') {
        throw new ApiError(403, 'Acesso negado. Apenas transportadoras podem acessar este dashboard.');
      }

      const companyId = req.user.companyId;

      if (!companyId) {
        throw new ApiError(400, 'ID da empresa não encontrado.');
      }

      // Obter parâmetros de filtro
      const { startDate, endDate, groupBy } = dashboardFilterSchema.parse(req.query);

      // Definir datas de início e fim para filtro
      const dateFilter: any = {};
      if (startDate) {
        dateFilter.gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.lte = new Date(endDate);
      }

      // Obter métricas específicas da transportadora
      const [
        totalVehicles,
        totalDrivers,
        totalReservations,
        activeReservations,
        completedReservations,
        cancelledReservations,
        totalSpending
      ] = await Promise.all([
        // Total de veículos
        prisma.vehicle.count({
          where: {
            companyId,
            isActive: true
          }
        }),

        // Total de motoristas
        prisma.driver.count({
          where: {
            companyId,
            isActive: true
          }
        }),

        // Total de reservas
        prisma.reservation.count({
          where: {
            companyId,
            createdAt: dateFilter
          }
        }),

        // Reservas ativas
        prisma.reservation.count({
          where: {
            companyId,
            status: {
              in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS']
            },
            createdAt: dateFilter
          }
        }),

        // Reservas concluídas
        prisma.reservation.count({
          where: {
            companyId,
            status: 'COMPLETED',
            createdAt: dateFilter
          }
        }),

        // Reservas canceladas
        prisma.reservation.count({
          where: {
            companyId,
            status: 'CANCELLED',
            createdAt: dateFilter
          }
        }),

        // Total gasto em reservas
        prisma.reservation.aggregate({
          where: {
            companyId,
            status: 'COMPLETED',
            paymentStatus: 'PAID',
            createdAt: dateFilter
          },
          _sum: {
            totalCost: true
          }
        })
      ]);

      // Obter tendência de reservas 
      let dateFormat;

      switch (groupBy) {
        case 'day':
          dateFormat = '%Y-%m-%d';
          break;
        case 'week':
          dateFormat = '%Y-W%W';
          break;
        case 'month':
          dateFormat = '%Y-%m';
          break;
        case 'year':
          dateFormat = '%Y';
          break;
        default:
          dateFormat = '%Y-%m';
      }

      // Obtendo tendência de reservas usando SQL bruto
      const reservationTrend = await prisma.$queryRaw`
        SELECT
          TO_CHAR(r."createdAt", ${dateFormat}) as period,
          COUNT(*) as count,
          SUM(CASE WHEN r."status" = 'COMPLETED' THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN r."status" = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled,
          SUM(CASE WHEN r."paymentStatus" = 'PAID' THEN r."totalCost" ELSE 0 END) as cost
        FROM "reservations" r
        WHERE r."companyId" = ${companyId}
        AND r."createdAt" >= COALESCE(${dateFilter.gte || null}, r."createdAt")
        AND r."createdAt" <= COALESCE(${dateFilter.lte || null}, r."createdAt")
        GROUP BY period
        ORDER BY period
      `;

      // Obter estacionamentos mais utilizados
      const mostUsedParkingLots = await prisma.parkingLot.findMany({
        select: {
          id: true,
          name: true,
          address: true,
          pricePerHour: true,
          _count: {
            select: {
              reservations: {
                where: {
                  companyId,
                  createdAt: dateFilter
                }
              }
            }
          }
        },
        orderBy: {
          reservations: {
            _count: 'desc'
          }
        },
        take: 5
      });

      // Obter motoristas mais ativos
      const mostActiveDrivers = await prisma.driver.findMany({
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              reservations: {
                where: {
                  createdAt: dateFilter
                }
              }
            }
          }
        },
        where: {
          companyId,
          isActive: true
        },
        orderBy: {
          reservations: {
            _count: 'desc'
          }
        },
        take: 5
      });

      // Obter veículos mais utilizados
      const mostUsedVehicles = await prisma.vehicle.findMany({
        select: {
          id: true,
          licensePlate: true,
          brand: true,
          model: true,
          vehicleType: true,
          _count: {
            select: {
              reservations: {
                where: {
                  createdAt: dateFilter
                }
              }
            }
          }
        },
        where: {
          companyId,
          isActive: true
        },
        orderBy: {
          reservations: {
            _count: 'desc'
          }
        },
        take: 5
      });

      // Montar resposta do dashboard
      const dashboard = {
        overview: {
          totalVehicles,
          totalDrivers,
          totalReservations,
          activeReservations,
          completedReservations,
          cancelledReservations,
          totalSpending: totalSpending._sum.totalCost || 0,
          completionRate: calculateCompletionRate(completedReservations, totalReservations)
        },
        trends: {
          reservations: reservationTrend
        },
        mostUsedParkingLots: mostUsedParkingLots.map(pl => ({
          id: pl.id,
          name: pl.name,
          address: pl.address,
          pricePerHour: pl.pricePerHour,
          reservationCount: pl._count.reservations
        })),
        mostActiveDrivers: mostActiveDrivers.map(driver => ({
          id: driver.id,
          name: driver.name,
          reservationCount: driver._count.reservations
        })),
        mostUsedVehicles: mostUsedVehicles.map(vehicle => ({
          id: vehicle.id,
          licensePlate: vehicle.licensePlate,
          brand: vehicle.brand,
          model: vehicle.model,
          type: vehicle.vehicleType,
          reservationCount: vehicle._count.reservations
        }))
      };

      return res.status(200).json(dashboard);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Dashboard para estacionamentos
   * Contém métricas específicas de estacionamento
   */
  getEstacionamentoDashboard: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verificar se o usuário é de um estacionamento
      if (req.user.role !== 'ESTACIONAMENTO') {
        throw new ApiError(403, 'Acesso negado. Apenas estacionamentos podem acessar este dashboard.');
      }

      const companyId = req.user.companyId;

      if (!companyId) {
        throw new ApiError(400, 'ID da empresa não encontrado.');
      }

      // Obter parâmetros de filtro
      const { startDate, endDate, groupBy } = dashboardFilterSchema.parse(req.query);

      // Definir datas de início e fim para filtro
      const dateFilter: any = {};
      if (startDate) {
        dateFilter.gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.lte = new Date(endDate);
      }

      // Buscar todos os estacionamentos da empresa
      const parkingLots = await prisma.parkingLot.findMany({
        where: {
          companyId,
          isActive: true
        },
        select: {
          id: true,
          name: true,
          totalSpaces: true,
          availableSpaces: true
        }
      });

      const parkingLotIds = parkingLots.map(pl => pl.id);

      // Obter métricas específicas do estacionamento
      const [
        totalParkingLots,
        totalSpaces,
        totalReservations,
        activeReservations,
        completedReservations,
        cancelledReservations,
        totalRevenue
      ] = await Promise.all([
        // Total de estacionamentos
        parkingLots.length,

        // Total de vagas
        parkingLots.reduce((acc, pl) => acc + pl.totalSpaces, 0),

        // Total de reservas
        prisma.reservation.count({
          where: {
            parkingLotId: { in: parkingLotIds },
            createdAt: dateFilter
          }
        }),

        // Reservas ativas
        prisma.reservation.count({
          where: {
            parkingLotId: { in: parkingLotIds },
            status: {
              in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS']
            },
            createdAt: dateFilter
          }
        }),

        // Reservas concluídas
        prisma.reservation.count({
          where: {
            parkingLotId: { in: parkingLotIds },
            status: 'COMPLETED',
            createdAt: dateFilter
          }
        }),

        // Reservas canceladas
        prisma.reservation.count({
          where: {
            parkingLotId: { in: parkingLotIds },
            status: 'CANCELLED',
            createdAt: dateFilter
          }
        }),

        // Receita total
        prisma.reservation.aggregate({
          where: {
            parkingLotId: { in: parkingLotIds },
            status: 'COMPLETED',
            paymentStatus: 'PAID',
            createdAt: dateFilter
          },
          _sum: {
            totalCost: true
          }
        })
      ]);

      // Obter tendência de reservas
      let dateFormat;

      switch (groupBy) {
        case 'day':
          dateFormat = '%Y-%m-%d';
          break;
        case 'week':
          dateFormat = '%Y-W%W';
          break;
        case 'month':
          dateFormat = '%Y-%m';
          break;
        case 'year':
          dateFormat = '%Y';
          break;
        default:
          dateFormat = '%Y-%m';
      }

      // Obtendo tendência de reservas usando SQL bruto
      const reservationTrend = await prisma.$queryRaw`
        SELECT
          TO_CHAR(r."createdAt", ${dateFormat}) as period,
          COUNT(*) as count,
          SUM(CASE WHEN r."status" = 'COMPLETED' THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN r."status" = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled,
          SUM(CASE WHEN r."paymentStatus" = 'PAID' THEN r."totalCost" ELSE 0 END) as revenue
        FROM "reservations" r
        WHERE r."parkingLotId" IN (${parkingLotIds.join(',')})
        AND r."createdAt" >= COALESCE(${dateFilter.gte || null}, r."createdAt")
        AND r."createdAt" <= COALESCE(${dateFilter.lte || null}, r."createdAt")
        GROUP BY period
        ORDER BY period
      `;

      // Obter transportadoras mais frequentes
      const topTransportadoras = await prisma.company.findMany({
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              reservations: {
                where: {
                  parkingLotId: { in: parkingLotIds },
                  createdAt: dateFilter
                }
              }
            }
          }
        },
        where: {
          companyType: 'TRANSPORTADORA',
          isActive: true,
          reservations: {
            some: {
              parkingLotId: { in: parkingLotIds }
            }
          }
        },
        orderBy: {
          reservations: {
            _count: 'desc'
          }
        },
        take: 5
      });

      // Obter taxa de ocupação por estacionamento
      const parkingLotStats = await Promise.all(
        parkingLots.map(async (pl) => {
          const totalReservations = await prisma.reservation.count({
            where: {
              parkingLotId: pl.id,
              createdAt: dateFilter
            }
          });

          const completedReservations = await prisma.reservation.count({
            where: {
              parkingLotId: pl.id,
              status: 'COMPLETED',
              createdAt: dateFilter
            }
          });

          const revenue = await prisma.reservation.aggregate({
            where: {
              parkingLotId: pl.id,
              status: 'COMPLETED',
              paymentStatus: 'PAID',
              createdAt: dateFilter
            },
            _sum: {
              totalCost: true
            }
          });

          return {
            id: pl.id,
            name: pl.name,
            totalSpaces: pl.totalSpaces,
            availableSpaces: pl.availableSpaces,
            occupancyRate: calculateOccupancyRate(pl.totalSpaces - pl.availableSpaces, pl.totalSpaces),
            totalReservations,
            completedReservations,
            revenue: revenue._sum.totalCost || 0
          };
        })
      );

      // Montar resposta do dashboard
      const dashboard = {
        overview: {
          totalParkingLots,
          totalSpaces,
          availableSpaces: parkingLots.reduce((acc, pl) => acc + pl.availableSpaces, 0),
          totalReservations,
          activeReservations,
          completedReservations,
          cancelledReservations,
          totalRevenue: totalRevenue._sum.totalCost || 0,
          occupancyRate: calculateOccupancyRate(
            totalSpaces - parkingLots.reduce((acc, pl) => acc + pl.availableSpaces, 0),
            totalSpaces
          )
        },
        trends: {
          reservations: reservationTrend
        },
        parkingLotStats,
        topTransportadoras: topTransportadoras.map(company => ({
          id: company.id,
          name: company.name,
          reservationCount: company._count.reservations
        }))
      };

      return res.status(200).json(dashboard);
    } catch (error) {
      next(error);
    }
  }
};

/**
 * Funções auxiliares
 */

// Calcular taxa de ocupação
function calculateOccupancyRate(occupied: number, total: number): number {
  if (total === 0) return 0;
  return parseFloat(((occupied / total) * 100).toFixed(2));
}

// Calcular taxa de conclusão
function calculateCompletionRate(completed: number, total: number): number {
  if (total === 0) return 0;
  return parseFloat(((completed / total) * 100).toFixed(2));
}

// Obter taxa de conversão entre status
async function getConversionRate(fromStatus: ReservationStatus, toStatus: ReservationStatus, dateFilter: any): Promise<number> {
  const fromCount = await prisma.reservation.count({
    where: {
      status: { in: [fromStatus, toStatus] },
      createdAt: dateFilter
    }
  });

  const toCount = await prisma.reservation.count({
    where: {
      status: toStatus,
      createdAt: dateFilter
    }
  });

  if (fromCount === 0) return 0;
  return parseFloat(((toCount / fromCount) * 100).toFixed(2));
}

// Obter taxa de cancelamento
async function getCancellationRate(dateFilter: any): Promise<number> {
  const totalReservations = await prisma.reservation.count({
    where: {
      createdAt: dateFilter
    }
  });

  const cancelledReservations = await prisma.reservation.count({
    where: {
      status: 'CANCELLED',
      createdAt: dateFilter
    }
  });

  if (totalReservations === 0) return 0;
  return parseFloat(((cancelledReservations / totalReservations) * 100).toFixed(2));
}

export default dashboardController; 