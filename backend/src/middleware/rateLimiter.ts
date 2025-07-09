import { rateLimit, Options } from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Middleware para limitar a taxa de requisições
 * @param options - Opções de configuração do rate limiter
 */
export const rateLimiter = (options?: Partial<Options>) => {
  const defaultOptions: Partial<Options> = {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // limite de 100 requisições por janela por IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Muitas requisições, tente novamente mais tarde.'
    },
    handler: (req: Request, res: Response, next: NextFunction, options: Options) => {
      logger.warn(`Rate limit excedido por IP: ${req.ip}`);
      res.status(429).json(options.message);
    }
  };

  return rateLimit({
    ...defaultOptions,
    ...options,
  });
}; 