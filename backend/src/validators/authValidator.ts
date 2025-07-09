import { z } from 'zod';

/**
 * Validadores para autenticação
 */
export const authValidators = {
  /**
   * Esquema de validação para login
   */
  login: z.object({
    body: z.object({
      email: z.string().min(1, 'Email é obrigatório'),
      password: z.string().min(1, 'Senha é obrigatória'),
    }),
  }),

  /**
   * Esquema de validação para atualização de token
   */
  refreshToken: z.object({
    body: z.object({
      refreshToken: z.string().min(1, 'Refresh token é obrigatório'),
    }),
  }),

  /**
   * Esquema de validação para atualização de perfil
   */
  updateProfile: z.object({
    body: z.object({
      name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').optional(),
      email: z.string().email('Email inválido').optional(),
      password: z
        .string()
        .min(6, 'Senha deve ter pelo menos 6 caracteres')
        .max(100, 'Senha muito longa')
        .optional(),
      avatarUrl: z.string().url('URL de avatar inválida').optional().nullable(),
    }),
  }),
}; 