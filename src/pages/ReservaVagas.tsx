
import React, { useState } from 'react';
import { ParkingCircle, Search, MapPin, Clock, Car, Building2, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Estacionamento {
  id: string;
  nome: string;
  endereco: string;
  cidade: string;
  vagasDisponiveis: number;
  totalVagas: number;
  preco: number;
  distancia: string;
  horarioFuncionamento: string;
  status: 'disponivel' | 'cheio' | 'manutencao';
}

const ReservaVagas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cidadeFilter, setCidadeFilter] = useState<string>('all');
  const { toast } = useToast();

  // Mock data - estacionamentos disponíveis
  const estacionamentos: Estacionamento[] = [
    {
      id: '1',
      nome: 'Estacionamento Central',
      endereco: 'Rua das Flores, 123',
      cidade: 'São Paulo',
      vagasDisponiveis: 45,
      totalVagas: 100,
      preco: 15.00,
      distancia: '2.3 km',
      horarioFuncionamento: '24h',
      status: 'disponivel'
    },
    {
      id: '2',
      nome: 'Parking Plaza Shopping',
      endereco: 'Av. Paulista, 456',
      cidade: 'São Paulo',
      vagasDisponiveis: 12,
      totalVagas: 80,
      preco: 20.00,
      distancia: '5.7 km',
      horarioFuncionamento: '06:00 - 22:00',
      status: 'disponivel'
    },
    {
      id: '3',
      nome: 'Porto Seguro Parking',
      endereco: 'Rua Augusta, 789',
      cidade: 'Rio de Janeiro',
      vagasDisponiveis: 0,
      totalVagas: 60,
      preco: 18.00,
      distancia: '1.2 km',
      horarioFuncionamento: '24h',
      status: 'cheio'
    },
    {
      id: '4',
      nome: 'Green Park',
      endereco: 'Av. Brasil, 321',
      cidade: 'Belo Horizonte',
      vagasDisponiveis: 28,
      totalVagas: 150,
      preco: 12.00,
      distancia: '3.1 km',
      horarioFuncionamento: '05:00 - 23:00',
      status: 'disponivel'
    }
  ];

  const filteredEstacionamentos = estacionamentos.filter(estacionamento => {
    const matchesSearch = estacionamento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         estacionamento.endereco.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCidade = cidadeFilter === 'all' || estacionamento.cidade === cidadeFilter;
    return matchesSearch && matchesCidade;
  });

  const getStatusBadge = (status: string, vagasDisponiveis: number) => {
    if (status === 'cheio' || vagasDisponiveis === 0) {
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Lotado</Badge>;
    }
    if (status === 'manutencao') {
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Manutenção</Badge>;
    }
    if (vagasDisponiveis < 10) {
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Poucas Vagas</Badge>;
    }
    return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Disponível</Badge>;
  };

  const handleReservarVaga = (estacionamento: Estacionamento) => {
    if (estacionamento.vagasDisponiveis === 0) {
      toast({
        title: "Estacionamento Lotado",
        description: "Não há vagas disponíveis neste estacionamento.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Reserva Confirmada!",
      description: `Vaga reservada no ${estacionamento.nome}. Você tem 30 minutos para chegar.`,
    });
  };

  const cidades = [...new Set(estacionamentos.map(e => e.cidade))];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Reserva de Vagas</h1>
          <p className="text-slate-400">Reserve vagas em estacionamentos próximos ao seu destino</p>
        </div>
        <div className="flex gap-2">
          <Button className="ajh-button-secondary">
            <Calendar className="w-4 h-4 mr-2" />
            Minhas Reservas
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="ajh-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-ajh-primary/10 rounded-lg">
                <Building2 className="w-6 h-6 text-ajh-primary" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Estacionamentos</p>
                <p className="text-2xl font-bold text-white">{estacionamentos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <ParkingCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Vagas Disponíveis</p>
                <p className="text-2xl font-bold text-white">
                  {estacionamentos.reduce((sum, e) => sum + e.vagasDisponiveis, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-ajh-secondary/10 rounded-lg">
                <MapPin className="w-6 h-6 text-ajh-secondary" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Cidades Atendidas</p>
                <p className="text-2xl font-bold text-white">{cidades.length}</p>
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
                  placeholder="Pesquisar estacionamentos ou endereços..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ajh-input pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={cidadeFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setCidadeFilter('all')}
                className={cidadeFilter === 'all' ? 'ajh-button-primary' : 'ajh-button-secondary'}
                size="sm"
              >
                Todas Cidades
              </Button>
              {cidades.map(cidade => (
                <Button
                  key={cidade}
                  variant={cidadeFilter === cidade ? 'default' : 'outline'}
                  onClick={() => setCidadeFilter(cidade)}
                  className={cidadeFilter === cidade ? 'ajh-button-primary' : 'ajh-button-secondary'}
                  size="sm"
                >
                  {cidade}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Estacionamentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEstacionamentos.map((estacionamento) => (
          <Card key={estacionamento.id} className="ajh-card hover:bg-slate-800/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white text-lg">{estacionamento.nome}</CardTitle>
                  <CardDescription className="text-slate-400 mt-1">
                    {estacionamento.endereco}
                  </CardDescription>
                </div>
                {getStatusBadge(estacionamento.status, estacionamento.vagasDisponiveis)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-300">{estacionamento.distancia}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-300">{estacionamento.horarioFuncionamento}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ParkingCircle className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-300">
                    {estacionamento.vagasDisponiveis}/{estacionamento.totalVagas} vagas
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Car className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-300">R$ {estacionamento.preco.toFixed(2)}/h</span>
                </div>
              </div>
              
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-ajh-primary to-ajh-secondary h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(estacionamento.vagasDisponiveis / estacionamento.totalVagas) * 100}%` 
                  }}
                ></div>
              </div>

              <Button 
                className="w-full ajh-button-primary"
                onClick={() => handleReservarVaga(estacionamento)}
                disabled={estacionamento.vagasDisponiveis === 0}
              >
                {estacionamento.vagasDisponiveis === 0 ? 'Lotado' : 'Reservar Vaga'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReservaVagas;
