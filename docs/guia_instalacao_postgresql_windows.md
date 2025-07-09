# Guia de Instalação: PostgreSQL para Windows

**Data:** 04/06/2025
**Versão:** 1.0

## 📋 Visão Geral

Este guia detalha o processo de instalação e configuração do PostgreSQL no Windows para o Sistema AJH. Ele inclui os passos necessários para instalar as ferramentas de compilação do Visual Studio, necessárias para o driver psycopg2.

## 🔧 Pré-requisitos

- Windows 10 ou superior
- Acesso de administrador ao sistema
- Conexão com a internet
- Python 3.10+ (já instalado)
- Ambiente virtual Python (opcional, mas recomendado)

## 📥 Instalação do Visual C++ Build Tools

O Visual C++ Build Tools é necessário para compilar extensões Python nativas no Windows, incluindo o driver psycopg2 para PostgreSQL.

### Passos para instalação:

1. **Baixe o Visual Studio Build Tools**
   - Acesse: https://visualstudio.microsoft.com/visual-cpp-build-tools/
   - Clique em "Baixar o Build Tools"

2. **Execute o instalador**
   - Após o download, execute o arquivo `vs_buildtools.exe`
   - Selecione a carga de trabalho "Desenvolvimento para desktop com C++"
   - Certifique-se de que as seguintes opções estejam selecionadas:
     - MSVC v143 (ou versão mais recente)
     - Windows 10/11 SDK
     - C++ CMake tools for Windows

3. **Conclua a instalação**
   - Clique em "Instalar" e aguarde a conclusão
   - Este processo pode levar alguns minutos, dependendo da sua conexão

## 📥 Instalação do PostgreSQL

### Passos para instalação:

1. **Baixe o PostgreSQL**
   - Acesse: https://www.postgresql.org/download/windows/
   - Baixe o instalador da versão mais recente do PostgreSQL (14.x ou superior)

2. **Execute o instalador**
   - Após o download, execute o arquivo do instalador
   - Siga as instruções na tela

3. **Configuração da instalação**
   - Selecione os componentes:
     - PostgreSQL Server
     - pgAdmin 4 (interface gráfica)
     - Command Line Tools
     - Stack Builder
   - Defina o diretório de instalação (mantenha o padrão)
   - Defina o diretório para os dados (mantenha o padrão)

4. **Defina a senha do superusuário**
   - Digite a senha para o usuário postgres (superusuário)
   - Anote esta senha pois ela será necessária para administração
   - **Senha recomendada para desenvolvimento:** `postgres`

5. **Defina a porta**
   - Mantenha a porta padrão: 5432
   - Certifique-se de que esta porta não está sendo usada por outro serviço

6. **Selecione a localidade**
   - Escolha "Default locale" ou "Portuguese, Brazil" se disponível

7. **Conclua a instalação**
   - Clique em "Avançar" e depois em "Concluir"
   - A instalação pode levar alguns minutos

## 🔄 Configuração do PostgreSQL

### Criação do Banco de Dados e Usuário

1. **Abra o pgAdmin 4**
   - Procure pgAdmin 4 no menu Iniciar
   - Insira a senha do superusuário postgres quando solicitado

2. **Crie um novo banco de dados**
   - Clique com o botão direito em "Databases"
   - Selecione "Create" > "Database..."
   - Nome do banco: `GTSystem`
   - Clique em "Save"

3. **Verifique o usuário postgres**
   - Navegue até Login/Group Roles
   - Confirme que o usuário `postgres` existe e tem as seguintes permissões:
     - Can login?
     - Superuser
   - Certifique-se de que a senha está definida como `2005`

4. **Conceda privilégios ao usuário**
   - Clique com o botão direito no banco de dados `GTSystem`
   - Selecione "Properties"
   - Na aba "Security", verifique se o usuário `postgres` tem todos os privilégios
   - Clique em "Save"

5. **Crie o banco de dados de teste**
   - Clique com o botão direito em "Databases"
   - Selecione "Create" > "Database..."
   - Nome do banco: `test_GTSystem`
   - Owner: `postgres`
   - Clique em "Save"

## 📦 Instalação do psycopg2

Com as ferramentas de compilação e o PostgreSQL instalados, agora podemos instalar o driver psycopg2.

### Opção 1: Instalação Direta do psycopg2-binary

```powershell
# Ative seu ambiente virtual se estiver usando um
pip install psycopg2-binary
```

### Opção 2: Compilação do psycopg2 (se a opção 1 falhar)

```powershell
# Ative seu ambiente virtual se estiver usando um
pip install psycopg2
```

## ✅ Teste da Conexão

Para verificar se tudo está funcionando corretamente:

1. **Execute o shell do Python**

```powershell
python
```

2. **Teste a conexão com o PostgreSQL**

```python
import psycopg2
conn = psycopg2.connect(
    dbname="GTSystem",
    user="postgres",
    password="2005",
    host="localhost",
    port="5432"
)
print("Conexão bem-sucedida!")
conn.close()
```

Se a mensagem "Conexão bem-sucedida!" for exibida, a configuração está correta.

## 🔄 Configuração do Django

Após a instalação e configuração do PostgreSQL, certifique-se de que o arquivo `settings.py` do projeto Django está configurado corretamente:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'GTSystem',
        'USER': 'postgres',
        'PASSWORD': '2005',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## 🔄 Executando Migrações

Após configurar o banco de dados, execute as migrações:

```powershell
cd backend
python manage.py migrate
```

## 🔍 Solução de Problemas

### Problema: Erro ao instalar psycopg2

**Solução:**
- Verifique se o Visual C++ Build Tools está instalado corretamente
- Verifique se as variáveis de ambiente PATH incluem o diretório dos compiladores
- Tente instalar a versão binária: `pip install psycopg2-binary`

### Problema: Erro de conexão com o PostgreSQL

**Solução:**
- Verifique se o serviço do PostgreSQL está em execução
- Verifique as credenciais (usuário/senha)
- Verifique as configurações de firewall
- Verifique se o banco de dados foi criado corretamente

## 📚 Recursos Adicionais

- [Documentação Oficial do PostgreSQL](https://www.postgresql.org/docs/)
- [Documentação do psycopg2](https://www.psycopg.org/docs/)
- [Django e PostgreSQL](https://docs.djangoproject.com/en/stable/ref/databases/#postgresql-notes)

---

**Elaborado por:** André Santos  
**Data:** 04/06/2025 