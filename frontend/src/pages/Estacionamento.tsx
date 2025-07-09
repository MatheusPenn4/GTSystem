
import React, { useState, useEffect } from 'react';
import { ParkingCircle, Search, Filter, Car, Clock, CheckCircle, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import ControleManualModal from '@/components/ControleManualModal';

interface Vaga {
  id: string;
  numero: string;
  setor: string;
  status: 'livre' | 'ocupada' | 'reservada' | 'manutencao';
  veiculo?: string;
  motorista?: string;
  entrada?: string;
}

const Estacionamento: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [setorFilter, setSetorFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVaga, setSelectedVaga] = useState<Vaga | null>(null);
  const { toast } = useToast();

  // Estado para vagas reais do banco de dados
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVagas();
  }, []);

  const loadVagas = async () => {
    try {
      setIsLoading(true);
      console.log('Carregando vagas reais do banco de dados...');
      
      // Importar e usar o ParkingSpaceService
      const ParkingSpaceService = (await import('@/services/parkingSpaces')).default;
      const vagasFromAPI = await ParkingSpaceService.getMySpaces();
      
      // Mapear para o formato local da interface Vaga
      const vagasMapeadas: Vaga[] = vagasFromAPI.map(space => ({
        id: space.id,
        numero: space.numero,
        setor: space.setor || 'A', // Valor padrão se não tiver setor
        status: space.status,
        veiculo: space.veiculo?.placa,
        motorista: space.veiculo?.transportadora || space.reserva?.motorista,
        entrada: space.reserva?.inicio ? new Date(space.reserva.inicio).toLocaleTimeString() : undefined,
      }));
      
      setVagas(vagasMapeadas);
      console.log('Vagas carregadas:', vagasMapeadas.length);
      
    } catch (error: any) {
      console.error('Erro ao carregar vagas:', error);
      setVagas([]);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleVagaClick = (vaga: Vaga) => {
    setSelectedVaga(vaga);
    setModalOpen(true);
  };

  const handleRelatorio = () => {
    toast({
      title: "Relatório Gerado",
      description: "O relatório do estacionamento foi baixado com sucesso.",
    });
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
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Estacionamento</h1>
          <p className="text-slate-400">Gerencie as vagas e ocupação do estacionamento</p>
        </div>
        <div className="flex gap-2">
          <Button 
            className="ajh-button-secondary"
            onClick={handleRelatorio}
          >
            <Download className="w-4 h-4 mr-2" />
            Relatório
          </Button>
          <Button 
            className="ajh-button-primary"
            onClick={() => setModalOpen(true)}
          >
            <ParkingCircle className="w-4 h-4 mr-2" />
            Controle Manual
          </Button>
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
            {filteredVagas.length} vaga(s) encontrada(s) - Clique em uma vaga para gerenciar
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
                title={`Vaga ${vaga.numero} - ${vaga.status}${vaga.veiculo ? ` (${vaga.veiculo})` : ''} - Clique para gerenciar`}
                onClick={() => handleVagaClick(vaga)}
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

      {/* Modal de Controle Manual */}
      <ControleManualModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        vaga={selectedVaga}
      />
    </div>
  );
};

export default Estacionamento;
