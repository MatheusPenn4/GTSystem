import os
import sys
import django

# Configurar ambiente Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "parkingmgr.settings")
django.setup()

from django.core.management import call_command

def setup_models():
    """Configurar modelos e criar migrações iniciais"""
    print("Criando e aplicando migrações iniciais...")
    
    try:
        # Gerar migrações para todos os apps
        call_command('makemigrations', 'ajh_auth')
        call_command('makemigrations', 'ajh_company')
        call_command('makemigrations', 'ajh_parking')
        call_command('makemigrations', 'ajh_plans')
        
        # Aplicar migrações
        call_command('migrate')
        
        print("Migrações aplicadas com sucesso!")
    except Exception as e:
        print(f"Erro ao aplicar migrações: {str(e)}")
        return False
    
    return True

if __name__ == "__main__":
    setup_models()
