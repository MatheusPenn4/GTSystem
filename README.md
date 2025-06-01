# 🚗 Sistema de Gestão AJH - Completo

Sistema completo de gestão empresarial com foco em controle de veículos, motoristas e estacionamentos.

## 📁 **Estrutura do Projeto**

```
AJH/
├── backend/                 # Django API
│   ├── ajh_backend/        # Configurações Django
│   ├── company/            # App de empresas e veículos
│   ├── parking/            # App de estacionamento
│   ├── users/              # App de usuários
│   ├── manage.py
│   ├── requirements.txt
│   └── README.md
├── frontend/               # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── README.md
├── docs/                   # Documentação
├── .gitignore
└── README.md
```

## ✨ **Funcionalidades**

### 🏢 **Gestão de Empresas**
- ✅ CRUD completo de empresas
- ✅ Gestão de filiais
- ✅ Associação com veículos e motoristas

### 🚗 **Gestão de Veículos**
- ✅ Cadastro completo da frota
- ✅ Controle de status (ativo, manutenção, inativo)
- ✅ Associação com motoristas
- ✅ Validação de placas (padrão brasileiro)

### 👨‍💼 **Gestão de Motoristas**
- ✅ Cadastro com dados de CNH
- ✅ Controle de categorias
- ✅ Validação de vencimento
- ✅ Associação com veículos

### 🅿️ **Sistema de Estacionamento**
- ✅ Gestão de estacionamentos
- ✅ Controle de vagas em tempo real
- ✅ Registro de entrada/saída
- ✅ Histórico de movimentações

### 🔐 **Autenticação e Segurança**
- ✅ JWT com refresh tokens
- ✅ Permissões por usuário
- ✅ CORS configurado
- ✅ Validações robustas

## 🛠 **Tecnologias Utilizadas**

### Backend
- **Django 4.2** + Django REST Framework
- **PostgreSQL** (produção) / SQLite (desenvolvimento)
- **JWT Authentication** com SimpleJWT
- **CORS Headers** para integração frontend
- **Django Extensions** para desenvolvimento

### Frontend
- **React 18** com TypeScript
- **Material-UI (MUI)** para componentes
- **React Query** para gerenciamento de estado
- **React Router** para navegação
- **Axios** para requisições HTTP
- **Vite** como bundler

## 🚀 **Como executar o projeto completo**

### Pré-requisitos
- Python 3.11+
- Node.js 18+
- PostgreSQL (opcional, usa SQLite por padrão)

### 1. Backend (Django)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/ajh-sistema.git
cd ajh-sistema/backend

# Crie um ambiente virtual
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate

# Instale as dependências
pip install -r requirements.txt

# Configure o banco de dados
python manage.py migrate

# Crie um superusuário
python manage.py createsuperuser

# Execute o servidor
python manage.py runserver
```

O backend estará disponível em: `http://localhost:8000`

### 2. Frontend (React)

```bash
# Em outro terminal, navegue para o frontend
cd ajh-sistema/frontend

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

## 📚 **Documentação da API**

### Endpoints principais:

```
# Autenticação
POST /api/auth/login/           # Login
POST /api/auth/refresh/         # Refresh token
POST /api/auth/logout/          # Logout

# Empresas
GET    /api/company/companies/  # Listar empresas
POST   /api/company/companies/  # Criar empresa
GET    /api/company/companies/{id}/  # Detalhes da empresa
PUT    /api/company/companies/{id}/  # Atualizar empresa
DELETE /api/company/companies/{id}/  # Excluir empresa

# Veículos
GET    /api/company/vehicles/   # Listar veículos
POST   /api/company/vehicles/   # Criar veículo
GET    /api/company/vehicles/{id}/   # Detalhes do veículo
PUT    /api/company/vehicles/{id}/   # Atualizar veículo
DELETE /api/company/vehicles/{id}/   # Excluir veículo

# Motoristas
GET    /api/company/drivers/    # Listar motoristas
POST   /api/company/drivers/    # Criar motorista
GET    /api/company/drivers/{id}/    # Detalhes do motorista
PUT    /api/company/drivers/{id}/    # Atualizar motorista
DELETE /api/company/drivers/{id}/    # Excluir motorista

# Estacionamentos
GET    /api/parking/lots/       # Listar estacionamentos
POST   /api/parking/lots/       # Criar estacionamento
GET    /api/parking/spots/      # Listar vagas
POST   /api/parking/vehicle-entry/  # Registrar entrada
POST   /api/parking/vehicle-exit/   # Registrar saída
GET    /api/parking/records/    # Histórico de movimentações
```

## 🔧 **Configuração do Ambiente**

### Backend (.env)
```env
DEBUG=True
SECRET_KEY=sua-chave-secreta-aqui
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000
```

## 📦 **Deploy**

### Backend (Django)
- Configure PostgreSQL
- Use Gunicorn como WSGI server
- Configure nginx como proxy reverso
- Use variáveis de ambiente para configurações

### Frontend (React)
- Build: `npm run build`
- Servir pasta `dist/` com nginx
- Configure CORS no backend para domínio de produção

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

## 📊 **Scripts Úteis**

### Backend
```bash
# Executar migrações
python manage.py makemigrations
python manage.py migrate

# Carregar dados de exemplo
python manage.py loaddata fixtures/sample_data.json

# Collectstatic (produção)
python manage.py collectstatic
```

### Frontend
```bash
# Lint e formatação
npm run lint
npm run format

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🎯 **Roadmap**

- [ ] Dashboard com gráficos em tempo real
- [ ] Sistema de notificações
- [ ] App mobile (React Native)
- [ ] Relatórios em PDF
- [ ] Integração com mapas
- [ ] Sistema de backup automático
- [ ] API de terceiros (consulta CNH, etc.)

## 💬 **Suporte**

Para dúvidas ou suporte:
- 📧 Email: suporte@ajh-sistema.com
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/ajh-sistema/issues)
- 📖 Wiki: [GitHub Wiki](https://github.com/seu-usuario/ajh-sistema/wiki)

---

**Desenvolvido com ❤️ para otimizar a gestão empresarial**
