import { Request, Response, NextFunction, Express } from 'express';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/apiError';

// Tipos de erros
interface ErrorResponse {
  success: boolean;
  message: string;
  errors?: string[];
  stack?: string;
}

// Middleware para capturar erros em requisições assíncronas
export const asyncHandler = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Middleware para lidar com rotas não encontradas
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Rota não encontrada - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Middleware para tratamento centralizado de erros
 */
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log do erro
  logger.error(`${err.name}: ${err.message}`, {
    path: req.path,
    method: req.method,
    ip: req.ip,
    stack: err.stack,
  });

  // Se for um ApiError (erro conhecido)
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      errors: err.errors,
    });
  }

  // Se for um erro JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      message: 'Token inválido',
    });
  }

  // Se for um erro de token expirado
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      message: 'Token expirado',
    });
  }

  // Erros do Prisma
  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      status: 'error',
      message: 'Erro na operação do banco de dados',
    });
  }

  // Erros de validação do Zod
  if (err.name === 'ZodError') {
    return res.status(400).json({
      status: 'error',
      message: 'Erro de validação',
      errors: JSON.parse(err.message),
    });
  }

  // Erros desconhecidos (500 Internal Server Error)
  return res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor',
  });
};

// Configuração do manipulador de erros para a aplicação Express
export const setupErrorHandler = (app: Express): void => {
  // Middleware para lidar com rotas não encontradas (deve ser adicionado após todas as rotas)
  app.use(notFound);
  
  // Middleware de tratamento de erros (deve ser o último middleware)
  app.use(errorHandler);
}; 