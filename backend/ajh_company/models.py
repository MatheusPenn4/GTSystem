from django.db import models
from django.utils.translation import gettext_lazy as _


class Company(models.Model):
    """
    Modelo para representar empresas transportadoras
    """
    name = models.CharField(_('Nome'), max_length=100)
    cnpj = models.CharField(_('CNPJ'), max_length=18, unique=True)
    address = models.CharField(_('Endereço'), max_length=255, blank=True)
    phone = models.CharField(_('Telefone'), max_length=20, blank=True)
    email = models.EmailField(_('Email'), blank=True)
    is_active = models.BooleanField(_('Ativo'), default=True)
    created_at = models.DateTimeField(_('Criado em'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Atualizado em'), auto_now=True)
    
    class Meta:
        verbose_name = _('Empresa')
        verbose_name_plural = _('Empresas')
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Branch(models.Model):
    """
    Modelo para representar filiais das empresas
    """
    company = models.ForeignKey(
        Company, 
        on_delete=models.CASCADE,
        related_name='branches',
        verbose_name=_('Empresa')
    )
    name = models.CharField(_('Nome'), max_length=100)
    cnpj = models.CharField(_('CNPJ'), max_length=18, blank=True)
    address = models.CharField(_('Endereço'), max_length=255, blank=True)
    phone = models.CharField(_('Telefone'), max_length=20, blank=True)
    email = models.EmailField(_('Email'), blank=True)
    is_active = models.BooleanField(_('Ativo'), default=True)
    created_at = models.DateTimeField(_('Criado em'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Atualizado em'), auto_now=True)
    
    class Meta:
        verbose_name = _('Filial')
        verbose_name_plural = _('Filiais')
        ordering = ['company', 'name']
    
    def __str__(self):
        return f"{self.company.name} - {self.name}"


class Driver(models.Model):
    """
    Modelo para representar motoristas das empresas
    """
    company = models.ForeignKey(
        Company, 
        on_delete=models.CASCADE,
        related_name='drivers',
        verbose_name=_('Empresa')
    )
    name = models.CharField(_('Nome'), max_length=100)
    cpf = models.CharField(_('CPF'), max_length=14, blank=True)
    cnh = models.CharField(_('CNH'), max_length=20, blank=True)
    cnh_type = models.CharField(_('Categoria CNH'), max_length=5, blank=True)
    phone = models.CharField(_('Telefone'), max_length=20, blank=True)
    is_active = models.BooleanField(_('Ativo'), default=True)
    created_at = models.DateTimeField(_('Criado em'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Atualizado em'), auto_now=True)
    
    class Meta:
        verbose_name = _('Motorista')
        verbose_name_plural = _('Motoristas')
        ordering = ['company', 'name']
    
    def __str__(self):
        return f"{self.name} - {self.company.name}"


class Vehicle(models.Model):
    """
    Modelo para representar veículos das empresas
    """
    company = models.ForeignKey(
        Company, 
        on_delete=models.CASCADE,
        related_name='vehicles',
        verbose_name=_('Empresa')
    )
    plate = models.CharField(_('Placa'), max_length=10)
    model = models.CharField(_('Modelo'), max_length=50, blank=True)
    year = models.IntegerField(_('Ano'), blank=True, null=True)
    type = models.CharField(_('Tipo'), max_length=50, blank=True)
    capacity = models.CharField(_('Capacidade'), max_length=50, blank=True)
    is_active = models.BooleanField(_('Ativo'), default=True)
    created_at = models.DateTimeField(_('Criado em'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Atualizado em'), auto_now=True)
    
    class Meta:
        verbose_name = _('Veículo')
        verbose_name_plural = _('Veículos')
        ordering = ['company', 'plate']
    
    def __str__(self):
        return f"{self.plate} - {self.model} ({self.company.name})"
