
import React, { useState } from 'react';
import { Plus, Search, Building2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import TableActions from '@/components/TableActions';
import ViewModal from '@/components/modals/ViewModal';
import EditModal from '@/components/modals/EditModal';
import DeleteModal from '@/components/modals/DeleteModal';

const Empresas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmpresa, setSelectedEmpresa] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Mock data
  const empresas = [
    {
      id: 1,
      nome: 'TechCorp Ltda',
      cnpj: '12.345.678/0001-90',
      email: 'contato@techcorp.com',
      telefone: '(11) 9999-9999',
      endereco: 'Rua das Flores, 123 - São Paulo/SP',
      responsavel: 'João Silva',
      veiculos: 15,
      motoristas: 8,
      status: 'Ativo'
    },
    {
      id: 2,
      nome: 'LogiMaster S.A.',
      cnpj: '98.765.432/0001-10',
      email: 'admin@logimaster.com',
      telefone: '(11) 8888-8888',
      endereco: 'Av. Paulista, 456 - São Paulo/SP',
      responsavel: 'Maria Santos',
      veiculos: 22,
      motoristas: 12,
      status: 'Ativo'
    },
    {
      id: 3,
      nome: 'TransBrasil Express',
      cnpj: '11.222.333/0001-44',
      email: 'contato@transbrasil.com',
      telefone: '(11) 7777-7777',
      endereco: 'Rua do Comércio, 789 - São Paulo/SP',
      responsavel: 'Carlos Oliveira',
      veiculos: 8,
      motoristas: 5,
      status: 'Inativo'
    }
  ];

  const filteredEmpresas = empresas.filter(empresa =>
    empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresa.cnpj.includes(searchTerm) ||
    empresa.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (empresa: any) => {
    setSelectedEmpresa(empresa);
    setViewModalOpen(true);
  };

  const handleEdit = (empresa: any) => {
    setSelectedEmpresa(empresa);
    setEditModalOpen(true);
  };

  const handleDelete = (empresa: any) => {
    setSelectedEmpresa(empresa);
    setDeleteModalOpen(true);
  };

  const handleSave = (data: any) => {
    console.log('Salvando empresa:', data);
    // Aqui você implementaria a lógica de salvamento
  };

  const handleConfirmDelete = () => {
    console.log('Excluindo empresa:', selectedEmpresa);
    // Aqui você implementaria a lógica de exclusão
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Empresas</h1>
          <p className="text-slate-400">Gerenciamento de empresas transportadoras</p>
        </div>
        <Button className="ajh-button-primary">
          <Plus className="w-4 h-4 mr-2" />
          Nova Empresa
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="ajh-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Building2 className="w-8 h-8 text-ajh-primary" />
              <div>
                <p className="text-2xl font-bold text-white">24</p>
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
                <p className="text-2xl font-bold text-white">21</p>
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
                <p className="text-2xl font-bold text-white">3</p>
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
                <p className="text-2xl font-bold text-white">156</p>
                <p className="text-sm text-slate-400">Total Veículos</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-2 text-slate-300 font-medium">Empresa</th>
                  <th className="text-left py-3 px-2 text-slate-300 font-medium">CNPJ</th>
                  <th className="text-left py-3 px-2 text-slate-300 font-medium">Responsável</th>
                  <th className="text-left py-3 px-2 text-slate-300 font-medium">Veículos</th>
                  <th className="text-left py-3 px-2 text-slate-300 font-medium">Status</th>
                  <th className="text-center py-3 px-2 text-slate-300 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmpresas.map((empresa) => (
                  <tr key={empresa.id} className="border-b border-slate-700/50 hover:bg-slate-800/50">
                    <td className="py-4 px-2">
                      <div>
                        <p className="text-white font-medium">{empresa.nome}</p>
                        <p className="text-sm text-slate-400">{empresa.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-slate-300">{empresa.cnpj}</td>
                    <td className="py-4 px-2 text-slate-300">{empresa.responsavel}</td>
                    <td className="py-4 px-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-white">{empresa.veiculos}</span>
                        <span className="text-slate-400">veículos</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <Badge 
                        className={empresa.status === 'Ativo' 
                          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }
                      >
                        {empresa.status}
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
    </div>
  );
};

export default Empresas;
