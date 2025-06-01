export interface ParkingLot {
  id: number;
  name: string;
  address: string;
  capacity: number;
  availableSpots: number;
  description: string;
  isActive: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface ParkingSpot {
  id: number;
  parkingLotId: number;
  parkingLotName: string;
  identifier: string;
  isOccupied: boolean;
  vehicleId: number | null;
  vehiclePlate: string | null;
  isActive: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface ParkingRecord {
  id: number;
  parkingLotId: number;
  parkingLotName: string;
  parkingSpotId: number | null;
  parkingSpotIdentifier: string | null;
  vehicleId: number;
  vehiclePlate: string;
  companyId: number;
  companyName: string;
  driverId: number | null;
  driverName: string | null;
  status: string;
  statusDisplay: string;
  entryTime: Date | null;
  exitTime: Date | null;
  createdById: number;
  createdByUsername: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}
