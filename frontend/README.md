# 🚗 Sistema de Gestão AJH - Frontend

Sistema completo de gestão empresarial com foco em controle de veículos, motoristas e estacionamentos.

## ✨ **Funcionalidades**

- 🏢 **Gestão de Empresas** - Cadastro e controle de empresas e filiais
- 🚗 **Gestão de Veículos** - Controle completo da frota
- 👨‍💼 **Gestão de Motoristas** - Cadastro e controle de CNH
- 🅿️ **Sistema de Estacionamento** - Controle de vagas e ocupação
- 🔐 **Autenticação Segura** - JWT com refresh tokens
- 📱 **Design Responsivo** - Funciona em todos os dispositivos
- 🌙 **Tema Escuro/Claro** - Interface adaptável

## 🛠 **Tecnologias Utilizadas**

- **React 18** com TypeScript
- **Material-UI (MUI)** para componentes
- **React Query** para gerenciamento de estado
- **React Router** para navegação
- **Axios** para requisições HTTP
- **Vite** como bundler
- **ESLint + Prettier** para qualidade de código

## 🚀 **Como executar**

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/ajh-frontend.git

# Entre no diretório
cd ajh-frontend

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

### Scripts disponíveis
```bash
npm run dev          # Executa em modo desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview da build
npm run lint         # Executa ESLint
npm run format       # Formata código com Prettier
```

## 🏗 **Estrutura do Projeto**

```
src/
├── components/          # Componentes reutilizáveis
│   ├── common/         # Componentes comuns
│   └── layout/         # Componentes de layout
├── context/            # Contexts do React
├── hooks/              # Custom hooks
├── pages/              # Páginas da aplicação
├── services/           # Serviços de API
├── types/              # Definições de tipos
├── utils/              # Utilitários
└── adapters/           # Adaptadores de dados
```

## 🔧 **Configuração do Backend**

Configure a URL do backend no arquivo de API:

```typescript
// src/services/api.ts
const api = axios.create({
  baseURL: 'http://localhost:8000', // Altere para seu backend
});
```

## 📦 **Endpoints Utilizados**

```typescript
/api/auth/login/           # Autenticação
/api/company/companies/    # Empresas
/api/company/vehicles/     # Veículos
/api/company/drivers/      # Motoristas
/api/parking/lots/         # Estacionamentos
```

## 🎯 **Para usar no Lovable:**

1. Fork este repositório
2. No Lovable, conecte o repositório GitHub
3. Configure as variáveis de ambiente se necessário
4. O Lovable detectará automaticamente que é um projeto React/Vite

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

**Desenvolvido com ❤️ para otimizar a gestão empresarial**
