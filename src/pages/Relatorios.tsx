
import React, { useState } from 'react';
import { BarChart3, Download, Calendar, TrendingUp, TrendingDown, Users, Car, ParkingCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Relatorios: React.FC = () => {
  const [periodo, setPeriodo] = useState<string>('30dias');

  // Mock data para gráficos
  const ocupacaoData = [
    { name: 'Seg', ocupacao: 65, total: 100 },
    { name: 'Ter', ocupacao: 72, total: 100 },
    { name: 'Qua', ocupacao: 68, total: 100 },
    { name: 'Qui', ocupacao: 85, total: 100 },
    { name: 'Sex', ocupacao: 92, total: 100 },
    { name: 'Sáb', ocupacao: 45, total: 100 },
    { name: 'Dom', ocupacao: 35, total: 100 },
  ];

  const empresasData = [
    { name: 'TechCorp', veiculos: 15, cor: '#3B82F6' },
    { name: 'FastDelivery', veiculos: 22, cor: '#06B6D4' },
    { name: 'TransBrasil', veiculos: 8, cor: '#8B5CF6' },
    { name: 'LogiMaster', veiculos: 12, cor: '#10B981' },
  ];

  const rotatividade = [
    { mes: 'Jan', entradas: 450, saidas: 445 },
    { mes: 'Fev', entradas: 520, saidas: 515 },
    { mes: 'Mar', entradas: 480, saidas: 475 },
    { mes: 'Abr', entradas: 610, saidas: 605 },
    { mes: 'Mai', entradas: 580, saidas: 572 },
    { mes: 'Jun', entradas: 650, saidas: 648 },
  ];

  const statusVeiculos = [
    { name: 'Ativos', value: 42, color: '#10B981' },
    { name: 'Inativos', value: 8, color: '#EF4444' },
    { name: 'Manutenção', value: 5, color: '#F59E0B' },
  ];

  const metricas = [
    {
      titulo: 'Ocupação Média',
      valor: '68%',
      variacao: '+5.2%',
      tipo: 'positiva',
      icon: ParkingCircle,
      descricao: 'vs. mês anterior'
    },
    {
      titulo: 'Tempo Médio',
      valor: '4.2h',
      variacao: '-12min',
      tipo: 'positiva',
      icon: Calendar,
      descricao: 'permanência por veículo'
    },
    {
      titulo: 'Rotatividade',
      valor: '2.8x',
      variacao: '+0.3x',
      tipo: 'positiva',
      icon: TrendingUp,
      descricao: 'vagas por dia'
    },
    {
      titulo: 'Pico de Uso',
      valor: '14:30',
      variacao: '95%',
      tipo: 'neutra',
      icon: BarChart3,
      descricao: 'ocupação máxima'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Relatórios</h1>
          <p className="text-slate-400">Análise e estatísticas do sistema de estacionamento</p>
        </div>
        <div className="flex gap-2">
          <Button className="ajh-button-secondary">
            <Calendar className="w-4 h-4 mr-2" />
            Período
          </Button>
          <Button className="ajh-button-primary">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filtros de Período */}
      <Card className="ajh-card">
        <CardContent className="p-4">
          <div className="flex gap-2 flex-wrap">
            {[
              { key: '7dias', label: 'Últimos 7 dias' },
              { key: '30dias', label: 'Últimos 30 dias' },
              { key: '3meses', label: 'Últimos 3 meses' },
              { key: '6meses', label: 'Últimos 6 meses' },
              { key: 'ano', label: 'Este ano' }
            ].map(p => (
              <Button
                key={p.key}
                variant={periodo === p.key ? 'default' : 'outline'}
                onClick={() => setPeriodo(p.key)}
                className={periodo === p.key ? 'ajh-button-primary' : 'ajh-button-secondary'}
                size="sm"
              >
                {p.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {metricas.map((metrica, index) => {
          const Icon = metrica.icon;
          return (
            <Card key={index} className="ajh-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-slate-400 text-sm font-medium">
                      {metrica.titulo}
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {metrica.valor}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="secondary" 
                        className={`
                          ${metrica.tipo === 'positiva' ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}
                          ${metrica.tipo === 'negativa' ? 'bg-red-500/20 text-red-400 border-red-500/30' : ''}
                          ${metrica.tipo === 'neutra' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : ''}
                          border-0
                        `}
                      >
                        {metrica.variacao}
                      </Badge>
                      {metrica.tipo === 'positiva' && (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      )}
                      {metrica.tipo === 'negativa' && (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{metrica.descricao}</p>
                  </div>
                  <div className="p-3 bg-ajh-primary/10 rounded-lg">
                    <Icon className="w-6 h-6 text-ajh-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Ocupação Semanal */}
        <Card className="ajh-card">
          <CardHeader>
            <CardTitle className="text-white">Ocupação por Dia da Semana</CardTitle>
            <CardDescription className="text-slate-400">
              Percentual de ocupação média
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ocupacaoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="ocupacao" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Rotatividade Mensal */}
        <Card className="ajh-card">
          <CardHeader>
            <CardTitle className="text-white">Rotatividade Mensal</CardTitle>
            <CardDescription className="text-slate-400">
              Entradas e saídas por mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={rotatividade}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="mes" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="entradas" stroke="#06B6D4" strokeWidth={2} />
                <Line type="monotone" dataKey="saidas" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Veículos por Empresa */}
        <Card className="ajh-card">
          <CardHeader>
            <CardTitle className="text-white">Veículos por Empresa</CardTitle>
            <CardDescription className="text-slate-400">
              Distribuição de veículos cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={empresasData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis dataKey="name" type="category" stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="veiculos" fill="#06B6D4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status dos Veículos */}
        <Card className="ajh-card">
          <CardHeader>
            <CardTitle className="text-white">Status dos Veículos</CardTitle>
            <CardDescription className="text-slate-400">
              Distribuição por status atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusVeiculos}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="value"
                >
                  {statusVeiculos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {statusVeiculos.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-slate-300">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Relatórios para Download */}
      <Card className="ajh-card">
        <CardHeader>
          <CardTitle className="text-white">Relatórios Disponíveis</CardTitle>
          <CardDescription className="text-slate-400">
            Baixe relatórios detalhados em diferentes formatos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { nome: 'Relatório de Ocupação', descricao: 'Análise detalhada da ocupação do estacionamento', formato: 'PDF' },
              { nome: 'Histórico de Veículos', descricao: 'Lista completa de veículos e movimentações', formato: 'Excel' },
              { nome: 'Faturamento Mensal', descricao: 'Resumo financeiro do período selecionado', formato: 'PDF' },
              { nome: 'Relatório de Empresas', descricao: 'Dados consolidados por empresa cliente', formato: 'Excel' },
              { nome: 'Métricas de Performance', descricao: 'KPIs e indicadores de desempenho', formato: 'PDF' },
              { nome: 'Exportação Completa', descricao: 'Todos os dados do sistema', formato: 'CSV' }
            ].map((relatorio, index) => (
              <div key={index} className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-white font-medium">{relatorio.nome}</h4>
                  <Badge variant="secondary" className="text-xs">{relatorio.formato}</Badge>
                </div>
                <p className="text-slate-400 text-sm mb-4">{relatorio.descricao}</p>
                <Button size="sm" className="ajh-button-secondary w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Relatorios;
