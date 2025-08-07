import api from '../lib/api';

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
      const newToken = `mock_refresh_${Date.now()}`;
      const newRefreshToken = `mock_refresh_${Date.now() + 1000}`;
      
      return {
        token: newToken,
        refreshToken: newRefreshToken
      };
    }
  },

  // Verificar se o token é válido
  isTokenValid: (token: string): boolean => {
    if (!token) return false;
    
    try {
      // Decodificar o token JWT (sem verificar assinatura)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return false;
    }
  },

  // Obter token do localStorage
  getToken: (): string | null => {
    return localStorage.getItem('ajh_token');
  },

  // Definir token no localStorage
  setToken: (token: string): void => {
    localStorage.setItem('ajh_token', token);
  },

  // Obter refresh token do localStorage
  getRefreshToken: (): string | null => {
    return localStorage.getItem('ajh_refresh_token');
  },

  // Definir refresh token no localStorage
  setRefreshToken: (refreshToken: string): void => {
    localStorage.setItem('ajh_refresh_token', refreshToken);
  },

  // Obter tipo de usuário do localStorage
  getUserType: (): string | null => {
    return localStorage.getItem('ajh_user_type');
  },

  // Definir tipo de usuário no localStorage
  setUserType: (userType: string): void => {
    localStorage.setItem('ajh_user_type', userType);
  },

  // Limpar todos os dados de autenticação
  clearAuth: (): void => {
    localStorage.removeItem('ajh_token');
    localStorage.removeItem('ajh_refresh_token');
    localStorage.removeItem('ajh_user_type');
  }
};

export default AuthService; 