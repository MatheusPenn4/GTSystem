
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Car, Clock, User, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ControleManualModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vagaSelecionada?: string;
}

const ControleManualModal: React.FC<ControleManualModalProps> = ({ 
  open, 
  onOpenChange,
  vagaSelecionada 
}) => {
  const [acao, setAcao] = useState<string>('');
  const [placa, setPlaca] = useState('');
  const [motorista, setMotorista] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acao) {
      toast({
        title: "Erro",
        description: "Selecione uma ação para continuar.",
        variant: "destructive",
      });
      return;
    }

    if (acao === 'entrada' && !placa) {
      toast({
        title: "Erro",
        description: "Informe a placa do veículo para registrar entrada.",
        variant: "destructive",
      });
      return;
    }

    // Simular ação
    const acaoTexto = {
      'entrada': 'Entrada registrada',
      'saida': 'Saída registrada',
      'reserva': 'Reserva criada',
      'liberar': 'Vaga liberada',
      'manutencao': 'Vaga em manutenção'
    }[acao];

    toast({
      title: "Sucesso!",
      description: `${acaoTexto} para a vaga ${vagaSelecionada || 'selecionada'}.`,
    });

    // Reset form
    setAcao('');
    setPlaca('');
    setMotorista('');
    setObservacoes('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="ajh-modal">
        <DialogHeader>
          <DialogTitle className="text-white">
            Controle Manual - {vagaSelecionada ? `Vaga ${vagaSelecionada}` : 'Nova Ação'}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Registre manualmente entradas, saídas, reservas ou alterações de status
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Ação */}
          <div className="space-y-2">
            <Label htmlFor="acao" className="text-slate-300">Tipo de Ação *</Label>
            <Select value={acao} onValueChange={setAcao}>
              <SelectTrigger className="ajh-input">
                <SelectValue placeholder="Selecione uma ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entrada">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-green-400" />
                    Registrar Entrada
                  </div>
                </SelectItem>
                <SelectItem value="saida">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-blue-400" />
                    Registrar Saída
                  </div>
                </SelectItem>
                <SelectItem value="reserva">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    Criar Reserva
                  </div>
                </SelectItem>
                <SelectItem value="liberar">
                  <div className="flex items-center gap-2">
                    <Badge className="w-4 h-4 text-green-400" />
                    Liberar Vaga
                  </div>
                </SelectItem>
                <SelectItem value="manutencao">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                    Marcar Manutenção
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Placa do Veículo */}
          {(acao === 'entrada' || acao === 'saida' || acao === 'reserva') && (
            <div className="space-y-2">
              <Label htmlFor="placa" className="text-slate-300">
                Placa do Veículo {acao === 'entrada' && '*'}
              </Label>
              <Input
                id="placa"
                type="text"
                placeholder="ABC-1234"
                value={placa}
                onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                className="ajh-input"
                maxLength={8}
              />
            </div>
          )}

          {/* Nome do Motorista */}
          {(acao === 'entrada' || acao === 'reserva') && (
            <div className="space-y-2">
              <Label htmlFor="motorista" className="text-slate-300">Nome do Motorista</Label>
              <Input
                id="motorista"
                type="text"
                placeholder="Nome completo"
                value={motorista}
                onChange={(e) => setMotorista(e.target.value)}
                className="ajh-input"
              />
            </div>
          )}

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes" className="text-slate-300">Observações</Label>
            <textarea
              id="observacoes"
              placeholder="Informações adicionais..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="ajh-input min-h-[80px] resize-none"
              rows={3}
            />
          </div>

          {/* Preview da Ação */}
          {acao && (
            <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg">
              <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Resumo da Ação
              </h4>
              <div className="space-y-1 text-sm text-slate-300">
                <p><strong>Ação:</strong> {
                  {
                    'entrada': 'Registrar entrada de veículo',
                    'saida': 'Registrar saída de veículo',
                    'reserva': 'Criar reserva de vaga',
                    'liberar': 'Liberar vaga para uso',
                    'manutencao': 'Marcar vaga em manutenção'
                  }[acao]
                }</p>
                {vagaSelecionada && <p><strong>Vaga:</strong> {vagaSelecionada}</p>}
                {placa && <p><strong>Veículo:</strong> {placa}</p>}
                {motorista && <p><strong>Motorista:</strong> {motorista}</p>}
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
              Confirmar Ação
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ControleManualModal;
