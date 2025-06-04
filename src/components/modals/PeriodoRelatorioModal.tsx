
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, BarChart3, Building2, ParkingCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface PeriodoRelatorioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPeriodoSelected: (periodo: any) => void;
}

const PeriodoRelatorioModal: React.FC<PeriodoRelatorioModalProps> = ({ 
  open, 
  onOpenChange,
  onPeriodoSelected 
}) => {
  const [tipoRelatorio, setTipoRelatorio] = useState<string>('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const { isAdmin } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dataInicio || !dataFim) {
      return;
    }

    const periodo = {
      inicio: dataInicio,
      fim: dataFim,
      tipo: tipoRelatorio
    };

    onPeriodoSelected(periodo);
    onOpenChange(false);
    
    // Reset form
    setTipoRelatorio('');
    setDataInicio('');
    setDataFim('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="ajh-modal">
        <DialogHeader>
          <DialogTitle className="text-white">Configurar Período do Relatório</DialogTitle>
          <DialogDescription className="text-slate-400">
            Selecione o período e tipo de relatório desejado
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Relatório (apenas para Admin) */}
          {isAdmin() && (
            <div className="space-y-2">
              <Label htmlFor="tipoRelatorio" className="text-slate-300">Tipo de Relatório</Label>
              <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
                <SelectTrigger className="ajh-input">
                  <SelectValue placeholder="Selecione o tipo de relatório" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geral">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-ajh-primary" />
                      Relatório Geral (Admin)
                    </div>
                  </SelectItem>
                  <SelectItem value="transportadoras">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-400" />
                      Foco em Transportadoras
                    </div>
                  </SelectItem>
                  <SelectItem value="estacionamentos">
                    <div className="flex items-center gap-2">
                      <ParkingCircle className="w-4 h-4 text-green-400" />
                      Foco em Estacionamentos
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Data de Início */}
          <div className="space-y-2">
            <Label htmlFor="dataInicio" className="text-slate-300">Data de Início</Label>
            <input
              id="dataInicio"
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="ajh-input"
              required
            />
          </div>

          {/* Data de Fim */}
          <div className="space-y-2">
            <Label htmlFor="dataFim" className="text-slate-300">Data de Fim</Label>
            <input
              id="dataFim"
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="ajh-input"
              min={dataInicio}
              required
            />
          </div>

          {/* Preview */}
          {dataInicio && dataFim && (
            <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg">
              <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Resumo do Período
              </h4>
              <div className="space-y-1 text-sm text-slate-300">
                <p><strong>Período:</strong> {new Date(dataInicio).toLocaleDateString()} até {new Date(dataFim).toLocaleDateString()}</p>
                {tipoRelatorio && <p><strong>Tipo:</strong> {
                  {
                    'geral': 'Relatório Geral (Admin)',
                    'transportadoras': 'Foco em Transportadoras',
                    'estacionamentos': 'Foco em Estacionamentos'
                  }[tipoRelatorio]
                }</p>}
                <p><strong>Dias:</strong> {Math.ceil((new Date(dataFim).getTime() - new Date(dataInicio).getTime()) / (1000 * 60 * 60 * 24))} dias</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="ajh-button-secondary flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="ajh-button-primary flex-1">
              Aplicar Período
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PeriodoRelatorioModal;
