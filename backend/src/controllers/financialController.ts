import { Request, Response, NextFunction } from 'express';
import { PrismaClient, ReservationStatus, PaymentStatus } from '@prisma/client';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Controlador de dados financeiros
 */
const financialController = {
  /**
   * Obter faturamento por estacionamentos
   */
  getFaturamentoEstacionamentos: async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Buscando faturamento de estacionamentos', { 
        userId: req.user.id, 
        role: req.user.role,
        query: req.query 
      });

      const { periodo } = req.query;
      
      // Calcular datas baseado no período
      let startDate = new Date();
      let endDate = new Date();
      
      switch (periodo) {
        case 'dia':
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'semana':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'mes':
        default:
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'ano':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
      }

      // Buscar reservas confirmadas/completadas no período
      const reservas = await prisma.reservation.findMany({
        where: {
          status: {
            in: [ReservationStatus.CONFIRMED, ReservationStatus.COMPLETED]
          },
          paymentStatus: PaymentStatus.PAID,
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          parkingLot: {
            include: {
              company: true
            }
          }
        }
      });

      // Agrupar por estacionamento
      const faturamentoPorEstacionamento = reservas.reduce((acc: any, reserva) => {
        const estacionamentoId = reserva.parkingLot.id;
        const estacionamentoNome = reserva.parkingLot.name;
        const empresaNome = reserva.parkingLot.company.name;
        
        if (!acc[estacionamentoId]) {
          acc[estacionamentoId] = {
            id: estacionamentoId,
            nome: estacionamentoNome,
            empresa: empresaNome,
            totalReservas: 0,
            faturamento: 0,
            cidade: 'N/A', // Campo city não existe no schema
            estado: 'N/A'  // Campo state não existe no schema
          };
        }
        
        acc[estacionamentoId].totalReservas += 1;
        acc[estacionamentoId].faturamento += reserva.totalCost || 0;
        
        return acc;
      }, {});

      const resultado = Object.values(faturamentoPorEstacionamento)
        .sort((a: any, b: any) => b.faturamento - a.faturamento);

      logger.info('Faturamento de estacionamentos calculado', { 
        totalEstacionamentos: resultado.length,
        periodo 
      });

      return res.status(200).json({
        status: 'success',
        data: resultado,
        summary: {
          totalEstacionamentos: resultado.length,
          faturamentoTotal: resultado.reduce((sum: number, item: any) => sum + item.faturamento, 0),
          reservasTotal: resultado.reduce((sum: number, item: any) => sum + item.totalReservas, 0),
          periodo,
          dataInicio: startDate.toISOString(),
          dataFim: endDate.toISOString()
        }
      });

    } catch (error) {
      logger.error('Erro ao buscar faturamento de estacionamentos', { error });
      next(error);
    }
  },

  /**
   * Obter evolução mensal do faturamento
   */
  getEvolucaoMensal: async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Buscando evolução mensal do faturamento', { 
        userId: req.user.id, 
        role: req.user.role 
      });

      // Últimos 12 meses
      const meses = [];
      const hoje = new Date();
      
      for (let i = 11; i >= 0; i--) {
        const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
        const proximoMes = new Date(hoje.getFullYear(), hoje.getMonth() - i + 1, 1);
        
        const reservas = await prisma.reservation.findMany({
          where: {
            status: {
              in: [ReservationStatus.CONFIRMED, ReservationStatus.COMPLETED]
            },
            paymentStatus: PaymentStatus.PAID,
            createdAt: {
              gte: data,
              lt: proximoMes
            }
          }
        });

        const faturamento = reservas.reduce((sum, reserva) => sum + Number(reserva.totalCost || 0), 0);
        
        meses.push({
          mes: data.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
          faturamento,
          reservas: reservas.length,
          data: data.toISOString()
        });
      }

      logger.info('Evolução mensal calculada', { totalMeses: meses.length });

      return res.status(200).json({
        status: 'success',
        data: meses,
        summary: {
          faturamentoTotal: meses.reduce((sum, mes) => sum + mes.faturamento, 0),
          reservasTotal: meses.reduce((sum, mes) => sum + mes.reservas, 0),
          mediaFaturamentoMensal: meses.reduce((sum, mes) => sum + mes.faturamento, 0) / meses.length
        }
      });

    } catch (error) {
      logger.error('Erro ao buscar evolução mensal', { error });
      next(error);
    }
  },

  /**
   * Obter resumo financeiro geral
   */
  getFinancialSummary: async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Buscando resumo financeiro', { 
        userId: req.user.id, 
        role: req.user.role 
      });

      const { periodo = 'mes' } = req.query;
      
      // Calcular período
      let startDate = new Date();
      switch (periodo) {
        case 'dia':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'semana':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'mes':
        default:
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'ano':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
      }

      // Faturamento total
      const reservasPagas = await prisma.reservation.findMany({
        where: {
          paymentStatus: PaymentStatus.PAID,
          createdAt: {
            gte: startDate
          }
        }
      });

      const faturamentoTotal = reservasPagas.reduce((sum, reserva) => sum + Number(reserva.totalCost || 0), 0);

      // Reservas pendentes de pagamento
      const reservasPendentes = await prisma.reservation.count({
        where: {
          paymentStatus: PaymentStatus.PENDING,
          createdAt: {
            gte: startDate
          }
        }
      });

      // Top estacionamentos
      const topEstacionamentos = await prisma.parkingLot.findMany({
        include: {
          _count: {
            select: {
              reservations: {
                where: {
                  createdAt: {
                    gte: startDate
                  }
                }
              }
            }
          },
          reservations: {
            where: {
              paymentStatus: PaymentStatus.PAID,
              createdAt: {
                gte: startDate
              }
            },
            select: {
              totalCost: true
            }
          }
        },
        take: 5
      });

      const topEstacionamentosComFaturamento = topEstacionamentos.map(estacionamento => ({
        id: estacionamento.id,
        nome: estacionamento.name,
        reservas: estacionamento._count.reservations,
        faturamento: estacionamento.reservations.reduce((sum, r) => sum + Number(r.totalCost || 0), 0)
      })).sort((a, b) => b.faturamento - a.faturamento);

      const summary = {
        faturamentoTotal,
        faturamentoPendente: reservasPendentes * 100, // estimativa
        reservasPagas: reservasPagas.length,
        reservasPendentes,
        ticketMedio: faturamentoTotal / (reservasPagas.length || 1),
        topEstacionamentos: topEstacionamentosComFaturamento,
        periodo
      };

      logger.info('Resumo financeiro calculado', { faturamentoTotal, periodo });

      return res.status(200).json({
        status: 'success',
        data: summary
      });

    } catch (error) {
      logger.error('Erro ao buscar resumo financeiro', { error });
      next(error);
    }
  },

  /**
   * Gerar relatório financeiro detalhado
   */
  getFinancialReport: async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Gerando relatório financeiro', { 
        userId: req.user.id, 
        role: req.user.role,
        query: req.query 
      });

      const { 
        dataInicio, 
        dataFim, 
        estacionamentoId, 
        empresaId,
        formato = 'json' 
      } = req.query;

      let whereClause: any = {
        paymentStatus: PaymentStatus.PAID
      };

      // Filtros de data
      if (dataInicio || dataFim) {
        whereClause.createdAt = {};
        if (dataInicio) whereClause.createdAt.gte = new Date(dataInicio as string);
        if (dataFim) whereClause.createdAt.lte = new Date(dataFim as string);
      }

      // Filtros específicos
      if (estacionamentoId) {
        whereClause.parkingLotId = estacionamentoId;
      }

      if (empresaId) {
        whereClause.parkingLot = {
          companyId: empresaId
        };
      }

      const reservas = await prisma.reservation.findMany({
        where: whereClause,
        include: {
          parkingLot: {
            include: {
              company: true
            }
          },
          vehicle: true,
          driver: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      const relatorio = {
        periodo: {
          inicio: dataInicio || 'N/A',
          fim: dataFim || 'N/A'
        },
        resumo: {
          totalReservas: reservas.length,
          faturamentoTotal: reservas.reduce((sum, r) => sum + Number(r.totalCost || 0), 0),
          ticketMedio: reservas.length > 0 ? 
            reservas.reduce((sum, r) => sum + Number(r.totalCost || 0), 0) / reservas.length : 0
        },
        detalhes: reservas.map(reserva => ({
          id: reserva.id,
          data: reserva.createdAt,
          estacionamento: reserva.parkingLot.name,
          empresa: reserva.parkingLot.company.name,
          veiculo: reserva.vehicle?.licensePlate || 'N/A',
          motorista: reserva.driver?.name || 'N/A',
          valor: reserva.totalCost,
          status: reserva.status,
          statusPagamento: reserva.paymentStatus
        }))
      };

      logger.info('Relatório financeiro gerado', { 
        totalReservas: reservas.length,
        faturamento: relatorio.resumo.faturamentoTotal 
      });

      return res.status(200).json({
        status: 'success',
        data: relatorio
      });

    } catch (error) {
      logger.error('Erro ao gerar relatório financeiro', { error });
      next(error);
    }
  }
};

export default financialController; 