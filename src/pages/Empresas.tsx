
import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Building2, Users, Car } from 'lucide-react';
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
import ViewModal from '@/components/modals/ViewModal';
import EditModal from '@/components/modals/EditModal';
import DeleteModal from '@/components/modals/DeleteModal';

interface Empresa {
  id: string;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  status: 'ativo' | 'inativo' | 'pendente';
  veiculos: number;
  motoristas: number;
  dataRegistro: string;
}

const Empresas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewModal, setViewModal] = useState<{ isOpen: boolean; data: Empresa | null }>({
    isOpen: false,
    data: null
  });
  const [editModal, setEditModal] = useState<{ isOpen: boolean; data: Empresa | null }>({
    isOpen: false,
    data: null
  });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; data: Empresa | null }>({
    isOpen: false,
    data: null
  });

  // Mock data - replace with API call
  const empresas: Empresa[] = [
    {
      id: '1',
      nome: 'TechCorp Logistics',
      cnpj: '12.345.678/0001-90',
      email: 'contato@techcorp.com',
      telefone: '(11) 9999-9999',
      endereco: 'São Paulo, SP',
      status: 'ativo',
      veiculos: 15,
      motoristas: 8,
      dataRegistro: '2024-01-15'
    },
    {
      id: '2',
      nome: 'FastDelivery LTDA',
      cnpj: '98.765.432/0001-10',
      email: 'admin@fastdelivery.com',
      telefone: '(11) 8888-8888',
      endereco: 'Rio de Janeiro, RJ',
      status: 'ativo',
      veiculos: 22,
      motoristas: 12,
      dataRegistro: '2024-02-10'
    },
    {
      id: '3',
      nome: 'Transportes Brasil',
      cnpj: '11.222.333/0001-44',
      email: 'contato@transportesbrasil.com',
      telefone: '(11) 7777-7777',
      endereco: 'Belo Horizonte, MG',
      status: 'pendente',
      veiculos: 5,
      motoristas: 3,
      dataRegistro: '2024-03-05'
    },
    {
      id: '4',
      nome: 'LogiMaster',
      cnpj: '55.666.777/0001-88',
      email: 'info@logimaster.com',
      telefone: '(11) 6666-6666',
      endereco: 'Porto Alegre, RS',
      status: 'inativo',
      veiculos: 0,
      motoristas: 0,
      dataRegistro: '2023-12-01'
    }
  ];

  const filteredEmpresas = empresas.filter(empresa => {
    const matchesSearch = empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         empresa.cnpj.includes(searchTerm) ||
                         empresa.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || empresa.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
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

  const handleView = (empresa: Empresa) => {
    setViewModal({ isOpen: true, data: empresa });
  };

  const handleEdit = (empresa: Empresa) => {
    setEditModal({ isOpen: true, data: empresa });
  };

  const handleDelete = (empresa: Empresa) => {
    setDeleteModal({ isOpen: true, data: empresa });
  };

  const handleSaveEdit = (data: Record<string, any>) => {
    // Aqui você implementaria a lógica para salvar as alterações
    console.log('Dados salvos:', data);
  };

  const handleConfirmDelete = () => {
    // Aqui você implementaria a lógica para excluir o registro
    console.log('Empresa excluída:', deleteModal.data?.id);
  };

  const totalAtivas = empresas.filter(e => e.status === 'ativo').length;
  const totalVeiculos = empresas.reduce((sum, e) => sum + e.veiculos, 0);
  const totalMotoristas = empresas.reduce((sum, e) => sum + e.motoristas, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Empresas</h1>
          <p className="text-slate-400">Gerencie todas as empresas cadastradas no sistema</p>
        </div>
        <Button className="ajh-button-primary">
          <Plus className="w-4 h-4 mr-2" />
          Nova Empresa
        </Button>
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
                <p className="text-slate-400 text-sm">Empresas Ativas</p>
                <p className="text-2xl font-bold text-white">{totalAtivas}</p>
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
                <p className="text-slate-400 text-sm">Total de Veículos</p>
                <p className="text-2xl font-bold text-white">{totalVeiculos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-ajh-accent/10 rounded-lg">
                <Users className="w-6 h-6 text-ajh-accent" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total de Motoristas</p>
                <p className="text-2xl font-bold text-white">{totalMotoristas}</p>
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
                  placeholder="Pesquisar por nome, CNPJ ou email..."
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
                variant={statusFilter === 'pendente' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('pendente')}
                className={statusFilter === 'pendente' ? 'ajh-button-primary' : 'ajh-button-secondary'}
              >
                Pendente
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
          <CardTitle className="text-white">Lista de Empresas</CardTitle>
          <CardDescription className="text-slate-400">
            {filteredEmpresas.length} empresa(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Nome</TableHead>
                  <TableHead className="text-slate-300">CNPJ</TableHead>
                  <TableHead className="text-slate-300">Contato</TableHead>
                  <TableHead className="text-slate-300">Localização</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Veículos</TableHead>
                  <TableHead className="text-slate-300">Motoristas</TableHead>
                  <TableHead className="text-slate-300 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmpresas.map((empresa) => (
                  <TableRow key={empresa.id} className="border-slate-700 hover:bg-slate-800/30">
                    <TableCell className="text-white font-medium">{empresa.nome}</TableCell>
                    <TableCell className="text-slate-300">{empresa.cnpj}</TableCell>
                    <TableCell className="text-slate-300">
                      <div>
                        <div>{empresa.email}</div>
                        <div className="text-xs text-slate-400">{empresa.telefone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">{empresa.endereco}</TableCell>
                    <TableCell>{getStatusBadge(empresa.status)}</TableCell>
                    <TableCell className="text-slate-300">{empresa.veiculos}</TableCell>
                    <TableCell className="text-slate-300">{empresa.motoristas}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-ajh-primary hover:text-ajh-primary hover:bg-ajh-primary/10"
                          onClick={() => handleView(empresa)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-ajh-secondary hover:text-ajh-secondary hover:bg-ajh-secondary/10"
                          onClick={() => handleEdit(empresa)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          onClick={() => handleDelete(empresa)}
                        >
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

      {/* Modals */}
      <ViewModal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, data: null })}
        title={`Visualizar Empresa - ${viewModal.data?.nome}`}
        data={viewModal.data || {}}
      />

      <EditModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, data: null })}
        title={`Editar Empresa - ${editModal.data?.nome}`}
        data={editModal.data || {}}
        onSave={handleSaveEdit}
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, data: null })}
        title="Confirmar Exclusão"
        description={`Tem certeza que deseja excluir a empresa "${deleteModal.data?.nome}"?`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Empresas;
