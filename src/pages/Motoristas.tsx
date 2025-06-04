
import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Users, Car, AlertTriangle } from 'lucide-react';
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

interface Motorista {
  id: string;
  nome: string;
  cpf: string;
  cnh: string;
  categoria: string;
  validade: string;
  telefone: string;
  email: string;
  empresa: string;
  veiculo: string;
  status: 'ativo' | 'inativo' | 'licenca';
  dataRegistro: string;
}

const Motoristas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data
  const motoristas: Motorista[] = [
    {
      id: '1',
      nome: 'João Silva',
      cpf: '123.456.789-00',
      cnh: '12345678901',
      categoria: 'B',
      validade: '2025-06-15',
      telefone: '(11) 99999-9999',
      email: 'joao@email.com',
      empresa: 'TechCorp Logistics',
      veiculo: 'ABC-1234',
      status: 'ativo',
      dataRegistro: '2024-01-15'
    },
    {
      id: '2',
      nome: 'Maria Santos',
      cpf: '987.654.321-00',
      cnh: '10987654321',
      categoria: 'B',
      validade: '2024-12-30',
      telefone: '(11) 88888-8888',
      email: 'maria@email.com',
      empresa: 'FastDelivery LTDA',
      veiculo: 'XYZ-9876',
      status: 'ativo',
      dataRegistro: '2024-02-10'
    },
    {
      id: '3',
      nome: 'Carlos Oliveira',
      cpf: '456.789.123-00',
      cnh: '45678912345',
      categoria: 'C',
      validade: '2024-07-10',
      telefone: '(11) 77777-7777',
      email: 'carlos@email.com',
      empresa: 'Transportes Brasil',
      veiculo: '',
      status: 'licenca',
      dataRegistro: '2024-03-05'
    }
  ];

  const filteredMotoristas = motoristas.filter(motorista => {
    const matchesSearch = motorista.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         motorista.cpf.includes(searchTerm) ||
                         motorista.cnh.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || motorista.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ativo</Badge>;
      case 'inativo':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Inativo</Badge>;
      case 'licenca':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Licença</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const isValidadeProxima = (validade: string) => {
    const hoje = new Date();
    const dataValidade = new Date(validade);
    const diferenca = dataValidade.getTime() - hoje.getTime();
    const diasRestantes = Math.ceil(diferenca / (1000 * 3600 * 24));
    return diasRestantes <= 30 && diasRestantes > 0;
  };

  const totalAtivos = motoristas.filter(m => m.status === 'ativo').length;
  const cnhVencendo = motoristas.filter(m => isValidadeProxima(m.validade)).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Motoristas</h1>
          <p className="text-slate-400">Gerencie todos os motoristas cadastrados no sistema</p>
        </div>
        <Button className="ajh-button-primary">
          <Plus className="w-4 h-4 mr-2" />
          Novo Motorista
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="ajh-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-ajh-primary/10 rounded-lg">
                <Users className="w-6 h-6 text-ajh-primary" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Motoristas Ativos</p>
                <p className="text-2xl font-bold text-white">{totalAtivos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-ajh-warning/10 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-ajh-warning" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">CNH Vencendo</p>
                <p className="text-2xl font-bold text-white">{cnhVencendo}</p>
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
                <p className="text-slate-400 text-sm">Com Veículos</p>
                <p className="text-2xl font-bold text-white">{motoristas.filter(m => m.veiculo).length}</p>
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
                  placeholder="Pesquisar por nome, CPF ou CNH..."
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
                variant={statusFilter === 'licenca' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('licenca')}
                className={statusFilter === 'licenca' ? 'ajh-button-primary' : 'ajh-button-secondary'}
              >
                Licença
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
          <CardTitle className="text-white">Lista de Motoristas</CardTitle>
          <CardDescription className="text-slate-400">
            {filteredMotoristas.length} motorista(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Nome</TableHead>
                  <TableHead className="text-slate-300">CNH</TableHead>
                  <TableHead className="text-slate-300">Contato</TableHead>
                  <TableHead className="text-slate-300">Empresa</TableHead>
                  <TableHead className="text-slate-300">Veículo</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMotoristas.map((motorista) => (
                  <TableRow key={motorista.id} className="border-slate-700 hover:bg-slate-800/30">
                    <TableCell className="text-white font-medium">{motorista.nome}</TableCell>
                    <TableCell className="text-slate-300">
                      <div>
                        <div>{motorista.cnh}</div>
                        <div className="text-xs text-slate-400 flex items-center">
                          Cat. {motorista.categoria} • Val: {new Date(motorista.validade).toLocaleDateString()}
                          {isValidadeProxima(motorista.validade) && (
                            <AlertTriangle className="w-3 h-3 text-yellow-400 ml-1" />
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      <div>
                        <div>{motorista.telefone}</div>
                        <div className="text-xs text-slate-400">{motorista.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">{motorista.empresa}</TableCell>
                    <TableCell className="text-slate-300">{motorista.veiculo || 'Não atribuído'}</TableCell>
                    <TableCell>{getStatusBadge(motorista.status)}</TableCell>
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

export default Motoristas;
