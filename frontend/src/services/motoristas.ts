import api from '@/lib/api';

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
      if (cpfDigits.length !== 11) {
        throw new Error('CPF deve conter 11 dígitos numéricos');
      }
      
      // Verificar se CNH tem pelo menos 9 dígitos
      const cnhDigits = motorista.cnh.replace(/\D/g, '');
      if (cnhDigits.length < 9 || cnhDigits.length > 11) {
        throw new Error('CNH deve conter entre 9 e 11 dígitos');
      }
      
      // Mapear dados do frontend para o formato do backend
      const backendData = {
        name: motorista.nome,
        cpf: cpfDigits, // Envia apenas os dígitos
        cnh: cnhDigits, // Envia apenas os dígitos
        phone: motorista.telefone || '',
        email: motorista.email || '',
        companyId: motorista.empresaId,
        isActive: motorista.status === 'ativo' || true
      };
      
      console.log('Dados enviados para o backend:', backendData);
      
      const response = await api.post('/motoristas', backendData, { timeout: 8000 });
      console.log('Motorista criado com sucesso no backend!', response.data);
      
      // Mapear resposta do backend para o formato do frontend
      return mapToFrontend(response.data);
    } catch (error: any) {
      console.error('Erro ao criar motorista:', error);
      
      // Melhor tratamento de erros
      if (error.response) {
        // O servidor respondeu com um status diferente de 2xx
        console.error('Resposta de erro:', error.response.data);
        
        // Se houver mensagens de erro específicas, exibi-las
        if (error.response.data && error.response.data.errors) {
          const errors = error.response.data.errors;
          const errorMessages = errors.map((err: any) => err.message || err).join(', ');
          throw new Error(`Dados inválidos: ${errorMessages}`);
        }
        
        const errorMessage = error.response.data?.message || 'Erro ao criar motorista';
        throw new Error(errorMessage);
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        console.error('Request sem resposta:', error.request);
        throw new Error('Servidor não respondeu. Verifique sua conexão.');
      } else {
        // Outros erros
        console.error('Erro:', error.message);
        throw error;
      }
    }
  },

  // Atualizar um motorista existente
  update: async (id: string, motorista: Partial<Motorista>): Promise<Motorista> => {
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
      if (motorista.telefone) backendData.phone = motorista.telefone;
      if (motorista.email) backendData.email = motorista.email;
      if (motorista.status) backendData.isActive = motorista.status === 'ativo';
      
      const response = await api.put(`/motoristas/${id}`, backendData, { timeout: 5000 });
      console.log('Motorista atualizado com sucesso no backend!');
      
      // Mapear resposta do backend para o formato do frontend
      return mapToFrontend(response.data);
    } catch (error: any) {
      console.error(`Erro ao atualizar motorista com ID ${id}:`, error);
      
      // Melhor tratamento de erros
      if (error.response) {
        // O servidor respondeu com um status diferente de 2xx
        const errorMessage = error.response.data?.message || 'Erro ao atualizar motorista';
        throw new Error(errorMessage);
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        throw new Error('Servidor não respondeu. Verifique sua conexão.');
      } else {
        // Outros erros
        throw error;
      }
    }
  },

  // Excluir um motorista
  delete: async (id: string): Promise<void> => {
    try {
      console.log(`Tentando excluir motorista ${id} no backend...`);
      
      // Verificar se o servidor está disponível
      const isServerAvailable = await checkServerAvailability();
      if (!isServerAvailable) {
        throw new Error('Servidor indisponível');
      }
      
      await api.delete(`/motoristas/${id}`, { timeout: 5000 });
      console.log('Motorista excluído com sucesso no backend!');
    } catch (error: any) {
      console.error(`Erro ao excluir motorista com ID ${id}:`, error);
      
      // Melhor tratamento de erros
      if (error.response) {
        // O servidor respondeu com um status diferente de 2xx
        const errorMessage = error.response.data?.message || 'Erro ao excluir motorista';
        throw new Error(errorMessage);
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        throw new Error('Servidor não respondeu. Verifique sua conexão.');
      } else {
        // Outros erros
        throw error;
      }
    }
  }
};

// Função auxiliar para verificar se o servidor está disponível
const checkServerAvailability = async (): Promise<boolean> => {
  try {
    await api.get('/health', { timeout: 3000 });
    return true;
  } catch (error) {
    console.warn('Servidor backend indisponível:', error);
    return false;
  }
};

// Função para mapear dados do backend para o formato do frontend
const mapToFrontend = (driver: DriverBackend): Motorista => {
  // Determinar status baseado no isActive
  const status = driver.isActive ? 'ativo' : 'inativo';
  
  return {
    id: driver.id || '',
    nome: driver.name || '',
    cpf: driver.cpf || '',
    cnh: driver.cnh || '',
    telefone: driver.phone || '',
    email: driver.email || '',
    empresaId: driver.companyId || '',
    empresaNome: driver.company?.name || '',
    status: status,
    dataCadastro: driver.createdAt || new Date().toISOString()
  };
};

// Função para retornar dados mockados consistentes
const getMockMotoristas = (): Motorista[] => {
  return [
    {
      id: '1',
      nome: 'João Silva',
      cpf: '123.456.789-00',
      cnh: '12345678901',
      categoria: 'D',
      validadeCnh: '2025-12-15',
      telefone: '(11) 99999-9999',
      email: 'joao@email.com',
      empresaId: '1',
      empresaNome: 'Transportadora ABC',
      status: 'ativo',
      dataCadastro: '2023-01-10'
    },
    {
      id: '2',
      nome: 'Maria Santos',
      cpf: '987.654.321-00',
      cnh: '10987654321',
      categoria: 'C',
      validadeCnh: '2024-08-20',
      telefone: '(11) 88888-8888',
      email: 'maria@email.com',
      empresaId: '1',
      empresaNome: 'Transportadora ABC',
      status: 'ativo',
      dataCadastro: '2023-02-15'
    },
    {
      id: '3',
      nome: 'Carlos Oliveira',
      cpf: '456.789.123-00',
      cnh: '56789012345',
      categoria: 'C',
      validadeCnh: '2024-03-10',
      telefone: '(11) 77777-7777',
      email: 'carlos@email.com',
      empresaId: '2',
      empresaNome: 'LogisTech Express',
      status: 'inativo',
      dataCadastro: '2023-03-01'
    }
  ];
};

export default MotoristaService; 