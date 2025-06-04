
import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  FileBarChart, 
  FileText, 
  Filter, 
  Settings,
  Building2,
  ParkingCircle,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"

const Relatorios: React.FC = () => {
  const [date, setDate] = useState<Date>();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Relatórios e Análises
        </h1>
        <p className="text-slate-400">
          Visualize dados e gere relatórios personalizados.
        </p>
      </div>

      {/* Filters and Options */}
      <Card className="ajh-card">
        <CardHeader>
          <CardTitle className="text-white">Opções de Relatório</CardTitle>
          <CardDescription className="text-slate-400">
            Selecione os filtros e opções desejadas para gerar o relatório.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Range Picker */}
            <div className="col-span-1 md:col-span-1">
              <Label htmlFor="date" className="text-white">Período:</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Escolha uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) =>
                      date > new Date() || date < new Date("2020-01-01")
                    }
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Report Type Select */}
            <div className="col-span-1 md:col-span-1">
              <Label htmlFor="reportType" className="text-white">Tipo de Relatório:</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendas">Relatório de Vendas</SelectItem>
                  <SelectItem value="financeiro">Relatório Financeiro</SelectItem>
                  <SelectItem value="ocupacao">Relatório de Ocupação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter by Location */}
            <div className="col-span-1 md:col-span-1">
              <Label htmlFor="location" className="text-white">Localização:</Label>
              <Input type="text" id="location" placeholder="Todas as localizações" />
            </div>
          </div>

          {/* Additional Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-1">
              <Label htmlFor="status" className="text-white">Status:</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Input */}
            <div className="col-span-1 md:col-span-1">
              <Label htmlFor="search" className="text-white">Pesquisar:</Label>
              <Input type="search" id="search" placeholder="Pesquisar..." />
            </div>
          </div>

          {/* Generate Report Button */}
          <Button className="ajh-button-primary w-full justify-start">
            <FileBarChart className="w-4 h-4 mr-2" />
            Gerar Relatório
          </Button>
        </CardContent>
      </Card>

      {/* Report Display */}
      <Card className="ajh-card">
        <CardHeader>
          <CardTitle className="text-white">Visualização do Relatório</CardTitle>
          <CardDescription className="text-slate-400">
            Dados detalhados do relatório gerado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-slate-700/50 bg-slate-800/30 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-5 py-3 border-b-2 border-slate-700/50 bg-slate-800/30 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-5 py-3 border-b-2 border-slate-700/50 bg-slate-800/30 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-5 py-3 border-b-2 border-slate-700/50 bg-slate-800/30 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-5 py-5 border-b border-slate-700/50 bg-slate-800/10 text-sm text-white">
                    01/01/2024
                  </td>
                  <td className="px-5 py-5 border-b border-slate-700/50 bg-slate-800/10 text-sm text-white">
                    Venda
                  </td>
                  <td className="px-5 py-5 border-b border-slate-700/50 bg-slate-800/10 text-sm text-white">
                    R$ 150,00
                  </td>
                  <td className="px-5 py-5 border-b border-slate-700/50 bg-slate-800/10 text-sm text-white">
                    Concluído
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-5 border-b border-slate-700/50 bg-slate-800/10 text-sm text-white">
                    02/01/2024
                  </td>
                  <td className="px-5 py-5 border-b border-slate-700/50 bg-slate-800/10 text-sm text-white">
                    Manutenção
                  </td>
                  <td className="px-5 py-5 border-b border-slate-700/50 bg-slate-800/10 text-sm text-white">
                    R$ 50,00
                  </td>
                  <td className="px-5 py-5 border-b border-slate-700/50 bg-slate-800/10 text-sm text-white">
                    Pago
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card className="ajh-card">
        <CardHeader>
          <CardTitle className="text-white">Opções de Exportação</CardTitle>
          <CardDescription className="text-slate-400">
            Exporte o relatório em diferentes formatos.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex space-x-4">
          <Button className="ajh-button-secondary justify-start">
            <FileText className="w-4 h-4 mr-2" />
            Exportar para TXT
          </Button>
          <Button className="ajh-button-secondary justify-start">
            <FileBarChart className="w-4 h-4 mr-2" />
            Exportar para CSV
          </Button>
          <Button className="ajh-button-secondary justify-start">
            <Download className="w-4 h-4 mr-2" />
            Exportar para PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Relatorios;
