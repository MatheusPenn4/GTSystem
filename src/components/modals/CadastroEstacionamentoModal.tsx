
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  endereco: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  cidade: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
  cep: z.string().min(8, 'CEP deve ter 8 dígitos'),
  cnpj: z.string().min(14, 'CNPJ deve ter 14 dígitos'),
  responsavel: z.string().min(2, 'Nome do responsável é obrigatório'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  email: z.string().email('Email inválido'),
  totalVagas: z.string().min(1, 'Número de vagas é obrigatório'),
  valorHora: z.string().min(1, 'Valor por hora é obrigatório'),
  status: z.enum(['ativo', 'inativo', 'pendente']),
});

interface EstacionamentoData {
  id: string;
  nome: string;
  endereco: string;
  cidade: string;
  cnpj: string;
  responsavel: string;
  telefone: string;
  email: string;
  totalVagas: number;
  vagasOcupadas: number;
  status: 'ativo' | 'inativo' | 'pendente';
  dataCredenciamento: string;
}

interface CadastroEstacionamentoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estacionamento?: EstacionamentoData | null;
}

const CadastroEstacionamentoModal: React.FC<CadastroEstacionamentoModalProps> = ({
  open,
  onOpenChange,
  estacionamento
}) => {
  const { toast } = useToast();
  const isEditing = !!estacionamento;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: estacionamento?.nome || '',
      endereco: estacionamento?.endereco || '',
      cidade: estacionamento?.cidade || '',
      cep: '',
      cnpj: estacionamento?.cnpj || '',
      responsavel: estacionamento?.responsavel || '',
      telefone: estacionamento?.telefone || '',
      email: estacionamento?.email || '',
      totalVagas: estacionamento?.totalVagas?.toString() || '',
      valorHora: '',
      status: estacionamento?.status || 'pendente',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log('Dados do estacionamento:', values);
      
      toast({
        title: isEditing ? "Estacionamento atualizado!" : "Estacionamento cadastrado!",
        description: `${values.nome} foi ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso.`,
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o estacionamento.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="ajh-modal max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEditing ? 'Editar Estacionamento' : 'Cadastrar Novo Estacionamento'}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {isEditing 
              ? 'Atualize os dados do estacionamento credenciado.'
              : 'Preencha os dados para credenciar um novo estacionamento.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Dados Básicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Nome do Estacionamento</FormLabel>
                    <FormControl>
                      <Input {...field} className="ajh-input" placeholder="Ex: Estacionamento Central" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">CNPJ</FormLabel>
                    <FormControl>
                      <Input {...field} className="ajh-input" placeholder="12.345.678/0001-90" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Endereço */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="endereco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Endereço</FormLabel>
                      <FormControl>
                        <Input {...field} className="ajh-input" placeholder="Rua, número, bairro" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="cep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">CEP</FormLabel>
                    <FormControl>
                      <Input {...field} className="ajh-input" placeholder="12345-678" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Cidade/Estado</FormLabel>
                  <FormControl>
                    <Input {...field} className="ajh-input" placeholder="São Paulo - SP" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dados do Responsável */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="responsavel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Responsável</FormLabel>
                    <FormControl>
                      <Input {...field} className="ajh-input" placeholder="Nome do responsável" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Telefone</FormLabel>
                    <FormControl>
                      <Input {...field} className="ajh-input" placeholder="(11) 99999-9999" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" className="ajh-input" placeholder="contato@estacionamento.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Configurações do Estacionamento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="totalVagas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Total de Vagas</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" className="ajh-input" placeholder="120" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valorHora"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Valor/Hora (R$)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" step="0.01" className="ajh-input" placeholder="5.00" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="ajh-input">
                          <SelectValue placeholder="Selecionar status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-ajh-dark border-slate-700">
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="ajh-button-secondary"
              >
                Cancelar
              </Button>
              <Button type="submit" className="ajh-button-primary">
                {isEditing ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CadastroEstacionamentoModal;
