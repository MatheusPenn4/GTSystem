import React, { useState, useEffect } from 'react';
import { X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import EmpresaService, { Empresa } from '@/services/empresas';

interface CadastroMotoristaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Record<string, any>) => void;
  empresaId?: string;
}

const CadastroMotoristaModal: React.FC<CadastroMotoristaModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  empresaId
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    cnh: '',
    categoria: 'B',
    validadeCnh: '',
    telefone: '',
    email: '',
    status: 'ativo',
    empresaId: empresaId || ''
  });
  
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [carregandoEmpresas, setCarregandoEmpresas] = useState(false);
  const { toast } = useToast();

  // Efeito para carregar empresas e setar empresa padrão
  useEffect(() => {
    if (isOpen) {
      carregarEmpresas();
      
      if (empresaId) {
        console.log('CadastroMotoristaModal recebeu empresaId:', empresaId);
        setFormData(prev => ({ ...prev, empresaId }));
      }
    }
  }, [isOpen, empresaId]);

  // Carregar lista de empresas
  const carregarEmpresas = async () => {
    try {
      setCarregandoEmpresas(true);
      const empresasData = await EmpresaService.getAll();
      setEmpresas(empresasData);
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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação mais completa
    const camposObrigatorios = [
      { campo: 'nome', label: 'Nome do Motorista' },
      { campo: 'cpf', label: 'CPF' },
      { campo: 'cnh', label: 'CNH' },
      { campo: 'empresaId', label: 'Empresa' },
      { campo: 'telefone', label: 'Telefone' },
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
    
    // Validar CPF e CNH
    const cpfDigits = formData.cpf.replace(/\D/g, '');
    if (cpfDigits.length !== 11) {
      toast({
        title: "CPF Inválido",
        description: "O CPF deve conter 11 dígitos numéricos",
        variant: "destructive",
      });
      return;
    }
    
    const cnhDigits = formData.cnh.replace(/\D/g, '');
    if (cnhDigits.length < 9 || cnhDigits.length > 11) {
      toast({
        title: "CNH Inválida",
        description: "A CNH deve conter entre 9 e 11 dígitos",
        variant: "destructive",
      });
      return;
    }

    onSave({
      ...formData,
      cpf: cpfDigits,
      cnh: cnhDigits,
      dataCadastro: new Date().toISOString().split('T')[0],
      empresaId: formData.empresaId || empresaId
    });
    
    // Reset form
    setFormData({
      nome: '',
      cpf: '',
      cnh: '',
      categoria: 'B',
      validadeCnh: '',
      telefone: '',
      email: '',
      status: 'ativo',
      empresaId: empresaId || ''
    });
    
    // Fechar o modal após salvar
    onClose();
  };

  const handleChange = (key: string, value: string) => {
    // Formatação especial para CPF e CNH
    if (key === 'cpf') {
      // Remove todos os caracteres não numéricos
      const digitsOnly = value.replace(/\D/g, '');
      
      // Aplica a máscara de CPF: XXX.XXX.XXX-XX
      let formatted = '';
      if (digitsOnly.length <= 3) {
        formatted = digitsOnly;
      } else if (digitsOnly.length <= 6) {
        formatted = `${digitsOnly.substring(0, 3)}.${digitsOnly.substring(3)}`;
      } else if (digitsOnly.length <= 9) {
        formatted = `${digitsOnly.substring(0, 3)}.${digitsOnly.substring(3, 6)}.${digitsOnly.substring(6)}`;
      } else {
        formatted = `${digitsOnly.substring(0, 3)}.${digitsOnly.substring(3, 6)}.${digitsOnly.substring(6, 9)}-${digitsOnly.substring(9, 11)}`;
      }
      
      setFormData(prev => ({ ...prev, [key]: formatted }));
    } else if (key === 'cnh') {
      // Remove todos os caracteres não numéricos
      const digitsOnly = value.replace(/\D/g, '');
      
      // Limita ao máximo de 11 dígitos
      const limited = digitsOnly.substring(0, 11);
      
      setFormData(prev => ({ ...prev, [key]: limited }));
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
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Cadastrar Novo Motorista</h3>
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
          {/* Informações Pessoais */}
          <div className="space-y-4">
            <h4 className="text-white font-medium text-lg border-b border-slate-700 pb-2">
              Informações Pessoais
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-slate-300">
                  Nome Completo *
                </Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  className="ajh-input"
                  placeholder="Ex: João da Silva"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-slate-300">
                  CPF *
                </Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => handleChange('cpf', e.target.value)}
                  className="ajh-input"
                  placeholder="Ex: 123.456.789-00"
                />
              </div>
            </div>
          </div>

          {/* Empresa */}
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
                  disabled={!!empresaId} // Desabilitar se for fornecido um empresaId
                >
                  <SelectTrigger className="ajh-input">
                    <SelectValue placeholder="Selecione uma empresa" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 max-h-60">
                    {carregandoEmpresas ? (
                      <SelectItem value="loading" disabled>Carregando empresas...</SelectItem>
                    ) : (
                      empresas.map(empresa => (
                        <SelectItem key={empresa.id} value={empresa.id}>
                          {empresa.nome}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Habilitação */}
          <div className="space-y-4">
            <h4 className="text-white font-medium text-lg border-b border-slate-700 pb-2">
              Informações da CNH
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cnh" className="text-slate-300">
                  Número da CNH *
                </Label>
                <Input
                  id="cnh"
                  value={formData.cnh}
                  onChange={(e) => handleChange('cnh', e.target.value)}
                  className="ajh-input"
                  placeholder="Ex: 12345678901"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria" className="text-slate-300">
                  Categoria
                </Label>
                <Select value={formData.categoria} onValueChange={(value) => handleChange('categoria', value)}>
                  <SelectTrigger className="ajh-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                    <SelectItem value="AB">AB</SelectItem>
                    <SelectItem value="AC">AC</SelectItem>
                    <SelectItem value="AD">AD</SelectItem>
                    <SelectItem value="AE">AE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="validadeCnh" className="text-slate-300">
                  Validade da CNH
                </Label>
                <Input
                  id="validadeCnh"
                  type="date"
                  value={formData.validadeCnh}
                  onChange={(e) => handleChange('validadeCnh', e.target.value)}
                  className="ajh-input"
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
                <Label htmlFor="telefone" className="text-slate-300">
                  Telefone
                </Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleChange('telefone', e.target.value)}
                  className="ajh-input"
                  placeholder="Ex: (11) 98765-4321"
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
                  placeholder="Ex: joao.silva@email.com"
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
                  </SelectContent>
                </Select>
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

export default CadastroMotoristaModal; 