import React, { useState, useEffect } from 'react';
import { Calendar, Download, Filter, FileText, Building2, Truck, BarChart3, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import DateRangeFilter from '@/components/DateRangeFilter';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import ReportsService from '@/services/reports';
import { toast } from '@/hooks/use-toast';

const Relatorios: React.FC = () => {
  const { user } = useAuth();
  const [tipoRelatorio, setTipoRelatorio] = useState('geral');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [filtroPersonalizado, setFiltroPersonalizado] = useState(false);

  // Estado para dados de relatórios reais
  const [faturamentoMensal, setFaturamentoMensal] = useState<any[]>([]);
  const [ocupacaoDados, setOcupacaoDados] = useState<any[]>([]);
  const [distribuicaoVeiculos, setDistribuicaoVeiculos] = useState<any>({});
  const [statsReais, setStatsReais] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReportsData();
  }, [dataInicio, dataFim]);

  const loadReportsData = async () => {
    try {
      setIsLoading(true);
      console.log('Carregando dados de relatórios reais do banco de dados...');
      
      const [faturamentoData, ocupacaoData, distribuicaoData, statsData] = await Promise.all([
        ReportsService.getFaturamentoMensal(dataInicio, dataFim),
        ReportsService.getOcupacaoSemanal(),
        ReportsService.getDistribuicaoVeiculos(),
        ReportsService.getStatsByRole()
      ]);
      
      // Processar dados de faturamento mensal
      if (faturamentoData && Array.isArray(faturamentoData)) {
        const chartData = faturamentoData.map(item => ({
          mes: item.mesNome || item.mes || 'N/A',
          valor: item.faturamento || 0,
          reservas: item.reservas || 0
        }));
        setFaturamentoMensal(chartData);
      }
      
      // Processar dados de ocupação semanal
      if (ocupacaoData && Array.isArray(ocupacaoData)) {
        const chartData = ocupacaoData.map((item, index) => ({
          dia: `Semana ${index + 1}`,
          ocupacao: item.ocupacao || 0,
          reservas: item.reservasAtivas || 0
        }));
        setOcupacaoDados(chartData);
      }
      
      // Processar distribuição de veículos
      setDistribuicaoVeiculos(distribuicaoData || {});
      
      // Processar estatísticas gerais
      setStatsReais(statsData || {});
      
      console.log('Dados de relatórios carregados com sucesso:', { 
        faturamento: faturamentoData?.length || 0, 
        ocupacao: ocupacaoData?.length || 0,
        distribuicao: distribuicaoData ? 'Ok' : 'Vazio',
        stats: statsData ? 'Ok' : 'Vazio'
      });
      
      toast({
        title: "Relatórios carregados",
        description: "Dados atualizados do banco de dados.",
      });
      
    } catch (error: any) {
      console.error('Erro ao carregar dados de relatórios:', error);
      setFaturamentoMensal([]);
      setOcupacaoDados([]);
      setDistribuicaoVeiculos({});
      setStatsReais({});
      
      toast({
        title: "Erro ao carregar relatórios",
        description: error.message || "Não foi possível carregar os dados dos relatórios.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];

  const exportarRelatorio = async (formato: string, tipo: string) => {
    try {
      let periodo = '';
      if (filtroPersonalizado && dataInicio && dataFim) {
        periodo = ` (${dataInicio} a ${dataFim})`;
      }
      
      console.log(`Exportando relatório ${tipo} em formato ${formato}${periodo}`);
      
      const blob = await ReportsService.exportRelatorio(
        formato as 'pdf' | 'excel', 
        tipo, 
        dataInicio, 
        dataFim
      );
      
      // Criar download do arquivo
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio_${tipo}_${formato}${periodo.replace(/[^\w-]/g, '_')}.${formato === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Relatório exportado",
        description: "O arquivo foi baixado com sucesso.",
      });
      
    } catch (error: any) {
      console.error('Erro ao exportar relatório:', error);
      
      toast({
        title: "Erro na exportação",
        description: error.message || "Não foi possível exportar o relatório.",
        variant: "destructive",
      });
    }
  };

  const getStatsForRole = () => {
    // Usar dados reais do banco ou mostrar zero se não houver dados
    const defaultStats = [
      { titulo: 'Carregando...', valor: '0', mudanca: '0%', icon: BarChart3, cor: 'text-slate-400' },
      { titulo: 'Carregando...', valor: '0', mudanca: '0%', icon: Building2, cor: 'text-slate-400' },
      { titulo: 'Carregando...', valor: '0', mudanca: '0%', icon: Truck, cor: 'text-slate-400' },
      { titulo: 'Carregando...', valor: '0', mudanca: '0%', icon: Users, cor: 'text-slate-400' }
    ];

    if (isLoading) {
      return defaultStats;
    }

    // Processar dados reais baseados no role e nos dados recebidos do backend
    const faturamentoTotal = faturamentoMensal.reduce((sum, item) => sum + (item.valor || 0), 0);
    const reservasTotal = faturamentoMensal.reduce((sum, item) => sum + (item.reservas || 0), 0);
    const ocupacaoMedia = ocupacaoDados.length > 0 ? 
      ocupacaoDados.reduce((sum, item) => sum + (item.ocupacao || 0), 0) / ocupacaoDados.length : 0;

    if (user?.role === 'transportadora') {
      return [
        { 
          titulo: 'Veículos Cadastrados', 
          valor: distribuicaoVeiculos?.resumo?.totalVeiculos?.toString() || '0', 
          mudanca: '+0%', 
          icon: Truck, 
          cor: 'text-blue-400' 
        },
        { 
          titulo: 'Gastos com Reservas', 
          valor: `R$ ${faturamentoTotal.toLocaleString('pt-BR')}`, 
          mudanca: '+0%', 
          icon: BarChart3, 
          cor: 'text-green-400' 
        },
        { 
          titulo: 'Reservas Realizadas', 
          valor: reservasTotal.toString(), 
          mudanca: '+0%', 
          icon: Calendar, 
          cor: 'text-purple-400' 
        },
        { 
          titulo: 'Ticket Médio', 
          valor: reservasTotal > 0 ? `R$ ${(faturamentoTotal / reservasTotal).toFixed(0)}` : 'R$ 0', 
          mudanca: '+0%', 
          icon: TrendingUp, 
          cor: 'text-yellow-400' 
        }
      ];
    }
    
    if (user?.role === 'estacionamento') {
      return [
        { 
          titulo: 'Receita Total', 
          valor: `R$ ${faturamentoTotal.toLocaleString('pt-BR')}`, 
          mudanca: '+0%', 
          icon: BarChart3, 
          cor: 'text-green-400' 
        },
        { 
          titulo: 'Taxa Ocupação Média', 
          valor: `${ocupacaoMedia.toFixed(1)}%`, 
          mudanca: '+0%', 
          icon: Building2, 
          cor: 'text-blue-400' 
        },
        { 
          titulo: 'Total de Reservas', 
          valor: reservasTotal.toString(), 
          mudanca: '+0%', 
          icon: Calendar, 
          cor: 'text-purple-400' 
        },
        { 
          titulo: 'Ticket Médio', 
          valor: reservasTotal > 0 ? `R$ ${(faturamentoTotal / reservasTotal).toFixed(0)}` : 'R$ 0', 
          mudanca: '+0%', 
          icon: TrendingUp, 
          cor: 'text-yellow-400' 
        }
      ];
    }

    // Admin - dados gerais
    return [
      { 
        titulo: 'Receita Total Sistema', 
        valor: `R$ ${faturamentoTotal.toLocaleString('pt-BR')}`, 
        mudanca: '+0%', 
        icon: BarChart3, 
        cor: 'text-green-400' 
      },
      { 
        titulo: 'Empresas no Sistema', 
        valor: statsReais?.empresas?.length?.toString() || '0', 
        mudanca: '+0%', 
        icon: Building2, 
        cor: 'text-blue-400' 
      },
      { 
        titulo: 'Veículos Cadastrados', 
        valor: distribuicaoVeiculos?.resumo?.totalVeiculos?.toString() || '0', 
        mudanca: '+0%', 
        icon: Truck, 
        cor: 'text-purple-400' 
      },
      { 
        titulo: 'Usuários Ativos', 
        valor: statsReais?.usuarios?.reduce((sum: number, u: any) => sum + (u.total || 0), 0)?.toString() || '0', 
        mudanca: '+0%', 
        icon: Users, 
        cor: 'text-yellow-400' 
      }
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
              ? 'Análises da sua transportadora baseadas em dados reais'
              : user?.role === 'estacionamento'
              ? 'Análises do seu estacionamento baseadas em dados reais'
              : 'Análises gerais do sistema baseadas em dados reais'
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
                      {stat.mudanca !== '+0%' && <TrendingUp className="w-4 h-4 text-green-400" />}
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
              {user?.role === 'transportadora' ? 'Gastos com Reservas' : 'Faturamento Mensal'}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {faturamentoMensal.length > 0 ? 
                `Dados dos últimos ${faturamentoMensal.length} períodos` : 
                'Nenhum dado disponível no período selecionado'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-ajh-primary border-t-transparent"></div>
              </div>
            ) : faturamentoMensal.length > 0 ? (
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
            ) : (
              <div className="flex justify-center items-center h-[300px] text-slate-400">
                Nenhum dado de faturamento encontrado
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ocupação Chart */}
        <Card className="ajh-card">
          <CardHeader>
            <CardTitle className="text-white">
              {user?.role === 'estacionamento' ? 'Taxa de Ocupação' : 'Utilização de Vagas'}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {ocupacaoDados.length > 0 ? 
                `Ocupação das últimas ${ocupacaoDados.length} semanas` : 
                'Nenhum dado de ocupação disponível'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-ajh-primary border-t-transparent"></div>
              </div>
            ) : ocupacaoDados.length > 0 ? (
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
            ) : (
              <div className="flex justify-center items-center h-[300px] text-slate-400">
                Nenhum dado de ocupação encontrado
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Distribuição de Veículos */}
      {(user?.role === 'admin' || user?.role === 'transportadora') && (
        <Card className="ajh-card">
          <CardHeader>
            <CardTitle className="text-white">Distribuição de Veículos</CardTitle>
            <CardDescription className="text-slate-400">
              {distribuicaoVeiculos?.resumo?.totalVeiculos ? 
                `Total de ${distribuicaoVeiculos.resumo.totalVeiculos} veículos cadastrados` : 
                'Nenhum veículo cadastrado'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-ajh-primary border-t-transparent"></div>
              </div>
            ) : distribuicaoVeiculos?.distribuicaoPorTipo?.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distribuicaoVeiculos.distribuicaoPorTipo}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ tipo, percentual }) => `${tipo}: ${percentual}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="total"
                  >
                    {distribuicaoVeiculos.distribuicaoPorTipo.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-[300px] text-slate-400">
                Nenhum dado de distribuição de veículos encontrado
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Relatorios;
