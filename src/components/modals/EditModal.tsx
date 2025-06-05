
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, any>;
  onSave: (data: Record<string, any>) => void;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, title, data, onSave }) => {
  const [formData, setFormData] = useState(data);
  const { toast } = useToast();

  // Atualizar formData quando data mudar
  useEffect(() => {
    setFormData(data);
  }, [data]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast({
      title: "Registro Atualizado",
      description: "As alterações foram salvas com sucesso.",
    });
    onClose();
  };

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Campos que não devem ser editáveis
  const readOnlyFields = ['id', 'dataCredenciamento', 'dataCadastro'];

  // Formatação de labels
  const formatLabel = (key: string) => {
    const labelMap: Record<string, string> = {
      nome: 'Nome',
      razaoSocial: 'Razão Social',
      cnpj: 'CNPJ',
      cpf: 'CPF',
      endereco: 'Endereço',
      cidade: 'Cidade',
      estado: 'Estado',
      cep: 'CEP',
      telefone: 'Telefone',
      email: 'Email',
      responsavel: 'Responsável',
      totalVagas: 'Total de Vagas',
      vagasDisponiveis: 'Vagas Disponíveis',
      valorDiaria: 'Valor da Diária (R$)',
      valorHora: 'Valor da Diária (R$)', // Mapeando o antigo campo para o novo
      placa: 'Placa',
      modelo: 'Modelo',
      marca: 'Marca',
      ano: 'Ano',
      cor: 'Cor',
      categoria: 'Categoria',
      motorista: 'Motorista',
      rg: 'RG',
      cnh: 'CNH',
      telefoneContato: 'Telefone de Contato',
      empresa: 'Empresa'
    };
    return labelMap[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-ajh-dark border border-slate-700 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {Object.entries(formData).filter(([key]) => !readOnlyFields.includes(key)).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="text-slate-300">
                {formatLabel(key)}
              </Label>
              <Input
                id={key}
                value={value || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                className="ajh-input"
                type={key.includes('email') ? 'email' : key.includes('telefone') || key.includes('cnpj') || key.includes('cpf') ? 'tel' : 'text'}
              />
            </div>
          ))}
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
            Salvar Alterações
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
