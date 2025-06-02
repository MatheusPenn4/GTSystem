
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-ajh-darker flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-ajh rounded-2xl mb-8">
          <span className="text-white font-bold text-2xl">AJH</span>
        </div>

        {/* 404 Text */}
        <div className="space-y-4">
          <h1 className="text-8xl font-bold bg-gradient-to-r from-ajh-primary via-ajh-secondary to-ajh-accent bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-3xl font-bold text-white">
            Página não encontrada
          </h2>
          <p className="text-slate-400 text-lg">
            Ops! A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="ajh-button-primary">
            <Link to="/dashboard">
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Link>
          </Button>
          <Button asChild className="ajh-button-secondary" onClick={() => window.history.back()}>
            <span className="cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Página Anterior
            </span>
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 p-6 bg-slate-800/30 rounded-xl border border-slate-700/50">
          <h3 className="text-white font-semibold mb-3">Precisa de ajuda?</h3>
          <p className="text-slate-400 text-sm mb-4">
            Se você acredita que isso é um erro, entre em contato com o suporte técnico.
          </p>
          <div className="space-y-2 text-sm">
            <p className="text-slate-500">
              <span className="text-slate-400">E-mail:</span> suporte@ajh-sistema.com
            </p>
            <p className="text-slate-500">
              <span className="text-slate-400">Telefone:</span> (11) 99999-9999
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
