import api from './api';

export interface Motorista {
  id: string;
  nome: string;
  cpf: string;
  cnh: string;
  categoria?: string;
  validadeCnh?: string;
  telefone: string;
  email: string;
  empresaId: string;
  empresaNome?: string;
  status: 'ativo' | 'inativo';
  dataCadastro: string;
}

// Interface do backend para mapeamento
interface DriverBackend {
  id: string;
  name: string;
  cpf: string;
  cnh: string;
  phone: string;
  email: string;
  companyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  company?: {
    name: string;
  };
  _count?: {
    reservations: number;
  };
}

const MotoristaService = {
  // Buscar todos os motoristas
  getAll: async (): Promise<Motorista[]> => {
    try {
      console.log('Tentando buscar dados reais de motoristas...');
      
      // Verificar se o servidor está disponível
      const isServerAvailable = await checkServerAvailability();
      if (!isServerAvailable) {
        throw new Error('Servidor indisponível');
      }
      
      const response = await api.get('/motoristas', { timeout: 5000 });
      
      // Mapear dados do backend para o formato do frontend
      const motoristas = response.data.map((driver: DriverBackend) => mapToFrontend(driver));
      console.log('Dados reais de motoristas obtidos com sucesso!', motoristas.length);
      return motoristas;
    } catch (error) {
      console.error('Erro ao buscar motoristas:', error);
      throw error; // Remover fallback para dados mockados
    }
  },

  // Buscar um motorista pelo ID
  getById: async (id: string): Promise<Motorista> => {
    try {
      console.log(`Tentando buscar dados reais do motorista ${id}...`);
      
      // Verificar se o servidor está disponível
      const isServerAvailable = await checkServerAvailability();
      if (!isServerAvailable) {
        throw new Error('Servidor indisponível');
      }
      
      const response = await api.get(`/motoristas/${id}`, { timeout: 5000 });
      console.log('Dados reais do motorista obtidos com sucesso!');
      
      // Mapear dados do backend para o formato do frontend
      return mapToFrontend(response.data);
    } catch (error) {
      console.error(`Erro ao buscar motorista com ID ${id}:`, error);
      throw error; // Remover fallback para dados mockados
    }
  },

  // Criar um novo motorista
  create: async (motorista: Omit<Motorista, 'id' | 'dataCadastro' | 'empresaNome'>): Promise<Motorista> => {
    try {
      console.log('Tentando criar motorista no backend...', motorista);
      
      // Verificar se o servidor está disponível
      const isServerAvailable = await checkServerAvailability();
      if (!isServerAvailable) {
        throw new Error('Servidor indisponível');
      }
      
      // Validar campos obrigatórios antes de enviar
      if (!motorista.nome || !motorista.cpf || !motorista.cnh || !motorista.empresaId) {
        throw new Error('Campos obrigatórios ausentes. Verifique nome, CPF, CNH e empresa.');
      }
      
      // Verificar se CPF tem pelo menos 11 dígitos após remover formatação
      const cpfDigits = motorista.cpf.replace(/\D/g, '');
      if (cpfDigits.length < 11) {
        throw new Error('CPF inválido. Deve ter pelo menos 11 dígitos.');
      }
      
      // Verificar se CNH tem pelo menos 9 dígitos após remover formatação
      const cnhDigits = motorista.cnh.replace(/\D/g, '');
      if (cnhDigits.length < 9) {
        throw new Error('CNH inválida. Deve ter pelo menos 9 dígitos.');
      }
      
      // Mapear dados do frontend para o formato do backend
      const backendData = {
        name: motorista.nome,
        cpf: motorista.cpf.replace(/\D/g, ''), // Remover formatação
        cnh: motorista.cnh.replace(/\D/g, ''), // Remover formatação
        phone: motorista.telefone.replace(/\D/g, ''), // Remover formatação
        email: motorista.email,
        companyId: motorista.empresaId,
      };
      
      console.log('Dados enviados para o backend:', backendData);
      
      const response = await api.post('/motoristas', backendData, { timeout: 5000 });
      console.log('Motorista criado com sucesso no backend!', response.data);
      
      // Mapear resposta do backend para o formato do frontend
      return mapToFrontend(response.data);
    } catch (error: any) {
      console.error('Erro ao criar motorista:', error);
      
      // Mostrar detalhes mais específicos sobre o erro
      if (error.response) {
        console.error('Resposta de erro:', error.response.data);
        
        if (error.response.data && error.response.data.errors) {
          const errors = error.response.data.errors;
          const errorMessages = errors.map((err: any) => err.message || err).join(', ');
          throw new Error(`Dados inválidos: ${errorMessages}`);
        }
        
        if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
        
        throw new Error(`Erro ${error.response.status}: ${error.response.statusText}`);
      }
      
      if (error.request) {
        throw new Error('Servidor não está respondendo. Verifique sua conexão.');
      }
      
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error('Tempo limite excedido. Tente novamente.');
      }
      
      throw new Error('Erro inesperado ao criar motorista.');
    }
  },

  // Atualizar um motorista existente
  update: async (id: string, motorista: Partial<Omit<Motorista, 'id' | 'dataCadastro' | 'empresaNome'>>): Promise<Motorista> => {
    try {
      console.log(`Tentando atualizar motorista ${id} no backend...`, motorista);
      
      // Verificar se o servidor está disponível
      const isServerAvailable = await checkServerAvailability();
      if (!isServerAvailable) {
        throw new Error('Servidor indisponível');
      }
      
      // Mapear dados do frontend para o formato do backend
      const backendData: any = {};
      
      if (motorista.nome) backendData.name = motorista.nome;
      if (motorista.cpf) backendData.cpf = motorista.cpf.replace(/\D/g, '');
      if (motorista.cnh) backendData.cnh = motorista.cnh.replace(/\D/g, '');
      if (motorista.telefone) backendData.phone = motorista.telefone.replace(/\D/g, '');
      if (motorista.email) backendData.email = motorista.email;
      if (motorista.empresaId) backendData.companyId = motorista.empresaId;
      if (motorista.status !== undefined) backendData.isActive = motorista.status === 'ativo';
      
      console.log('Dados enviados para o backend:', backendData);
      
      const response = await api.put(`/motoristas/${id}`, backendData, { timeout: 5000 });
      console.log('Motorista atualizado com sucesso no backend!', response.data);
      
      // Mapear resposta do backend para o formato do frontend
      return mapToFrontend(response.data);
    } catch (error: any) {
      console.error(`Erro ao atualizar motorista ${id}:`, error);
      
      if (error.response) {
        console.error('Resposta de erro:', error.response.data);
        
        if (error.response.data && error.response.data.errors) {
          const errors = error.response.data.errors;
          const errorMessages = errors.map((err: any) => err.message || err).join(', ');
          throw new Error(`Dados inválidos: ${errorMessages}`);
        }
        
        if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
        
        throw new Error(`Erro ${error.response.status}: ${error.response.statusText}`);
      }
      
      if (error.request) {
        throw new Error('Servidor não está respondendo. Verifique sua conexão.');
      }
      
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error('Tempo limite excedido. Tente novamente.');
      }
      
      throw new Error('Erro inesperado ao atualizar motorista.');
    }
  },

  // Deletar um motorista
  delete: async (id: string): Promise<void> => {
    try {
      console.log(`Tentando deletar motorista ${id} no backend...`);
      
      // Verificar se o servidor está disponível
      const isServerAvailable = await checkServerAvailability();
      if (!isServerAvailable) {
        throw new Error('Servidor indisponível');
      }
      
      await api.delete(`/motoristas/${id}`, { timeout: 5000 });
      console.log('Motorista deletado com sucesso no backend!');
    } catch (error: any) {
      console.error(`Erro ao deletar motorista ${id}:`, error);
      
      if (error.response) {
        console.error('Resposta de erro:', error.response.data);
        
        if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
        
        throw new Error(`Erro ${error.response.status}: ${error.response.statusText}`);
      }
      
      if (error.request) {
        throw new Error('Servidor não está respondendo. Verifique sua conexão.');
      }
      
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error('Tempo limite excedido. Tente novamente.');
      }
      
      throw new Error('Erro inesperado ao deletar motorista.');
    }
  },

  // Buscar motoristas por empresa
  getByCompany: async (companyId: string): Promise<Motorista[]> => {
    try {
      console.log(`Tentando buscar motoristas da empresa ${companyId}...`);
      
      // Verificar se o servidor está disponível
      const isServerAvailable = await checkServerAvailability();
      if (!isServerAvailable) {
        throw new Error('Servidor indisponível');
      }
      
      const response = await api.get(`/motoristas/company/${companyId}`, { timeout: 5000 });
      console.log('Motoristas da empresa obtidos com sucesso no backend!', response.data.length);
      
      return response.data.map((driver: DriverBackend) => mapToFrontend(driver));
    } catch (error) {
      console.error(`Erro ao buscar motoristas da empresa ${companyId}:`, error);
      throw error;
    }
  },

  // Ativar/desativar um motorista
  toggleStatus: async (id: string, isActive: boolean): Promise<Motorista> => {
    try {
      console.log(`Tentando ${isActive ? 'ativar' : 'desativar'} motorista ${id} no backend...`);
      
      // Verificar se o servidor está disponível
      const isServerAvailable = await checkServerAvailability();
      if (!isServerAvailable) {
        throw new Error('Servidor indisponível');
      }
      
      const response = await api.patch(`/motoristas/${id}/status`, { isActive }, { timeout: 5000 });
      console.log('Status do motorista atualizado com sucesso no backend!', response.data);
      
      return mapToFrontend(response.data);
    } catch (error: any) {
      console.error(`Erro ao alterar status do motorista ${id}:`, error);
      
      if (error.response) {
        console.error('Resposta de erro:', error.response.data);
        
        if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
        
        throw new Error(`Erro ${error.response.status}: ${error.response.statusText}`);
      }
      
      if (error.request) {
        throw new Error('Servidor não está respondendo. Verifique sua conexão.');
      }
      
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error('Tempo limite excedido. Tente novamente.');
      }
      
      throw new Error('Erro inesperado ao alterar status do motorista.');
    }
  }
};

