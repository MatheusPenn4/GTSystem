
import React, { useState } from 'react';
import { MapPin, Plus, Edit, Building2, Users, Car, Clock, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CadastroEstacionamentoModal from '@/components/modals/CadastroEstacionamentoModal';

const MeuEstacionamento: React.FC = () => {
  const [modalCadastroOpen, setModalCadastroOpen] = useState(false);

  // Mock data para unidades da rede
  const unidadesRede = [
    {
      id: 1,
      nome: 'Estacionamento Central - Unidade Principal',
      endereco: 'Rua das Flores, 123 - Centro, São Paulo/SP',
      vagas: 120,
      vagasOcupadas: 67,
      horarioFuncionamento: '24h',
      telefone: '(11) 3333-3333',
      status: 'Ativo',
      tipo: 'Principal'
    },
    {
      id: 2,
      nome: 'Estacionamento Central - Shopping Norte',
      endereco: 'Av. Shopping Norte, 456 - Zona Norte, São Paulo/SP',
      vagas: 80,
      vagasOcupadas: 45,
      horarioFuncionamento: '06:00 - 22:00',
      telefone: '(11) 3333-3334',
      status: 'Ativo',
      tipo: 'Filial'
    },
    {
      id: 3,
      nome: 'Estacionamento Central - Aeroporto',
      endereco: 'Terminal 2, Aeroporto Internacional - Guarulhos/SP',
      vagas: 200,
      vagasOcupadas: 156,
      horarioFuncionamento: '24h',
      telefone: '(11) 3333-3335',
      status: 'Ativo',
      tipo: 'Filial'
    }
  ];

  const estatisticasRede = [
    {
      titulo: 'Total de Unidades',
      valor: '3',
      descricao: 'estacionamentos ativos',
      icon: Building2,
      cor: 'text-ajh-primary'
    },
    {
      titulo: 'Vagas Totais',
      valor: '400',
      descricao: 'em toda a rede',
      icon: Car,
      cor: 'text-ajh-secondary'
    },
    {
      titulo: 'Ocupação Geral',
      valor: '67%',
      descricao: '268 vagas ocupadas',
      icon: Users,
      cor: 'text-ajh-accent'
    },
    {
      titulo: 'Receita Mensal',
      valor: 'R$ 24.750',
      descricao: 'todas as unidades',
      icon: Clock,
      cor: 'text-ajh-success'
    }
  ];

  const handleCadastroEstacionamento = (data: any) => {
    console.log('Cadastrando nova unidade:', data);
    // Aqui você implementaria a lógica de cadastramento
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
        {estatisticasRede.map((stat, index) => {
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
        
        {unidadesRede.map((unidade) => (
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
                        <div className="w-full bg-slate-700 rounded-full h-2 mt-1">
                          <div 
                            className="bg-gradient-to-r from-ajh-primary to-ajh-secondary h-2 rounded-full"
                            style={{ width: `${(unidade.vagasOcupadas / unidade.vagas) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Funcionamento</p>
                        <p className="text-white font-medium">{unidade.horarioFuncionamento}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Contato</p>
                        <p className="text-white font-medium">{unidade.telefone}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    className={unidade.status === 'Ativo' 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }
                  >
                    {unidade.status}
                  </Badge>
                  <Button size="sm" className="ajh-button-secondary">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button size="sm" className="ajh-button-primary">
                    <Settings className="w-4 h-4 mr-2" />
                    Gerenciar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Informações Adicionais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="ajh-card">
          <CardHeader>
            <CardTitle className="text-white">Configurações da Rede</CardTitle>
            <CardDescription className="text-slate-400">
              Configurações globais para todas as unidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome-rede" className="text-slate-300">Nome da Rede</Label>
              <Input
                id="nome-rede"
                value="Estacionamento Central"
                className="ajh-input"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsavel" className="text-slate-300">Responsável Geral</Label>
              <Input
                id="responsavel"
                value="José Santos"
                className="ajh-input"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-rede" className="text-slate-300">Email Corporativo</Label>
              <Input
                id="email-rede"
                value="admin@estacionamentocentral.com"
                className="ajh-input"
                readOnly
              />
            </div>
            <Button className="ajh-button-secondary w-full">
              <Settings className="w-4 h-4 mr-2" />
              Editar Configurações
            </Button>
          </CardContent>
        </Card>

        <Card className="ajh-card">
          <CardHeader>
            <CardTitle className="text-white">Resumo Operacional</CardTitle>
            <CardDescription className="text-slate-400">
              Status geral de todas as unidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Unidades Ativas</span>
              <Badge className="bg-green-500/20 text-green-400">3/3</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Taxa de Ocupação Média</span>
              <Badge className="bg-blue-500/20 text-blue-400">67%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Reservas Pendentes</span>
              <Badge className="bg-yellow-500/20 text-yellow-400">12</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Faturamento do Mês</span>
              <Badge className="bg-green-500/20 text-green-400">R$ 24.750</Badge>
            </div>
            <div className="pt-4 border-t border-slate-700">
              <Button className="ajh-button-primary w-full">
                <Building2 className="w-4 h-4 mr-2" />
                Relatório Completo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Cadastro */}
      <CadastroEstacionamentoModal
        isOpen={modalCadastroOpen}
        onClose={() => setModalCadastroOpen(false)}
        onSave={handleCadastroEstacionamento}
      />
    </div>
  );
};

export default MeuEstacionamento;
