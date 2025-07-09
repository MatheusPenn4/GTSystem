import { z } from 'zod';

/**
 * Validadores para empresas
 */
export const companyValidators = {
  /**
   * Esquema de validação para criação de empresa
   */
  createCompany: z.object({
    body: z.object({
      name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
      cnpj: z.string().regex(/^\d{14}$/, 'CNPJ deve conter 14 dígitos numéricos'),
      companyType: z.enum(['transportadora', 'estacionamento'], {
        errorMap: () => ({ message: 'Tipo de empresa inválido' }),
      }),
      phone: z.string().optional(),
      email: z.string().email('Email inválido').optional(),
      address: z.string().optional(),
    }),
  }),

  /**
   * Esquema de validação para atualização de empresa
   */
  updateCompany: z.object({
    body: z.object({
      name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').optional(),
      phone: z.string().optional(),
      email: z.string().email('Email inválido').optional(),
      address: z.string().optional(),
      isActive: z.boolean().optional(),
    }),
  }),
}; 