// Função para verificar se o servidor está disponível
const checkServerAvailability = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health', { timeout: 3000 });
    return response.status === 200;
  } catch (error) {
    console.error('Servidor não está respondendo:', error);
    return false;
  }
};

// Função para mapear dados do backend para o formato do frontend
const mapToFrontend = (driver: DriverBackend): Motorista => {
  return {
    id: driver.id,
    nome: driver.name,
    cpf: driver.cpf,
    cnh: driver.cnh,
    telefone: driver.phone,
    email: driver.email,
    empresaId: driver.companyId,
    empresaNome: driver.company?.name,
    status: driver.isActive ? 'ativo' : 'inativo',
    dataCadastro: driver.createdAt,
    categoria: undefined, // Não disponível no backend
    validadeCnh: undefined // Não disponível no backend
  };
};

// Dados mockados para fallback (não usado mais)
const getMockMotoristas = (): Motorista[] => {
  return [
    {
      id: '1',
      nome: 'João Silva',
      cpf: '123.456.789-00',
      cnh: '12345678901',
      categoria: 'E',
      validadeCnh: '2025-12-31',
      telefone: '(11) 99999-9999',
      email: 'joao.silva@email.com',
      empresaId: '1',
      empresaNome: 'Transportadora Modelo LTDA',
      status: 'ativo',
      dataCadastro: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      nome: 'Maria Santos',
      cpf: '987.654.321-00',
      cnh: '98765432109',
      categoria: 'E',
      validadeCnh: '2025-06-30',
      telefone: '(11) 88888-8888',
      email: 'maria.santos@email.com',
      empresaId: '1',
      empresaNome: 'Transportadora Modelo LTDA',
      status: 'ativo',
      dataCadastro: '2024-01-02T00:00:00Z'
    }
  ];
};

export default MotoristaService; 