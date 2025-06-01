# 🛠 Guia de Configuração - Sistema AJH

Este guia irá te ajudar a configurar e executar o Sistema AJH completo (backend + frontend).

## 📋 **Pré-requisitos**

### Software necessário:
- **Python 3.11+** - [Download](https://python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **PostgreSQL** (opcional) - [Download](https://postgresql.org/)

### Verificar instalações:
```bash
python --version  # Deve ser 3.11+
node --version     # Deve ser 18+
npm --version      # Incluído com Node.js
git --version      # Qualquer versão recente
```

## 🚀 **Configuração Rápida**

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/ajh-sistema.git
cd ajh-sistema
```

### 2. Configure o Backend (Django)
```bash
cd backend

# Crie ambiente virtual
python -m venv venv

# Ative o ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instale dependências
pip install -r requirements.txt

# Configure banco de dados
python manage.py migrate

# Crie superusuário
python manage.py createsuperuser

# Execute o servidor
python manage.py runserver
```

### 3. Configure o Frontend (React)
```bash
# Em novo terminal
cd frontend

# Instale dependências
npm install

# Execute em modo desenvolvimento
npm run dev
```

## 🌐 **Acessos**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Admin Django**: http://localhost:8000/admin

## 🔧 **Configurações Avançadas**

### Backend com PostgreSQL
1. Instale PostgreSQL
2. Crie banco de dados:
```sql
CREATE DATABASE ajh_sistema;
CREATE USER ajh_user WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE ajh_sistema TO ajh_user;
```

3. Configure `.env` no backend:
```env
DEBUG=True
SECRET_KEY=sua-chave-secreta-muito-segura
DATABASE_URL=postgresql://ajh_user:sua_senha@localhost:5432/ajh_sistema
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Variáveis de Ambiente Frontend
Crie `.env` no frontend:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=Sistema AJH
```

## 🧪 **Testes**

### Backend
```bash
cd backend
python manage.py test
```

### Frontend
```bash
cd frontend
npm run test
```

## 📦 **Build para Produção**

### Backend
```bash
cd backend
pip install gunicorn
python manage.py collectstatic
gunicorn ajh_backend.wsgi:application
```

### Frontend
```bash
cd frontend
npm run build
npm run preview  # Para testar build
```

## 🛠 **Troubleshooting**

### Problemas comuns:

1. **Erro de CORS**
   - Verifique `CORS_ALLOWED_ORIGINS` no backend
   - Confirme que frontend está na porta correta

2. **Erro de banco de dados**
   - Execute: `python manage.py migrate`
   - Verifique conexão com PostgreSQL

3. **Erro de dependências**
   - Backend: `pip install -r requirements.txt`
   - Frontend: `npm install`

4. **Porta em uso**
   - Backend: `python manage.py runserver 8001`
   - Frontend: Mude porta no `vite.config.ts`

## 📞 **Suporte**

Se encontrar problemas, abra uma issue no GitHub com:
- Sistema operacional
- Versões do Python/Node.js
- Logs de erro completos
- Passos para reproduzir o problema
