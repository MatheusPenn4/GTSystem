import { Router } from 'express';
import authController from '../controllers/authController';
import { auth } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { authValidators } from '../validators/authValidator';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Operações de autenticação
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autenticar usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       401:
 *         description: Credenciais inválidas
 */
router.post(
  '/login',
  validateRequest(authValidators.login),
  authController.login
);



/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Renovar token de acesso
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token renovado com sucesso
 *       401:
 *         description: Token inválido ou expirado
 */
router.post(
  '/refresh-token',
  validateRequest(authValidators.refreshToken),
  authController.refreshToken
);

// Rotas protegidas por autenticação
router.use(auth);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Encerrar sessão do usuário
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Logout bem-sucedido
 */
router.post('/logout', authController.logout);



/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obter dados do usuário logado
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Dados do usuário retornados com sucesso
 *       401:
 *         description: Não autorizado
 */
router.get('/me', authController.me);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Atualizar perfil do usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               avatarUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.put(
  '/profile',
  validateRequest(authValidators.updateProfile),
  authController.updateProfile
);

export default router; 