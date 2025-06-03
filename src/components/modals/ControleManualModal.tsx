
import React, { useState } from 'react';
import { ParkingCircle, Car, User, Clock, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ControleManualModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ControleManualModal: React.FC<ControleManualModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'entrada' | 'saida'>('entrada');
  const [placa, setPlaca] = useState('');
  const [vaga, setVaga] = useState('');

  const handleEntrada = () => {
    if (!placa || !vaga) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha a placa e a vaga.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Entrada registrada!",
      description: `Veículo ${placa} registrado na vaga ${vaga}.`,
    });
    
    setPlaca('');
    setVaga('');
    onOpenChange(false);
  };

  const handleSaida = () => {
    if (!placa) {
      toast({
        title: "Campo obrigatório",
        description: "Preencha a placa do veículo.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Saída registrada!",
      description: `Saída do veículo ${placa} registrada com sucesso.`,
    });
    
    setPlaca('');
    setVaga('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] ajh-card">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <ParkingCircle className="w-5 h-5 text-ajh-primary" />
            Controle Manual do Estacionamento
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Registre entradas e saídas manualmente no sistema.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'entrada' ? 'default' : 'outline'}
              onClick={() => setActiveTab('entrada')}
              className={activeTab === 'entrada' ? 'ajh-button-primary' : 'ajh-button-secondary'}
            >
              <Car className="w-4 h-4 mr-2" />
              Registrar Entrada
            </Button>
            <Button
              variant={activeTab === 'saida' ? 'default' : 'outline'}
              onClick={() => setActiveTab('saida')}
              className={activeTab === 'saida' ? 'ajh-button-primary' : 'ajh-button-secondary'}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Registrar Saída
            </Button>
          </div>

          {/* Entrada Form */}
          {activeTab === 'entrada' && (
            <div className="space-y-4">
              <div>
                <label className="text-slate-300 text-sm font-medium mb-2 block">
                  Placa do Veículo
                </label>
                <Input
                  placeholder="ABC-1234"
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                  className="ajh-input"
                />
              </div>

              <div>
                <label className="text-slate-300 text-sm font-medium mb-2 block">
                  Número da Vaga
                </label>
                <Input
                  placeholder="A01"
                  value={vaga}
                  onChange={(e) => setVaga(e.target.value.toUpperCase())}
                  className="ajh-input"
                />
              </div>

              <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-ajh-primary" />
                  <span className="text-slate-300 text-sm font-medium">Informações da Entrada</span>
                </div>
                <div className="space-y-1 text-sm text-slate-400">
                  <p>Data/Hora: {new Date().toLocaleString()}</p>
                  <p>Operador: Sistema Manual</p>
                </div>
              </div>

              <Button onClick={handleEntrada} className="ajh-button-primary w-full">
                <Car className="w-4 h-4 mr-2" />
                Confirmar Entrada
              </Button>
            </div>
          )}

          {/* Saída Form */}
          {activeTab === 'saida' && (
            <div className="space-y-4">
              <div>
                <label className="text-slate-300 text-sm font-medium mb-2 block">
                  Placa do Veículo
                </label>
                <Input
                  placeholder="ABC-1234"
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                  className="ajh-input"
                />
              </div>

              {placa && (
                <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-ajh-secondary" />
                    <span className="text-slate-300 text-sm font-medium">Dados do Veículo</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-sm">Vaga:</span>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">A15</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-sm">Entrada:</span>
                      <span className="text-slate-300 text-sm">14:30</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-sm">Tempo:</span>
                      <span className="text-slate-300 text-sm">2h 15min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-sm">Motorista:</span>
                      <span className="text-slate-300 text-sm">João Silva</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-ajh-primary" />
                  <span className="text-slate-300 text-sm font-medium">Informações da Saída</span>
                </div>
                <div className="space-y-1 text-sm text-slate-400">
                  <p>Data/Hora: {new Date().toLocaleString()}</p>
                  <p>Operador: Sistema Manual</p>
                </div>
              </div>

              <Button onClick={handleSaida} className="ajh-button-primary w-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirmar Saída
              </Button>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="ajh-button-secondary"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ControleManualModal;
