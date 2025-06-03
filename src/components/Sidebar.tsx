
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
  MapPin
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { logout, user, isAdmin, isTransportadora, isEstacionamento } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      { icon: Home, label: 'Dashboard', path: '/dashboard' }
    ];

    if (isAdmin()) {
      return [
        ...baseItems,
        { icon: Building2, label: 'Empresas', path: '/empresas' },
        { icon: Car, label: 'Veículos', path: '/veiculos' },
        { icon: Users, label: 'Motoristas', path: '/motoristas' },
        { icon: MapPin, label: 'Estacionamentos', path: '/estacionamentos' },
        { icon: ParkingCircle, label: 'Monitoramento', path: '/estacionamento' },
        { icon: BarChart3, label: 'Relatórios', path: '/relatorios' },
        { icon: Settings, label: 'Configurações', path: '/configuracoes' },
      ];
    }

    if (isTransportadora()) {
      return [
        ...baseItems,
        { icon: Car, label: 'Meus Veículos', path: '/veiculos' },
        { icon: Users, label: 'Meus Motoristas', path: '/motoristas' },
        { icon: ParkingCircle, label: 'Estacionamentos', path: '/estacionamento' },
        { icon: BarChart3, label: 'Relatórios', path: '/relatorios' },
        { icon: Settings, label: 'Configurações', path: '/configuracoes' },
      ];
    }

    if (isEstacionamento()) {
      return [
        ...baseItems,
        { icon: ParkingCircle, label: 'Meu Estacionamento', path: '/estacionamento' },
        { icon: BarChart3, label: 'Relatórios', path: '/relatorios' },
        { icon: Settings, label: 'Configurações', path: '/configuracoes' },
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  const getUserTypeLabel = () => {
    switch (user?.role) {
      case 'admin':
        return 'Sistema AJH';
      case 'transportadora':
        return 'Transportadora';
      case 'estacionamento':
        return 'Estacionamento';
      default:
        return 'Sistema';
    }
  };

  const getUserTypeColor = () => {
    switch (user?.role) {
      case 'admin':
        return 'from-ajh-primary to-ajh-secondary';
      case 'transportadora':
        return 'from-blue-500 to-blue-600';
      case 'estacionamento':
        return 'from-green-500 to-green-600';
      default:
        return 'from-ajh-primary to-ajh-secondary';
    }
  };

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
              <div className={`w-8 h-8 bg-gradient-to-r ${getUserTypeColor()} rounded-lg flex items-center justify-center`}>
                <span className="text-white font-bold text-sm">
                  {user?.role === 'admin' ? 'AJH' : user?.role === 'transportadora' ? 'T' : 'E'}
                </span>
              </div>
              <div>
                <span className="text-white font-semibold text-sm">{getUserTypeLabel()}</span>
                <p className="text-slate-400 text-xs">{user?.name}</p>
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

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="mb-3 p-3 bg-slate-800/50 rounded-lg">
            <p className="text-slate-400 text-xs">Logado como:</p>
            <p className="text-white text-sm font-medium">{user?.email}</p>
            <p className="text-slate-500 text-xs capitalize">{user?.role}</p>
          </div>
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
