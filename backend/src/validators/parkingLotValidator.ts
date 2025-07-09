import { z } from 'zod';

// Schema para criar estacionamento
export const createParkingLotSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  address: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  totalSpaces: z.number().int().positive("Total de vagas deve ser positivo"),
  availableSpaces: z.number().int().nonnegative("Vagas disponíveis não pode ser negativo"),
  pricePerHour: z.number().positive("Preço por hora deve ser positivo"),
  operatingHours: z.record(z.object({
    open: z.string(),
    close: z.string()
  })).optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  isActive: z.boolean().optional().default(true)
});

// Schema para atualizar estacionamento
export const updateParkingLotSchema = createParkingLotSchema.partial();

// Schema para adicionar uma vaga de estacionamento
export const createParkingSpaceSchema = z.object({
  spaceNumber: z.string(),
  spaceType: z.string(),
  isAvailable: z.boolean().optional().default(true),
  isActive: z.boolean().optional().default(true)
});

// Schema para atualizar uma vaga de estacionamento
export const updateParkingSpaceSchema = createParkingSpaceSchema.partial(); 