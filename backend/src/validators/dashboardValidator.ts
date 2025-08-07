import { z } from 'zod';

/**
 * Esquema para validação de parâmetros de filtro do dashboard
 */
export const dashboardFilterSchema = z.object({
  // Filtrar por período de tempo
  startDate: z.string().optional().or(z.string().length(0)),
  endDate: z.string().optional().or(z.string().length(0)),
  
  // Filtrar por tipo de status da reserva
  reservationStatus: z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  
  // Filtrar por tipo de pagamento
  paymentStatus: z.enum(['PENDING', 'PAID', 'REFUNDED', 'FAILED']).optional(),
  
  // Agrupar por dia, semana, mês ou ano
  groupBy: z.enum(['day', 'week', 'month', 'year']).optional().default('month'),
});

/**
 * Esquema para validação de parâmetros de relatórios específicos
 */
export const reportParamsSchema = z.object({
  // Tipo de relatório
  reportType: z.enum(['occupation', 'financial', 'usage']),
  
  // Filtrar por período de tempo
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  
  // Formato de saída
  format: z.enum(['json', 'csv', 'pdf']).optional().default('json'),
  
  // ID do estacionamento (opcional, para relatórios específicos)
  parkingLotId: z.string().uuid().optional(),
  
  // ID da empresa (opcional, para relatórios específicos)
  companyId: z.string().uuid().optional(),
}); 