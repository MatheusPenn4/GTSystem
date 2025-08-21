import React, { useState, useEffect } from 'react';
import { X, User, Mail, Key, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface CadastroUsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: any) => void;
}

interface Empresa {
  id: string;
  name: string;
  tipo: 'TRANSPORTADORA' | 'ESTACIONAMENTO';
}

const CadastroUsuarioModal: React.FC<CadastroUsuarioModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    companyId: '',
  });
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadEmpresas();
    }
  }, [isOpen]);

  const loadEmpresas = async () => {
    try {
      console.log('Carregando empresas reais do banco de dados...');
      // TODO: Implementar chamada real à API de empresas
      // const empresasFromAPI = await CompanyService.getAll();
      // setEmpresas(empresasFromAPI);
      
      // Por enquanto, lista vazia - sem dados fictícios
      setEmpresas([]);
      console.log('Empresas carregadas: 0 (sem dados fictícios)');
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
      setEmpresas([]);
    }
  };

  useEffect(() => {
    // Reset company when role changes
    if (formData.role === 'admin') {
      setFormData(prev => ({ ...prev, companyId: '' }));
    }
  }, [formData.role]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Erro de validação",
        description: "Nome é obrigatório",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast({
        title: "Erro de validação",
        description: "E-mail válido é obrigatório",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.password.trim() || formData.password.length < 6) {
      toast({
        title: "Erro de validação",
        description: "Senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro de validação",
        description: "Senhas não coincidem",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.role) {
      toast({
        title: "Erro de validação",
        description: "Tipo de usuário é obrigatório",
        variant: "destructive",
      });
      return false;
    }

    if ((formData.role === 'transportadora' || formData.role === 'estacionamento') && !formData.companyId) {
      toast({
        title: "Erro de validação",
        description: "Empresa é obrigatória para este tipo de usuário",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const selectedCompany = empresas.find(e => e.id === formData.companyId);
      
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        companyId: formData.companyId || undefined,
        companyName: selectedCompany?.name || undefined,
      };

      onSave(userData);
      handleClose();
    } catch (error) {
      toast({
        title: "Erro ao cadastrar usuário",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      companyId: '',
    });
    onClose();
  };

  const getFilteredEmpresas = () => {
    if (formData.role === 'transportadora') {
      return empresas.filter(e => e.tipo === 'TRANSPORTADORA');
    }
    if (formData.role === 'estacionamento') {
      return empresas.filter(e => e.tipo === 'ESTACIONAMENTO');
    }
    return empresas;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="ajh-modal max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            Cadastrar Novo Usuário
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Nome */}
          <div>
            <Label htmlFor="name" className="text-slate-300">Nome completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Digite o nome completo"
              className="ajh-input"
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-slate-300">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Digite o e-mail"
              className="ajh-input"
            />
          </div>

          {/* Senha */}
          <div>
            <Label htmlFor="password" className="text-slate-300">Senha</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Digite a senha (mín. 6 caracteres)"
              className="ajh-input"
            />
          </div>

          {/* Confirmar Senha */}
          <div>
            <Label htmlFor="confirmPassword" className="text-slate-300">Confirmar senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirme a senha"
              className="ajh-input"
            />
          </div>

          {/* Tipo de Usuário */}
          <div>
            <Label className="text-slate-300">Tipo de usuário</Label>
            <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
              <SelectTrigger className="ajh-input">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="transportadora">Transportadora</SelectItem>
                <SelectItem value="estacionamento">Estacionamento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Empresa (apenas para não-admin) */}
          {(formData.role === 'transportadora' || formData.role === 'estacionamento') && (
            <div>
              <Label className="text-slate-300">Empresa</Label>
              <Select value={formData.companyId} onValueChange={(value) => handleInputChange('companyId', value)}>
                <SelectTrigger className="ajh-input">
                  <SelectValue placeholder="Selecione a empresa" />
                </SelectTrigger>
                <SelectContent>
                  {getFilteredEmpresas().map((empresa) => (
                    <SelectItem key={empresa.id} value={empresa.id}>
                      {empresa.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1 ajh-btn-secondary"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 ajh-btn ajh-btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CadastroUsuarioModal; 