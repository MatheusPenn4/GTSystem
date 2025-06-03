
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Users } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const motoristaSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos'),
  cnh: z.string().min(11, 'CNH deve ter 11 dígitos'),
  categoria: z.enum(['A', 'B', 'C', 'D', 'E']),
  validade: z.string().min(1, 'Data de validade é obrigatória'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  email: z.string().email('Email inválido'),
  empresa: z.string().min(1, 'Empresa é obrigatória'),
  veiculo: z.string().optional(),
  status: z.enum(['ativo', 'inativo', 'licenca']),
});

type MotoristaForm = z.infer<typeof motoristaSchema>;

interface CadastroMotoristaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CadastroMotoristaModal: React.FC<CadastroMotoristaModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  
  const form = useForm<MotoristaForm>({
    resolver: zodResolver(motoristaSchema),
    defaultValues: {
      nome: '',
      cpf: '',
      cnh: '',
      categoria: 'B',
      validade: '',
      telefone: '',
      email: '',
      empresa: '',
      veiculo: '',
      status: 'ativo',
    },
  });

  const empresas = [
    'TechCorp Logistics',
    'FastDelivery LTDA',
    'Transportes Brasil',
    'LogiMaster'
  ];

  const veiculos = [
    'ABC-1234',
    'XYZ-9876',
    'DEF-5678',
    'GHI-9012'
  ];

  const onSubmit = (data: MotoristaForm) => {
    console.log('Dados do motorista:', data);
    toast({
      title: "Motorista cadastrado!",
      description: `${data.nome} foi cadastrado com sucesso.`,
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] ajh-card">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-ajh-primary" />
            Cadastrar Novo Motorista
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Preencha os dados para cadastrar um novo motorista no sistema.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Nome Completo</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="João Silva"
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
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">CPF</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="123.456.789-00"
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
                      placeholder="joao@email.com"
                      className="ajh-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="cnh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">CNH</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="12345678901"
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
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="ajh-input">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['A', 'B', 'C', 'D', 'E'].map((categoria) => (
                          <SelectItem key={categoria} value={categoria}>
                            {categoria}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="validade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Validade</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
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
              name="empresa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Empresa</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="ajh-input">
                        <SelectValue placeholder="Selecione uma empresa" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {empresas.map((empresa) => (
                        <SelectItem key={empresa} value={empresa}>
                          {empresa}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="veiculo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Veículo (Opcional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="ajh-input">
                        <SelectValue placeholder="Selecione um veículo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Nenhum veículo</SelectItem>
                      {veiculos.map((veiculo) => (
                        <SelectItem key={veiculo} value={veiculo}>
                          {veiculo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      {(['ativo', 'inativo', 'licenca'] as const).map((status) => (
                        <Button
                          key={status}
                          type="button"
                          variant={field.value === status ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => field.onChange(status)}
                          className={field.value === status ? 'ajh-button-primary' : 'ajh-button-secondary'}
                        >
                          {status === 'licenca' ? 'Licença' : status.charAt(0).toUpperCase() + status.slice(1)}
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
                Cadastrar Motorista
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CadastroMotoristaModal;
