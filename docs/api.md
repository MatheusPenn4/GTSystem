# Documentação das APIs

## Autenticação

### Login

```http
POST /api/auth/login/
```

Autentica um usuário e retorna tokens JWT.

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200 OK):**

```json
{
  "access": "string",
  "refresh": "string",
  "user": {
    "id": "integer",
    "username": "string",
    "email": "string",
    "first_name": "string",
    "last_name": "string",
    "role": {
      "id": "integer",
      "name": "string",
      "description": "string"
    },
    "is_active": "boolean"
  }
}
```

### Refresh Token

```http
POST /api/auth/token/refresh/
```

Atualiza o token de acesso usando o refresh token.

**Request Body:**

```json
{
  "refresh": "string"
}
```

**Response (200 OK):**

```json
{
  "access": "string"
}
```

### Reset de Senha

```http
POST /api/auth/password/reset/
```

Solicita o reset de senha.

**Request Body:**

```json
{
  "email": "string"
}
```

**Response (200 OK):**

```json
{
  "message": "Se o email estiver cadastrado, você receberá as instruções para redefinir sua senha."
}
```

### Confirmar Reset de Senha

```http
POST /api/auth/password/reset/confirm/
```

Confirma o reset de senha usando o token recebido por email.

**Request Body:**

```json
{
  "token": "string",
  "password": "string",
  "password_confirm": "string"
}
```

**Response (200 OK):**

```json
{
  "message": "Senha redefinida com sucesso"
}
```

### Usuários

#### Listar Usuários

```http
GET /api/auth/users/
```

Lista os usuários (requer autenticação).

**Response (200 OK):**

```json
[
  {
    "id": "integer",
    "username": "string",
    "email": "string",
    "first_name": "string",
    "last_name": "string",
    "role": {
      "id": "integer",
      "name": "string",
      "description": "string"
    },
    "is_active": "boolean"
  }
]
```

#### Detalhes do Usuário

```http
GET /api/auth/users/{id}/
```

Retorna os detalhes de um usuário específico.

**Response (200 OK):**

```json
{
  "id": "integer",
  "username": "string",
  "email": "string",
  "first_name": "string",
  "last_name": "string",
  "role": {
    "id": "integer",
    "name": "string",
    "description": "string"
  },
  "is_active": "boolean"
}
```

#### Alterar Senha

```http
POST /api/auth/users/{id}/change_password/
```

Altera a senha do usuário.

**Request Body:**

```json
{
  "password": "string"
}
```

**Response (200 OK):**

```json
{
  "status": "Senha alterada com sucesso"
}
```

## Empresa

### Filiais

#### Listar Filiais

```http
GET /api/company/branches/
```

Lista as filiais da empresa do usuário autenticado.

**Response (200 OK):**

```json
[
  {
    "id": "integer",
    "name": "string",
    "cnpj": "string",
    "address": "string",
    "phone": "string",
    "email": "string",
    "manager": {
      "id": "integer",
      "username": "string"
    },
    "is_active": "boolean"
  }
]
```

#### Criar Filial

```http
POST /api/company/branches/
```

Cria uma nova filial.

**Request Body:**

```json
{
  "name": "string",
  "cnpj": "string",
  "address": "string",
  "phone": "string",
  "email": "string",
  "manager_id": "integer"
}
```

**Response (201 Created):**

```json
{
  "id": "integer",
  "name": "string",
  "cnpj": "string",
  "address": "string",
  "phone": "string",
  "email": "string",
  "manager": {
    "id": "integer",
    "username": "string"
  },
  "is_active": "boolean"
}
```

#### Detalhes da Filial

```http
GET /api/company/branches/{id}/
```

Retorna os detalhes de uma filial específica.

**Response (200 OK):**

```json
{
  "id": "integer",
  "name": "string",
  "cnpj": "string",
  "address": "string",
  "phone": "string",
  "email": "string",
  "manager": {
    "id": "integer",
    "username": "string"
  },
  "is_active": "boolean"
}
```

### Veículos

#### Listar Veículos

```http
GET /api/company/vehicles/
```

Lista os veículos da filial do usuário autenticado.

**Response (200 OK):**

```json
[
  {
    "id": "integer",
    "plate": "string",
    "model": "string",
    "year": "integer",
    "color": "string",
    "branch": {
      "id": "integer",
      "name": "string"
    }
  }
]
```

#### Criar Veículo

```http
POST /api/company/vehicles/
```

Cria um novo veículo.

**Request Body:**

```json
{
  "plate": "string",
  "model": "string",
  "year": "integer",
  "color": "string",
  "branch_id": "integer"
}
```

**Response (201 Created):**

```json
{
  "id": "integer",
  "plate": "string",
  "model": "string",
  "year": "integer",
  "color": "string",
  "branch": {
    "id": "integer",
    "name": "string"
  }
}
```

### Motoristas

#### Listar Motoristas

```http
GET /api/company/drivers/
```

Lista os motoristas da filial do usuário autenticado.

**Response (200 OK):**

```json
[
  {
    "id": "integer",
    "name": "string",
    "license_number": "string",
    "cnh_category": "string",
    "cnh_expiration": "date",
    "phone": "string",
    "email": "string",
    "branch": {
      "id": "integer",
      "name": "string"
    },
    "vehicle": {
      "id": "integer",
      "plate": "string"
    }
  }
]
```

#### Criar Motorista

```http
POST /api/company/drivers/
```

Cria um novo motorista.

**Request Body:**

```json
{
  "name": "string",
  "license_number": "string",
  "cnh_category": "string",
  "cnh_expiration": "date",
  "phone": "string",
  "email": "string",
  "branch_id": "integer",
  "vehicle_id": "integer"
}
```

**Response (201 Created):**

```json
{
  "id": "integer",
  "name": "string",
  "license_number": "string",
  "cnh_category": "string",
  "cnh_expiration": "date",
  "phone": "string",
  "email": "string",
  "branch": {
    "id": "integer",
    "name": "string"
  },
  "vehicle": {
    "id": "integer",
    "plate": "string"
  }
}
```

## Observações

1. Todas as requisições devem incluir o token JWT no header:

```http
Authorization: Bearer <token>
```

2. Validações implementadas:

   - CNPJ (formato e dígitos verificadores)
   - Telefone (formato brasileiro)
   - Email (formato válido)
   - Placa de veículo (formato brasileiro)
   - CNH (categorias válidas)

3. Permissões:
   - Usuários só podem acessar dados de sua própria empresa/filial
   - Apenas administradores podem criar/editar usuários
   - Apenas administradores podem acessar logs
