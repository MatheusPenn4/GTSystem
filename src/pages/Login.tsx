
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
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: 'url(/lovable-uploads/98a3ae25-5c5f-40dc-937c-bac066e4da8a.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay para escurecer/desfocar o fundo */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="glass-effect p-8 rounded-2xl border border-slate-700/50 backdrop-blur-lg bg-slate-900/80">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <img 
                src="/lovable-uploads/c0ee3dc4-7d90-43b9-a2e0-7678b170d963.png" 
                alt="GTSystem Logo" 
                className="w-16 h-16 object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">GTSystem</h1>
            <p className="text-slate-300 text-lg mb-1">Sistema de Estacionamento</p>
            <p className="text-slate-400">Faça login para continuar</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ajh-input"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ajh-input"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full ajh-button-primary"
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
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              © 2024 GTSystem - Sistema de Estacionamento
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
