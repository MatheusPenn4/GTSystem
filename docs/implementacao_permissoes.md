# Implementação do Sistema de Permissões

Este documento descreve a implementação do sistema de permissões no GTSystem, tanto no backend quanto no frontend.

## Backend

### Modelos

1. **Permission** (backend/ajh_auth/models.py)
   - `code`: Código único da permissão (ex: "manage_users")
   - `name`: Nome da permissão (ex: "Gerenciar Usuários")
   - `description`: Descrição detalhada
   - `created_at`: Data de criação

2. **Role** (atualizado em backend/ajh_auth/models.py)
   - `permissions`: Relação many-to-many com Permission
   - Papéis padrão: admin, manager, operator, driver, client

### Filtros e Decoradores

1. **CompanyFilterMixin** (backend/parkingmgr/filters.py)
   - Mixin para ViewSets que filtra dados automaticamente com base no perfil do usuário
   - Administradores veem todos os dados
   - Empresas (transportadoras) veem apenas dados de sua empresa
   - Estacionamentos veem apenas dados do próprio estacionamento
   - Motoristas veem apenas seus próprios dados

2. **requires_permission** (backend/parkingmgr/decorators.py)
   - Decorador para métodos de ViewSets que verifica se o usuário tem a permissão necessária
   - Lança PermissionDenied se o usuário não tiver a permissão
   - Exemplo: `@requires_permission('manage_parking_spots')`

### Fixtures

1. **initial_permissions.json** (backend/ajh_auth/fixtures)
   - Lista de todas as permissões do sistema
   - 37 permissões implementadas cobrindo todas as funcionalidades

2. **initial_roles.json** (backend/ajh_auth/fixtures)
   - Definição dos papéis padrão
   - Associação entre papéis e permissões

### Management Command

**setup_permissions.py** (backend/ajh_auth/management/commands)
- Carrega fixtures de permissões e papéis
- Associa usuários existentes aos papéis corretos
- Pode ser executado durante a implantação ou após atualizações

### ViewSets

Todas as principais ViewSets foram atualizadas para:
- Estender `CompanyFilterMixin`
- Utilizar `@requires_permission` nos métodos apropriados
- Implementar filtro por usuário/empresa/estacionamento no método `get_queryset()`

Exemplo:
```python
class ParkingRecordViewSet(CompanyFilterMixin, viewsets.ModelViewSet):
    queryset = ParkingRecord.objects.all()
    serializer_class = ParkingRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=True, methods=['post'])
    @requires_permission('manage_parking_spots')
    def checkout(self, request, pk=None):
        # Implementação...
```

## Frontend

### Hooks

1. **usePermission** (frontend/src/features/auth/hooks/usePermission.ts)
   - Verifica se o usuário atual tem uma permissão específica
   - Mapeia os papéis de usuário para as permissões correspondentes
   - Retorna boolean

2. **useMultiplePermissions** (frontend/src/features/auth/hooks/usePermission.ts)
   - Verifica se o usuário tem múltiplas permissões
   - Opção para exigir todas as permissões ou apenas uma delas
   - Retorna boolean

### Componentes

1. **PermissionGate** (frontend/src/features/auth/components/PermissionGate.tsx)
   - Componente de ordem superior para renderização condicional
   - Mostra conteúdo apenas se o usuário tem a permissão necessária
   - Opção para renderizar conteúdo alternativo caso não tenha permissão

2. **PermissionGuard** (frontend/src/features/auth/components/PermissionRoute.tsx)
   - Proteção de rotas baseada em permissões
   - Redireciona para página não autorizada se o usuário não tem permissão
   - Integrado com o React Router

### Layouts

1. **PermissionBasedLayout** (frontend/src/components/layouts/PermissionBasedLayout.tsx)
   - Seleciona automaticamente o layout apropriado com base no papel do usuário
   - Layouts específicos para cada perfil:
     - AdminLayout
     - ManagerLayout
     - CompanyLayout
     - DriverLayout

## Mapeamento de Permissões

O sistema implementa um total de 37 permissões distribuídas entre os diferentes papéis:

### Admin (21 permissões)
- Acesso completo ao sistema
- Gerenciamento de configurações globais
- Visualização de todos os relatórios
- Gerenciamento de usuários, papéis e permissões

### Manager (10 permissões)
- Gerenciamento de estacionamento
- Gerenciamento de vagas e reservas
- Visualização de relatórios do estacionamento
- Configurações do estacionamento

### Operator (5 permissões)
- Operações diárias do estacionamento
- Registro de entrada/saída
- Visualização de status das vagas

### Client (11 permissões)
- Gerenciamento de motoristas e veículos
- Visualização de relatórios da empresa
- Gerenciamento de reservas da empresa

### Driver (7 permissões)
- Criação e visualização de reservas pessoais
- Visualização de estacionamentos e vagas disponíveis
- Visualização de histórico pessoal

## Isolamento de Dados

O sistema implementa isolamento rigoroso de dados:

1. **Nível de ViewSet**: CompanyFilterMixin filtra dados automaticamente
2. **Nível de Ação**: Decorador requires_permission protege endpoints específicos
3. **Nível de UI**: Componentes PermissionGate e PermissionGuard controlam a interface

Isso garante que:
- Cada usuário vê apenas os dados a que tem direito
- Empresas não podem ver dados de outras empresas
- Estacionamentos não podem ver dados de outros estacionamentos
- Motoristas não podem ver dados de outros motoristas

## Benefícios da Implementação

1. **Segurança Aprimorada**
   - Controle granular de acesso
   - Isolamento rigoroso de dados
   - Múltiplas camadas de proteção

2. **UX Personalizada**
   - Interface adaptada ao perfil do usuário
   - Elementos de UI exibidos apenas para usuários autorizados
   - Layouts específicos por papel

3. **Manutenção Simplificada**
   - Sistema centralizado de permissões
   - Fácil adição de novas permissões
   - Código mais limpo e modular

4. **Escalabilidade**
   - Suporte para papéis personalizados no futuro
   - Fácil adição de novos perfis de usuário
   - Estrutura preparada para permissões dinâmicas 