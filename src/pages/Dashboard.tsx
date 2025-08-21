import React, { useState, useEffect } from 'react';
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
import DashboardService, { DashboardData } from '@/services/dashboard';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await DashboardService.getDashboardData();
      
      if (data) {
        setDashboardData(data);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Erro ao buscar dados do dashboard:', error);
      }
    } finally {
      setIsLoading(false);
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

  const quickActions = getQuickActionsForRole();

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
      {user?.role === 'estacionamento' ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Total de Vagas */}
          <Card className="ajh-card">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-slate-400">Total de Vagas</p>
                <p className="text-3xl font-bold text-white">{dashboardData?.vagasOcupadas?.capacidade || 0}</p>
              </div>
            </CardContent>
          </Card>
          {/* Vagas Ocupadas */}
          <Card className="ajh-card">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-slate-400">Vagas Ocupadas</p>
                <p className="text-3xl font-bold text-red-400">{dashboardData?.vagasOcupadas?.total || 0}</p>
              </div>
            </CardContent>
          </Card>
          {/* Vagas Livres */}
          <Card className="ajh-card">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-slate-400">Vagas Livres</p>
                <p className="text-3xl font-bold text-green-400">{(dashboardData?.vagasOcupadas?.capacidade || 0) - (dashboardData?.vagasOcupadas?.total || 0)}</p>
              </div>
            </CardContent>
          </Card>
          {/* Reservadas (placeholder, pode ser ajustado se backend retornar) */}
          <Card className="ajh-card">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-slate-400">Reservadas</p>
                <p className="text-3xl font-bold text-yellow-400">-</p>
              </div>
            </CardContent>
          </Card>
          {/* Taxa de Ocupação */}
          <Card className="ajh-card">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-slate-400">Taxa de Ocupação</p>
                <p className="text-3xl font-bold text-blue-400">{dashboardData?.vagasOcupadas?.percentual || 0}%</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Empresas Ativas */}
          <Card className="ajh-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400">Empresas Ativas</p>
                  <h3 className="text-3xl font-bold text-white mt-2">
                    {dashboardData?.empresasAtivas || 0}
                  </h3>
                  <p className="text-sm text-slate-400 flex items-center mt-1">
                    {dashboardData?.empresasAtivas ? 'Dados do banco' : 'Nenhuma empresa cadastrada'}
                  </p>
                </div>
                <div className="bg-ajh-primary/10 p-3 rounded-full">
                  <Building2 className="h-6 w-6 text-ajh-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Veículos Cadastrados */}
          <Card className="ajh-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400">Veículos Cadastrados</p>
                  <h3 className="text-3xl font-bold text-white mt-2">
                    {dashboardData?.veiculosCadastrados || 0}
                  </h3>
                  <p className="text-sm text-slate-400 flex items-center mt-1">
                    {dashboardData?.veiculosCadastrados ? 'Dados do banco' : 'Nenhum veículo cadastrado'}
                  </p>
                </div>
                <div className="bg-ajh-secondary/10 p-3 rounded-full">
                  <Car className="h-6 w-6 text-ajh-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Motoristas Ativos */}
          <Card className="ajh-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400">Motoristas Ativos</p>
                  <h3 className="text-3xl font-bold text-white mt-2">
                    {dashboardData?.motoristasAtivos || 0}
                  </h3>
                  <p className="text-sm text-slate-400 flex items-center mt-1">
                    {dashboardData?.motoristasAtivos ? 'Dados do banco' : 'Nenhum motorista cadastrado'}
                  </p>
                </div>
                <div className="bg-ajh-accent/10 p-3 rounded-full">
                  <Users className="h-6 w-6 text-ajh-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vagas Ocupadas */}
          <Card className="ajh-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400">Vagas Ocupadas</p>
                  <h3 className="text-3xl font-bold text-white mt-2">
                    {dashboardData?.vagasOcupadas ? 
                      `${dashboardData.vagasOcupadas.total}/${dashboardData.vagasOcupadas.capacidade}` : 
                      '0/0'
                    }
                  </h3>
                  <p className="text-sm text-slate-400 flex items-center mt-1">
                    {dashboardData?.vagasOcupadas ? 
                      `${dashboardData.vagasOcupadas.percentual}%` : 
                      'Nenhuma vaga cadastrada'
                    }
                  </p>
                </div>
                <div className="bg-ajh-success/10 p-3 rounded-full">
                  <ParkingCircle className="h-6 w-6 text-ajh-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="ajh-card col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Atividades Recentes</CardTitle>
            <CardDescription className="text-slate-400">
              {dashboardData?.atividadesRecentes?.length || 0} atividades nas últimas 24 horas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                // Esqueletos para atividades recentes
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <Skeleton className="h-8 w-8 rounded-full bg-slate-700" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full bg-slate-700" />
                      <Skeleton className="h-3 w-24 bg-slate-700" />
                    </div>
                  </div>
                ))
              ) : (
                // Mostrar atividades reais do banco ou mensagem de vazio
                dashboardData?.atividadesRecentes && dashboardData.atividadesRecentes.length > 0 ? (
                  dashboardData.atividadesRecentes.map((atividade, i) => {
                    const dataAtividade = new Date(atividade.data);
                    const agora = new Date();
                    const diffMs = agora.getTime() - dataAtividade.getTime();
                    
                    let time;
                    if (diffMs < 60000) {
                      time = 'Agora';
                    } else if (diffMs < 3600000) {
                      const minutes = Math.floor(diffMs / 60000);
                      time = `${minutes} min atrás`;
                    } else if (diffMs < 86400000) {
                      const hours = Math.floor(diffMs / 3600000);
                      time = `${hours} hora${hours > 1 ? 's' : ''} atrás`;
                    } else {
                      const days = Math.floor(diffMs / 86400000);
                      time = `${days} dia${days > 1 ? 's' : ''} atrás`;
                    }

                    let icon;
                    let borderClass;

                    switch (atividade.tipo) {
                      case 'veiculo':
                        icon = <Car className="w-4 h-4 text-green-400" />;
                        borderClass = 'border-l-green-400';
                        break;
                      case 'motorista':
                        icon = <Users className="w-4 h-4 text-blue-400" />;
                        borderClass = 'border-l-blue-400';
                        break;
                      case 'alerta':
                        icon = <AlertTriangle className="w-4 h-4 text-yellow-400" />;
                        borderClass = 'border-l-yellow-400';
                        break;
                      default:
                        icon = <Clock className="w-4 h-4 text-blue-400" />;
                        borderClass = 'border-l-blue-400';
                    }

                    return (
                      <div key={i} className={`pl-4 border-l-2 ${borderClass}`}>
                        <div className="flex justify-between items-start">
                          <p className="text-white font-medium">{atividade.descricao}</p>
                          <div className="ml-4 flex items-center text-xs text-slate-400">
                            {icon}
                            <span className="ml-1">{time}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-sm">Nenhuma atividade recente encontrada</p>
                    <p className="text-slate-500 text-xs mt-1">
                      As atividades aparecerão aqui conforme você usar o sistema
                    </p>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions - Corrigindo centralização e espaçamento */}
        <Card className="ajh-card">
          <CardHeader>
            <CardTitle className="text-white text-center">Ações Rápidas</CardTitle>
            <CardDescription className="text-slate-400 text-center">
              Operações frequentes
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="flex flex-col items-center space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link key={index} to={action.path} className="w-full">
                    <Button className="w-full ajh-button-primary justify-start h-12 text-left">
                      <Icon className="w-4 h-4 mr-3" />
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
                  <Badge className="bg-green-500/20 text-green-400">
                    {dashboardData?.vagasOcupadas ? 
                      dashboardData.vagasOcupadas.capacidade - dashboardData.vagasOcupadas.total : 
                      0
                    }
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Vagas Ocupadas</span>
                  <Badge className="bg-red-500/20 text-red-400">
                    {dashboardData?.vagasOcupadas?.total || 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Em Manutenção</span>
                  <Badge className="bg-yellow-500/20 text-yellow-400">0</Badge>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-4">
                  <div 
                    className="bg-gradient-to-r from-ajh-primary to-ajh-secondary h-2 rounded-full"
                    style={{ 
                      width: dashboardData?.vagasOcupadas?.percentual 
                        ? `${dashboardData.vagasOcupadas.percentual}%` 
                        : '0%' 
                    }}
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
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-sm">Nenhum alerta no momento</p>
                <p className="text-slate-500 text-xs mt-1">
                  Alertas importantes aparecerão aqui
                </p>
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
                  <span className="text-slate-400">Veículos Cadastrados</span>
                  <Badge className="bg-blue-500/20 text-blue-400">
                    {dashboardData?.veiculosCadastrados || 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Motoristas Ativos</span>
                  <Badge className="bg-green-500/20 text-green-400">
                    {dashboardData?.motoristasAtivos || 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Reservas Ativas</span>
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
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-sm">Nenhuma reserva agendada</p>
                <p className="text-slate-500 text-xs mt-1">
                  Suas próximas reservas aparecerão aqui
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
