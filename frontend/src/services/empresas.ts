import api from './api';

export interface Empresa {
  id: string;
  nome: string;
  cnpj: string;
  tipo: 'TRANSPORTADORA' | 'ESTACIONAMENTO';
  endereco: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  telefone: string;
  email: string;
  responsavel?: string;
  status: 'ATIVO' | 'INATIVO' | 'SUSPENSO';
  dataCadastro: string;
  logo?: string;
}

// Interface do backend para mapeamento
interface CompanyBackend {
  id: string;
  name: string;
  cnpj: string;
  companyType: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const EmpresaService = {
  // Buscar todas as empresas
  getAll: async (): Promise<Empresa[]> => {
    try {
      console.log('Tentando buscar dados reais de empresas...');
      
      const response = await api.get('/empresas', { timeout: 8000 });
      console.log('Empresas obtidas com sucesso no backend!', response.data.length);
      
      // Mapear a resposta para o formato esperado pelo frontend
      return response.data.map(mapToFrontend);
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      throw error; // Remover fallback para dados mockados
    }
  },

  // Buscar uma empresa pelo ID
  getById: async (id: string): Promise<Empresa> => {
    try {
      console.log(`Tentando buscar dados reais da empresa ${id}...`);
      
      const response = await api.get(`/empresas/${id}`, { timeout: 8000 });
      console.log('Dados reais da empresa obtidos com sucesso!');
      
      // Mapear dados do backend para o formato do frontend
      return mapToFrontend(response.data);
    } catch (error) {
      console.error(`Erro ao buscar empresa com ID ${id}:`, error);
      throw error; // Remover fallback para dados mockados
    }
  },

  // Criar uma nova empresa
  create: async (empresa: Omit<Empresa, 'id' | 'dataCadastro'>): Promise<Empresa> => {
    try {
      console.log('Tentando criar empresa no backend...', empresa);
      
      // Mapear dados do frontend para o formato do backend
      const backendData = {
        name: empresa.nome,
        cnpj: empresa.cnpj.replace(/[^\d]/g, ''), // Remove caracteres não numéricos
        companyType: empresa.tipo.toLowerCase(), // Converter para lowercase conforme esperado pelo backend
        address: empresa.endereco || '',
        phone: empresa.telefone || '',
        email: empresa.email || '',
        isActive: true
      };

      // Validar dados antes de enviar
      if (!backendData.name) {
        throw new Error('Nome da empresa é obrigatório');
      }
      if (!backendData.cnpj || backendData.cnpj.length !== 14) {
        throw new Error('CNPJ deve conter 14 dígitos');
      }
      if (!backendData.companyType) {
        throw new Error('Tipo de empresa é obrigatório');
      }
      
      console.log('Dados enviados para o backend:', backendData);
      
      const response = await api.post('/empresas', backendData, { timeout: 8000 });
      console.log('Empresa criada com sucesso no backend!', response.data);
      
      // Mapear resposta do backend para o formato do frontend
      return mapToFrontend(response.data);
    } catch (error: any) {
      console.error('Erro ao criar empresa:', error);
      
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
      
      throw new Error('Erro inesperado ao criar empresa.');
    }
  },

  // Atualizar uma empresa existente
  update: async (id: string, empresa: Partial<Omit<Empresa, 'id' | 'dataCadastro'>>): Promise<Empresa> => {
    try {
      console.log(`Tentando atualizar empresa ${id} no backend...`, empresa);
      
      // Mapear dados do frontend para o formato do backend
      const backendData: any = {};
      
      if (empresa.nome) backendData.name = empresa.nome;
      if (empresa.cnpj) backendData.cnpj = empresa.cnpj.replace(/[^\d]/g, '');
      if (empresa.tipo) backendData.companyType = empresa.tipo.toLowerCase();
      if (empresa.endereco) backendData.address = empresa.endereco;
      if (empresa.telefone) backendData.phone = empresa.telefone;
      if (empresa.email) backendData.email = empresa.email;
      if (empresa.status !== undefined) backendData.isActive = empresa.status === 'ATIVO';
      
      console.log('Dados enviados para o backend:', backendData);
      
      const response = await api.put(`/empresas/${id}`, backendData, { timeout: 8000 });
      console.log('Empresa atualizada com sucesso no backend!', response.data);
      
      // Mapear resposta do backend para o formato do frontend
      return mapToFrontend(response.data);
    } catch (error: any) {
      console.error(`Erro ao atualizar empresa ${id}:`, error);
      
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
      
      throw new Error('Erro inesperado ao atualizar empresa.');
    }
  },

  // Deletar uma empresa
  delete: async (id: string): Promise<void> => {
    try {
      console.log(`Tentando deletar empresa ${id} no backend...`);
      
      await api.delete(`/empresas/${id}`, { timeout: 8000 });
      console.log('Empresa deletada com sucesso no backend!');
    } catch (error: any) {
      console.error(`Erro ao deletar empresa ${id}:`, error);
      
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
      
      throw new Error('Erro inesperado ao deletar empresa.');
    }
  },

  // Ativar/desativar uma empresa
  toggleStatus: async (id: string, isActive: boolean): Promise<Empresa> => {
    try {
      console.log(`Tentando ${isActive ? 'ativar' : 'desativar'} empresa ${id} no backend...`);
      
      const response = await api.patch(`/empresas/${id}/status`, { isActive }, { timeout: 8000 });
      console.log('Status da empresa atualizado com sucesso no backend!', response.data);
      
      return mapToFrontend(response.data);
    } catch (error: any) {
      console.error(`Erro ao alterar status da empresa ${id}:`, error);
      
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
      
      throw new Error('Erro inesperado ao alterar status da empresa.');
    }
  },

  // Buscar empresas por tipo
  getByType: async (tipo: string): Promise<Empresa[]> => {
    try {
      console.log(`Tentando buscar empresas do tipo ${tipo}...`);
      
      const response = await api.get(`/empresas/type/${tipo.toLowerCase()}`, { timeout: 8000 });
      console.log('Empresas por tipo obtidas com sucesso no backend!', response.data.length);
      
      return response.data.map(mapToFrontend);
    } catch (error) {
      console.error(`Erro ao buscar empresas do tipo ${tipo}:`, error);
      throw error;
    }
  }
};

// Função para mapear dados do backend para o formato do frontend
const mapToFrontend = (company: CompanyBackend): Empresa => {
  return {
    id: company.id,
    nome: company.name,
    cnpj: company.cnpj,
    tipo: company.companyType.toUpperCase() as 'TRANSPORTADORA' | 'ESTACIONAMENTO',
    endereco: company.address,
    telefone: company.phone,
    email: company.email,
    status: company.isActive ? 'ATIVO' : 'INATIVO',
    dataCadastro: company.createdAt,
    cidade: undefined, // Não disponível no backend
    estado: undefined, // Não disponível no backend
    cep: undefined, // Não disponível no backend
    responsavel: undefined, // Não disponível no backend
    logo: undefined // Não disponível no backend
  };
};

// Dados mockados para fallback (não usado mais)
const getMockEmpresas = (): Empresa[] => {
  return [
    {
      id: '1',
      nome: 'Transportadora Modelo LTDA',
      cnpj: '12.345.678/0001-90',
      tipo: 'TRANSPORTADORA',
      endereco: 'Rua das Flores, 123 - São Paulo/SP',
      telefone: '(11) 99999-9999',
      email: 'contato@transportadoramodelo.com.br',
      status: 'ATIVO',
      dataCadastro: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      nome: 'Estacionamento Seguro S.A.',
      cnpj: '98.765.432/0001-10',
      tipo: 'ESTACIONAMENTO',
      endereco: 'Av. Principal, 456 - São Paulo/SP',
      telefone: '(11) 88888-8888',
      email: 'contato@estacionamentoseguro.com.br',
      status: 'ATIVO',
      dataCadastro: '2024-01-02T00:00:00Z'
    }
  ];
};

export default EmpresaService; 