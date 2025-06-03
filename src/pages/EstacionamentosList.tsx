
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, MapPin, Car, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CadastroEstacionamentoModal from '@/components/modals/CadastroEstacionamentoModal';

interface EstacionamentoData {
  id: string;
  nome: string;
  endereco: string;
  cidade: string;
  cnpj: string;
  responsavel: string;
  telefone: string;
  email: string;
  totalVagas: number;
  vagasOcupadas: number;
  status: 'ativo' | 'inativo' | 'pendente';
  dataCredenciamento: string;
}

const EstacionamentosList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCadastroModal, setShowCadastroModal] = useState(false);
  const [editingEstacionamento, setEditingEstacionamento] = useState<EstacionamentoData | null>(null);

  // Mock data - em produção virá da API
  const estacionamentos: EstacionamentoData[] = [
    {
      id: '1',
      nome: 'Estacionamento Central',
      endereco: 'Rua das Flores, 123',
      cidade: 'São Paulo - SP',
      cnpj: '12.345.678/0001-90',
      responsavel: 'João Silva',
      telefone: '(11) 9999-9999',
      email: 'joao@central.com',
      totalVagas: 120,
      vagasOcupadas: 67,
      status: 'ativo',
      dataCredenciamento: '2024-01-15'
    },
    {
      id: '2',
      nome: 'Parking Premium',
      endereco: 'Av. Paulista, 456',
      cidade: 'São Paulo - SP',
      cnpj: '98.765.432/0001-10',
      responsavel: 'Maria Santos',
      telefone: '(11) 8888-8888',
      email: 'maria@premium.com',
      totalVagas: 80,
      vagasOcupadas: 45,
      status: 'ativo',
      dataCredenciamento: '2024-02-01'
    },
    {
      id: '3',
      nome: 'Estacionamento Norte',
      endereco: 'Rua do Norte, 789',
      cidade: 'Rio de Janeiro - RJ',
      cnpj: '11.222.333/0001-44',
      responsavel: 'Carlos Lima',
      telefone: '(21) 7777-7777',
      email: 'carlos@norte.com',
      totalVagas: 60,
      vagasOcupadas: 12,
      status: 'pendente',
      dataCredenciamento: '2024-03-10'
    }
  ];

  const filteredEstacionamentos = estacionamentos.filter(est =>
    est.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    est.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    est.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: EstacionamentoData['status']) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ativo</Badge>;
      case 'inativo':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Inativo</Badge>;
      case 'pendente':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pendente</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getOcupacaoPercentual = (ocupadas: number, total: number) => {
    return Math.round((ocupadas / total) * 100);
  };

  const handleEdit = (estacionamento: EstacionamentoData) => {
    setEditingEstacionamento(estacionamento);
    setShowCadastroModal(true);
  };

  const handleView = (estacionamentoId: string) => {
    navigate(`/estacionamento/${estacionamentoId}`);
  };

  const handleNewEstacionamento = () => {
    setEditingEstacionamento(null);
    setShowCadastroModal(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Estacionamentos Credenciados</h1>
          <p className="text-slate-400">Gerencie os estacionamentos parceiros do sistema</p>
        </div>
        <Button 
          className="ajh-button-primary"
          onClick={handleNewEstacionamento}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Estacionamento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="ajh-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Building className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Total</p>
                <p className="text-xl font-bold text-white">{estacionamentos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Building className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Ativos</p>
                <p className="text-xl font-bold text-white">
                  {estacionamentos.filter(e => e.status === 'ativo').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Building className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Pendentes</p>
                <p className="text-xl font-bold text-white">
                  {estacionamentos.filter(e => e.status === 'pendente').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-ajh-primary/10 rounded-lg">
                <Car className="w-5 h-5 text-ajh-primary" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Total Vagas</p>
                <p className="text-xl font-bold text-white">
                  {estacionamentos.reduce((acc, est) => acc + est.totalVagas, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="ajh-card">
        <CardHeader>
          <CardTitle className="text-white">Buscar Estacionamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Pesquisar por nome, cidade ou responsável..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ajh-input"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="ajh-card">
        <CardHeader>
          <CardTitle className="text-white">Lista de Estacionamentos</CardTitle>
          <CardDescription className="text-slate-400">
            {filteredEstacionamentos.length} estacionamento(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">Nome</TableHead>
                <TableHead className="text-slate-300">Localização</TableHead>
                <TableHead className="text-slate-300">Responsável</TableHead>
                <TableHead className="text-slate-300">Vagas</TableHead>
                <TableHead className="text-slate-300">Ocupação</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEstacionamentos.map((estacionamento) => (
                <TableRow key={estacionamento.id} className="border-slate-700 hover:bg-slate-800/50">
                  <TableCell>
                    <div>
                      <p className="text-white font-medium">{estacionamento.nome}</p>
                      <p className="text-slate-400 text-sm">{estacionamento.cnpj}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-white text-sm">{estacionamento.endereco}</p>
                      <p className="text-slate-400 text-sm">{estacionamento.cidade}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-white text-sm">{estacionamento.responsavel}</p>
                      <p className="text-slate-400 text-sm">{estacionamento.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <p className="text-white font-medium">{estacionamento.totalVagas}</p>
                      <p className="text-slate-400 text-sm">total</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <p className="text-white font-medium">{estacionamento.vagasOcupadas}</p>
                      <p className="text-slate-400 text-sm">
                        {getOcupacaoPercentual(estacionamento.vagasOcupadas, estacionamento.totalVagas)}%
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(estacionamento.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(estacionamento.id)}
                        className="ajh-button-secondary"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(estacionamento)}
                        className="ajh-button-secondary"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CadastroEstacionamentoModal
        open={showCadastroModal}
        onOpenChange={setShowCadastroModal}
        estacionamento={editingEstacionamento}
      />
    </div>
  );
};

export default EstacionamentosList;
