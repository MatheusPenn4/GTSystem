import { Router } from 'express';
import reportsController from '../controllers/reportsController';
import { auth } from '../middleware/auth';

const router = Router();

// Middleware de autenticação para todas as rotas
router.use(auth);

// GET /api/reports/faturamento-mensal - Relatório de faturamento mensal
router.get('/faturamento-mensal', reportsController.getFaturamentoMensal);

// GET /api/reports/ocupacao-semanal - Relatório de ocupação semanal
router.get('/ocupacao-semanal', reportsController.getOcupacaoSemanal);

// GET /api/reports/distribuicao-veiculos - Relatório de distribuição de veículos
router.get('/distribuicao-veiculos', reportsController.getDistribuicaoVeiculos);

// GET /api/reports/stats-by-role - Estatísticas por tipo de usuário
router.get('/stats-by-role', reportsController.getStatsByRole);

// GET /api/reports/export - Exportar relatórios
router.get('/export', reportsController.exportReport);

export default router; 