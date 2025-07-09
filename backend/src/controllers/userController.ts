import { Request, Response, NextFunction } from 'express';
import { PrismaClient, UserRole } from '@prisma/client';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Controlador de usuários
 */
const userController = {
  /**
   * Obter todos os usuários (apenas admin)
   */
  getAllUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verificar se o usuário é admin
      if (req.user.role !== 'ADMIN') {
        throw new ApiError(403, 'Acesso negado. Apenas administradores podem acessar esta rota.');
      }

      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
          companyId: true,
          isActive: true,
          company: {
            select: {
              id: true,
              name: true,
              companyType: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
        where: {
          isActive: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Formatar a resposta para atender à interface esperada pelo frontend
      const formattedUsers = users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase(),
        avatar: user.avatarUrl,
        companyId: user.companyId,
        companyName: user.company?.name,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));

      return res.status(200).json(formattedUsers);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Criar um novo usuário (apenas admin)
   */
  createUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verificar se o usuário é admin
      if (req.user.role !== 'ADMIN') {
        throw new ApiError(403, 'Acesso negado. Apenas administradores podem criar usuários.');
      }

      const { name, email, password, role, companyId, avatarUrl } = req.body;

      // Verificar se o email já existe
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new ApiError(400, 'Email já está em uso.');
      }

      // Verificar se a empresa existe se foi fornecido um companyId
      if (companyId) {
        const company = await prisma.company.findUnique({
          where: { id: companyId },
        });

        if (!company) {
          throw new ApiError(400, 'Empresa não encontrada.');
        }
      }

      // Hash da senha
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Criar o usuário
      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: role.toUpperCase() as UserRole,
          companyId,
          avatarUrl,
          isActive: true,
          emailVerified: false,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
          companyId: true,
          company: {
            select: {
              id: true,
              name: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      });

      // Formatar a resposta
      const formattedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase(),
        avatar: user.avatarUrl,
        companyId: user.companyId,
        companyName: user.company?.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      // Log da ação
      logger.info(`Usuário criado: ${user.id}`, { userId: req.user.id, action: 'create_user' });

      return res.status(201).json(formattedUser);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obter um usuário específico
   */
  getUserById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Verificar permissões - admin pode ver qualquer usuário, outros apenas a si mesmos
      if (req.user.role !== 'ADMIN' && req.user.id !== id) {
        throw new ApiError(403, 'Acesso negado. Você só pode visualizar seus próprios dados.');
      }

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
          companyId: true,
          isActive: true,
          company: {
            select: {
              id: true,
              name: true,
              companyType: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new ApiError(404, 'Usuário não encontrado.');
      }

      // Formatar a resposta
      const formattedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase(),
        avatar: user.avatarUrl,
        companyId: user.companyId,
        companyName: user.company?.name,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return res.status(200).json(formattedUser);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Atualizar um usuário
   */
  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, email, password, role, companyId, avatarUrl, isActive } = req.body;

      // Verificar permissões - admin pode atualizar qualquer usuário
      // Outros usuários apenas a si mesmos e com limitações
      if (req.user.role !== 'ADMIN' && req.user.id !== id) {
        throw new ApiError(403, 'Acesso negado. Você só pode atualizar seus próprios dados.');
      }

      // Não-admin não pode mudar o próprio role ou companyId
      if (req.user.role !== 'ADMIN' && (role || companyId || isActive !== undefined)) {
        throw new ApiError(403, 'Acesso negado. Você não pode alterar seu próprio papel ou empresa.');
      }

      // Verificar se o usuário existe
      const existingUser = await prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new ApiError(404, 'Usuário não encontrado.');
      }

      // Preparar dados para atualização
      const updateData: any = {};

      if (name) updateData.name = name;
      if (email && email !== existingUser.email) {
        // Verificar se o novo email já está em uso
        const emailExists = await prisma.user.findUnique({
          where: { email },
        });
        
        if (emailExists && emailExists.id !== id) {
          throw new ApiError(400, 'Email já está em uso por outro usuário.');
        }
        
        updateData.email = email;
      }

      if (password) {
        const saltRounds = 10;
        updateData.passwordHash = await bcrypt.hash(password, saltRounds);
      }

      if (req.user.role === 'ADMIN') {
        if (role) updateData.role = role.toUpperCase() as UserRole;
        if (companyId) updateData.companyId = companyId;
        if (isActive !== undefined) updateData.isActive = isActive;
      }

      if (avatarUrl) updateData.avatarUrl = avatarUrl;

      // Atualizar o usuário
      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
          companyId: true,
          isActive: true,
          company: {
            select: {
              id: true,
              name: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      });

      // Formatar a resposta
      const formattedUser = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role.toLowerCase(),
        avatar: updatedUser.avatarUrl,
        companyId: updatedUser.companyId,
        companyName: updatedUser.company?.name,
        isActive: updatedUser.isActive,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      };

      // Log da ação
      logger.info(`Usuário atualizado: ${id}`, { userId: req.user.id, action: 'update_user' });

      return res.status(200).json(formattedUser);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Excluir um usuário (apenas admin)
   */
  deleteUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Verificar se o usuário é admin
      if (req.user.role !== 'ADMIN') {
        throw new ApiError(403, 'Acesso negado. Apenas administradores podem excluir usuários.');
      }

      // Verificar se o usuário existe
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new ApiError(404, 'Usuário não encontrado.');
      }

      // Impedir que o admin exclua a si mesmo
      if (id === req.user.id) {
        throw new ApiError(400, 'Você não pode excluir sua própria conta.');
      }

      // Exclusão lógica - apenas marcar como inativo
      await prisma.user.update({
        where: { id },
        data: { isActive: false },
      });

      // Log da ação
      logger.info(`Usuário excluído (lógico): ${id}`, { userId: req.user.id, action: 'delete_user' });

      return res.status(200).json({ message: 'Usuário excluído com sucesso.' });
    } catch (error) {
      next(error);
    }
  },
};

export default userController; 