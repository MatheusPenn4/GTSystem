# Sistema de Gestão de Estacionamentos - Backend

API Backend para o Sistema de Gestão de Estacionamentos para empresas transportadoras.

## Tecnologias

- Python 3.9+
- Django 4.2
- Django REST Framework
- PostgreSQL/SQLite
- JWT para autenticação

## Configuração do Ambiente

1. Clone o repositório
2. Crie um ambiente virtual e ative-o:
   ```
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```
3. Instale as dependências:
   ```
   pip install -r requirements/dev.txt
   ```
4. Configure o banco de dados no arquivo `parkingmgr/settings/base.py`
5. Execute as migrações:
   ```
   python manage.py migrate
   ```

## Configuração Inicial

1. Crie um superusuário para acessar o admin:
   ```
   python scripts/create_superuser.py
   ```
   
2. Opcional: Crie dados iniciais para teste:
   ```
   python scripts/create_test_data.py
   ```

## Executando o Servidor
