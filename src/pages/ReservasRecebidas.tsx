
import React, { useState } from 'react';
import { Calendar, Clock, Car, User, Search, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

interface ReservaRecebida {
  id: string;
  transportadora: string;
  veiculo: string;
  motorista: string;
  vaga: string;
  dataReserva: string;
  horaInicio: string;
  horaFim: string;
  valor: number;
  status: 'pendente' | 'confirmada' | 'em_uso' | 'finalizada' | 'cancelada';
  observacoes?: string;
  telefoneMotorista: string;
}

const ReservasRecebidas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  // Mock data
  const reservas: ReservaRecebida[] = [
    {
      id: '1',
      transportadora: 'Transportadora ABC',
      veiculo: 'ABC-1234',
      motorista: 'João Silva',
      vaga: 'A-15',
      dataReserva: '2024-06-10',
      horaInicio: '08:00',
      horaFim: '18:00',
      valor: 85.00,
      status: 'pendente',
      observacoes: 'Entrega de mercadorias',
      telefoneMotorista: '(11) 9999-8888'
    },
    {
      id: '2',
      transportadora: 'Logística XYZ',
      veiculo: 'DEF-5678',
      motorista: 'Maria Santos',
      vaga: 'B-22',
      dataReserva: '2024-06-11',
      horaInicio: '09:00',
      horaFim: '17:00',
      valor: 96.00,
      status: 'confirmada',
      observacoes: 'Coleta de produtos',
      telefoneMotorista: '(11) 8888-7777'
    },
    {
      id: '3',
      transportadora: 'Express Transportes',
      veiculo: 'GHI-9012',
      motorista: 'Carlos Oliveira',
      vaga: 'C-08',
      dataReserva: '2024-06-12',
      horaInicio: '07:00',
      horaFim: '19:00',
      valor: 180.00,
      status: 'em_uso',
      telefoneMotorista: '(11) 7777-6666'
    }
  ];

  const filteredReservas = reservas.filter(reserva => {
    const matchesSearch = reserva.transportadora.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reserva.veiculo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reserva.motorista.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || reserva.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ReservaRecebida['status']) => {
    switch (status) {
      case 'pendente':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pendente</Badge>;
      case 'confirmada':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Confirmada</Badge>;
      case 'em_uso':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Em Uso</Badge>;
      case 'finalizada':
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Finalizada</Badge>;
      case 'cancelada':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const handleConfirmarReserva = (reserva: ReservaRecebida) => {
    toast({
      title: "Reserva Confirmada",
      description: `A reserva de ${reserva.transportadora} foi confirmada.`,
    });
  };

  const handleRejeitarReserva = (reserva: ReservaRecebida) => {
    toast({
      title: "Reserva Rejeitada",
      description: `A reserva de ${reserva.transportadora} foi rejeitada.`,
      variant: "destructive"
    });
  };

  const reservasPendentes = reservas.filter(r => r.status === 'pendente').length;
  const reservasConfirmadas = reservas.filter(r => r.status === 'confirmada').length;
  const receitaTotal = reservas.filter(r => r.status === 'finalizada').reduce((acc, r) => acc + r.valor, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Reservas Recebidas</h1>
          <p className="text-slate-400">Gerencie as reservas de vagas do seu estacionamento</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="ajh-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Pendentes</p>
                <p className="text-xl font-bold text-white">{reservasPendentes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-400" />
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
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-400" />
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
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Car className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Receita</p>
                <p className="text-xl font-bold text-white">R$ {receitaTotal.toFixed(2)}</p>
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
                  placeholder="Pesquisar por transportadora, veículo ou motorista..."
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
                { key: 'pendente', label: 'Pendentes' },
                { key: 'confirmada', label: 'Confirmadas' },
                { key: 'em_uso', label: 'Em Uso' },
                { key: 'finalizada', label: 'Finalizadas' }
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
                <TableHead className="text-slate-300">Transportadora</TableHead>
                <TableHead className="text-slate-300">Veículo/Motorista</TableHead>
                <TableHead className="text-slate-300">Vaga</TableHead>
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
                      <p className="text-white font-medium">{reserva.transportadora}</p>
                      {reserva.observacoes && (
                        <p className="text-slate-400 text-sm">{reserva.observacoes}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-white text-sm">{reserva.veiculo}</p>
                      <p className="text-slate-400 text-xs">{reserva.motorista}</p>
                      <p className="text-slate-500 text-xs">{reserva.telefoneMotorista}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      {reserva.vaga}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-white text-sm">{new Date(reserva.dataReserva).toLocaleDateString()}</p>
                      <p className="text-slate-400 text-xs">{reserva.horaInicio} - {reserva.horaFim}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-white">
                    R$ {reserva.valor.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(reserva.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {reserva.status === 'pendente' && (
                        <>
                          <Button
                            size="sm"
                            className="ajh-button-primary"
                            onClick={() => handleConfirmarReserva(reserva)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                            onClick={() => handleRejeitarReserva(reserva)}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
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

export default ReservasRecebidas;
