# 🚗 GTSystem - Sistema de Gestão de Estacionamento

Sistema completo de gestão de estacionamento com foco em reservas, controle de vagas e gerenciamento empresarial.

## 📁 **Estrutura do Projeto**

```
GTSystem/
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── config/            # Configurações (Prisma, Redis, Swagger)
│   │   ├── controllers/       # Controladores da API
│   │   ├── middleware/        # Middleware (auth, validação, etc.)
│   │   ├── routes/            # Rotas da API
│   │   ├── services/          # Serviços de negócio
│   │   ├── validators/        # Validadores Zod
│   │   ├── utils/             # Utilitários
│   │   └── index.ts           # Arquivo principal
│   ├── prisma/                # Banco de dados
│   │   ├── migrations/        # Migrações
│   │   ├── schema.prisma      # Schema do banco
│   │   └── seed.ts            # Dados iniciais
│   ├── Dockerfile             # Container Docker
│   ├── docker-compose.yml     # Docker Compose
│   └── package.json
├── frontend/                   # React/Vite Frontend
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   │   ├── ui/            # Componentes UI (Shadcn/UI)
│   │   │   └── modals/        # Modais do sistema
│   │   ├── contexts/          # Context API
│   │   ├── hooks/             # Custom hooks
│   │   ├── pages/             # Páginas da aplicação
│   │   ├── services/          # Serviços API
│   │   ├── types/             # Tipos TypeScript
│   │   └── utils/             # Utilitários
│   ├── package.json
│   └── vite.config.ts
├── docs/                      # Documentação
├── start-system.bat           # Script Windows
├── start-system.sh            # Script Linux/Mac
└── README.md
```

## 🚀 **Deploy no Vercel**

### Frontend (Vercel)
O frontend está configurado para deploy automático no Vercel:

1. **Configuração**: O arquivo `frontend/vercel.json` já está configurado
2. **Build**: O comando de build está definido como `npm run build`
3. **Output**: Os arquivos são gerados na pasta `dist/`

### Backend (Hospedagem Separada)
O backend precisa ser hospedado separadamente (Railway, Render, Heroku, etc.):

1. **Variáveis de Ambiente**: Configure as variáveis no arquivo `backend/env.example`
2. **Database**: Configure PostgreSQL e Redis
3. **Deploy**: Use Docker ou deploy direto

## ✨ **Funcionalidades**

### 🏢 **Gestão de Empresas**
- ✅ CRUD completo de empresas transportadoras
- ✅ Validação de CNPJ e dados empresariais
- ✅ Associação com motoristas e veículos
- ✅ Gestão de permissões por empresa

### 🚗 **Gestão de Veículos**
- ✅ Cadastro completo da frota
- ✅ Validação de placas (padrão brasileiro)
- ✅ Controle de status e tipo de veículo
- ✅ Associação com motoristas

### 👨‍💼 **Gestão de Motoristas**
- ✅ Cadastro com dados de CNH
- ✅ Validação de CPF e documento
- ✅ Controle de categorias e vencimento
- ✅ Histórico de reservas

### 🅿️ **Sistema de Estacionamento**
- ✅ Cadastro de estacionamentos
- ✅ Controle de vagas em tempo real
- ✅ Sistema de reservas
- ✅ Gestão de preços e disponibilidade
- ✅ Notificações automáticas

### 📊 **Dashboard e Relatórios**
- ✅ Dashboard com métricas em tempo real
- ✅ Relatórios financeiros
- ✅ Relatórios de utilização
- ✅ Gráficos e estatísticas

### 🔐 **Autenticação e Segurança**
- ✅ JWT com refresh tokens
- ✅ Sistema de permissões granular
- ✅ Rate limiting e proteção contra ataques
- ✅ Validações robustas com Zod

## 🛠 **Tecnologias Utilizadas**

### Backend
- **Node.js** com **Express.js**
- **TypeScript** para tipagem estática
- **Prisma ORM** para banco de dados
- **PostgreSQL** como banco de dados
- **Redis** para cache e sessões
- **JWT** para autenticação
- **Zod** para validação de dados
- **Swagger** para documentação da API
- **Jest** para testes

### Frontend
- **React 18** com **TypeScript**
- **Vite** como bundler e dev server
- **Shadcn/UI** + **Radix UI** para componentes
- **TanStack Query** para gerenciamento de estado
- **React Router** para roteamento
- **Tailwind CSS** para estilização
- **Zod** para validação de formulários

## 📋 **Pré-requisitos**

- Node.js 18+ 
- PostgreSQL 15+
- Redis 7+
- npm ou yarn

## 🚀 **Instalação e Configuração**

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/gtsystem.git
cd gtsystem
```

### 2. Instale as dependências
```bash
npm run install:all
```

### 3. Configure as variáveis de ambiente

#### Backend
```bash
cd backend
cp env.example .env
# Edite o arquivo .env com suas configurações
```

#### Frontend
```bash
cd frontend
cp env.example .env
# Edite o arquivo .env com suas configurações
```

### 4. Configure o banco de dados
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 5. Execute o sistema
```bash
# Desenvolvimento
npm run dev

# Ou execute separadamente
npm run start:backend  # Terminal 1
npm run start:frontend # Terminal 2
```

## 🔧 **Scripts Disponíveis**

### Root
- `npm run install:all` - Instala todas as dependências
- `npm run dev` - Executa frontend e backend em desenvolvimento
- `npm run build` - Build de frontend e backend
- `npm run start:backend` - Executa apenas o backend
- `npm run start:frontend` - Executa apenas o frontend

### Backend
- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Compila TypeScript
- `npm run start` - Executa em produção
- `npm run test` - Executa testes
- `npm run prisma:generate` - Gera cliente Prisma
- `npm run prisma:migrate` - Executa migrações
- `npm run prisma:seed` - Popula banco com dados iniciais

### Frontend
- `npm run dev` - Executa servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run lint` - Executa ESLint

## 🐳 **Docker**

### Executar com Docker Compose
```bash
cd backend
docker-compose up -d
```

### Build da imagem
```bash
cd backend
docker build -t gtsystem-backend .
```

## 📚 **Documentação**

- [Guia de Configuração](./docs/SETUP.md)
- [Documentação da API](./docs/API.md)
- [Guia de Manutenção](./docs/manutencao-frontend.md)

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 **Suporte**

Para suporte, envie um email para suporte@gtsystem.com ou abra uma issue no GitHub.

---

**GTSystem** - Sistema de Gestão de Estacionamento 🚗
