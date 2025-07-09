# Manutenção do Frontend AJH

## Atualizações e Correções (2024)

Este documento descreve as principais alterações realizadas no frontend do sistema AJH após a migração para a nova versão.

### 1. Estrutura e Configuração

- Realizado backup do frontend antigo como `frontend-backup/`
- Migrado novo frontend para `frontend/`
- Criado arquivo `url.ts` para centralizar URLs da API
- Adicionada biblioteca `axios` para requisições HTTP

### 2. Autenticação

- Atualizado sistema de autenticação para usar tokens JWT (access e refresh)
- Implementado modo de demonstração para uso offline
- Adicionada verificação automática do status do backend

### 3. Hooks e Utilitários

- Corrigido `useApi.ts` para evitar chamadas infinitas à API
- Adicionado `useBackendStatus.ts` para monitorar o estado da conexão com o backend
- Implementado `backendCheck.ts` para verificação robusta do estado do servidor

### 4. Interface do Usuário

- Melhorada interface de login com indicadores de status do backend
- Implementado fallback para dados simulados quando a API falha
- Adicionados indicadores visuais do estado da conexão

### 5. Tratamento de Erros

- Melhorado sistema de tratamento de erros nas requisições à API
- Implementada exibição apropriada de mensagens de erro
- Adicionada capacidade de funcionar offline com dados simulados

## Modo de Desenvolvimento

Para rodar o frontend em modo de desenvolvimento:

```bash
cd frontend
npm install  # Instalar dependências
npm run dev  # Iniciar servidor de desenvolvimento
```

O frontend estará disponível em: http://localhost:5173

## Configuração

As principais configurações estão no arquivo `.env`:

- `VITE_API_BASE_URL`: URL base da API (padrão: http://localhost:8000)

## Modo de Demonstração

O sistema ativará automaticamente o modo de demonstração quando:

1. O backend estiver inacessível
2. O backend retornar erros 500 (Internal Server Error)
3. As credenciais usadas forem as de demonstração (admin@ajh.com / admin123)
4. A configuração `VITE_FORCE_DEMO_MODE=true` estiver definida no arquivo `.env.local`

Este modo permite testar a interface mesmo sem conexão com o backend ou quando o backend está com problemas.

### Forçar o Modo de Demonstração

Para desenvolvimento e testes sem depender do backend, crie um arquivo `.env.local` na pasta `frontend/` com o seguinte conteúdo:

```
VITE_API_BASE_URL=http://localhost:8000
VITE_FORCE_DEMO_MODE=true
```

Isso fará com que o sistema sempre use o modo de demonstração, independentemente do status do backend.

## Tratamento de Erros

O frontend foi aprimorado para lidar com diferentes tipos de erros de forma mais robusta:

1. **Erros de Conexão**: Quando o backend não está acessível
2. **Erros de Autenticação (401)**: Quando as credenciais são inválidas
3. **Erros Internos do Servidor (500)**: Quando há problemas no backend
4. **Timeouts**: Quando as requisições demoram muito para ser respondidas

Em todos esses casos, o sistema oferece feedback claro ao usuário e, quando apropriado, sugere o uso do modo de demonstração.

## Compatibilidade com Django Rest Framework

O sistema foi projetado para trabalhar automaticamente com diferentes versões e configurações do Django Rest Framework. Ele implementa:

1. **Detecção automática de endpoints**: O sistema tenta descobrir os endpoints corretos de autenticação testando várias URLs comuns
2. **Múltiplos formatos de payload**: Tenta diferentes formatos de dados para login (email/password, username/password, etc.)
3. **Extração de tokens flexível**: Compatível com diferentes formatos de resposta de autenticação
4. **Descoberta de endpoints de usuário**: Procura automaticamente endpoints para obter dados do usuário autenticado

### Cliente DjangoClient

Foi implementado um cliente HTTP especializado (`DjangoClient`) para lidar com diferentes configurações do Django Rest Framework. Este cliente:

1. **Detecta automaticamente endpoints**: Descobre endpoints de login, logout, refresh token e perfil de usuário
2. **Suporta múltiplos formatos de autenticação**: Bearer, Token e JWT
3. **Tenta diferentes estruturas de payload**: Adapta o formato dos dados enviados conforme o backend
4. **Armazena configurações descobertas**: Salva as configurações descobertas para melhorar desempenho futuro
5. **Gerencia tokens**: Atualiza tokens de acesso automaticamente usando refresh tokens

Para usar o cliente diretamente:

```typescript
import { djangoClient } from '@/lib/djangoClient';

// Login
const authData = await djangoClient.login('usuario@exemplo.com', 'senha123');

// Obter dados do usuário
const userData = await djangoClient.getCurrentUser();

// Atualizar token
const newToken = await djangoClient.refreshAccessToken();

// Logout
await djangoClient.logout();
```

### Ferramentas de Diagnóstico

O sistema inclui ferramentas de diagnóstico para ajudar a identificar problemas de conexão com o backend:

1. **Botão de diagnóstico**: Acessível na página de login através de "Opções avançadas"
2. **Logs detalhados**: Informações detalhadas no console do navegador sobre tentativas de conexão
3. **Testes de CORS**: Verificação automática de problemas de CORS entre frontend e backend
4. **Cache de descoberta**: As informações sobre endpoints descobertos são armazenadas para melhorar o desempenho

Para solucionar problemas de autenticação, os desenvolvedores podem usar o botão "Diagnosticar conexão com API" para identificar problemas específicos com o backend Django. 