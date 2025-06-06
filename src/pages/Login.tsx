
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
    
    setIsLoading(false);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-start p-4 relative overflow-hidden"
      style={{
        backgroundImage: 'url(/lovable-uploads/98a3ae25-5c5f-40dc-937c-bac066e4da8a.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'right center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay tecnológico com gradiente e efeitos */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent"></div>
      
      {/* Efeitos tecnológicos */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-ajh-primary/10 to-ajh-secondary/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ajh-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-ajh-secondary/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      {/* Grid tecnológico */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      <div className="w-full max-w-md relative z-10 ml-8 lg:ml-16">
        <div className="glass-effect p-6 rounded-2xl border border-slate-700/50 backdrop-blur-lg bg-slate-900/90 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-32 h-32 flex items-center justify-center mx-auto mb-3">
              <img 
                src="/lovable-uploads/924cf0eb-5f16-4ed6-b99f-4fd14ee98d4b.png" 
                alt="GTSystem Logo" 
                className="w-28 h-28 object-contain drop-shadow-lg"
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-1 gradient-text">GTSystem</h1>
            <p className="text-slate-300 text-lg mb-1">Sistema de Estacionamento</p>
            <p className="text-slate-400 text-sm">Faça login para continuar</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-slate-300 text-sm">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ajh-input h-11"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-slate-300 text-sm">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ajh-input h-11"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full ajh-button-primary h-11 mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-slate-500 text-xs">
              © 2024 GTSystem - Sistema de Estacionamento
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
