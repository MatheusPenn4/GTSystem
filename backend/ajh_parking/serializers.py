from rest_framework import serializers
from .models import ParkingLot, ParkingSpot, ParkingRecord

class ParkingLotSerializer(serializers.ModelSerializer):
    available_spots = serializers.ReadOnlyField()
    
    class Meta:
        model = ParkingLot
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class ParkingSpotSerializer(serializers.ModelSerializer):
    parking_lot_name = serializers.ReadOnlyField(source='parking_lot.name')
    vehicle_plate = serializers.ReadOnlyField(source='vehicle.plate', default=None)
    
    class Meta:
        model = ParkingSpot
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class ParkingRecordSerializer(serializers.ModelSerializer):
    vehicle_plate = serializers.ReadOnlyField(source='vehicle.plate')
    company_name = serializers.ReadOnlyField(source='company.name')
    driver_name = serializers.ReadOnlyField(source='driver.name', default=None)
    parking_lot_name = serializers.ReadOnlyField(source='parking_lot.name')
    parking_spot_identifier = serializers.ReadOnlyField(source='parking_spot.identifier', default=None)
    created_by_username = serializers.ReadOnlyField(source='created_by.username')
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = ParkingRecord
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
