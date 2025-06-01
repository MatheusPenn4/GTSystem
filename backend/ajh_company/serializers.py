from rest_framework import serializers
from .models import Company, Branch, Driver, Vehicle

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class BranchSerializer(serializers.ModelSerializer):
    company_name = serializers.ReadOnlyField(source='company.name')
    
    class Meta:
        model = Branch
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class DriverSerializer(serializers.ModelSerializer):
    company_name = serializers.ReadOnlyField(source='company.name')
    
    class Meta:
        model = Driver
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class VehicleSerializer(serializers.ModelSerializer):
    company_name = serializers.ReadOnlyField(source='company.name')
    
    class Meta:
        model = Vehicle
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
