import { z } from 'zod';

// Enum de tipo de veículo
const VehicleTypeEnum = z.enum(['TRUCK', 'VAN', 'CAR', 'MOTORCYCLE']);

// Schema para criar veículo
export const createVehicleSchema = z.object({
  licensePlate: z.string().min(5, "Placa deve ter pelo menos 5 caracteres"),
  vehicleType: VehicleTypeEnum,
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.number().int().positive().optional(),
  color: z.string().optional(),
  driverId: z.string().uuid().optional().nullable(),
  isActive: z.boolean().optional().default(true),
  companyId: z.string().uuid().optional()
});

// Schema para atualizar veículo
export const updateVehicleSchema = z.object({
  licensePlate: z.string().min(5, "Placa deve ter pelo menos 5 caracteres").optional(),
  vehicleType: VehicleTypeEnum.optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.number().int().positive().optional(),
  color: z.string().optional(),
  driverId: z.string().uuid().optional().nullable(),
  isActive: z.boolean().optional(),
  companyId: z.string().uuid().optional()
});

// Schema para buscar veículos
export const searchVehicleSchema = z.object({
  type: VehicleTypeEnum.optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  active: z.boolean().optional(),
  search: z.string().optional()
});
