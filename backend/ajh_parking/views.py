from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from .models import ParkingLot, ParkingSpot, ParkingRecord
from .serializers import ParkingLotSerializer, ParkingSpotSerializer, ParkingRecordSerializer

class ParkingLotViewSet(viewsets.ModelViewSet):
    queryset = ParkingLot.objects.all()
    serializer_class = ParkingLotSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=True, methods=['get'])
    def spots(self, request, pk=None):
        """Retorna as vagas do estacionamento"""
        parking_lot = self.get_object()
        spots = ParkingSpot.objects.filter(parking_lot=parking_lot)
        page = self.paginate_queryset(spots)
        if page is not None:
            serializer = ParkingSpotSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = ParkingSpotSerializer(spots, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def records(self, request, pk=None):
        """Retorna os registros do estacionamento"""
        parking_lot = self.get_object()
        records = ParkingRecord.objects.filter(parking_lot=parking_lot)
        page = self.paginate_queryset(records)
        if page is not None:
            serializer = ParkingRecordSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = ParkingRecordSerializer(records, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def available_spots(self, request, pk=None):
        """Retorna as vagas disponíveis do estacionamento"""
        parking_lot = self.get_object()
        spots = ParkingSpot.objects.filter(parking_lot=parking_lot, is_occupied=False, is_active=True)
        page = self.paginate_queryset(spots)
        if page is not None:
            serializer = ParkingSpotSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = ParkingSpotSerializer(spots, many=True)
        return Response(serializer.data)

class ParkingSpotViewSet(viewsets.ModelViewSet):
    queryset = ParkingSpot.objects.all()
    serializer_class = ParkingSpotSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filtra as vagas de acordo com o estacionamento, se especificado"""
        queryset = ParkingSpot.objects.all()
        lot_id = self.request.query_params.get('lot_id')
        if lot_id:
            queryset = queryset.filter(parking_lot_id=lot_id)
        return queryset

class ParkingRecordViewSet(viewsets.ModelViewSet):
    queryset = ParkingRecord.objects.all()
    serializer_class = ParkingRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filtra os registros de acordo com os parâmetros"""
        queryset = ParkingRecord.objects.all()
        lot_id = self.request.query_params.get('lot_id')
        vehicle_id = self.request.query_params.get('vehicle_id')
        company_id = self.request.query_params.get('company_id')
        status = self.request.query_params.get('status')
        
        if lot_id:
            queryset = queryset.filter(parking_lot_id=lot_id)
        if vehicle_id:
            queryset = queryset.filter(vehicle_id=vehicle_id)
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        if status:
            queryset = queryset.filter(status=status)
        
        return queryset
    
    def perform_create(self, serializer):
        """Configura o usuário atual como criador do registro"""
        serializer.save(created_by=self.request.user)
        
        # Atualiza o status da vaga para ocupada em caso de entrada
        record = serializer.instance
        if record.status == 'in' and record.parking_spot:
            spot = record.parking_spot
            spot.is_occupied = True
            spot.vehicle = record.vehicle
            spot.save()
    
    @action(detail=False, methods=['post'])
    def vehicle_entry(self, request):
        """Registra a entrada de um veículo"""
        data = request.data.copy()
        data['status'] = 'in'
        data['entry_time'] = timezone.now()
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=False, methods=['post'])
    def vehicle_exit(self, request):
        """Registra a saída de um veículo"""
        vehicle_id = request.data.get('vehicle_id')
        if not vehicle_id:
            return Response({'error': 'vehicle_id é obrigatório'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Buscar o registro de entrada mais recente
            entry_record = ParkingRecord.objects.filter(
                vehicle_id=vehicle_id, 
                status='in', 
                exit_time__isnull=True
            ).latest('created_at')
            
            # Criar o registro de saída
            data = {
                'parking_lot': entry_record.parking_lot.id,
                'parking_spot': entry_record.parking_spot.id if entry_record.parking_spot else None,
                'vehicle': entry_record.vehicle.id,
                'company': entry_record.company.id,
                'driver': entry_record.driver.id if entry_record.driver else None,
                'status': 'out',
                'exit_time': timezone.now()
            }
            
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            
            # Liberar a vaga
            if entry_record.parking_spot:
                spot = entry_record.parking_spot
                spot.is_occupied = False
                spot.vehicle = None
                spot.save()
            
            # Atualizar o registro de entrada com a hora de saída
            entry_record.exit_time = timezone.now()
            entry_record.save()
            
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except ParkingRecord.DoesNotExist:
            return Response({'error': 'Não foi encontrado registro de entrada para este veículo'}, 
                            status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
