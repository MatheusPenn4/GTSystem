import React, { useState } from 'react';
import { Building2, MapPin, Users, Car, Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ViewModal from '@/components/modals/ViewModal';
import EditModal from '@/components/modals/EditModal';
import DeleteModal from '@/components/modals/DeleteModal';
import CadastroEstacionamentoModal from '@/components/modals/CadastroEstacionamentoModal';

interface EstacionamentoCadastrado {
  id: string;
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  totalVagas: number;
  vagasDisponiveis: number;
  valorDiaria: number;
  telefone: string;
  email: string;
  responsavel: string;
  status: 'ativo' | 'inativo' | 'manutencao';
  dataCredenciamento: string;
}

const EstacionamentosCadastrados: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cadastroModalOpen, setCadastroModalOpen] = useState(false);
  const [selectedEstacionamento, setSelectedEstacionamento] = useState<EstacionamentoCadastrado | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data
  const estacionamentos: EstacionamentoCadastrado[] = [
    {
      id: '1',
      nome: 'Estacionamento Central',
      endereco: 'Rua das Flores, 123',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567',
      totalVagas: 50,
      vagasDisponiveis: 12,
      valorDiaria: 120.00,
      telefone: '(11) 9999-8888',
      email: 'contato@central.com',
      responsavel: 'João Silva',
      status: 'ativo',
      dataCredenciamento: '2024-01-15'
    },
    {
      id: '2',
      nome: 'Park Shopping Norte',
      endereco: 'Av. Principal, 456',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '02345-678',
      totalVagas: 80,
      vagasDisponiveis: 25,
      valorDiaria: 120.00,
      telefone: '(11) 8888-7777',
      email: 'admin@parknorte.com',
      responsavel: 'Maria Santos',
      status: 'ativo',
      dataCredenciamento: '2024-02-10'
    },
    {
      id: '3',
      nome: 'Estacionamento Vila Madalena',
      endereco: 'Rua Augusta, 789',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '03456-789',
      totalVagas: 30,
      vagasDisponiveis: 0,
      valorDiaria: 120.00,
      telefone: '(11) 7777-6666',
      email: 'contato@vilamadalena.com',
      responsavel: 'Carlos Oliveira',
      status: 'manutencao',
      dataCredenciamento: '2024-03-05'
    }
  ];

  const filteredEstacionamentos = estacionamentos.filter(est => {
    const matchesSearch = est.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         est.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         est.cidade.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || est.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: EstacionamentoCadastrado['status']) => {
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

  const handleView = (estacionamento: EstacionamentoCadastrado) => {
    setSelectedEstacionamento(estacionamento);
    setViewModalOpen(true);
  };

  const handleEdit = (estacionamento: EstacionamentoCadastrado) => {
    setSelectedEstacionamento(estacionamento);
    setEditModalOpen(true);
  };

  const handleDelete = (estacionamento: EstacionamentoCadastrado) => {
    setSelectedEstacionamento(estacionamento);
    setDeleteModalOpen(true);
  };

  const handleSave = (data: Record<string, any>) => {
    console.log('Salvando estacionamento:', data);
    toast({
      title: "Estacionamento Atualizado",
      description: "As alterações foram salvas com sucesso.",
    });
    setEditModalOpen(false);
  };

  const handleConfirmDelete = () => {
    console.log('Excluindo estacionamento:', selectedEstacionamento?.id);
    toast({
      title: "Estacionamento Excluído",
      description: "O estacionamento foi removido com sucesso.",
    });
    setDeleteModalOpen(false);
  };

  const handleCadastroSave = (data: Record<string, any>) => {
    console.log('Cadastrando novo estacionamento:', data);
    setCadastroModalOpen(false);
    toast({
      title: "Estacionamento Cadastrado",
      description: "O novo estacionamento foi cadastrado com sucesso.",
    });
  };

  const handleGerenciarVagas = (estacionamento: EstacionamentoCadastrado) => {
    navigate(`/estacionamento/${estacionamento.id}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Estacionamentos Credenciados</h1>
          <p className="text-slate-400">Gerencie todos os estacionamentos cadastrados no sistema</p>
        </div>
        {user?.role === 'admin' && (
          <Button 
            className="ajh-button-primary"
            onClick={() => setCadastroModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Cadastrar Estacionamento
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="ajh-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-400" />
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
                <Users className="w-5 h-5 text-green-400" />
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
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Car className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Total Vagas</p>
                <p className="text-xl font-bold text-white">
                  {estacionamentos.reduce((acc, e) => acc + e.totalVagas, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <MapPin className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Disponíveis</p>
                <p className="text-xl font-bold text-white">
                  {estacionamentos.reduce((acc, e) => acc + e.vagasDisponiveis, 0)}
                </p>
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
                  placeholder="Pesquisar por nome, endereço ou cidade..."
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
                Todos
              </Button>
              {[
                { key: 'ativo', label: 'Ativos' },
                { key: 'inativo', label: 'Inativos' },
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
              <TableRow className="border-slate-700 hover:bg-slate-800/50">
                <TableHead className="text-slate-300">Nome</TableHead>
                <TableHead className="text-slate-300">Endereço</TableHead>
                <TableHead className="text-slate-300">Vagas</TableHead>
                <TableHead className="text-slate-300">Valor/Diária</TableHead>
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
                      <p className="text-slate-400 text-sm">{estacionamento.responsavel}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-white text-sm">{estacionamento.endereco}</p>
                      <p className="text-slate-400 text-xs">{estacionamento.cidade}, {estacionamento.estado}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-white">{estacionamento.vagasDisponiveis}/{estacionamento.totalVagas}</p>
                      <p className="text-slate-400 text-xs">disponíveis</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-white">
                    R$ {estacionamento.valorDiaria.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(estacionamento.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="ajh-button-secondary"
                        onClick={() => handleView(estacionamento)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {user?.role === 'admin' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="ajh-button-secondary"
                            onClick={() => handleEdit(estacionamento)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                            onClick={() => handleDelete(estacionamento)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        className="ajh-button-primary"
                        onClick={() => handleGerenciarVagas(estacionamento)}
                      >
                        Gerenciar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedEstacionamento && (
        <>
          <ViewModal
            isOpen={viewModalOpen}
            onClose={() => setViewModalOpen(false)}
            title={`Detalhes - ${selectedEstacionamento.nome}`}
            data={selectedEstacionamento}
          />
          
          <EditModal
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            title={`Editar - ${selectedEstacionamento.nome}`}
            data={selectedEstacionamento}
            onSave={handleSave}
          />
          
          <DeleteModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            title="Excluir Estacionamento"
            description={`Tem certeza que deseja excluir o estacionamento "${selectedEstacionamento.nome}"?`}
            onConfirm={handleConfirmDelete}
          />
        </>
      )}

      <CadastroEstacionamentoModal
        isOpen={cadastroModalOpen}
        onClose={() => setCadastroModalOpen(false)}
        onSave={handleCadastroSave}
      />
    </div>
  );
};

export default EstacionamentosCadastrados;
