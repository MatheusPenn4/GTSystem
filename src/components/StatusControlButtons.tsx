import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Play, 
  Square, 
  Clock,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNotifications, NotificationType } from '@/contexts/NotificationContext';
import {
  Reservation,
  ReservationStatus,
  StatusLabels,
  AllowedStatusTransitions,
  canTransitionTo,
  getStatusBadgeClasses
} from '@/types/reserva';

interface StatusControlButtonsProps {
  reservation: Reservation;
  userRole: 'ADMIN' | 'TRANSPORTADORA' | 'ESTACIONAMENTO';
  onStatusChange?: (reservationId: string, newStatus: ReservationStatus) => void;
  disabled?: boolean;
}

const StatusControlButtons: React.FC<StatusControlButtonsProps> = ({
  reservation,
  userRole,
  onStatusChange,
  disabled = false
}) => {
  const [loading, setLoading] = useState<ReservationStatus | null>(null);
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  const handleStatusChange = async (newStatus: ReservationStatus) => {
    if (!canTransitionTo(reservation.status, newStatus)) {
      toast({
        title: "Transição não permitida",
        description: `Não é possível alterar de ${StatusLabels[reservation.status]} para ${StatusLabels[newStatus]}.`,
        variant: "destructive"
      });
      return;
    }

    setLoading(newStatus);
    try {
      // TODO: Implementar call real da API
      console.log('Alterando status da reserva:', {
        reservationId: reservation.id,
        from: reservation.status,
        to: newStatus
      });

      // Simulação de API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Callback para o componente pai
      onStatusChange?.(reservation.id, newStatus);

      // Criar notificação baseada no novo status
      const notificationMap: Record<ReservationStatus, { type: NotificationType, title: string, message: string }> = {
        [ReservationStatus.PENDING]: {
          type: NotificationType.RESERVATION_CREATED,
          title: 'Reserva Criada',
          message: `Reserva ${reservation.id.slice(-6)} foi criada`
        },
        [ReservationStatus.CONFIRMED]: {
          type: NotificationType.RESERVATION_CONFIRMED,
          title: 'Reserva Confirmada',
          message: `Reserva ${reservation.id.slice(-6)} foi confirmada`
        },
        [ReservationStatus.IN_PROGRESS]: {
          type: NotificationType.RESERVATION_STARTED,
          title: 'Check-in Realizado',
          message: `Check-in da reserva ${reservation.id.slice(-6)} foi realizado`
        },
        [ReservationStatus.COMPLETED]: {
          type: NotificationType.RESERVATION_COMPLETED,
          title: 'Reserva Finalizada',
          message: `Reserva ${reservation.id.slice(-6)} foi finalizada com sucesso`
        },
        [ReservationStatus.CANCELLED]: {
          type: NotificationType.RESERVATION_CANCELLED,
          title: 'Reserva Cancelada',
          message: `Reserva ${reservation.id.slice(-6)} foi cancelada`
        }
      };

      const notificationData = notificationMap[newStatus];
      if (notificationData) {
        addNotification({
          type: notificationData.type,
          title: notificationData.title,
          message: notificationData.message,
          userId: 'current-user',
          userRole,
          metadata: { reservationId: reservation.id }
        });
      }

      toast({
        title: "Status atualizado",
        description: `Reserva alterada para ${StatusLabels[newStatus]}.`,
      });
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao alterar o status. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const getActionButtons = () => {
    const allowedTransitions = AllowedStatusTransitions[reservation.status];
    const buttons: JSX.Element[] = [];

    // Definir quais roles podem fazer quais transições
    const rolePermissions: Record<string, ReservationStatus[]> = {
      ADMIN: [
        ReservationStatus.CONFIRMED,
        ReservationStatus.IN_PROGRESS,
        ReservationStatus.COMPLETED,
        ReservationStatus.CANCELLED
      ],
      ESTACIONAMENTO: [
        ReservationStatus.CONFIRMED,
        ReservationStatus.IN_PROGRESS,
        ReservationStatus.COMPLETED,
        ReservationStatus.CANCELLED
      ],
      TRANSPORTADORA: [
        ReservationStatus.CANCELLED // Só pode cancelar
      ]
    };

    const userAllowedTransitions = rolePermissions[userRole] || [];

    allowedTransitions.forEach(status => {
      if (!userAllowedTransitions.includes(status)) return;

      const isLoading = loading === status;
      const key = `${reservation.id}-${status}`;

      switch (status) {
        case ReservationStatus.CONFIRMED:
          buttons.push(
            <Button
              key={key}
              size="sm"
              className="ajh-button-primary"
              onClick={() => handleStatusChange(status)}
              disabled={disabled || loading !== null}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span className="ml-1">Confirmar</span>
            </Button>
          );
          break;

        case ReservationStatus.IN_PROGRESS:
          buttons.push(
            <Button
              key={key}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleStatusChange(status)}
              disabled={disabled || loading !== null}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span className="ml-1">Iniciar</span>
            </Button>
          );
          break;

        case ReservationStatus.COMPLETED:
          buttons.push(
            <Button
              key={key}
              size="sm"
              className="bg-gray-600 hover:bg-gray-700 text-white"
              onClick={() => handleStatusChange(status)}
              disabled={disabled || loading !== null}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              <span className="ml-1">Finalizar</span>
            </Button>
          );
          break;

        case ReservationStatus.CANCELLED:
          buttons.push(
            <Button
              key={key}
              size="sm"
              variant="outline"
              className="text-red-400 border-red-500/30 hover:bg-red-500/10"
              onClick={() => handleStatusChange(status)}
              disabled={disabled || loading !== null}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              <span className="ml-1">Cancelar</span>
            </Button>
          );
          break;

        default:
          break;
      }
    });

    return buttons;
  };

  const getStatusBadge = () => {
    const classes = getStatusBadgeClasses(reservation.status);
    return (
      <Badge className={classes}>
        {reservation.status === ReservationStatus.PENDING && <Clock className="w-3 h-3 mr-1" />}
        {reservation.status === ReservationStatus.CONFIRMED && <CheckCircle className="w-3 h-3 mr-1" />}
        {reservation.status === ReservationStatus.IN_PROGRESS && <Play className="w-3 h-3 mr-1" />}
        {reservation.status === ReservationStatus.COMPLETED && <Square className="w-3 h-3 mr-1" />}
        {reservation.status === ReservationStatus.CANCELLED && <XCircle className="w-3 h-3 mr-1" />}
        {StatusLabels[reservation.status]}
      </Badge>
    );
  };

  const actionButtons = getActionButtons();

  return (
    <div className="flex items-center gap-2">
      {getStatusBadge()}
      {actionButtons.length > 0 && (
        <div className="flex gap-1">
          {actionButtons}
        </div>
      )}
    </div>
  );
};

export default StatusControlButtons; 