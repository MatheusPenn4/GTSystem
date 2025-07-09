# 🚗 Sistema de Gestão AJH - Completo

Sistema completo de gestão empresarial com foco em controle de veículos, motoristas e estacionamentos.

## 📁 **Estrutura do Projeto**

```
AJH/
├── backend/                 # Django API
│   ├── ajh_backend/        # Configurações Django
│   ├── company/            # App de empresas e veículos
│   ├── parking/            # App de estacionamento
│   ├── users/              # App de usuários
│   ├── manage.py
│   ├── requirements.txt
│   └── README.md
├── frontend/               # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Componentes Shadcn/UI
│   │   │   └── ui/         # Componentes base
│   │   ├── contexts/       # Context API
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Serviços API
│   │   └── lib/            # Utilitários
│   ├── package.json
│   └── README.md
├── docs/                   # Documentação
├── .gitignore
└── README.md
```

## ✨ **Funcionalidades**

### 🏢 **Gestão de Empresas**
- ✅ CRUD completo de empresas
- ✅ Gestão de filiais
- ✅ Associação com veículos e motoristas

### 🚗 **Gestão de Veículos**
- ✅ Cadastro completo da frota
- ✅ Controle de status (ativo, manutenção, inativo)
- ✅ Associação com motoristas
- ✅ Validação de placas (padrão brasileiro)

### 👨‍💼 **Gestão de Motoristas**
- ✅ Cadastro com dados de CNH
- ✅ Controle de categorias
- ✅ Validação de vencimento
- ✅ Associação com veículos

### 🅿️ **Sistema de Estacionamento**
- ✅ Gestão de estacionamentos
- ✅ Controle de vagas em tempo real
- ✅ Registro de entrada/saída
- ✅ Histórico de movimentações

### 🔐 **Autenticação e Segurança**
- ✅ JWT com refresh tokens
- ✅ Permissões por usuário
- ✅ CORS configurado
- ✅ Validações robustas

## 🛠 **Tecnologias Utilizadas**

### Backend
- **Django 4.2** + Django REST Framework
- **PostgreSQL** (produção) / SQLite (desenvolvimento)
- **JWT Authentication** com SimpleJWT
- **CORS Headers** para integração frontend
- **Django Extensions** para desenvolvimento

### Frontend
- **React 18** com TypeScript
- **Shadcn/UI** + **Radix UI** para componentes
- **Tailwind CSS** para estilização
- **React Query** para gerenciamento de estado servidor
- **React Router** para navegação
- **React Hook Form** + **Zod** para formulários e validação
- **Vite** como bundler e dev server
- **Lucide React** para ícones

## 🚀 **Como executar o projeto completo**

### Execução no Windows com PowerShell

Para executar o sistema no Windows usando PowerShell, utilize os scripts fornecidos:

```powershell
# Iniciar apenas o frontend (conecta ao backend real)
.\start_frontend.ps1

# OU iniciar o sistema completo (backend + frontend)
.\start_system.ps1
```

Para mais detalhes, consulte a documentação em `docs/execucao_sistema.md`.

### Método Automático (Recomendado)

No Windows, basta executar o script de configuração:

```bash
# Navegar para o diretório backend
cd backend

# Executar o script de configuração
scripts\setup_system.bat
```

Este script vai:
1. Verificar os requisitos do sistema
2. Instalar as dependências necessárias
3. Configurar o banco de dados PostgreSQL
4. Aplicar as migrações
5. Configurar o sistema de permissões
6. Criar um superusuário padrão

Após a configuração, inicie o servidor:

```bash
python manage.py runserver
```

### Método Tradicional

#### 1. Backend (Django)

```bash
# Clone o repositório
git clone https://github.com/MatheusPenn4/Ajh-Sistema.git
cd Ajh-Sistema/backend

# Crie um ambiente virtual
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate

# Instale as dependências
pip install -r requirements.txt

# Configure o banco de dados
python manage.py migrate

# Configure as permissões
python manage.py setup_permissions
python manage.py update_user_permissions

# Crie um superusuário
python manage.py createsuperuser

# Execute o servidor
python manage.py runserver
```

O backend estará disponível em: `http://localhost:8000`

#### 2. Frontend (React)

