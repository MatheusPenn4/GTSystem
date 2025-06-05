
import React, { useState } from 'react';
import { Calendar, Download, Filter, FileText, Building2, Truck, BarChart3, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import DateRangeFilter from '@/components/DateRangeFilter';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const Relatorios: React.FC = () => {
  const { user } = useAuth();
  const [tipoRelatorio, setTipoRelatorio] = useState('geral');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [filtroPersonalizado, setFiltroPersonalizado] = useState(false);

  // Mock data
  const faturamentoMensal = [
    { mes: 'Jan', valor: 45600 },
    { mes: 'Fev', valor: 52300 },
    { mes: 'Mar', valor: 48900 },
    { mes: 'Abr', valor: 61200 },
    { mes: 'Mai', valor: 58700 },
    { mes: 'Jun', valor: 64800 }
  ];

  const ocupacaoDados = [
    { dia: 'Seg', ocupacao: 85 },
    { dia: 'Ter', ocupacao: 92 },
    { dia: 'Qua', ocupacao: 78 },
    { dia: 'Qui', ocupacao: 88 },
    { dia: 'Sex', ocupacao: 95 },
    { dia: 'Sab', ocupacao: 72 },
    { dia: 'Dom', ocupacao: 65 }
  ];

  const distribuicaoVeiculos = [
    { tipo: 'Carretas', valor: 156, cor: '#8B5CF6' },
    { tipo: 'Caminhões', valor: 89, cor: '#06B6D4' },
    { tipo: 'Van', valor: 45, cor: '#10B981' },
    { tipo: 'Outros', valor: 23, cor: '#F59E0B' }
  ];

  const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];

  const exportarRelatorio = (formato: string, tipo: string) => {
    let periodo = '';
    if (filtroPersonalizado && dataInicio && dataFim) {
      periodo = ` (${dataInicio} a ${dataFim})`;
    }
    console.log(`Exportando relatório ${tipo} em formato ${formato}${periodo}`);
  };

  const getStatsForRole = () => {
    if (user?.role === 'transportadora') {
      return [
        { titulo: 'Veículos Ativos', valor: '12', mudanca: '+2', icon: Truck, cor: 'text-blue-400' },
        { titulo: 'Gasto Mensal', valor: 'R$ 14.400', mudanca: '-5%', icon: BarChart3, cor: 'text-green-400' },
        { titulo: 'Reservas Ativas', valor: '8', mudanca: '+3', icon: Calendar, cor: 'text-purple-400' },
        { titulo: 'Economia', valor: 'R$ 1.200', mudanca: '+8%', icon: TrendingUp, cor: 'text-yellow-400' }
      ];
    }
    
    if (user?.role === 'estacionamento') {
      return [
        { titulo: 'Receita Mensal', valor: 'R$ 86.400', mudanca: '+12%', icon: BarChart3, cor: 'text-green-400' },
        { titulo: 'Taxa Ocupação', valor: '78%', mudanca: '+5%', icon: Building2, cor: 'text-blue-400' },
        { titulo: 'Reservas Hoje', valor: '45', mudanca: '+8', icon: Calendar, cor: 'text-purple-400' },
        { titulo: 'Vagas Disponíveis', valor: '23', mudanca: '-12', icon: Truck, cor: 'text-yellow-400' }
      ];
    }

    return [
      { titulo: 'Receita Total', valor: 'R$ 245.600', mudanca: '+15%', icon: BarChart3, cor: 'text-green-400' },
      { titulo: 'Empresas Ativas', valor: '24', mudanca: '+3', icon: Building2, cor: 'text-blue-400' },
      { titulo: 'Veículos Total', valor: '313', mudanca: '+18', icon: Truck, cor: 'text-purple-400' },
      { titulo: 'Motoristas', valor: '189', mudanca: '+12', icon: Users, cor: 'text-yellow-400' }
    ];
  };

  const stats = getStatsForRole();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Relatórios e Analytics</h1>
          <p className="text-slate-400">
            {user?.role === 'transportadora' 
              ? 'Análises da sua transportadora'
              : user?.role === 'estacionamento'
              ? 'Análises do seu estacionamento'
              : 'Análises gerais do sistema'
            }
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setFiltroPersonalizado(!filtroPersonalizado)}
            className="ajh-button-secondary"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros Personalizados
          </Button>
          <Button 
            onClick={() => exportarRelatorio('pdf', 'completo')}
            className="ajh-button-primary"
          >
            <FileText className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
          <Button 
            onClick={() => exportarRelatorio('excel', 'completo')}
            className="ajh-button-secondary"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* Filtros de Data */}
      <DateRangeFilter
        startDate={dataInicio}
        endDate={dataFim}
        onStartDateChange={setDataInicio}
        onEndDateChange={setDataFim}
        isVisible={filtroPersonalizado}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="ajh-card hover-scale">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-slate-400 text-sm font-medium">{stat.titulo}</p>
                    <p className="text-2xl font-bold text-white">{stat.valor}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-slate-700 text-white">
                        {stat.mudanca}
                      </Badge>
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    </div>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <Icon className={`w-6 h-6 ${stat.cor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Faturamento Chart */}
        <Card className="ajh-card">
          <CardHeader>
            <CardTitle className="text-white">
              {user?.role === 'transportadora' ? 'Gastos Mensais' : 'Faturamento Mensal'}
            </CardTitle>
            <CardDescription className="text-slate-400">
              Evolução nos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={faturamentoMensal}>
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
                <Bar dataKey="valor" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ocupação Chart */}
        <Card className="ajh-card">
          <CardHeader>
            <CardTitle className="text-white">
              {user?.role === 'estacionamento' ? 'Taxa de Ocupação' : 'Utilização de Vagas'}
            </CardTitle>
            <CardDescription className="text-slate-400">
              Ocupação por dia da semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ocupacaoDados}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="dia" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="ocupacao" 
                  stroke="#06B6D4" 
                  strokeWidth={3}
                  dot={{ fill: '#06B6D4', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Distribuição de Veículos */}
        <Card className="ajh-card">
          <CardHeader>
            <CardTitle className="text-white">Distribuição de Veículos</CardTitle>
            <CardDescription className="text-slate-400">
              Por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={distribuicaoVeiculos}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="valor"
                >
                  {distribuicaoVeiculos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
            <div className="mt-4 space-y-2">
              {distribuicaoVeiculos.map((item, index) => (
                <div key={item.tipo} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-slate-300 text-sm">{item.tipo}</span>
                  </div>
                  <Badge variant="secondary" className="bg-slate-700 text-white">
                    {item.valor}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Mensal */}
        <Card className="ajh-card xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Performance Detalhada</CardTitle>
            <CardDescription className="text-slate-400">
              Métricas principais do mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {user?.role === 'estacionamento' ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Receita Total</span>
                    <div className="text-right">
                      <p className="text-white font-semibold">R$ 86.400</p>
                      <p className="text-green-400 text-sm">+12% vs mês anterior</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Diárias Vendidas</span>
                    <div className="text-right">
                      <p className="text-white font-semibold">720</p>
                      <p className="text-blue-400 text-sm">R$ 120 por diária</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Taxa de Ocupação Média</span>
                    <div className="text-right">
                      <p className="text-white font-semibold">78%</p>
                      <p className="text-purple-400 text-sm">+5% vs mês anterior</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Gasto Total</span>
                    <div className="text-right">
                      <p className="text-white font-semibold">R$ 14.400</p>
                      <p className="text-green-400 text-sm">-5% vs mês anterior</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Diárias Utilizadas</span>
                    <div className="text-right">
                      <p className="text-white font-semibold">120</p>
                      <p className="text-blue-400 text-sm">R$ 120 por diária</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Economia Obtida</span>
                    <div className="text-right">
                      <p className="text-white font-semibold">R$ 1.200</p>
                      <p className="text-purple-400 text-sm">vs estacionamento público</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Relatorios;
