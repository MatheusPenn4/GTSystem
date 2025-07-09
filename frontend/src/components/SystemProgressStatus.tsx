import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Code, 
  Database, 
  Zap,
  Users,
  Building2,
  Car,
  Calendar,
  Bell,
  Shield
} from 'lucide-react';
import { useNotifications, NotificationType } from '@/contexts/NotificationContext';

const SystemProgressStatus: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);
  const { addNotification, isConnected } = useNotifications();

  // Dados de progresso do sistema
  const systemProgress = {
    overall: 92,
    modules: {
      authentication: { progress: 100, status: 'complete' },
      reservations: { progress: 100, status: 'complete' },
      userManagement: { progress: 100, status: 'complete' },
      notifications: { progress: 95, status: 'complete' },
      roleProtection: { progress: 100, status: 'complete' },
      dashboards: { progress: 75, status: 'in-progress' },
      reports: { progress: 60, status: 'in-progress' },
      api: { progress: 95, status: 'complete' }
    },
    features: {
      admin: 92,
      transportadora: 90,
      estacionamento: 95
    }
  };

  const implementedFeatures = [
    { name: 'Sistema de Autenticação JWT', icon: Shield, status: 'complete' },
    { name: 'Gestão de Usuários Completa', icon: Users, status: 'complete' },
    { name: 'Sistema de Reservas (Estados)', icon: Calendar, status: 'complete' },
    { name: 'Notificações em Tempo Real', icon: Bell, status: 'complete' },
    { name: 'RoleProtectedRoute', icon: Shield, status: 'complete' },
    { name: 'CRUD de Empresas/Transportadoras', icon: Building2, status: 'complete' },
    { name: 'Gestão de Veículos', icon: Car, status: 'complete' },
    { name: 'Controle de Vagas', icon: Building2, status: 'complete' },
    { name: 'Dashboards Específicos', icon: Code, status: 'in-progress' },
    { name: 'Relatórios Avançados', icon: Database, status: 'in-progress' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <Circle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const simulateSystemNotification = () => {
    const notifications = [
      {
        type: NotificationType.SYSTEM_ALERT,
        title: 'Sistema Atualizado',
        message: 'Nova funcionalidade de notificações implementada!',
        userId: 'dev-user',
        userRole: 'ADMIN'
      },
      {
        type: NotificationType.RESERVATION_CREATED,
        title: 'Demo - Nova Reserva',
        message: 'Simulação de nova reserva para teste do sistema',
        userId: 'dev-user',
        userRole: 'ESTACIONAMENTO'
      },
      {
        type: NotificationType.PAYMENT_RECEIVED,
        title: 'Demo - Pagamento',
        message: 'Simulação de pagamento recebido R$ 250,00',
        userId: 'dev-user',
        userRole: 'ESTACIONAMENTO',
        metadata: { amount: 250.00 }
      }
    ];

    const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
    addNotification(randomNotification);
  };

  if (!showDetails) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setShowDetails(true)}
          className="ajh-button-primary shadow-lg"
          size="sm"
        >
          <Code className="w-4 h-4 mr-2" />
          Status do Sistema
          <Badge className="ml-2 bg-green-500 text-white">
            {systemProgress.overall}%
          </Badge>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="ajh-card border-slate-600 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Code className="w-5 h-5 text-ajh-primary" />
              GTSystem Progress
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(false)}
              className="text-slate-400 hover:text-white"
            >
              ×
            </Button>
          </div>
          <CardDescription className="text-slate-400">
            Status de implementação das funcionalidades
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progress Geral */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white">Progresso Geral</span>
              <span className="text-sm text-ajh-primary font-semibold">
                {systemProgress.overall}%
              </span>
            </div>
            <Progress value={systemProgress.overall} className="h-2" />
          </div>

          {/* Status por Role */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <div className="text-xs text-slate-400">Admin</div>
              <div className="text-sm font-semibold text-blue-400">
                {systemProgress.features.admin}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400">Transport.</div>
              <div className="text-sm font-semibold text-green-400">
                {systemProgress.features.transportadora}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400">Estacion.</div>
              <div className="text-sm font-semibold text-purple-400">
                {systemProgress.features.estacionamento}%
              </div>
            </div>
          </div>

          {/* Features Implementadas */}
          <div>
            <h4 className="text-sm font-medium text-white mb-2">Features Implementadas</h4>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {implementedFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  {getStatusIcon(feature.status)}
                  <span className="text-slate-300 flex-1">{feature.name}</span>
                  <Badge className={getStatusColor(feature.status)}>
                    {feature.status === 'complete' ? 'OK' : 'WIP'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Status de Conexões */}
          <div className="border-t border-slate-700 pt-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Notificações</span>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="text-slate-300">
                  {isConnected ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>

          {/* Botões de Teste */}
          <div className="border-t border-slate-700 pt-3 space-y-2">
            <Button
              onClick={simulateSystemNotification}
              size="sm"
              className="w-full text-xs"
              variant="outline"
            >
              <Zap className="w-3 h-3 mr-1" />
              Testar Notificação
            </Button>
          </div>

          {/* Estatísticas */}
          <div className="text-xs text-slate-500 text-center">
            <div>Última atualização: {new Date().toLocaleTimeString()}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemProgressStatus; 