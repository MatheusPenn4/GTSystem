# Guia de Componentes de Permissões

Este guia explica como utilizar os componentes de permissões implementados no GTSystem para criar interfaces adaptativas baseadas em perfis de usuário.

## Hooks de Permissão

### `usePermission`

Verifica se o usuário atual possui uma permissão específica.

```tsx
import usePermission from '@/features/auth/hooks/usePermission';

const MyComponent = () => {
  const canViewAdminDashboard = usePermission('view_admin_dashboard');
  
  return (
    <div>
      {canViewAdminDashboard && <p>Você tem acesso ao painel administrativo.</p>}
    </div>
  );
};
```

### `useMultiplePermissions`

Verifica se o usuário atual possui um conjunto de permissões.

```tsx
import { useMultiplePermissions } from '@/features/auth/hooks/usePermission';

const MyComponent = () => {
  // requireAll = true (padrão): usuário precisa ter todas as permissões
  const canManageUsers = useMultiplePermissions(['view_users', 'edit_users', 'delete_users']);
  
  // requireAll = false: usuário precisa ter pelo menos uma das permissões
  const canViewReports = useMultiplePermissions(['view_parking_reports', 'view_company_reports'], false);
  
  return (
    <div>
      {canManageUsers && <p>Você pode gerenciar usuários completamente.</p>}
      {canViewReports && <p>Você pode visualizar algum tipo de relatório.</p>}
    </div>
  );
};
```

## Componentes de UI

### `PermissionGate`

Renderiza conteúdo condicionalmente com base nas permissões do usuário.

```tsx
import { PermissionGate } from '@/features/auth/components/PermissionGate';

const MyComponent = () => {
  return (
    <div>
      {/* Usando permissão única */}
      <PermissionGate permission="manage_users">
        <UserManagementPanel />
      </PermissionGate>
      
      {/* Usando múltiplas permissões (precisa de todas) */}
      <PermissionGate permissions={['edit_company', 'delete_company']}>
        <CompanyAdminActions />
      </PermissionGate>
      
      {/* Usando múltiplas permissões (precisa de pelo menos uma) */}
      <PermissionGate 
        permissions={['view_parking_reports', 'view_company_reports']} 
        requireAll={false}
      >
        <ReportsSection />
      </PermissionGate>
      
      {/* Com conteúdo alternativo */}
      <PermissionGate 
        permission="manage_system_settings"
        fallback={<p>Você não tem permissão para acessar as configurações.</p>}
      >
        <SystemSettings />
      </PermissionGate>
    </div>
  );
};
```

### `PermissionGuard`

Protege rotas baseado em permissões. Usado diretamente no roteador.

```tsx
import { PermissionGuard } from '@/features/auth/components/PermissionRoute';
import UserManagement from '@/pages/admin/UserManagement';

// No componente de rotas
<Route path="/admin/users" element={
  <PermissionGuard permission="manage_users">
    <UserManagement />
  </PermissionGuard>
} />

// Com múltiplas permissões
<Route path="/admin/settings" element={
  <PermissionGuard 
    permissions={['manage_system_settings', 'view_system_settings']}
    requireAll={false}
    redirectTo="/custom-unauthorized"
  >
    <Settings />
  </PermissionGuard>
} />
```

## Layouts Baseados em Permissões

### `PermissionBasedLayout`

Seleciona automaticamente o layout apropriado com base no papel do usuário atual.

```tsx
import PermissionBasedLayout from '@/layouts/PermissionBasedLayout';

// No componente de rotas
<Route element={<PermissionBasedLayout><Outlet /></PermissionBasedLayout>}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/profile" element={<Profile />} />
  {/* Outras rotas... */}
</Route>
```

## Página de Acesso Não Autorizado

A página `Unauthorized` é exibida quando um usuário tenta acessar uma rota para a qual não possui permissão.

```tsx
// No componente de rotas
<Route path="/unauthorized" element={<Unauthorized />} />
```

## Combinando Componentes

Exemplo de uso combinado dos componentes:

```tsx
const MyPage = () => {
  return (
    <div>
      <h1>Dashboard da Empresa</h1>
      
      {/* Seção visível para todos */}
      <section>
        <h2>Informações Gerais</h2>
        <p>Esta seção é visível para todos os usuários.</p>
      </section>
      
      {/* Seção visível apenas para quem pode gerenciar veículos */}
      <PermissionGate permission="manage_company_vehicles">
        <section>
          <h2>Gerenciamento de Veículos</h2>
          <p>Esta seção é visível apenas para usuários que podem gerenciar veículos.</p>
          
          <Button>Adicionar Veículo</Button>
          
          {/* Nested permission check */}
          <PermissionGate permission="delete_company_vehicles">
            <Button variant="destructive">Remover Veículo</Button>
          </PermissionGate>
        </section>
      </PermissionGate>
      
      {/* Seção com conteúdo alternativo */}
      <PermissionGate 
        permission="view_company_reports"
        fallback={<p>Você não possui permissão para visualizar relatórios.</p>}
      >
        <section>
          <h2>Relatórios</h2>
          <p>Esta seção mostra relatórios importantes para a empresa.</p>
        </section>
      </PermissionGate>
    </div>
  );
};
```

## Melhores Práticas

1. **Granularidade das Permissões**
   - Use permissões específicas para ações específicas
   - Evite permissões muito genéricas que concedem acesso amplo

2. **Combinação de Permissões**
   - Use `useMultiplePermissions` com `requireAll=false` para verificar permissões alternativas
   - Use `useMultiplePermissions` com `requireAll=true` para verificar permissões combinadas

3. **UX para Acesso Negado**
   - Forneça feedback claro quando o acesso for negado
   - Ofereça alternativas ou orientações sobre como obter acesso

4. **Desempenho**
   - Evite verificações de permissão desnecessárias
   - Considere armazenar em cache os resultados de verificações frequentes

5. **Manutenção**
   - Mantenha uma lista centralizada de todas as permissões usadas
   - Documente quais permissões são necessárias para cada funcionalidade 