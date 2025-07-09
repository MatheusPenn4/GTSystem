import api from '@/lib/api';

export interface Reservation {
  id: string;
  parkingLotId: string;
  companyId: string;
  vehicleId: string;
  driverId: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  totalCost: number;
  paymentStatus: 'PENDING' | 'PAID' | 'CANCELLED';
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
  
  // Dados relacionados para exibição
  parkingLot?: {
    id: string;
    name: string;
    address: string;
    pricePerHour: number;
  };
  company?: {
    id: string;
    name: string;
    cnpj: string;
  };
  vehicle?: {
    id: string;
    plate: string;
    model: string;
    type: string;
  };
  driver?: {
    id: string;
    name: string;
    cnh: string;
  };
}

const ReservationService = {
  // Buscar reservas da transportadora atual
  getMyReservations: async (): Promise<Reservation[]> => {
    try {
      console.log('Carregando reservas reais do banco de dados...');
      
      const response = await api.get('/reservations/my-reservations', {
        timeout: 8000
      });
      
      console.log('Reservas carregadas com sucesso!', response.data.length);
      return response.data.map(mapToFrontend);
    } catch (error: any) {
      console.error('Erro ao buscar reservas:', error);
      
      if (error.response?.status === 404) {
        console.warn('Endpoint de reservas não implementado ainda no backend');
        return [];
      }
      throw error;
    }
  },

  // Buscar reservas recebidas pelo estacionamento
  getReceivedReservations: async (): Promise<Reservation[]> => {
    try {
      console.log('Carregando reservas recebidas do banco de dados...');
      
      const response = await api.get('/reservations/received', {
        timeout: 8000
      });
      
      console.log('Reservas recebidas carregadas com sucesso!', response.data.length);
      return response.data.map(mapToFrontend);
    } catch (error: any) {
      console.error('Erro ao buscar reservas recebidas:', error);
      
      if (error.response?.status === 404) {
        console.warn('Endpoint de reservas recebidas não implementado ainda no backend');
        return [];
      }
      throw error;
    }
  },

  // Criar uma nova reserva
  createReservation: async (reservationData: {
    parkingLotId: string;
    vehicleId: string;
    driverId: string;
    startTime: string;
    endTime: string;
    specialRequests?: string;
  }): Promise<Reservation> => {
    try {
      console.log('Criando nova reserva...', reservationData);
      
      const response = await api.post('/reservations', reservationData, {
        timeout: 8000
      });
      
      console.log('Reserva criada com sucesso!');
      return mapToFrontend(response.data);
    } catch (error: any) {
      console.error('Erro ao criar reserva:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Funcionalidade de criação de reservas ainda não implementada no backend');
      }
      throw error;
    }
  },

  // Atualizar status de uma reserva
  updateReservationStatus: async (reservationId: string, newStatus: string): Promise<Reservation> => {
    try {
      console.log('Atualizando status da reserva...', { reservationId, newStatus });
      
      const response = await api.put(`/reservations/${reservationId}/status`, {
        status: newStatus
      }, {
        timeout: 8000
      });
      
      console.log('Status da reserva atualizado com sucesso!');
      return mapToFrontend(response.data);
    } catch (error: any) {
      console.error('Erro ao atualizar status da reserva:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Funcionalidade de atualização de status ainda não implementada no backend');
      }
      throw error;
    }
  },

  // Cancelar uma reserva
  cancelReservation: async (reservationId: string, reason?: string): Promise<void> => {
    try {
      console.log('Cancelando reserva...', { reservationId, reason });
      
      await api.put(`/reservations/${reservationId}/cancel`, {
        reason
      }, {
        timeout: 8000
      });
      
      console.log('Reserva cancelada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao cancelar reserva:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Funcionalidade de cancelamento ainda não implementada no backend');
      }
      throw error;
    }
  },

  // Buscar uma reserva específica
  getById: async (reservationId: string): Promise<Reservation> => {
    try {
      console.log('Carregando dados da reserva...', { reservationId });
      
      const response = await api.get(`/reservations/${reservationId}`, {
        timeout: 8000
      });
      
      console.log('Dados da reserva carregados com sucesso!');
      return mapToFrontend(response.data);
    } catch (error: any) {
      console.error('Erro ao buscar reserva:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Reserva não encontrada');
      }
      throw error;
    }
  },

  // Buscar reservas por filtros
  getReservationsByFilter: async (filters: {
    status?: string;
    startDate?: string;
    endDate?: string;
    parkingLotId?: string;
    companyId?: string;
  }): Promise<Reservation[]> => {
    try {
      console.log('Carregando reservas filtradas...', filters);
      
      const response = await api.get('/reservations/filter', {
        params: filters,
        timeout: 8000
      });
      
      console.log('Reservas filtradas carregadas com sucesso!', response.data.length);
      return response.data.map(mapToFrontend);
    } catch (error: any) {
      console.error('Erro ao buscar reservas filtradas:', error);
      
      if (error.response?.status === 404) {
        console.warn('Endpoint de filtros não implementado ainda no backend');
        return [];
      }
      throw error;
    }
  }
};

// Função para mapear dados do backend para o formato do frontend
const mapToFrontend = (reservation: any): Reservation => {
  return {
    id: reservation.id,
    parkingLotId: reservation.parkingLotId,
    companyId: reservation.companyId,
    vehicleId: reservation.vehicleId,
    driverId: reservation.driverId,
    startTime: reservation.startTime,
    endTime: reservation.endTime,
    status: reservation.status,
    totalCost: reservation.totalCost || 0,
    paymentStatus: reservation.paymentStatus || 'PENDING',
    specialRequests: reservation.specialRequests,
    createdAt: reservation.createdAt,
    updatedAt: reservation.updatedAt,
    
    // Dados relacionados
    parkingLot: reservation.parkingLot ? {
      id: reservation.parkingLot.id,
      name: reservation.parkingLot.name,
      address: reservation.parkingLot.address,
      pricePerHour: reservation.parkingLot.pricePerHour || 0
    } : undefined,
    
    company: reservation.company ? {
      id: reservation.company.id,
      name: reservation.company.name,
      cnpj: reservation.company.cnpj
    } : undefined,
    
    vehicle: reservation.vehicle ? {
      id: reservation.vehicle.id,
      plate: reservation.vehicle.plate,
      model: reservation.vehicle.model,
      type: reservation.vehicle.type
    } : undefined,
    
    driver: reservation.driver ? {
      id: reservation.driver.id,
      name: reservation.driver.name,
      cnh: reservation.driver.cnh
    } : undefined
  };
};

export default ReservationService; 