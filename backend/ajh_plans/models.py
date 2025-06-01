from django.db import models
from django.utils.translation import gettext_lazy as _


class Plan(models.Model):
    """
    Modelo para representar planos de assinatura
    """
    PERIOD_CHOICES = (
        ('daily', _('Diário')),
        ('weekly', _('Semanal')),
        ('monthly', _('Mensal')),
        ('quarterly', _('Trimestral')),
        ('semiannual', _('Semestral')),
        ('annual', _('Anual')),
    )
    
    name = models.CharField(_('Nome'), max_length=100)
    description = models.TextField(_('Descrição'), blank=True)
    price = models.DecimalField(_('Preço'), max_digits=10, decimal_places=2)
    period = models.CharField(_('Período'), max_length=10, choices=PERIOD_CHOICES, default='monthly')
    max_vehicles = models.IntegerField(_('Máximo de Veículos'), default=1)
    features = models.TextField(_('Recursos'), blank=True)
    is_active = models.BooleanField(_('Ativo'), default=True)
    created_at = models.DateTimeField(_('Criado em'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Atualizado em'), auto_now=True)
    
    class Meta:
        verbose_name = _('Plano')
        verbose_name_plural = _('Planos')
        ordering = ['price']
    
    def __str__(self):
        return f"{self.name} - {self.get_period_display()} - R${self.price}"


class Subscription(models.Model):
    """
    Modelo para representar assinaturas de empresas a planos
    """
    STATUS_CHOICES = (
        ('active', _('Ativa')),
        ('pending', _('Pendente')),
        ('cancelled', _('Cancelada')),
        ('expired', _('Expirada')),
    )
    
    company = models.ForeignKey(
        'ajh_company.Company', 
        on_delete=models.CASCADE,
        related_name='subscriptions',
        verbose_name=_('Empresa')
    )
    plan = models.ForeignKey(
        Plan, 
        on_delete=models.PROTECT,
        related_name='subscriptions',
        verbose_name=_('Plano')
    )
    status = models.CharField(_('Status'), max_length=10, choices=STATUS_CHOICES, default='pending')
    start_date = models.DateField(_('Data de Início'))
    end_date = models.DateField(_('Data de Término'))
    current_vehicles = models.IntegerField(_('Veículos Atuais'), default=0)
    price_paid = models.DecimalField(_('Valor Pago'), max_digits=10, decimal_places=2)
    payment_method = models.CharField(_('Método de Pagamento'), max_length=50, blank=True)
    payment_date = models.DateField(_('Data de Pagamento'), null=True, blank=True)
    created_at = models.DateTimeField(_('Criado em'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Atualizado em'), auto_now=True)
    
    class Meta:
        verbose_name = _('Assinatura')
        verbose_name_plural = _('Assinaturas')
        ordering = ['-start_date']
    
    def __str__(self):
        return f"{self.company.name} - {self.plan.name} - {self.get_status_display()}"
