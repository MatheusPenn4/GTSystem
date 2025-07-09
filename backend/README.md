# GTSystem Backend

Backend para sistema de gerenciamento de estacionamento para caminhões e veículos de transporte.

## Tecnologias

- Node.js (v18+)
- TypeScript
- Express.js
- PostgreSQL
- Redis
- Prisma ORM
- Socket.io
- JWT Authentication
- Docker

## Requisitos

- Node.js 18 ou superior
- npm ou yarn
- PostgreSQL
- Redis
- Docker e Docker Compose (opcional)

## Instalação

### Usando npm

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npm run generate

# Executar migrations do banco de dados
npm run migrate

# Popular o banco com dados iniciais
npm run seed

# Iniciar o servidor em modo de desenvolvimento
npm run dev
```

### Usando Docker

```bash
# Construir e iniciar os contêineres
docker-compose up -d

# Executar migrations
docker-compose exec api npm run migrate

# Popular o banco com dados iniciais
docker-compose exec api npm run seed
```

## Estrutura do Projeto

```
src/
├── controllers/      # Controladores de rotas
├── services/         # Lógica de negócio
├── repositories/     # Acesso aos dados
├── models/           # Modelos de dados
├── middleware/       # Middlewares personalizados
├── routes/           # Definição de rotas
├── utils/            # Utilitários
├── config/           # Configurações
├── validators/       # Validadores Joi
├── types/            # Tipos TypeScript
├── tests/            # Testes unitários
└── database/         # Migrations e seeds
```

## Scripts Disponíveis

- `npm run build`: Compila o TypeScript
- `npm start`: Inicia o servidor em produção
- `npm run dev`: Inicia o servidor em modo de desenvolvimento
- `npm run migrate`: Executa as migrations do banco de dados
- `npm run migrate:prod`: Executa as migrations em produção
- `npm run seed`: Popula o banco com dados iniciais
- `npm test`: Executa os testes
- `npm run lint`: Verifica problemas de linting
- `npm run lint:fix`: Corrige problemas de linting automaticamente
- `npm run format`: Formata o código usando Prettier
- `npm run docker:up`: Inicia os contêineres Docker
- `npm run docker:down`: Para os contêineres Docker

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gtsystem
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password

# Upload
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# App
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

## Documentação da API

A documentação da API está disponível em:

- Desenvolvimento: `http://localhost:3000/api-docs`
- Produção: `https://api.gtsystem.com/api-docs`

## Testes

```bash
# Executar todos os testes
npm test

# Executar testes com watch mode
npm run test:watch

# Verificar cobertura de testes
npm test -- --coverage
```

## Logs

Os logs são armazenados no diretório `logs/`:

- `logs/all.log`: Todos os logs
- `logs/error.log`: Apenas logs de erro

## Licença

MIT 