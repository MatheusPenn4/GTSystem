
import React, { useState } from 'react';
import { Building2, MapPin, Users, Car, Edit, Phone, Mail, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import EditModal from '@/components/modals/EditModal';

interface EstacionamentoInfo {
  id: string;
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  totalVagas: number;
  vagasDisponiveis: number;
  valorHora: number;
  telefone: string;
  email: string;
  responsavel: string;
  status: 'ativo' | 'inativo' | 'manutencao';
  horarioFuncionamento: string;
  dataCredenciamento: string;
  observacoes?: string;
}

const MeuEstacionamento: React.FC = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { toast } = useToast();

  // Mock data - informações do estacionamento logado
  const estacionamento: EstacionamentoInfo = {
    id: 'park-001',
    nome: 'Estacionamento Central',
    endereco: 'Rua das Flores, 123, Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567',
    totalVagas: 50,
    vagasDisponiveis: 12,
    valorHora: 8.50,
    telefone: '(11) 9999-8888',
    email: 'contato@central.com',
    responsavel: 'João Silva',
    status: 'ativo',
    horarioFuncionamento: '06:00 - 22:00',
    dataCredenciamento: '2024-01-15',
    observacoes: 'Estacionamento com cobertura e sistema de monitoramento 24h'
  };

  const getStatusBadge = (status: EstacionamentoInfo['status']) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ativo</Badge>;
      case 'inativo':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Inativo</Badge>;
      case 'manutencao':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Manutenção</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const handleSave = (data: Record<string, any>) => {
    console.log('Salvando informações do estacionamento:', data);
    toast({
      title: "Informações Atualizadas",
      description: "As informações do estacionamento foram atualizadas com sucesso.",
    });
  };

  const ocupacaoPercentual = Math.round(((estacionamento.totalVagas - estacionamento.vagasDisponiveis) / estacionamento.totalVagas) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Meu Estacionamento</h1>
          <p className="text-slate-400">Gerencie as informações do seu estacionamento</p>
        </div>
        <Button 
          className="ajh-button-primary"
          onClick={() => setEditModalOpen(true)}
        >
          <Edit className="w-4 h-4 mr-2" />
          Editar Informações
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="ajh-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Car className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Total Vagas</p>
                <p className="text-xl font-bold text-white">{estacionamento.totalVagas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Disponíveis</p>
                <p className="text-xl font-bold text-white">{estacionamento.vagasDisponiveis}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <MapPin className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Ocupação</p>
                <p className="text-xl font-bold text-white">{ocupacaoPercentual}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Building2 className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Valor/Hora</p>
                <p className="text-xl font-bold text-white">R$ {estacionamento.valorHora.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Occupancy Bar */}
      <Card className="ajh-card">
        <CardHeader>
          <CardTitle className="text-white">Ocupação Atual</CardTitle>
          <CardDescription className="text-slate-400">
            {estacionamento.totalVagas - estacionamento.vagasDisponiveis} de {estacionamento.totalVagas} vagas ocupadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-slate-700 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-ajh-primary to-ajh-secondary h-4 rounded-full transition-all duration-500"
              style={{ width: `${ocupacaoPercentual}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="ajh-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Nome:</span>
              <span className="text-white font-medium">{estacionamento.nome}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Responsável:</span>
              <span className="text-white">{estacionamento.responsavel}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Status:</span>
              {getStatusBadge(estacionamento.status)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Credenciado em:</span>
              <span className="text-white">{new Date(estacionamento.dataCredenciamento).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-slate-400">Horário:</span>
              <div className="text-right">
                <span className="text-white flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {estacionamento.horarioFuncionamento}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="ajh-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Localização e Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <span className="text-slate-400">Endereço:</span>
              <p className="text-white">{estacionamento.endereco}</p>
              <p className="text-slate-300">{estacionamento.cidade}, {estacionamento.estado} - {estacionamento.cep}</p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Telefone:</span>
              <span className="text-white flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {estacionamento.telefone}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">E-mail:</span>
              <span className="text-white flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {estacionamento.email}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Observations */}
      {estacionamento.observacoes && (
        <Card className="ajh-card">
          <CardHeader>
            <CardTitle className="text-white">Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300">{estacionamento.observacoes}</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Modal */}
      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Editar Informações do Estacionamento"
        data={estacionamento}
        onSave={handleSave}
      />
    </div>
  );
};

export default MeuEstacionamento;
