import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Car, Users, ParkingCircle, Shield, Clock } from 'lucide-react';
import logo from '@/assets/logo.png';

const Index = () => {
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
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-16">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <img 
                  src={logo} 
                  alt="GTSystem Logo" 
                  className="w-28 h-28 object-contain drop-shadow-lg"
                />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-ajh-primary via-ajh-secondary to-ajh-accent bg-clip-text text-transparent">
              GTSystem
            </h1>
            
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              Sistema de Gestão de Transportadoras e Estacionamentos
            </p>

            {/* CTA Button */}
            <Link to="/login">
              <Button className="bg-gradient-to-r from-ajh-primary via-ajh-secondary to-ajh-accent hover:from-ajh-primary/90 hover:via-ajh-secondary/90 hover:to-ajh-accent/90 text-white px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Acessar Sistema
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
            <Card className="ajh-card hover-scale">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-ajh-primary/20 rounded-lg">
                    <Building2 className="w-6 h-6 text-ajh-primary" />
                  </div>
                  <CardTitle className="text-white">Gestão de Estacionamentos</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-400">
                  Controle total sobre vagas, reservas e receita dos seus estacionamentos
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="ajh-card hover-scale">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-ajh-secondary/20 rounded-lg">
                    <Car className="w-6 h-6 text-ajh-secondary" />
                  </div>
                  <CardTitle className="text-white">Gestão de Frota</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-400">
                  Gerencie veículos, motoristas e faça reservas de vagas em tempo real
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="ajh-card hover-scale">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-ajh-accent/20 rounded-lg">
                    <Users className="w-6 h-6 text-ajh-accent" />
                  </div>
                  <CardTitle className="text-white">Gestão de Usuários</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-400">
                  Controle de acesso, perfis e permissões para diferentes tipos de usuários
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-ajh-primary mb-2">95%</div>
              <div className="text-slate-400">Sistema Implementado</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-ajh-secondary mb-2">24/7</div>
              <div className="text-slate-400">Disponibilidade</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-ajh-accent mb-2">100%</div>
              <div className="text-slate-400">Segurança</div>
            </div>
          </div>

          {/* Additional Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="ajh-card">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-ajh-primary" />
                  <CardTitle className="text-white">Segurança Avançada</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-400">
                  Autenticação JWT, controle de acesso por roles e criptografia de dados
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="ajh-card">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-ajh-secondary" />
                  <CardTitle className="text-white">Tempo Real</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-400">
                  Atualizações em tempo real, notificações instantâneas e dashboard dinâmico
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-slate-700/50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-slate-400">
            <p>© 2024 GTSystem • Tecnologia Avançada em Estacionamento</p>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes grid-move {
            0% { transform: translate(0, 0); }
            100% { transform: translate(60px, 60px); }
          }
        `
      }} />
    </div>
  );
};

export default Index;
