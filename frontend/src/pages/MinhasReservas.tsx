
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

// Dados de demonstração para quando o backend não estiver disponível
const generateDemoReservations = (): Reservation[] => {
  const today = new Date();
  return [
    {
      id: '1',
      parkingLotId: 'pl-001',
      companyId: 'company-001',
      vehicleId: 'vehicle-001',
      driverId: 'driver-001',
      startTime: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString(), // Amanhã
      endTime: new Date(today.getTime() + 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(), // +8 horas
      status: ReservationStatus.CONFIRMED,
      totalCost: 120.00,
      paymentStatus: PaymentStatus.PAID,
      specialRequests: 'Vaga próxima à entrada',
      createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      parkingLot: {
        id: 'pl-001',
        companyId: 'company-est-001',
        name: 'Estacionamento Central Plaza',
        address: 'Rua das Flores, 123 - Centro',
        totalSpaces: 50,
        availableSpaces: 35,
        pricePerHour: 15.00,
        isActive: true,
        createdAt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      company: {
        id: 'company-001',
        name: 'Transportes Unidos Ltda',
        cnpj: '12.345.678/0001-90',
        companyType: 'TRANSPORTADORA',
        isActive: true,
        createdAt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      vehicle: {
        id: 'vehicle-001',
        companyId: 'company-001',
        licensePlate: 'ABC-1234',
        vehicleType: VehicleType.CAMINHAO,
        brand: 'Mercedes-Benz',
        model: 'Atego 1719',
        year: 2020,
        color: 'Branco',
        driverId: 'driver-001',
        isActive: true,
        createdAt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      driver: {
        id: 'driver-001',
        companyId: 'company-001',
        name: 'João Silva Santos',
        cpf: '123.456.789-00',
        cnh: '12345678901',
        phone: '(11) 99999-1111',
        email: 'joao@transportesunidos.com.br',
        isActive: true,
        createdAt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    },
    {
      id: '2',
      parkingLotId: 'pl-002',
      companyId: 'company-001',
      vehicleId: 'vehicle-002',
      driverId: 'driver-002',
      startTime: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // Em 3 dias
      endTime: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000).toISOString(), // +12 horas
      status: ReservationStatus.PENDING,
      totalCost: 240.00,
      paymentStatus: PaymentStatus.PENDING,
      specialRequests: 'Precisa de tomada para refrigeração',
      createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      parkingLot: {
        id: 'pl-002',
        companyId: 'company-est-002',
        name: 'Pátio Logístico Norte',
        address: 'Av. Industrial, 456 - Distrito Industrial',
        totalSpaces: 100,
        availableSpaces: 75,
        pricePerHour: 20.00,
        isActive: true,
        createdAt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      company: {
        id: 'company-001',
        name: 'Transportes Unidos Ltda',
        cnpj: '12.345.678/0001-90',
        companyType: 'TRANSPORTADORA',
        isActive: true,
        createdAt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      vehicle: {
        id: 'vehicle-002',
        companyId: 'company-001',
        licensePlate: 'DEF-5678',
        vehicleType: VehicleType.CAMINHAO,
        brand: 'Volvo',
        model: 'FH 540',
        year: 2021,
        color: 'Azul',
        driverId: 'driver-002',
        isActive: true,
        createdAt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      driver: {
        id: 'driver-002',
        companyId: 'company-001',
        name: 'Maria Oliveira',
        cpf: '987.654.321-00',
        cnh: '09876543210',
        phone: '(11) 99999-2222',
        email: 'maria@transportesunidos.com.br',
        isActive: true,
        createdAt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    },
    {
      id: '3',
      parkingLotId: 'pl-001',
      companyId: 'company-001',
      vehicleId: 'vehicle-001',
      driverId: 'driver-001',
      startTime: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias atrás
      endTime: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(), // +6 horas
      status: ReservationStatus.COMPLETED,
      totalCost: 90.00,
      paymentStatus: PaymentStatus.PAID,
      createdAt: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      parkingLot: {
        id: 'pl-001',
        companyId: 'company-est-001',
        name: 'Estacionamento Central Plaza',
        address: 'Rua das Flores, 123 - Centro',
        totalSpaces: 50,
        availableSpaces: 35,
        pricePerHour: 15.00,
        isActive: true,
        createdAt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      company: {
        id: 'company-001',
        name: 'Transportes Unidos Ltda',
        cnpj: '12.345.678/0001-90',
        companyType: 'TRANSPORTADORA',
        isActive: true,
        createdAt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      vehicle: {
        id: 'vehicle-001',
        companyId: 'company-001',
        licensePlate: 'ABC-1234',
        vehicleType: VehicleType.CAMINHAO,
        brand: 'Mercedes-Benz',
        model: 'Atego 1719',
        year: 2020,
        color: 'Branco',
        driverId: 'driver-001',
        isActive: true,
        createdAt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      driver: {
        id: 'driver-001',
        companyId: 'company-001',
        name: 'João Silva Santos',
        cpf: '123.456.789-00',
        cnh: '12345678901',
        phone: '(11) 99999-1111',
        email: 'joao@transportesunidos.com.br',
        isActive: true,
        createdAt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  ];
};

const MinhasReservas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Estado para armazenar reservas reais do banco de dados
  const [reservas, setReservas] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingDemoData, setIsUsingDemoData] = useState(false);

  // Carregar reservas reais ao montar o componente
  useEffect(() => {
    loadReservas();
  }, []);

  const loadReservas = async () => {
    try {
      setIsLoading(true);
      console.log('Tentando carregar reservas reais do banco de dados...');
      
             // Tentar carregar dados reais do backend
       try {
         const ReservationService = (await import('@/services/reservations')).default;
         const reservasFromAPI = await ReservationService.getMyReservations();
         setReservas(reservasFromAPI as unknown as Reservation[]);
         setIsUsingDemoData(false);
         console.log('Reservas carregadas do backend:', reservasFromAPI.length);
      } catch (backendError) {
        console.warn('Backend não disponível, usando dados de demonstração:', backendError);
        const demoReservations = generateDemoReservations();
        setReservas(demoReservations);
        setIsUsingDemoData(true);
        
        toast({
          title: "Modo Demonstração",
          description: "Backend não disponível. Exibindo dados de demonstração.",
          variant: "default"
        });
      }
      
    } catch (error: any) {
      console.error('Erro ao carregar reservas:', error);
      const demoReservations = generateDemoReservations();
      setReservas(demoReservations);
      setIsUsingDemoData(true);
      
      toast({
        title: "Modo Demonstração",
        description: "Erro ao conectar com o servidor. Exibindo dados de demonstração.",
        variant: "default"
      });
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
      if (isUsingDemoData) {
        // Simular cancelamento em modo demo
        setReservas(prev => prev.map(r => 
          r.id === reserva.id 
            ? { ...r, status: ReservationStatus.CANCELLED }
            : r
        ));
        
        toast({
          title: "Reserva Cancelada (Demo)",
          description: `A reserva para ${reserva.parkingLot?.name} foi cancelada.`,
          variant: "destructive"
        });
      } else {
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
      }
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

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Carregando suas reservas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner de modo demo */}
      {isUsingDemoData && (
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <p className="text-yellow-400 text-sm">
                <strong>Modo Demonstração:</strong> Backend não disponível. Exibindo dados de exemplo.
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={loadReservas}
                className="ml-auto text-yellow-400 border-yellow-400 hover:bg-yellow-400/10"
              >
                Tentar Reconectar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
          {filteredReservas.length === 0 ? (
            <div className="text-center py-12">
              <Car className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Nenhuma reserva encontrada</h3>
              <p className="text-slate-400 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Você ainda não possui reservas cadastradas.'
                }
              </p>
              <Button className="ajh-button-primary">
                <Calendar className="w-4 h-4 mr-2" />
                Fazer Nova Reserva
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Estacionamento</TableHead>
                    <TableHead className="text-slate-300">Veículo</TableHead>
                    <TableHead className="text-slate-300">Motorista</TableHead>
                    <TableHead className="text-slate-300">Data/Hora</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Valor</TableHead>
                    <TableHead className="text-slate-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservas.map((reserva) => (
                    <TableRow key={reserva.id} className="border-slate-700 hover:bg-slate-800/50">
                      <TableCell className="text-white">
                        <div>
                          <p className="font-medium">{reserva.parkingLot?.name}</p>
                          <p className="text-sm text-slate-400">{reserva.parkingLot?.address}</p>
                        </div>
                      </TableCell>
                                             <TableCell className="text-white">
                         <div>
                           <p className="font-medium">{reserva.vehicle?.licensePlate}</p>
                           <p className="text-sm text-slate-400">{reserva.vehicle?.model}</p>
                         </div>
                       </TableCell>
                      <TableCell className="text-white">
                        <div>
                          <p className="font-medium">{reserva.driver?.name}</p>
                          <p className="text-sm text-slate-400">CNH: {reserva.driver?.cnh}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-white">
                        <div>
                          <p className="font-medium">{formatDate(reserva.startTime)}</p>
                          <p className="text-sm text-slate-400">
                            {formatTime(reserva.startTime)} - {formatTime(reserva.endTime)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(reserva.status)}
                      </TableCell>
                      <TableCell className="text-white font-medium">
                        {formatCurrency(reserva.totalCost)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {canTransitionTo(reserva.status, ReservationStatus.CANCELLED) && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCancelarReserva(reserva)}
                              disabled={loading}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MinhasReservas;
