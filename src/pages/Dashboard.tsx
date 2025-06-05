
import React from 'react';
import { 
  Building2, 
  Car, 
  Users, 
  ParkingCircle, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  MapPin,
  Truck
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const getStatsForRole = () => {
    switch (user?.role) {
      case 'admin':
        return [
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

      case 'transportadora':
        return [
          {
            title: 'Meus Veículos',
            value: '12',
            change: '+2',
            trend: 'up',
            icon: Car,
            color: 'text-ajh-primary',
            bgColor: 'bg-ajh-primary/10'
          },
          {
            title: 'Motoristas',
            value: '8',
            change: '+1',
            trend: 'up',
            icon: Users,
            color: 'text-ajh-secondary',
            bgColor: 'bg-ajh-secondary/10'
          },
          {
            title: 'Reservas Ativas',
            value: '5',
            change: '+3',
            trend: 'up',
            icon: Calendar,
            color: 'text-ajh-accent',
            bgColor: 'bg-ajh-accent/10'
          },
          {
            title: 'Gastos do Mês',
            value: 'R$ 2.340',
            change: '-5%',
            trend: 'up',
            icon: TrendingUp,
            color: 'text-ajh-success',
            bgColor: 'bg-ajh-success/10'
          }
        ];

      case 'estacionamento':
        return [
          {
            title: 'Vagas Totais',
            value: '120',
            change: '+10',
            trend: 'up',
            icon: ParkingCircle,
            color: 'text-ajh-primary',
            bgColor: 'bg-ajh-primary/10'
          },
          {
            title: 'Ocupação Atual',
            value: '67',
            change: '56%',
            trend: 'neutral',
            icon: Car,
            color: 'text-ajh-secondary',
            bgColor: 'bg-ajh-secondary/10'
          },
          {
            title: 'Reservas Hoje',
            value: '15',
            change: '+8',
            trend: 'up',
            icon: Calendar,
            color: 'text-ajh-accent',
            bgColor: 'bg-ajh-accent/10'
          },
          {
            title: 'Receita do Mês',
            value: 'R$ 8.750',
            change: '+12%',
            trend: 'up',
            icon: TrendingUp,
            color: 'text-ajh-success',
            bgColor: 'bg-ajh-success/10'
          }
        ];

      default:
        return [];
    }
  };

  const getQuickActionsForRole = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { icon: Building2, label: 'Nova Empresa', path: '/empresas' },
          { icon: Car, label: 'Novo Veículo', path: '/veiculos' },
          { icon: Users, label: 'Novo Motorista', path: '/motoristas' },
          { icon: ParkingCircle, label: 'Gerenciar Vagas', path: '/estacionamentos-cadastrados' }
        ];

      case 'transportadora':
        return [
          { icon: Car, label: 'Cadastrar Veículo', path: '/veiculos' },
          { icon: Users, label: 'Cadastrar Motorista', path: '/motoristas' },
          { icon: Calendar, label: 'Reservar Vaga', path: '/reserva-vagas' },
          { icon: Clock, label: 'Minhas Reservas', path: '/minhas-reservas' }
        ];

      case 'estacionamento':
        return [
          { icon: ParkingCircle, label: 'Gerenciar Vagas', path: '/estacionamento' },
          { icon: Calendar, label: 'Ver Reservas', path: '/reservas-recebidas' },
          { icon: MapPin, label: 'Meu Estacionamento', path: '/meu-estacionamento' },
          { icon: Building2, label: 'Cadastrar Unidade', path: '/meu-estacionamento' }
        ];

      default:
        return [];
    }
  };

  const getRecentActivityForRole = () => {
    switch (user?.role) {
      case 'transportadora':
        return [
          {
            id: 1,
            type: 'vehicle',
            message: 'Veículo ABC-1234 saiu do Estacionamento Central',
            time: '15 min atrás',
            status: 'success'
          },
          {
            id: 2,
            type: 'reservation',
            message: 'Nova reserva confirmada para amanhã às 14h',
            time: '1 hora atrás',
            status: 'info'
          },
          {
            id: 3,
            type: 'driver',
            message: 'João Silva completou a entrega',
            time: '2 horas atrás',
            status: 'success'
          }
        ];

      case 'estacionamento':
        return [
          {
            id: 1,
            type: 'reservation',
            message: 'Nova reserva da TechCorp para vaga 15',
            time: '5 min atrás',
            status: 'info'
          },
          {
            id: 2,
            type: 'vehicle',
            message: 'Veículo DEF-5678 entrou na vaga 8',
            time: '30 min atrás',
            status: 'success'
          },
          {
            id: 3,
            type: 'payment',
            message: 'Pagamento de R$ 25,00 recebido',
            time: '1 hora atrás',
            status: 'success'
          }
        ];

      default:
        return [
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
          }
        ];
    }
  };

  const stats = getStatsForRole();
  const quickActions = getQuickActionsForRole();
  const recentActivity = getRecentActivityForRole();

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

  const getTitleForRole = () => {
    switch (user?.role) {
      case 'transportadora':
        return 'Painel da Transportadora';
      case 'estacionamento':
        return 'Painel do Estacionamento';
      default:
        return 'Dashboard Administrativo';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {getTitleForRole()}
        </h1>
        <p className="text-slate-400">
          Bem-vindo de volta! Aqui está um resumo das suas atividades.
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
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link key={index} to={action.path}>
                    <Button className="w-full ajh-button-primary justify-start">
                      <Icon className="w-4 h-4 mr-2" />
                      {action.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview - Específico por tipo de usuário */}
      {user?.role === 'estacionamento' && (
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
                    <p className="text-white text-sm font-medium">5 reservas pendentes</p>
                    <p className="text-yellow-400 text-xs">Confirmar reservas</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">Vaga 15 livre há 2h</p>
                    <p className="text-blue-400 text-xs">Considerar limpeza</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {user?.role === 'transportadora' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="ajh-card">
            <CardHeader>
              <CardTitle className="text-white">Status da Frota</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Veículos em Rota</span>
                  <Badge className="bg-blue-500/20 text-blue-400">8</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Veículos Estacionados</span>
                  <Badge className="bg-green-500/20 text-green-400">4</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Em Manutenção</span>
                  <Badge className="bg-yellow-500/20 text-yellow-400">0</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="ajh-card">
            <CardHeader>
              <CardTitle className="text-white">Próximas Reservas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">Estacionamento Central</p>
                    <p className="text-blue-400 text-xs">Hoje às 14:00</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">Shopping Norte</p>
                    <p className="text-green-400 text-xs">Amanhã às 09:00</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
