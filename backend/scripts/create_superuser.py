import os
import sys
import django
from pathlib import Path

# Configurar ambiente Django
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "parkingmgr.settings")
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

def create_superuser():
    """Cria um superusuário para acessar o admin"""
    if User.objects.filter(is_superuser=True).exists():
        print("Já existe pelo menos um superusuário no sistema.")
        create_another = input("Deseja criar outro superusuário? (s/n): ")
        if create_another.lower() != 's':
            return False
    
    print("Criando um novo superusuário...")
    username = input("Nome de usuário: ")
    email = input("Email: ")
    password = input("Senha: ")
    
    try:
        User.objects.create_superuser(username=username, email=email, password=password)
        print(f"Superusuário '{username}' criado com sucesso!")
        return True
    except Exception as e:
        print(f"Erro ao criar superusuário: {str(e)}")
        return False

if __name__ == "__main__":
    create_superuser()
