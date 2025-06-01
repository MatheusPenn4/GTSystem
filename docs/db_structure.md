# Estrutura do Banco de Dados - Sistema de Gestão de Estacionamento

## Módulo de Autenticação

### User

- id (PK)
- username
- email
- password
- first_name
- last_name
- role (FK para Role)
- phone
- is_company_admin
- password_reset_token
- created_at
- updated_at
- branches (ManyToMany para Branch)

### Role

- id (PK)
- name (admin, operator, financial)
- description
- created_at
- updated_at

### UserLog

- id (PK)
- user (FK para User)
- action
- details
- ip_address
- created_at

---

## Módulo de Empresa

### Company

- id (PK)
- name
- cnpj
- address
- phone
- email
- created_at
- updated_at
- is_active
- admin (FK para User)

### Branch

- id (PK)
- company (FK para Company)
- name
- cnpj
- address
- phone
- email
- manager (FK para User, opcional)
- created_at
- updated_at
- is_active

---

## Módulo de Estacionamento

### Vehicle

- id (PK)
- branch (FK para Branch)
- plate
- model
- year
- color
- created_at
- updated_at
- is_active

### Driver

- id (PK)
- branch (FK para Branch)
- vehicle (FK para Vehicle, opcional)
- name
- license_number
- cnh_category
- cnh_expiration
- phone
- email
- created_at
- updated_at
- is_active

---

## Observações

- Todas as validações de negócio (CNPJ, telefone, email corporativo, placa, CNH) são aplicadas nos modelos.
- As permissões de acesso a dados por filial são controladas via relação ManyToMany entre User e Branch.
- O admin da empresa tem acesso a todas as filiais da sua empresa.
- Operadores/financeiros só acessam as filiais associadas.
