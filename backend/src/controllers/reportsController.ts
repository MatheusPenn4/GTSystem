import { Request, Response, NextFunction } from 'express';
import { PrismaClient, ReservationStatus, PaymentStatus, VehicleType } from '@prisma/client';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Controlador de relatórios
 */
const reportsController = {
  /**
   * Relatório de faturamento mensal
   */
  getFaturamentoMensal: async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Gerando relatório de faturamento mensal', { 
        userId: req.user.id, 
        role: req.user.role,
        query: req.query 
      });

      const { dataInicio, dataFim } = req.query;
      
      // Últimos 12 meses se não especificado
      let startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 12);
      let endDate = new Date();

      if (dataInicio) startDate = new Date(dataInicio as string);
      if (dataFim) endDate = new Date(dataFim as string);

      // Buscar reservas pagas no período
      const reservas = await prisma.reservation.findMany({
        where: {
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
        },
        orderBy: {
          createdAt: 'asc'
        }
      });

      // Agrupar por mês
      const faturamentoPorMes = reservas.reduce((acc: any, reserva) => {
        const mes = reserva.createdAt.toISOString().slice(0, 7); // YYYY-MM
        const mesNome = reserva.createdAt.toLocaleDateString('pt-BR', { 
          month: 'short', 
          year: 'numeric' 
        });
        
        if (!acc[mes]) {
          acc[mes] = {
            mes,
            mesNome,
            faturamento: 0,
            reservas: 0,
            estacionamentos: new Set()
          };
        }
        
        acc[mes].faturamento += reserva.totalCost || 0;
        acc[mes].reservas += 1;
        acc[mes].estacionamentos.add(reserva.parkingLot.id);
        
        return acc;
      }, {});

      // Converter Set para count
      const resultado = Object.values(faturamentoPorMes).map((item: any) => ({
        ...item,
        estacionamentos: item.estacionamentos.size
      }));

      logger.info('Relatório de faturamento mensal gerado', { 
        totalMeses: resultado.length,
        periodo: `${startDate.toISOString()} - ${endDate.toISOString()}`
      });

      return res.status(200).json({
        status: 'success',
        data: resultado,
        summary: {
          periodo: {
            inicio: startDate.toISOString(),
            fim: endDate.toISOString()
          },
          faturamentoTotal: resultado.reduce((sum: any, item: any) => sum + item.faturamento, 0),
          reservasTotal: resultado.reduce((sum: any, item: any) => sum + item.reservas, 0),
          mediaFaturamentoMensal: resultado.length > 0 ? 
            resultado.reduce((sum: any, item: any) => sum + item.faturamento, 0) / resultado.length : 0
        }
      });

    } catch (error) {
      logger.error('Erro ao gerar relatório de faturamento mensal', { error });
      next(error);
    }
  },

  /**
   * Relatório de ocupação semanal
   */
  getOcupacaoSemanal: async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Gerando relatório de ocupação semanal', { 
        userId: req.user.id, 
        role: req.user.role 
      });

      // Últimas 4 semanas
      const semanas = [];
      const hoje = new Date();
      
      for (let i = 3; i >= 0; i--) {
        const inicioSemana = new Date(hoje);
        inicioSemana.setDate(hoje.getDate() - (i * 7 + hoje.getDay()));
        inicioSemana.setHours(0, 0, 0, 0);
        
        const fimSemana = new Date(inicioSemana);
        fimSemana.setDate(inicioSemana.getDate() + 6);
        fimSemana.setHours(23, 59, 59, 999);

        // Contar reservas ativas na semana
        const reservasAtivas = await prisma.reservation.count({
          where: {
            status: {
              in: [ReservationStatus.CONFIRMED, ReservationStatus.IN_PROGRESS]
            },
            startTime: {
              gte: inicioSemana,
              lte: fimSemana
            }
          }
        });

        // Total de vagas disponíveis
        const totalVagas = await prisma.parkingLot.aggregate({
          _sum: {
            totalSpaces: true
          }
        });

        const ocupacao = totalVagas._sum.totalSpaces ? 
          (reservasAtivas / totalVagas._sum.totalSpaces) * 100 : 0;

        semanas.push({
          semana: `${inicioSemana.toLocaleDateString('pt-BR')} - ${fimSemana.toLocaleDateString('pt-BR')}`,
          inicioSemana: inicioSemana.toISOString(),
          fimSemana: fimSemana.toISOString(),
          reservasAtivas,
          totalVagas: totalVagas._sum.totalSpaces || 0,
          ocupacao: Math.round(ocupacao * 100) / 100
        });
      }

      logger.info('Relatório de ocupação semanal gerado', { totalSemanas: semanas.length });

      return res.status(200).json({
        status: 'success',
        data: semanas,
        summary: {
          ocupacaoMedia: semanas.reduce((sum, semana) => sum + semana.ocupacao, 0) / semanas.length,
          maiorOcupacao: Math.max(...semanas.map(s => s.ocupacao)),
          menorOcupacao: Math.min(...semanas.map(s => s.ocupacao))
        }
      });

    } catch (error) {
      logger.error('Erro ao gerar relatório de ocupação semanal', { error });
      next(error);
    }
  },

  /**
   * Relatório de distribuição de veículos
   */
  getDistribuicaoVeiculos: async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Gerando relatório de distribuição de veículos', { 
        userId: req.user.id, 
        role: req.user.role 
      });

      // Distribuição por tipo de veículo
      const distribuicaoPorTipo = await prisma.vehicle.groupBy({
        by: ['vehicleType'],
        _count: {
          id: true
        }
      });

      // Distribuição por empresa
      const distribuicaoPorEmpresa = await prisma.vehicle.groupBy({
        by: ['companyId'],
        _count: {
          id: true
        }
      });

      // Buscar nomes das empresas
      const empresasInfo = await prisma.company.findMany({
        where: {
          id: {
            in: distribuicaoPorEmpresa.map(d => d.companyId).filter(Boolean)
          }
        },
        select: {
          id: true,
          name: true
        }
      });

      const empresasMap = empresasInfo.reduce((acc, empresa) => {
        acc[empresa.id] = empresa.name;
        return acc;
      }, {} as Record<string, string>);

      // Distribuição por estado de veículos
      const veiculosAtivos = await prisma.vehicle.count({
        where: { isActive: true }
      });

      const veiculosInativos = await prisma.vehicle.count({
        where: { isActive: false }
      });

      // Top empresas com mais veículos
      const topEmpresas = distribuicaoPorEmpresa
        .filter(d => d.companyId)
        .map(d => ({
          empresaId: d.companyId,
          empresa: empresasMap[d.companyId!] || 'Empresa não encontrada',
          totalVeiculos: d._count.id
        }))
        .sort((a, b) => b.totalVeiculos - a.totalVeiculos)
        .slice(0, 5);

      const relatorio = {
        distribuicaoPorTipo: distribuicaoPorTipo.map(d => ({
          tipo: d.vehicleType,
          total: d._count.id,
          percentual: Math.round((d._count.id / (veiculosAtivos + veiculosInativos)) * 10000) / 100
        })),
        distribuicaoPorStatus: {
          ativos: veiculosAtivos,
          inativos: veiculosInativos,
          total: veiculosAtivos + veiculosInativos
        },
        topEmpresas,
        resumo: {
          totalVeiculos: veiculosAtivos + veiculosInativos,
          veiculosAtivos,
          veiculosInativos,
          empresasComVeiculos: distribuicaoPorEmpresa.length
        }
      };

      logger.info('Relatório de distribuição de veículos gerado', { 
        totalVeiculos: relatorio.resumo.totalVeiculos 
      });

      return res.status(200).json({
        status: 'success',
        data: relatorio
      });

    } catch (error) {
      logger.error('Erro ao gerar relatório de distribuição de veículos', { error });
      next(error);
    }
  },

  /**
   * Estatísticas por tipo de usuário
   */
  getStatsByRole: async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Gerando estatísticas por tipo de usuário', { 
        userId: req.user.id, 
        role: req.user.role 
      });

      // Contar usuários por role
      const userStats = await prisma.user.groupBy({
        by: ['role'],
        _count: {
          id: true
        }
      });

      // Contar empresas por tipo
      const companyStats = await prisma.company.groupBy({
        by: ['companyType'],
        _count: {
          id: true
        }
      });

      // Atividade recente por tipo de usuário
      const activityStats = await prisma.reservation.groupBy({
        by: ['createdAt'],
        _count: {
          id: true
        },
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // últimos 7 dias
          }
        }
      });

      const stats = {
        usuarios: userStats.map(stat => ({
          tipo: stat.role,
          total: stat._count.id
        })),
        empresas: companyStats.map(stat => ({
          tipo: stat.companyType,
          total: stat._count.id
        })),
        atividadeRecente: {
          reservasUltimos7Dias: activityStats.reduce((sum, stat) => sum + stat._count.id, 0)
        }
      };

      logger.info('Estatísticas por tipo de usuário geradas');

      return res.status(200).json({
        status: 'success',
        data: stats
      });

    } catch (error) {
      logger.error('Erro ao gerar estatísticas por tipo de usuário', { error });
      next(error);
    }
  },

  /**
   * Exportar relatórios
   */
  exportReport: async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Exportando relatório', { 
        userId: req.user.id, 
        role: req.user.role,
        query: req.query 
      });

      const { 
        tipo, 
        formato = 'json',
        dataInicio,
        dataFim 
      } = req.query;

      let data: any = {};

      // Gerar dados baseado no tipo de relatório
      switch (tipo) {
        case 'financeiro':
          // Usar o método do financialController seria melhor, mas por simplicidade:
          const reservasPagas = await prisma.reservation.findMany({
            where: {
              paymentStatus: PaymentStatus.PAID,
              ...(dataInicio && { createdAt: { gte: new Date(dataInicio as string) } }),
              ...(dataFim && { createdAt: { lte: new Date(dataFim as string) } })
            },
            include: {
              parkingLot: true,
              vehicle: true,
              driver: true
            }
          });
          
          data = {
            tipo: 'Relatório Financeiro',
            periodo: {
              inicio: dataInicio || 'N/A',
              fim: dataFim || 'N/A'
            },
                         resumo: {
               totalReservas: reservasPagas.length,
               faturamentoTotal: reservasPagas.reduce((sum, r) => sum + Number(r.totalCost || 0), 0)
             },
            detalhes: reservasPagas
          };
          break;

        case 'ocupacao':
          const totalVagas = await prisma.parkingLot.aggregate({
            _sum: { totalSpaces: true }
          });
          
          const vagasOcupadas = await prisma.reservation.count({
            where: {
              status: {
                in: [ReservationStatus.CONFIRMED, ReservationStatus.IN_PROGRESS]
              }
            }
          });

          data = {
            tipo: 'Relatório de Ocupação',
            resumo: {
              totalVagas: totalVagas._sum.totalSpaces || 0,
              vagasOcupadas,
              taxaOcupacao: totalVagas._sum.totalSpaces ? 
                (vagasOcupadas / totalVagas._sum.totalSpaces) * 100 : 0
            }
          };
          break;

        default:
          throw new ApiError(400, 'Tipo de relatório não suportado');
      }

      // Por enquanto, retornar sempre JSON
      // Em uma implementação completa, aqui seria gerado CSV/PDF conforme solicitado
      
      logger.info('Relatório exportado com sucesso', { tipo, formato });

      return res.status(200).json({
        status: 'success',
        data,
        exportInfo: {
          tipo,
          formato,
          dataExportacao: new Date().toISOString(),
          totalRegistros: Array.isArray(data.detalhes) ? data.detalhes.length : 1
        }
      });

    } catch (error) {
      logger.error('Erro ao exportar relatório', { error });
      next(error);
    }
  }
};

export default reportsController; 