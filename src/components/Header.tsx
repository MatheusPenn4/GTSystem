
import React, { useState } from 'react';
import { Bell, Search, Menu, User, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: 'Nova reserva confirmada',
      message: 'Veículo ABC-1234 reservou vaga 15',
      time: '5 min atrás',
      type: 'success',
      read: false
    },
    {
      id: 2,
      title: 'Pagamento recebido',
      message: 'R$ 25,00 creditado na conta',
      time: '1 hora atrás',
      type: 'info',
      read: false
    },
    {
      id: 3,
      title: 'Vaga liberada',
      message: 'Vaga 8 está disponível novamente',
      time: '2 horas atrás',
      type: 'warning',
      read: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const markAsRead = (id: number) => {
    console.log('Marcando notificação como lida:', id);
    // Aqui você implementaria a lógica para marcar como lida
  };

  return (
    <header className="h-16 bg-ajh-dark/80 backdrop-blur-sm border-b border-slate-700/50 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-slate-400 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="hidden md:flex items-center space-x-4 bg-slate-800/50 rounded-lg px-4 py-2 min-w-96">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar empresas, veículos, motoristas..."
            className="bg-transparent border-none outline-none text-white placeholder:text-slate-400 flex-1"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={handleNotificationClick}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50"
          >
            <Bell className="w-5 h-5" />
          </button>
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
              {unreadCount}
            </Badge>
          )}

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 top-12 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <h3 className="text-white font-medium">Notificações</h3>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-slate-700/50 hover:bg-slate-700/30 cursor-pointer ${
                      !notification.read ? 'bg-slate-700/20' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-white text-sm font-medium mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-slate-400 text-xs mb-2">
                          {notification.message}
                        </p>
                        <span className="text-slate-500 text-xs">
                          {notification.time}
                        </span>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-700">
                <button className="text-ajh-primary text-sm hover:text-ajh-secondary transition-colors">
                  Ver todas as notificações
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-ajh-primary text-white">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-white text-sm font-medium">{user?.name}</p>
                <p className="text-slate-400 text-xs">{user?.role}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-slate-700">
            <DropdownMenuLabel className="text-white">Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer">
              <User className="w-4 h-4 mr-2" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer">
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem 
              onClick={logout}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
            >
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
