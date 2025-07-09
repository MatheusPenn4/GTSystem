import { Router, Request, Response } from 'express';
import dashboardController from '../controllers/dashboardController';
import { auth } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { dashboardFilterSchema } from '../validators/dashboardValidator';
import { z } from 'zod';

const router = Router();

// Rota pública para teste, sem autenticação - APENAS DADOS REAIS
router.get('/test', async (req: Request, res: Response) => {
  try {
    console.log('Acessando rota de teste do dashboard - APENAS DADOS REAIS DO BANCO');
    
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    // Buscar dados REAIS do banco de dados
    const [
      empresasAtivas,
      veiculosCadastrados,
      motoristasAtivos,
      totalVagas,
      vagasOcupadas
    ] = await Promise.all([
      // Empresas ativas
      prisma.company.count({
        where: { isActive: true }
      }),
      
      // Veículos cadastrados
      prisma.vehicle.count({
        where: { isActive: true }
      }),
      
      // Motoristas ativos
      prisma.driver.count({
        where: { isActive: true }
      }),
      
      // Total de vagas
      prisma.parkingLot.aggregate({
        _sum: { totalSpaces: true },
        where: { isActive: true }
      }),
      
      // Vagas ocupadas (reservas ativas)
      prisma.reservation.count({
        where: {
          status: { in: ['CONFIRMED', 'IN_PROGRESS'] }
        }
      })
    ]);
    
    const capacidadeTotal = totalVagas._sum.totalSpaces || 0;
    const percentualOcupacao = capacidadeTotal > 0 
      ? Math.round((vagasOcupadas / capacidadeTotal) * 100) 
      : 0;
    
    // Buscar atividades REAIS recentes
    const atividadesRecentes = await prisma.reservation.findMany({
      select: {
        id: true,
        status: true,
        createdAt: true,
        vehicle: { select: { licensePlate: true } },
        driver: { select: { name: true } },
        parkingLot: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 3
    });
    
    const atividadesFormatadas = atividadesRecentes.map((reserva: any) => ({
      id: reserva.id,
      tipo: 'reserva',
      descricao: `Reserva ${reserva.status.toLowerCase()} - ${reserva.vehicle?.licensePlate || 'N/A'} em ${reserva.parkingLot?.name || 'N/A'}`,
      data: reserva.createdAt.toISOString()
    }));
    
    const dashboardData = {
      overview: {
        empresasAtivas,
        veiculosCadastrados,
        motoristasAtivos,
        vagasOcupadas: { 
          total: vagasOcupadas, 
          capacidade: capacidadeTotal, 
          percentual: percentualOcupacao 
        },
      },
      atividadesRecentes: atividadesFormatadas
    };
    
    console.log('Dados REAIS retornados:', dashboardData);
    return res.status(200).json(dashboardData);
    
  } catch (error) {
    console.error('Erro na rota de teste do dashboard:', error);
    return res.status(500).json({ 
      error: 'Erro interno no servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Middleware de autenticação para as demais rotas
router.use(auth);

// Criar schema completo para validação
const dashboardRequestSchema = z.object({
  query: dashboardFilterSchema,
  body: z.object({}).optional(),
  params: z.object({}).optional()
});

// Rota simplificada removida - agora usa apenas dados reais

// Rotas para dashboard de acordo com o tipo de usuário
router.get('/admin', validateRequest(dashboardRequestSchema), dashboardController.getAdminDashboard);
router.get('/transportadora', validateRequest(dashboardRequestSchema), dashboardController.getTransportadoraDashboard);
router.get('/estacionamento', validateRequest(dashboardRequestSchema), dashboardController.getEstacionamentoDashboard);

export default router; 