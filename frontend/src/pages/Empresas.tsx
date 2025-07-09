import React, { useState, useEffect } from 'react';
import { Plus, Search, Building2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import TableActions from '@/components/TableActions';
import ViewModal from '@/components/modals/ViewModal';
import EditModal from '@/components/modals/EditModal';
import DeleteModal from '@/components/modals/DeleteModal';
import CadastroEmpresaModal from '@/components/modals/CadastroEmpresaModal';
import EmpresaService, { Empresa } from '@/services/empresas';
import { useToast } from '@/hooks/use-toast';

const Empresas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cadastroModalOpen, setCadastroModalOpen] = useState(false);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchEmpresas = async () => {
    try {
      setIsLoading(true);
      const data = await EmpresaService.getAll();
      setEmpresas(data);
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível obter a lista de empresas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEmpresas = empresas.filter(empresa =>
    (empresa?.nome && searchTerm ? empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
    (empresa?.cnpj && searchTerm ? empresa.cnpj.includes(searchTerm) : false) ||
    (empresa?.email && searchTerm ? empresa.email.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
    !searchTerm // Se searchTerm estiver vazio, retorna todas as empresas
  );

  const handleView = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setViewModalOpen(true);
  };

  const handleEdit = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setEditModalOpen(true);
  };

  const handleDelete = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setDeleteModalOpen(true);
  };

  const handleSave = async (data: Partial<Empresa>) => {
    try {
      if (selectedEmpresa) {
        await EmpresaService.update(selectedEmpresa.id, data);
        toast({
          title: "Empresa atualizada",
          description: "As alterações foram salvas com sucesso.",
        });
        fetchEmpresas(); // Recarregar lista
      }
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      toast({
        title: "Erro na atualização",
        description: "Não foi possível atualizar a empresa.",
        variant: "destructive",
      });
    } finally {
      setEditModalOpen(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (selectedEmpresa) {
        await EmpresaService.delete(selectedEmpresa.id);
        toast({
          title: "Empresa excluída",
          description: "A empresa foi excluída com sucesso.",
        });
        fetchEmpresas(); // Recarregar lista
      }
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
      toast({
        title: "Erro na exclusão",
        description: "Não foi possível excluir a empresa.",
        variant: "destructive",
      });
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const handleCreateNew = () => {
    setCadastroModalOpen(true);
  };

  const handleCadastroSave = async (data: Omit<Empresa, 'id'>) => {
    try {
      setIsLoading(true);
      const novaEmpresa = await EmpresaService.create(data);
      
      toast({
        title: "Empresa cadastrada",
        description: "A nova empresa foi cadastrada com sucesso.",
      });
      
      fetchEmpresas(); // Recarregar lista
      setCadastroModalOpen(false);
    } catch (error: any) {
      console.error('Erro ao cadastrar empresa:', error);
      
      // Mostrar mensagem de erro específica se disponível
      const errorMessage = error.message || "Não foi possível cadastrar a empresa.";
      
      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Não fechar o modal em caso de erro para permitir correção
      return;
    } finally {
      setIsLoading(false);
    }
  };

  // Contadores para estatísticas
  const totalEmpresas = empresas.length;
  const empresasAtivas = empresas.filter(e => e.status === 'ATIVO').length;
  const empresasInativas = empresas.filter(e => e.status === 'INATIVO' || e.status === 'SUSPENSO').length;
  const totalVeiculos = 156; // Este valor precisaria vir de uma API

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Empresas</h1>
          <p className="text-slate-400">Gerenciamento de empresas transportadoras</p>
        </div>
        <Button className="ajh-button-primary" onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Empresa
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {isLoading ? (
          // Esqueletos durante o carregamento
          Array(4).fill(0).map((_, index) => (
            <Card key={index} className="ajh-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Skeleton className="w-8 h-8 rounded bg-slate-700" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-16 bg-slate-700" />
                    <Skeleton className="h-4 w-24 bg-slate-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          // Dados reais
          <>
            <Card className="ajh-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-8 h-8 text-ajh-primary" />
                  <div>
                    <p className="text-2xl font-bold text-white">{totalEmpresas}</p>
                    <p className="text-sm text-slate-400">Total de Empresas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="ajh-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-2xl font-bold text-white">{empresasAtivas}</p>
                    <p className="text-sm text-slate-400">Ativas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="ajh-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="text-2xl font-bold text-white">{empresasInativas}</p>
                    <p className="text-sm text-slate-400">Inativas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="ajh-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-2xl font-bold text-white">{totalVeiculos}</p>
                    <p className="text-sm text-slate-400">Total Veículos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Search and Filters */}
      <Card className="ajh-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome, CNPJ ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 ajh-input"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Companies Table */}
      <Card className="ajh-card">
        <CardHeader>
          <CardTitle className="text-white">Lista de Empresas</CardTitle>
          <CardDescription className="text-slate-400">
            {filteredEmpresas.length} empresa(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            // Esqueleto da tabela durante o carregamento
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-ajh-primary" />
              <span className="ml-2 text-slate-400">Carregando empresas...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-2 text-slate-300 font-medium">Empresa</th>
                    <th className="text-left py-3 px-2 text-slate-300 font-medium">CNPJ</th>
                    <th className="text-left py-3 px-2 text-slate-300 font-medium">Responsável</th>
                    <th className="text-left py-3 px-2 text-slate-300 font-medium">Tipo</th>
                    <th className="text-left py-3 px-2 text-slate-300 font-medium">Status</th>
                    <th className="text-center py-3 px-2 text-slate-300 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmpresas.length > 0 ? (
                    filteredEmpresas.map((empresa) => (
                      <tr key={empresa.id} className="border-b border-slate-700/50 hover:bg-slate-800/50">
                        <td className="py-4 px-2">
                          <div>
                            <p className="text-white font-medium">{empresa.nome}</p>
                            <p className="text-sm text-slate-400">{empresa.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-slate-300">{empresa.cnpj}</td>
                        <td className="py-4 px-2 text-slate-300">{empresa.responsavel}</td>
                        <td className="py-4 px-2 text-slate-300">
                          {empresa.tipo === 'TRANSPORTADORA' ? 'Transportadora' : 'Estacionamento'}
                        </td>
                        <td className="py-4 px-2">
                          <Badge 
                            className={empresa.status === 'ATIVO' 
                              ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                              : 'bg-red-500/20 text-red-400 border-red-500/30'
                            }
                          >
                            {empresa.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex justify-center">
                            <TableActions
                              onView={() => handleView(empresa)}
                              onEdit={() => handleEdit(empresa)}
                              onDelete={() => handleDelete(empresa)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Nenhuma empresa encontrada.
                      </td>
                    </tr>
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
        title="Detalhes da Empresa"
        data={selectedEmpresa || {}}
      />

      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Editar Empresa"
        data={selectedEmpresa || {}}
        onSave={handleSave}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Excluir Empresa"
        description={`Tem certeza que deseja excluir a empresa "${selectedEmpresa?.nome}"?`}
        onConfirm={handleConfirmDelete}
      />

      <CadastroEmpresaModal
        isOpen={cadastroModalOpen}
        onClose={() => setCadastroModalOpen(false)}
        onSave={handleCadastroSave}
      />
    </div>
  );
};

export default Empresas;
