
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Building2 } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const empresaSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  cnpj: z.string().min(14, 'CNPJ deve ter 14 dígitos'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  endereco: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  status: z.enum(['ativo', 'inativo', 'pendente']),
});

type EmpresaForm = z.infer<typeof empresaSchema>;

interface CadastroEmpresaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CadastroEmpresaModal: React.FC<CadastroEmpresaModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  
  const form = useForm<EmpresaForm>({
    resolver: zodResolver(empresaSchema),
    defaultValues: {
      nome: '',
      cnpj: '',
      email: '',
      telefone: '',
      endereco: '',
      status: 'pendente',
    },
  });

  const onSubmit = (data: EmpresaForm) => {
    console.log('Dados da empresa:', data);
    toast({
      title: "Empresa cadastrada!",
      description: `${data.nome} foi cadastrada com sucesso.`,
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] ajh-card">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-ajh-primary" />
            Cadastrar Nova Empresa
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Preencha os dados para cadastrar uma nova empresa no sistema.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Nome da Empresa</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: TechCorp Logistics"
                      className="ajh-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">CNPJ</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="12.345.678/0001-90"
                        className="ajh-input"
                        {...field}
                      />
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
                      <Input 
                        placeholder="(11) 99999-9999"
                        className="ajh-input"
                        {...field}
                      />
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
                    <Input 
                      type="email"
                      placeholder="contato@empresa.com"
                      className="ajh-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endereco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Endereço</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Rua, Cidade, Estado"
                      className="ajh-input"
                      {...field}
                    />
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
                  <FormControl>
                    <div className="flex gap-2">
                      {(['ativo', 'inativo', 'pendente'] as const).map((status) => (
                        <Button
                          key={status}
                          type="button"
                          variant={field.value === status ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => field.onChange(status)}
                          className={field.value === status ? 'ajh-button-primary' : 'ajh-button-secondary'}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="ajh-button-secondary"
              >
                Cancelar
              </Button>
              <Button type="submit" className="ajh-button-primary">
                Cadastrar Empresa
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CadastroEmpresaModal;
