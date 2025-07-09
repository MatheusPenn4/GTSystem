import { z } from 'zod';

// Schema para criar motorista
export const createDriverSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  cpf: z.string()
    .min(11, "CPF deve ter 11 dígitos")
    .max(14, "CPF deve ter no máximo 14 caracteres"),
  cnh: z.string()
    .min(9, "CNH deve ter pelo menos 9 caracteres")
    .max(11, "CNH deve ter no máximo 11 caracteres"),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional(),
  isActive: z.boolean().optional().default(true)
});

// Schema para atualizar motorista
export const updateDriverSchema = createDriverSchema
  .omit({ cpf: true, cnh: true }) // Não permitir alterar CPF e CNH
  .partial();

// Schema para buscar motoristas
export const searchDriverSchema = z.object({
  search: z.string().optional(),
  active: z.boolean().optional()
});
