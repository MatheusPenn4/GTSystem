import { Router } from 'express';
import companyController from '../controllers/companyController';
import { auth } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { companyValidators } from '../validators/companyValidator';

const router = Router();

// Todas as rotas de empresas requerem autenticação
router.use(auth);

// GET /api/empresas - Listar empresas (Admin)
router.get('/', companyController.getAllCompanies);

// POST /api/empresas - Cadastrar empresa (Admin)
router.post(
  '/',
  validateRequest(companyValidators.createCompany),
  companyController.createCompany
);

// GET /api/empresas/:id - Obter uma empresa específica
router.get('/:id', companyController.getCompanyById);

// PUT /api/empresas/:id - Atualizar empresa
router.put(
  '/:id',
  validateRequest(companyValidators.updateCompany),
  companyController.updateCompany
);

// DELETE /api/empresas/:id - Excluir empresa (Admin)
router.delete('/:id', companyController.deleteCompany);

export default router; 