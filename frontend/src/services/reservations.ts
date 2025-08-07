import api from './api';

export interface Reserva {
  id: string;
  estacionamentoId: string;
  estacionamentoNome?: string;
  veiculoId: string;
  veiculoPlaca?: string;
  motoristaId: string;
  motoristaNome?: string;
  dataEntrada: string;
  dataSaida: string;
  status: 'pendente' | 'confirmada' | 'ativa' | 'concluida' | 'cancelada';
  valor: number;
  observacoes?: string;
}

const ReservationService = {
  // Buscar todas as reservas
  getAll: async (): Promise<Reserva[]> => {
    try {
      console.log('Tentando buscar reservas...');
      
      const response = await api.get('/reservations', { timeout: 8000 });
      console.log('Reservas obtidas com sucesso!', response.data.length);
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      throw error;
    }
  },

  // Buscar reserva por ID
  getById: async (id: string): Promise<Reserva> => {
    try {
      console.log(`Tentando buscar reserva ${id}...`);
      
      const response = await api.get(`/reservations/${id}`, { timeout: 8000 });
      console.log('Reserva obtida com sucesso!');
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar reserva:', error);
      throw error;
    }
  },

  // Criar reserva
  create: async (reserva: Omit<Reserva, 'id'>): Promise<Reserva> => {
    try {
      console.log('Tentando criar reserva...', reserva);
      
      const response = await api.post('/reservations', reserva, { timeout: 8000 });
      console.log('Reserva criada com sucesso!');
      
      return response.data;
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      throw error;
    }
  },

  // Atualizar reserva
  update: async (id: string, reserva: Partial<Reserva>): Promise<Reserva> => {
    try {
      console.log(`Tentando atualizar reserva ${id}...`, reserva);
      
      const response = await api.put(`/reservations/${id}`, reserva, { timeout: 8000 });
      console.log('Reserva atualizada com sucesso!');
      
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar reserva:', error);
      throw error;
    }
  },

  // Deletar reserva
  delete: async (id: string): Promise<void> => {
    try {
      console.log(`Tentando deletar reserva ${id}...`);
      
      await api.delete(`/reservations/${id}`, { timeout: 8000 });
      console.log('Reserva deletada com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar reserva:', error);
      throw error;
    }
  },

  // Buscar reservas por status
  getByStatus: async (status: string): Promise<Reserva[]> => {
    try {
      console.log(`Tentando buscar reservas com status ${status}...`);
      
      const response = await api.get(`/reservations/status/${status}`, { timeout: 8000 });
      console.log('Reservas por status obtidas com sucesso!', response.data.length);
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar reservas por status:', error);
      throw error;
    }
  },

  // Confirmar reserva
  confirm: async (id: string): Promise<Reserva> => {
    try {
      console.log(`Tentando confirmar reserva ${id}...`);
      
      const response = await api.put(`/reservations/${id}/confirm`, {}, { timeout: 8000 });
      console.log('Reserva confirmada com sucesso!');
      
      return response.data;
    } catch (error) {
      console.error('Erro ao confirmar reserva:', error);
      throw error;
    }
  },

  // Cancelar reserva
  cancel: async (id: string): Promise<Reserva> => {
    try {
      console.log(`Tentando cancelar reserva ${id}...`);
      
      const response = await api.put(`/reservations/${id}/cancel`, {}, { timeout: 8000 });
      console.log('Reserva cancelada com sucesso!');
      
      return response.data;
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
      throw error;
    }
  }
};

export default ReservationService; 