
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Car } from 'lucide-react';
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

const veiculoSchema = z.object({
  placa: z.string().min(7, 'Placa deve ter formato ABC-1234'),
  modelo: z.string().min(2, 'Modelo é obrigatório'),
  marca: z.string().min(2, 'Marca é obrigatória'),
  ano: z.string().min(4, 'Ano deve ter 4 dígitos'),
  cor: z.string().min(2, 'Cor é obrigatória'),
  empresa: z.string().min(1, 'Empresa é obrigatória'),
  motorista: z.string().optional(),
  status: z.enum(['ativo', 'inativo', 'manutencao']),
});

type VeiculoForm = z.infer<typeof veiculoSchema>;

interface CadastroVeiculoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CadastroVeiculoModal: React.FC<CadastroVeiculoModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  
  const form = useForm<VeiculoForm>({
    resolver: zodResolver(veiculoSchema),
    defaultValues: {
      placa: '',
      modelo: '',
      marca: '',
      ano: '',
      cor: '',
      empresa: '',
      motorista: '',
      status: 'ativo',
    },
  });

  const empresas = [
    'TechCorp Logistics',
    'FastDelivery LTDA',
    'Transportes Brasil',
    'LogiMaster'
  ];

  const motoristas = [
    'João Silva',
    'Maria Santos',
    'Carlos Oliveira',
    'Ana Costa'
  ];

  const onSubmit = (data: VeiculoForm) => {
    console.log('Dados do veículo:', data);
    toast({
      title: "Veículo cadastrado!",
      description: `Veículo ${data.placa} foi cadastrado com sucesso.`,
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] ajh-card">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Car className="w-5 h-5 text-ajh-primary" />
            Cadastrar Novo Veículo
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Preencha os dados para cadastrar um novo veículo no sistema.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="placa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Placa</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="ABC-1234"
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
                name="ano"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Ano</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="2024"
                        type="number"
                        className="ajh-input"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="marca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Marca</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Toyota"
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
                name="modelo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Modelo</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Corolla"
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
              name="cor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Cor</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Branco"
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
              name="motorista"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Motorista (Opcional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="ajh-input">
                        <SelectValue placeholder="Selecione um motorista" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Nenhum motorista</SelectItem>
                      {motoristas.map((motorista) => (
                        <SelectItem key={motorista} value={motorista}>
                          {motorista}
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
                      {(['ativo', 'inativo', 'manutencao'] as const).map((status) => (
                        <Button
                          key={status}
                          type="button"
                          variant={field.value === status ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => field.onChange(status)}
                          className={field.value === status ? 'ajh-button-primary' : 'ajh-button-secondary'}
                        >
                          {status === 'manutencao' ? 'Manutenção' : status.charAt(0).toUpperCase() + status.slice(1)}
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
                Cadastrar Veículo
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CadastroVeiculoModal;
