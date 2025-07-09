# Guia de Configuração do PostgreSQL para o Sistema AJH

Este sistema utiliza **exclusivamente PostgreSQL** como banco de dados. Não há suporte ou fallback para SQLite.

## 1. Instalação do PostgreSQL

### Windows

1. Baixe o instalador do PostgreSQL em: https://www.postgresql.org/download/windows/
2. Execute o instalador e siga as instruções:
   - Instale todos os componentes
   - Defina uma senha para o usuário 'postgres' (anote-a para configuração posterior)
   - A porta padrão é 5432 (mantenha, se possível)

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### macOS

```bash
brew install postgresql
brew services start postgresql
```

## 2. Configuração do PostgreSQL

### Criar o Banco de Dados Manualmente (se necessário)

1. Acesse o PostgreSQL:

```bash
# Windows (PowerShell como administrador)
psql -U postgres

# Linux
sudo -u postgres psql
```

2. Crie o banco de dados:

```sql
CREATE DATABASE GTSystem;
```

3. Verifique se foi criado:

```sql
\l
```

4. Saia do console PostgreSQL:

```sql
\q
```

### Configurar Credenciais no Sistema AJH

Edite o arquivo `.env` na pasta do backend:

