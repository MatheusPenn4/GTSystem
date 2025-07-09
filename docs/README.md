# Documentação AJH Parking Management

Este diretório contém documentação técnica, guias e informações sobre o sistema de gestão de estacionamento AJH.

## Índice de Documentos

### Planejamento e Roadmap
- [Planejamento Atual 2025](./planejamento_atual_2025.md) - Roadmap e estado atual do desenvolvimento
- [Planejamento de Melhorias](./planejamento_melhorias.md) - **NOVO!** Plano detalhado de melhorias e correções
- [Planejamento Antigo](./planejamento_antigo.md) - Referência histórica

### Arquitetura e Implementação
- [Modelo de Dados](./modelo_dados.md) - Estrutura das entidades e relacionamentos
- [Estrutura do Banco de Dados](./db_structure.md) - Detalhes sobre tabelas e campos
- [API](./api.md) - Endpoints, métodos e parâmetros disponíveis
- [Segurança JWT](./jwt_security.md) - Implementação de autenticação e autorização

### Ambiente e Configuração
- [Guia de Configuração PostgreSQL](./postgresql_setup_guide.md) - Configuração de banco de dados
- [Setup do Ambiente](./SETUP.md) - Configuração do ambiente de desenvolvimento

### Testes e Qualidade
- [Resumo de Testes](./resumo_testes.md) - Estratégia e resultados dos testes

## Orientações para Autenticação

> **IMPORTANTE**: O sistema utiliza exclusivamente o módulo `ajh_auth` para autenticação.
> O módulo `apps/authentication` está descontinuado e deve ser ignorado.
>
> Consulte o [Planejamento de Melhorias](./planejamento_melhorias.md) para mais detalhes.
