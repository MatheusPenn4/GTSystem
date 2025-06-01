from django.contrib import admin
from .models import Plan, Subscription

@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'period', 'max_vehicles', 'is_active')
    search_fields = ('name', 'description')
    list_filter = ('is_active', 'period', 'created_at')
    
@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('company', 'plan', 'status', 'start_date', 'end_date', 'current_vehicles', 'price_paid')
    search_fields = ('company__name', 'plan__name')
    list_filter = ('status', 'start_date', 'plan')
    raw_id_fields = ('company', 'plan')
