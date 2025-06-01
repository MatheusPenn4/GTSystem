import { ParkingLot, ParkingSpot, ParkingRecord } from '../types/parking';
import { formatDateFromString } from '../utils/dateUtils';

// Adaptador para converter os dados do backend para o formato esperado pelo frontend
export const parkingLotAdapter = (data: Record<string, unknown>): ParkingLot => {
  return {
    id: data.id as number,
    name: data.name as string,
    address: data.address as string,
    capacity: data.capacity as number,
    availableSpots: data.available_spots as number, // Certifique-se que "available_spots" é o nome correto no backend
    description: data.description as string,
    isActive: data.is_active as boolean,
    createdAt: data.created_at ? formatDateFromString(data.created_at as string) : null,
    updatedAt: data.updated_at ? formatDateFromString(data.updated_at as string) : null,
  };
};

// Adaptador para converter dados do frontend para o formato esperado pelo backend
export const parkingLotToBackendAdapter = (data: Partial<ParkingLot>): Record<string, unknown> => {
  const result = {
    ...data,
    total_spots: data.capacity, // Converter para nome de campo do backend
  };
  delete result.availableSpots;
  return result;
};

// Novo: Adaptador para converter dados do backend para o formato ParkingSpot do frontend
export const parkingSpotAdapter = (data: Record<string, unknown>): ParkingSpot => {
  return {
    id: data.id as number,
    parkingLotId: data.parking_lot_id as number,
    parkingLotName: data.parking_lot_name as string,
    identifier: data.identifier as string,
    isOccupied: data.is_occupied as boolean,
    vehicleId: data.vehicle_id ? (data.vehicle_id as number) : null,
    vehiclePlate: data.vehicle_plate ? (data.vehicle_plate as string) : null,
    isActive: data.is_active as boolean,
    createdAt: data.created_at ? formatDateFromString(data.created_at as string) : null,
    updatedAt: data.updated_at ? formatDateFromString(data.updated_at as string) : null,
  };
};

// Novo: Adaptador para converter dados do backend para o formato ParkingRecord do frontend
export const parkingRecordAdapter = (data: Record<string, unknown>): ParkingRecord => {
  return {
    id: data.id as number,
    parkingLotId: data.parking_lot_id as number,
    parkingLotName: data.parking_lot_name as string,
    parkingSpotId: data.parking_spot_id ? (data.parking_spot_id as number) : null,
    parkingSpotIdentifier: data.parking_spot_identifier
      ? (data.parking_spot_identifier as string)
      : null,
    vehicleId: data.vehicle_id as number,
    vehiclePlate: data.vehicle_plate as string,
    companyId: data.company_id as number,
    companyName: data.company_name as string,
    driverId: data.driver_id ? (data.driver_id as number) : null,
    driverName: data.driver_name ? (data.driver_name as string) : null,
    status: data.status as string,
    statusDisplay: data.status_display as string,
    entryTime: data.entry_time ? formatDateFromString(data.entry_time as string) : null,
    exitTime: data.exit_time ? formatDateFromString(data.exit_time as string) : null,
    createdById: data.created_by_id as number,
    createdByUsername: data.created_by_username as string,
    createdAt: data.created_at ? formatDateFromString(data.created_at as string) : null,
    updatedAt: data.updated_at ? formatDateFromString(data.updated_at as string) : null,
  };
};
