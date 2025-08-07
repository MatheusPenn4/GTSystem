import api from './api';

export interface Veiculo {
  id: string;
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  cor: string;
  tipo: 'caminhao' | 'carreta' | 'van' | 'carro';
  status: 'ativo' | 'inativo' | 'manutencao';
  motoristaId?: string;
  motoristaNome?: string;
  empresaId?: string;
  empresaNome?: string;
}

const VeiculoService = {
  // Buscar todos os veículos
  getAll: async (): Promise<Veiculo[]> => {
    try {
      console.log('Tentando buscar veículos...');
      
      const response = await api.get('/veiculos', { timeout: 8000 });
      console.log('Veículos obtidos com sucesso!', response.data.length);
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
      throw error;
    }
  },

  // Buscar veículo por ID
  getById: async (id: string): Promise<Veiculo> => {
    try {
      console.log(`Tentando buscar veículo ${id}...`);
      
      const response = await api.get(`/veiculos/${id}`, { timeout: 8000 });
      console.log('Veículo obtido com sucesso!');
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar veículo:', error);
      throw error;
    }
  },

  // Criar veículo
  create: async (veiculo: Omit<Veiculo, 'id'>): Promise<Veiculo> => {
    try {
      console.log('Tentando criar veículo...', veiculo);
      
      const response = await api.post('/veiculos', veiculo, { timeout: 8000 });
      console.log('Veículo criado com sucesso!');
      
      return response.data;
    } catch (error) {
      console.error('Erro ao criar veículo:', error);
      throw error;
    }
  },

  // Atualizar veículo
  update: async (id: string, veiculo: Partial<Veiculo>): Promise<Veiculo> => {
    try {
      console.log(`Tentando atualizar veículo ${id}...`, veiculo);
      
      const response = await api.put(`/veiculos/${id}`, veiculo, { timeout: 8000 });
      console.log('Veículo atualizado com sucesso!');
      
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
      throw error;
    }
  },

  // Deletar veículo
  delete: async (id: string): Promise<void> => {
    try {
      console.log(`Tentando deletar veículo ${id}...`);
      
      await api.delete(`/veiculos/${id}`, { timeout: 8000 });
      console.log('Veículo deletado com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar veículo:', error);
      throw error;
    }
  },

  // Buscar veículos por empresa
  getByEmpresa: async (empresaId: string): Promise<Veiculo[]> => {
    try {
      console.log(`Tentando buscar veículos da empresa ${empresaId}...`);
      
      const response = await api.get(`/veiculos/empresa/${empresaId}`, { timeout: 8000 });
      console.log('Veículos da empresa obtidos com sucesso!', response.data.length);
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar veículos da empresa:', error);
      throw error;
    }
  },

  // Buscar veículos por tipo
  getByTipo: async (tipo: string): Promise<Veiculo[]> => {
    try {
      console.log(`Tentando buscar veículos do tipo ${tipo}...`);
      
      const response = await api.get(`/veiculos/tipo/${tipo}`, { timeout: 8000 });
      console.log('Veículos por tipo obtidos com sucesso!', response.data.length);
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar veículos por tipo:', error);
      throw error;
    }
  },

  // Buscar veículos por motorista
  getByMotorista: async (motoristaId: string): Promise<Veiculo[]> => {
    try {
      console.log(`Tentando buscar veículos do motorista ${motoristaId}...`);
      
      const response = await api.get(`/veiculos/motorista/${motoristaId}`, { timeout: 8000 });
      console.log('Veículos do motorista obtidos com sucesso!', response.data.length);
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar veículos do motorista:', error);
      throw error;
    }
  }
};

export default VeiculoService; 