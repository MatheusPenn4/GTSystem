import api from './api';

export interface Estacionamento {
  id: string;
  nome: string;
  endereco: string;
  vagas: number;
  vagasOcupadas: number;
  precoHora: number;
  status: 'ativo' | 'inativo';
  empresaId?: string;
  empresaNome?: string;
}

const EstacionamentoService = {
  // Buscar todos os estacionamentos
  getAll: async (): Promise<Estacionamento[]> => {
    try {
      console.log('Tentando buscar estacionamentos...');
      
      const response = await api.get('/estacionamentos', { timeout: 8000 });
      console.log('Estacionamentos obtidos com sucesso!', response.data.length);
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estacionamentos:', error);
      throw error;
    }
  },

  // Buscar estacionamento por ID
  getById: async (id: string): Promise<Estacionamento> => {
    try {
      console.log(`Tentando buscar estacionamento ${id}...`);
      
      const response = await api.get(`/estacionamentos/${id}`, { timeout: 8000 });
      console.log('Estacionamento obtido com sucesso!');
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estacionamento:', error);
      throw error;
    }
  },

  // Criar estacionamento
  create: async (estacionamento: Omit<Estacionamento, 'id' | 'vagasOcupadas'>): Promise<Estacionamento> => {
    try {
      console.log('Tentando criar estacionamento...', estacionamento);
      
      const response = await api.post('/estacionamentos', estacionamento, { timeout: 8000 });
      console.log('Estacionamento criado com sucesso!');
      
      return response.data;
    } catch (error) {
      console.error('Erro ao criar estacionamento:', error);
      throw error;
    }
  },

  // Atualizar estacionamento
  update: async (id: string, estacionamento: Partial<Estacionamento>): Promise<Estacionamento> => {
    try {
      console.log(`Tentando atualizar estacionamento ${id}...`, estacionamento);
      
      const response = await api.put(`/estacionamentos/${id}`, estacionamento, { timeout: 8000 });
      console.log('Estacionamento atualizado com sucesso!');
      
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar estacionamento:', error);
      throw error;
    }
  },

  // Deletar estacionamento
  delete: async (id: string): Promise<void> => {
    try {
      console.log(`Tentando deletar estacionamento ${id}...`);
      
      await api.delete(`/estacionamentos/${id}`, { timeout: 8000 });
      console.log('Estacionamento deletado com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar estacionamento:', error);
      throw error;
    }
  }
};

export default EstacionamentoService;