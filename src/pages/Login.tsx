
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/lovable-uploads/831479e3-1ac2-45e0-aa6d-f00ac1d4d24e.png)',
        }}
      />
      
      {/* Animated Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-ajh-dark/80 to-black/95" />
      
      {/* Animated Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ajh-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-ajh-secondary/10 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-ajh-accent/10 rounded-full blur-xl animate-pulse delay-2000" />
      </div>
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full animate-pulse"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            animation: 'grid-move 20s linear infinite'
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-ajh-primary/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        {/* Glassmorphism Login Container */}
        <div className="relative">
          {/* Glow Effect Behind Container */}
          <div className="absolute inset-0 bg-gradient-to-r from-ajh-primary/20 via-ajh-secondary/20 to-ajh-accent/20 rounded-3xl blur-xl scale-105" />
          
          {/* Main Container */}
          <div className="relative backdrop-blur-2xl bg-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* Header Section */}
            <div className="text-center mb-8">
              {/* Logo with Glow Effect */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-ajh-primary to-ajh-secondary rounded-full blur-lg opacity-50 animate-pulse" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center border border-white/20">
                  <img 
                    src="/lovable-uploads/924cf0eb-5f16-4ed6-b99f-4fd14ee98d4b.png" 
                    alt="GTSystem Logo" 
                    className="w-16 h-16 object-contain drop-shadow-lg"
                  />
                </div>
              </div>
              
              {/* Title with Gradient Text */}
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-ajh-primary via-ajh-secondary to-ajh-accent bg-clip-text text-transparent">
                GTSystem
              </h1>
              <p className="text-white/80 text-lg font-medium mb-2">Sistema de Estacionamento</p>
              <p className="text-white/60 text-sm">Acesso Tecnológico Avançado</p>
              
              {/* Animated Line */}
              <div className="w-20 h-1 bg-gradient-to-r from-ajh-primary to-ajh-secondary rounded-full mx-auto mt-4 animate-pulse" />
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
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1"></div>
                <span className="text-white/50 text-xs px-3">SEGURO</span>
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1"></div>
              </div>
              <p className="text-white/40 text-xs">
                © 2024 GTSystem • Tecnologia Avançada em Estacionamento
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional CSS Animations */}
      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
      `}</style>
    </div>
  );
};

export default Login;
