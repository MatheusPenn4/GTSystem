import api from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'transportadora' | 'estacionamento';
  avatar?: string;
  companyId?: string;
  companyName?: string;
  isActive: boolean;
  emailVerified?: boolean;
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
}

// Interface do backend para mapeamento
interface UserBackend {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  companyId?: string;
  companyName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const UserService = {
  // Buscar todos os usuários (apenas admin)
  getAll: async (): Promise<User[]> => {
    try {
      console.log('Tentando buscar dados reais de usuários...');
      
      const response = await api.get('/users', { timeout: 8000 });
      console.log('Usuários obtidos com sucesso no backend!', response.data.length);
      
      // Mapear a resposta para o formato esperado pelo frontend
      return response.data.map(mapToFrontend);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error; // Remover fallback para dados mockados
    }
  },

  // Buscar um usuário pelo ID
  getById: async (id: string): Promise<User> => {
    try {
      console.log(`Tentando buscar dados reais do usuário ${id}...`);
      
      const response = await api.get(`/users/${id}`, { timeout: 8000 });
      console.log('Dados reais do usuário obtidos com sucesso!');
      
      // Mapear dados do backend para o formato do frontend
      return mapToFrontend(response.data);
    } catch (error) {
      console.error(`Erro ao buscar usuário com ID ${id}:`, error);
      throw error; // Remover fallback para dados mockados
    }
  },

  // Criar um novo usuário (apenas admin)
  create: async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'emailVerified'> & { password: string }): Promise<User> => {
    try {
      console.log('Tentando criar usuário no backend...', user);
      
      // Mapear dados do frontend para o formato do backend
      const backendData = {
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role.toUpperCase(), // Converter para uppercase conforme esperado pelo backend
        companyId: user.companyId || null,
        avatarUrl: user.avatar || null,
      };
      
      console.log('Dados enviados para o backend:', backendData);
      
      const response = await api.post('/users', backendData, { timeout: 8000 });
      console.log('Usuário criado com sucesso no backend!', response.data);
      
      // Mapear resposta do backend para o formato do frontend
      return mapToFrontend(response.data);
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      
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
        
        // Se houver uma mensagem de erro geral
        if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
        
        // Se não houver mensagem específica, usar o status
        throw new Error(`Erro ${error.response.status}: ${error.response.statusText}`);
      }
      
      // Se não houver resposta do servidor
      if (error.request) {
        throw new Error('Servidor não está respondendo. Verifique sua conexão.');
      }
      
      // Se for um erro de rede ou timeout
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error('Tempo limite excedido. Tente novamente.');
      }
      
      // Erro genérico
      throw new Error('Erro inesperado ao criar usuário.');
    }
  },

  // Atualizar um usuário existente (apenas admin)
  update: async (id: string, user: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'emailVerified'>>): Promise<User> => {
    try {
      console.log(`Tentando atualizar usuário ${id} no backend...`, user);
      
      // Mapear dados do frontend para o formato do backend
      const backendData = {
        name: user.name,
        email: user.email,
        role: user.role?.toUpperCase(), // Converter para uppercase se fornecido
        companyId: user.companyId || null,
        avatarUrl: user.avatar || null,
        isActive: user.isActive,
      };
      
      console.log('Dados enviados para o backend:', backendData);
      
      const response = await api.put(`/users/${id}`, backendData, { timeout: 8000 });
      console.log('Usuário atualizado com sucesso no backend!', response.data);
      
      // Mapear resposta do backend para o formato do frontend
      return mapToFrontend(response.data);
    } catch (error: any) {
      console.error(`Erro ao atualizar usuário ${id}:`, error);
      
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
      
      throw new Error('Erro inesperado ao atualizar usuário.');
    }
  },

  // Deletar um usuário (apenas admin)
  delete: async (id: string): Promise<void> => {
    try {
      console.log(`Tentando deletar usuário ${id} no backend...`);
      
      await api.delete(`/users/${id}`, { timeout: 8000 });
      console.log('Usuário deletado com sucesso no backend!');
    } catch (error: any) {
      console.error(`Erro ao deletar usuário ${id}:`, error);
      
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
      
      throw new Error('Erro inesperado ao deletar usuário.');
    }
  },

  // Ativar/desativar um usuário (apenas admin)
  toggleStatus: async (id: string, isActive: boolean): Promise<User> => {
    try {
      console.log(`Tentando ${isActive ? 'ativar' : 'desativar'} usuário ${id} no backend...`);
      
      const response = await api.patch(`/users/${id}/status`, { isActive }, { timeout: 8000 });
      console.log('Status do usuário atualizado com sucesso no backend!', response.data);
      
      return mapToFrontend(response.data);
    } catch (error: any) {
      console.error(`Erro ao alterar status do usuário ${id}:`, error);
      
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
      
      throw new Error('Erro inesperado ao alterar status do usuário.');
    }
  },

  // Buscar usuários por empresa (apenas admin)
  getByCompany: async (companyId: string): Promise<User[]> => {
    try {
      console.log(`Tentando buscar usuários da empresa ${companyId}...`);
      
      const response = await api.get(`/users/company/${companyId}`, { timeout: 8000 });
      console.log('Usuários da empresa obtidos com sucesso no backend!', response.data.length);
      
      return response.data.map(mapToFrontend);
    } catch (error) {
      console.error(`Erro ao buscar usuários da empresa ${companyId}:`, error);
      throw error;
    }
  },

  // Buscar usuários por role (apenas admin)
  getByRole: async (role: string): Promise<User[]> => {
    try {
      console.log(`Tentando buscar usuários com role ${role}...`);
      
      const response = await api.get(`/users/role/${role}`, { timeout: 8000 });
      console.log('Usuários por role obtidos com sucesso no backend!', response.data.length);
      
      return response.data.map(mapToFrontend);
    } catch (error) {
      console.error(`Erro ao buscar usuários com role ${role}:`, error);
      throw error;
    }
  }
};

// Função para mapear dados do backend para o formato do frontend
const mapToFrontend = (user: UserBackend): User => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role.toLowerCase() as 'admin' | 'transportadora' | 'estacionamento',
    avatar: user.avatar,
    companyId: user.companyId,
    companyName: user.companyName,
    isActive: user.isActive,
    emailVerified: true, // Assumir que usuários do backend são verificados
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLogin: undefined // Não disponível no backend por enquanto
  };
};

export default UserService; 