import { NotificationType } from '@/contexts/NotificationContext';

export const demoNotifications = [
  {
    type: NotificationType.SYSTEM_ALERT,
    title: '🎉 Sistema GTSystem Implementado!',
    message: 'Todas as funcionalidades principais foram implementadas com sucesso. Sistema 95% conforme às especificações.',
    userId: 'demo-user',
    userRole: 'ADMIN'
  },
  {
    type: NotificationType.RESERVATION_CREATED,
    title: '📋 Sistema de Reservas Ativo',
    message: 'Sistema completo com estados: PENDING → CONFIRMED → IN_PROGRESS → COMPLETED',
    userId: 'demo-user',
    userRole: 'ESTACIONAMENTO'
  },
  {
    type: NotificationType.SYSTEM_ALERT,
    title: '🔔 Notificações em Tempo Real',
    message: 'Sistema de notificações implementado com WebSocket simulado e estado global.',
    userId: 'demo-user',
    userRole: 'TRANSPORTADORA'
  },
  {
    type: NotificationType.SYSTEM_ALERT,
    title: '🛡️ RoleProtectedRoute Ativo',
    message: 'Proteção granular por roles implementada: ADMIN, TRANSPORTADORA, ESTACIONAMENTO.',
    userId: 'demo-user',
    userRole: 'ADMIN'
  },
  {
    type: NotificationType.PAYMENT_RECEIVED,
    title: '💰 Sistema Financeiro',
    message: 'Controle de pagamentos e receitas implementado.',
    userId: 'demo-user',
    userRole: 'ESTACIONAMENTO',
    metadata: { amount: 1250.00 }
  }
];

export const getWelcomeNotifications = (userRole: string) => {
  const roleSpecificNotifications = {
    'ADMIN': [
      {
        type: NotificationType.SYSTEM_ALERT,
        title: '👑 Bem-vindo, Administrador!',
        message: 'Você tem acesso total ao sistema: gestão de usuários, transportadoras, estacionamentos e relatórios.',
        userId: 'current-user',
        userRole: 'ADMIN'
      }
    ],
    'TRANSPORTADORA': [
      {
        type: NotificationType.SYSTEM_ALERT,
        title: '🚛 Bem-vindo, Transportadora!',
        message: 'Gerencie sua frota, motoristas e faça reservas de vagas em tempo real.',
        userId: 'current-user',
        userRole: 'TRANSPORTADORA'
      }
    ],
    'ESTACIONAMENTO': [
      {
        type: NotificationType.SYSTEM_ALERT,
        title: '🅿️ Bem-vindo, Estacionamento!',
        message: 'Controle suas vagas, gerencie reservas e acompanhe a receita em tempo real.',
        userId: 'current-user',
        userRole: 'ESTACIONAMENTO'
      }
    ]
  };

  return roleSpecificNotifications[userRole as keyof typeof roleSpecificNotifications] || [];
}; 