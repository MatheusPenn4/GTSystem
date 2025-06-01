from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Company, Branch, Driver, Vehicle
from .serializers import CompanySerializer, BranchSerializer, DriverSerializer, VehicleSerializer

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=True, methods=['get'])
    def branches(self, request, pk=None):
        """Retorna as filiais da empresa"""
        company = self.get_object()
        branches = Branch.objects.filter(company=company)
        page = self.paginate_queryset(branches)
        if page is not None:
            serializer = BranchSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = BranchSerializer(branches, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def drivers(self, request, pk=None):
        """Retorna os motoristas da empresa"""
        company = self.get_object()
        drivers = Driver.objects.filter(company=company)
        page = self.paginate_queryset(drivers)
        if page is not None:
            serializer = DriverSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = DriverSerializer(drivers, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def vehicles(self, request, pk=None):
        """Retorna os veículos da empresa"""
        company = self.get_object()
        vehicles = Vehicle.objects.filter(company=company)
        page = self.paginate_queryset(vehicles)
        if page is not None:
            serializer = VehicleSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = VehicleSerializer(vehicles, many=True)
        return Response(serializer.data)

class BranchViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filtra as filiais de acordo com a empresa, se especificada"""
        queryset = Branch.objects.all()
        company_id = self.request.query_params.get('company_id')
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        return queryset

class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filtra os motoristas de acordo com a empresa, se especificada"""
        queryset = Driver.objects.all()
        company_id = self.request.query_params.get('company_id')
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        return queryset

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filtra os veículos de acordo com a empresa, se especificada"""
        queryset = Vehicle.objects.all()
        company_id = self.request.query_params.get('company_id')
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        return queryset
