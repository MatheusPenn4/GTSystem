
import React, { useState } from 'react';
import { BarChart3, Download, Calendar, TrendingUp, TrendingDown, Users, Car, ParkingCircle, Building2, CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
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
  const [tipoRelatorio, setTipoRelatorio] = useState<string>('geral');
  const [dataInicio, setDataInicio] = useState<Date>();
  const [dataFim, setDataFim] = useState<Date>();
  const [filtroPersonalizado, setFiltroPersonalizado] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Mock data para gráficos - específicos por tipo de usuário
  const getDataForRole = () => {
    if (user?.role === 'transportadora') {
      return {
        ocupacaoData: [
          { name: 'Seg', reservas: 2, gastos: 150 },
          { name: 'Ter', reservas: 3, gastos: 225 },
          { name: 'Qua', reservas: 1, gastos: 75 },
          { name: 'Qui', reservas: 4, gastos: 300 },
          { name: 'Sex', reservas: 5, gastos: 375 },
          { name: 'Sáb', reservas: 1, gastos: 75 },
          { name: 'Dom', reservas: 0, gastos: 0 },
        ],
        rotatividade: [
          { mes: 'Jan', reservas: 45, gastos: 3375 },
          { mes: 'Fev', reservas: 52, gastos: 3900 },
          { mes: 'Mar', reservas: 48, gastos: 3600 },
          { mes: 'Abr', reservas: 61, gastos: 4575 },
          { mes: 'Mai', reservas: 58, gastos: 4350 },
          { mes: 'Jun', reservas: 65, gastos: 4875 },
        ]
      };
    } else if (user?.role === 'estacionamento') {
      return {
        ocupacaoData: [
          { name: 'Seg', ocupacao: 65, receita: 1950 },
          { name: 'Ter', ocupacao: 72, receita: 2160 },
          { name: 'Qua', ocupacao: 68, receita: 2040 },
          { name: 'Qui', ocupacao: 85, receita: 2550 },
          { name: 'Sex', ocupacao: 92, receita: 2760 },
          { name: 'Sáb', ocupacao: 45, receita: 1350 },
          { name: 'Dom', ocupacao: 35, receita: 1050 },
        ],
        rotatividade: [
          { mes: 'Jan', entradas: 450, receita: 13500 },
          { mes: 'Fev', entradas: 520, receita: 15600 },
          { mes: 'Mar', entradas: 480, receita: 14400 },
          { mes: 'Abr', entradas: 610, receita: 18300 },
          { mes: 'Mai', entradas: 580, receita: 17400 },
          { mes: 'Jun', entradas: 650, receita: 19500 },
        ]
      };
    } else {
      return {
        ocupacaoData: [
          { name: 'Seg', ocupacao: 65, total: 100 },
          { name: 'Ter', ocupacao: 72, total: 100 },
          { name: 'Qua', ocupacao: 68, total: 100 },
          { name: 'Qui', ocupacao: 85, total: 100 },
          { name: 'Sex', ocupacao: 92, total: 100 },
          { name: 'Sáb', ocupacao: 45, total: 100 },
          { name: 'Dom', ocupacao: 35, total: 100 },
        ],
        rotatividade: [
          { mes: 'Jan', entradas: 450, saidas: 445 },
          { mes: 'Fev', entradas: 520, saidas: 515 },
          { mes: 'Mar', entradas: 480, saidas: 475 },
          { mes: 'Abr', entradas: 610, saidas: 605 },
          { mes: 'Mai', entradas: 580, saidas: 572 },
          { mes: 'Jun', entradas: 650, saidas: 648 },
        ]
      };
    }
  };

  const data = getDataForRole();

  const getMetricasForRole = () => {
    if (user?.role === 'transportadora') {
      return [
        {
          titulo: 'Reservas do Mês',
          valor: '23',
          variacao: '+15%',
          tipo: 'positiva',
          icon: Calendar,
          descricao: 'vs. mês anterior'
        },
        {
          titulo: 'Gastos Médios',
          valor: 'R$ 85',
          variacao: '-R$ 12',
          tipo: 'positiva',
          icon: TrendingDown,
          descricao: 'por reserva'
        },
        {
          titulo: 'Tempo Médio',
          valor: '3.5h',
          variacao: '+20min',
          tipo: 'negativa',
          icon: BarChart3,
          descricao: 'de estacionamento'
        },
        {
          titulo: 'Estacionamentos',
          valor: '8',
          variacao: '+2',
          tipo: 'positiva',
          icon: Building2,
          descricao: 'utilizados'
        }
      ];
    } else if (user?.role === 'estacionamento') {
      return [
        {
          titulo: 'Ocupação Média',
          valor: '68%',
          variacao: '+5.2%',
          tipo: 'positiva',
          icon: ParkingCircle,
          descricao: 'vs. mês anterior'
        },
        {
          titulo: 'Receita Média',
          valor: 'R$ 287',
          variacao: '+12%',
          tipo: 'positiva',
          icon: TrendingUp,
          descricao: 'por dia'
        },
        {
          titulo: 'Rotatividade',
          valor: '2.8x',
          variacao: '+0.3x',
          tipo: 'positiva',
          icon: BarChart3,
          descricao: 'vagas por dia'
        },
        {
          titulo: 'Pico de Uso',
          valor: '14:30',
          variacao: '95%',
          tipo: 'neutra',
          icon: Calendar,
          descricao: 'ocupação máxima'
        }
      ];
    } else {
      return [
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
    }
  };

  const metricas = getMetricasForRole();

  const handleDownloadRelatorio = (tipo: string) => {
    const periodo = filtroPersonalizado ? 
      `${dataInicio ? format(dataInicio, 'dd/MM/yyyy') : ''} - ${dataFim ? format(dataFim, 'dd/MM/yyyy') : ''}` :
      periodo;
    
    toast({
      title: "Relatório Baixado",
      description: `Relatório de ${tipo} para o período ${periodo} foi baixado com sucesso.`,
    });
  };

  const getTiposRelatorioForRole = () => {
    if (user?.role === 'transportadora') {
      return [
        { key: 'geral', label: 'Minhas Atividades', icon: BarChart3 },
        { key: 'reservas', label: 'Reservas', icon: Calendar },
        { key: 'gastos', label: 'Gastos', icon: TrendingDown }
      ];
    } else if (user?.role === 'estacionamento') {
      return [
        { key: 'geral', label: 'Ocupação', icon: ParkingCircle },
        { key: 'receita', label: 'Receita', icon: TrendingUp },
        { key: 'reservas', label: 'Reservas', icon: Calendar }
      ];
    } else {
      return [
        { key: 'geral', label: 'Geral', icon: BarChart3 },
        { key: 'transportadoras', label: 'Transportadoras', icon: Building2 },
        { key: 'estacionamentos', label: 'Estacionamentos', icon: ParkingCircle }
      ];
    }
  };

  const tiposRelatorio = getTiposRelatorioForRole();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Relatórios</h1>
          <p className="text-slate-400">
            {user?.role === 'transportadora' ? 'Análise das suas atividades e gastos' :
             user?.role === 'estacionamento' ? 'Análise de ocupação e receita' :
             'Análise e estatísticas do sistema de estacionamento'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filtroPersonalizado ? 'default' : 'outline'}
            onClick={() => setFiltroPersonalizado(!filtroPersonalizado)}
            className={filtroPersonalizado ? 'ajh-button-primary' : 'ajh-button-secondary'}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Filtro Personalizado
          </Button>
          <Button 
            className="ajh-button-primary"
            onClick={() => handleDownloadRelatorio('geral')}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="ajh-card">
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Tipo de Relatório */}
            <div className="flex gap-2 flex-wrap">
              <span className="text-slate-300 font-medium mr-4">Tipo de Relatório:</span>
              {tiposRelatorio.map(tipo => {
                const Icon = tipo.icon;
                return (
                  <Button
                    key={tipo.key}
                    variant={tipoRelatorio === tipo.key ? 'default' : 'outline'}
                    onClick={() => setTipoRelatorio(tipo.key)}
                    className={tipoRelatorio === tipo.key ? 'ajh-button-primary' : 'ajh-button-secondary'}
                    size="sm"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tipo.label}
                  </Button>
                );
              })}
            </div>

            {/* Filtro de Período */}
            {filtroPersonalizado ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Data Início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "ajh-input justify-start text-left font-normal",
                          !dataInicio && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataInicio ? format(dataInicio, "dd/MM/yyyy") : "Selecione a data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={dataInicio}
                        onSelect={setDataInicio}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Data Fim</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "ajh-input justify-start text-left font-normal",
                          !dataFim && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataFim ? format(dataFim, "dd/MM/yyyy") : "Selecione a data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={dataFim}
                        onSelect={setDataFim}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            ) : (
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
            )}
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
        {/* Gráfico Principal */}
        <Card className="ajh-card">
          <CardHeader>
            <CardTitle className="text-white">
              {user?.role === 'transportadora' ? 'Reservas e Gastos por Dia' :
               user?.role === 'estacionamento' ? 'Ocupação e Receita por Dia' :
               'Ocupação por Dia da Semana'}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {user?.role === 'transportadora' ? 'Análise das suas atividades' :
               user?.role === 'estacionamento' ? 'Performance do estacionamento' :
               'Percentual de ocupação média'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.ocupacaoData}>
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
                <Bar 
                  dataKey={user?.role === 'transportadora' ? 'reservas' : 
                          user?.role === 'estacionamento' ? 'ocupacao' : 'ocupacao'} 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico Secundário */}
        <Card className="ajh-card">
          <CardHeader>
            <CardTitle className="text-white">
              {user?.role === 'transportadora' ? 'Evolução Mensal' :
               user?.role === 'estacionamento' ? 'Evolução da Receita' :
               'Rotatividade Mensal'}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {user?.role === 'transportadora' ? 'Reservas e gastos por mês' :
               user?.role === 'estacionamento' ? 'Entradas e receita por mês' :
               'Entradas e saídas por mês'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.rotatividade}>
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
                <Line 
                  type="monotone" 
                  dataKey={user?.role === 'transportadora' ? 'reservas' :
                          user?.role === 'estacionamento' ? 'entradas' : 'entradas'} 
                  stroke="#06B6D4" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey={user?.role === 'transportadora' ? 'gastos' :
                          user?.role === 'estacionamento' ? 'receita' : 'saidas'} 
                  stroke="#8B5CF6" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Relatorios;
