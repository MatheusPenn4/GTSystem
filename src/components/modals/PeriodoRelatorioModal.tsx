
import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface PeriodoRelatorioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPeriodoSelected: (periodo: { inicio: string; fim: string; tipo: string }) => void;
}

const PeriodoRelatorioModal: React.FC<PeriodoRelatorioModalProps> = ({
  open,
  onOpenChange,
  onPeriodoSelected,
}) => {
  const { toast } = useToast();
  const [tipoSelecionado, setTipoSelecionado] = useState<string>('personalizado');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const periodosPreDefinidos = [
    { key: 'hoje', label: 'Hoje', descricao: 'Apenas hoje' },
    { key: 'ontem', label: 'Ontem', descricao: 'Apenas ontem' },
    { key: '7dias', label: 'Últimos 7 dias', descricao: 'Uma semana atrás até hoje' },
    { key: '30dias', label: 'Últimos 30 dias', descricao: 'Um mês atrás até hoje' },
    { key: '90dias', label: 'Últimos 90 dias', descricao: 'Três meses atrás até hoje' },
    { key: 'mesAtual', label: 'Mês atual', descricao: 'Do início do mês até hoje' },
    { key: 'mesPassado', label: 'Mês passado', descricao: 'Mês anterior completo' },
    { key: 'anoAtual', label: 'Ano atual', descricao: 'Do início do ano até hoje' },
    { key: 'personalizado', label: 'Período personalizado', descricao: 'Selecione datas específicas' }
  ];

  const calcularPeriodo = (tipo: string) => {
    const hoje = new Date();
    let inicio = new Date();
    let fim = new Date();

    switch (tipo) {
      case 'hoje':
        inicio = new Date(hoje);
        fim = new Date(hoje);
        break;
      case 'ontem':
        inicio = new Date(hoje.getTime() - 24 * 60 * 60 * 1000);
        fim = new Date(hoje.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7dias':
        inicio = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);
        fim = hoje;
        break;
      case '30dias':
        inicio = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000);
        fim = hoje;
        break;
      case '90dias':
        inicio = new Date(hoje.getTime() - 90 * 24 * 60 * 60 * 1000);
        fim = hoje;
        break;
      case 'mesAtual':
        inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        fim = hoje;
        break;
      case 'mesPassado':
        inicio = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
        fim = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
        break;
      case 'anoAtual':
        inicio = new Date(hoje.getFullYear(), 0, 1);
        fim = hoje;
        break;
      default:
        return null;
    }

    return {
      inicio: inicio.toISOString().split('T')[0],
      fim: fim.toISOString().split('T')[0]
    };
  };

  const handleConfirmar = () => {
    let periodo;

    if (tipoSelecionado === 'personalizado') {
      if (!dataInicio || !dataFim) {
        toast({
          title: "Datas obrigatórias",
          description: "Selecione as datas de início e fim.",
          variant: "destructive"
        });
        return;
      }

      if (new Date(dataInicio) > new Date(dataFim)) {
        toast({
          title: "Data inválida",
          description: "A data de início deve ser anterior à data de fim.",
          variant: "destructive"
        });
        return;
      }

      periodo = {
        inicio: dataInicio,
        fim: dataFim,
        tipo: 'personalizado'
      };
    } else {
      const calculado = calcularPeriodo(tipoSelecionado);
      if (!calculado) return;

      periodo = {
        ...calculado,
        tipo: tipoSelecionado
      };
    }

    onPeriodoSelected(periodo);
    toast({
      title: "Período selecionado!",
      description: `Relatório será gerado para o período selecionado.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] ajh-card">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-ajh-primary" />
            Selecionar Período do Relatório
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Escolha o período para gerar o relatório personalizado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Períodos Pré-definidos */}
          <div>
            <Label className="text-slate-300 text-sm font-medium mb-3 block">
              Períodos Pré-definidos
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {periodosPreDefinidos.filter(p => p.key !== 'personalizado').map((periodo) => (
                <div
                  key={periodo.key}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    tipoSelecionado === periodo.key 
                      ? 'border-ajh-primary bg-ajh-primary/10' 
                      : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600'
                  }`}
                  onClick={() => setTipoSelecionado(periodo.key)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-ajh-primary" />
                    <span className="text-white text-sm font-medium">{periodo.label}</span>
                  </div>
                  <p className="text-slate-400 text-xs">{periodo.descricao}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Período Personalizado */}
          <div>
            <div
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                tipoSelecionado === 'personalizado'
                  ? 'border-ajh-primary bg-ajh-primary/10'
                  : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600'
              }`}
              onClick={() => setTipoSelecionado('personalizado')}
            >
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-ajh-primary" />
                <span className="text-white text-sm font-medium">Período Personalizado</span>
              </div>
              
              {tipoSelecionado === 'personalizado' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300 text-xs mb-2 block">Data de Início</Label>
                    <Input
                      type="date"
                      value={dataInicio}
                      onChange={(e) => setDataInicio(e.target.value)}
                      className="ajh-input"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300 text-xs mb-2 block">Data de Fim</Label>
                    <Input
                      type="date"
                      value={dataFim}
                      onChange={(e) => setDataFim(e.target.value)}
                      className="ajh-input"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview do Período Selecionado */}
          {tipoSelecionado && tipoSelecionado !== 'personalizado' && (
            <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
              <h4 className="text-white text-sm font-medium mb-2">Preview do Período</h4>
              {(() => {
                const periodo = calcularPeriodo(tipoSelecionado);
                if (!periodo) return null;
                return (
                  <div className="text-slate-400 text-sm">
                    <p>Início: {new Date(periodo.inicio).toLocaleDateString()}</p>
                    <p>Fim: {new Date(periodo.fim).toLocaleDateString()}</p>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="ajh-button-secondary"
            >
              Cancelar
            </Button>
            <Button onClick={handleConfirmar} className="ajh-button-primary">
              Confirmar Período
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PeriodoRelatorioModal;
