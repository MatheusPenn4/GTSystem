import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ajh-darker flex items-center justify-center">
        <div className="glass-effect p-8 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-ajh-primary border-t-transparent"></div>
            <span className="text-white">Verificando autenticação...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('Usuário não autenticado. Redirecionando para login.');
    return <Navigate to="/login" replace />;
  }

  const path = location.pathname;
  
  if (!user) {
    console.log('Usuário autenticado, mas sem dados de perfil.');
    return <Navigate to="/login" replace />;
  }

  console.log('Verificando acesso para:', { role: user.role, path });
  
  if (user.role === 'admin') {
    const estacionamentoOnlyRoutes = ['/meu-estacionamento'];
    if (estacionamentoOnlyRoutes.includes(path)) {
      console.log('Admin tentando acessar rota exclusiva de estacionamento');
      return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
  }
  
  if (user.role === 'transportadora') {
    const transportadoraAllowedRoutes = [
      '/dashboard', 
      '/veiculos', 
      '/motoristas', 
      '/reserva-vagas', 
      '/minhas-reservas',
      '/relatorios',
      '/configuracoes'
    ];
    
    if (!transportadoraAllowedRoutes.some(route => path.startsWith(route))) {
      console.log('Transportadora tentando acessar rota não permitida:', path);
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  if (user.role === 'estacionamento') {
    const estacionamentoAllowedRoutes = [
      '/dashboard', 
      '/meu-estacionamento', 
      '/minhas-vagas',
      '/reservas-recebidas',
      '/relatorios',
      '/configuracoes'
    ];
    
    if (!estacionamentoAllowedRoutes.some(route => path.startsWith(route))) {
      console.log('Estacionamento tentando acessar rota não permitida:', path);
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default PrivateRoute;
