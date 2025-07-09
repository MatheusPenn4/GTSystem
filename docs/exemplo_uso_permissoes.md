# Exemplos de Uso do Sistema de Permissões

Este documento apresenta exemplos práticos de uso do sistema de permissões implementado no GTSystem.

## Exemplo 1: Página de Gerenciamento de Usuários

Neste exemplo, criamos uma página de gerenciamento de usuários que adapta sua interface com base nas permissões do usuário atual.

```tsx
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { PermissionGate } from '@/features/auth/components/PermissionGate';
import usePermission from '@/features/auth/hooks/usePermission';
import { api } from '@/lib/api';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Verificar permissões específicas
  const canCreateUsers = usePermission('create_users');
  const canEditUsers = usePermission('edit_users');
  const canDeleteUsers = usePermission('delete_users');
  const canViewInactiveUsers = usePermission('view_inactive_users');
  
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/users/');
        setUsers(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Filtrar usuários inativos se não tiver permissão
  const filteredUsers = canViewInactiveUsers 
    ? users 
    : users.filter(user => user.is_active);
  
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
        
        {/* Botão de criar usuário - visível apenas se tiver permissão */}
        <PermissionGate permission="create_users">
          <Button>Adicionar Usuário</Button>
        </PermissionGate>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Papel</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                {user.is_active ? (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    Ativo
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                    Inativo
                  </span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {/* Botão de editar - visível apenas se tiver permissão */}
                  <PermissionGate permission="edit_users">
                    <Button variant="outline" size="sm">Editar</Button>
                  </PermissionGate>
                  
                  {/* Botão de excluir - visível apenas se tiver permissão */}
                  <PermissionGate permission="delete_users">
                    <Button variant="destructive" size="sm">Excluir</Button>
                  </PermissionGate>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Mensagem condicional baseada em permissão */}
      <PermissionGate 
        permission="view_inactive_users"
        fallback={
          <p className="text-sm text-gray-500 mt-4">
            Nota: Usuários inativos não são exibidos. Entre em contato com um administrador para visualizá-los.
          </p>
        }
      >
        <p className="text-sm text-gray-500 mt-4">
          Exibindo todos os usuários, incluindo inativos.
        </p>
      </PermissionGate>
    </div>
  );
};

export default UserManagement;
```

## Exemplo 2: Proteção de Rota para Dashboard Administrativo

Neste exemplo, protegemos a rota para o dashboard administrativo usando o componente `PermissionGuard`.

```tsx
// Em Router.tsx
import { PermissionGuard } from '@/features/auth/components/PermissionRoute';
import AdminDashboard from '@/pages/admin/Dashboard';

// No componente de rotas
<Route path="/admin/dashboard" element={
  <PermissionGuard 
    permission="view_admin_dashboard"
    redirectTo="/unauthorized"
  >
    <AdminDashboard />
  </PermissionGuard>
} />
```

## Exemplo 3: Componente de Formulário Condicional

Neste exemplo, adaptamos um formulário com base nas permissões do usuário.

```tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { PermissionGate } from '@/features/auth/components/PermissionGate';
import usePermission, { useMultiplePermissions } from '@/features/auth/hooks/usePermission';

const VehicleForm: React.FC = () => {
  // Verificar permissões
  const canEditAdvanced = usePermission('edit_vehicle_advanced');
  const canEditStatus = usePermission('edit_vehicle_status');
  const canManageDocuments = usePermission('manage_vehicle_documents');
  
  // Verificar combinação de permissões (pelo menos uma)
  const canApproveOrReject = useMultiplePermissions(
    ['approve_vehicle', 'reject_vehicle'], 
    false
  );
  
  // Estados do formulário seriam adicionados aqui...
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Cadastro de Veículo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Campos básicos - visíveis para todos */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="plate" className="text-sm font-medium">Placa</label>
            <Input id="plate" placeholder="ABC-1234" />
          </div>
          <div className="space-y-2">
            <label htmlFor="model" className="text-sm font-medium">Modelo</label>
            <Input id="model" placeholder="Modelo do veículo" />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">Descrição</label>
          <Textarea id="description" placeholder="Descrição do veículo" />
        </div>
        
        {/* Campos avançados - visíveis apenas com permissão específica */}
        <PermissionGate permission="edit_vehicle_advanced">
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium">Configurações Avançadas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="chassis" className="text-sm font-medium">Chassis</label>
                <Input id="chassis" placeholder="Número do chassis" />
              </div>
              <div className="space-y-2">
                <label htmlFor="engine" className="text-sm font-medium">Motor</label>
                <Input id="engine" placeholder="Número do motor" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="technical_details" className="text-sm font-medium">Detalhes Técnicos</label>
              <Textarea id="technical_details" placeholder="Informações técnicas adicionais" />
            </div>
          </div>
        </PermissionGate>
        
        {/* Controles de status - visíveis apenas com permissão específica */}
        <PermissionGate permission="edit_vehicle_status">
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium">Status do Veículo</h3>
            <div className="flex items-center justify-between">
              <span>Veículo ativo</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span>Manutenção programada</span>
              <Switch />
            </div>
          </div>
        </PermissionGate>
        
        {/* Documentos - visíveis apenas com permissão específica */}
        <PermissionGate permission="manage_vehicle_documents">
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium">Documentação</h3>
            <div className="space-y-2">
              <label htmlFor="doc_upload" className="text-sm font-medium">Upload de Documentos</label>
              <Input id="doc_upload" type="file" />
            </div>
          </div>
        </PermissionGate>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancelar</Button>
        
        <div className="space-x-2">
          {/* Botões de aprovação - visíveis apenas com permissões específicas */}
          <PermissionGate permissions={['approve_vehicle', 'reject_vehicle']} requireAll={false}>
            <div className="space-x-2">
              <PermissionGate permission="reject_vehicle">
                <Button variant="destructive">Rejeitar</Button>
              </PermissionGate>
              <PermissionGate permission="approve_vehicle">
                <Button variant="outline" className="bg-green-50 border-green-200 text-green-700">
                  Aprovar
                </Button>
              </PermissionGate>
            </div>
          </PermissionGate>
          
          {/* Botão de salvar - sempre visível */}
          <Button>Salvar</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VehicleForm;
```

## Exemplo 4: Menu de Navegação Adaptativo

Neste exemplo, criamos um menu de navegação que adapta suas opções com base nas permissões do usuário.

```tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PermissionGate } from '@/features/auth/components/PermissionGate';

interface NavItemProps {
  href: string;
  label: string;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  icon?: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ 
  href, 
  label, 
  permission, 
  permissions, 
  requireAll = true,
  icon 
}) => {
  const location = useLocation();
  const isActive = location.pathname === href;
  
  // Se não houver requisito de permissão, sempre mostrar
  if (!permission && (!permissions || permissions.length === 0)) {
    return (
      <Link
        to={href}
        className={`flex items-center px-4 py-2 text-sm rounded-md ${
          isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        {icon && <span className="mr-3">{icon}</span>}
        {label}
      </Link>
    );
  }
  
  // Renderização condicional baseada em permissão
  return (
    <PermissionGate 
      permission={permission} 
      permissions={permissions}
      requireAll={requireAll}
    >
      <Link
        to={href}
        className={`flex items-center px-4 py-2 text-sm rounded-md ${
          isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        {icon && <span className="mr-3">{icon}</span>}
        {label}
      </Link>
    </PermissionGate>
  );
};

const Navigation: React.FC = () => {
  return (
    <nav className="space-y-1">
      {/* Item sempre visível */}
      <NavItem href="/dashboard" label="Dashboard" icon={<span>📊</span>} />
      
      {/* Itens condicionais baseados em permissões específicas */}
      <NavItem 
        href="/users" 
        label="Usuários" 
        permission="view_users" 
        icon={<span>👥</span>} 
      />
      
      <NavItem 
        href="/companies" 
        label="Empresas" 
        permission="view_companies" 
        icon={<span>🏢</span>} 
      />
      
      <NavItem 
        href="/parking-lots" 
        label="Estacionamentos" 
        permission="view_parking_lots" 
        icon={<span>🅿️</span>} 
      />
      
      <NavItem 
        href="/reports" 
        label="Relatórios" 
        permissions={['view_admin_reports', 'view_manager_reports']} 
        requireAll={false}
        icon={<span>📈</span>} 
      />
      
      <NavItem 
        href="/settings" 
        label="Configurações" 
        permission="view_settings" 
        icon={<span>⚙️</span>} 
      />
    </nav>
  );
};

export default Navigation;
```

Estes exemplos demonstram como o sistema de permissões pode ser usado para criar interfaces adaptativas que mostram apenas os elementos relevantes para cada usuário com base em suas permissões específicas.
