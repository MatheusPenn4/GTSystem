import os
import shutil
import subprocess
import sys
from pathlib import Path
from datetime import datetime

# Configurações
BASE_DIR = Path(__file__).resolve().parent
BACKUP_DIR = BASE_DIR / f"backup_{datetime.now().strftime('%Y%m%d%H%M%S')}"
EXCLUDE_DIRS = ['.git', 'venv', 'env', '.venv', '.env', 'node_modules']
EXCLUDE_FILES = ['fresh_start.py', 'PLANO_RECONSTRUCAO.md']

# Configurações do projeto - usar nome que provavelmente não conflita com módulos existentes
PROJECT_NAME = 'parkingmgr'  # Nome mais específico e menos propenso a conflitos

# Mapeamento original -> novo nome dos apps
APP_NAMES = {
    'authentication': 'ajh_auth',
    'company': 'ajh_company',
    'parking': 'ajh_parking',
    'plans': 'ajh_plans'
}

def print_header(text):
    """Imprime um cabeçalho formatado"""
    print("\n" + "=" * 80)
    print(f" {text} ".center(80, "="))
    print("=" * 80 + "\n")

def print_success(text):
    """Imprime uma mensagem de sucesso"""
    print(f"✅ {text}")

def print_error(text):
    """Imprime uma mensagem de erro"""
    print(f"❌ {text}")

def print_warning(text):
    """Imprime uma mensagem de alerta"""
    print(f"⚠️ {text}")

def print_info(text):
    """Imprime uma mensagem informativa"""
    print(f"ℹ️ {text}")

def backup_project():
    """Faz backup do projeto atual"""
    print_header("FAZENDO BACKUP DO PROJETO ATUAL")
    
    # Criar diretório de backup
    BACKUP_DIR.mkdir(exist_ok=True)
    
    # Copiar arquivos para backup
    for item in BASE_DIR.iterdir():
        if item.name in EXCLUDE_DIRS or item.name in EXCLUDE_FILES or item.name.startswith("backup_"):
            continue
            
        if item.is_dir():
            try:
                shutil.copytree(item, BACKUP_DIR / item.name)
                print_success(f"Diretório '{item.name}' copiado para backup")
            except Exception as e:
                print_error(f"Erro ao fazer backup de '{item.name}': {str(e)}")
        else:
            try:
                shutil.copy2(item, BACKUP_DIR / item.name)
                print_success(f"Arquivo '{item.name}' copiado para backup")
            except Exception as e:
                print_error(f"Erro ao fazer backup de '{item.name}': {str(e)}")
    
    print_success(f"Backup completo em: {BACKUP_DIR}")
    return True

def clean_project():
    """Remove todos os arquivos e diretórios, exceto os excluídos"""
    print_header("LIMPANDO O PROJETO")
    
    for item in BASE_DIR.iterdir():
        if item.name in EXCLUDE_DIRS or item.name in EXCLUDE_FILES or item.name.startswith("backup_"):
            print_warning(f"Ignorando '{item.name}'")
            continue
            
        if item.is_dir():
            try:
                shutil.rmtree(item)
                print_success(f"Diretório '{item.name}' removido")
            except Exception as e:
                print_error(f"Erro ao remover '{item.name}': {str(e)}")
        else:
            try:
                os.remove(item)
                print_success(f"Arquivo '{item.name}' removido")
            except Exception as e:
                print_error(f"Erro ao remover '{item.name}': {str(e)}")
    
    print_success("Limpeza concluída")
    return True

