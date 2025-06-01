from django.contrib import admin
from .models import Company, Branch, Driver, Vehicle

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'cnpj', 'phone', 'email', 'is_active')
    search_fields = ('name', 'cnpj', 'email')
    list_filter = ('is_active', 'created_at')

@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'cnpj', 'phone', 'is_active')
    search_fields = ('name', 'cnpj', 'company__name')
    list_filter = ('is_active', 'created_at', 'company')

@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'cpf', 'cnh', 'phone', 'is_active')
    search_fields = ('name', 'cpf', 'cnh', 'company__name')
    list_filter = ('is_active', 'created_at', 'company')

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('plate', 'company', 'model', 'year', 'type', 'is_active')
    search_fields = ('plate', 'model', 'company__name')
    list_filter = ('is_active', 'created_at', 'company', 'type')
