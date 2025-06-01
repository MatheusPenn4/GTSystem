from rest_framework import serializers
from .models import Plan, Subscription

class PlanSerializer(serializers.ModelSerializer):
    period_display = serializers.CharField(source='get_period_display', read_only=True)
    
    class Meta:
        model = Plan
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class SubscriptionSerializer(serializers.ModelSerializer):
    company_name = serializers.ReadOnlyField(source='company.name')
    plan_name = serializers.ReadOnlyField(source='plan.name')
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Subscription
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
