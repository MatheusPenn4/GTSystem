
import React, { useState } from 'react';
import { Search, MapPin, Clock, Car, Calendar, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface EstacionamentoDisponivel {
  id: string;
  nome: string;
  endereco: string;
  cidade: string;
  vagasLivres: number;
  totalVagas: number;
  preco: string;
  distancia: string;
}

const ReservaVagas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cidadeFilter, setCidadeFilter] = useState<string>('all');
  const { toast } = useToast();

  const estacionamentos: EstacionamentoDisponivel[] = [
    {
      id: '1',
      nome: 'Estacionamento Central',
      endereco: 'Rua das Flores, 123',
      cidade: 'São Paulo - SP',
      vagasLivres: 25,
      totalVagas: 120,
      preco: 'R$ 15/hora',
      distancia: '2.5 km'
    },
    {
      id: '2',
      nome: 'Parking Premium',
      endereco: 'Av. Paulista, 456',
      cidade: 'São Paulo - SP',
      vagasLivres: 8,
      totalVagas: 80,
      preco: 'R$ 20/hora',
      distancia: '5.1 km'
    },
    {
      id: '3',
      nome: 'Estacionamento Norte',
      endereco: 'Rua do Norte, 789',
      cidade: 'Rio de Janeiro - RJ',
      vagasLivres: 15,
      totalVagas: 60,
      preco: 'R$ 12/hora',
      distancia: '3.2 km'
    }
  ];

  const filteredEstacionamentos = estacionamentos.filter(est => {
    const matchesSearch = est.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         est.endereco.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCidade = cidadeFilter === 'all' || est.cidade.includes(cidadeFilter);
    return matchesSearch && matchesCidade;
  });

  const handleReservar = (estacionamentoId: string, nomeEstacionamento: string) => {
    toast({
      title: "Reserva realizada!",
      description: `Vaga reservada no ${nomeEstacionamento}. Você tem 2 horas para confirmar a entrada.`,
    });
  };

  const getOcupacaoColor = (livres: number, total: number) => {
    const ocupacao = ((total - livres) / total) * 100;
    if (ocupacao >= 90) return 'text-red-400';
    if (ocupacao >= 70) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Reserva de Vagas</h1>
          <p className="text-slate-400">Reserve vagas em estacionamentos credenciados para sua frota</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="ajh-card">
        <CardHeader>
          <CardTitle className="text-white">Buscar Estacionamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Pesquisar por nome ou endereço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ajh-input pl-10"
                />
              </div>
            </div>
            <Select value={cidadeFilter} onValueChange={setCidadeFilter}>
              <SelectTrigger className="w-[200px] ajh-input">
                <SelectValue placeholder="Filtrar por cidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as cidades</SelectItem>
                <SelectItem value="São Paulo">São Paulo - SP</SelectItem>
                <SelectItem value="Rio de Janeiro">Rio de Janeiro - RJ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Estacionamentos List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEstacionamentos.map((estacionamento) => (
          <Card key={estacionamento.id} className="ajh-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white">{estacionamento.nome}</CardTitle>
                  <CardDescription className="text-slate-400 flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {estacionamento.endereco} - {estacionamento.cidade}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-slate-300">
                  {estacionamento.distancia}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Availability */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Car className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300">Vagas disponíveis:</span>
                  </div>
                  <span className={`font-bold ${getOcupacaoColor(estacionamento.vagasLivres, estacionamento.totalVagas)}`}>
                    {estacionamento.vagasLivres}/{estacionamento.totalVagas}
                  </span>
                </div>

                {/* Price */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300">Preço:</span>
                  </div>
                  <span className="text-ajh-primary font-bold">{estacionamento.preco}</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-ajh-primary to-ajh-secondary h-2 rounded-full"
                    style={{ width: `${(estacionamento.vagasLivres / estacionamento.totalVagas) * 100}%` }}
                  ></div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    className="ajh-button-primary flex-1"
                    onClick={() => handleReservar(estacionamento.id, estacionamento.nome)}
                    disabled={estacionamento.vagasLivres === 0}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Reservar Vaga
                  </Button>
                  <Button variant="outline" className="ajh-button-secondary">
                    <MapPin className="w-4 h-4 mr-2" />
                    Ver no Mapa
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEstacionamentos.length === 0 && (
        <Card className="ajh-card">
          <CardContent className="p-8 text-center">
            <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-medium mb-2">Nenhum estacionamento encontrado</h3>
            <p className="text-slate-400">Tente ajustar os filtros de busca</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReservaVagas;
