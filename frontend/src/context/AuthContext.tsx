import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { endpoints, debugEndpoints, detectAuthEndpoint } from '../services/api';

interface User {
  id: number;
  email: string;
  name: string;
  username?: string; // Adicionar campo opcional username
  role?: string;
  firstName?: string; // Campos opcionais adicionais
  lastName?: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  const refreshToken = useCallback(async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) return false;

    try {
      const response = await api.post(endpoints.auth.refresh, {
        refresh,
      });

      const { access } = response.data;
      localStorage.setItem('access_token', access);
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      return true;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      logout();
      return false;
    }
  }, [logout]); // Adicionar logout como dependência

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const response = await api.get(endpoints.auth.profile);
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Token inválido:', error);
          const refreshed = await refreshToken();
          if (!refreshed) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [refreshToken, logout]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Debug endpoints (remover em produção)
      if (process.env.NODE_ENV === 'development') {
        await debugEndpoints();

        // Tentar detectar o endpoint correto automaticamente
        const detectedEndpoint = await detectAuthEndpoint();
        if (detectedEndpoint) {
          console.log('Usando endpoint detectado:', detectedEndpoint);
          // Temporariamente sobrescrever o endpoint
          endpoints.auth.login = detectedEndpoint;
        }
      }

      console.log('Tentando fazer login em:', endpoints.auth.login);

      // Tentar diferentes formatos de dados baseado no backend Django comum
      const loginAttempts = [
        // Formato 1: email/password
        { email, password },
        // Formato 2: username/password (caso o backend espere username)
        { username: email, password },
        // Formato 3: user/password
        { user: email, password },
      ];

      let lastError: unknown = null;

      for (const loginData of loginAttempts) {
        try {
          console.log('Tentando login com dados:', { ...loginData, password: '***' });

          const response = await api.post(endpoints.auth.login, loginData);

          console.log('Resposta do login:', response.data);

          // Adaptar para diferentes formatos de resposta
          const responseData = response.data;
          let accessToken, refreshToken, userData;

          // Formato DRF padrão
          if (responseData.access) {
            accessToken = responseData.access;
            refreshToken = responseData.refresh;
            userData = responseData.user;
          }
          // Formato django-rest-auth
          else if (responseData.key) {
            accessToken = responseData.key;
            refreshToken = responseData.refresh_token || responseData.key;
            userData = responseData.user;
          }
          // Formato custom
          else if (responseData.token) {
            accessToken = responseData.token;
            refreshToken = responseData.refresh_token || responseData.token;
            userData = responseData.user;
          }

          if (accessToken) {
            // Salvar tokens
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken || accessToken);

            // Configurar header de autorização
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

            setUser(userData || { email, name: email.split('@')[0] });
            setIsAuthenticated(true);

            return true;
          }
        } catch (attemptError) {
          lastError = attemptError;
          console.log('Tentativa falhou:', attemptError);
          // Continue para próxima tentativa
        }
      }

      // Se chegou aqui, todas as tentativas falharam
      throw lastError;
    } catch (err: unknown) {
      console.error('Erro de login:', err);

      let errorMessage = 'Erro interno do servidor';

      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as {
          response?: {
            status?: number;
            data?: { detail?: string; message?: string; error?: string };
          };
          message?: string;
        };

        if (axiosError.response?.status === 404) {
          errorMessage =
            'Endpoint de login não encontrado. Verifique se o backend está rodando corretamente.';
        } else if (axiosError.response?.status === 405) {
          errorMessage = 'Método não permitido. Verifique a configuração do endpoint de login.';
        } else if (axiosError.response?.status === 401) {
          errorMessage = 'Email ou senha incorretos';
        } else if (axiosError.response?.status === 400) {
          errorMessage =
            axiosError.response?.data?.detail ||
            axiosError.response?.data?.message ||
            axiosError.response?.data?.error ||
            'Dados inválidos';
        } else if (axiosError.message === 'Network Error') {
          errorMessage = 'Erro de conexão. Verifique se o servidor está rodando.';
        }
      }

      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
