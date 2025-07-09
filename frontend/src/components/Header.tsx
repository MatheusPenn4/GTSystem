
import React, { useState } from 'react';
import { Search, Menu, User, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import NotificationBell from './NotificationBell';
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
        <NotificationBell />

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
