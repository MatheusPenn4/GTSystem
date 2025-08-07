
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import logo from '@/assets/logo.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao GTSystem!",
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast({
        title: "Erro no login",
        description: error.message || "Credenciais inválidas. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-ajh-primary/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Glow Effect Behind Container */}
        <div className="absolute inset-0 bg-gradient-to-r from-ajh-primary/20 via-ajh-secondary/20 to-ajh-accent/20 rounded-3xl blur-xl scale-105" />
        
        {/* Main Container */}
        <div className="relative backdrop-blur-2xl bg-white/5 border border-white/20 rounded-3xl p-6 shadow-2xl">
          {/* Header Section */}
          <div className="text-center mb-6">
            {/* Logo - Much larger size with minimal spacing */}
            <div className="relative w-40 h-40 mx-auto mb-0 flex items-center justify-center">
              <img 
                src={logo} 
                alt="GTSystem Logo" 
                className="w-36 h-36 object-contain drop-shadow-lg"
              />
            </div>
            
            {/* Title with Enhanced Effects - Compact spacing */}
            <h1 className="text-xl font-bold mb-4 bg-gradient-to-r from-ajh-primary via-ajh-secondary to-ajh-accent bg-clip-text text-transparent drop-shadow-2xl"
                style={{
                  textShadow: '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(6, 182, 212, 0.3), 0 0 60px rgba(139, 92, 246, 0.2)',
                  filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.8))'
                }}>
              GTSystem
            </h1>
            
            {/* Animated Line */}
            <div className="w-20 h-1 bg-gradient-to-r from-ajh-primary to-ajh-secondary rounded-full mx-auto animate-pulse" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/90 text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4 text-ajh-primary" />
                E-mail
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:border-ajh-primary focus:ring-2 focus:ring-ajh-primary/20 transition-all duration-300 pl-12"
                  required
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/90 text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4 text-ajh-secondary" />
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:border-ajh-secondary focus:ring-2 focus:ring-ajh-secondary/20 transition-all duration-300 pl-12 pr-12"
                  required
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-ajh-primary via-ajh-secondary to-ajh-accent hover:from-ajh-primary/90 hover:via-ajh-secondary/90 hover:to-ajh-accent/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] mt-8"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Autenticando...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <span>Acessar Sistema</span>
                  <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                </span>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-white/60 text-xs font-medium tracking-wide">SEGURO</p>
            <p className="text-white/40 text-xs mt-2">
              © 2024 GTSystem • Tecnologia Avançada em Estacionamento
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
