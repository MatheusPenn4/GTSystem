import api from './api';

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

const AuthService = {
  // Login de usuário
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await api.post('/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  },

  // Logout de usuário
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Continuar com o logout mesmo com erro
    } finally {
      localStorage.removeItem('ajh_token');
      localStorage.removeItem('ajh_refresh_token');
      localStorage.removeItem('ajh_user_type');
    }
  },

  // Obter dados do usuário atual
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      throw error;
    }
  },

  // Renovar token
  refreshToken: async (refreshToken: string): Promise<{ token: string; refreshToken: string }> => {
    try {
      const response = await api.post('/auth/refresh-token', { refreshToken });
      return response.data;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      throw error;
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