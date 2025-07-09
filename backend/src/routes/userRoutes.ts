import { Router } from 'express';
import userController from '../controllers/userController';
import { auth } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { userValidators } from '../validators/userValidator';

const router = Router();

// Rotas protegidas por autenticação
router.use(auth);

// GET /api/users - Listar usuários (Admin)
router.get('/', userController.getAllUsers);

// POST /api/users - Criar usuário (Admin)
router.post(
  '/',
  validateRequest(userValidators.createUser),
  userController.createUser
);

// GET /api/users/:id - Obter um usuário específico
router.get('/:id', userController.getUserById);

// PUT /api/users/:id - Atualizar usuário
router.put(
  '/:id',
  validateRequest(userValidators.updateUser),
  userController.updateUser
);

// DELETE /api/users/:id - Excluir usuário (Admin)
router.delete('/:id', userController.deleteUser);

export default router; 