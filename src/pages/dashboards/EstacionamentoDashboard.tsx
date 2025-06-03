
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ParkingCircle, 
  Car, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Settings,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CadastroEstacionamentoModal from '@/components/modals/CadastroEstacionamentoModal';

const EstacionamentoDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showEstacionamentoModal, setShowEstacionamentoModal] = useState(false);

  const stats = [
    {
      title: 'Estacionamentos',
      value: '3',
      change: '+1',
      trend: 'up',
      icon: ParkingCircle,
      color: 'text-ajh-primary',
      bgColor: 'bg-ajh-primary/10'
    },
    {
      title: 'Vagas Totais',
      value: '450',
      change: '+50',
      trend: 'up',
      icon: Car,
      color: 'text-ajh-secondary',
      bgColor: 'bg-ajh-secondary/10'
    },
    {
      title: 'Ocupação Atual',
      value: '67%',
      change: '+5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-ajh-accent',
      bgColor: 'bg-ajh-accent/10'
    },
    {
      title: 'Receita do Mês',
      value: 'R$ 18.4k',
      change: '+15%',
      trend: 'up',
      icon: BarChart3,
      color: 'text-ajh-success',
      bgColor: 'bg-ajh-success/10'
    }
  ];

  const estacionamentos = [
    {
      id: 1,
      nome: 'Estacionamento Centro',
      vagas: 150,
      ocupadas: 98,
      disponivel: 52,
      receita: 'R$ 6.2k'
    },
    {
      id: 2,
      nome: 'Estacionamento Shopping',
      vagas: 200,
      ocupadas: 156,
      disponivel: 44,
      receita: 'R$ 8.1k'
    },
    {
      id: 3,
      nome: 'Estacionamento Aeroporto',
      vagas: 100,
      ocupadas: 48,
      disponivel: 52,
      receita: 'R$ 4.1k'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'entry',
      message: 'Veículo ABC-1234 entrou no Centro - Vaga 15',
      time: '5 min atrás',
      status: 'success'
    },
    {
      id: 2,
      type: 'exit',
      message: 'Veículo XYZ-5678 saiu do Shopping - R$ 12,00',
      time: '12 min atrás',
      status: 'success'
    },
    {
      id: 3,
      type: 'maintenance',
      message: 'Vaga 23 do Centro em manutenção',
      time: '1 hora atrás',
      status: 'warning'
    },
    {
      id: 4,
      type: 'payment',
      message: 'Pagamento processado - R$ 25,00',
      time: '2 horas atrás',
      status: 'success'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default:
        return <Clock className="w-4 h-4 text-blue-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-l-green-400';
      case 'warning':
        return 'border-l-yellow-400';
      default:
        return 'border-l-blue-400';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Dashboard Estacionamento
        </h1>
        <p className="text-slate-400">
          Monitore e gerencie seus estacionamentos em tempo real.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="ajh-card hover-scale">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-slate-400 text-sm font-medium">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {stat.value}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="secondary" 
                        className={`${stat.bgColor} ${stat.color} border-0`}
                      >
                        {stat.change}
                      </Badge>
                      {stat.trend === 'up' && (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="ajh-card xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Atividade Recente</CardTitle>
            <CardDescription className="text-slate-400">
              Movimentação em tempo real
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div 
                  key={activity.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg bg-slate-800/30 border-l-2 ${getStatusColor(activity.status)}`}
                >
                  {getStatusIcon(activity.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">
                      {activity.message}
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="ajh-card">
          <CardHeader>
            <CardTitle className="text-white">Ações Rápidas</CardTitle>
            <CardDescription className="text-slate-400">
              Operações frequentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button 
                onClick={() => setShowEstacionamentoModal(true)}
                className="w-full ajh-button-primary justify-start"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Estacionamento
              </button>
              <button 
                onClick={() => navigate('/estacionamento')}
                className="w-full ajh-button-secondary justify-start"
              >
                <ParkingCircle className="w-4 h-4 mr-2" />
                Gerenciar Vagas
              </button>
              <button 
                onClick={() => navigate('/relatorios')}
                className="w-full ajh-button-secondary justify-start"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Ver Relatórios
              </button>
              <button 
                onClick={() => navigate('/configuracoes')}
                className="w-full ajh-button-secondary justify-start"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estacionamentos Overview */}
      <Card className="ajh-card">
        <CardHeader>
          <CardTitle className="text-white">Meus Estacionamentos</CardTitle>
          <CardDescription className="text-slate-400">
            Visão geral de todos os seus estacionamentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {estacionamentos.map((estacionamento) => (
              <div 
                key={estacionamento.id}
                className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:border-ajh-primary/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/estacionamento/${estacionamento.id}`)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium">{estacionamento.nome}</h4>
                  <ParkingCircle className="w-5 h-5 text-ajh-primary" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total de vagas:</span>
                    <span className="text-white">{estacionamento.vagas}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Ocupadas:</span>
                    <span className="text-red-400">{estacionamento.ocupadas}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Disponíveis:</span>
                    <span className="text-green-400">{estacionamento.disponivel}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-slate-700 pt-2 mt-2">
                    <span className="text-slate-400">Receita do mês:</span>
                    <span className="text-ajh-success font-medium">{estacionamento.receita}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <CadastroEstacionamentoModal 
        open={showEstacionamentoModal} 
        onOpenChange={setShowEstacionamentoModal} 
      />
    </div>
  );
};

export default EstacionamentoDashboard;
