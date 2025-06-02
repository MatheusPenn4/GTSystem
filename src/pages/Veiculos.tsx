
import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Car, Building2, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Veiculo {
  id: string;
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  cor: string;
  empresa: string;
  motorista: string;
  status: 'ativo' | 'inativo' | 'manutencao';
  dataRegistro: string;
}

const Veiculos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data
  const veiculos: Veiculo[] = [
    {
      id: '1',
      placa: 'ABC-1234',
      modelo: 'Civic',
      marca: 'Honda',
      ano: 2022,
      cor: 'Branco',
      empresa: 'TechCorp Logistics',
      motorista: 'João Silva',
      status: 'ativo',
      dataRegistro: '2024-01-15'
    },
    {
      id: '2',
      placa: 'XYZ-9876',
      modelo: 'Corolla',
      marca: 'Toyota',
      ano: 2021,
      cor: 'Prata',
      empresa: 'FastDelivery LTDA',
      motorista: 'Maria Santos',
      status: 'ativo',
      dataRegistro: '2024-02-10'
    },
    {
      id: '3',
      placa: 'DEF-5678',
      modelo: 'HB20',
      marca: 'Hyundai',
      ano: 2020,
      cor: 'Azul',
      empresa: 'Transportes Brasil',
      motorista: '',
      status: 'manutencao',
      dataRegistro: '2024-03-05'
    }
  ];

  const filteredVeiculos = veiculos.filter(veiculo => {
    const matchesSearch = veiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         veiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         veiculo.marca.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || veiculo.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ativo</Badge>;
      case 'inativo':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Inativo</Badge>;
      case 'manutencao':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Manutenção</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const totalAtivos = veiculos.filter(v => v.status === 'ativo').length;
  const totalManutencao = veiculos.filter(v => v.status === 'manutencao').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Veículos</h1>
          <p className="text-slate-400">Gerencie todos os veículos cadastrados no sistema</p>
        </div>
        <Button className="ajh-button-primary">
          <Plus className="w-4 h-4 mr-2" />
          Novo Veículo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="ajh-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-ajh-primary/10 rounded-lg">
                <Car className="w-6 h-6 text-ajh-primary" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Veículos Ativos</p>
                <p className="text-2xl font-bold text-white">{totalAtivos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-ajh-warning/10 rounded-lg">
                <Car className="w-6 h-6 text-ajh-warning" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Em Manutenção</p>
                <p className="text-2xl font-bold text-white">{totalManutencao}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-ajh-secondary/10 rounded-lg">
                <Car className="w-6 h-6 text-ajh-secondary" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Cadastrados</p>
                <p className="text-2xl font-bold text-white">{veiculos.length}</p>
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
                  placeholder="Pesquisar por placa, modelo ou marca..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ajh-input pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                className={statusFilter === 'all' ? 'ajh-button-primary' : 'ajh-button-secondary'}
              >
                Todos
              </Button>
              <Button
                variant={statusFilter === 'ativo' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('ativo')}
                className={statusFilter === 'ativo' ? 'ajh-button-primary' : 'ajh-button-secondary'}
              >
                Ativo
              </Button>
              <Button
                variant={statusFilter === 'manutencao' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('manutencao')}
                className={statusFilter === 'manutencao' ? 'ajh-button-primary' : 'ajh-button-secondary'}
              >
                Manutenção
              </Button>
              <Button
                variant={statusFilter === 'inativo' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('inativo')}
                className={statusFilter === 'inativo' ? 'ajh-button-primary' : 'ajh-button-secondary'}
              >
                Inativo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="ajh-card">
        <CardHeader>
          <CardTitle className="text-white">Lista de Veículos</CardTitle>
          <CardDescription className="text-slate-400">
            {filteredVeiculos.length} veículo(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Placa</TableHead>
                  <TableHead className="text-slate-300">Veículo</TableHead>
                  <TableHead className="text-slate-300">Empresa</TableHead>
                  <TableHead className="text-slate-300">Motorista</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVeiculos.map((veiculo) => (
                  <TableRow key={veiculo.id} className="border-slate-700 hover:bg-slate-800/30">
                    <TableCell className="text-white font-medium">{veiculo.placa}</TableCell>
                    <TableCell className="text-slate-300">
                      <div>
                        <div>{veiculo.marca} {veiculo.modelo}</div>
                        <div className="text-xs text-slate-400">{veiculo.ano} • {veiculo.cor}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">{veiculo.empresa}</TableCell>
                    <TableCell className="text-slate-300">{veiculo.motorista || 'Não atribuído'}</TableCell>
                    <TableCell>{getStatusBadge(veiculo.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button size="sm" variant="ghost" className="text-ajh-primary hover:text-ajh-primary hover:bg-ajh-primary/10">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-ajh-secondary hover:text-ajh-secondary hover:bg-ajh-secondary/10">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Veiculos;
