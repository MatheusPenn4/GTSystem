import React, { useState } from 'react';
import { Bell, Check, X, CheckCheck, Trash2, Circle, Dot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotifications, NotificationType, type Notification } from '@/contexts/NotificationContext';

const NotificationBell: React.FC = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAll,
    isConnected 
  } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type: NotificationType) => {
    const iconClasses = "w-4 h-4";
    
    switch (type) {
      case NotificationType.RESERVATION_CREATED:
        return <Circle className={`${iconClasses} text-blue-400`} />;
      case NotificationType.RESERVATION_CONFIRMED:
        return <Check className={`${iconClasses} text-green-400`} />;
      case NotificationType.RESERVATION_STARTED:
        return <Dot className={`${iconClasses} text-yellow-400`} />;
      case NotificationType.RESERVATION_COMPLETED:
        return <CheckCheck className={`${iconClasses} text-gray-400`} />;
      case NotificationType.RESERVATION_CANCELLED:
        return <X className={`${iconClasses} text-red-400`} />;
      case NotificationType.PAYMENT_RECEIVED:
        return <Circle className={`${iconClasses} text-green-500`} />;
      case NotificationType.SYSTEM_ALERT:
        return <Circle className={`${iconClasses} text-orange-400`} />;
      default:
        return <Circle className={`${iconClasses} text-slate-400`} />;
    }
  };

  const getTypeLabel = (type: NotificationType) => {
    const labels: Record<NotificationType, string> = {
      [NotificationType.RESERVATION_CREATED]: 'Nova Reserva',
      [NotificationType.RESERVATION_CONFIRMED]: 'Confirmada',
      [NotificationType.RESERVATION_STARTED]: 'Iniciada',
      [NotificationType.RESERVATION_COMPLETED]: 'Finalizada',
      [NotificationType.RESERVATION_CANCELLED]: 'Cancelada',
      [NotificationType.PAYMENT_RECEIVED]: 'Pagamento',
      [NotificationType.SYSTEM_ALERT]: 'Sistema'
    };
    return labels[type] || 'Notificação';
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    // Aqui poderia navegar para página específica baseada no tipo
    console.log('Clicou na notificação:', notification);
  };

  return (
    <div className="relative">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2 hover:bg-slate-800/50"
          >
            <Bell className={`w-5 h-5 ${isConnected ? 'text-slate-300' : 'text-slate-500'}`} />
            {unreadCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white border-0"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          className="w-80 p-0 ajh-card border-slate-600" 
          align="end"
          sideOffset={5}
        >
          <div className="p-4 border-b border-slate-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white">Notificações</h3>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                  <span className="text-xs text-slate-400">
                    {isConnected ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              
              {unreadCount > 0 && (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs text-slate-400 hover:text-white h-6 px-2"
                  >
                    <CheckCheck className="w-3 h-3 mr-1" />
                    Marcar todas
                  </Button>
                </div>
              )}
            </div>
            
            {unreadCount > 0 && (
              <p className="text-xs text-slate-400 mt-1">
                {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}
              </p>
            )}
          </div>

          <ScrollArea className="h-80">
            {notifications.length === 0 ? (
              <div className="p-4 text-center">
                <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">Nenhuma notificação</p>
              </div>
            ) : (
              <div className="space-y-1 p-1">
                {notifications.map((notification, index) => (
                  <div key={notification.id}>
                    <div
                      className={`p-3 hover:bg-slate-800/50 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-slate-800/30' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge 
                              variant="outline" 
                              className="text-xs border-slate-600 text-slate-300"
                            >
                              {getTypeLabel(notification.type)}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                            )}
                          </div>
                          
                          <h4 className="text-sm font-medium text-white mb-1">
                            {notification.title}
                          </h4>
                          
                          <p className="text-xs text-slate-400 line-clamp-2">
                            {notification.message}
                          </p>
                          
                          {notification.metadata?.amount && (
                            <p className="text-xs text-green-400 mt-1">
                              Valor: R$ {notification.metadata.amount.toFixed(2)}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="h-6 w-6 p-0 text-slate-400 hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {index < notifications.length - 1 && (
                      <Separator className="bg-slate-700/50" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {notifications.length > 0 && (
            <div className="p-2 border-t border-slate-600">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="w-full text-xs text-slate-400 hover:text-red-400"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Limpar todas
              </Button>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NotificationBell; 