# Documentação do Modelo de Dados

## Módulo de Estacionamento (parking)

### ParkingLot

Modelo para gerenciamento de estacionamentos

- **name**: Nome do estacionamento (CharField, max_length=100)
- **address**: Endereço do estacionamento (CharField, max_length=200)
- **total_spots**: Total de vagas disponíveis (IntegerField)
- **company**: Relacionamento com a empresa proprietária (ForeignKey -> Company)
- **created_at**: Data de criação (DateTimeField, auto_now_add=True)
- **updated_at**: Data de atualização (DateTimeField, auto_now=True)

### ParkingSpot

Modelo para controle de vagas individuais

- **number**: Número da vaga (CharField, max_length=10)
- **is_occupied**: Status de ocupação (BooleanField, default=False)
- **parking_lot**: Relacionamento com o estacionamento (ForeignKey -> ParkingLot)

### ParkingRecord

Modelo para registro de entrada/saída de veículos

- **vehicle_plate**: Placa do veículo (CharField, max_length=10)
- **entry_time**: Horário de entrada (DateTimeField, auto_now_add=True)
- **exit_time**: Horário de saída (DateTimeField, null=True, blank=True)
- **fee**: Valor cobrado (DecimalField, max_digits=10, decimal_places=2, null=True, blank=True)
- **spot**: Vaga utilizada (ForeignKey -> ParkingSpot)
- **created_by**: Usuário que registrou (ForeignKey -> User)

## Módulo de Autenticação (authentication)

### User

Extensão do modelo padrão do Django

- **phone**: Número de telefone (CharField, max_length=15, null=True, blank=True)
- **is_company_admin**: Flag para administrador da empresa (BooleanField, default=False)

## Melhorias Necessárias

### 1. Módulo de Estacionamento

- Adicionar campo para tipo de vaga (normal, preferencial, etc)
- Adicionar campo para status da vaga (manutenção, reservada, etc)
- Adicionar campos para controle de preços por período
- Implementar relacionamento com transportadora
- Adicionar campos para controle de pagamento

### 2. Módulo de Autenticação

- Implementar sistema de roles mais robusto
- Adicionar campos para controle de permissões por filial
- Adicionar campos para controle de plano e status
- Implementar sistema de logs de ações

### 3. Novos Modelos Necessários

- Transportadora
- Plano
- Filial
- Log de Ações
- Configuração de Preços
- Histórico de Pagamentos

## Próximos Passos

1. Implementar sistema de roles
2. Adicionar campos para controle de filiais
3. Criar modelos para transportadoras e planos
4. Implementar sistema de logs
5. Adicionar validações de negócio
