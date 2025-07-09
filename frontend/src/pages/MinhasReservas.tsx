
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Car, User, Search, Filter, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  Reservation, 
  ReservationStatus, 
  PaymentStatus,
  VehicleType,
  StatusLabels, 
  getStatusBadgeClasses,
  formatCurrency,
  formatDate,
  formatTime,
  canTransitionTo
} from '@/types/reserva';

const MinhasReservas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Estado para armazenar reservas reais do banco de dados
  const [reservas, setReservas] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar reservas reais ao montar o componente
  useEffect(() => {
    loadReservas();
  }, []);

  const loadReservas = async () => {
    try {
      setIsLoading(true);
      console.log('Carregando reservas reais do banco de dados...');
      
      // Por enquanto manter lista vazia mas preparar para o service
      // const ReservationService = (await import('@/services/reservations')).default;
      // const reservasFromAPI = await ReservationService.getMyReservations();
      // setReservas(reservasFromAPI);
      
      setReservas([]);
      console.log('Reservas carregadas: 0 (aguardando mapeamento de tipos)');
      
    } catch (error: any) {
      console.error('Erro ao carregar reservas:', error);
      setReservas([]); // Garantir lista vazia em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  const filteredReservas = reservas.filter(reserva => {
    const matchesSearch = reserva.parkingLot?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reserva.vehicle?.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reserva.driver?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || reserva.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ReservationStatus) => {
    const classes = getStatusBadgeClasses(status);
    return <Badge className={classes}>{StatusLabels[status]}</Badge>;
  };

  const handleCancelarReserva = async (reserva: Reservation) => {
    if (!canTransitionTo(reserva.status, ReservationStatus.CANCELLED)) {
      toast({
        title: "Ação não permitida",
        description: `Não é possível cancelar uma reserva com status ${StatusLabels[reserva.status]}.`,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Implementar call real da API
      console.log('Cancelando reserva:', reserva.id);
      
      const ReservationService = (await import('@/services/reservations')).default;
      await ReservationService.cancelReservation(reserva.id, 'Cancelado pelo usuário');

      // Atualizar a lista local
      setReservas(prev => prev.map(r => 
        r.id === reserva.id 
          ? { ...r, status: ReservationStatus.CANCELLED }
          : r
      ));

      toast({
        title: "Reserva Cancelada",
        description: `A reserva para ${reserva.parkingLot?.name} foi cancelada.`,
        variant: "destructive"
      });
    } catch (error: any) {
      console.error('Erro ao cancelar reserva:', error);
      toast({
        title: "Erro ao cancelar",
        description: error.message || "Ocorreu um erro ao cancelar a reserva. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const reservasConfirmadas = reservas.filter(r => r.status === ReservationStatus.CONFIRMED).length;
  const reservasEmAndamento = reservas.filter(r => r.status === ReservationStatus.IN_PROGRESS).length;
  const valorTotal = reservas.reduce((acc, r) => acc + (r.totalCost || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Minhas Reservas</h1>
          <p className="text-slate-400">Gerencie suas reservas de vagas de estacionamento</p>
        </div>
        <Button className="ajh-button-primary">
          <Calendar className="w-4 h-4 mr-2" />
          Nova Reserva
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="ajh-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Confirmadas</p>
                <p className="text-xl font-bold text-white">{reservasConfirmadas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Em Andamento</p>
                <p className="text-xl font-bold text-white">{reservasEmAndamento}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <MapPin className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Total</p>
                <p className="text-xl font-bold text-white">{reservas.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Car className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Valor Total</p>
                <p className="text-xl font-bold text-white">{formatCurrency(valorTotal)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="ajh-card">
        <CardHeader>
          <CardTitle className="text-white">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Pesquisar por estacionamento, veículo ou motorista..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ajh-input pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                className={statusFilter === 'all' ? 'ajh-button-primary' : 'ajh-button-secondary'}
                size="sm"
              >
                Todas
              </Button>
              {[
                { key: ReservationStatus.PENDING, label: 'Pendentes' },
                { key: ReservationStatus.CONFIRMED, label: 'Confirmadas' },
                { key: ReservationStatus.IN_PROGRESS, label: 'Em Andamento' },
                { key: ReservationStatus.COMPLETED, label: 'Finalizadas' },
                { key: ReservationStatus.CANCELLED, label: 'Canceladas' }
              ].map(status => (
                <Button
                  key={status.key}
                  variant={statusFilter === status.key ? 'default' : 'outline'}
                  onClick={() => setStatusFilter(status.key)}
                  className={statusFilter === status.key ? 'ajh-button-primary' : 'ajh-button-secondary'}
                  size="sm"
                >
                  {status.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="ajh-card">
        <CardHeader>
          <CardTitle className="text-white">Lista de Reservas</CardTitle>
          <CardDescription className="text-slate-400">
            {filteredReservas.length} reserva(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-800/50">
                <TableHead className="text-slate-300">Estacionamento</TableHead>
                <TableHead className="text-slate-300">Vaga</TableHead>
                <TableHead className="text-slate-300">Veículo/Motorista</TableHead>
                <TableHead className="text-slate-300">Data/Horário</TableHead>
                <TableHead className="text-slate-300">Valor</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservas.map((reserva) => (
                <TableRow key={reserva.id} className="border-slate-700 hover:bg-slate-800/50">
                  <TableCell>
                    <div>
                      <p className="text-white font-medium">{reserva.parkingLot?.name}</p>
                      <p className="text-slate-400 text-sm">{reserva.parkingLot?.address}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      {reserva.parkingSpace?.spaceNumber || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-white text-sm">{reserva.vehicle?.licensePlate}</p>
                      <p className="text-slate-400 text-xs">{reserva.driver?.name}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-white text-sm">{formatDate(reserva.startTime)}</p>
                      <p className="text-slate-400 text-xs">{formatTime(reserva.startTime)} - {formatTime(reserva.endTime)}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-white">
                    {formatCurrency(reserva.totalCost || 0)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(reserva.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {canTransitionTo(reserva.status, ReservationStatus.CANCELLED) && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                          onClick={() => handleCancelarReserva(reserva)}
                          disabled={loading}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MinhasReservas;
