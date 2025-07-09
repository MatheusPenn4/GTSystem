import api from '@/lib/api';

export interface NotificationAPI {
  id: string;
  userId: string;
  type: 'RESERVATION_CREATED' | 'RESERVATION_CONFIRMED' | 'RESERVATION_STARTED' | 
        'RESERVATION_COMPLETED' | 'RESERVATION_CANCELLED' | 'PAYMENT_RECEIVED' | 'SYSTEM_ALERT';
  title: string;
  message: string;
  read: boolean;
  data?: any;
  createdAt: string;
  updatedAt: string;
}

const NotificationService = {
  // Buscar notificações do usuário
  getMyNotifications: async (): Promise<NotificationAPI[]> => {
    try {
      console.log('Carregando notificações do backend...');
      
      const response = await api.get('/notifications/my-notifications', {
        timeout: 8000
      });
      
      console.log('Notificações carregadas com sucesso!', response.data.length);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar notificações:', error);
      
      if (error.response?.status === 404) {
        console.warn('Endpoint de notificações não implementado ainda no backend');
        return [];
      }
      throw error;
    }
  },

  // Marcar notificação como lida
  markAsRead: async (notificationId: string): Promise<void> => {
    try {
      console.log('Marcando notificação como lida...', { notificationId });
      
      await api.put(`/notifications/${notificationId}/read`, {}, {
        timeout: 8000
      });
      
      console.log('Notificação marcada como lida com sucesso!');
    } catch (error: any) {
      console.error('Erro ao marcar notificação como lida:', error);
      
      if (error.response?.status === 404) {
        console.warn('Endpoint de marcar como lida não implementado ainda no backend');
        return;
      }
      throw error;
    }
  },

  // Marcar todas as notificações como lidas
  markAllAsRead: async (): Promise<void> => {
    try {
      console.log('Marcando todas as notificações como lidas...');
      
      await api.put('/notifications/mark-all-read', {}, {
        timeout: 8000
      });
      
      console.log('Todas as notificações marcadas como lidas com sucesso!');
    } catch (error: any) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
      
      if (error.response?.status === 404) {
        console.warn('Endpoint de marcar todas como lidas não implementado ainda no backend');
        return;
      }
      throw error;
    }
  },

  // Deletar uma notificação
  deleteNotification: async (notificationId: string): Promise<void> => {
    try {
      console.log('Deletando notificação...', { notificationId });
      
      await api.delete(`/notifications/${notificationId}`, {
        timeout: 8000
      });
      
      console.log('Notificação deletada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao deletar notificação:', error);
      
      if (error.response?.status === 404) {
        console.warn('Endpoint de deletar notificação não implementado ainda no backend');
        return;
      }
      throw error;
    }
  },

  // Deletar todas as notificações
  clearAllNotifications: async (): Promise<void> => {
    try {
      console.log('Deletando todas as notificações...');
      
      await api.delete('/notifications/clear-all', {
        timeout: 8000
      });
      
      console.log('Todas as notificações deletadas com sucesso!');
    } catch (error: any) {
      console.error('Erro ao deletar todas as notificações:', error);
      
      if (error.response?.status === 404) {
        console.warn('Endpoint de deletar todas não implementado ainda no backend');
        return;
      }
      throw error;
    }
  },

  // Configurar preferências de notificação
  updatePreferences: async (preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    types: string[];
  }): Promise<void> => {
    try {
      console.log('Atualizando preferências de notificação...', preferences);
      
      await api.put('/notifications/preferences', preferences, {
        timeout: 8000
      });
      
      console.log('Preferências de notificação atualizadas com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atualizar preferências:', error);
      
      if (error.response?.status === 404) {
        console.warn('Endpoint de preferências não implementado ainda no backend');
        return;
      }
      throw error;
    }
  },

  // Buscar notificações não lidas
  getUnreadCount: async (): Promise<number> => {
    try {
      console.log('Carregando contagem de notificações não lidas...');
      
      const response = await api.get('/notifications/unread-count', {
        timeout: 8000
      });
      
      console.log('Contagem de não lidas carregada:', response.data.count);
      return response.data.count || 0;
    } catch (error: any) {
      console.error('Erro ao buscar contagem não lidas:', error);
      
      if (error.response?.status === 404) {
        console.warn('Endpoint de contagem não implementado ainda no backend');
        return 0;
      }
      throw error;
    }
  }
};

export default NotificationService; 