```bash
# Em outro terminal, navegue para o frontend
cd ajh-sistema/frontend

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

## 📚 **Documentação da API**

### Endpoints principais:

```
# Autenticação
POST /api/auth/login/           # Login
POST /api/auth/refresh/         # Refresh token
POST /api/auth/logout/          # Logout

# Empresas
GET    /api/company/companies/  # Listar empresas
POST   /api/company/companies/  # Criar empresa
GET    /api/company/companies/{id}/  # Detalhes da empresa
PUT    /api/company/companies/{id}/  # Atualizar empresa
DELETE /api/company/companies/{id}/  # Excluir empresa

# Veículos
GET    /api/company/vehicles/   # Listar veículos
POST   /api/company/vehicles/   # Criar veículo
GET    /api/company/vehicles/{id}/   # Detalhes do veículo
PUT    /api/company/vehicles/{id}/   # Atualizar veículo
DELETE /api/company/vehicles/{id}/   # Excluir veículo

# Motoristas
GET    /api/company/drivers/    # Listar motoristas
POST   /api/company/drivers/    # Criar motorista
GET    /api/company/drivers/{id}/    # Detalhes do motorista
PUT    /api/company/drivers/{id}/    # Atualizar motorista
DELETE /api/company/drivers/{id}/    # Excluir motorista

# Estacionamentos
GET    /api/parking/lots/       # Listar estacionamentos
POST   /api/parking/lots/       # Criar estacionamento
GET    /api/parking/spots/      # Listar vagas
POST   /api/parking/vehicle-entry/  # Registrar entrada
POST   /api/parking/vehicle-exit/   # Registrar saída
GET    /api/parking/records/    # Histórico de movimentações
```

## 🔧 **Configuração do Ambiente**

### Backend (.env)
```env
DEBUG=True
SECRET_KEY=sua-chave-secreta-aqui
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000
```

## 📦 **Deploy**

### Backend (Django)
- Configure PostgreSQL
- Use Gunicorn como WSGI server
- Configure nginx como proxy reverso
- Use variáveis de ambiente para configurações

### Frontend (React)
- Build: `npm run build`
- Servir pasta `dist/` com nginx
- Configure CORS no backend para domínio de produção

## 🧪 **Testes**

### Backend
```bash
cd backend
python manage.py test
```

### Frontend
```bash
cd frontend
npm run test
```

## 📊 **Scripts Úteis**

### Backend
```bash
# Executar migrações
python manage.py makemigrations
python manage.py migrate

# Carregar dados de exemplo
python manage.py loaddata fixtures/sample_data.json

# Configurar permissões
python manage.py setup_permissions
python manage.py update_user_permissions

# Collectstatic (produção)
python manage.py collectstatic
```

### Frontend
```bash
# Lint e formatação
npm run lint
npm run format

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🎯 **Roadmap**

- [ ] Dashboard com gráficos em tempo real
- [ ] Sistema de notificações
- [ ] App mobile (React Native)
- [ ] Relatórios em PDF
- [ ] Integração com mapas
- [ ] Sistema de backup automático
- [ ] API de terceiros (consulta CNH, etc.)

## 💬 **Suporte**

