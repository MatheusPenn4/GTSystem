
import React, { useState } from 'react';
import { DollarSign, TrendingUp, Building2, Calculator, Receipt, PieChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const Financeiro: React.FC = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('mes');

  // Mock data - Faturamento dos estacionamentos
  const faturamentoEstacionamentos = [
    { id: 1, nome: 'Estacionamento Central', vagas: 50, ocupacaoMedia: 85, diariasVendidas: 1275, faturamento: 153000, comissao: 3060 },
    { id: 2, nome: 'Pátio Norte Shopping', vagas: 80, ocupacaoMedia: 78, diariasVendidas: 1872, faturamento: 224640, comissao: 4493 },
    { id: 3, nome: 'Terminal Rodoviário', vagas: 120, ocupacaoMedia: 92, diariasVendidas: 3312, faturamento: 397440, comissao: 7949 },
    { id: 4, nome: 'Porto Seco', vagas: 200, ocupacaoMedia: 88, diariasVendidas: 5280, faturamento: 633600, comissao: 12672 },
    { id: 5, nome: 'Aeroporto Cargo', vagas: 90, ocupacaoMedia: 95, faturamento: 307800, diariasVendidas: 2565, comissao: 6156 }
  ];

  // Mock data - Evolução mensal
  const evolucaoMensal = [
    { mes: 'Jan', faturamento: 1450000, comissao: 29000 },
    { mes: 'Fev', faturamento: 1580000, comissao: 31600 },
    { mes: 'Mar', faturamento: 1720000, comissao: 34400 },
    { mes: 'Abr', faturamento: 1890000, comissao: 37800 },
    { mes: 'Mai', faturamento: 1650000, comissao: 33000 },
    { mes: 'Jun', faturamento: 1716480, comissao: 34330 }
  ];

  const totalFaturamento = faturamentoEstacionamentos.reduce((acc, est) => acc + est.faturamento, 0);
  const totalComissao = faturamentoEstacionamentos.reduce((acc, est) => acc + est.comissao, 0);
  const totalDiarias = faturamentoEstacionamentos.reduce((acc, est) => acc + est.diariasVendidas, 0);
  const mediaOcupacao = faturamentoEstacionamentos.reduce((acc, est) => acc + est.ocupacaoMedia, 0) / faturamentoEstacionamentos.length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Módulo Financeiro</h1>
          <p className="text-slate-400">
            Controle financeiro de estacionamentos e comissões
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
            <SelectTrigger className="w-40 ajh-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="semana">Esta Semana</SelectItem>
              <SelectItem value="mes">Este Mês</SelectItem>
              <SelectItem value="trimestre">Trimestre</SelectItem>
              <SelectItem value="ano">Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button className="ajh-button-primary">
            <Receipt className="w-4 h-4 mr-2" />
            Gerar Relatório
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="ajh-card hover-scale">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-slate-400 text-sm font-medium">Faturamento Total</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalFaturamento)}</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-0">
                    +15%
                  </Badge>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card hover-scale">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-slate-400 text-sm font-medium">Nossa Comissão (2%)</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalComissao)}</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-0">
                    +18%
                  </Badge>
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                </div>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Calculator className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card hover-scale">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-slate-400 text-sm font-medium">Diárias Vendidas</p>
                <p className="text-2xl font-bold text-white">{totalDiarias.toLocaleString()}</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-0">
                    +12%
                  </Badge>
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                </div>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Building2 className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ajh-card hover-scale">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-slate-400 text-sm font-medium">Ocupação Média</p>
                <p className="text-2xl font-bold text-white">{mediaOcupacao.toFixed(1)}%</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-0">
                    +5%
                  </Badge>
                  <TrendingUp className="w-4 h-4 text-yellow-400" />
                </div>
              </div>
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <PieChart className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Evolução do Faturamento */}
        <Card className="ajh-card">
          <CardHeader>
            <CardTitle className="text-white">Evolução do Faturamento</CardTitle>
            <CardDescription className="text-slate-400">
              Faturamento e comissões nos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={evolucaoMensal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="mes" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [formatCurrency(Number(value)), '']}
                />
                <Line 
                  type="monotone" 
                  dataKey="faturamento" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  name="Faturamento Total"
                />
                <Line 
                  type="monotone" 
                  dataKey="comissao" 
                  stroke="#06B6D4" 
                  strokeWidth={3}
                  name="Nossa Comissão"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Estacionamentos */}
        <Card className="ajh-card">
          <CardHeader>
            <CardTitle className="text-white">Top Estacionamentos</CardTitle>
            <CardDescription className="text-slate-400">
              Maiores geradores de receita
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={faturamentoEstacionamentos.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="nome" stroke="#9CA3AF" tick={false} />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [formatCurrency(Number(value)), 'Faturamento']}
                />
                <Bar dataKey="faturamento" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela Detalhada */}
      <Card className="ajh-card">
        <CardHeader>
          <CardTitle className="text-white">Detalhamento por Estacionamento</CardTitle>
          <CardDescription className="text-slate-400">
            Performance financeira individual - Valor da diária: R$ 120,00
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Estacionamento</TableHead>
                  <TableHead className="text-slate-300">Vagas</TableHead>
                  <TableHead className="text-slate-300">Ocupação Média</TableHead>
                  <TableHead className="text-slate-300">Diárias Vendidas</TableHead>
                  <TableHead className="text-slate-300">Faturamento</TableHead>
                  <TableHead className="text-slate-300">Nossa Comissão (2%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faturamentoEstacionamentos.map((estacionamento) => (
                  <TableRow key={estacionamento.id} className="border-slate-700 hover:bg-slate-800/50">
                    <TableCell className="text-white font-medium">
                      {estacionamento.nome}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {estacionamento.vagas}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      <Badge 
                        variant="secondary" 
                        className={`${
                          estacionamento.ocupacaoMedia >= 90 
                            ? 'bg-green-500/20 text-green-400' 
                            : estacionamento.ocupacaoMedia >= 75 
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {estacionamento.ocupacaoMedia}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {estacionamento.diariasVendidas.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-white font-semibold">
                      {formatCurrency(estacionamento.faturamento)}
                    </TableCell>
                    <TableCell className="text-green-400 font-semibold">
                      {formatCurrency(estacionamento.comissao)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Resumo Financeiro */}
      <Card className="ajh-card">
        <CardHeader>
          <CardTitle className="text-white">Resumo Financeiro do Mês</CardTitle>
          <CardDescription className="text-slate-400">
            Análise detalhada dos números
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Receitas</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Faturamento Bruto:</span>
                  <span className="text-white font-semibold">{formatCurrency(totalFaturamento)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Nossa Comissão (2%):</span>
                  <span className="text-green-400 font-semibold">{formatCurrency(totalComissao)}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Operacional</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total de Diárias:</span>
                  <span className="text-white font-semibold">{totalDiarias.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Valor por Diária:</span>
                  <span className="text-white font-semibold">R$ 120,00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ocupação Média:</span>
                  <span className="text-white font-semibold">{mediaOcupacao.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Crescimento</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Faturamento:</span>
                  <span className="text-green-400 font-semibold">+15%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Comissões:</span>
                  <span className="text-green-400 font-semibold">+18%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Diárias Vendidas:</span>
                  <span className="text-green-400 font-semibold">+12%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Financeiro;
