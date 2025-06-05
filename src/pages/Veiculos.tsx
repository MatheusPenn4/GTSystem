
import React, { useState } from 'react';
import { Plus, Search, Car, Truck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import TableActions from '@/components/TableActions';
import ViewModal from '@/components/modals/ViewModal';
import EditModal from '@/components/modals/EditModal';
import DeleteModal from '@/components/modals/DeleteModal';

const Veiculos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVeiculo, setSelectedVeiculo] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { user } = useAuth();

  // Mock data - ajustado conforme o tipo de usuário
  const getVeiculosData = () => {
    if (user?.role === 'transportadora') {
      return [
        {
          id: 1,
          placa: 'ABC-1234',
          modelo: 'Mercedes Sprinter',
          marca: 'Mercedes',
          ano: 2020,
          cor: 'Branco',
          tipo: 'Van',
          empresa: user.companyName || 'Minha Empresa',
          motorista: 'João Silva',
          status: 'Ativo',
          chassi: '9BFZF12345678901'
        },
        {
          id: 2,
          placa: 'DEF-5678',
          modelo: 'Iveco Daily',
          marca: 'Iveco',
          ano: 2019,
          cor: 'Azul',
          tipo: 'Caminhão',
          empresa: user.companyName || 'Minha Empresa',
          motorista: 'Maria Santos',
          status: 'Ativo',
          chassi: '9BFZF12345678902'
        }
      ];
    } else {
      return [
        {
          id: 1,
          placa: 'ABC-1234',
          modelo: 'Mercedes Sprinter',
          marca: 'Mercedes',
          ano: 2020,
          cor: 'Branco',
          tipo: 'Van',
          empresa: 'TechCorp Ltda',
          motorista: 'João Silva',
          status: 'Ativo',
          chassi: '9BFZF12345678901'
        },
        {
          id: 2,
          placa: 'DEF-5678',
          modelo: 'Iveco Daily',
          marca: 'Iveco',
          ano: 2019,
          cor: 'Azul',
          tipo: 'Caminhão',
          empresa: 'LogiMaster S.A.',
          motorista: 'Maria Santos',
          status: 'Ativo',
          chassi: '9BFZF12345678902'
        },
        {
          id: 3,
          placa: 'GHI-9012',
          modelo: 'Ford Transit',
          marca: 'Ford',
          ano: 2021,
          cor: 'Prata',
          tipo: 'Van',
          empresa: 'TransBrasil Express',
          motorista: 'Carlos Oliveira',
          status: 'Manutenção',
          chassi: '9BFZF12345678903'
        }
      ];
    }
  };

  const veiculos = getVeiculosData();

  const filteredVeiculos = veiculos.filter(veiculo =>
    veiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.empresa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (veiculo: any) => {
    setSelectedVeiculo(veiculo);
    setViewModalOpen(true);
  };

  const handleEdit = (veiculo: any) => {
    setSelectedVeiculo(veiculo);
    setEditModalOpen(true);
  };

  const handleDelete = (veiculo: any) => {
    setSelectedVeiculo(veiculo);
    setDeleteModalOpen(true);
  };

  const handleSave = (data: any) => {
    console.log('Salvando veículo:', data);
    // Aqui você implementaria a lógica de salvamento
  };

  const handleConfirmDelete = () => {
    console.log('Excluindo veículo:', selectedVeiculo);
    // Aqui você implementaria a lógica de exclusão
  };

  const getStatsForRole = () => {
    if (user?.role === 'transportadora') {
      return [
        { label: 'Meus Veículos', value: '12', icon: Car, color: 'text-ajh-primary' },
        { label: 'Ativos', value: '10', icon: Car, color: 'text-green-400' },
        { label: 'Manutenção', value: '2', icon: Car, color: 'text-yellow-400' },
        { label: 'Média Idade', value: '3.2 anos', icon: Car, color: 'text-blue-400' }
      ];
    } else {
      return [
        { label: 'Total Veículos', value: '156', icon: Car, color: 'text-ajh-primary' },
        { label: 'Ativos', value: '142', icon: Car, color: 'text-green-400' },
        { label: 'Manutenção', value: '8', icon: Car, color: 'text-yellow-400' },
        { label: 'Inativos', value: '6', icon: Car, color: 'text-red-400' }
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
            {user?.role === 'transportadora' ? 'Meus Veículos' : 'Veículos'}
          </h1>
          <p className="text-slate-400">
            {user?.role === 'transportadora' 
              ? 'Gerenciamento da sua frota de veículos'
              : 'Gerenciamento de todos os veículos cadastrados'
            }
          </p>
        </div>
        <Button className="ajh-button-primary">
          <Plus className="w-4 h-4 mr-2" />
          Novo Veículo
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
                  placeholder="Buscar por placa, modelo ou empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 ajh-input"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Table */}
      <Card className="ajh-card">
        <CardHeader>
          <CardTitle className="text-white">Lista de Veículos</CardTitle>
          <CardDescription className="text-slate-400">
            {filteredVeiculos.length} veículo(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-2 text-slate-300 font-medium">Veículo</th>
                  <th className="text-left py-3 px-2 text-slate-300 font-medium">Placa</th>
                  {user?.role !== 'transportadora' && (
                    <th className="text-left py-3 px-2 text-slate-300 font-medium">Empresa</th>
                  )}
                  <th className="text-left py-3 px-2 text-slate-300 font-medium">Motorista</th>
                  <th className="text-left py-3 px-2 text-slate-300 font-medium">Status</th>
                  <th className="text-center py-3 px-2 text-slate-300 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredVeiculos.map((veiculo) => (
                  <tr key={veiculo.id} className="border-b border-slate-700/50 hover:bg-slate-800/50">
                    <td className="py-4 px-2">
                      <div className="flex items-center space-x-3">
                        {veiculo.tipo === 'Van' ? (
                          <Car className="w-8 h-8 text-ajh-primary" />
                        ) : (
                          <Truck className="w-8 h-8 text-ajh-secondary" />
                        )}
                        <div>
                          <p className="text-white font-medium">{veiculo.modelo}</p>
                          <p className="text-sm text-slate-400">{veiculo.marca} - {veiculo.ano}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="text-white font-mono bg-slate-800 px-2 py-1 rounded">
                        {veiculo.placa}
                      </span>
                    </td>
                    {user?.role !== 'transportadora' && (
                      <td className="py-4 px-2 text-slate-300">{veiculo.empresa}</td>
                    )}
                    <td className="py-4 px-2 text-slate-300">{veiculo.motorista}</td>
                    <td className="py-4 px-2">
                      <Badge 
                        className={
                          veiculo.status === 'Ativo' 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : veiculo.status === 'Manutenção'
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }
                      >
                        {veiculo.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex justify-center">
                        <TableActions
                          onView={() => handleView(veiculo)}
                          onEdit={() => handleEdit(veiculo)}
                          onDelete={() => handleDelete(veiculo)}
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
        title="Detalhes do Veículo"
        data={selectedVeiculo || {}}
      />

      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Editar Veículo"
        data={selectedVeiculo || {}}
        onSave={handleSave}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Excluir Veículo"
        description={`Tem certeza que deseja excluir o veículo "${selectedVeiculo?.placa}"?`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Veiculos;
