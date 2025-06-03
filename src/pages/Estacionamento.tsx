import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ParkingCircle, Search, Filter, Car, Clock, CheckCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import ControleManualModal from '@/components/modals/ControleManualModal';

interface Vaga {
  id: string;
  numero: string;
  setor: string;
  status: 'livre' | 'ocupada' | 'reservada' | 'manutencao';
  veiculo?: string;
  motorista?: string;
  entrada?: string;
}

interface EstacionamentoInfo {
  id: string;
  nome: string;
  endereco: string;
  cidade: string;
  totalVagas: number;
}

const Estacionamento: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, isEstacionamento } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [setorFilter, setSetorFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [controleModalOpen, setControleModalOpen] = useState(false);

  // Dados simulados do estacionamento específico
  const estacionamentoInfo: EstacionamentoInfo = {
    id: id || '1',
    nome: id === '2' ? 'Parking Premium' : id === '3' ? 'Estacionamento Norte' : 'Estacionamento Central',
    endereco: id === '2' ? 'Av. Paulista, 456' : id === '3' ? 'Rua do Norte, 789' : 'Rua das Flores, 123',
    cidade: id === '3' ? 'Rio de Janeiro - RJ' : 'São Paulo - SP',
    totalVagas: id === '2' ? 80 : id === '3' ? 60 : 120,
  };

  // Mock data - vagas baseadas no estacionamento
  const vagas: Vaga[] = Array.from({ length: estacionamentoInfo.totalVagas }, (_, i) => {
    const numero = (i + 1).toString().padStart(2, '0');
    const setores = ['A', 'B', 'C'];
    const setor = setores[Math.floor(i / Math.ceil(estacionamentoInfo.totalVagas / 3))];
    const statuses: Vaga['status'][] = ['livre', 'ocupada', 'reservada', 'manutencao'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      id: `vaga-${i + 1}`,
      numero: `${setor}${numero}`,
      setor,
      status,
      veiculo: status === 'ocupada' ? `ABC-${1000 + i}` : undefined,
      motorista: status === 'ocupada' ? `Motorista ${i + 1}` : undefined,
      entrada: status === 'ocupada' ? new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toLocaleTimeString() : undefined,
    };
  });

  const filteredVagas = vagas.filter(vaga => {
    const matchesSearch = vaga.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (vaga.veiculo?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesSetor = setorFilter === 'all' || vaga.setor === setorFilter;
    const matchesStatus = statusFilter === 'all' || vaga.status === statusFilter;
    return matchesSearch && matchesSetor && matchesStatus;
  });

  const getStatusBadge = (status: Vaga['status']) => {
    switch (status) {
      case 'livre':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Livre</Badge>;
      case 'ocupada':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Ocupada</Badge>;
      case 'reservada':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Reservada</Badge>;
      case 'manutencao':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Manutenção</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getStatusIcon = (status: Vaga['status']) => {
    switch (status) {
      case 'livre':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'ocupada':
        return <Car className="w-4 h-4 text-red-400" />;
      case 'reservada':
        return <Clock className="w-4 h-4 text-blue-400" />;
      case 'manutencao':
        return <ParkingCircle className="w-4 h-4 text-yellow-400" />;
      default:
        return <ParkingCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const vagasLivres = vagas.filter(v => v.status === 'livre').length;
  const vagasOcupadas = vagas.filter(v => v.status === 'ocupada').length;
  const vagasReservadas = vagas.filter(v => v.status === 'reservada').length;
  const vagasManutencao = vagas.filter(v => v.status === 'manutencao').length;

  const ocupacaoPercentual = Math.round((vagasOcupadas / vagas.length) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {isAdmin() && (
            <Button
              variant="outline"
              onClick={() => navigate('/estacionamentos')}
              className="ajh-button-secondary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{estacionamentoInfo.nome}</h1>
            <p className="text-slate-400">
              {estacionamentoInfo.endereco} - {estacionamentoInfo.cidade}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button className="ajh-button-secondary">
            <Filter className="w-4 h-4 mr-2" />
            Relatório
          </Button>
          {(isAdmin() || isEstacionamento()) && (
            <Button 
              className="ajh-button-primary"
              onClick={() => setControleModalOpen(true)}
            >
              <ParkingCircle className="w-4 h-4 mr-2" />
              Controle Manual
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="ajh-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Livres</p>
                <p className="text-xl font-bold text-white">{vagasLivres}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Car className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Ocupadas</p>
                <p className="text-xl font-bold text-white">{vagasOcupadas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Reservadas</p>
                <p className="text-xl font-bold text-white">{vagasReservadas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <ParkingCircle className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Manutenção</p>
                <p className="text-xl font-bold text-white">{vagasManutencao}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Occupancy Overview */}
      <Card className="ajh-card">
        <CardHeader>
          <CardTitle className="text-white">Ocupação Geral</CardTitle>
          <CardDescription className="text-slate-400">
            {ocupacaoPercentual}% de ocupação ({vagasOcupadas} de {vagas.length} vagas)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-slate-700 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-ajh-primary to-ajh-secondary h-4 rounded-full transition-all duration-500"
              style={{ width: `${ocupacaoPercentual}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

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
                  placeholder="Pesquisar por número da vaga ou placa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ajh-input pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={setorFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setSetorFilter('all')}
                className={setorFilter === 'all' ? 'ajh-button-primary' : 'ajh-button-secondary'}
                size="sm"
              >
                Todos Setores
              </Button>
              {['A', 'B', 'C'].map(setor => (
                <Button
                  key={setor}
                  variant={setorFilter === setor ? 'default' : 'outline'}
                  onClick={() => setSetorFilter(setor)}
                  className={setorFilter === setor ? 'ajh-button-primary' : 'ajh-button-secondary'}
                  size="sm"
                >
                  Setor {setor}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
              className={statusFilter === 'all' ? 'ajh-button-primary' : 'ajh-button-secondary'}
              size="sm"
            >
              Todos Status
            </Button>
            {[
              { key: 'livre', label: 'Livres' },
              { key: 'ocupada', label: 'Ocupadas' },
              { key: 'reservada', label: 'Reservadas' },
              { key: 'manutencao', label: 'Manutenção' }
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
        </CardContent>
      </Card>

      {/* Parking Grid */}
      <Card className="ajh-card">
        <CardHeader>
          <CardTitle className="text-white">Mapa do Estacionamento</CardTitle>
          <CardDescription className="text-slate-400">
            {filteredVagas.length} vaga(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {filteredVagas.map((vaga) => (
              <div
                key={vaga.id}
                className={`
                  relative p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:scale-105
                  ${vaga.status === 'livre' ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20' : ''}
                  ${vaga.status === 'ocupada' ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20' : ''}
                  ${vaga.status === 'reservada' ? 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20' : ''}
                  ${vaga.status === 'manutencao' ? 'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20' : ''}
                `}
                title={`Vaga ${vaga.numero} - ${vaga.status}${vaga.veiculo ? ` (${vaga.veiculo})` : ''}`}
              >
                <div className="flex flex-col items-center space-y-1">
                  {getStatusIcon(vaga.status)}
                  <span className="text-white text-xs font-medium">{vaga.numero}</span>
                  {vaga.veiculo && (
                    <span className="text-xs text-slate-400 truncate w-full text-center">
                      {vaga.veiculo}
                    </span>
                  )}
                  {vaga.entrada && (
                    <span className="text-xs text-slate-500">
                      {vaga.entrada}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ControleManualModal 
        open={controleModalOpen}
        onOpenChange={setControleModalOpen}
      />
    </div>
  );
};

export default Estacionamento;
