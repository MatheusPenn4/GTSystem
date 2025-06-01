from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.utils.translation import gettext_lazy as _


class Role(models.Model):
    """
    Modelo para representar papéis/funções de usuários no sistema
    """
    name = models.CharField(_('Nome'), max_length=100)
    description = models.TextField(_('Descrição'), blank=True)
    created_at = models.DateTimeField(_('Criado em'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Atualizado em'), auto_now=True)
    
    class Meta:
        verbose_name = _('Papel')
        verbose_name_plural = _('Papéis')
        ordering = ['name']
    
    def __str__(self):
        return self.name


class User(AbstractUser):
    """
    Modelo de usuário personalizado com campos adicionais
    """
    email = models.EmailField(_('Email'), unique=True)
    role = models.ForeignKey(
        Role, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='users',
        verbose_name=_('Papel')
    )
    is_active = models.BooleanField(_('Ativo'), default=True)
    created_at = models.DateTimeField(_('Criado em'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Atualizado em'), auto_now=True)
    
    # Relacionamento com Branch através da tabela intermediária UserBranches
    branches = models.ManyToManyField(
        'ajh_company.Branch',
        through='UserBranches',
        related_name='users',
        verbose_name=_('Filiais')
    )
    
    # Especificar campo utilizado para login
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        verbose_name = _('Usuário')
        verbose_name_plural = _('Usuários')
        ordering = ['email']
    
    def __str__(self):
        return self.email


class UserBranches(models.Model):
    """
    Tabela intermediária para relacionamento entre Usuários e Filiais
    """
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='user_branches',
        verbose_name=_('Usuário')
    )
    branch = models.ForeignKey(
        'ajh_company.Branch', 
        on_delete=models.CASCADE,
        related_name='branch_users',
        verbose_name=_('Filial')
    )
    created_at = models.DateTimeField(_('Criado em'), auto_now_add=True)
    
    class Meta:
        verbose_name = _('Usuário da Filial')
        verbose_name_plural = _('Usuários das Filiais')
        unique_together = ('user', 'branch')
    
    def __str__(self):
        return f"{self.user} - {self.branch}"


class UserLog(models.Model):
    """
    Registro de atividades dos usuários no sistema
    """
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='logs',
        verbose_name=_('Usuário')
    )
    action = models.CharField(_('Ação'), max_length=255)
    details = models.TextField(_('Detalhes'), blank=True)
    ip_address = models.GenericIPAddressField(_('Endereço IP'), blank=True, null=True)
    created_at = models.DateTimeField(_('Criado em'), auto_now_add=True)
    
    class Meta:
        verbose_name = _('Log de Usuário')
        verbose_name_plural = _('Logs de Usuários')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user} - {self.action} - {self.created_at}"
