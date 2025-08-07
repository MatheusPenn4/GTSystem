import React, { useState, useEffect } from 'react';
import { ParkingCircle, Car, MapPin, Clock, Settings, RefreshCw, CheckCircle, XCircle, AlertTriangle, Wrench, Save, RotateCcw, DollarSign, Timer, Hash } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Vaga {
  id: string;
  numero: string;
  tipo: 'caminhao' | 'carreta';
  status: 'livre' | 'ocupada' | 'reservada' | 'manutencao';
  veiculo?: {
    placa: string;
    modelo: string;
    transportadora: string;
  };
  reserva?: {
    inicio: string;
    fim: string;
    motorista: string;
  };
  ultimaAtualizacao: string;
}

const MinhasVagas: React.FC = () => {
  const { user } = useAuth();
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [tipoFilter, setTipoFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVaga, setSelectedVaga] = useState<Vaga | null>(null);
  const [vagaModalOpen, setVagaModalOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  
  // Estados para controle de veículos
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showOccupyForm, setShowOccupyForm] = useState(false);

  // Estados para configuração das vagas
  const [configData, setConfigData] = useState({
    totalVagas: 50,
    vagasCaminhao: 40,
    vagasCarreta: 10,
    precoHoraCaminhao: 15.00,
    precoHoraCarreta: 25.00,
    horarioAbertura: '06:00',
    horarioFechamento: '22:00',
    funcionamento24h: false,
    prefixoNumeracao: 'C',
    numeroInicial: 1,
    autoReserva: true,
    tempoLimiteReserva: 60
  });
  const [activeConfigTab, setActiveConfigTab] = useState('geral');
  const [isGeneratingSpaces, setIsGeneratingSpaces] = useState(false);

  useEffect(() => {
    loadVagas();
    
    // Auto refresh a cada 30 segundos se habilitado
    if (autoRefresh) {
      const interval = setInterval(loadVagas, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadVagas = async () => {
    try {
      setIsLoading(true);
      console.log('Carregando vagas reais do banco de dados...');
      
      // Importar e usar o ParkingSpaceService
      const ParkingSpaceService = (await import('@/services/parkingSpaces')).default;
      const vagasFromAPI = await ParkingSpaceService.getMySpaces();
      
      setVagas(vagasFromAPI);
      console.log('Vagas carregadas:', vagasFromAPI.length);
      
    } catch (error: any) {
      console.error('Erro ao carregar vagas:', error);
      setVagas([]);
      toast({
        title: "Erro ao carregar vagas",
        description: error.message || "Não foi possível carregar o status das vagas do banco de dados.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredVagas = () => {
    return vagas.filter(vaga => {
      const matchesTipo = tipoFilter === 'all' || vaga.tipo === tipoFilter;
      const matchesStatus = statusFilter === 'all' || vaga.status === statusFilter;
      return matchesTipo && matchesStatus;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'livre': return 'bg-green-600';
      case 'ocupada': return 'bg-red-600';
      case 'reservada': return 'bg-yellow-600';
      case 'manutencao': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      livre: 'bg-green-600',
      ocupada: 'bg-red-600',
      reservada: 'bg-yellow-600',
      manutencao: 'bg-gray-600'
    };
    
    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'livre': return <CheckCircle className="w-4 h-4" />;
      case 'ocupada': return <XCircle className="w-4 h-4" />;
      case 'reservada': return <AlertTriangle className="w-4 h-4" />;
      case 'manutencao': return <Wrench className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'carro': return <Car className="w-4 h-4" />;
      case 'moto': return <Car className="w-3 h-3" />;
      case 'caminhao': return <Car className="w-5 h-5" />;
      default: return <Car className="w-4 h-4" />;
    }
  };

  const handleVagaClick = (vaga: Vaga) => {
    setSelectedVaga(vaga);
    setVagaModalOpen(true);
    
    // Resetar formulário de ocupação
    setVehicleSearch('');
    setSelectedVehicle(null);
    setSearchResults([]);
    setShowOccupyForm(false);
  };

  const toggleVagaStatus = async (vagaId: string, novoStatus: string) => {
    try {
      const vagaNumero = vagas.find(v => v.id === vagaId)?.numero;
      
      if (novoStatus === 'ocupada') {
        setShowOccupyForm(true);
        return;
      }
      
      if (novoStatus === 'livre') {
        // Liberar vaga diretamente
        const ParkingSpaceService = (await import('@/services/parkingSpaces')).default;
        await ParkingSpaceService.freeSpace(vagaId);
        
        toast({
          title: "Vaga liberada",
          description: `Vaga ${vagaNumero} foi liberada com sucesso.`,
        });
        
        // Recarregar vagas após liberar
        loadVagas();
        setVagaModalOpen(false);
        setSelectedVaga(null);
        return;
      }
      
      // Para outros status, usar método antigo
      const ParkingSpaceService = (await import('@/services/parkingSpaces')).default;
      await ParkingSpaceService.updateSpaceStatus(vagaId, novoStatus);
      
      // Atualizar estado local após sucesso na API
      setVagas(prev => prev.map(vaga => 
        vaga.id === vagaId 
          ? { ...vaga, status: novoStatus as any, ultimaAtualizacao: new Date().toISOString() }
          : vaga
      ));
      
      toast({
        title: "Status atualizado",
        description: `Vaga ${vagaNumero} foi marcada como ${novoStatus}.`,
      });

      // Fechar modal após atualização
      setVagaModalOpen(false);
      setSelectedVaga(null);
      
    } catch (error: any) {
      console.error('Erro ao atualizar status da vaga:', error);
      toast({
        title: "Erro ao atualizar status",
        description: error.message || "Não foi possível atualizar o status da vaga.",
        variant: "destructive",
      });
    }
  };

  const searchVehicles = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const ParkingSpaceService = (await import('@/services/parkingSpaces')).default;
      const vehicles = await ParkingSpaceService.searchVehicles(query);
      setSearchResults(vehicles);
    } catch (error: any) {
      console.error('Erro ao buscar veículos:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const occupySpaceWithVehicle = async () => {
    if (!selectedVaga || (!selectedVehicle && !vehicleSearch)) {
      toast({
        title: "Dados incompletos",
        description: "Selecione um veículo ou digite uma placa.",
        variant: "destructive",
      });
      return;
    }

    try {
      const ParkingSpaceService = (await import('@/services/parkingSpaces')).default;
      
      const vehicleData = selectedVehicle 
        ? { vehicleId: selectedVehicle.id }
        : { licensePlate: vehicleSearch };

      await ParkingSpaceService.occupySpace(selectedVaga.id, vehicleData);
      
      toast({
        title: "Vaga ocupada",
        description: `Vaga ${selectedVaga.numero} foi ocupada com sucesso.`,
      });

      // Resetar formulário
      setVehicleSearch('');
      setSelectedVehicle(null);
      setSearchResults([]);
      setShowOccupyForm(false);
      
      // Recarregar vagas
      loadVagas();
      setVagaModalOpen(false);
      setSelectedVaga(null);
      
    } catch (error: any) {
      console.error('Erro ao ocupar vaga:', error);
      toast({
        title: "Erro ao ocupar vaga",
        description: error.message || "Não foi possível ocupar a vaga.",
        variant: "destructive",
      });
    }
  };

  const handleConfigurarVagas = async () => {
    try {
      // Carregar configurações salvas
      const ParkingSpaceService = (await import('@/services/parkingSpaces')).default;
      const savedConfig = await ParkingSpaceService.getConfiguration();
      setConfigData(savedConfig);
    } catch (error) {
      console.warn('Erro ao carregar configurações, usando padrões:', error);
      // Manter configurações padrão se não conseguir carregar
    }
    
    setConfigModalOpen(true);
  };

  // Funções para configuração das vagas
  const handleConfigDataChange = (field: string, value: any) => {
    setConfigData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateVagasDistribution = () => {
    const { totalVagas, vagasCaminhao, vagasCarreta } = configData;
    const total = vagasCaminhao + vagasCarreta;
    
    if (total !== totalVagas) {
      return {
        isValid: false,
        message: `Total de vagas por tipo (${total}) não confere com total geral (${totalVagas})`
      };
    }
    
    return { isValid: true, message: '' };
  };

  const generateParkingSpaces = async () => {
    const validation = calculateVagasDistribution();
    if (!validation.isValid) {
      toast({
        title: "Configuração inválida",
        description: validation.message,
        variant: "destructive",
      });
      return;
    }

    // Validação extra dos campos obrigatórios e tipos
    const requiredFields = [
      'totalVagas', 'vagasCaminhao', 'vagasCarreta', 'precoHoraCaminhao', 'precoHoraCarreta',
      'horarioAbertura', 'horarioFechamento', 'funcionamento24h', 'prefixoNumeracao',
      'numeroInicial', 'autoReserva', 'tempoLimiteReserva'
    ];
    for (const field of requiredFields) {
      if (configData[field] === undefined || configData[field] === null || configData[field] === "") {
        toast({
          title: "Campo obrigatório ausente",
          description: `O campo '${field}' é obrigatório para gerar as vagas.`,
          variant: "destructive",
        });
        return;
      }
    }
    // Garantir tipos corretos
    const payload = {
      totalVagas: Number(configData.totalVagas),
      vagasCaminhao: Number(configData.vagasCaminhao),
      vagasCarreta: Number(configData.vagasCarreta),
      precoHoraCaminhao: Number(configData.precoHoraCaminhao),
      precoHoraCarreta: Number(configData.precoHoraCarreta),
      horarioAbertura: String(configData.horarioAbertura),
      horarioFechamento: String(configData.horarioFechamento),
      funcionamento24h: Boolean(configData.funcionamento24h),
      prefixoNumeracao: String(configData.prefixoNumeracao),
      numeroInicial: Number(configData.numeroInicial),
      autoReserva: Boolean(configData.autoReserva),
      tempoLimiteReserva: Number(configData.tempoLimiteReserva)
    };
    if (payload.vagasCaminhao + payload.vagasCarreta !== payload.totalVagas) {
      toast({
        title: "Configuração inválida",
        description: `A soma de vagas por tipo (${payload.vagasCaminhao + payload.vagasCarreta}) não confere com o total geral (${payload.totalVagas})` ,
        variant: "destructive",
      });
      return;
    }
    try {
      setIsGeneratingSpaces(true);
      // Salvar configurações no backend
      const ParkingSpaceService = (await import('@/services/parkingSpaces')).default;
      await ParkingSpaceService.saveConfiguration(payload);
      // Gerar vagas no backend
      await ParkingSpaceService.generateSpaces(payload);
      toast({
        title: "Configurações aplicadas",
        description: `${payload.totalVagas} vagas foram geradas com sucesso.`,
      });
      setConfigModalOpen(false);
      // Recarregar vagas após geração
      await loadVagas();
    } catch (error: any) {
      console.error('Erro ao gerar vagas:', error);
      toast({
        title: "Erro ao gerar vagas",
        description: error.message || "Não foi possível aplicar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSpaces(false);
    }
  };

  const resetToDefaults = () => {
    setConfigData({
      totalVagas: 50,
      vagasCaminhao: 40,
      vagasCarreta: 10,
      precoHoraCaminhao: 15.00,
      precoHoraCarreta: 25.00,
      horarioAbertura: '06:00',
      horarioFechamento: '22:00',
      funcionamento24h: false,
      prefixoNumeracao: 'C',
      numeroInicial: 1,
      autoReserva: true,
      tempoLimiteReserva: 60
    });
    
    toast({
      title: "Configurações restauradas",
      description: "Todas as configurações foram restauradas aos valores padrão.",
    });
  };

  const stats = {
    total: vagas.length,
    livres: vagas.filter(v => v.status === 'livre').length,
    ocupadas: vagas.filter(v => v.status === 'ocupada').length,
    reservadas: vagas.filter(v => v.status === 'reservada').length,
    manutencao: vagas.filter(v => v.status === 'manutencao').length,
  };

  const ocupacao = vagas.length > 0 ? Math.round((stats.ocupadas / stats.total) * 100) : 0;

  if (user?.role !== 'estacionamento') {
    return (
      <div className="min-h-screen bg-ajh-darker flex items-center justify-center">
        <div className="glass-effect p-8 rounded-xl text-center">
          <ParkingCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Acesso Negado</h2>
          <p className="text-slate-400">Apenas estacionamentos podem acessar esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Minhas Vagas</h1>
          <p className="text-slate-400">Controle em tempo real das vagas do seu estacionamento</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={loadVagas}
            variant="outline"
            className="ajh-btn-secondary"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button 
            className="ajh-btn ajh-btn-primary"
            onClick={handleConfigurarVagas}
          >
            <Settings className="w-4 h-4 mr-2" />
            Configurar Vagas
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="ajh-card">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-slate-400">Total de Vagas</p>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-slate-400">Vagas Livres</p>
              <p className="text-3xl font-bold text-green-400">{stats.livres}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-slate-400">Vagas Ocupadas</p>
              <p className="text-3xl font-bold text-red-400">{stats.ocupadas}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-slate-400">Reservadas</p>
              <p className="text-3xl font-bold text-yellow-400">{stats.reservadas}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-slate-400">Taxa de Ocupação</p>
              <p className="text-3xl font-bold text-blue-400">{ocupacao}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="ajh-card">
        <CardHeader>
          <CardTitle className="text-white">Controles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="ajh-input">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="carro">Carros</SelectItem>
                <SelectItem value="moto">Motos</SelectItem>
                <SelectItem value="caminhao">Caminhões</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="ajh-input">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="livre">Livres</SelectItem>
                <SelectItem value="ocupada">Ocupadas</SelectItem>
                <SelectItem value="reservada">Reservadas</SelectItem>
                <SelectItem value="manutencao">Em Manutenção</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Switch
                id="auto-refresh"
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
              />
              <Label htmlFor="auto-refresh" className="text-slate-300">
                Atualização automática
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vagas Grid */}
      <Card className="ajh-card">
        <CardHeader>
          <CardTitle className="text-white">
            Layout das Vagas ({getFilteredVagas().length} vagas)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-ajh-primary border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
              {getFilteredVagas().map((vaga) => (
                <div
                  key={vaga.id}
                  className={`
                    relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg
                    ${getStatusColor(vaga.status)} border-opacity-50
                  `}
                  onClick={() => handleVagaClick(vaga)}
                  title={`Clique para gerenciar a vaga ${vaga.numero}`}
                >
                  <div className="text-center">
                    <div className="flex justify-center mb-1">
                      {getStatusIcon(vaga.status)}
                    </div>
                    <p className="text-white font-bold text-sm">{vaga.numero}</p>
                    
                    {vaga.veiculo && (
                      <div className="mt-2 text-xs">
                        <p className="text-white font-mono">{vaga.veiculo.placa}</p>
                      </div>
                    )}
                    
                    {vaga.reserva && (
                      <div className="mt-2 text-xs">
                        <p className="text-white">Reservada</p>
                        <p className="text-white opacity-75">
                          {new Date(vaga.reserva.inicio).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legenda */}
      <Card className="ajh-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span className="text-slate-300 text-sm">Livre</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 rounded"></div>
              <span className="text-slate-300 text-sm">Ocupada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-600 rounded"></div>
              <span className="text-slate-300 text-sm">Reservada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-600 rounded"></div>
              <span className="text-slate-300 text-sm">Manutenção</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Gestão de Vaga */}
      <Dialog open={vagaModalOpen} onOpenChange={setVagaModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-slate-900 border-slate-700 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <ParkingCircle className="w-6 h-6 text-ajh-primary" />
              Gerenciar Vaga {selectedVaga?.numero}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Altere o status da vaga ou visualize informações detalhadas.
            </DialogDescription>
          </DialogHeader>
          
          {selectedVaga && (
            <div className="space-y-6 mt-4">
              {/* Informações da Vaga */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Informações da Vaga
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm">Número</p>
                    <p className="text-white font-bold text-lg">{selectedVaga.numero}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Tipo</p>
                    <p className="text-white capitalize">{selectedVaga.tipo}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Status Atual</p>
                    <div className="mt-1">
                      {getStatusBadge(selectedVaga.status)}
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Atualização</p>
                    <p className="text-white text-sm">
                      {new Date(selectedVaga.ultimaAtualizacao).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informações do Veículo (se ocupada) */}
              {selectedVaga.veiculo && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Car className="w-4 h-4 text-red-400" />
                    Veículo Atual
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Placa:</span>
                      <span className="text-white font-mono font-bold">{selectedVaga.veiculo.placa}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Modelo:</span>
                      <span className="text-white">{selectedVaga.veiculo.modelo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Transportadora:</span>
                      <span className="text-white">{selectedVaga.veiculo.transportadora}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Informações da Reserva (se reservada) */}
              {selectedVaga.reserva && (
                <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    Reserva Ativa
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Motorista:</span>
                      <span className="text-white">{selectedVaga.reserva.motorista}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Início:</span>
                      <span className="text-white">
                        {new Date(selectedVaga.reserva.inicio).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Fim:</span>
                      <span className="text-white">
                        {new Date(selectedVaga.reserva.fim).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Formulário de Ocupação */}
              {showOccupyForm && selectedVaga.status === 'livre' && (
                <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Car className="w-4 h-4 text-blue-400" />
                    Ocupar Vaga com Veículo
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-slate-400 text-sm mb-2">Digite a placa do veículo:</p>
                      <Input
                        type="text"
                        placeholder="ABC-1234 ou ABC1234"
                        value={vehicleSearch}
                        onChange={(e) => {
                          const value = e.target.value.toUpperCase();
                          setVehicleSearch(value);
                          searchVehicles(value);
                        }}
                        className="bg-slate-800 border-slate-600 text-white"
                      />
                    </div>

                    {/* Resultados da busca */}
                    {searchResults.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-slate-400 text-sm">Veículos encontrados:</p>
                        <div className="max-h-32 overflow-y-auto space-y-1">
                          {searchResults.map((vehicle) => (
                            <div
                              key={vehicle.id}
                              onClick={() => {
                                setSelectedVehicle(vehicle);
                                setVehicleSearch(vehicle.placa);
                                setSearchResults([]);
                              }}
                              className="p-2 bg-slate-700 hover:bg-slate-600 rounded cursor-pointer transition-colors"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="text-white font-mono font-bold">{vehicle.placa}</span>
                                  <span className="text-slate-300 ml-2">{vehicle.modelo}</span>
                                </div>
                                <div className="text-right text-sm">
                                  {vehicle.motorista && (
                                    <div className="text-slate-400">{vehicle.motorista.nome}</div>
                                  )}
                                  {vehicle.transportadora && (
                                    <div className="text-slate-400">{vehicle.transportadora.nome}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Veículo selecionado */}
                    {selectedVehicle && (
                      <div className="bg-green-900/20 border border-green-800 rounded p-3">
                        <p className="text-green-400 text-sm font-semibold mb-1">Veículo Selecionado:</p>
                        <div className="text-white">
                          <span className="font-mono font-bold">{selectedVehicle.placa}</span>
                          <span className="ml-2">{selectedVehicle.modelo}</span>
                        </div>
                        {selectedVehicle.motorista && (
                          <div className="text-slate-300 text-sm">
                            Motorista: {selectedVehicle.motorista.nome}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Botões de ação */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={occupySpaceWithVehicle}
                        className="bg-blue-600 hover:bg-blue-700 text-white border-none"
                        disabled={!vehicleSearch}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirmar Ocupação
                      </Button>
                      <Button
                        onClick={() => {
                          setShowOccupyForm(false);
                          setVehicleSearch('');
                          setSelectedVehicle(null);
                          setSearchResults([]);
                        }}
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Ações de Status */}
              <div className="space-y-3">
                <h4 className="text-white font-semibold flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Alterar Status
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => toggleVagaStatus(selectedVaga.id, 'livre')}
                    className="bg-green-600 hover:bg-green-700 text-white border-none"
                    disabled={selectedVaga.status === 'livre'}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Livre
                  </Button>
                  <Button
                    onClick={() => toggleVagaStatus(selectedVaga.id, 'ocupada')}
                    className="bg-red-600 hover:bg-red-700 text-white border-none"
                    disabled={selectedVaga.status === 'ocupada'}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Ocupada
                  </Button>
                  <Button
                    onClick={() => toggleVagaStatus(selectedVaga.id, 'reservada')}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white border-none"
                    disabled={selectedVaga.status === 'reservada'}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Reservada
                  </Button>
                  <Button
                    onClick={() => toggleVagaStatus(selectedVaga.id, 'manutencao')}
                    className="bg-gray-600 hover:bg-gray-700 text-white border-none"
                    disabled={selectedVaga.status === 'manutencao'}
                  >
                    <Wrench className="w-4 h-4 mr-2" />
                    Manutenção
                  </Button>
                </div>
              </div>

              {/* Botão Fechar */}
              <div className="flex justify-end pt-4 border-t border-slate-700">
                <Button 
                  onClick={() => setVagaModalOpen(false)}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Configuração de Vagas */}
      <Dialog open={configModalOpen} onOpenChange={setConfigModalOpen}>
        <DialogContent className="sm:max-w-[700px] bg-slate-900 border-slate-700 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Settings className="w-6 h-6 text-ajh-primary" />
              Configurações das Vagas
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Configure as opções gerais do sistema de vagas, preços e funcionamento.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <Tabs value={activeConfigTab} onValueChange={setActiveConfigTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                <TabsTrigger value="geral" className="data-[state=active]:bg-ajh-primary data-[state=active]:text-white">
                  Geral
                </TabsTrigger>
                <TabsTrigger value="precos" className="data-[state=active]:bg-ajh-primary data-[state=active]:text-white">
                  Preços
                </TabsTrigger>
                <TabsTrigger value="horarios" className="data-[state=active]:bg-ajh-primary data-[state=active]:text-white">
                  Horários
                </TabsTrigger>
              </TabsList>

              {/* Aba Geral */}
              <TabsContent value="geral" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalVagas" className="text-slate-300">Total de Vagas</Label>
                    <Input
                      id="totalVagas"
                      type="number"
                      value={configData.totalVagas}
                      onChange={(e) => handleConfigDataChange('totalVagas', parseInt(e.target.value) || 0)}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prefixo" className="text-slate-300">Prefixo Numeração</Label>
                    <Input
                      id="prefixo"
                      value={configData.prefixoNumeracao}
                      onChange={(e) => handleConfigDataChange('prefixoNumeracao', e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white"
                      placeholder="A"
                    />
                  </div>
                </div>

                <Separator className="bg-slate-700" />
                
                                  <div className="space-y-4">
                    <h4 className="text-white font-semibold flex items-center gap-2">
                      <Car className="w-4 h-4" />
                      Distribuição por Tipo
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="vagasCaminhao" className="text-slate-300 flex items-center gap-1">
                          <Car className="w-5 h-5" />
                          Caminhões
                        </Label>
                        <Input
                          id="vagasCaminhao"
                          type="number"
                          value={configData.vagasCaminhao}
                          onChange={(e) => handleConfigDataChange('vagasCaminhao', parseInt(e.target.value) || 0)}
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vagasCarreta" className="text-slate-300 flex items-center gap-1">
                          <Car className="w-6 h-6" />
                          Carretas
                        </Label>
                        <Input
                          id="vagasCarreta"
                          type="number"
                          value={configData.vagasCarreta}
                          onChange={(e) => handleConfigDataChange('vagasCarreta', parseInt(e.target.value) || 0)}
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                    </div>

                  {(() => {
                    const validation = calculateVagasDistribution();
                    return !validation.isValid && (
                      <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
                        <p className="text-red-400 text-sm">{validation.message}</p>
                      </div>
                    );
                  })()}
                </div>

                <Separator className="bg-slate-700" />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numeroInicial" className="text-slate-300">Número Inicial</Label>
                    <Input
                      id="numeroInicial"
                      type="number"
                      value={configData.numeroInicial}
                      onChange={(e) => handleConfigDataChange('numeroInicial', parseInt(e.target.value) || 1)}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tempoReserva" className="text-slate-300">Tempo Limite Reserva (min)</Label>
                    <Input
                      id="tempoReserva"
                      type="number"
                      value={configData.tempoLimiteReserva}
                      onChange={(e) => handleConfigDataChange('tempoLimiteReserva', parseInt(e.target.value) || 30)}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoReserva"
                    checked={configData.autoReserva}
                    onCheckedChange={(checked) => handleConfigDataChange('autoReserva', checked)}
                  />
                  <Label htmlFor="autoReserva" className="text-slate-300">
                    Permitir reservas automáticas
                  </Label>
                </div>
              </TabsContent>

              {/* Aba Preços */}
              <TabsContent value="precos" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Preços por Hora
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 w-24">
                        <Car className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-300 text-sm">Caminhões</span>
                      </div>
                      <div className="flex-1">
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input
                            type="number"
                            step="0.01"
                            value={configData.precoHoraCaminhao}
                            onChange={(e) => handleConfigDataChange('precoHoraCaminhao', parseFloat(e.target.value) || 0)}
                            className="bg-slate-800 border-slate-600 text-white pl-10"
                            placeholder="15.00"
                          />
                        </div>
                      </div>
                      <span className="text-slate-400 text-sm w-16">R$/hora</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 w-24">
                        <Car className="w-6 h-6 text-slate-400" />
                        <span className="text-slate-300 text-sm">Carretas</span>
                      </div>
                      <div className="flex-1">
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input
                            type="number"
                            step="0.01"
                            value={configData.precoHoraCarreta}
                            onChange={(e) => handleConfigDataChange('precoHoraCarreta', parseFloat(e.target.value) || 0)}
                            className="bg-slate-800 border-slate-600 text-white pl-10"
                            placeholder="25.00"
                          />
                        </div>
                      </div>
                      <span className="text-slate-400 text-sm w-16">R$/hora</span>
                    </div>
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h5 className="text-white font-medium mb-2">Valores Calculados (24h)</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Diária Caminhão:</span>
                      <span className="text-white">R$ {(configData.precoHoraCaminhao * 24).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Diária Carreta:</span>
                      <span className="text-white">R$ {(configData.precoHoraCarreta * 24).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Aba Horários */}
              <TabsContent value="horarios" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    <Timer className="w-4 h-4" />
                    Horário de Funcionamento
                  </h4>

                  <div className="flex items-center space-x-2 mb-4">
                    <Switch
                      id="funcionamento24h"
                      checked={configData.funcionamento24h}
                      onCheckedChange={(checked) => handleConfigDataChange('funcionamento24h', checked)}
                    />
                    <Label htmlFor="funcionamento24h" className="text-slate-300">
                      Funcionamento 24 horas
                    </Label>
                  </div>

                  {!configData.funcionamento24h && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="horarioAbertura" className="text-slate-300">Horário de Abertura</Label>
                        <Input
                          id="horarioAbertura"
                          type="time"
                          value={configData.horarioAbertura}
                          onChange={(e) => handleConfigDataChange('horarioAbertura', e.target.value)}
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="horarioFechamento" className="text-slate-300">Horário de Fechamento</Label>
                        <Input
                          id="horarioFechamento"
                          type="time"
                          value={configData.horarioFechamento}
                          onChange={(e) => handleConfigDataChange('horarioFechamento', e.target.value)}
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <h5 className="text-white font-medium mb-2">Status Atual</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Funcionamento:</span>
                        <span className="text-white">
                          {configData.funcionamento24h ? '24 horas' : `${configData.horarioAbertura} às ${configData.horarioFechamento}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Agora:</span>
                        <Badge className="bg-green-600">
                          Aberto
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Botões de Ação */}
            <div className="flex justify-between pt-6 border-t border-slate-700">
              <Button 
                onClick={resetToDefaults}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restaurar Padrão
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => setConfigModalOpen(false)}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={generateParkingSpaces}
                  disabled={isGeneratingSpaces || !calculateVagasDistribution().isValid}
                  className="bg-ajh-primary hover:bg-ajh-primary/80 text-white"
                >
                  {isGeneratingSpaces ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Aplicando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Aplicar Configurações
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MinhasVagas; 