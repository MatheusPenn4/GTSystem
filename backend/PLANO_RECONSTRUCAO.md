# Plano de Reconstrução do Backend - SGE

Este documento descreve o plano para reconstruir completamente o backend do Sistema de Gestão de Estacionamentos, eliminando problemas estruturais e de configuração.

## Estrutura do Projeto

Reconstruiremos o projeto com a seguinte estrutura:

```
backend/
│
├── core/                   # Configurações principais do Django
│   ├── settings/           # Configurações separadas por ambiente
│   │   ├── base.py         # Configurações base
│   │   ├── dev.py          # Configurações de desenvolvimento
│   │   └── prod.py         # Configurações de produção
│   ├── urls.py             # URLs principais
│   └── wsgi.py             # Configuração WSGI
│
├── authentication/         # App para autenticação e controle de usuários
│   ├── models.py           # Usuários personalizados e roles
│   ├── serializers.py      # Serializers para API
│   ├── views.py            # Views da API
│   └── tests.py            # Testes unitários
│
├── company/                # App para gerenciamento de empresas/transportadoras
│   ├── models.py           # Empresas, filiais, motoristas, veículos
│   ├── serializers.py      # Serializers para API
│   ├── views.py            # Views da API
│   └── tests.py            # Testes unitários
│
├── parking/                # App para gerenciamento de estacionamentos
│   ├── models.py           # Estacionamentos, vagas, registros
│   ├── serializers.py      # Serializers para API
│   ├── views.py            # Views da API
│   └── tests.py            # Testes unitários
│
├── plans/                  # App para gerenciamento de planos/assinaturas
│   ├── models.py           # Planos, assinaturas
│   ├── serializers.py      # Serializers para API
│   ├── views.py            # Views da API
│   └── tests.py            # Testes unitários
│
├── scripts/                # Scripts utilitários
│   ├── create_initial_data.py  # Criação de dados iniciais
│   └── setup.py            # Script de configuração inicial
│
├── requirements/           # Requisitos do projeto
│   ├── base.txt            # Dependências base
│   ├── dev.txt             # Dependências de desenvolvimento
│   └── prod.txt            # Dependências de produção
│
├── manage.py               # Script de gerenciamento do Django
└── README.md               # Documentação do projeto
```

## Etapas da Reconstrução

### Etapa 1: Configuração Inicial
- Criar estrutura base do projeto
- Configurar ambiente Django
- Configurar autenticação JWT
- Adicionar documentação da API

### Etapa 2: Implementação dos Modelos
- Criar modelos para todos os apps
- Implementar validadores e regras de negócio
- Configurar relacionamentos entre modelos
- Criar migrações iniciais

### Etapa 3: Desenvolvimento das APIs RESTful
- Implementar serializers para todos os modelos
- Criar endpoints da API
- Configurar permissões e controle de acesso
- Implementar filtragem, ordenação e paginação

### Etapa 4: Testes e Documentação
- Implementar testes unitários para modelos e APIs
- Testar cenários de integração
- Finalizar documentação da API

### Etapa 5: Implantação e Refinamento
- Configurar ambiente de produção
- Implementar scripts de migração de dados (se necessário)
- Refinamentos finais com base no feedback

## Tecnologias e Bibliotecas

- Django 4.2+
- Django REST Framework
- PostgreSQL
- JWT para autenticação
- Swagger/OpenAPI para documentação da API
- PyTest para testes

## Cronograma Simplificado

| Etapa | Tempo Estimado |
|-------|----------------|
| Configuração Inicial | 1 dia |
| Implementação dos Modelos | 2-3 dias |
| Desenvolvimento das APIs | 2-3 dias |
| Testes e Documentação | 1-2 dias |
| Implantação e Refinamento | 1 dia |

## Status Atual

- [ ] Etapa 1: Configuração Inicial
- [ ] Etapa 2: Implementação dos Modelos
- [ ] Etapa 3: Desenvolvimento das APIs
- [ ] Etapa 4: Testes e Documentação
- [ ] Etapa 5: Implantação e Refinamento

## Próximos Passos

1. Limpar completamente o diretório do backend
2. Criar a estrutura inicial do projeto
3. Implementar os modelos básicos conforme o esquema de banco de dados fornecido
```

## Lista de Modelos Baseados no Banco de Dados

Com base na captura de tela do banco de dados, implementaremos os seguintes modelos:

### App Authentication
- Role (authentication_role)
- User (authentication_user)
- UserBranches (authentication_user_branches)
- UserGroups (authentication_user_groups)
- UserPermissions (authentication_user_user_permissions)
- UserLog (authentication_userlog)

### App Company
- Company (company_company)
- Branch (company_branch)
- Driver (company_driver)
- Vehicle (company_vehicle)

### App Parking
- ParkingLot (parking_parkinglot)
- ParkingSpot (parking_parkingspot)
- ParkingRecord (parking_parkingrecord)

### App Plans
- Plan (plans_plan)
