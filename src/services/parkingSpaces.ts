import api from './api';

export interface Vaga {
  id: string;
  numero: string;
  tipo: 'normal' | 'preferencial' | 'carga';
  status: 'disponivel' | 'ocupada' | 'reservada' | 'manutencao';
  estacionamentoId: string;
  estacionamentoNome?: string;
  precoHora: number;
}

const ParkingSpaceService = {
  // Buscar todas as vagas
  getAll: async (): Promise<Vaga[]> => {
    try {
      console.log('Tentando buscar vagas...');
      
      const response = await api.get('/parking-spaces', { timeout: 8000 });
      console.log('Vagas obtidas com sucesso!', response.data.length);
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar vagas:', error);
      throw error;
    }
  },

  // Buscar vagas por estacionamento
  getByEstacionamento: async (estacionamentoId: string): Promise<Vaga[]> => {
    try {
      console.log(`Tentando buscar vagas do estacionamento ${estacionamentoId}...`);
      
      const response = await api.get(`/parking-spaces/estacionamento/${estacionamentoId}`, { timeout: 8000 });
      console.log('Vagas do estacionamento obtidas com sucesso!', response.data.length);
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar vagas do estacionamento:', error);
      throw error;
    }
  },

  // Buscar vaga por ID
  getById: async (id: string): Promise<Vaga> => {
    try {
      console.log(`Tentando buscar vaga ${id}...`);
      
      const response = await api.get(`/parking-spaces/${id}`, { timeout: 8000 });
      console.log('Vaga obtida com sucesso!');
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar vaga:', error);
      throw error;
    }
  },

  // Criar vaga
  create: async (vaga: Omit<Vaga, 'id'>): Promise<Vaga> => {
    try {
      console.log('Tentando criar vaga...', vaga);
      
      const response = await api.post('/parking-spaces', vaga, { timeout: 8000 });
      console.log('Vaga criada com sucesso!');
      
      return response.data;
    } catch (error) {
      console.error('Erro ao criar vaga:', error);
      throw error;
    }
  },

  // Atualizar vaga
  update: async (id: string, vaga: Partial<Vaga>): Promise<Vaga> => {
    try {
      console.log(`Tentando atualizar vaga ${id}...`, vaga);
      
      const response = await api.put(`/parking-spaces/${id}`, vaga, { timeout: 8000 });
      console.log('Vaga atualizada com sucesso!');
      
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar vaga:', error);
      throw error;
    }
  },

  // Deletar vaga
  delete: async (id: string): Promise<void> => {
    try {
      console.log(`Tentando deletar vaga ${id}...`);
      
      await api.delete(`/parking-spaces/${id}`, { timeout: 8000 });
      console.log('Vaga deletada com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar vaga:', error);
      throw error;
    }
  },

  // Buscar vagas disponíveis
  getDisponiveis: async (estacionamentoId?: string): Promise<Vaga[]> => {
    try {
      console.log('Tentando buscar vagas disponíveis...', { estacionamentoId });
      
      const params: any = { status: 'disponivel' };
      if (estacionamentoId) params.estacionamentoId = estacionamentoId;
      
      const response = await api.get('/parking-spaces/disponiveis', { params, timeout: 8000 });
      console.log('Vagas disponíveis obtidas com sucesso!', response.data.length);
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar vagas disponíveis:', error);
      throw error;
    }
  }
};

export default ParkingSpaceService; 