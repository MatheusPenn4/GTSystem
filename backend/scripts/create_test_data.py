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
from ajh_auth.models import Role
from ajh_company.models import Company, Branch, Driver, Vehicle
from ajh_parking.models import ParkingLot, ParkingSpot
from ajh_plans.models import Plan

User = get_user_model()

def create_test_data():
    """Cria dados de teste para o sistema"""
    print("Criando dados de teste...")
    
    # Criar papéis
    admin_role, created = Role.objects.get_or_create(name='admin', defaults={'description': 'Administrador do sistema'})
    company_admin_role, created = Role.objects.get_or_create(name='company_admin', defaults={'description': 'Administrador de empresa'})
    branch_admin_role, created = Role.objects.get_or_create(name='branch_admin', defaults={'description': 'Administrador de filial'})
    operator_role, created = Role.objects.get_or_create(name='operator', defaults={'description': 'Operador'})
    
    # Criar usuário admin se não existir
    if not User.objects.filter(username='admin').exists():
        admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin123',
            role=admin_role
        )
        print(f"Usuário admin criado: {admin_user.email}")
    
    # Criar empresa de teste
    company, created = Company.objects.get_or_create(
        name='Empresa Teste',
        defaults={
            'cnpj': '12.345.678/0001-90',
            'address': 'Rua Teste, 123',
            'phone': '(11) 98765-4321',
            'email': 'contato@empresateste.com',
        }
    )
    print(f"Empresa criada: {company.name}")
    
    # Criar filiais
    branch1, created = Branch.objects.get_or_create(
        company=company, 
        name='Filial 1',
        defaults={
            'address': 'Rua da Filial 1, 100',
            'phone': '(11) 91111-1111',
            'email': 'filial1@empresateste.com',
        }
    )
    
    branch2, created = Branch.objects.get_or_create(
        company=company, 
        name='Filial 2',
        defaults={
            'address': 'Rua da Filial 2, 200',
            'phone': '(11) 92222-2222',
            'email': 'filial2@empresateste.com',
        }
    )
    
    # Criar usuário administrador de empresa
    if not User.objects.filter(username='company_admin').exists():
        company_admin = User.objects.create_user(
            username='company_admin',
            email='company_admin@example.com',
            password='company123',
            role=company_admin_role
        )
        print(f"Usuário company_admin criado: {company_admin.email}")
    
    # Criar estacionamento
    parking_lot, created = ParkingLot.objects.get_or_create(
        name='Estacionamento Central',
        defaults={
            'address': 'Av. Principal, 500',
            'capacity': 50,
            'description': 'Estacionamento principal da empresa',
        }
    )
    print(f"Estacionamento criado: {parking_lot.name}")
    
    # Criar algumas vagas
    for i in range(1, 11):
        spot, created = ParkingSpot.objects.get_or_create(
            parking_lot=parking_lot,
            identifier=f'A{i:02d}',
            defaults={
                'is_occupied': False,
            }
        )
    print("10 vagas criadas")
    
    # Criar motoristas
    driver1, created = Driver.objects.get_or_create(
        company=company,
        name='João Silva',
        defaults={
            'cpf': '123.456.789-00',
            'cnh': '12345678900',
            'cnh_type': 'E',
            'phone': '(11) 99999-8888',
        }
    )
    
    driver2, created = Driver.objects.get_or_create(
        company=company,
        name='Maria Oliveira',
        defaults={
            'cpf': '987.654.321-00',
            'cnh': '09876543211',
            'cnh_type': 'D',
            'phone': '(11) 99999-7777',
        }
    )
    
    # Criar veículos
    vehicle1, created = Vehicle.objects.get_or_create(
        company=company,
        plate='ABC-1234',
        defaults={
            'model': 'Caminhão Mercedes Benz',
            'year': 2020,
            'type': 'Pesado',
            'capacity': '12 toneladas',
        }
    )
    
    vehicle2, created = Vehicle.objects.get_or_create(
        company=company,
        plate='DEF-5678',
        defaults={
            'model': 'VW Delivery',
            'year': 2021,
            'type': 'Médio',
            'capacity': '6 toneladas',
        }
    )
    
    # Criar planos
    plan1, created = Plan.objects.get_or_create(
        name='Plano Básico',
        defaults={
            'description': 'Plano com recursos básicos',
            'price': 99.90,
            'period': 'monthly',
            'max_vehicles': 5,
        }
    )
    
    plan2, created = Plan.objects.get_or_create(
        name='Plano Premium',
        defaults={
            'description': 'Plano com todos os recursos',
            'price': 199.90,
            'period': 'monthly',
            'max_vehicles': 20,
        }
    )
    
    print("Dados de teste criados com sucesso!")
    print("\nUsuários criados:")
    print("1. Admin")
    print("   - Usuário: admin@example.com")
    print("   - Senha: admin123")
    print("\n2. Administrador de Empresa")
    print("   - Usuário: company_admin@example.com")
    print("   - Senha: company123")

if __name__ == "__main__":
    create_test_data()
