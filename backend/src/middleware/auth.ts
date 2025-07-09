import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';
import { asyncHandler } from './errorHandler';
import { logger } from '../utils/logger';
import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

// Interface para o payload do token JWT
interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  companyId?: string;
}

// Extensão do tipo Request para incluir o usuário
declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
        role: UserRole;
        companyId?: string;
      };
    }
  }
}

/**
 * Middleware de autenticação
 * Verifica o token JWT e adiciona o usuário à requisição
 */
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Log detalhado de informações da requisição para depuração
    console.log('=== AUTH MIDDLEWARE DEBUG ===');
    console.log(`Rota acessada: ${req.method} ${req.path}`);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    
    // Obter o token do header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Erro de autenticação: Token não fornecido ou formato inválido');
      throw new ApiError(401, 'Acesso não autorizado. Token não fornecido.');
    }
    
    const token = authHeader.split(' ')[1];
    console.log('Token recebido:', token.substring(0, 10) + '...');

    // Verificar o token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
        role: UserRole;
      };
      
      console.log('Token decodificado com sucesso:', JSON.stringify(decoded, null, 2));

      // Verificar se o usuário existe e está ativo
      const user = await prismaClient.user.findUnique({
        where: {
          id: decoded.id,
          isActive: true,
        },
      });

      if (!user) {
        console.log(`Usuário não encontrado ou inativo: ID=${decoded.id}`);
        throw new ApiError(401, 'Acesso não autorizado. Usuário não encontrado ou inativo.');
      }

      console.log(`Usuário autenticado: ${user.email} (${user.role})`);
      
      // Adicionar o usuário à requisição
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId || undefined,
      };

      console.log('=== FIM AUTH MIDDLEWARE ===');
      next();
    } catch (jwtError) {
      console.log('Erro na verificação do JWT:', jwtError);
      throw jwtError;
    }
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Token inválido', { error: error.message });
      console.log('Erro de token inválido:', error.message);
      return next(new ApiError(401, 'Acesso não autorizado. Token inválido.'));
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn('Token expirado');
      console.log('Erro de token expirado');
      return next(new ApiError(401, 'Acesso não autorizado. Token expirado.'));
    }
    
    console.log('Erro não classificado na autenticação:', error);
    next(error);
  }
};

/**
 * Middleware para verificar se o usuário tem uma função específica
 * @param roles - Lista de funções permitidas
 */
export const authorize = (roles: UserRole[]) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw ApiError.unauthorized('Usuário não autenticado');
    }

    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden('Acesso negado para esta função');
    }

    next();
  });
};

/**
 * Middleware para verificar se o usuário pertence à empresa ou é admin
 * Útil para endpoints onde um usuário só pode acessar recursos da própria empresa
 */
export const authorizeCompany = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw ApiError.unauthorized('Usuário não autenticado');
    }

    // Admin pode acessar tudo
    if (req.user.role === UserRole.ADMIN) {
      return next();
    }

    // Verificar se o companyId na requisição corresponde ao do usuário
    const requestCompanyId = req.params.companyId || req.body.companyId;

    if (!requestCompanyId) {
      throw ApiError.badRequest('ID da empresa não fornecido');
    }

    if (!req.user.companyId) {
      throw ApiError.forbidden('Usuário não está associado a uma empresa');
    }

    if (requestCompanyId !== req.user.companyId) {
      throw ApiError.forbidden('Acesso negado aos recursos de outra empresa');
    }

    next();
  }
); 