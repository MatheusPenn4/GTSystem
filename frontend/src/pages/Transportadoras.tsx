import React, { useState, useEffect } from 'react';
import { Plus, Search, Truck, Building2, Users, Car, MapPin, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import CadastroEmpresaModal from '@/components/modals/CadastroEmpresaModal';
import EditModal from '@/components/modals/EditModal';
import ViewModal from '@/components/modals/ViewModal';
import DeleteModal from '@/components/modals/DeleteModal';
import TableActions from '@/components/TableActions';
import EmpresaService, { Empresa } from '@/services/empresas';

interface Transportadora {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: string;
  totalVeiculos: number;
  totalMotoristas: number;
  totalFiliais: number;
  status: 'ativo' | 'inativo' | 'pendente';
}

// Função para mapear Empresa (do serviço) para Transportadora (da página)
const mapEmpresaToTransportadora = (empresa: Empresa): Transportadora => {
  return {
    id: empresa.id,
    name: empresa.nome,
    cnpj: empresa.cnpj,
    email: empresa.email,
    phone: empresa.telefone,
    address: empresa.endereco,
    isActive: empresa.status === 'ATIVO',
    createdAt: empresa.dataCadastro,
    totalVeiculos: 0, // Dados não disponíveis do backend ainda
    totalMotoristas: 0, // Dados não disponíveis do backend ainda
    totalFiliais: 1, // Valor padrão
    status: empresa.status === 'ATIVO' ? 'ativo' : 'inativo',
  };
};

const Transportadoras: React.FC = () => {
  const { user } = useAuth();
  const [transportadoras, setTransportadoras] = useState<Transportadora[]>([]);
  const [filteredTransportadoras, setFilteredTransportadoras] = useState<Transportadora[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Modal states
  const [isCadastroModalOpen, setIsCadastroModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransportadora, setSelectedTransportadora] = useState<Transportadora | null>(null);



  useEffect(() => {
    loadTransportadoras();
  }, []);

  useEffect(() => {
    filterTransportadoras();
  }, [transportadoras, searchTerm, statusFilter]);

  const loadTransportadoras = async () => {
    try {
      setIsLoading(true);
      console.log('Carregando transportadoras do banco de dados...');
      
      // Buscar apenas empresas do tipo TRANSPORTADORA
      const empresas = await EmpresaService.getAll();
      const transportadorasData = empresas
        .filter(empresa => empresa.tipo === 'TRANSPORTADORA')
        .map(mapEmpresaToTransportadora);
      
      console.log(`${transportadorasData.length} transportadoras encontradas no banco de dados`);
      setTransportadoras(transportadorasData);
    } catch (error) {
      console.error('Erro ao carregar transportadoras:', error);
      toast({
        title: "Erro ao carregar transportadoras",
        description: error instanceof Error ? error.message : "Não foi possível carregar a lista de transportadoras.",
        variant: "destructive",
      });
      setTransportadoras([]); // Lista vazia em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  const filterTransportadoras = () => {
    let filtered = transportadoras.filter(transportadora => {
      const matchesSearch = 
        transportadora.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transportadora.cnpj.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transportadora.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || transportadora.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    setFilteredTransportadoras(filtered);
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (!isActive) {
      return <Badge variant="destructive">Inativo</Badge>;
    }
    
    switch (status) {
      case 'ativo':
        return <Badge variant="default" className="bg-green-600">Ativo</Badge>;
      case 'pendente':
        return <Badge variant="outline" className="border-yellow-400 text-yellow-400">Pendente</Badge>;
      case 'inativo':
        return <Badge variant="destructive">Inativo</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const handleCadastroTransportadora = async (transportadoraData: any) => {
    try {
      console.log('Criando nova transportadora...', transportadoraData);
      
      const novaEmpresa: Omit<Empresa, 'id' | 'dataCadastro'> = {
        nome: transportadoraData.nome || transportadoraData.name,
        cnpj: transportadoraData.cnpj,
        tipo: 'TRANSPORTADORA',
        endereco: transportadoraData.endereco || transportadoraData.address,
        cidade: transportadoraData.cidade,
        estado: transportadoraData.estado,
        cep: transportadoraData.cep,
        telefone: transportadoraData.telefone || transportadoraData.phone,
        email: transportadoraData.email,
        responsavel: transportadoraData.responsavel,
        status: 'ATIVO',
      };

      const empresaCriada = await EmpresaService.create(novaEmpresa);
      const novaTransportadora = mapEmpresaToTransportadora(empresaCriada);
      
      setTransportadoras(prev => [...prev, novaTransportadora]);
      setIsCadastroModalOpen(false);
      
      toast({
        title: "Transportadora cadastrada com sucesso!",
        description: `${novaEmpresa.nome} foi adicionada ao sistema.`,
      });
    } catch (error) {
      console.error('Erro ao cadastrar transportadora:', error);
      toast({
        title: "Erro ao cadastrar transportadora",
        description: error instanceof Error ? error.message : "Não foi possível cadastrar a transportadora.",
        variant: "destructive",
      });
    }
  };

  const handleEditTransportadora = async (transportadoraData: any) => {
    try {
      if (!selectedTransportadora) return;
      
      console.log('Atualizando transportadora...', transportadoraData);
      
      const empresaAtualizada: Partial<Empresa> = {
        nome: transportadoraData.name,
        telefone: transportadoraData.phone,
        email: transportadoraData.email,
        endereco: transportadoraData.address,
      };

      await EmpresaService.update(selectedTransportadora.id, empresaAtualizada);
      
      setTransportadoras(prev => prev.map(transportadora => 
        transportadora.id === selectedTransportadora?.id 
          ? { ...transportadora, ...transportadoraData }
          : transportadora
      ));
      setIsEditModalOpen(false);
      setSelectedTransportadora(null);
      
      toast({
        title: "Transportadora atualizada com sucesso!",
        description: "Os dados foram salvos.",
      });
    } catch (error) {
      console.error('Erro ao atualizar transportadora:', error);
      toast({
        title: "Erro ao atualizar transportadora",
        description: error instanceof Error ? error.message : "Não foi possível atualizar a transportadora.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTransportadora = async () => {
    try {
      if (!selectedTransportadora) return;
      
      console.log('Excluindo transportadora...', selectedTransportadora.id);
      
      await EmpresaService.delete(selectedTransportadora.id);
      
      setTransportadoras(prev => prev.filter(transportadora => transportadora.id !== selectedTransportadora.id));
      setIsDeleteModalOpen(false);
      setSelectedTransportadora(null);
      
      toast({
        title: "Transportadora excluída",
        description: "A transportadora foi removida do sistema.",
      });
    } catch (error) {
      console.error('Erro ao excluir transportadora:', error);
      toast({
        title: "Erro ao excluir transportadora",
        description: error instanceof Error ? error.message : "Não foi possível excluir a transportadora.",
        variant: "destructive",
      });
    }
  };

  const toggleTransportadoraStatus = async (transportadora: Transportadora) => {
    try {
      console.log('Alterando status da transportadora...', transportadora.id);
      
      const novoStatus = transportadora.isActive ? 'INATIVO' : 'ATIVO';
      await EmpresaService.changeStatus(transportadora.id, novoStatus);
      
      setTransportadoras(prev => prev.map(t => 
        t.id === transportadora.id 
          ? { ...t, isActive: !t.isActive, status: !t.isActive ? 'ativo' : 'inativo' }
          : t
      ));
      
      toast({
        title: transportadora.isActive ? "Transportadora desativada" : "Transportadora ativada",
        description: `${transportadora.name} foi ${transportadora.isActive ? 'desativada' : 'ativada'}.`,
      });
    } catch (error) {
      console.error('Erro ao alterar status da transportadora:', error);
      toast({
        title: "Erro ao alterar status",
        description: error instanceof Error ? error.message : "Não foi possível alterar o status da transportadora.",
        variant: "destructive",
      });
    }
  };

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransportadoras.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransportadoras.length / itemsPerPage);

  // Verificar permissão de admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-ajh-darker flex items-center justify-center">
        <div className="glass-effect p-8 rounded-xl text-center">
          <Truck className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Acesso Negado</h2>
          <p className="text-slate-400">Apenas administradores podem acessar a gestão de transportadoras.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestão de Transportadoras</h1>
          <p className="text-slate-400">Gerencie empresas transportadoras e suas operações</p>
        </div>
        <Button 
          onClick={() => setIsCadastroModalOpen(true)}
          className="ajh-btn ajh-btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Transportadora
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="ajh-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Transportadoras</p>
                <p className="text-2xl font-bold text-white">{transportadoras.length}</p>
              </div>
              <Truck className="h-8 w-8 text-ajh-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Transportadoras Ativas</p>
                <p className="text-2xl font-bold text-green-400">
                  {transportadoras.filter(t => t.isActive).length}
                </p>
              </div>
              <Building2 className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Veículos</p>
                <p className="text-2xl font-bold text-blue-400">
                  {transportadoras.reduce((acc, t) => acc + t.totalVeiculos, 0)}
                </p>
              </div>
              <Car className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Motoristas</p>
                <p className="text-2xl font-bold text-purple-400">
                  {transportadoras.reduce((acc, t) => acc + t.totalMotoristas, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="ajh-card">
        <CardHeader>
          <CardTitle className="text-white">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Pesquisar transportadoras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 ajh-input"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="ajh-input">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="ajh-btn-secondary"
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transportadoras Table */}
      <Card className="ajh-card">
        <CardHeader>
          <CardTitle className="text-white">
            Transportadoras ({filteredTransportadoras.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-ajh-primary border-t-transparent"></div>
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-slate-700 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-slate-800/50">
                      <TableHead className="text-slate-300">Transportadora</TableHead>
                      <TableHead className="text-slate-300">CNPJ</TableHead>
                      <TableHead className="text-slate-300">Contato</TableHead>
                      <TableHead className="text-slate-300">Frota</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300 text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.length > 0 ? (
                      currentItems.map((transportadora) => (
                        <TableRow key={transportadora.id} className="border-slate-700 hover:bg-slate-800/50">
                          <TableCell>
                            <div>
                              <p className="text-white font-medium">{transportadora.name}</p>
                              <p className="text-slate-400 text-sm flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {transportadora.address}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-slate-300 font-mono text-sm">{transportadora.cnpj}</p>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-slate-300 text-sm flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {transportadora.phone}
                              </p>
                              <p className="text-slate-300 text-sm flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {transportadora.email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-slate-300 text-sm">
                                {transportadora.totalVeiculos} veículos
                              </p>
                              <p className="text-slate-400 text-xs">
                                {transportadora.totalMotoristas} motoristas
                              </p>
                              <p className="text-slate-400 text-xs">
                                {transportadora.totalFiliais} filiais
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(transportadora.status, transportadora.isActive)}
                          </TableCell>
                          <TableCell className="text-right">
                            <TableActions
                              onView={() => {
                                setSelectedTransportadora(transportadora);
                                setIsViewModalOpen(true);
                              }}
                              onEdit={() => {
                                setSelectedTransportadora(transportadora);
                                setIsEditModalOpen(true);
                              }}
                              onDelete={() => {
                                setSelectedTransportadora(transportadora);
                                setIsDeleteModalOpen(true);
                              }}
                              onToggleStatus={() => toggleTransportadoraStatus(transportadora)}
                              isActive={transportadora.isActive}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                          Nenhuma transportadora encontrada
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-slate-400">
                    Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredTransportadoras.length)} de {filteredTransportadoras.length} transportadoras
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="ajh-btn-secondary"
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="ajh-btn-secondary"
                    >
                      Próximo
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <CadastroEmpresaModal
        isOpen={isCadastroModalOpen}
        onClose={() => setIsCadastroModalOpen(false)}
        onSave={handleCadastroTransportadora}
        tipoEmpresa="TRANSPORTADORA"
      />

      {selectedTransportadora && (
        <>
          <EditModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedTransportadora(null);
            }}
            onSave={handleEditTransportadora}
            data={selectedTransportadora}
            title="Editar Transportadora"
            fields={['name', 'cnpj', 'email', 'phone', 'address']}
          />

          <ViewModal
            isOpen={isViewModalOpen}
            onClose={() => {
              setIsViewModalOpen(false);
              setSelectedTransportadora(null);
            }}
            data={selectedTransportadora}
            title="Detalhes da Transportadora"
          />

          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedTransportadora(null);
            }}
            onConfirm={handleDeleteTransportadora}
            title="Excluir Transportadora"
            description={`Tem certeza que deseja excluir a transportadora "${selectedTransportadora.name}"? Esta ação não pode ser desfeita.`}
          />
        </>
      )}
    </div>
  );
};

export default Transportadoras; 