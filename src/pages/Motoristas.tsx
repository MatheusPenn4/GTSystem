import React, { useState, useEffect } from 'react';
import { Plus, Search, Users, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import TableActions from '@/components/TableActions';
import ViewModal from '@/components/modals/ViewModal';
import EditModal from '@/components/modals/EditModal';
import DeleteModal from '@/components/modals/DeleteModal';
import CadastroMotoristaModal from '@/components/modals/CadastroMotoristaModal';
import MotoristaService, { Motorista } from '@/services/motoristas';
import { useToast } from '@/components/ui/use-toast';

const Motoristas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMotorista, setSelectedMotorista] = useState<Motorista | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Carregar dados de motoristas
  useEffect(() => {
    const fetchMotoristas = async () => {
      try {
        setLoading(true);
        const data = await MotoristaService.getAll();
        setMotoristas(data);
      } catch (error) {
        console.error('Erro ao carregar motoristas:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar a lista de motoristas.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMotoristas();
  }, [toast]);

  // Filtrar motoristas com base no termo de busca
  const filteredMotoristas = motoristas.filter(motorista =>
    motorista.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    motorista.cpf.includes(searchTerm) ||
    motorista.cnh.includes(searchTerm) ||
    (motorista.empresaNome && motorista.empresaNome.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filtrar motoristas por empresa (caso seja uma transportadora)
  const filteredByRoleMotoristas = user?.role === 'transportadora' && user?.companyId
    ? filteredMotoristas.filter(motorista => motorista.empresaId === user.companyId)
    : filteredMotoristas;

  const isValidadePerto = (validade?: string) => {
    if (!validade) return false;
    const hoje = new Date();
    const dataValidade = new Date(validade);
    const diffTime = dataValidade.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isValidadeVencida = (validade?: string) => {
    if (!validade) return false;
    const hoje = new Date();
    const dataValidade = new Date(validade);
    return dataValidade < hoje;
  };

  const handleView = (motorista: Motorista) => {
    setSelectedMotorista(motorista);
    setViewModalOpen(true);
  };

  const handleEdit = (motorista: Motorista) => {
    setSelectedMotorista(motorista);
    setEditModalOpen(true);
  };

  const handleDelete = (motorista: Motorista) => {
    setSelectedMotorista(motorista);
    setDeleteModalOpen(true);
  };

  const handleSave = async (data: Partial<Motorista>) => {
    try {
      setLoading(true);
      
      if (selectedMotorista) {
        // Atualização de motorista existente
        const updatedMotorista = await MotoristaService.update(selectedMotorista.id, data);
        setMotoristas(motoristas.map(m => m.id === updatedMotorista.id ? updatedMotorista : m));
        toast({
          title: 'Sucesso',
          description: 'Motorista atualizado com sucesso!',
        });
        setEditModalOpen(false);
      } else {
        // Criação de novo motorista
        if (user?.companyId) {
          const newMotorista = await MotoristaService.create({
            ...data as Omit<Motorista, 'id' | 'dataCadastro' | 'empresaNome'>,
            empresaId: user.companyId
          });
          setMotoristas([...motoristas, newMotorista]);
          toast({
            title: 'Sucesso',
            description: 'Motorista criado com sucesso!',
          });
          setCadastroModalOpen(false); // Fechar o modal apenas em caso de sucesso
        }
      }
    } catch (error) {
      console.error('Erro ao salvar motorista:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Não foi possível salvar o motorista.',
        variant: 'destructive',
      });
      // Não fechamos o modal em caso de erro para permitir correções
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedMotorista) return;
    
    try {
      setLoading(true);
      await MotoristaService.delete(selectedMotorista.id);
      setMotoristas(motoristas.filter(m => m.id !== selectedMotorista.id));
      setDeleteModalOpen(false);
      toast({
        title: 'Sucesso',
        description: 'Motorista excluído com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao excluir motorista:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Não foi possível excluir o motorista.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Calcular estatísticas com base nos dados reais
  const getStats = () => {
    const motoristasFiltrados = user?.role === 'transportadora' && user?.companyId
      ? motoristas.filter(motorista => motorista.empresaId === user.companyId)
      : motoristas;
    
    const total = motoristasFiltrados.length;
    const ativos = motoristasFiltrados.filter(m => m.status === 'ativo').length;
    
    // Contar CNHs próximas do vencimento e vencidas
    const cnhVencer = motoristasFiltrados.filter(m => isValidadePerto(m.validadeCnh)).length;
    const inativos = motoristasFiltrados.filter(m => m.status === 'inativo').length;
    
    if (user?.role === 'transportadora') {
      return [
        { label: 'Meus Motoristas', value: total.toString(), icon: Users, color: 'text-ajh-primary' },
        { label: 'Ativos', value: ativos.toString(), icon: Users, color: 'text-green-400' },
        { label: 'CNH a Vencer', value: cnhVencer.toString(), icon: AlertTriangle, color: 'text-yellow-400' },
        { label: 'Inativos', value: inativos.toString(), icon: Users, color: 'text-red-400' }
      ];
    } else {
      return [
        { label: 'Total Motoristas', value: total.toString(), icon: Users, color: 'text-ajh-primary' },
        { label: 'Ativos', value: ativos.toString(), icon: Users, color: 'text-green-400' },
        { label: 'CNH a Vencer', value: cnhVencer.toString(), icon: AlertTriangle, color: 'text-yellow-400' },
        { label: 'Inativos', value: inativos.toString(), icon: Users, color: 'text-red-400' }
      ];
    }
  };

  const stats = getStats();

  const [cadastroModalOpen, setCadastroModalOpen] = useState(false);

  const handleCreateNew = () => {
    setCadastroModalOpen(true);
  };

  // Função para mapear o status do backend para a exibição no frontend
  const mapStatusToDisplay = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'Ativo';
      case 'inativo':
        return 'Inativo';
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
            {user?.role === 'transportadora' ? 'Meus Motoristas' : 'Motoristas'}
          </h1>
          <p className="text-slate-400">
            {user?.role === 'transportadora' 
              ? 'Gerenciamento dos seus motoristas'
              : 'Gerenciamento de todos os motoristas cadastrados'
            }
          </p>
        </div>
        <Button className="ajh-button-primary" onClick={handleCreateNew} disabled={loading}>
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
            {filteredByRoleMotoristas.length} motorista(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="w-8 h-8 text-ajh-primary animate-spin" />
              <span className="ml-2 text-slate-400">Carregando motoristas...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-2 text-slate-300 font-medium">Motorista</th>
                    <th className="text-left py-3 px-2 text-slate-300 font-medium">CNH</th>
                    {user?.role !== 'transportadora' && (
                      <th className="text-left py-3 px-2 text-slate-300 font-medium">Empresa</th>
                    )}
                    <th className="text-left py-3 px-2 text-slate-300 font-medium">Contato</th>
                    <th className="text-left py-3 px-2 text-slate-300 font-medium">Status</th>
                    <th className="text-center py-3 px-2 text-slate-300 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredByRoleMotoristas.length === 0 ? (
                    <tr>
                      <td colSpan={user?.role !== 'transportadora' ? 6 : 5} className="text-center py-8 text-slate-400">
                        Nenhum motorista encontrado
                      </td>
                    </tr>
                  ) : (
                    filteredByRoleMotoristas.map((motorista) => (
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
                            {motorista.categoria && (
                              <p className="text-sm text-slate-400 mt-1">Cat. {motorista.categoria}</p>
                            )}
                            {motorista.validadeCnh && (
                              <div className="flex items-center space-x-2 mt-1">
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
                            )}
                          </div>
                        </td>
                        {user?.role !== 'transportadora' && (
                          <td className="py-4 px-2 text-slate-300">{motorista.empresaNome || 'N/A'}</td>
                        )}
                        <td className="py-4 px-2">
                          <div>
                            <p className="text-slate-300">{motorista.telefone}</p>
                            <p className="text-sm text-slate-400">{motorista.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <Badge 
                            className={motorista.status === 'ativo' 
                              ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                              : 'bg-red-500/20 text-red-400 border-red-500/30'
                            }
                          >
                            {mapStatusToDisplay(motorista.status)}
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
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

      <CadastroMotoristaModal
        isOpen={cadastroModalOpen}
        onClose={() => setCadastroModalOpen(false)}
        onSave={handleSave}
        empresaId={user?.role === 'transportadora' ? user?.companyId : undefined}
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
