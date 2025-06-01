import os
import sys
import django
from pathlib import Path

# Configurar ambiente Django
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "parkingmgr.settings")
django.setup()

from django.core.management import call_command

def run_migrations():
    """Cria e aplica migrações para todos os apps"""
    print("Criando migrações para todos os apps...")
    try:
        # Fazer migrações para cada app
        call_command('makemigrations', 'ajh_auth')
        call_command('makemigrations', 'ajh_company')
        call_command('makemigrations', 'ajh_parking')
        call_command('makemigrations', 'ajh_plans')
        print("Migrações criadas com sucesso!")
        
        # Aplicar migrações
        print("Aplicando migrações...")
        call_command('migrate')
        print("Migrações aplicadas com sucesso!")
        
        return True
    except Exception as e:
        print(f"Erro ao executar migrações: {str(e)}")
        return False

if __name__ == "__main__":
    run_migrations()
