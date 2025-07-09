import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';
import { redis } from '../config/redis';

const prisma = new PrismaClient();

/**
 * Controlador de autenticação
 */
const authController = {
  /**
   * Login de usuário
   */
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Tentativa de login iniciada');
      console.log('Dados de login recebidos:', { email: req.body.email });
      
      const { email, password } = req.body;

      // Verificar se o usuário existe
      try {
        const user = await prisma.user.findUnique({
          where: { email, isActive: true },
          include: {
            company: {
              select: {
                id: true,
                name: true,
                companyType: true,
              },
            },
          },
        });

        if (!user) {
          logger.warn(`Tentativa de login com email não encontrado: ${email}`);
          throw new ApiError(401, 'Email ou senha inválidos');
        }

        // Verificar senha
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
          logger.warn(`Senha inválida para usuário: ${email}`);
          throw new ApiError(401, 'Email ou senha inválidos');
        }

        // Gerar token JWT
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            role: user.role,
            companyId: user.companyId,
          },
          process.env.JWT_SECRET as string,
          { expiresIn: '1d' }
        );

        // Gerar refresh token
        const refreshToken = jwt.sign(
          { id: user.id },
          process.env.JWT_REFRESH_SECRET as string,
          { expiresIn: '7d' }
        );

        // Armazenar refresh token no Redis
        try {
          await redis.set(
            `refresh_token:${user.id}`,
            refreshToken,
            'EX',
            7 * 24 * 60 * 60 // 7 dias em segundos
          );
        } catch (redisError) {
          logger.error(`Erro ao armazenar refresh token no Redis: ${redisError}`);
          // Não falhar o login se o Redis falhar, apenas logar o erro
        }

        // Formatar a resposta para a interface esperada pelo frontend
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role.toLowerCase(),
          avatar: user.avatarUrl,
          companyId: user.companyId,
          companyName: user.company?.name,
        };

        // Log de login bem-sucedido
        logger.info(`Login bem-sucedido: ${user.email}`, {
          userId: user.id,
          action: 'login',
        });

        // Enviar resposta
        return res.status(200).json({
          user: userData,
          token,
          refreshToken,
        });
      } catch (dbError) {
        logger.error(`Erro ao acessar o banco de dados: ${dbError}`);
        if (dbError instanceof ApiError) {
          throw dbError;
        }
        throw new ApiError(500, 'Erro ao processar login');
      }
    } catch (error) {
      logger.error(`Erro no processo de login: ${error}`);
      next(error);
    }
  },

  /**
   * Logout de usuário
   */
  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;

      // Remover refresh token do Redis
      try {
        await redis.del(`refresh_token:${userId}`);
      } catch (redisError) {
        logger.error(`Erro ao remover refresh token do Redis: ${redisError}`);
        // Continuar com o logout mesmo se o Redis falhar
      }

      // Log de logout
      logger.info(`Logout: ${userId}`, { userId, action: 'logout' });

      return res.status(200).json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
      logger.error(`Erro no processo de logout: ${error}`);
      next(error);
    }
  },

  /**
   * Obter dados do usuário atual
   */
  me: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;

      try {
        const user = await prisma.user.findUnique({
          where: { id: userId, isActive: true },
          include: {
            company: {
              select: {
                id: true,
                name: true,
                companyType: true,
              },
            },
          },
        });

        if (!user) {
          throw new ApiError(404, 'Usuário não encontrado');
        }

        // Formatar a resposta
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role.toLowerCase(),
          avatar: user.avatarUrl,
          companyId: user.companyId,
          companyName: user.company?.name,
        };

        return res.status(200).json(userData);
      } catch (dbError) {
        logger.error(`Erro ao buscar usuário atual: ${dbError}`);
        if (dbError instanceof ApiError) {
          throw dbError;
        }
        throw new ApiError(500, 'Erro ao buscar dados do usuário');
      }
    } catch (error) {
      logger.error(`Erro na rota /me: ${error}`);
      next(error);
    }
  },

  /**
   * Atualizar perfil do usuário
   */
  updateProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const { name, email, password, avatarUrl } = req.body;

      // Verificar se o usuário existe
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        throw new ApiError(404, 'Usuário não encontrado');
      }

      // Preparar dados para atualização
      const updateData: any = {};

      if (name) updateData.name = name;
      if (email && email !== existingUser.email) {
        // Verificar se o novo email já está em uso
        const emailExists = await prisma.user.findUnique({
          where: { email },
        });
        
        if (emailExists && emailExists.id !== userId) {
          throw new ApiError(400, 'Email já está em uso por outro usuário');
        }
        
        updateData.email = email;
      }

      if (password) {
        const saltRounds = 10;
        updateData.passwordHash = await bcrypt.hash(password, saltRounds);
      }

      if (avatarUrl) updateData.avatarUrl = avatarUrl;

      // Atualizar o usuário
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        include: {
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Formatar a resposta
      const userData = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role.toLowerCase(),
        avatar: updatedUser.avatarUrl,
        companyId: updatedUser.companyId,
        companyName: updatedUser.company?.name,
      };

      // Log da ação
      logger.info(`Perfil atualizado: ${userId}`, {
        userId,
        action: 'update_profile',
      });

      return res.status(200).json(userData);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Atualizar token usando refresh token
   */
  refreshToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new ApiError(400, 'Refresh token não fornecido');
      }

      // Verificar refresh token
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET as string
        ) as { id: string };

        // Verificar se o refresh token está armazenado no Redis
        let storedToken = null;
        try {
          storedToken = await redis.get(`refresh_token:${decoded.id}`);
        } catch (redisError) {
          logger.error(`Erro ao verificar refresh token no Redis: ${redisError}`);
          // Continuar verificação, mas com mais rigor em outras validações
        }

        if (!storedToken || storedToken !== refreshToken) {
          logger.warn(`Refresh token inválido ou não encontrado no Redis: ${decoded.id}`);
          throw new ApiError(401, 'Refresh token inválido ou expirado');
        }

        // Obter dados do usuário
        const user = await prisma.user.findUnique({
          where: { id: decoded.id, isActive: true },
          include: {
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        if (!user) {
          throw new ApiError(401, 'Usuário não encontrado ou inativo');
        }

        // Gerar novo token JWT
        const newToken = jwt.sign(
          {
            id: user.id,
            email: user.email,
            role: user.role,
            companyId: user.companyId,
          },
          process.env.JWT_SECRET as string,
          { expiresIn: '1d' }
        );

        // Gerar novo refresh token
        const newRefreshToken = jwt.sign(
          { id: user.id },
          process.env.JWT_REFRESH_SECRET as string,
          { expiresIn: '7d' }
        );

        // Atualizar refresh token no Redis
        try {
          await redis.set(
            `refresh_token:${user.id}`,
            newRefreshToken,
            'EX',
            7 * 24 * 60 * 60 // 7 dias em segundos
          );
        } catch (redisError) {
          logger.error(`Erro ao atualizar refresh token no Redis: ${redisError}`);
          // Continuar com a renovação mesmo se o Redis falhar
        }

        // Formatar a resposta
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role.toLowerCase(),
          avatar: user.avatarUrl,
          companyId: user.companyId,
          companyName: user.company?.name,
        };

        // Log da ação
        logger.info(`Token atualizado: ${user.id}`, {
          userId: user.id,
          action: 'refresh_token',
        });

        return res.status(200).json({
          user: userData,
          token: newToken,
          refreshToken: newRefreshToken,
        });
      } catch (tokenError) {
        if (tokenError instanceof jwt.JsonWebTokenError) {
          return next(new ApiError(401, 'Refresh token inválido'));
        }
        
        if (tokenError instanceof jwt.TokenExpiredError) {
          return next(new ApiError(401, 'Refresh token expirado'));
        }
        
        if (tokenError instanceof ApiError) {
          return next(tokenError);
        }
        
        logger.error(`Erro desconhecido ao processar refresh token: ${tokenError}`);
        return next(new ApiError(500, 'Erro ao processar refresh token'));
      }
    } catch (error) {
      logger.error(`Erro na rota refresh-token: ${error}`);
      next(error);
    }
  },
};

export default authController; 