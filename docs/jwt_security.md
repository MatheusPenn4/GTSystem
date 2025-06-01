# Sistema de Autenticação JWT

## Visão Geral

O sistema utiliza JSON Web Tokens (JWT) para autenticação, com dois tipos de tokens:

- **Access Token**: Token de curta duração (15 minutos) para acesso aos recursos
- **Refresh Token**: Token de longa duração (7 dias) para renovação do access token

## Configurações de Segurança

### Tempos de Expiração

- Access Token: 15 minutos
- Refresh Token: 7 dias
- Rotação automática de refresh tokens ativada
- Blacklist de tokens após rotação

### Endpoints

#### Login

```http
POST /api/auth/login/
Content-Type: application/json

{
    "username": "seu_usuario",
    "password": "sua_senha"
}
```

Resposta:

```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "seu_usuario",
    "email": "seu@email.com"
  }
}
```

#### Refresh Token

```http
POST /api/auth/token/refresh/
Content-Type: application/json

{
    "refresh": "seu_refresh_token"
}
```

Resposta:

```json
{
  "access": "novo_access_token"
}
```

#### Logout

```http
POST /api/auth/logout/
Content-Type: application/json
Authorization: Bearer seu_access_token

{
    "refresh": "seu_refresh_token"
}
```

## Boas Práticas de Segurança

1. **Armazenamento de Tokens**

   - Access Token: Armazenar em memória (não persistir)
   - Refresh Token: Armazenar em cookie HttpOnly e Secure

2. **Renovação de Tokens**

   - Renovar o access token antes de expirar
   - Usar refresh token apenas para renovação
   - Invalidar refresh token após logout

3. **Proteção contra Ataques**
   - Tokens expirados são automaticamente rejeitados
   - Refresh tokens são blacklisted após logout
   - Rotação automática de refresh tokens

## Fluxo de Autenticação

1. Usuário faz login com credenciais
2. Sistema retorna access token e refresh token
3. Access token é usado para requisições
4. Antes do access token expirar, usar refresh token para obter novo access token
5. Ao fazer logout, refresh token é blacklisted

## Tratamento de Erros

- **401 Unauthorized**: Token expirado ou inválido
- **403 Forbidden**: Token válido mas sem permissão
- **400 Bad Request**: Token mal formatado

## Monitoramento e Logs

- Todas as tentativas de login são registradas
- Tentativas de uso de tokens expirados são logadas
- Tentativas de uso de tokens blacklisted são logadas
