
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'transportadora' | 'estacionamento';
  avatar?: string;
  empresaId?: string; // Para transportadoras
  estacionamentoId?: string; // Para estacionamentos
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  isTransportadora: () => boolean;
  isEstacionamento: () => boolean;
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
      const userType = localStorage.getItem('ajh_user_type') || 'admin';
      
      if (token) {
        // Dados simulados baseados no tipo de usuário
        let userData: User;
        
        switch (userType) {
          case 'transportadora':
            userData = {
              id: '2',
              name: 'Gestor Transportadora',
              email: 'gestor@transportadora.com',
              role: 'transportadora',
              empresaId: 'emp_001',
              permissions: ['view_own_vehicles', 'manage_own_drivers', 'view_parking_availability'],
              avatar: '/api/placeholder/40/40'
            };
            break;
          case 'estacionamento':
            userData = {
              id: '3',
              name: 'Gestor Estacionamento',
              email: 'gestor@estacionamento.com',
              role: 'estacionamento',
              estacionamentoId: 'park_001',
              permissions: ['manage_own_parking', 'view_own_occupancy', 'manage_parking_spots'],
              avatar: '/api/placeholder/40/40'
            };
            break;
          default: // admin
            userData = {
              id: '1',
              name: 'Admin AJH',
              email: 'admin@ajh.com',
              role: 'admin',
              permissions: ['manage_all', 'view_all', 'admin_access'],
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
      
      // Lógica de login simulada baseada no email
      let userType: 'admin' | 'transportadora' | 'estacionamento' = 'admin';
      let userData: User;
      
      if (email.includes('transportadora')) {
        userType = 'transportadora';
        userData = {
          id: '2',
          name: 'Gestor Transportadora',
          email: email,
          role: 'transportadora',
          empresaId: 'emp_001',
          permissions: ['view_own_vehicles', 'manage_own_drivers', 'view_parking_availability'],
          avatar: '/api/placeholder/40/40'
        };
      } else if (email.includes('estacionamento')) {
        userType = 'estacionamento';
        userData = {
          id: '3',
          name: 'Gestor Estacionamento',
          email: email,
          role: 'estacionamento',
          estacionamentoId: 'park_001',
          permissions: ['manage_own_parking', 'view_own_occupancy', 'manage_parking_spots'],
          avatar: '/api/placeholder/40/40'
        };
      } else if (email === 'admin@ajh.com' && password === 'admin123') {
        userData = {
          id: '1',
          name: 'Admin AJH',
          email: 'admin@ajh.com',
          role: 'admin',
          permissions: ['manage_all', 'view_all', 'admin_access'],
          avatar: '/api/placeholder/40/40'
        };
      } else {
        toast({
          title: "Erro no login",
          description: "Credenciais inválidas. Teste: admin@ajh.com/admin123, gestor@transportadora.com/123456, gestor@estacionamento.com/123456",
          variant: "destructive",
        });
        return false;
      }
      
      if (password === 'admin123' || password === '123456') {
        const token = `token_${userType}_${Date.now()}`;
        
        localStorage.setItem('ajh_token', token);
        localStorage.setItem('ajh_user_type', userType);
        setUser(userData);
        
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo, ${userData.name}`,
        });
        
        return true;
      } else {
        toast({
          title: "Erro no login",
          description: "Senha incorreta",
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

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission) || user.permissions.includes('manage_all');
  };

  const isAdmin = (): boolean => {
    return user?.role === 'admin';
  };

  const isTransportadora = (): boolean => {
    return user?.role === 'transportadora';
  };

  const isEstacionamento = (): boolean => {
    return user?.role === 'estacionamento';
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
    hasPermission,
    isAdmin,
    isTransportadora,
    isEstacionamento,
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
