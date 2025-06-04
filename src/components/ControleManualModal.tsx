
import React, { useState } from 'react';
import { X, Car, Clock, User, ParkingCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ControleManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  vaga?: {
    id: string;
    numero: string;
    status: 'livre' | 'ocupada' | 'reservada' | 'manutencao';
    veiculo?: string;
    motorista?: string;
  };
}

const ControleManualModal: React.FC<ControleManualModalProps> = ({ isOpen, onClose, vaga }) => {
  const [acao, setAcao] = useState<'entrada' | 'saida' | 'reserva' | 'manutencao'>('entrada');
  const [placa, setPlaca] = useState('');
  const [motorista, setMotorista] = useState('');
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let mensagem = '';
    switch (acao) {
      case 'entrada':
        mensagem = `Entrada registrada para vaga ${vaga?.numero} - Veículo ${placa}`;
        break;
      case 'saida':
        mensagem = `Saída registrada para vaga ${vaga?.numero}`;
        break;
      case 'reserva':
        mensagem = `Vaga ${vaga?.numero} reservada para ${motorista}`;
        break;
      case 'manutencao':
        mensagem = `Vaga ${vaga?.numero} marcada para manutenção`;
        break;
    }

    toast({
      title: "Ação Realizada",
      description: mensagem,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-ajh-dark border border-slate-700 rounded-lg w-full max-w-md">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Controle Manual - Vaga {vaga?.numero}
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Status atual da vaga */}
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <span className="text-slate-300">Status Atual:</span>
            <Badge className={
              vaga?.status === 'livre' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
              vaga?.status === 'ocupada' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
              vaga?.status === 'reservada' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
              'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
            }>
              {vaga?.status === 'livre' ? 'Livre' :
               vaga?.status === 'ocupada' ? 'Ocupada' :
               vaga?.status === 'reservada' ? 'Reservada' : 'Manutenção'}
            </Badge>
          </div>

          {/* Seleção de ação */}
          <div className="space-y-2">
            <Label className="text-slate-300">Ação a realizar:</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={acao === 'entrada' ? 'default' : 'outline'}
                onClick={() => setAcao('entrada')}
                className={acao === 'entrada' ? 'ajh-button-primary' : 'ajh-button-secondary'}
                size="sm"
              >
                <Car className="w-4 h-4 mr-2" />
                Entrada
              </Button>
              <Button
                type="button"
                variant={acao === 'saida' ? 'default' : 'outline'}
                onClick={() => setAcao('saida')}
                className={acao === 'saida' ? 'ajh-button-primary' : 'ajh-button-secondary'}
                size="sm"
              >
                <Car className="w-4 h-4 mr-2" />
                Saída
              </Button>
              <Button
                type="button"
                variant={acao === 'reserva' ? 'default' : 'outline'}
                onClick={() => setAcao('reserva')}
                className={acao === 'reserva' ? 'ajh-button-primary' : 'ajh-button-secondary'}
                size="sm"
              >
                <Clock className="w-4 h-4 mr-2" />
                Reserva
              </Button>
              <Button
                type="button"
                variant={acao === 'manutencao' ? 'default' : 'outline'}
                onClick={() => setAcao('manutencao')}
                className={acao === 'manutencao' ? 'ajh-button-primary' : 'ajh-button-secondary'}
                size="sm"
              >
                <ParkingCircle className="w-4 h-4 mr-2" />
                Manutenção
              </Button>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {(acao === 'entrada' || acao === 'reserva') && (
              <div className="space-y-2">
                <Label htmlFor="placa" className="text-slate-300">Placa do Veículo</Label>
                <Input
                  id="placa"
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value)}
                  placeholder="ABC-1234"
                  className="ajh-input"
                  required
                />
              </div>
            )}

            {(acao === 'entrada' || acao === 'reserva') && (
              <div className="space-y-2">
                <Label htmlFor="motorista" className="text-slate-300">Motorista</Label>
                <Input
                  id="motorista"
                  value={motorista}
                  onChange={(e) => setMotorista(e.target.value)}
                  placeholder="Nome do motorista"
                  className="ajh-input"
                  required
                />
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                className="flex-1 ajh-button-secondary"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 ajh-button-primary"
              >
                Confirmar {acao === 'entrada' ? 'Entrada' : 
                          acao === 'saida' ? 'Saída' :
                          acao === 'reserva' ? 'Reserva' : 'Manutenção'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ControleManualModal;
