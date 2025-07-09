import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Building2, Users, Car, Clock, Settings, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CadastroEstacionamentoModal from '@/components/modals/CadastroEstacionamentoModal';
import EditModal from '@/components/modals/EditModal';
import DeleteModal from '@/components/modals/DeleteModal';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import EstacionamentoService from '@/services/estacionamentos';

const MeuEstacionamento: React.FC = () => {
  const [modalCadastroOpen, setModalCadastroOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUnidade, setSelectedUnidade] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Estado para unidades reais do banco de dados
  const [unidadesRede, setUnidadesRede] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [estatisticasRede, setEstatisticasRede] = useState({
    totalUnidades: 0,
    vagasTotais: 0,
    ocupacao: 0,
    receitaMensal: 0
  });

  useEffect(() => {
    loadUnidades();
    loadEstatisticas();
  }, []);

  const loadUnidades = async () => {
    try {
      setIsLoading(true);
      console.log('Carregando unidades reais do banco de dados...');
      
      // Usar o serviço já importado
      const unidadesFromAPI = await EstacionamentoService.getAll();
      
      // Filtrar apenas unidades ativas (double-check no frontend)
      const unidadesAtivas = unidadesFromAPI.filter((est: any) => est.status === 'ativo');
      
      // Mapear para o formato local se necessário
      const unidadesMapeadas = unidadesAtivas.map((est: any) => ({
        id: est.id,
        nome: est.nome,
        endereco: est.endereco,
        vagas: est.totalVagas || 0,
        vagasOcupadas: est.vagasOcupadas || 0,
        horarioFuncionamento: est.horarioFuncionamento || '24h',
        telefone: est.telefone || '',
        status: est.status === 'ativo' ? 'Ativo' : 'Inativo',
        tipo: 'Principal' // Pode ser determinado baseado em algum critério
      }));
      
      setUnidadesRede(unidadesMapeadas);
      console.log('Unidades ativas carregadas:', unidadesMapeadas.length);
      
    } catch (error: any) {
      console.error('Erro ao carregar unidades:', error);
      setUnidadesRede([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEstatisticas = async () => {
    try {
      console.log('Carregando estatísticas reais do banco...');
      
      // Importar serviços necessários
      const ParkingSpaceService = await import('@/services/parkingSpaces');
      
      // Buscar dados reais
      const myStatus = await ParkingSpaceService.default.getParkingLotStatus();
      
      // Calcular estatísticas baseadas em dados reais
      const totalUnidades = unidadesRede.length; // Número real de unidades ativas
      const vagasTotais = myStatus.total || 0;
      const vagasOcupadas = myStatus.ocupadas || 0;
      const ocupacao = myStatus.ocupacaoPercentual || 0;
      
      // Receita baseada em dados reais (será 0 por enquanto)
      const receitaMensal = 0;
      
      setEstatisticasRede({
        totalUnidades,
        vagasTotais,
        ocupacao,
        receitaMensal
      });
      
      console.log('Estatísticas reais carregadas:', {
        totalUnidades,
        vagasTotais,
        ocupacao,
        receitaMensal
      });
      
    } catch (error: any) {
      console.error('Erro ao carregar estatísticas:', error);
      // Fallback para dados mínimos reais
      setEstatisticasRede({
        totalUnidades: unidadesRede.length,
        vagasTotais: 0,
        ocupacao: 0,
        receitaMensal: 0
      });
    }
  };

  const estatisticasCards = [
    {
      titulo: 'Total de Unidades',
      valor: estatisticasRede.totalUnidades.toString(),
      descricao: `${estatisticasRede.totalUnidades === 1 ? 'estacionamento ativo' : 'estacionamentos ativos'}`,
      icon: Building2,
      cor: 'text-ajh-primary'
    },
    {
      titulo: 'Vagas Totais',
      valor: estatisticasRede.vagasTotais.toString(),
      descricao: 'em toda a rede',
      icon: Car,
      cor: 'text-ajh-secondary'
    },
    {
      titulo: 'Ocupação Geral',
      valor: `${estatisticasRede.ocupacao}%`,
      descricao: `${Math.round((estatisticasRede.vagasTotais * estatisticasRede.ocupacao) / 100)} vagas ocupadas`,
      icon: Users,
      cor: 'text-ajh-accent'
    },
    {
      titulo: 'Receita Mensal',
      valor: `R$ ${estatisticasRede.receitaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      descricao: 'todas as unidades',
      icon: Clock,
      cor: 'text-ajh-success'
    }
  ];

  const handleCadastroEstacionamento = async (data: any) => {
    console.log('Cadastrando nova unidade:', data);
    
    try {
      // Chamar o serviço para salvar no banco
      await EstacionamentoService.create(data);
      
      toast({
        title: "Unidade Cadastrada",
        description: "Nova unidade foi cadastrada com sucesso!",
      });
      setModalCadastroOpen(false);
      // Recarregar dados após cadastro
      loadUnidades();
      loadEstatisticas();
    } catch (error: any) {
      console.error('Erro ao cadastrar unidade:', error);
      toast({
        title: "Erro ao Cadastrar",
        description: error.message || "Erro ao cadastrar nova unidade. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEditarUnidade = (unidade: any) => {
    setSelectedUnidade(unidade);
    setEditModalOpen(true);
  };

  const handleSalvarEdicao = (data: any) => {
    console.log('Editando unidade:', data);
    toast({
      title: "Unidade Atualizada",
      description: "As informações da unidade foram atualizadas com sucesso!",
    });
    setEditModalOpen(false);
    setSelectedUnidade(null);
    // Recarregar dados após edição
    loadUnidades();
    loadEstatisticas();
  };

  const handleGerenciarUnidade = (unidade: any) => {
    console.log('Gerenciando unidade:', unidade.id);
    toast({
      title: "Redirecionando",
      description: `Abrindo gerenciamento da unidade ${unidade.nome}`,
    });
    // Redireciona para a página de gerenciamento do estacionamento específico
    navigate('/estacionamento', { state: { unidadeId: unidade.id } });
  };

  const handleExcluirUnidade = (unidade: any) => {
    setSelectedUnidade(unidade);
    setDeleteModalOpen(true);
  };

  const handleConfirmarExclusao = async () => {
    if (!selectedUnidade) return;

    try {
      await EstacionamentoService.delete(selectedUnidade.id);
      
      toast({
        title: "Unidade Excluída",
        description: `A unidade "${selectedUnidade.nome}" foi excluída com sucesso.`,
        variant: "destructive",
      });
      
      setDeleteModalOpen(false);
      setSelectedUnidade(null);
      
      // Aguardar um pouco antes de recarregar para garantir que o backend processou
      setTimeout(async () => {
        await loadUnidades();
        await loadEstatisticas();
      }, 500);
      
    } catch (error: any) {
      console.error('Erro ao excluir unidade:', error);
      toast({
        title: "Erro ao Excluir",
        description: error.message || "Erro ao excluir a unidade. Tente novamente.",
        variant: "destructive",
      });
      
      setDeleteModalOpen(false);
      setSelectedUnidade(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Minha Rede de Estacionamentos</h1>
          <p className="text-slate-400">Gerencie todas as unidades da sua rede</p>
        </div>
        <Button 
          className="ajh-button-primary"
          onClick={() => setModalCadastroOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Unidade
        </Button>
      </div>

      {/* Estatísticas da Rede */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {estatisticasCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="ajh-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-slate-400 text-sm font-medium">
                      {stat.titulo}
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {stat.valor}
                    </p>
                    <p className="text-xs text-slate-500">{stat.descricao}</p>
                  </div>
                  <div className="p-3 bg-ajh-primary/10 rounded-lg">
                    <Icon className={`w-6 h-6 ${stat.cor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Lista de Unidades */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Unidades da Rede</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-ajh-primary border-t-transparent"></div>
          </div>
        ) : unidadesRede.length === 0 ? (
          <Card className="ajh-card">
            <CardContent className="p-8 text-center">
              <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Nenhuma unidade cadastrada</h3>
              <p className="text-slate-400 mb-4">
                Cadastre sua primeira unidade para começar a gerenciar vagas.
              </p>
              <Button 
                onClick={() => setModalCadastroOpen(true)}
                className="ajh-button-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Primeira Unidade
              </Button>
            </CardContent>
          </Card>
        ) : (
          unidadesRede.map((unidade) => (
            <Card key={unidade.id} className="ajh-card">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-ajh-primary/10 rounded-lg">
                      <MapPin className="w-6 h-6 text-ajh-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{unidade.nome}</h3>
                        <Badge 
                          variant="secondary"
                          className={unidade.tipo === 'Principal' 
                            ? 'bg-ajh-primary/20 text-ajh-primary border-ajh-primary/30' 
                            : 'bg-slate-500/20 text-slate-300 border-slate-500/30'
                          }
                        >
                          {unidade.tipo}
                        </Badge>
                      </div>
                      <p className="text-slate-400 mb-3">{unidade.endereco}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-slate-500">Vagas</p>
                          <p className="text-white font-medium">
                            {unidade.vagasOcupadas}/{unidade.vagas}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Funcionamento</p>
                          <p className="text-white font-medium">{unidade.horarioFuncionamento}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Contato</p>
                          <p className="text-white font-medium">{unidade.telefone || 'Não informado'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditarUnidade(unidade)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExcluirUnidade(unidade)}
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleGerenciarUnidade(unidade)}
                      className="ajh-button-primary"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Gerenciar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modais */}
      <CadastroEstacionamentoModal
        isOpen={modalCadastroOpen}
        onClose={() => setModalCadastroOpen(false)}
        onSave={handleCadastroEstacionamento}
      />

      <EditModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedUnidade(null);
        }}
        onSave={handleSalvarEdicao}
        data={selectedUnidade || {}}
        title="Editar Unidade"
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedUnidade(null);
        }}
        title="Excluir Unidade"
        description={selectedUnidade ? `Tem certeza de que deseja excluir a unidade "${selectedUnidade.nome}"?` : ""}
        onConfirm={handleConfirmarExclusao}
      />
    </div>
  );
};

export default MeuEstacionamento;
