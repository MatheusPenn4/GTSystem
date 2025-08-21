import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import AuthService, { User } from '@/services/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('ajh_token');
      if (token) {
        try {
          const userData = await AuthService.getCurrentUser();
          setUser(userData);
          localStorage.setItem('ajh_user_type', userData.role);
        } catch (error) {
          console.error('Erro ao verificar usuário:', error);
          
          // Se falhar, tenta usar um refresh token
          const refreshToken = localStorage.getItem('ajh_refresh_token');
          if (refreshToken) {
            try {
              const tokens = await AuthService.refreshToken(refreshToken);
              localStorage.setItem('ajh_token', tokens.token);
              localStorage.setItem('ajh_refresh_token', tokens.refreshToken);
              
              // Tenta obter os dados do usuário novamente
              const userData = await AuthService.getCurrentUser();
              setUser(userData);
              localStorage.setItem('ajh_user_type', userData.role);
            } catch (refreshError) {
              console.error('Erro ao renovar token:', refreshError);
              // Limpar dados inválidos
              localStorage.removeItem('ajh_token');
              localStorage.removeItem('ajh_refresh_token');
              localStorage.removeItem('ajh_user_type');
              setUser(null);
            }
          } else {
            // Sem token válido, limpar storage
            localStorage.removeItem('ajh_token');
            localStorage.removeItem('ajh_refresh_token');
            localStorage.removeItem('ajh_user_type');
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('ajh_token');
      localStorage.removeItem('ajh_refresh_token');
      localStorage.removeItem('ajh_user_type');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await AuthService.login(email, password);
      
      localStorage.setItem('ajh_token', response.token);
      localStorage.setItem('ajh_refresh_token', response.refreshToken);
      localStorage.setItem('ajh_user_type', response.user.role);
      
      setUser(response.user);
      
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo de volta, ${response.user.name}`,
      });
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      
      // Determinar mensagem de erro específica
      let errorMessage = "Ocorreu um erro inesperado. Tente novamente.";
      
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as any;
        if (apiError.response?.status === 401) {
          errorMessage = "Email ou senha inválidos.";
        } else if (apiError.response?.data?.error) {
          errorMessage = apiError.response.data.error;
        }
      }
      
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      localStorage.removeItem('ajh_token');
      localStorage.removeItem('ajh_refresh_token');
      localStorage.removeItem('ajh_user_type');
      setUser(null);
      navigate('/login');
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
