# Testes do Sistema de Permissões do GTSystem

Este documento descreve os testes implementados para validar o sistema de permissões do GTSystem, incluindo testes unitários e de integração.

## Estrutura de Testes

Os testes para o sistema de permissões estão organizados da seguinte forma:

```
frontend/src/features/auth/
├── hooks/
│   └── usePermission.test.tsx     # Testes unitários para os hooks
├── components/
│   ├── PermissionGate.test.tsx    # Testes unitários para o componente PermissionGate
│   └── PermissionRoute.test.tsx   # Testes unitários para o componente PermissionRoute
└── tests/
    └── permissions.integration.test.tsx # Testes de integração
```

## Testes Unitários

### Hooks de Permissão

Os testes unitários para os hooks de permissão validam:

- `usePermission`: Verifica se o hook retorna corretamente `true` quando o usuário tem a permissão especificada e `false` quando não tem.
- `useMultiplePermissions`: Verifica se o hook funciona corretamente com a opção `requireAll`, retornando `true` apenas quando todas as permissões são atendidas (quando `requireAll=true`) ou quando pelo menos uma permissão é atendida (quando `requireAll=false`).

### Componentes de Permissão

Os testes unitários para os componentes `PermissionGate` e `PermissionRoute` validam:

- **PermissionGate**: Verifica se o componente renderiza corretamente seu conteúdo filho quando o usuário tem permissão e renderiza o componente de fallback quando não tem.
- **PermissionRoute**: Verifica se o componente permite acesso a rotas protegidas quando o usuário tem permissão e redireciona para a página de "não autorizado" quando não tem.

## Testes de Integração

Os testes de integração validam o sistema de permissões como um todo, verificando:

1. Se usuários com perfil de administrador podem acessar páginas administrativas
2. Se usuários sem permissões adequadas são redirecionados para a página de acesso não autorizado
3. Se usuários não autenticados são redirecionados para a página de login
4. Se usuários com múltiplas permissões podem acessar diferentes áreas da aplicação conforme suas permissões

## Executando os Testes

### Via script batch (Windows)

Execute o script `run_permission_tests.bat` na pasta `frontend`:

```bash
cd frontend
.\run_permission_tests.bat
```

### Via npm

Execute os testes usando npm:

```bash
cd frontend
npm run test:permissions
```

Para executar todos os testes com cobertura:

```bash
npm run test:coverage
```

## Configuração dos Testes

Os testes utilizam as seguintes bibliotecas e configurações:

- **Jest**: Framework de testes
- **Testing Library**: Biblioteca para testes de componentes React
- **ts-jest**: Integração do TypeScript com Jest
- **Mocks**: Simulações de autenticação e permissões de usuário

A configuração do Jest está definida em `frontend/jest.config.js`, e os utilitários de teste estão em `frontend/src/test/`.

## Cobertura de Testes

Os testes visam alcançar alta cobertura do sistema de permissões, abrangendo:

- Verificação de permissões únicas e múltiplas
- Diferentes perfis de usuário (admin, manager, operator, client, driver)
- Casos de usuários não autenticados
- Redirecionamentos corretos em caso de acesso não autorizado

## Resolução de Problemas

Se encontrar problemas ao executar os testes:

1. Verifique se todas as dependências de teste estão instaladas:
   ```bash
   npm install --save-dev @testing-library/react @testing-library/react-hooks @testing-library/jest-dom @types/jest jest ts-jest history jest-environment-jsdom
   ```

2. Verifique se o arquivo `setupTests.ts` está configurado corretamente
3. Para problemas com mocks, verifique os arquivos em `frontend/src/test/mocks/` 