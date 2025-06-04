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

  const handleDemoLogin = (userType: 'admin' | 'transportadora' | 'estacionamento') => {
    switch (userType) {
      case 'admin':
        setEmail('admin@ajh.com');
        setPassword('admin123');
        break;
      case 'transportadora':
        setEmail('transportadora@abc.com');
        setPassword('transp123');
        break;
      case 'estacionamento':
        setEmail('estacionamento@central.com');
        setPassword('park123');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-ajh-darker flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass-effect p-8 rounded-2xl border border-slate-700/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-ajh rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">AJH</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Sistema de Estacionamento</h1>
            <p className="text-slate-400">Faça login para continuar</p>
          </div>

          {/* Demo Accounts */}
          <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <h3 className="text-white text-sm font-medium mb-3">Contas de Demonstração:</h3>
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-left justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => handleDemoLogin('admin')}
              >
                👨‍💼 Admin: admin@ajh.com / admin123
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-left justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => handleDemoLogin('transportadora')}
              >
                🚛 Transportadora: transportadora@abc.com / transp123
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-left justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => handleDemoLogin('estacionamento')}
              >
                🅿️ Estacionamento: estacionamento@central.com / park123
              </Button>
            </div>
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
              © 2024 AJH Sistema de Estacionamento
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
