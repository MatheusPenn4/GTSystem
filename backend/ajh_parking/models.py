from django.db import models
from django.utils.translation import gettext_lazy as _


class ParkingLot(models.Model):
    """
    Modelo para representar estacionamentos
    """
    name = models.CharField(_('Nome'), max_length=100)
    address = models.CharField(_('Endereço'), max_length=255, blank=True)
    capacity = models.IntegerField(_('Capacidade total'), default=0)
    description = models.TextField(_('Descrição'), blank=True)
    is_active = models.BooleanField(_('Ativo'), default=True)
    created_at = models.DateTimeField(_('Criado em'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Atualizado em'), auto_now=True)
    
    class Meta:
        verbose_name = _('Estacionamento')
        verbose_name_plural = _('Estacionamentos')
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    @property
    def available_spots(self):
        """Retorna o número de vagas disponíveis"""
        used_spots = self.spots.filter(is_occupied=True).count()
        return self.capacity - used_spots


class ParkingSpot(models.Model):
    """
    Modelo para representar vagas de estacionamento
    """
    parking_lot = models.ForeignKey(
        ParkingLot, 
        on_delete=models.CASCADE,
        related_name='spots',
        verbose_name=_('Estacionamento')
    )
    identifier = models.CharField(_('Identificador'), max_length=20)
    is_occupied = models.BooleanField(_('Ocupada'), default=False)
    vehicle = models.ForeignKey(
        'ajh_company.Vehicle', 
        on_delete=models.SET_NULL,
        null=True, 
        blank=True,
        related_name='parking_spots',
        verbose_name=_('Veículo')
    )
    is_active = models.BooleanField(_('Ativa'), default=True)
    created_at = models.DateTimeField(_('Criada em'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Atualizada em'), auto_now=True)
    
    class Meta:
        verbose_name = _('Vaga')
        verbose_name_plural = _('Vagas')
        ordering = ['parking_lot', 'identifier']
        unique_together = ['parking_lot', 'identifier']
    
    def __str__(self):
        return f"{self.parking_lot.name} - {self.identifier}"


class ParkingRecord(models.Model):
    """
    Modelo para representar registros de entrada/saída de veículos
    """
    STATUS_CHOICES = (
        ('in', _('Entrada')),
        ('out', _('Saída')),
    )
    
    parking_lot = models.ForeignKey(
        ParkingLot, 
        on_delete=models.CASCADE,
        related_name='records',
        verbose_name=_('Estacionamento')
    )
    parking_spot = models.ForeignKey(
        ParkingSpot, 
        on_delete=models.SET_NULL,
        null=True,
        related_name='records',
        verbose_name=_('Vaga')
    )
    vehicle = models.ForeignKey(
        'ajh_company.Vehicle', 
        on_delete=models.CASCADE,
        related_name='parking_records',
        verbose_name=_('Veículo')
    )
    company = models.ForeignKey(
        'ajh_company.Company', 
        on_delete=models.CASCADE,
        related_name='parking_records',
        verbose_name=_('Empresa')
    )
    driver = models.ForeignKey(
        'ajh_company.Driver', 
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='parking_records',
        verbose_name=_('Motorista')
    )
    status = models.CharField(_('Status'), max_length=3, choices=STATUS_CHOICES)
    entry_time = models.DateTimeField(_('Hora de entrada'), null=True, blank=True)
    exit_time = models.DateTimeField(_('Hora de saída'), null=True, blank=True)
    created_by = models.ForeignKey(
        'ajh_auth.User', 
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_records',
        verbose_name=_('Criado por')
    )
    created_at = models.DateTimeField(_('Criado em'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Atualizado em'), auto_now=True)
    
    class Meta:
        verbose_name = _('Registro de Estacionamento')
        verbose_name_plural = _('Registros de Estacionamento')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.vehicle} - {self.get_status_display()} - {self.created_at}"
