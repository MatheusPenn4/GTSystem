import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Array<'admin' | 'transportadora' | 'estacionamento'>;
  redirectTo?: string;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ 
  children, 
  allowedRoles, 
  redirectTo = '/dashboard' 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ajh-darker flex items-center justify-center">
        <div className="glass-effect p-8 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-ajh-primary border-t-transparent"></div>
            <span className="text-white">Verificando permissões...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    console.log('RoleProtectedRoute: Usuário não autenticado, redirecionando para login');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(user.role)) {
    console.log(`RoleProtectedRoute: Acesso negado. Role '${user.role}' não está em [${allowedRoles.join(', ')}]`);
    
    // Redirecionamento inteligente baseado no role do usuário
    const getRedirectPath = () => {
      switch (user.role) {
        case 'admin':
          return '/dashboard';
        case 'transportadora':
          return '/dashboard';
        case 'estacionamento':
          return '/dashboard';
        default:
          return '/dashboard';
      }
    };

    return <Navigate to={getRedirectPath()} replace />;
  }

  console.log(`RoleProtectedRoute: Acesso permitido para role '${user.role}'`);
  return <>{children}</>;
};

export default RoleProtectedRoute; 