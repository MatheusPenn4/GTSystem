import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import MotoristaService, { Motorista } from '@/services/motoristas';
import { Veiculo } from '@/services/veiculos';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Record<string, any>) => void;
  title: string;
  data: Record<string, any>;
}

const EditModal: React.FC<EditModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  title, 
  data 
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [carregandoMotoristas, setCarregandoMotoristas] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && data) {
      setFormData({ ...data });
      
      // Se for um veículo, carregar a lista de motoristas da mesma empresa
      if (data.tipo && data.empresaId) {
        carregarMotoristas(data.empresaId);
      }
    }
  }, [isOpen, data]);

  // Carregar motoristas da empresa
  const carregarMotoristas = async (empresaId: string) => {
    try {
      setCarregandoMotoristas(true);
      const motoristasData = await MotoristaService.getAll();
      // Filtrar apenas motoristas da empresa selecionada
      const motoristasEmpresa = motoristasData.filter(m => m.empresaId === empresaId);
      setMotoristas(motoristasEmpresa);
    } catch (error) {
      console.error('Erro ao carregar motoristas:', error);
    } finally {
      setCarregandoMotoristas(false);
    }
  };

  if (!isOpen) return null;

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Tratar o caso especial do motoristaPrincipalId
    const dataToSave = { ...formData };
    if (dataToSave.motoristaPrincipalId === 'none') {
      dataToSave.motoristaPrincipalId = null;
    }
    
    onSave(dataToSave);
  };

  // Verificar se é um veículo
  const isVeiculo = data.tipo && ['TRUCK', 'VAN', 'CAR', 'MOTORCYCLE'].includes(data.tipo);

  // Formatador de CPF
  const formatCPF = (cpf: string) => {
    const digitsOnly = cpf.replace(/\D/g, '');
    if (digitsOnly.length <= 3) return digitsOnly;
    if (digitsOnly.length <= 6) return `${digitsOnly.substring(0, 3)}.${digitsOnly.substring(3)}`;
    if (digitsOnly.length <= 9) return `${digitsOnly.substring(0, 3)}.${digitsOnly.substring(3, 6)}.${digitsOnly.substring(6)}`;
    return `${digitsOnly.substring(0, 3)}.${digitsOnly.substring(3, 6)}.${digitsOnly.substring(6, 9)}-${digitsOnly.substring(9, 11)}`;
  };

  // Renderizar inputs com base nas propriedades do objeto
  const renderInputs = () => {
    // Propriedades que não devem ser editáveis
    const nonEditableFields = ['id', 'dataCadastro', 'empresaId', 'empresaNome'];
    
    // Configuração de campos específicos
    const fieldConfigs: Record<string, any> = {
      nome: { label: 'Nome', type: 'text' },
      placa: { label: 'Placa', type: 'text' },
      modelo: { label: 'Modelo', type: 'text' },
      marca: { label: 'Marca', type: 'text' },
      ano: { label: 'Ano', type: 'number' },
      cor: { label: 'Cor', type: 'text' },
      tipo: { 
        label: 'Tipo', 
        type: 'select',
        options: [
          { value: 'TRUCK', label: 'Caminhão' },
          { value: 'VAN', label: 'Van' },
          { value: 'CAR', label: 'Carro' },
          { value: 'MOTORCYCLE', label: 'Moto' }
        ]
      },
      status: { 
        label: 'Status', 
        type: 'select',
        options: [
          { value: 'ativo', label: 'Ativo' },
          { value: 'inativo', label: 'Inativo' },
          { value: 'manutencao', label: 'Manutenção' }
        ]
      },
      motoristaPrincipalId: {
        label: 'Motorista Principal',
        type: 'select',
        options: [
          { value: 'none', label: 'Nenhum motorista' },
          ...motoristas.map(m => ({ value: m.id, label: m.nome }))
        ]
      },
      cpf: { label: 'CPF', type: 'text', format: formatCPF },
      cnh: { label: 'CNH', type: 'text' },
      categoria: { 
        label: 'Categoria CNH', 
        type: 'select',
        options: [
          { value: 'A', label: 'A' },
          { value: 'B', label: 'B' },
          { value: 'C', label: 'C' },
          { value: 'D', label: 'D' },
          { value: 'E', label: 'E' },
          { value: 'AB', label: 'AB' },
          { value: 'AC', label: 'AC' },
          { value: 'AD', label: 'AD' },
          { value: 'AE', label: 'AE' }
        ]
      },
      validadeCnh: { label: 'Validade CNH', type: 'date' },
      telefone: { label: 'Telefone', type: 'text' },
      email: { label: 'E-mail', type: 'email' },
      logo: { label: 'Logo', type: 'file' },
      cnpj: { label: 'CNPJ', type: 'text' },
      endereco: { label: 'Endereço', type: 'text' },
      cidade: { label: 'Cidade', type: 'text' },
      estado: { label: 'Estado', type: 'text' },
      cep: { label: 'CEP', type: 'text' },
      responsavel: { label: 'Responsável', type: 'text' }
    };

    return Object.keys(data)
      .filter(key => !nonEditableFields.includes(key))
      .sort((a, b) => {
        // Ordenar campos mais importantes primeiro
        const priority = ['nome', 'placa', 'modelo', 'marca', 'cpf', 'cnh'];
        const aIndex = priority.indexOf(a);
        const bIndex = priority.indexOf(b);
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return a.localeCompare(b);
      })
      .map(key => {
        const config = fieldConfigs[key] || { label: key, type: 'text' };
        
        // Pular o campo motoristaPrincipalId se não for um veículo
        if (key === 'motoristaPrincipalId' && !isVeiculo) return null;
        
        // Campo de upload de arquivo (logo)
        if (config.type === 'file') {
          return (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="text-slate-300">
                {config.label}
              </Label>
              <div className="flex items-center space-x-3">
                <Input
                  id={key}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Converter para base64 ou usar FormData conforme necessário
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        handleChange(key, event.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="ajh-input"
                />
                <Upload className="w-5 h-5 text-slate-400" />
              </div>
              {formData[key] && (
                <div className="mt-2">
                  <img 
                    src={formData[key]} 
                    alt="Preview" 
                    className="w-20 h-20 object-cover rounded-lg border border-slate-700"
                  />
                </div>
              )}
            </div>
          );
        }
        
        // Campos de texto padrão
        if (config.type === 'text' || config.type === 'number' || config.type === 'email' || config.type === 'date') {
          return (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="text-slate-300">
                {config.label}
              </Label>
              <Input
                id={key}
                type={config.type}
                value={config.format ? config.format(formData[key] || '') : formData[key] || ''}
                onChange={(e) => {
                  const value = config.type === 'number' ? 
                    e.target.value === '' ? '' : parseInt(e.target.value, 10) : 
                    e.target.value;
                  handleChange(key, value);
                }}
                className="ajh-input"
              />
            </div>
          );
        }
        
        // Campos de seleção
        if (config.type === 'select') {
          return (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="text-slate-300">
                {config.label}
              </Label>
              <Select 
                value={formData[key] || ''} 
                onValueChange={(value) => handleChange(key, value)}
              >
                <SelectTrigger className="ajh-input">
                  <SelectValue placeholder={`Selecione ${config.label}`} />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {config.options.map((option: any) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {key === 'motoristaPrincipalId' && carregandoMotoristas && (
                <p className="text-sm text-slate-400">Carregando motoristas...</p>
              )}
            </div>
          );
        }
        
        return null;
      });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-ajh-dark border border-slate-700 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderInputs()}
          </div>

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

export default EditModal;
