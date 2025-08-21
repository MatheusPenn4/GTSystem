import React, { useState } from 'react';
import { X, Building2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface CadastroEmpresaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Record<string, any>) => void;
}

const CadastroEmpresaModal: React.FC<CadastroEmpresaModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    tipo: 'TRANSPORTADORA',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    telefone: '',
    email: '',
    responsavel: '',
    status: 'ATIVO',
    logo: ''
  });
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação mais completa
    const camposObrigatorios = [
      { campo: 'nome', label: 'Nome da Empresa' },
      { campo: 'cnpj', label: 'CNPJ' },
      { campo: 'tipo', label: 'Tipo de Empresa' },
      { campo: 'endereco', label: 'Endereço' },
      { campo: 'responsavel', label: 'Responsável' },
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
    
    // Validar formato do CNPJ (apenas dígitos)
    const cnpjDigits = formData.cnpj.replace(/\D/g, '');
    if (cnpjDigits.length !== 14) {
      toast({
        title: "CNPJ Inválido",
        description: "O CNPJ deve conter 14 dígitos numéricos",
        variant: "destructive",
      });
      return;
    }

    onSave({
      ...formData,
      cnpj: cnpjDigits, // Enviando apenas os dígitos
      dataCadastro: new Date().toISOString().split('T')[0]
    });
    
    // Fechar o modal após salvar
    onClose();
  };

  const handleChange = (key: string, value: string) => {
    // Formatação especial para CNPJ
    if (key === 'cnpj') {
      // Remove todos os caracteres não numéricos
      const digitsOnly = value.replace(/\D/g, '');
      
      // Aplica a máscara de CNPJ: XX.XXX.XXX/XXXX-XX
      let formatted = '';
      if (digitsOnly.length <= 2) {
        formatted = digitsOnly;
      } else if (digitsOnly.length <= 5) {
        formatted = `${digitsOnly.substring(0, 2)}.${digitsOnly.substring(2)}`;
      } else if (digitsOnly.length <= 8) {
        formatted = `${digitsOnly.substring(0, 2)}.${digitsOnly.substring(2, 5)}.${digitsOnly.substring(5)}`;
      } else if (digitsOnly.length <= 12) {
        formatted = `${digitsOnly.substring(0, 2)}.${digitsOnly.substring(2, 5)}.${digitsOnly.substring(5, 8)}/${digitsOnly.substring(8)}`;
      } else {
        formatted = `${digitsOnly.substring(0, 2)}.${digitsOnly.substring(2, 5)}.${digitsOnly.substring(5, 8)}/${digitsOnly.substring(8, 12)}-${digitsOnly.substring(12, 14)}`;
      }
      
      setFormData(prev => ({ ...prev, [key]: formatted }));
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
                <Building2 className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Cadastrar Nova Empresa</h3>
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
                  Nome da Empresa *
                </Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  className="ajh-input"
                  placeholder="Ex: Transportes Rápidos LTDA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj" className="text-slate-300">
                  CNPJ *
                </Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => handleChange('cnpj', e.target.value)}
                  className="ajh-input"
                  placeholder="Ex: 12.345.678/0001-90"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo" className="text-slate-300">
                  Tipo de Empresa *
                </Label>
                <Select value={formData.tipo} onValueChange={(value) => handleChange('tipo', value)}>
                  <SelectTrigger className="ajh-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="TRANSPORTADORA">Transportadora</SelectItem>
                    <SelectItem value="ESTACIONAMENTO">Estacionamento</SelectItem>
                    <SelectItem value="OPERADOR">Operador Logístico</SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectItem value="ATIVO">Ativo</SelectItem>
                    <SelectItem value="INATIVO">Inativo</SelectItem>
                    <SelectItem value="SUSPENSO">Suspenso</SelectItem>
                  </SelectContent>
                </Select>
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

          {/* Contato */}
          <div className="space-y-4">
            <h4 className="text-white font-medium text-lg border-b border-slate-700 pb-2">
              Informações de Contato
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="contato@empresa.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo" className="text-slate-300">
                  Logo da Empresa
                </Label>
                <div className="flex items-center space-x-3">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          handleChange('logo', event.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="ajh-input"
                  />
                  <Upload className="w-5 h-5 text-slate-400" />
                </div>
                {formData.logo && (
                  <div className="mt-2">
                    <img 
                      src={formData.logo} 
                      alt="Preview" 
                      className="w-20 h-20 object-cover rounded-lg border border-slate-700"
                    />
                  </div>
                )}
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
            Cadastrar Empresa
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CadastroEmpresaModal; 