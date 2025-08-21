import React, { useState, useEffect } from 'react';
import { X, Car, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import MotoristaService, { Motorista } from '@/services/motoristas';
import EmpresaService, { Empresa } from '@/services/empresas';
import { useAuth } from '@/contexts/AuthContext';

interface CadastroVeiculoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Record<string, any>) => void;
  empresaId?: string;
}

const CadastroVeiculoModal: React.FC<CadastroVeiculoModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  empresaId
}) => {
  const [formData, setFormData] = useState({
    placa: '',
    modelo: '',
    marca: '',
    ano: new Date().getFullYear().toString(),
    cor: '',
    tipo: 'VAN', // Deve ser um dos valores aceitos pelo backend: 'TRUCK', 'VAN', 'CAR', 'MOTORCYCLE'
    status: 'ativo',
    chassi: '',
    empresaId: empresaId || 'placeholder', // Se não houver empresaId, usar placeholder
    motoristaPrincipalId: 'none' // Iniciar com 'none' para evitar null
  });
  
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [carregandoMotoristas, setCarregandoMotoristas] = useState(false);
  const [carregandoEmpresas, setCarregandoEmpresas] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Carregar dados da empresa quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      if (empresaId) {
        console.log('CadastroVeiculoModal recebeu empresaId:', empresaId);
        setFormData(prev => ({ ...prev, empresaId }));
        carregarMotoristas(empresaId);
      } else {
        console.log('CadastroVeiculoModal: empresaId não fornecido');
        
        // Se for admin, carregar a lista de empresas
        if (isAdmin) {
          carregarEmpresas();
        }
      }
    }
  }, [isOpen, empresaId, isAdmin]);

  // Atualizar motoristas quando empresa mudar
  useEffect(() => {
    if (formData.empresaId && formData.empresaId !== 'placeholder' && formData.empresaId !== 'none') {
      carregarMotoristas(formData.empresaId);
    } else {
      setMotoristas([]);
    }
  }, [formData.empresaId]);

  // Carregar empresas (para admin)
  const carregarEmpresas = async () => {
    try {
      setCarregandoEmpresas(true);
      const empresasData = await EmpresaService.getAll();
      
      // Filtrar apenas empresas do tipo transportadora
      const empresasTransportadora = empresasData.filter(e => e.tipo === 'TRANSPORTADORA');
      
      // Garantir que o admin tenha valor inicial para empresa
      if (isAdmin) {
        // Usar um valor de placeholder que será convertido para null depois
        setFormData(prev => ({ ...prev, empresaId: 'placeholder' }));
      }
      
      setEmpresas(empresasTransportadora);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar a lista de empresas.',
        variant: 'destructive',
      });
    } finally {
      setCarregandoEmpresas(false);
    }
  };

  // Carregar motoristas da empresa
  const carregarMotoristas = async (idEmpresa: string) => {
    if (!idEmpresa) return;
    
    try {
      setCarregandoMotoristas(true);
      const motoristasData = await MotoristaService.getAll();
      // Filtrar apenas motoristas da empresa selecionada
      const motoristasEmpresa = motoristasData.filter(m => m.empresaId === idEmpresa);
      setMotoristas(motoristasEmpresa);
    } catch (error) {
      console.error('Erro ao carregar motoristas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar a lista de motoristas.',
        variant: 'destructive',
      });
    } finally {
      setCarregandoMotoristas(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de campos obrigatórios
    let camposObrigatorios = [
      { campo: 'placa', label: 'Placa' },
      { campo: 'tipo', label: 'Tipo de Veículo' },
      { campo: 'marca', label: 'Marca' },
      { campo: 'modelo', label: 'Modelo' }
    ];
    
    const camposFaltantes = camposObrigatorios
      .filter(c => !formData[c.campo as keyof typeof formData])
      .map(c => c.label);
      
    if (camposFaltantes.length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: `Preencha os seguintes campos: ${camposFaltantes.join(', ')}`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Validar e formatar a placa - apenas letras e números
      const placaFormatada = formData.placa.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      if (placaFormatada.length < 5) {
        throw new Error("A placa deve ter pelo menos 5 caracteres");
      }

      // Verificar se o tipo de veículo é válido
      const tiposValidos = ['TRUCK', 'VAN', 'CAR', 'MOTORCYCLE'];
      if (!formData.tipo || !tiposValidos.includes(formData.tipo)) {
        throw new Error("Selecione um tipo de veículo válido");
      }

      // Preparar os dados para salvar
      const dadosParaSalvar = {
        ...formData,
        placa: placaFormatada,
        tipo: formData.tipo,
        ano: formData.ano ? parseInt(formData.ano) : new Date().getFullYear(),
        status: formData.status || 'ativo',
        motoristaPrincipalId: formData.motoristaPrincipalId === 'none' ? null : formData.motoristaPrincipalId
      };
      
      // Definir empresaId corretamente
      if (empresaId) {
        // Se foi passado um empresaId como prop, usa ele
        dadosParaSalvar.empresaId = empresaId;
      } else if (user?.role === 'admin') {
        // Se for admin, usa o que foi selecionado no formulário
        if (formData.empresaId && formData.empresaId !== 'none' && formData.empresaId !== 'placeholder') {
          dadosParaSalvar.empresaId = formData.empresaId;
        } else {
          // Remover o empresaId para que o backend use o padrão
          delete dadosParaSalvar.empresaId;
        }
      } else if (user?.companyId) {
        // Se for outro tipo de usuário, usa a empresa do usuário
        dadosParaSalvar.empresaId = user.companyId;
      }
      
      console.log('Dados finais para salvar:', dadosParaSalvar);
      
      // Chamar a função de salvamento
      onSave(dadosParaSalvar);
    } catch (error) {
      toast({
        title: "Erro de validação",
        description: error instanceof Error ? error.message : "Verifique os dados do formulário",
        variant: "destructive",
      });
    }
  };

  const handleChange = (key: string, value: string) => {
    // Formatação especial para placa
    if (key === 'placa') {
      // Converte para maiúsculas e remove espaços extras
      const formatted = value.toUpperCase().trim();
      setFormData(prev => ({ ...prev, [key]: formatted }));
    } else if (key === 'ano') {
      // Permitir apenas números para ano
      const digitsOnly = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [key]: digitsOnly }));
    } else {
      setFormData(prev => ({ ...prev, [key]: value }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-ajh-dark border border-slate-700 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Car className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Cadastrar Novo Veículo</h3>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h4 className="text-white font-medium text-lg border-b border-slate-700 pb-2">
              Informações Básicas
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="placa" className="text-slate-300">
                  Placa do Veículo *
                </Label>
                <Input
                  id="placa"
                  value={formData.placa}
                  onChange={(e) => handleChange('placa', e.target.value)}
                  className="ajh-input"
                  placeholder="Ex: ABC1234"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo" className="text-slate-300">
                  Tipo de Veículo *
                </Label>
                <Select 
                  value={formData.tipo} 
                  onValueChange={(value) => handleChange('tipo', value)}
                >
                  <SelectTrigger className="ajh-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="VAN">Van</SelectItem>
                    <SelectItem value="TRUCK">Caminhão</SelectItem>
                    <SelectItem value="CAR">Carro</SelectItem>
                    <SelectItem value="MOTORCYCLE">Moto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Selecionar Empresa (apenas para admin) */}
          {isAdmin && (
            <div className="space-y-4">
              <h4 className="text-white font-medium text-lg border-b border-slate-700 pb-2">
                Empresa
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="empresaId" className="text-slate-300">
                    Empresa *
                  </Label>
                  <Select 
                    value={formData.empresaId} 
                    onValueChange={(value) => handleChange('empresaId', value)}
                  >
                    <SelectTrigger className="ajh-input">
                      <SelectValue placeholder="Selecione uma empresa" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 max-h-60">
                      {carregandoEmpresas ? (
                        <SelectItem value="loading" disabled>Carregando empresas...</SelectItem>
                      ) : (
                        <>
                          <SelectItem value="placeholder">Selecione uma empresa</SelectItem>
                          {empresas.map(empresa => (
                            <SelectItem key={empresa.id} value={empresa.id}>
                              {empresa.nome}
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  {carregandoEmpresas && (
                    <p className="text-sm text-slate-400">Carregando empresas...</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Detalhes do Veículo */}
          <div className="space-y-4">
            <h4 className="text-white font-medium text-lg border-b border-slate-700 pb-2">
              Detalhes do Veículo
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="marca" className="text-slate-300">
                  Marca *
                </Label>
                <Input
                  id="marca"
                  value={formData.marca}
                  onChange={(e) => handleChange('marca', e.target.value)}
                  className="ajh-input"
                  placeholder="Ex: Mercedes"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modelo" className="text-slate-300">
                  Modelo *
                </Label>
                <Input
                  id="modelo"
                  value={formData.modelo}
                  onChange={(e) => handleChange('modelo', e.target.value)}
                  className="ajh-input"
                  placeholder="Ex: Sprinter"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ano" className="text-slate-300">
                  Ano de Fabricação
                </Label>
                <Input
                  id="ano"
                  type="number"
                  value={formData.ano}
                  onChange={(e) => handleChange('ano', e.target.value)}
                  className="ajh-input"
                  placeholder={new Date().getFullYear().toString()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cor" className="text-slate-300">
                  Cor
                </Label>
                <Input
                  id="cor"
                  value={formData.cor}
                  onChange={(e) => handleChange('cor', e.target.value)}
                  className="ajh-input"
                  placeholder="Ex: Branco"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chassi" className="text-slate-300">
                  Chassi
                </Label>
                <Input
                  id="chassi"
                  value={formData.chassi}
                  onChange={(e) => handleChange('chassi', e.target.value)}
                  className="ajh-input"
                  placeholder="Ex: 9BWZZZ377VT004251"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-slate-300">
                  Status
                </Label>
                <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                  <SelectTrigger className="ajh-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                    <SelectItem value="manutencao">Manutenção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Motorista */}
          <div className="space-y-4">
            <h4 className="text-white font-medium text-lg border-b border-slate-700 pb-2">
              Associação
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="motoristaPrincipalId" className="text-slate-300">
                  Motorista Principal
                </Label>
                <Select 
                  value={formData.motoristaPrincipalId} 
                  onValueChange={(value) => handleChange('motoristaPrincipalId', value)}
                >
                  <SelectTrigger className="ajh-input">
                    <SelectValue placeholder="Selecione um motorista" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 max-h-60">
                    <SelectItem value="none">Nenhum motorista</SelectItem>
                    {motoristas.map(motorista => (
                      <SelectItem key={motorista.id} value={motorista.id}>
                        {motorista.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {carregandoMotoristas && (
                  <p className="text-sm text-slate-400">Carregando motoristas...</p>
                )}
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="ajh-button-secondary"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="ajh-button-primary"
            >
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastroVeiculoModal; 