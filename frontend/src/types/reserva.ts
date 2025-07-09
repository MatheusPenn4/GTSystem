// Enums para status conforme backend
export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED', 
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED'
}

export enum VehicleType {
  CAMINHAO = 'CAMINHAO',
  VAN = 'VAN',
  CARRETA = 'CARRETA',
  TRUCK = 'TRUCK',
  MOTOCICLETA = 'MOTOCICLETA'
}

// Interfaces principais
export interface Reservation {
  id: string;
  parkingLotId: string;
  parkingSpaceId?: string;
  companyId: string;
  vehicleId: string;
  driverId: string;
  startTime: string;
  endTime: string;
  actualArrival?: string;
  actualDeparture?: string;
  status: ReservationStatus;
  totalCost?: number;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relações
  parkingLot?: ParkingLot;
  parkingSpace?: ParkingSpace;
  company?: Company;
  vehicle?: Vehicle;
  driver?: Driver;
  transactions?: Transaction[];
}

export interface ParkingLot {
  id: string;
  companyId: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  totalSpaces: number;
  availableSpaces: number;
  pricePerHour: number;
  operatingHours?: any;
  amenities?: string[];
  images?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ParkingSpace {
  id: string;
  parkingLotId: string;
  spaceNumber: string;
  spaceType: string;
  isAvailable: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  companyId: string;
  licensePlate: string;
  vehicleType: VehicleType;
  brand?: string;
  model?: string;
  year?: number;
  color?: string;
  driverId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  id: string;
  companyId: string;
  name: string;
  cpf: string;
  cnh: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  phone?: string;
  email?: string;
  address?: string;
  companyType: 'TRANSPORTADORA' | 'ESTACIONAMENTO';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  reservationId: string;
  amount: number;
  transactionType: 'PAYMENT' | 'REFUND' | 'FEE';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  paymentMethod?: string;
  externalTransactionId?: string;
  processedAt?: string;
  createdAt: string;
}

// Formulários
export interface CreateReservationRequest {
  parkingLotId: string;
  parkingSpaceId?: string;
  vehicleId: string;
  driverId: string;
  startTime: string;
  endTime: string;
  specialRequests?: string;
}

export interface UpdateReservationRequest {
  status?: ReservationStatus;
  actualArrival?: string;
  actualDeparture?: string;
  startTime?: string;
  endTime?: string;
  specialRequests?: string;
}

// Filtros
export interface ReservationFilters {
  status?: ReservationStatus;
  parkingLotId?: string;
  vehicleId?: string;
  driverId?: string;
  companyId?: string;
  startDate?: string;
  endDate?: string;
}

// Estatísticas
export interface ReservationStats {
  total: number;
  pending: number;
  confirmed: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  totalRevenue: number;
  averageDuration: number;
}

// Status labels e cores para UI
export const StatusLabels: Record<ReservationStatus, string> = {
  [ReservationStatus.PENDING]: 'Pendente',
  [ReservationStatus.CONFIRMED]: 'Confirmada',
  [ReservationStatus.IN_PROGRESS]: 'Em Andamento',
  [ReservationStatus.COMPLETED]: 'Finalizada',
  [ReservationStatus.CANCELLED]: 'Cancelada'
};

export const StatusColors: Record<ReservationStatus, { bg: string; text: string; border: string }> = {
  [ReservationStatus.PENDING]: {
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-400',
    border: 'border-yellow-500/30'
  },
  [ReservationStatus.CONFIRMED]: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    border: 'border-blue-500/30'
  },
  [ReservationStatus.IN_PROGRESS]: {
    bg: 'bg-green-500/20',
    text: 'text-green-400',
    border: 'border-green-500/30'
  },
  [ReservationStatus.COMPLETED]: {
    bg: 'bg-gray-500/20',
    text: 'text-gray-400',
    border: 'border-gray-500/30'
  },
  [ReservationStatus.CANCELLED]: {
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    border: 'border-red-500/30'
  }
};

export const PaymentStatusLabels: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'Pendente',
  [PaymentStatus.PAID]: 'Pago',
  [PaymentStatus.REFUNDED]: 'Reembolsado',
  [PaymentStatus.FAILED]: 'Falhou'
};

export const VehicleTypeLabels: Record<VehicleType, string> = {
  [VehicleType.CAMINHAO]: 'Caminhão',
  [VehicleType.VAN]: 'Van',
  [VehicleType.CARRETA]: 'Carreta',
  [VehicleType.TRUCK]: 'Truck',
  [VehicleType.MOTOCICLETA]: 'Motocicleta'
};

// Transições de estado permitidas
export const AllowedStatusTransitions: Record<ReservationStatus, ReservationStatus[]> = {
  [ReservationStatus.PENDING]: [ReservationStatus.CONFIRMED, ReservationStatus.CANCELLED],
  [ReservationStatus.CONFIRMED]: [ReservationStatus.IN_PROGRESS, ReservationStatus.CANCELLED],
  [ReservationStatus.IN_PROGRESS]: [ReservationStatus.COMPLETED, ReservationStatus.CANCELLED],
  [ReservationStatus.COMPLETED]: [],
  [ReservationStatus.CANCELLED]: []
};

// Utilitários
export const canTransitionTo = (from: ReservationStatus, to: ReservationStatus): boolean => {
  return AllowedStatusTransitions[from].includes(to);
};

export const getStatusBadgeClasses = (status: ReservationStatus): string => {
  const colors = StatusColors[status];
  return `${colors.bg} ${colors.text} ${colors.border}`;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDateTime = (dateString: string): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
};

export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(dateString));
};

export const formatTime = (dateString: string): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
};

export const calculateDuration = (startTime: string, endTime: string): number => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60); // retorna em horas
}; 