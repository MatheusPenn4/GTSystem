# GTSystem Frontend

Interface moderna e responsiva para o sistema de gestão de estacionamento GTSystem.

## 🚀 Tecnologias

- **React 18** com TypeScript
- **Vite** como bundler
- **Tailwind CSS** para estilização
- **Shadcn/UI** para componentes
- **React Query** para gerenciamento de estado
- **React Router** para navegação
- **React Hook Form** + **Zod** para formulários

## 📦 Instalação

```bash
npm install
```

## 🔧 Desenvolvimento

```bash
npm run dev
```

## 🏗️ Build

```bash
npm run build
```

## 🚀 Deploy no Vercel

### Passo 1: Configurar o projeto
1. Importe o repositório no Vercel
2. Configure a pasta `frontend` como root directory
3. Framework: `Vite`
4. Build Command: `npm run build`
5. Install Command: `npm install`
6. Output Directory: `dist`

### Passo 2: Variáveis de ambiente
Configure as seguintes variáveis no Vercel:

```
VITE_API_URL=https://sua-api-backend.vercel.app
VITE_APP_NAME=GTSystem
VITE_ENVIRONMENT=production
```

### Passo 3: Configuração automática
O arquivo `vercel.json` já está configurado para:
- Reescrever rotas para SPA
- Configurar headers de segurança
- Otimizar para produção

## 📁 Estrutura

```
src/
├── components/         # Componentes reutilizáveis
│   ├── ui/            # Componentes base (Shadcn/UI)
│   └── modals/        # Modais do sistema
├── contexts/          # Context API
├── hooks/             # Custom hooks
├── pages/             # Páginas da aplicação
├── services/          # Serviços de API
├── types/             # Tipos TypeScript
└── utils/             # Utilitários
```

## 🔒 Autenticação

O sistema utiliza JWT tokens para autenticação com:
- Access tokens de curta duração
- Refresh tokens para renovação
- Logout automático em caso de token expirado

## 📱 Responsividade

O sistema é totalmente responsivo e otimizado para:
- Desktop (1920x1080+)
- Tablet (768px+)
- Mobile (375px+)

## 🔧 Configuração de Ambiente

### Desenvolvimento
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=GTSystem
VITE_ENVIRONMENT=development
```

### Produção
```env
VITE_API_URL=https://sua-api-backend.vercel.app
VITE_APP_NAME=GTSystem
VITE_ENVIRONMENT=production
```

## 🧪 Testes

```bash
npm run test
```

## 📊 Performance

- Lazy loading de componentes
- Code splitting otimizado
- Chunking estratégico de vendor packages
- Otimizações de build com Vite
- Minificação com esbuild

## 🐛 Troubleshooting

### Problemas comuns de deploy:

1. **Erro de build**: Verificar se todas as dependências estão instaladas
2. **Rotas não funcionam**: Verificar se o `vercel.json` está configurado
3. **API não conecta**: Verificar variáveis de ambiente
4. **Erro de memória**: Otimizar imports e lazy loading

### Logs úteis:

```bash
# Verificar build localmente
npm run build

# Testar build localmente
npm run preview

# Verificar bundle size
npm run analyze
```

## 🔄 CI/CD

O projeto está configurado para:
- Build automático no push para main
- Verificação de tipos TypeScript
- Linting automático
- Testes unitários

## 📝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Desenvolvido com ❤️ para o GTSystem**
