import React, { useState } from 'react';
import { X, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface CadastroEstacionamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Record<string, any>) => void;
}

const CadastroEstacionamentoModal: React.FC<CadastroEstacionamentoModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    totalVagas: '',
    valorHora: '',
    telefone: '',
    email: '',
    responsavel: '',
    status: 'ativo'
  });
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação mais completa
    const camposObrigatorios = [
      { campo: 'nome', label: 'Nome do Estacionamento' },
      { campo: 'endereco', label: 'Endereço' },
      { campo: 'cidade', label: 'Cidade' },
      { campo: 'estado', label: 'Estado' },
      { campo: 'cep', label: 'CEP' },
      { campo: 'responsavel', label: 'Responsável' },
      { campo: 'totalVagas', label: 'Total de Vagas' },
      { campo: 'valorHora', label: 'Valor por Hora' }
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
    
    // Validação numérica
    if (isNaN(parseFloat(formData.valorHora)) || parseFloat(formData.valorHora) <= 0) {
      toast({
        title: "Valor inválido",
        description: "O valor por hora deve ser um número positivo",
        variant: "destructive",
      });
      return;
    }
    
    if (isNaN(parseInt(formData.totalVagas)) || parseInt(formData.totalVagas) <= 0) {
      toast({
        title: "Valor inválido",
        description: "O total de vagas deve ser um número positivo",
        variant: "destructive",
      });
      return;
    }

    onSave({
      ...formData,
      totalVagas: parseInt(formData.totalVagas),
      valorHora: parseFloat(formData.valorHora),
      valorDiaria: parseFloat(formData.valorHora) * 24, // Calculando diária com base no valor/hora
      vagasDisponiveis: parseInt(formData.totalVagas), // Inicialmente todas disponíveis
      dataCredenciamento: new Date().toISOString().split('T')[0]
    });
    
    // Fechar o modal após salvar
    onClose();
  };

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-ajh-dark border border-slate-700 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Cadastrar Novo Estacionamento</h3>
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
                <Label htmlFor="nome" className="text-slate-300">
                  Nome do Estacionamento *
                </Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  className="ajh-input"
                  placeholder="Ex: Meu Estacionamento"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsavel" className="text-slate-300">
                  Responsável *
                </Label>
                <Input
                  id="responsavel"
                  value={formData.responsavel}
                  onChange={(e) => handleChange('responsavel', e.target.value)}
                  className="ajh-input"
                  placeholder="Nome do responsável"
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h4 className="text-white font-medium text-lg border-b border-slate-700 pb-2">
              Endereço
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="endereco" className="text-slate-300">
                  Endereço Completo *
                </Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => handleChange('endereco', e.target.value)}
                  className="ajh-input"
                  placeholder="Rua, número, bairro"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cidade" className="text-slate-300">
                  Cidade *
                </Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => handleChange('cidade', e.target.value)}
                  className="ajh-input"
                  placeholder="São Paulo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado" className="text-slate-300">
                  Estado *
                </Label>
                <Select value={formData.estado} onValueChange={(value) => handleChange('estado', value)}>
                  <SelectTrigger className="ajh-input">
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="AC">Acre</SelectItem>
                    <SelectItem value="AL">Alagoas</SelectItem>
                    <SelectItem value="AP">Amapá</SelectItem>
                    <SelectItem value="AM">Amazonas</SelectItem>
                    <SelectItem value="BA">Bahia</SelectItem>
                    <SelectItem value="CE">Ceará</SelectItem>
                    <SelectItem value="DF">Distrito Federal</SelectItem>
                    <SelectItem value="ES">Espírito Santo</SelectItem>
                    <SelectItem value="GO">Goiás</SelectItem>
                    <SelectItem value="MA">Maranhão</SelectItem>
                    <SelectItem value="MT">Mato Grosso</SelectItem>
                    <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                    <SelectItem value="MG">Minas Gerais</SelectItem>
                    <SelectItem value="PA">Pará</SelectItem>
                    <SelectItem value="PB">Paraíba</SelectItem>
                    <SelectItem value="PR">Paraná</SelectItem>
                    <SelectItem value="PE">Pernambuco</SelectItem>
                    <SelectItem value="PI">Piauí</SelectItem>
                    <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                    <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                    <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                    <SelectItem value="RO">Rondônia</SelectItem>
                    <SelectItem value="RR">Roraima</SelectItem>
                    <SelectItem value="SC">Santa Catarina</SelectItem>
                    <SelectItem value="SP">São Paulo</SelectItem>
                    <SelectItem value="SE">Sergipe</SelectItem>
                    <SelectItem value="TO">Tocantins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cep" className="text-slate-300">
                  CEP *
                </Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => handleChange('cep', e.target.value)}
                  className="ajh-input"
                  placeholder="00000-000"
                />
              </div>
            </div>
          </div>

          {/* Configurações */}
          <div className="space-y-4">
            <h4 className="text-white font-medium text-lg border-b border-slate-700 pb-2">
              Configurações
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalVagas" className="text-slate-300">
                  Total de Vagas *
                </Label>
                <Input
                  id="totalVagas"
                  type="number"
                  value={formData.totalVagas}
                  onChange={(e) => handleChange('totalVagas', e.target.value)}
                  className="ajh-input"
                  placeholder="50"
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valorHora" className="text-slate-300">
                  Valor por Hora (R$) *
                </Label>
                <Input
                  id="valorHora"
                  type="number"
                  step="0.01"
                  value={formData.valorHora}
                  onChange={(e) => handleChange('valorHora', e.target.value)}
                  className="ajh-input"
                  placeholder="8.50"
                  min="0"
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

          {/* Contato */}
          <div className="space-y-4">
            <h4 className="text-white font-medium text-lg border-b border-slate-700 pb-2">
              Informações de Contato
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefone" className="text-slate-300">
                  Telefone
                </Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleChange('telefone', e.target.value)}
                  className="ajh-input"
                  placeholder="(11) 9999-8888"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="ajh-input"
                  placeholder="contato@estacionamento.com"
                />
              </div>
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-slate-700 flex gap-3">
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 ajh-button-secondary"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 ajh-button-primary"
          >
            Cadastrar Estacionamento
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CadastroEstacionamentoModal;
