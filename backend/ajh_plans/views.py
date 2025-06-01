from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Plan, Subscription
from .serializers import PlanSerializer, SubscriptionSerializer

class PlanViewSet(viewsets.ModelViewSet):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Retorna apenas os planos ativos"""
        plans = Plan.objects.filter(is_active=True)
        page = self.paginate_queryset(plans)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(plans, many=True)
        return Response(serializer.data)

class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filtra as assinaturas de acordo com a empresa, se especificada"""
        queryset = Subscription.objects.all()
        company_id = self.request.query_params.get('company_id')
        status = self.request.query_params.get('status')
        
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        if status:
            queryset = queryset.filter(status=status)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Retorna apenas as assinaturas ativas"""
        subscriptions = Subscription.objects.filter(status='active')
        page = self.paginate_queryset(subscriptions)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(subscriptions, many=True)
        return Response(serializer.data)
