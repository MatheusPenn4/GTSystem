import React, { useState, useEffect } from 'react';
import { Plus, Search, Car, Truck, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import TableActions from '@/components/TableActions';
import ViewModal from '@/components/modals/ViewModal';
import EditModal from '@/components/modals/EditModal';
import DeleteModal from '@/components/modals/DeleteModal';
import CadastroVeiculoModal from '@/components/modals/CadastroVeiculoModal';
import VeiculoService, { Veiculo } from '@/services/veiculos';
import { useToast } from '@/components/ui/use-toast';

const Veiculos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVeiculo, setSelectedVeiculo] = useState<Veiculo | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Carregar dados de veículos
  useEffect(() => {
    const fetchVeiculos = async () => {
      try {
        setLoading(true);
        const data = await VeiculoService.getAll();
        setVeiculos(data);
      } catch (error) {
        console.error('Erro ao carregar veículos:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar a lista de veículos.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVeiculos();
  }, [toast]);

  // Filtrar veículos com base no termo de busca
  const filteredVeiculos = veiculos.filter(veiculo =>
    veiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (veiculo.empresaNome && veiculo.empresaNome.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filtrar veículos por empresa (caso seja uma transportadora)
  const filteredByRoleVeiculos = user?.role === 'transportadora' && user?.companyId
    ? filteredVeiculos.filter(veiculo => veiculo.empresaId === user.companyId)
    : filteredVeiculos;

  const handleView = (veiculo: Veiculo) => {
    setSelectedVeiculo(veiculo);
    setViewModalOpen(true);
  };

  const handleEdit = (veiculo: Veiculo) => {
    setSelectedVeiculo(veiculo);
    setEditModalOpen(true);
  };

  const handleDelete = (veiculo: Veiculo) => {
    setSelectedVeiculo(veiculo);
    setDeleteModalOpen(true);
  };

  const handleSave = async (data: Partial<Veiculo>) => {
    try {
      setLoading(true);
      
      if (selectedVeiculo) {
        // Atualização de veículo existente
        const updatedVeiculo = await VeiculoService.update(selectedVeiculo.id, data);
        setVeiculos(veiculos.map(v => v.id === updatedVeiculo.id ? updatedVeiculo : v));
        toast({
          title: 'Sucesso',
          description: 'Veículo atualizado com sucesso!',
        });
        setEditModalOpen(false);
      } else {
        // Criação de novo veículo
        console.log('Criando veículo com dados:', data);
        
        // Verificar se os dados já contêm um empresaId válido (vindo do modal)
        if (data.empresaId && data.empresaId !== 'none' && data.empresaId !== 'placeholder') {
          console.log('Usando empresaId fornecido pelo modal:', data.empresaId);
          const newVeiculo = await VeiculoService.create(data as Omit<Veiculo, 'id' | 'dataCadastro' | 'empresaNome'>);
          setVeiculos([...veiculos, newVeiculo]);
          toast({
            title: 'Sucesso',
            description: 'Veículo criado com sucesso!',
          });
          setCadastroModalOpen(false);
        } else if (user?.companyId) {
          // Fallback para o companyId do usuário, se disponível
          console.log('Usando companyId do usuário:', user.companyId);
          const newVeiculo = await VeiculoService.create({
            ...data as Omit<Veiculo, 'id' | 'dataCadastro' | 'empresaNome'>,
            empresaId: user.companyId
          });
          setVeiculos([...veiculos, newVeiculo]);
          toast({
            title: 'Sucesso',
            description: 'Veículo criado com sucesso!',
          });
          setCadastroModalOpen(false);
        } else {
          // Apenas para admin sem empresaId no formulário (situação que não deveria ocorrer)
          toast({
            title: 'Erro',
            description: 'Selecione uma empresa para o veículo',
            variant: 'destructive',
          });
          return; // Não fechamos o modal para permitir correção
        }
      }
    } catch (error) {
      console.error('Erro ao salvar veículo:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Não foi possível salvar o veículo.',
        variant: 'destructive',
      });
      // Não fechamos o modal em caso de erro para permitir correções
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedVeiculo) return;
    
    try {
      setLoading(true);
      await VeiculoService.delete(selectedVeiculo.id);
      setVeiculos(veiculos.filter(v => v.id !== selectedVeiculo.id));
      setDeleteModalOpen(false);
      toast({
        title: 'Sucesso',
        description: 'Veículo excluído com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao excluir veículo:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Não foi possível excluir o veículo.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Calcular estatísticas com base nos dados reais
  const getStats = () => {
    const veiculosFiltrados = user?.role === 'transportadora' && user?.companyId
      ? veiculos.filter(veiculo => veiculo.empresaId === user.companyId)
      : veiculos;
    
    const total = veiculosFiltrados.length;
    const ativos = veiculosFiltrados.filter(v => v.status === 'ativo').length;
    const manutencao = veiculosFiltrados.filter(v => v.status === 'manutencao').length;
    const inativos = veiculosFiltrados.filter(v => v.status === 'inativo').length;
    
    // Calcular média de idade dos veículos
    const anoAtual = new Date().getFullYear();
    const somaIdades = veiculosFiltrados.reduce((soma, veiculo) => soma + (anoAtual - veiculo.ano), 0);
    const mediaIdade = total > 0 ? (somaIdades / total).toFixed(1) : '0';
    
    if (user?.role === 'transportadora') {
      return [
        { label: 'Meus Veículos', value: total.toString(), icon: Car, color: 'text-ajh-primary' },
        { label: 'Ativos', value: ativos.toString(), icon: Car, color: 'text-green-400' },
        { label: 'Manutenção', value: manutencao.toString(), icon: Car, color: 'text-yellow-400' },
        { label: 'Média Idade', value: `${mediaIdade} anos`, icon: Car, color: 'text-blue-400' }
      ];
    } else {
      return [
        { label: 'Total Veículos', value: total.toString(), icon: Car, color: 'text-ajh-primary' },
        { label: 'Ativos', value: ativos.toString(), icon: Car, color: 'text-green-400' },
        { label: 'Manutenção', value: manutencao.toString(), icon: Car, color: 'text-yellow-400' },
        { label: 'Inativos', value: inativos.toString(), icon: Car, color: 'text-red-400' }
      ];
    }
  };

  const stats = getStats();

  const [cadastroModalOpen, setCadastroModalOpen] = useState(false);

  const handleCreateNew = () => {
    // Para usuários transportadora, verificamos a empresa associada
    if (user?.role === 'transportadora' && !user?.companyId) {
      toast({
        title: 'Erro',
        description: 'Sua conta não está associada a nenhuma empresa. Contate o administrador.',
        variant: 'destructive',
      });
      return;
    }
    
    console.log('Abrindo modal de cadastro com companyId:', user?.companyId);
    
    // Abrir o modal para qualquer tipo de usuário (inclusive admin)
    setCadastroModalOpen(true);
  };

  // Função para mapear o status do backend para a exibição no frontend
  const mapStatusToDisplay = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'Ativo';
      case 'inativo':
        return 'Inativo';
      case 'manutencao':
        return 'Manutenção';
      default:
        return status;
    }
  };

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
        <Button className="ajh-button-primary" onClick={handleCreateNew} disabled={loading}>
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
            {filteredByRoleVeiculos.length} veículo(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="w-8 h-8 text-ajh-primary animate-spin" />
              <span className="ml-2 text-slate-400">Carregando veículos...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-2 text-slate-300 font-medium">Veículo</th>
                    <th className="text-left py-3 px-2 text-slate-300 font-medium">Placa</th>
                    {user?.role !== 'transportadora' && (
                      <th className="text-left py-3 px-2 text-slate-300 font-medium">Empresa</th>
                    )}
                    <th className="text-left py-3 px-2 text-slate-300 font-medium">Status</th>
                    <th className="text-center py-3 px-2 text-slate-300 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredByRoleVeiculos.length === 0 ? (
                    <tr>
                      <td colSpan={user?.role !== 'transportadora' ? 5 : 4} className="text-center py-8 text-slate-400">
                        Nenhum veículo encontrado
                      </td>
                    </tr>
                  ) : (
                    filteredByRoleVeiculos.map((veiculo) => (
                      <tr key={veiculo.id} className="border-b border-slate-700/50 hover:bg-slate-800/50">
                        <td className="py-4 px-2">
                          <div className="flex items-center space-x-3">
                            {veiculo.tipo === 'VAN' || veiculo.tipo === 'CAR' ? (
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
                          <td className="py-4 px-2 text-slate-300">{veiculo.empresaNome || 'N/A'}</td>
                        )}
                        <td className="py-4 px-2">
                          <Badge 
                            className={
                              veiculo.status === 'ativo' 
                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                : veiculo.status === 'manutencao'
                                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                : 'bg-red-500/20 text-red-400 border-red-500/30'
                            }
                          >
                            {mapStatusToDisplay(veiculo.status)}
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedVeiculo && (
        <ViewModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title="Detalhes do Veículo"
          data={selectedVeiculo}
        />
      )}
      
      {selectedVeiculo && (
        <EditModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSave}
          title="Editar Veículo"
          data={selectedVeiculo}
        />
      )}
      
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Veículo"
        description={`Tem certeza que deseja excluir o veículo ${selectedVeiculo?.placa || ''}? Esta ação não pode ser desfeita.`}
      />
      
      <CadastroVeiculoModal
        isOpen={cadastroModalOpen}
        onClose={() => setCadastroModalOpen(false)}
        onSave={handleSave}
        empresaId={user?.role === 'transportadora' ? user?.companyId : undefined}
      />
    </div>
  );
};

export default Veiculos;
