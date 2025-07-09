import api from '@/lib/api';

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
        // O servidor respondeu com um status diferente de 2xx
        console.error('Resposta de erro:', error.response.data);
        
        // Se houver mensagens de erro específicas, exibi-las
        if (error.response.data && error.response.data.errors) {
          const errors = error.response.data.errors;
          const errorMessages = errors.map((err: any) => err.message || err).join(', ');
          throw new Error(`Dados inválidos: ${errorMessages}`);
        }
        
        const errorMessage = error.response.data?.message || 'Erro ao criar empresa';
        throw new Error(errorMessage);
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        console.error('Request sem resposta:', error.request);
        throw new Error('Servidor não respondeu. Verifique sua conexão.');
      } else {
        // Outros erros
        console.error('Erro de configuração:', error.message);
        throw error;
      }
    }
  },

  // Atualizar uma empresa existente
  update: async (id: string, empresa: Partial<Empresa>): Promise<Empresa> => {
    try {
      console.log(`Tentando atualizar empresa ${id} no backend...`, empresa);
      
      // Mapear dados do frontend para o formato do backend
      const backendData: any = {};
      
      if (empresa.nome) backendData.name = empresa.nome;
      if (empresa.telefone) backendData.phone = empresa.telefone;
      if (empresa.email) backendData.email = empresa.email;
      if (empresa.endereco) backendData.address = empresa.endereco;
      if (empresa.status === 'ATIVO' || empresa.status === 'INATIVO') {
        backendData.isActive = empresa.status === 'ATIVO';
      }
      
      const response = await api.put(`/empresas/${id}`, backendData, { timeout: 8000 });
      console.log('Empresa atualizada com sucesso no backend!');
      
      // Mapear resposta do backend para o formato do frontend
      return mapToFrontend(response.data);
    } catch (error) {
      console.error(`Erro ao atualizar empresa com ID ${id}:`, error);
      throw error;
    }
  },

  // Alterar o status de uma empresa
  changeStatus: async (id: string, status: 'ATIVO' | 'INATIVO' | 'SUSPENSO'): Promise<void> => {
    try {
      console.log(`Tentando alterar status da empresa ${id} no backend para ${status}...`);
      
      // No backend, isActive é um boolean
      const isActive = status === 'ATIVO';
      
      await api.put(`/empresas/${id}`, { isActive }, { timeout: 8000 });
      console.log('Status da empresa alterado com sucesso no backend!');
    } catch (error) {
      console.error(`Erro ao alterar status da empresa com ID ${id}:`, error);
      throw error;
    }
  },

  // Excluir uma empresa
  delete: async (id: string): Promise<void> => {
    try {
      console.log(`Tentando excluir empresa ${id} no backend...`);
      
      await api.delete(`/empresas/${id}`, { timeout: 8000 });
      console.log('Empresa excluída com sucesso no backend!');
    } catch (error) {
      console.error(`Erro ao excluir empresa com ID ${id}:`, error);
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
    tipo: company.companyType as 'TRANSPORTADORA' | 'ESTACIONAMENTO',
    endereco: company.address,
    telefone: company.phone || '',
    email: company.email || '',
    status: company.isActive ? 'ATIVO' : 'INATIVO',
    dataCadastro: company.createdAt,
    responsavel: '', // O backend não tem este campo explicitamente
  };
};

// Função para retornar dados mockados consistentes
const getMockEmpresas = (): Empresa[] => {
  return [
    {
      id: '1',
      nome: 'Transportadora ABC',
      cnpj: '12.345.678/0001-90',
      tipo: 'TRANSPORTADORA',
      endereco: 'Av. Industrial, 1000',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '04001-000',
      telefone: '(11) 5555-1234',
      email: 'contato@transpabc.com.br',
      responsavel: 'Carlos Silva',
      status: 'ATIVO',
      dataCadastro: '2024-01-10',
      logo: '/logos/transportadora-abc.png'
    },
    {
      id: '2',
      nome: 'LogisTech Express',
      cnpj: '23.456.789/0001-12',
      tipo: 'TRANSPORTADORA',
      endereco: 'Rua das Indústrias, 456',
      cidade: 'Campinas',
      estado: 'SP',
      cep: '13087-000',
      telefone: '(19) 3333-4567',
      email: 'contato@logistech.com.br',
      responsavel: 'Ana Ferreira',
      status: 'ATIVO',
      dataCadastro: '2024-02-15'
    },
    {
      id: '3',
      nome: 'Estacionamento Central',
      cnpj: '34.567.890/0001-23',
      tipo: 'ESTACIONAMENTO',
      endereco: 'Rua Augusta, 789',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01305-000',
      telefone: '(11) 3333-7890',
      email: 'contato@estacionamentocentral.com.br',
      responsavel: 'João Oliveira',
      status: 'ATIVO',
      dataCadastro: '2024-03-05'
    }
  ];
};

export default EmpresaService; 