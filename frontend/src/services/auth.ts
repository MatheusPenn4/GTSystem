import api from '@/lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'transportadora' | 'estacionamento';
  avatar?: string;
  companyId?: string;
  companyName?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Dados mockados consistentes para todo o sistema
export const mockUsers = {
  admin: {
    id: 'admin-1234-5678-9012',
    name: 'Administrador',
    email: 'admin@gtsystem.com',
    role: 'admin' as const,
    avatar: null
  },
  transportadora: {
    id: 'transp-1234-5678-9012',
    name: 'Transportadora Modelo',
    email: 'usuario@transportadoramodelo.com.br',
    role: 'transportadora' as const,
    companyId: 'comp-transp-1234',
    companyName: 'Transportadora Modelo LTDA',
    avatar: null
  },
  estacionamento: {
    id: 'estac-1234-5678-9012',
    name: 'Estacionamento Seguro',
    email: 'usuario@estacionamentoseguro.com.br',
    role: 'estacionamento' as const,
    companyId: 'comp-estac-1234',
    companyName: 'Estacionamento Seguro S.A.',
    avatar: null
  }
};

const AuthService = {
  // Login de usuário
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      console.log('Tentando login com API:', { email });
      const response = await api.post('/auth/login', { email, password });
      console.log('Login bem-sucedido com API');
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error; // Usar apenas a API real
    }
  },

  // Logout de usuário
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('ajh_token');
      localStorage.removeItem('ajh_refresh_token');
      localStorage.removeItem('ajh_user_type');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, limpar o armazenamento local
      localStorage.removeItem('ajh_token');
      localStorage.removeItem('ajh_refresh_token');
      localStorage.removeItem('ajh_user_type');
      throw error;
    }
  },

  // Obter dados do usuário atual
  getCurrentUser: async (): Promise<User> => {
    try {
      console.log('Tentando obter dados do usuário da API');
      const response = await api.get('/auth/me');
      console.log('Dados do usuário obtidos com sucesso da API');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      throw error; // Usar apenas a API real
    }
  },

  // Renovar token
  refreshToken: async (refreshToken: string): Promise<{ token: string; refreshToken: string }> => {
    try {
      const response = await api.post('/auth/refresh-token', { refreshToken });
      return response.data;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      
      // Gerar novo token simulado em caso de falha
      return {
        token: 'new_mock_token_' + Date.now(),
        refreshToken: 'new_mock_refresh_token_' + Date.now()
      };
    }
  },

  // Atualizar perfil do usuário
  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  }
};

export default AuthService; 