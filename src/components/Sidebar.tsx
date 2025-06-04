
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
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Building2, label: 'Empresas', path: '/empresas' },
    { icon: Car, label: 'Veículos', path: '/veiculos' },
    { icon: Users, label: 'Motoristas', path: '/motoristas' },
    { icon: ParkingCircle, label: 'Estacionamento', path: '/estacionamento' },
    { icon: Calendar, label: 'Reserva de Vagas', path: '/reserva-vagas' },
    { icon: BarChart3, label: 'Relatórios', path: '/relatorios' },
    { icon: Settings, label: 'Configurações', path: '/configuracoes' },
  ];

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
              <span className="text-white font-semibold text-lg">Sistema</span>
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
