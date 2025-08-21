# Deploy no Vercel - GTSystem Frontend

## Configurações Necessárias

### 1. Variáveis de Ambiente no Vercel

No painel do Vercel, adicione as seguintes variáveis de ambiente:

```bash
JWT_SECRET=gtsystem_jwt_secret_key_2024_production
JWT_REFRESH_SECRET=gtsystem_refresh_jwt_secret_key_2024_production
```

### 2. Estrutura de Arquivos

Certifique-se de que a estrutura está correta:

```
frontend/
├── api/
│   └── index.ts          # Serverless function principal
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
├── vercel.json           # Configuração do Vercel
└── package.json
```

### 3. Comandos de Deploy

```bash
# Instalar dependências
npm install

# Build para produção
npm run build

# Deploy no Vercel
vercel --prod
```

### 4. Verificações Pós-Deploy

1. **Testar endpoint de health**: `https://seu-dominio.vercel.app/api/health`
2. **Testar login**: Usar credenciais:
   - Admin: `admin@gtsystem.com` / `admin123`
   - Transportadora: `usuario@transportadoramodelo.com.br` / `trans123`
   - Estacionamento: `usuario@estacionamentoseguro.com.br` / `estac123`

### 5. Troubleshooting

#### Erro 404 na API
- Verificar se o arquivo `api/index.ts` está na raiz do projeto
- Verificar se o `vercel.json` está configurado corretamente
- Verificar se as variáveis de ambiente estão definidas

#### Erro de CORS
- O CORS está configurado na serverless function
- Verificar se as rotas estão sendo redirecionadas corretamente

#### Erro de JWT
- Verificar se as variáveis `JWT_SECRET` e `JWT_REFRESH_SECRET` estão definidas
- Verificar se os tokens estão sendo gerados corretamente

### 6. Logs e Debug

Para ver logs da serverless function:
1. Acessar o painel do Vercel
2. Ir para Functions
3. Verificar logs da função `api/index.ts`

### 7. Performance

- A função serverless tem timeout de 30 segundos
- Cache está configurado para assets estáticos
- Otimizações de build estão ativadas

### 8. Segurança

- Headers de segurança configurados
- JWT com expiração configurada
- CORS configurado adequadamente
- Validação de entrada com Zod
