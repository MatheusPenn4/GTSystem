import { z } from 'zod';

/**
 * Validadores para as operações de usuários
 */
export const userValidators = {
  /**
   * Esquema de validação para criação de usuário
   */
  createUser: z.object({
    body: z.object({
      name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
      email: z.string().email('Email inválido'),
      password: z
        .string()
        .min(6, 'Senha deve ter pelo menos 6 caracteres')
        .max(100, 'Senha muito longa'),
      role: z.enum(['admin', 'transportadora', 'estacionamento'], {
        errorMap: () => ({ message: 'Papel de usuário inválido' }),
      }),
      companyId: z.string().uuid('ID de empresa inválido').optional(),
      avatarUrl: z.string().url('URL de avatar inválida').optional(),
    }),
  }),

  /**
   * Esquema de validação para atualização de usuário
   */
  updateUser: z.object({
    body: z.object({
      name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').optional(),
      email: z.string().email('Email inválido').optional(),
      password: z
        .string()
        .min(6, 'Senha deve ter pelo menos 6 caracteres')
        .max(100, 'Senha muito longa')
        .optional(),
      role: z
        .enum(['admin', 'transportadora', 'estacionamento'], {
          errorMap: () => ({ message: 'Papel de usuário inválido' }),
        })
        .optional(),
      companyId: z.string().uuid('ID de empresa inválido').optional().nullable(),
      avatarUrl: z.string().url('URL de avatar inválida').optional().nullable(),
      isActive: z.boolean().optional(),
    }),
  }),
}; 