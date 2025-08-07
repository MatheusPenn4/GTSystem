import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

export enum NotificationType {
  RESERVATION_CREATED = 'RESERVATION_CREATED',
  RESERVATION_CONFIRMED = 'RESERVATION_CONFIRMED', 
  RESERVATION_STARTED = 'RESERVATION_STARTED',
  RESERVATION_COMPLETED = 'RESERVATION_COMPLETED',
  RESERVATION_CANCELLED = 'RESERVATION_CANCELLED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  SYSTEM_ALERT = 'SYSTEM_ALERT'
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  userId: string;
  userRole: string;
  metadata?: {
    reservationId?: string;
    parkingLotId?: string;
    companyId?: string;
    amount?: number;
    [key: string]: any;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAll: () => void;
  getNotificationsByType: (type: NotificationType) => Notification[];
  isConnected: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  // Remover o useEffect que simula notificações mockadas

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const notification: Notification = {
      ...notificationData,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [notification, ...prev]);

    // Mostrar toast para notificações importantes
    if ([
      NotificationType.RESERVATION_CREATED,
      NotificationType.PAYMENT_RECEIVED,
      NotificationType.SYSTEM_ALERT,
      NotificationType.RESERVATION_CANCELLED
    ].includes(notification.type)) {
      toast({
        title: notification.title,
        description: notification.message,
        duration: 5000,
      });
    }

    // Log para desenvolvimento
    console.log('🔔 Nova notificação:', notification);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getNotificationsByType = (type: NotificationType) => {
    return notifications.filter(notification => notification.type === type);
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Simular recebimento de notificações baseado em mudanças de estado
  const simulateReservationNotification = (reservationId: string, newStatus: string, userRole: string) => {
    const notificationMap: Record<string, { type: NotificationType, title: string, getMessage: (id: string) => string }> = {
      'CONFIRMED': {
        type: NotificationType.RESERVATION_CONFIRMED,
        title: 'Reserva Confirmada',
        getMessage: (id) => `Sua reserva ${id.slice(-6)} foi confirmada`
      },
      'IN_PROGRESS': {
        type: NotificationType.RESERVATION_STARTED,
        title: 'Check-in Realizado',
        getMessage: (id) => `Check-in da reserva ${id.slice(-6)} foi realizado`
      },
      'COMPLETED': {
        type: NotificationType.RESERVATION_COMPLETED,
        title: 'Reserva Finalizada',
        getMessage: (id) => `Reserva ${id.slice(-6)} foi finalizada com sucesso`
      },
      'CANCELLED': {
        type: NotificationType.RESERVATION_CANCELLED,
        title: 'Reserva Cancelada',
        getMessage: (id) => `Reserva ${id.slice(-6)} foi cancelada`
      }
    };

    const notificationData = notificationMap[newStatus];
    if (notificationData) {
      addNotification({
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.getMessage(reservationId),
        userId: 'current-user',
        userRole,
        metadata: { reservationId }
      });
    }
  };

  // Expor função para componentes externos
  (window as any).simulateReservationNotification = simulateReservationNotification;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    getNotificationsByType,
    isConnected
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 