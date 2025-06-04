
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Car, 
  Users, 
  ParkingCircle, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { logout, user } = useAuth();

  // Menu items baseados no tipo de usuário
  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { icon: Home, label: 'Dashboard', path: '/dashboard' },
          { icon: Building2, label: 'Estacionamentos', path: '/estacionamentos-cadastrados' },
          { icon: Building2, label: 'Empresas', path: '/empresas' },
          { icon: Car, label: 'Veículos', path: '/veiculos' },
          { icon: Users, label: 'Motoristas', path: '/motoristas' },
          { icon: BarChart3, label: 'Relatórios', path: '/relatorios' },
          { icon: Settings, label: 'Configurações', path: '/configuracoes' },
        ];
      
      case 'transportadora':
        return [
          { icon: Home, label: 'Dashboard', path: '/dashboard' },
          { icon: Car, label: 'Meus Veículos', path: '/veiculos' },
          { icon: Users, label: 'Meus Motoristas', path: '/motoristas' },
          { icon: Calendar, label: 'Reservar Vagas', path: '/reserva-vagas' },
          { icon: Clock, label: 'Minhas Reservas', path: '/minhas-reservas' },
          { icon: BarChart3, label: 'Relatórios', path: '/relatorios' },
          { icon: Settings, label: 'Configurações', path: '/configuracoes' },
        ];
      
      case 'estacionamento':
        return [
          { icon: Home, label: 'Dashboard', path: '/dashboard' },
          { icon: ParkingCircle, label: 'Minhas Vagas', path: '/estacionamento' },
          { icon: Calendar, label: 'Reservas', path: '/reservas-recebidas' },
          { icon: MapPin, label: 'Meu Estacionamento', path: '/meu-estacionamento' },
          { icon: BarChart3, label: 'Relatórios', path: '/relatorios' },
          { icon: Settings, label: 'Configurações', path: '/configuracoes' },
        ];
      
      default:
        return [
          { icon: Home, label: 'Dashboard', path: '/dashboard' },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-ajh-dark border-r border-slate-700/50 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-ajh rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AJH</span>
              </div>
              <div>
                <span className="text-white font-semibold text-lg">Sistema</span>
                {user?.role && (
                  <p className="text-slate-400 text-xs capitalize">
                    {user.role === 'admin' ? 'Administrador' : 
                     user.role === 'transportadora' ? 'Transportadora' : 'Estacionamento'}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        {user && (
          <div className="p-4 border-t border-slate-700/50">
            <div className="bg-slate-800/50 rounded-lg p-3 mb-3">
              <p className="text-white text-sm font-medium">{user.name}</p>
              <p className="text-slate-400 text-xs">{user.email}</p>
              {user.companyName && (
                <p className="text-slate-500 text-xs mt-1">{user.companyName}</p>
              )}
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="p-4 border-t border-slate-700/50">
          <button
            onClick={logout}
            className="sidebar-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
