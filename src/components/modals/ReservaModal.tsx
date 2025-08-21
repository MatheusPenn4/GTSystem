import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, MapPin, Car, User, Building2, ParkingCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import VeiculoService, { Veiculo } from '@/services/veiculos';
import MotoristaService, { Motorista } from '@/services/motoristas';

interface Estacionamento {
  id: string;
  nome: string;
  endereco: string;
  cidade: string;
  vagasDisponiveis: number;
  totalVagas: number;
  valorPorHora: number;
  distancia: string;
  horarioFuncionamento: string;
  status: 'disponivel' | 'cheio' | 'manutencao';
  amenities?: string[];
}

interface ReservaModalProps {
  isOpen: boolean;
  onClose: () => void;
  estacionamento: Estacionamento | null;
  onSuccess?: () => void;
}

interface FormData {
  estacionamentoId: string;
  veiculoId: string;
  motoristaId: string;
  dataInicio: string;
  horaInicio: string;
  dataFim: string;
  horaFim: string;
  observacoes: string;
}

const ReservaModal: React.FC<ReservaModalProps> = ({ isOpen, onClose, estacionamento, onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [motorista, setMotorista] = useState<Motorista | null>(null);
  const [custoEstimado, setCustoEstimado] = useState<number>(0);
  
  const [formData, setFormData] = useState<FormData>({
    estacionamentoId: '',
    veiculoId: '',
    motoristaId: '',
    dataInicio: '',
    horaInicio: '',
    dataFim: '',
    horaFim: '',
    observacoes: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Carregar dados quando o modal abrir
  useEffect(() => {
    if (isOpen && estacionamento) {
      setFormData(prev => ({
        ...prev,
        estacionamentoId: estacionamento.id
      }));
      loadVeiculos();
      setMotorista(null);
    }
  }, [isOpen, estacionamento]);

  // Quando o veículo for selecionado, buscar o motorista principal
  useEffect(() => {
    const fetchMotorista = async () => {
      if (formData.veiculoId) {
        const veiculo = veiculos.find(v => v.id === formData.veiculoId);
        if (veiculo && veiculo.motoristaPrincipalId) {
          try {
            const motoristaData = await MotoristaService.getById(veiculo.motoristaPrincipalId);
            setMotorista(motoristaData);
          } catch (e) {
            setMotorista(null);
          }
        } else {
          setMotorista(null);
        }
      } else {
        setMotorista(null);
      }
    };
    fetchMotorista();
  }, [formData.veiculoId, veiculos]);

  // Calcular custo estimado quando as datas mudarem
  useEffect(() => {
    if (formData.dataInicio && formData.horaInicio && formData.dataFim && formData.horaFim && estacionamento) {
      calcularCustoEstimado();
    }
  }, [formData.dataInicio, formData.horaInicio, formData.dataFim, formData.horaFim, estacionamento]);

  const loadVeiculos = async () => {
    try {
      const veiculosFromAPI = await VeiculoService.getAll();
      setVeiculos(veiculosFromAPI);
    } catch (error) {
      setVeiculos([]);
    }
  };

  const loadMotoristas = async () => {
    try {
      console.log('Carregando motoristas reais do banco de dados...');
      // TODO: Implementar chamada real à API de motoristas
      // const motoristasFromAPI = await DriverService.getAll();
      // setMotoristas(motoristasFromAPI);
      
      // Por enquanto, lista vazia - sem dados fictícios
      // setMotoristas([]); // Removido
      console.log('Motoristas carregados: 0 (sem dados fictícios)');
    } catch (error) {
      console.error('Erro ao carregar motoristas:', error);
      // setMotoristas([]); // Removido
    }
  };

  const calcularCustoEstimado = () => {
    if (!estacionamento) return;

    const inicio = new Date(`${formData.dataInicio}T${formData.horaInicio}`);
    const fim = new Date(`${formData.dataFim}T${formData.horaFim}`);
    
    if (inicio >= fim) {
      setCustoEstimado(0);
      return;
    }

    const diferencaHoras = (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60);
    const custo = diferencaHoras * estacionamento.valorPorHora;
    setCustoEstimado(Math.max(0, custo));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.veiculoId) newErrors.veiculoId = 'Selecione um veículo';
    if (!formData.dataInicio) newErrors.dataInicio = 'Data de início é obrigatória';
    if (!formData.horaInicio) newErrors.horaInicio = 'Hora de início é obrigatória';
    if (!formData.dataFim) newErrors.dataFim = 'Data de fim é obrigatória';
    if (!formData.horaFim) newErrors.horaFim = 'Hora de fim é obrigatória';
    if (!motorista) newErrors.veiculoId = 'O veículo selecionado não possui motorista principal cadastrado.';

    // Validar se data/hora de fim é posterior ao início
    if (formData.dataInicio && formData.horaInicio && formData.dataFim && formData.horaFim) {
      const inicio = new Date(`${formData.dataInicio}T${formData.horaInicio}`);
      const fim = new Date(`${formData.dataFim}T${formData.horaFim}`);
      
      if (inicio >= fim) {
        newErrors.dataFim = 'Data/hora de fim deve ser posterior ao início';
      }

      // Validar se a data de início não é no passado
      const agora = new Date();
      if (inicio <= agora) {
        newErrors.dataInicio = 'Data/hora de início deve ser futura';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!estacionamento) return;

    setLoading(true);
    try {
      const reservaData = {
        parkingLotId: formData.estacionamentoId,
        vehicleId: formData.veiculoId,
        driverId: motorista?.id,
        startTime: `${formData.dataInicio}T${formData.horaInicio}:00.000Z`,
        endTime: `${formData.dataFim}T${formData.horaFim}:00.000Z`,
        specialRequests: formData.observacoes || undefined
      };

      // TODO: Implementar call real da API
      console.log('Dados da reserva:', reservaData);
      
      // Simulação de API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Reserva Criada!",
        description: `Sua reserva no ${estacionamento.nome} foi criada com sucesso. Status: Pendente de aprovação.`,
      });

      handleClose();
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      toast({
        title: "Erro ao criar reserva",
        description: "Ocorreu um erro ao processar sua solicitação. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      estacionamentoId: '',
      veiculoId: '',
      motoristaId: '',
      dataInicio: '',
      horaInicio: '',
      dataFim: '',
      horaFim: '',
      observacoes: ''
    });
    setErrors({});
    setCustoEstimado(0);
    onClose();
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando ele for modificado
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!estacionamento) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="ajh-modal max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Nova Reserva de Vaga</DialogTitle>
          <DialogDescription className="text-slate-400">
            Preencha os dados para criar uma nova reserva no estacionamento selecionado
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações do Estacionamento */}
          <Card className="ajh-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Estacionamento Selecionado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h3 className="text-white font-medium">{estacionamento.nome}</h3>
                <p className="text-slate-400 text-sm flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {estacionamento.endereco}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <ParkingCircle className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-300">
                    {estacionamento.vagasDisponiveis}/{estacionamento.totalVagas} vagas
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-300">{estacionamento.horarioFuncionamento}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-300">R$ {typeof estacionamento.valorPorHora === 'number' && !isNaN(estacionamento.valorPorHora) ? estacionamento.valorPorHora.toFixed(2) : 'N/A'}/hora</span>
                </div>
              </div>

              {custoEstimado > 0 && (
                <div className="mt-4 p-3 bg-ajh-primary/10 rounded-lg border border-ajh-primary/20">
                  <p className="text-ajh-primary font-medium">
                    Custo Estimado: R$ {custoEstimado.toFixed(2)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Formulário de Reserva */}
          <div className="space-y-4">
            {/* Seleção de Veículo */}
            <div>
              <Label htmlFor="veiculo" className="text-slate-300">
                Veículo <span className="text-red-400">*</span>
              </Label>
              <Select value={formData.veiculoId} onValueChange={(value) => handleInputChange('veiculoId', value)}>
                <SelectTrigger className="ajh-input">
                  <SelectValue placeholder="Selecione um veículo" />
                </SelectTrigger>
                <SelectContent className="ajh-dropdown">
                  {veiculos.map((veiculo) => (
                    <SelectItem key={veiculo.id} value={veiculo.id}>
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4" />
                        <span>{veiculo.placa} - {veiculo.marca} {veiculo.modelo}</span>
                        <Badge variant="outline" className="text-xs">{veiculo.tipo}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.veiculoId && <p className="text-red-400 text-sm mt-1">{errors.veiculoId}</p>}
            </div>
            {/* Exibir motorista automaticamente */}
            {motorista && (
              <div className="mt-2">
                <Label className="text-slate-300">Motorista</Label>
                <div className="flex items-center gap-2 p-2 bg-slate-800 rounded">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-white font-medium">{motorista.nome}</span>
                  <span className="text-slate-400 text-xs">CNH: {motorista.cnh}</span>
                </div>
              </div>
            )}

            {/* Data e Hora de Início */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dataInicio" className="text-slate-300">
                  Data de Início <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={formData.dataInicio}
                  onChange={(e) => handleInputChange('dataInicio', e.target.value)}
                  className="ajh-input"
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.dataInicio && <p className="text-red-400 text-sm mt-1">{errors.dataInicio}</p>}
              </div>
              <div>
                <Label htmlFor="horaInicio" className="text-slate-300">
                  Hora de Início <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="horaInicio"
                  type="time"
                  value={formData.horaInicio}
                  onChange={(e) => handleInputChange('horaInicio', e.target.value)}
                  className="ajh-input"
                />
                {errors.horaInicio && <p className="text-red-400 text-sm mt-1">{errors.horaInicio}</p>}
              </div>
            </div>

            {/* Data e Hora de Fim */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dataFim" className="text-slate-300">
                  Data de Fim <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="dataFim"
                  type="date"
                  value={formData.dataFim}
                  onChange={(e) => handleInputChange('dataFim', e.target.value)}
                  className="ajh-input"
                  min={formData.dataInicio || new Date().toISOString().split('T')[0]}
                />
                {errors.dataFim && <p className="text-red-400 text-sm mt-1">{errors.dataFim}</p>}
              </div>
              <div>
                <Label htmlFor="horaFim" className="text-slate-300">
                  Hora de Fim <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="horaFim"
                  type="time"
                  value={formData.horaFim}
                  onChange={(e) => handleInputChange('horaFim', e.target.value)}
                  className="ajh-input"
                />
                {errors.horaFim && <p className="text-red-400 text-sm mt-1">{errors.horaFim}</p>}
              </div>
            </div>

            {/* Observações */}
            <div>
              <Label htmlFor="observacoes" className="text-slate-300">
                Observações
              </Label>
              <Textarea
                id="observacoes"
                placeholder="Informações adicionais sobre a reserva..."
                value={formData.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                className="ajh-input"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={loading}
            className="ajh-button-secondary"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={loading}
            className="ajh-button-primary"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Criando...
              </>
            ) : (
              <>
                <CalendarIcon className="w-4 h-4 mr-2" />
                Criar Reserva
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReservaModal;