import api from '@/lib/api';

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
        
        const errorMessage = error.response.data?.message || 'Erro ao criar usuário';
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

  // Atualizar um usuário existente
  update: async (id: string, user: Partial<User>): Promise<User> => {
    try {
      console.log(`Tentando atualizar usuário ${id} no backend...`, user);
      
      // Mapear dados do frontend para o formato do backend
      const backendData: any = {};
      
      if (user.name) backendData.name = user.name;
      if (user.email) backendData.email = user.email;
      if (user.avatar) backendData.avatarUrl = user.avatar;
      if (user.companyId) backendData.companyId = user.companyId;
      if (user.isActive !== undefined) backendData.isActive = user.isActive;
      
      const response = await api.put(`/users/${id}`, backendData, { timeout: 8000 });
      console.log('Usuário atualizado com sucesso no backend!');
      
      // Mapear resposta do backend para o formato do frontend
      return mapToFrontend(response.data);
    } catch (error) {
      console.error(`Erro ao atualizar usuário com ID ${id}:`, error);
      throw error;
    }
  },

  // Alterar o status de um usuário
  changeStatus: async (id: string, isActive: boolean): Promise<void> => {
    try {
      console.log(`Tentando alterar status do usuário ${id} no backend para ${isActive ? 'ativo' : 'inativo'}...`);
      
      await api.put(`/users/${id}`, { isActive }, { timeout: 8000 });
      console.log('Status do usuário alterado com sucesso no backend!');
    } catch (error) {
      console.error(`Erro ao alterar status do usuário com ID ${id}:`, error);
      throw error;
    }
  },

  // Excluir um usuário (exclusão lógica)
  delete: async (id: string): Promise<void> => {
    try {
      console.log(`Tentando excluir usuário ${id} no backend...`);
      
      await api.delete(`/users/${id}`, { timeout: 8000 });
      console.log('Usuário excluído com sucesso no backend!');
    } catch (error) {
      console.error(`Erro ao excluir usuário com ID ${id}:`, error);
      throw error;
    }
  },

  // Redefinir senha do usuário
  resetPassword: async (id: string, newPassword: string): Promise<void> => {
    try {
      console.log(`Tentando redefinir senha do usuário ${id} no backend...`);
      
      await api.post(`/users/${id}/reset-password`, { password: newPassword }, { timeout: 8000 });
      console.log('Senha redefinida com sucesso no backend!');
    } catch (error) {
      console.error(`Erro ao redefinir senha do usuário com ID ${id}:`, error);
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
    emailVerified: true, // O backend não tem este campo explicitamente, assumindo true
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export default UserService; 