Para dúvidas ou suporte:
- 📧 Email: suporte@ajh-sistema.com
- 🐛 Issues: [GitHub Issues](https://github.com/MatheusPenn4/Ajh-Sistema/issues)
- 📖 Wiki: [GitHub Wiki](https://github.com/MatheusPenn4/Ajh-Sistema/wiki)

---

**Desenvolvido com ❤️ para otimizar a gestão empresarial**

## Configuração do PostgreSQL no Windows

Este projeto utiliza exclusivamente PostgreSQL como banco de dados. Para configurar o ambiente de desenvolvimento no Windows, siga as etapas abaixo:

### Pré-requisitos

1. **Visual C++ Build Tools**: Necessário para compilar extensões Python nativas no Windows.
2. **PostgreSQL**: Banco de dados relacional utilizado pelo sistema.
3. **psycopg2**: Driver Python para PostgreSQL.

### Instalação rápida

1. Execute o script de configuração automática:

```powershell
.\setup_postgres.ps1
```

Este script irá:
- Verificar se o PostgreSQL está instalado
- Instalar o driver psycopg2
- Testar a conexão com o banco de dados
- Criar o banco de dados e usuário se necessário
- Executar migrações do Django

### Instalação manual

Se preferir instalar manualmente, siga o guia detalhado:

```
docs/guia_instalacao_postgresql_windows.md
```

### Configuração do banco de dados

O sistema está configurado para usar as seguintes credenciais:

- **Nome do banco**: GTSystem
- **Usuário**: postgres
- **Senha**: 2005
- **Host**: localhost
- **Porta**: 5432

Se precisar alterar estas configurações, edite o arquivo `backend/parkingmgr/settings.py`.

## Novas APIs para o Frontend

O sistema foi atualizado para suportar as seguintes APIs para o frontend:

### 1. Autenticação
- POST /api/auth/login - Login no sistema
- POST /api/auth/logout - Logout do sistema
- POST /api/auth/refresh - Renovar token de acesso
- GET  /api/auth/me - Dados do usuário logado

### 2. Usuários
- GET    /api/users - Listar usuários
- POST   /api/users - Criar usuário
- GET    /api/users/:id - Detalhar usuário
- PUT    /api/users/:id - Atualizar usuário
- DELETE /api/users/:id - Remover usuário

### 3. Empresas
- GET    /api/company/empresas - Listar empresas
- POST   /api/company/empresas - Criar empresa
- GET    /api/company/empresas/:id - Detalhar empresa
- PUT    /api/company/empresas/:id - Atualizar empresa
- DELETE /api/company/empresas/:id - Remover empresa

### 4. Motoristas
- GET    /api/company/motoristas - Listar motoristas
- POST   /api/company/motoristas - Criar motorista
- GET    /api/company/motoristas/:id - Detalhar motorista
- PUT    /api/company/motoristas/:id - Atualizar motorista
- DELETE /api/company/motoristas/:id - Remover motorista
- GET    /api/company/motoristas/empresa/:empresaId - Listar motoristas por empresa

### 5. Veículos
- GET    /api/company/veiculos - Listar veículos
- POST   /api/company/veiculos - Criar veículo
- GET    /api/company/veiculos/:id - Detalhar veículo
- PUT    /api/company/veiculos/:id - Atualizar veículo
- DELETE /api/company/veiculos/:id - Remover veículo
- GET    /api/company/veiculos/empresa/:empresaId - Listar veículos por empresa
- GET    /api/company/veiculos/motorista/:motoristaId - Listar veículos por motorista

### 6. Estacionamentos
- GET    /api/parking/lots - Listar estacionamentos
- POST   /api/parking/lots - Criar estacionamento
- GET    /api/parking/lots/:id - Detalhar estacionamento
- PUT    /api/parking/lots/:id - Atualizar estacionamento
- DELETE /api/parking/lots/:id - Remover estacionamento
- GET    /api/parking/estacionamentos/buscar?cidade=:cidade - Buscar estacionamentos por cidade
- PUT    /api/parking/estacionamentos/:id/vagas - Atualizar vagas do estacionamento

### 7. Reservas
- GET    /api/parking/reservas - Listar reservas
- POST   /api/parking/reservas - Criar reserva
- GET    /api/parking/reservas/:id - Detalhar reserva
- PUT    /api/parking/reservas/:id - Atualizar reserva
- DELETE /api/parking/reservas/:id - Remover reserva
- GET    /api/parking/reservas/motorista/:motoristaId - Listar reservas por motorista
- GET    /api/parking/reservas/estacionamento/:estacionamentoId - Listar reservas por estacionamento

### 8. Dashboard/Relatórios
- GET    /api/parking/dashboard-stats - Estatísticas do dashboard
- GET    /api/parking/relatorios/reservas - Relatório de reservas
- GET    /api/parking/relatorios/financeiro - Relatório financeiro
- GET    /api/parking/relatorios/utilizacao - Relatório de utilização

### 9. Funcionalidades em Tempo Real
- WebSocket: ws/estacionamento/:estacionamentoId/ - Atualizações de estacionamento em tempo real
- WebSocket: ws/notificacoes/:usuarioId/ - Notificações em tempo real

## Sistema de Permissões

O GTSystem utiliza um sistema de permissões granular para controlar o acesso a diferentes partes da aplicação e adaptar a interface do usuário com base em seu papel.

### Componentes Principais

- **Backend**
  - Decorador `requires_permission` para proteção de endpoints
  - `CompanyFilterMixin` para filtragem automática de dados por empresa
  - Comando `update_user_permissions` para atualização de permissões

- **Frontend**
  - Hooks `usePermission` e `useMultiplePermissions` para verificação de permissões
  - Componente `PermissionGate` para renderização condicional
  - Componente `PermissionGuard` para proteção de rotas
  - Layouts adaptáveis baseados no papel do usuário

### Uso Básico

```tsx
// Verificar permissão
const canManageUsers = usePermission('manage_users');

// Renderização condicional
<PermissionGate permission="view_admin_dashboard">
  <AdminPanel />
</PermissionGate>

// Proteção de rotas
<Route path="/admin/settings" element={
  <PermissionGuard permission="manage_system_settings">
    <Settings />
  </PermissionGuard>
} />
```

Para mais informações, consulte a [documentação completa](docs/guia_componentes_permissoes.md).

## Testes de Permissão

O sistema inclui testes unitários e de integração para validar o funcionamento do sistema de permissões:

- **Testes Unitários**: Validam o funcionamento dos hooks e componentes de permissão individualmente
- **Testes de Integração**: Validam o fluxo completo de permissões e redirecionamentos

Para executar os testes de permissão:

```bash
# Na pasta frontend
npm run test:permissions

# Ou use o script batch (Windows)
./run_permission_tests.bat
```

Para mais detalhes sobre os testes, consulte a [documentação de testes de permissão](docs/testes_permissoes.md).

## Validação de Permissões

O sistema inclui ferramentas para validar e manter a consistência do sistema de permissões:

- **Script de Validação**: Analisa o código-fonte para identificar todas as permissões e detectar inconsistências
- **Relatórios**: Gera relatórios detalhados sobre o uso de permissões no sistema

Para executar a validação de permissões:

```bash
# Na pasta frontend
npm run validate:permissions

# Ou use o script batch (Windows)
./validate_permissions.bat
```

Para mais detalhes sobre a validação, consulte a [documentação de validação de permissões](docs/validacao_permissoes.md).

## Módulo de Permissões - Implementação Concluída ✅

O sistema de permissões baseado em papéis (RBAC) do GTSystem foi completamente implementado, incluindo:

- **Componentes de UI** para controle de acesso
- **Hooks de verificação** de permissões
- **Testes unitários e de integração**
- **Ferramentas de validação**
- **Documentação abrangente**

Para verificar a instalação do módulo de permissões:

```bash
# Na raiz do projeto
./check_permissions_setup.bat
```

Para mais detalhes, consulte o [Registro de Conclusão do Módulo de Permissões](docs/registro_conclusao_permissoes.md).

## Correção do Problema de Layouts

Foi identificado e corrigido um problema de duplicação nos componentes de layout que causava exibição inconsistente das interfaces. As correções incluíram:

- Remoção de componentes duplicados
- Correção de importações conflitantes
- Padronização da estrutura de layouts

Para mais detalhes sobre o problema e a solução aplicada, consulte a [documentação de solução de layouts](docs/solucao_problema_layouts.md).

## Iniciando o Frontend no PowerShell

Para iniciar o frontend usando PowerShell:

```powershell
# Na raiz do projeto
.\start_frontend.ps1
```

Ou executar os comandos manualmente:

```powershell
cd .\frontend
npm run dev
```

## Iniciando o Sistema Completo

Para iniciar o backend e frontend simultaneamente usando PowerShell:

```powershell
# Na raiz do projeto
.\start_system.ps1
```

Este script irá:
1. Iniciar o backend em uma nova janela do PowerShell
2. Aguardar 5 segundos para o backend inicializar
3. Iniciar o frontend em outra janela do PowerShell

Após a inicialização, você pode acessar:
- Backend: http://localhost:8000
- Frontend: http://localhost:5173

## Limpeza de Duplicações

Foi realizada uma limpeza completa de componentes duplicados no sistema, removendo arquivos redundantes e padronizando a estrutura do projeto. Esta ação:

- Removeu layouts e componentes duplicados
- Padronizou a estrutura de arquivos
- Criou scripts PowerShell para inicialização
- Melhorou a organização geral do código

Para mais detalhes sobre a limpeza realizada, consulte a [documentação de limpeza de duplicações](docs/limpeza_duplicacoes.md).
