import { Router } from 'express';
import financialController from '../controllers/financialController';
import { auth } from '../middleware/auth';

const router = Router();

// Middleware de autenticação para todas as rotas
router.use(auth);

// GET /api/financial/parking-lots - Faturamento por estacionamentos
router.get('/parking-lots', financialController.getFaturamentoEstacionamentos);

// GET /api/financial/monthly-evolution - Evolução mensal do faturamento
router.get('/monthly-evolution', financialController.getEvolucaoMensal);

// GET /api/financial/summary - Resumo financeiro geral
router.get('/summary', financialController.getFinancialSummary);

// GET /api/financial/report - Relatório financeiro detalhado
router.get('/report', financialController.getFinancialReport);

export default router; 