def create_project_structure():
    """Cria a estrutura inicial do projeto"""
    print_header("CRIANDO ESTRUTURA DO PROJETO")
    
    # Verificar se Django está instalado
    try:
        import django
        print_success(f"Django {django.get_version()} já instalado")
    except ImportError:
        print_warning("Django não encontrado. Instalando...")
        try:
            subprocess.run([sys.executable, "-m", "pip", "install", "django"], check=True)
            print_success("Django instalado com sucesso")
        except Exception as e:
            print_error(f"Erro ao instalar Django: {str(e)}")
            return False
    
    # Criar diretórios base - usar os nomes dos apps
    directories = [
        'scripts',
        'requirements',
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print_success(f"Diretório '{directory}' criado")
    
    # Criar arquivos README e requirements
    with open('README.md', 'w') as f:
        f.write("# Sistema de Gestão de Estacionamentos - Backend\n\n")
        f.write("Backend do sistema de gestão de estacionamentos para empresas transportadoras.\n")
    print_success("README.md criado")
    
    with open('requirements/base.txt', 'w') as f:
        f.write("Django>=4.2.0,<5.0.0\n")
        f.write("djangorestframework>=3.14.0\n")
        f.write("djangorestframework-simplejwt>=5.2.2\n")
        f.write("psycopg2-binary>=2.9.5\n")
        f.write("pillow>=9.4.0\n")
        f.write("python-dotenv>=0.21.0\n")
        f.write("drf-yasg>=1.21.5\n")
        f.write("django-cors-headers>=3.13.0\n")
    print_success("requirements/base.txt criado")
    
    with open('requirements/dev.txt', 'w') as f:
        f.write("-r base.txt\n")
        f.write("pytest>=7.2.1\n")
        f.write("pytest-django>=4.5.2\n")
        f.write("black>=23.1.0\n")
        f.write("isort>=5.12.0\n")
        f.write("flake8>=6.0.0\n")
    print_success("requirements/dev.txt criado")
    
    print_success("Estrutura do projeto criada com sucesso")
    return True

def initialize_django_project():
    """Inicializa o projeto Django"""
    print_header("INICIALIZANDO PROJETO DJANGO")
    
    # Lista de nomes de projeto alternativos para tentar caso ocorram conflitos
    project_name_alternatives = [
        'parkingmgr',
        'parkingsys',
        'ajhparking',
        'ajhpark',
        'parksystem',
        'parkmgrsys',
        f'parking_{datetime.now().strftime("%Y%m%d")}',
    ]
    
    # Usar o nome do projeto definido globalmente
    project_name = PROJECT_NAME
    
    # Verificar se o projeto já existe
    if os.path.exists(f'{project_name}/settings/base.py'):
        print_warning(f"Projeto Django já inicializado como {project_name}")
        return True
    
    # Tentar inicializar projeto com o nome padrão ou alternativas
    success = False
    
    for i, name in enumerate([project_name] + project_name_alternatives):
        if i > 0:  # Se estamos tentando uma alternativa
            print_warning(f"Tentando nome alternativo {i}: {name}")
        
        try:
            subprocess.run([sys.executable, "-m", "django", "startproject", name, "."], check=True)
            print_success(f"Projeto Django inicializado com sucesso como '{name}'")
            
            # Atualizar o nome do projeto globalmente
            globals()['PROJECT_NAME'] = name
            project_name = name
            
            # Reorganizar arquivos de configuração
            os.makedirs(f'{project_name}/settings', exist_ok=True)
            
            with open(f'{project_name}/settings.py', 'r') as f:
                settings_content = f.read()
            
            os.remove(f'{project_name}/settings.py')
            
            with open(f'{project_name}/settings/base.py', 'w') as f:
                f.write(settings_content)
            
            # Criar __init__.py que importa as configurações corretas
            with open(f'{project_name}/settings/__init__.py', 'w') as f:
                f.write('from .base import *\n')
                f.write('try:\n')
                f.write('    from .dev import *\n')
                f.write('except ImportError:\n')
                f.write('    pass\n')
            
            print_success("Arquivos de configuração reorganizados")
            success = True
            break
        except Exception as e:
            print_error(f"Erro ao inicializar projeto Django como '{name}': {str(e)}")
    
    # Se todas as tentativas falharem, criar um nome aleatório único
    if not success:
        unique_name = f"parking_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        print_warning(f"Tentando nome único: {unique_name}")
        
        try:
            subprocess.run([sys.executable, "-m", "django", "startproject", unique_name, "."], check=True)
            print_success(f"Projeto Django inicializado com sucesso como '{unique_name}'")
            
            # Atualizar o nome do projeto globalmente
            globals()['PROJECT_NAME'] = unique_name
            project_name = unique_name
            
            # Reorganizar arquivos de configuração
            os.makedirs(f'{project_name}/settings', exist_ok=True)
            
            with open(f'{project_name}/settings.py', 'r') as f:
                settings_content = f.read()
            
            os.remove(f'{project_name}/settings.py')
            
            with open(f'{project_name}/settings/base.py', 'w') as f:
                f.write(settings_content)
            
            # Criar __init__.py que importa as configurações corretas
            with open(f'{project_name}/settings/__init__.py', 'w') as f:
                f.write('from .base import *\n')
                f.write('try:\n')
                f.write('    from .dev import *\n')
                f.write('except ImportError:\n')
                f.write('    pass\n')
            
            print_success("Arquivos de configuração reorganizados")
            success = True
        except Exception as e:
            print_error(f"Erro ao inicializar projeto com nome único: {str(e)}")
    
    return success

def create_app_structure_manually(app_name, original_name):
    """Cria manualmente a estrutura de um app Django"""
    print_info(f"Criando estrutura manual para app '{app_name}'...")
    
    # Criar diretório principal se não existir
    os.makedirs(app_name, exist_ok=True)
    
    # Criar arquivo __init__.py
    with open(os.path.join(app_name, '__init__.py'), 'w') as f:
        f.write('')
    
    # Criar arquivo apps.py
    with open(os.path.join(app_name, 'apps.py'), 'w') as f:
        f.write(f'''from django.apps import AppConfig


class {app_name.replace('_', '').capitalize()}Config(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = '{app_name}'
    verbose_name = '{original_name.capitalize()}'
''')
    
    # Criar arquivo models.py
    with open(os.path.join(app_name, 'models.py'), 'w') as f:
        f.write('''from django.db import models

# Crie seus modelos aqui.
''')
    
    # Criar arquivo views.py
    with open(os.path.join(app_name, 'views.py'), 'w') as f:
        f.write('''from django.shortcuts import render
from rest_framework import viewsets, permissions

# Crie suas views aqui.
''')
    
    # Criar arquivo urls.py
    with open(os.path.join(app_name, 'urls.py'), 'w') as f:
        f.write(f'''from django.urls import path, include
from rest_framework.routers import DefaultRouter
from {app_name} import views

app_name = '{app_name}'

router = DefaultRouter()
# Registre seus viewsets aqui.
# router.register('recursos', views.RecursoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
''')
    
    # Criar arquivo serializers.py
    with open(os.path.join(app_name, 'serializers.py'), 'w') as f:
        f.write('''from rest_framework import serializers

# Crie seus serializers aqui.
''')
    
    # Criar arquivo admin.py
    with open(os.path.join(app_name, 'admin.py'), 'w') as f:
        f.write('''from django.contrib import admin

# Registre seus modelos aqui.
''')
    
    # Criar arquivo tests.py
    with open(os.path.join(app_name, 'tests.py'), 'w') as f:
        f.write('''from django.test import TestCase

# Crie seus testes aqui.
''')
    
    # Criar diretório migrations
    os.makedirs(os.path.join(app_name, 'migrations'), exist_ok=True)
    with open(os.path.join(app_name, 'migrations', '__init__.py'), 'w') as f:
        f.write('')
    
    print_success(f"Estrutura do app '{app_name}' criada com sucesso!")
    return True

def initialize_django_apps():
    """Inicializa os apps Django"""
    print_header("INICIALIZANDO APPS DJANGO")
    
    # Usar os nomes dos apps
    for original_name, app_name in APP_NAMES.items():
        if os.path.exists(f'{app_name}/apps.py'):
            print_warning(f"App '{app_name}' já inicializado")
            continue
            
        print_info(f"Inicializando app '{app_name}' manualmente (mapeado de '{original_name}')")
        success = create_app_structure_manually(app_name, original_name)
        
        if not success:
            print_error(f"Erro ao criar estrutura manual para app '{app_name}'")
    
    # Atualize as INSTALLED_APPS no arquivo de configurações base
    try:
        project_name = PROJECT_NAME
        
        if os.path.exists(f'{project_name}/settings/base.py'):
            with open(f'{project_name}/settings/base.py', 'r') as f:
                content = f.read()
            
            # Encontrar a lista INSTALLED_APPS
            if 'INSTALLED_APPS = [' in content:
                # Adicionar nossos apps personalizados com os novos nomes
                new_apps = f"""INSTALLED_APPS = [
    # Django apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'drf_yasg',
    
    # Local apps
    '{APP_NAMES["authentication"]}',
    '{APP_NAMES["company"]}',
    '{APP_NAMES["parking"]}',
    '{APP_NAMES["plans"]}',
]"""
                content = content.replace('INSTALLED_APPS = [', new_apps)
                content = content.replace("'django.contrib.admin',\n    'django.contrib.auth',", '')
                content = content.replace("'django.contrib.contenttypes',\n    'django.contrib.sessions',", '')
                content = content.replace("'django.contrib.messages',\n    'django.contrib.staticfiles',", '')
                content = content.replace("]", "", 1)
                
                with open(f'{project_name}/settings/base.py', 'w') as f:
                    f.write(content)
                
                print_success("Aplicações atualizadas no arquivo de configurações")
                
                # Atualizar também o arquivo urls.py principal para incluir as URLs dos apps
                if os.path.exists(f'{project_name}/urls.py'):
                    with open(f'{project_name}/urls.py', 'r') as f:
                        urls_content = f.read()
                    
                    # Adicionar importações necessárias
                    if 'from django.urls import path' in urls_content and 'include' not in urls_content:
                        urls_content = urls_content.replace(
                            'from django.urls import path', 
                            'from django.urls import path, include'
                        )
                    
                    # Adicionar padrões de URL para os apps
                    if 'urlpatterns = [' in urls_content:
                        new_patterns = []
                        for original_name, app_name in APP_NAMES.items():
                            new_patterns.append(f"    path('api/{original_name}/', include('{app_name}.urls')),")
                        
                        # Adicionar rotas de API e documentação
                        api_patterns = f"""
    # API URLs
{''.join(new_patterns)}
    
    # API Documentation
    path('api/docs/', include([
        path('', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
        path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    ])),
"""
                        # Inserir após o padrão de admin
                        if 'path(\'admin/\'' in urls_content:
                            urls_content = urls_content.replace(
                                'path(\'admin/',
                                f'path(\'admin/{api_patterns}'
                            )
                        
                        # Adicionar configuração do Swagger
                        if 'from django.contrib import admin' in urls_content:
                            swagger_config = """from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Sistema de Gestão de Estacionamentos API",
        default_version='v1',
        description="API para gerenciamento de estacionamentos",
        terms_of_service="https://www.example.com/terms/",
        contact=openapi.Contact(email="contact@example.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.IsAuthenticated,),
)

"""
                            urls_content = urls_content.replace('from django.contrib import admin', swagger_config)
                    
                    with open(f'{project_name}/urls.py', 'w') as f:
                        f.write(urls_content)
                    
                    print_success("URLs dos apps adicionadas ao arquivo urls.py principal")
    except Exception as e:
        print_error(f"Erro ao atualizar configurações: {str(e)}")
    
    return True

def start_fresh():
    """Inicia o processo de reconstrução do projeto"""
    print_header("INICIANDO RECONSTRUÇÃO DO BACKEND")
    
    print("Este script irá:")
    print("1. Fazer backup do projeto atual")
    print("2. Limpar completamente o diretório do backend")
    print("3. Criar a estrutura inicial do novo projeto")
    print(f"4. Inicializar o projeto Django com o nome '{PROJECT_NAME}'")
    print("5. Criar os apps básicos")
    
    confirm = input("\nEsta operação é irreversível. Deseja continuar? (s/n): ")
    if confirm.lower() != 's':
        print("Operação cancelada.")
        return
    
    # Executar etapas
    if not backup_project():
        print_error("Falha ao fazer backup do projeto")
        return
        
    if not clean_project():
        print_error("Falha ao limpar o projeto")
        return
        
    if not create_project_structure():
        print_error("Falha ao criar estrutura do projeto")
        return
        
    if not initialize_django_project():
        print_error("Falha ao inicializar projeto Django")
        return
        
    if not initialize_django_apps():
        print_error("Falha ao inicializar apps Django")
        return
    
    print_header("RECONSTRUÇÃO INICIADA COM SUCESSO")
    print_success("O projeto foi configurado com a estrutura básica.")
    print_success(f"Backup do projeto antigo disponível em: {BACKUP_DIR}")
    print("\nPróximos passos:")
    print("1. Instale as dependências: pip install -r requirements/dev.txt")
    print("2. Configure o banco de dados em core/settings/base.py")
    print("3. Implemente os modelos conforme o PLANO_RECONSTRUCAO.md")
    print("4. Execute as migrações: python manage.py makemigrations && python manage.py migrate")
    
if __name__ == "__main__":
    start_fresh()
