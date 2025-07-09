import { z } from 'zod';

// Enum de status de reserva
const ReservationStatusEnum = z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']);

// Schema para criar reserva
export const createReservationSchema = z.object({
  parkingLotId: z.string().uuid("ID do estacionamento inválido"),
  parkingSpaceId: z.string().uuid("ID da vaga inválido").optional(),
  vehicleId: z.string().uuid("ID do veículo inválido"),
  driverId: z.string().uuid("ID do motorista inválido"),
  startTime: z.string().datetime("Data de início inválida"),
  endTime: z.string().datetime("Data de término inválida"),
  specialRequests: z.string().optional()
}).refine(data => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  return end > start;
}, {
  message: "A data de término deve ser posterior à data de início",
  path: ["endTime"]
});

// Versão para uso no middleware
export const createReservationMiddlewareSchema = createReservationSchema;

// Schema para atualizar reserva
export const updateReservationSchema = z.object({
  parkingSpaceId: z.string().uuid("ID da vaga inválido").optional(),
  startTime: z.string().datetime("Data de início inválida").optional(),
  endTime: z.string().datetime("Data de término inválida").optional(),
  status: ReservationStatusEnum.optional(),
  actualArrival: z.string().datetime("Data de chegada inválida").optional().nullable(),
  actualDeparture: z.string().datetime("Data de saída inválida").optional().nullable(),
  specialRequests: z.string().optional().nullable()
}).refine(data => {
  if (data.startTime && data.endTime) {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    return end > start;
  }
  return true;
}, {
  message: "A data de término deve ser posterior à data de início",
  path: ["endTime"]
});

// Versão para uso no middleware
export const updateReservationMiddlewareSchema = updateReservationSchema;

// Schema para buscar reservas
export const searchReservationSchema = z.object({
  parkingLotId: z.string().uuid("ID do estacionamento inválido").optional(),
  vehicleId: z.string().uuid("ID do veículo inválido").optional(),
  driverId: z.string().uuid("ID do motorista inválido").optional(),
  status: z.string().optional(),
  startDate: z.string().datetime("Data de início inválida").optional(),
  endDate: z.string().datetime("Data de término inválida").optional()
});
