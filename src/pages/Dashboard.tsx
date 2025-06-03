import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Car, 
  Users, 
  ParkingCircle, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CadastroEmpresaModal from '@/components/modals/CadastroEmpresaModal';
import CadastroVeiculoModal from '@/components/modals/CadastroVeiculoModal';
import CadastroMotoristaModal from '@/components/modals/CadastroMotoristaModal';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showEmpresaModal, setShowEmpresaModal] = useState(false);
  const [showVeiculoModal, setShowVeiculoModal] = useState(false);
  const [showMotoristaModal, setShowMotoristaModal] = useState(false);

  const stats = [
    {
      title: 'Empresas Ativas',
      value: '24',
      change: '+12%',
      trend: 'up',
      icon: Building2,
      color: 'text-ajh-primary',
      bgColor: 'bg-ajh-primary/10'
    },
    {
      title: 'Veículos Cadastrados',
      value: '156',
      change: '+8%',
      trend: 'up',
      icon: Car,
      color: 'text-ajh-secondary',
      bgColor: 'bg-ajh-secondary/10'
    },
    {
      title: 'Motoristas Ativos',
      value: '89',
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: 'text-ajh-accent',
      bgColor: 'bg-ajh-accent/10'
    },
    {
      title: 'Vagas Ocupadas',
      value: '67/120',
      change: '56%',
      trend: 'neutral',
      icon: ParkingCircle,
      color: 'text-ajh-success',
      bgColor: 'bg-ajh-success/10'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'vehicle',
      message: 'Novo veículo cadastrado - Placa ABC-1234',
      time: '2 min atrás',
      status: 'success'
    },
    {
      id: 2,
      type: 'driver',
      message: 'CNH do motorista João Silva expira em 15 dias',
      time: '1 hora atrás',
      status: 'warning'
    },
    {
      id: 3,
      type: 'company',
      message: 'Empresa TechCorp Ltd. foi atualizada',
      time: '2 horas atrás',
      status: 'info'
    },
    {
      id: 4,
      type: 'parking',
      message: 'Vaga 15 foi liberada',
      time: '3 horas atrás',
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
          Dashboard
        </h1>
        <p className="text-slate-400">
          Bem-vindo de volta! Aqui está um resumo das atividades do sistema.
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
              Últimas atualizações no sistema
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
                onClick={() => setShowEmpresaModal(true)}
                className="w-full ajh-button-primary justify-start"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Nova Empresa
              </button>
              <button 
                onClick={() => setShowVeiculoModal(true)}
                className="w-full ajh-button-secondary justify-start"
              >
                <Car className="w-4 h-4 mr-2" />
                Novo Veículo
              </button>
              <button 
                onClick={() => setShowMotoristaModal(true)}
                className="w-full ajh-button-secondary justify-start"
              >
                <Users className="w-4 h-4 mr-2" />
                Novo Motorista
              </button>
              <button 
                onClick={() => navigate('/estacionamento')}
                className="w-full ajh-button-secondary justify-start"
              >
                <ParkingCircle className="w-4 h-4 mr-2" />
                Gerenciar Vagas
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="ajh-card">
          <CardHeader>
            <CardTitle className="text-white">Status do Estacionamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Vagas Livres</span>
                <Badge className="bg-green-500/20 text-green-400">53</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Vagas Ocupadas</span>
                <Badge className="bg-red-500/20 text-red-400">67</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Em Manutenção</span>
                <Badge className="bg-yellow-500/20 text-yellow-400">0</Badge>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 mt-4">
                <div 
                  className="bg-gradient-to-r from-ajh-primary to-ajh-secondary h-2 rounded-full"
                  style={{ width: '56%' }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardHeader>
            <CardTitle className="text-white">Alertas Importantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-white text-sm font-medium">3 CNHs expirando</p>
                  <p className="text-yellow-400 text-xs">Verificar em breve</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-white text-sm font-medium">Backup automático</p>
                  <p className="text-blue-400 text-xs">Hoje às 23:00</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <CadastroEmpresaModal 
        open={showEmpresaModal} 
        onOpenChange={setShowEmpresaModal} 
      />
      <CadastroVeiculoModal 
        open={showVeiculoModal} 
        onOpenChange={setShowVeiculoModal} 
      />
      <CadastroMotoristaModal 
        open={showMotoristaModal} 
        onOpenChange={setShowMotoristaModal} 
      />
    </div>
  );
};

export default Dashboard;
