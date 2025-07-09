import React, { useState, useEffect } from 'react';
import { Plus, Search, Users, UserCheck, UserX, Edit, Trash2, Eye } from 'lucide-react';
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
import CadastroUsuarioModal from '@/components/modals/CadastroUsuarioModal';
import EditUsuarioModal from '@/components/modals/EditUsuarioModal';
import ViewUsuarioModal from '@/components/modals/ViewUsuarioModal';
import DeleteModal from '@/components/modals/DeleteModal';
import UserService, { User } from '@/services/users';

const Usuarios: React.FC = () => {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Modal states
  const [isCadastroModalOpen, setIsCadastroModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<User | null>(null);

  useEffect(() => {
    loadUsuarios();
  }, []);

  useEffect(() => {
    filterUsuarios();
  }, [usuarios, searchTerm, roleFilter, statusFilter]);

  const loadUsuarios = async () => {
    try {
      setIsLoading(true);
      console.log('Carregando usuários reais do banco de dados...');
      
      const usuariosFromAPI = await UserService.getAll();
      setUsuarios(usuariosFromAPI);
      console.log('Usuários carregados com sucesso:', usuariosFromAPI.length);
      
      toast({
        title: "Usuários carregados",
        description: `${usuariosFromAPI.length} usuários encontrados no banco de dados.`,
      });
    } catch (error: any) {
      console.error('Erro ao carregar usuários:', error);
      
      // Limpar lista se houver erro
      setUsuarios([]);
      
      toast({
        title: "Erro ao carregar usuários",
        description: error.message || "Não foi possível carregar a lista de usuários do banco de dados.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsuarios = () => {
    let filtered = usuarios.filter(usuario => {
      const matchesSearch = 
        usuario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (usuario.companyName && usuario.companyName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesRole = roleFilter === 'all' || usuario.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && usuario.isActive) ||
        (statusFilter === 'inactive' && !usuario.isActive) ||
        (statusFilter === 'verified' && usuario.emailVerified === true) ||
        (statusFilter === 'unverified' && usuario.emailVerified !== true);

      return matchesSearch && matchesRole && matchesStatus;
    });

    setFilteredUsuarios(filtered);
    setCurrentPage(1);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive">Administrador</Badge>;
      case 'transportadora':
        return <Badge variant="default">Transportadora</Badge>;
      case 'estacionamento':
        return <Badge variant="secondary">Estacionamento</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getStatusBadge = (isActive: boolean, emailVerified?: boolean) => {
    if (!isActive) {
      return <Badge variant="destructive">Inativo</Badge>;
    }
    if (emailVerified !== true) {
      return <Badge variant="outline">Email não verificado</Badge>;
    }
    return <Badge variant="default" className="bg-green-600">Ativo</Badge>;
  };

  const handleCadastroUsuario = async (userData: any) => {
    try {
      console.log('Criando usuário no backend...', userData);
      
      const novoUsuario = await UserService.create({
        name: userData.name,
        email: userData.email,
        role: userData.role,
        companyId: userData.companyId,
        password: userData.password, // Password vem do modal
      });
      
      console.log('Usuário criado com sucesso:', novoUsuario);
      
      // Atualizar lista local
      setUsuarios(prev => [...prev, novoUsuario]);
      setIsCadastroModalOpen(false);
      
      toast({
        title: "Usuário criado",
        description: `${userData.name} foi criado com sucesso no banco de dados.`,
      });
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      toast({
        title: "Erro ao criar usuário",
        description: error.message || "Não foi possível criar o usuário.",
        variant: "destructive",
      });
    }
  };

  const handleEditUsuario = async (userData: any) => {
    try {
      if (!selectedUsuario) return;
      
      console.log('Atualizando usuário no backend...', userData);
      
      const usuarioAtualizado = await UserService.update(selectedUsuario.id, userData);
      
      console.log('Usuário atualizado com sucesso:', usuarioAtualizado);
      
      // Atualizar lista local
      setUsuarios(prev => prev.map(usuario => 
        usuario.id === selectedUsuario.id ? usuarioAtualizado : usuario
      ));
      
      setIsEditModalOpen(false);
      setSelectedUsuario(null);
      
      toast({
        title: "Usuário atualizado",
        description: "Os dados foram salvos no banco de dados.",
      });
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      toast({
        title: "Erro ao atualizar usuário",
        description: error.message || "Não foi possível atualizar o usuário.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUsuario = async () => {
    try {
      if (!selectedUsuario) return;
      
      console.log('Excluindo usuário do backend...', selectedUsuario.id);
      
      await UserService.delete(selectedUsuario.id);
      
      console.log('Usuário excluído com sucesso');
      
      // Remover da lista local
      setUsuarios(prev => prev.filter(usuario => usuario.id !== selectedUsuario.id));
      
      setIsDeleteModalOpen(false);
      setSelectedUsuario(null);
      
      toast({
        title: "Usuário excluído",
        description: "O usuário foi removido do banco de dados.",
      });
    } catch (error: any) {
      console.error('Erro ao excluir usuário:', error);
      toast({
        title: "Erro ao excluir usuário",
        description: error.message || "Não foi possível excluir o usuário.",
        variant: "destructive",
      });
    }
  };

  const toggleUserStatus = async (usuario: User) => {
    try {
      console.log('Alterando status do usuário no backend...', usuario.id);
      
      const newStatus = !usuario.isActive;
      await UserService.changeStatus(usuario.id, newStatus);
      
      console.log('Status alterado com sucesso');
      
      // Atualizar lista local
      setUsuarios(prev => prev.map(u => 
        u.id === usuario.id ? { ...u, isActive: newStatus } : u
      ));
      
      toast({
        title: newStatus ? "Usuário ativado" : "Usuário desativado",
        description: `${usuario.name} foi ${newStatus ? 'ativado' : 'desativado'} no banco de dados.`,
      });
    } catch (error: any) {
      console.error('Erro ao alterar status do usuário:', error);
      toast({
        title: "Erro ao alterar status",
        description: error.message || "Não foi possível alterar o status do usuário.",
        variant: "destructive",
      });
    }
  };

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsuarios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-ajh-darker flex items-center justify-center">
        <div className="glass-effect p-8 rounded-xl text-center">
          <Users className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Acesso Negado</h2>
          <p className="text-slate-400">Apenas administradores podem acessar a gestão de usuários.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestão de Usuários</h1>
          <p className="text-slate-400">Gerencie usuários do sistema e suas permissões</p>
        </div>
        <Button 
          onClick={() => setIsCadastroModalOpen(true)}
          className="ajh-btn ajh-btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="ajh-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total de Usuários</p>
                <p className="text-2xl font-bold text-white">{usuarios.length}</p>
              </div>
              <Users className="h-8 w-8 text-ajh-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Usuários Ativos</p>
                <p className="text-2xl font-bold text-green-400">
                  {usuarios.filter(u => u.isActive).length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Usuários Inativos</p>
                <p className="text-2xl font-bold text-red-400">
                  {usuarios.filter(u => !u.isActive).length}
                </p>
              </div>
              <UserX className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Email não verificado</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {usuarios.filter(u => u.emailVerified !== true).length}
                </p>
              </div>
              <Users className="h-8 w-8 text-yellow-400" />
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Pesquisar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 ajh-input"
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="ajh-input">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="transportadora">Transportadora</SelectItem>
                <SelectItem value="estacionamento">Estacionamento</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="ajh-input">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
                <SelectItem value="verified">Email verificado</SelectItem>
                <SelectItem value="unverified">Email não verificado</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('all');
                setStatusFilter('all');
              }}
              className="ajh-btn-secondary"
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="ajh-card">
        <CardHeader>
          <CardTitle className="text-white">
            Usuários ({filteredUsuarios.length})
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
                      <TableHead className="text-slate-300">Usuário</TableHead>
                      <TableHead className="text-slate-300">Tipo</TableHead>
                      <TableHead className="text-slate-300">Empresa</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Último Login</TableHead>
                      <TableHead className="text-slate-300 text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.length > 0 ? (
                      currentItems.map((usuario) => (
                        <TableRow key={usuario.id} className="border-slate-700 hover:bg-slate-800/50">
                          <TableCell>
                            <div>
                              <p className="text-white font-medium">{usuario.name}</p>
                              <p className="text-slate-400 text-sm">{usuario.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getRoleBadge(usuario.role)}
                          </TableCell>
                          <TableCell>
                            <p className="text-slate-300 text-sm">
                              {usuario.companyName || 'N/A'}
                            </p>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(usuario.isActive, usuario.emailVerified)}
                          </TableCell>
                          <TableCell>
                            <p className="text-slate-300 text-sm">
                              {usuario.lastLogin 
                                ? new Date(usuario.lastLogin).toLocaleDateString('pt-BR')
                                : 'Nunca'
                              }
                            </p>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedUsuario(usuario);
                                  setIsViewModalOpen(true);
                                }}
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedUsuario(usuario);
                                  setIsEditModalOpen(true);
                                }}
                                className="text-green-400 hover:text-green-300 hover:bg-green-400/10"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleUserStatus(usuario)}
                                className={`${usuario.isActive 
                                  ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10' 
                                  : 'text-green-400 hover:text-green-300 hover:bg-green-400/10'
                                }`}
                              >
                                {usuario.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedUsuario(usuario);
                                  setIsDeleteModalOpen(true);
                                }}
                                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                          Nenhum usuário encontrado
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
                    Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredUsuarios.length)} de {filteredUsuarios.length} usuários
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
      <CadastroUsuarioModal
        isOpen={isCadastroModalOpen}
        onClose={() => setIsCadastroModalOpen(false)}
        onSave={handleCadastroUsuario}
      />

      {selectedUsuario && (
        <>
          <EditUsuarioModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedUsuario(null);
            }}
            onSave={handleEditUsuario}
            usuario={selectedUsuario}
          />

          <ViewUsuarioModal
            isOpen={isViewModalOpen}
            onClose={() => {
              setIsViewModalOpen(false);
              setSelectedUsuario(null);
            }}
            usuario={selectedUsuario}
          />

          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedUsuario(null);
            }}
            onConfirm={handleDeleteUsuario}
            title="Excluir Usuário"
            description={`Tem certeza que deseja excluir o usuário "${selectedUsuario.name}"? Esta ação não pode ser desfeita.`}
          />
        </>
      )}
    </div>
  );
};

export default Usuarios; 