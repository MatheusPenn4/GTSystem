
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'transportadora' | 'estacionamento';
  avatar?: string;
  companyId?: string;
  companyName?: string;
}

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
      const userType = localStorage.getItem('ajh_user_type');
      if (token && userType) {
        // Simulated user data based on type
        let userData: User;
        
        switch (userType) {
          case 'admin':
            userData = {
              id: '1',
              name: 'Admin AJH',
              email: 'admin@ajh.com',
              role: 'admin',
              avatar: '/api/placeholder/40/40'
            };
            break;
          case 'transportadora':
            userData = {
              id: '2',
              name: 'Transportadora ABC',
              email: 'transportadora@abc.com',
              role: 'transportadora',
              companyId: 'transp-001',
              companyName: 'Transportadora ABC Ltda',
              avatar: '/api/placeholder/40/40'
            };
            break;
          case 'estacionamento':
            userData = {
              id: '3',
              name: 'Estacionamento Central',
              email: 'estacionamento@central.com',
              role: 'estacionamento',
              companyId: 'park-001',
              companyName: 'Estacionamento Central',
              avatar: '/api/placeholder/40/40'
            };
            break;
          default:
            userData = {
              id: '1',
              name: 'Admin AJH',
              email: 'admin@ajh.com',
              role: 'admin',
              avatar: '/api/placeholder/40/40'
            };
        }
        
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('ajh_token');
      localStorage.removeItem('ajh_user_type');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulated login validation with different user types
      let userData: User | null = null;
      let userType = '';
      
      if (email === 'admin@ajh.com' && password === 'admin123') {
        userData = {
          id: '1',
          name: 'Admin AJH',
          email: 'admin@ajh.com',
          role: 'admin',
          avatar: '/api/placeholder/40/40'
        };
        userType = 'admin';
      } else if (email === 'transportadora@abc.com' && password === 'transp123') {
        userData = {
          id: '2',
          name: 'Transportadora ABC',
          email: 'transportadora@abc.com',
          role: 'transportadora',
          companyId: 'transp-001',
          companyName: 'Transportadora ABC Ltda',
          avatar: '/api/placeholder/40/40'
        };
        userType = 'transportadora';
      } else if (email === 'estacionamento@central.com' && password === 'park123') {
        userData = {
          id: '3',
          name: 'Estacionamento Central',
          email: 'estacionamento@central.com',
          role: 'estacionamento',
          companyId: 'park-001',
          companyName: 'Estacionamento Central',
          avatar: '/api/placeholder/40/40'
        };
        userType = 'estacionamento';
      }
      
      if (userData) {
        const token = 'simulated_jwt_token_12345';
        localStorage.setItem('ajh_token', token);
        localStorage.setItem('ajh_user_type', userType);
        setUser(userData);
        
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo de volta, ${userData.name}`,
        });
        
        return true;
      } else {
        toast({
          title: "Erro no login",
          description: "Credenciais inválidas. Tente admin@ajh.com/admin123, transportadora@abc.com/transp123 ou estacionamento@central.com/park123",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('ajh_token');
    localStorage.removeItem('ajh_user_type');
    setUser(null);
    navigate('/login');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
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
