import api from './api';

export interface Notification {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'info' | 'success' | 'warning' | 'error';
  lida: boolean;
  data: string;
  userId?: string;
}

const NotificationService = {
  // Buscar notificações do usuário
  getNotifications: async (): Promise<Notification[]> => {
    try {
      console.log('Tentando buscar notificações...');
      
      const response = await api.get('/notifications', { timeout: 8000 });
      console.log('Notificações obtidas com sucesso!', response.data.length);
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      throw error;
    }
  },

  // Marcar notificação como lida
  markAsRead: async (id: string): Promise<void> => {
    try {
      console.log(`Tentando marcar notificação ${id} como lida...`);
      
      await api.put(`/notifications/${id}/read`, {}, { timeout: 8000 });
      console.log('Notificação marcada como lida!');
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      throw error;
    }
  },

  // Marcar todas as notificações como lidas
  markAllAsRead: async (): Promise<void> => {
    try {
      console.log('Tentando marcar todas as notificações como lidas...');
      
      await api.put('/notifications/read-all', {}, { timeout: 8000 });
      console.log('Todas as notificações marcadas como lidas!');
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
      throw error;
    }
  },

  // Deletar notificação
  deleteNotification: async (id: string): Promise<void> => {
    try {
      console.log(`Tentando deletar notificação ${id}...`);
      
      await api.delete(`/notifications/${id}`, { timeout: 8000 });
      console.log('Notificação deletada com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
      throw error;
    }
  },

  // Buscar contagem de notificações não lidas
  getUnreadCount: async (): Promise<number> => {
    try {
      console.log('Tentando buscar contagem de notificações não lidas...');
      
      const response = await api.get('/notifications/unread-count', { timeout: 8000 });
      console.log('Contagem de notificações não lidas obtida!', response.data.count);
      
      return response.data.count;
    } catch (error) {
      console.error('Erro ao buscar contagem de notificações não lidas:', error);
      throw error;
    }
  }
};

export default NotificationService; 