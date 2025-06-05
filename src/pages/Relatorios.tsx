
import React, { useState } from 'react';
import { Calendar, Download, Filter, FileText, Building2, Truck, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import DateRangeFilter from '@/components/DateRangeFilter';

const Relatorios: React.FC = () => {
  const { user } = useAuth();
  const [tipoRelatorio, setTipoRelatorio] = useState('geral');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [filtroPersonalizado, setFiltroPersonalizado] = useState(false);

  // Mock data and helper functions
  const getRelatoriosDisponiveis = () => {
    if (user?.role === 'transportadora') {
      return [
        {
          id: 'frota',
          titulo: 'Relatório da Frota',
          descricao: 'Desempenho e utilização dos veículos',
          icon: Truck,
          dados: ['Veículos ativos: 12', 'KM rodados: 15.430', 'Consumo médio: 8.5L/100km']
        },
        {
          id: 'reservas',
          titulo: 'Relatório de Reservas',
          descricao: 'Histórico de reservas realizadas',
          icon: Calendar,
          dados: ['Reservas confirmadas: 45', 'Reservas canceladas: 3', 'Taxa de ocupação: 93%']
        },
        {
          id: 'financeiro',
          titulo: 'Relatório Financeiro',
          descricao: 'Gastos com estacionamento',
          icon: BarChart3,
          dados: ['Gasto total: R$ 5.400', 'Média por diária: R$ 120', 'Economia: R$ 450']
        }
      ];
    }
    
    if (user?.role === 'estacionamento') {
      return [
        {
          id: 'ocupacao',
          titulo: 'Relatório de Ocupação',
          descricao: 'Taxa de ocupação das vagas',
          icon: Building2,
          dados: ['Taxa média: 67%', 'Pico: 89% (14h)', 'Vale: 23% (03h)']
        },
        {
          id: 'receita',
          titulo: 'Relatório de Receita',
          descricao: 'Faturamento do estacionamento',
          icon: BarChart3,
          dados: ['Receita mensal: R$ 14.400', 'Crescimento: +12%', 'Valor diária: R$ 120']
        },
        {
          id: 'reservas-recebidas',
          titulo: 'Reservas Recebidas',
          descricao: 'Histórico de reservas do estacionamento',
          icon: Calendar,
          dados: ['Total de reservas: 156', 'Confirmadas: 148', 'Canceladas: 8']
        }
      ];
    }

    // Admin - todos os relatórios
    return [
      {
        id: 'geral',
        titulo: 'Relatório Geral',
        descricao: 'Visão geral de todo o sistema',
        icon: BarChart3,
        dados: ['24 empresas ativas', '156 veículos', '89 motoristas']
      },
      {
        id: 'empresas',
        titulo: 'Relatório de Empresas',
        descricao: 'Desempenho das transportadoras',
        icon: Building2,
        dados: ['Empresas ativas: 24', 'Novas empresas: 3', 'Taxa de retenção: 96%']
      },
      {
        id: 'estacionamentos',
        titulo: 'Relatório de Estacionamentos',
        descricao: 'Performance dos estacionamentos',
        icon: Building2,
        dados: ['Estacionamentos: 15', 'Vagas totais: 1.200', 'Taxa ocupação: 67%']
      },
      {
        id: 'financeiro',
        titulo: 'Relatório Financeiro',
        descricao: 'Receitas e comissões',
        icon: BarChart3,
        dados: ['Receita total: R$ 86.400', 'Comissões: R$ 8.640', 'Crescimento: +15%']
      }
    ];
  };

  const relatorios = getRelatoriosDisponiveis();

  const exportarRelatorio = (formato: string, relatorioId: string) => {
    let periodo = '';
    if (filtroPersonalizado && dataInicio && dataFim) {
      periodo = ` (${dataInicio} a ${dataFim})`;
    }
    console.log(`Exportando relatório ${relatorioId} em formato ${formato}${periodo}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Relatórios</h1>
          <p className="text-slate-400">
            {user?.role === 'transportadora' 
              ? 'Relatórios da sua transportadora'
              : user?.role === 'estacionamento'
              ? 'Relatórios do seu estacionamento'
              : 'Análises e relatórios do sistema'
            }
          </p>
        </div>
        <Button 
          onClick={() => setFiltroPersonalizado(!filtroPersonalizado)}
          className="ajh-button-secondary"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filtros Personalizados
        </Button>
      </div>

      {/* Filtros de Data */}
      <DateRangeFilter
        startDate={dataInicio}
        endDate={dataFim}
        onStartDateChange={setDataInicio}
        onEndDateChange={setDataFim}
        isVisible={filtroPersonalizado}
      />

      {/* Admin - Seletor de Tipo de Relatório */}
      {user?.role === 'admin' && (
        <Card className="ajh-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <label className="text-slate-300">Tipo de Relatório:</label>
              <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
                <SelectTrigger className="w-48 ajh-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="geral">Relatório Geral</SelectItem>
                  <SelectItem value="transportadoras">Transportadoras</SelectItem>
                  <SelectItem value="estacionamentos">Estacionamentos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Relatórios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {relatorios.map((relatorio) => {
          const Icon = relatorio.icon;
          return (
            <Card key={relatorio.id} className="ajh-card hover-scale">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-ajh-primary/10 rounded-lg">
                    <Icon className="w-6 h-6 text-ajh-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-white">{relatorio.titulo}</CardTitle>
                    <CardDescription className="text-slate-400">
                      {relatorio.descricao}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  {relatorio.dados.map((dado, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">{dado.split(':')[0]}:</span>
                      <Badge variant="secondary" className="bg-slate-700 text-white">
                        {dado.split(':')[1]}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 ajh-button-primary"
                    onClick={() => exportarRelatorio('pdf', relatorio.id)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 ajh-button-secondary"
                    onClick={() => exportarRelatorio('excel', relatorio.id)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Excel
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Relatorios;
