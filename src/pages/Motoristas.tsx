
import React, { useState } from 'react';
import { Plus, Search, Users, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import TableActions from '@/components/TableActions';
import ViewModal from '@/components/modals/ViewModal';
import EditModal from '@/components/modals/EditModal';
import DeleteModal from '@/components/modals/DeleteModal';

const Motoristas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMotorista, setSelectedMotorista] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { user } = useAuth();

  // Mock data - ajustado conforme o tipo de usuário
  const getMotoristasData = () => {
    if (user?.role === 'transportadora') {
      return [
        {
          id: 1,
          nome: 'João Silva',
          cpf: '123.456.789-00',
          cnh: '12345678901',
          categoria: 'D',
          validadeCnh: '2025-12-15',
          telefone: '(11) 99999-9999',
          email: 'joao@email.com',
          empresa: user.companyName || 'Minha Empresa',
          veiculo: 'ABC-1234',
          status: 'Ativo'
        },
        {
          id: 2,
          nome: 'Maria Santos',
          cpf: '987.654.321-00',
          cnh: '10987654321',
          categoria: 'C',
          validadeCnh: '2024-08-20',
          telefone: '(11) 88888-8888',
          email: 'maria@email.com',
          empresa: user.companyName || 'Minha Empresa',
          veiculo: 'DEF-5678',
          status: 'Ativo'
        }
      ];
    } else {
      return [
        {
          id: 1,
          nome: 'João Silva',
          cpf: '123.456.789-00',
          cnh: '12345678901',
          categoria: 'D',
          validadeCnh: '2025-12-15',
          telefone: '(11) 99999-9999',
          email: 'joao@email.com',
          empresa: 'TechCorp Ltda',
          veiculo: 'ABC-1234',
          status: 'Ativo'
        },
        {
          id: 2,
          nome: 'Maria Santos',
          cpf: '987.654.321-00',
          cnh: '10987654321',
          categoria: 'C',
          validadeCnh: '2024-08-20',
          telefone: '(11) 88888-8888',
          email: 'maria@email.com',
          empresa: 'LogiMaster S.A.',
          veiculo: 'DEF-5678',
          status: 'Ativo'
        },
        {
          id: 3,
          nome: 'Carlos Oliveira',
          cpf: '456.789.123-00',
          cnh: '56789012345',
          categoria: 'C',
          validadeCnh: '2024-03-10',
          telefone: '(11) 77777-7777',
          email: 'carlos@email.com',
          empresa: 'TransBrasil Express',
          veiculo: 'GHI-9012',
          status: 'Inativo'
        }
      ];
    }
  };

  const motoristas = getMotoristasData();

  const filteredMotoristas = motoristas.filter(motorista =>
    motorista.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    motorista.cpf.includes(searchTerm) ||
    motorista.cnh.includes(searchTerm) ||
    motorista.empresa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isValidadePerto = (validade: string) => {
    const hoje = new Date();
    const dataValidade = new Date(validade);
    const diffTime = dataValidade.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isValidadeVencida = (validade: string) => {
    const hoje = new Date();
    const dataValidade = new Date(validade);
    return dataValidade < hoje;
  };

  const handleView = (motorista: any) => {
    setSelectedMotorista(motorista);
    setViewModalOpen(true);
  };

  const handleEdit = (motorista: any) => {
    setSelectedMotorista(motorista);
    setEditModalOpen(true);
  };

  const handleDelete = (motorista: any) => {
    setSelectedMotorista(motorista);
    setDeleteModalOpen(true);
  };

  const handleSave = (data: any) => {
    console.log('Salvando motorista:', data);
    // Aqui você implementaria a lógica de salvamento
  };

  const handleConfirmDelete = () => {
    console.log('Excluindo motorista:', selectedMotorista);
    // Aqui você implementaria a lógica de exclusão
  };

  const getStatsForRole = () => {
    if (user?.role === 'transportadora') {
      return [
        { label: 'Meus Motoristas', value: '8', icon: Users, color: 'text-ajh-primary' },
        { label: 'Ativos', value: '7', icon: Users, color: 'text-green-400' },
        { label: 'CNH a Vencer', value: '1', icon: AlertTriangle, color: 'text-yellow-400' },
        { label: 'Inativos', value: '1', icon: Users, color: 'text-red-400' }
      ];
    } else {
      return [
        { label: 'Total Motoristas', value: '89', icon: Users, color: 'text-ajh-primary' },
        { label: 'Ativos', value: '78', icon: Users, color: 'text-green-400' },
        { label: 'CNH a Vencer', value: '6', icon: AlertTriangle, color: 'text-yellow-400' },
        { label: 'Inativos', value: '11', icon: Users, color: 'text-red-400' }
      ];
    }
  };

  const stats = getStatsForRole();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {user?.role === 'transportadora' ? 'Meus Motoristas' : 'Motoristas'}
          </h1>
          <p className="text-slate-400">
            {user?.role === 'transportadora' 
              ? 'Gerenciamento dos seus motoristas'
              : 'Gerenciamento de todos os motoristas cadastrados'
            }
          </p>
        </div>
        <Button className="ajh-button-primary">
          <Plus className="w-4 h-4 mr-2" />
          Novo Motorista
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="ajh-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search and Filters */}
      <Card className="ajh-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome, CPF, CNH ou empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 ajh-input"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drivers Table */}
      <Card className="ajh-card">
        <CardHeader>
          <CardTitle className="text-white">Lista de Motoristas</CardTitle>
          <CardDescription className="text-slate-400">
            {filteredMotoristas.length} motorista(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-2 text-slate-300 font-medium">Motorista</th>
                  <th className="text-left py-3 px-2 text-slate-300 font-medium">CNH</th>
                  {user?.role !== 'transportadora' && (
                    <th className="text-left py-3 px-2 text-slate-300 font-medium">Empresa</th>
                  )}
                  <th className="text-left py-3 px-2 text-slate-300 font-medium">Veículo</th>
                  <th className="text-left py-3 px-2 text-slate-300 font-medium">Validade CNH</th>
                  <th className="text-left py-3 px-2 text-slate-300 font-medium">Status</th>
                  <th className="text-center py-3 px-2 text-slate-300 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredMotoristas.map((motorista) => (
                  <tr key={motorista.id} className="border-b border-slate-700/50 hover:bg-slate-800/50">
                    <td className="py-4 px-2">
                      <div>
                        <p className="text-white font-medium">{motorista.nome}</p>
                        <p className="text-sm text-slate-400">{motorista.cpf}</p>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div>
                        <span className="text-white font-mono bg-slate-800 px-2 py-1 rounded text-sm">
                          {motorista.cnh}
                        </span>
                        <p className="text-sm text-slate-400 mt-1">Cat. {motorista.categoria}</p>
                      </div>
                    </td>
                    {user?.role !== 'transportadora' && (
                      <td className="py-4 px-2 text-slate-300">{motorista.empresa}</td>
                    )}
                    <td className="py-4 px-2">
                      <span className="text-white font-mono bg-slate-800 px-2 py-1 rounded text-sm">
                        {motorista.veiculo}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-white text-sm">
                          {new Date(motorista.validadeCnh).toLocaleDateString('pt-BR')}
                        </span>
                        {isValidadeVencida(motorista.validadeCnh) && (
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                        )}
                        {isValidadePerto(motorista.validadeCnh) && (
                          <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <Badge 
                        className={motorista.status === 'Ativo' 
                          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }
                      >
                        {motorista.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex justify-center">
                        <TableActions
                          onView={() => handleView(motorista)}
                          onEdit={() => handleEdit(motorista)}
                          onDelete={() => handleDelete(motorista)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <ViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Detalhes do Motorista"
        data={selectedMotorista || {}}
      />

      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Editar Motorista"
        data={selectedMotorista || {}}
        onSave={handleSave}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Excluir Motorista"
        description={`Tem certeza que deseja excluir o motorista "${selectedMotorista?.nome}"?`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Motoristas;
