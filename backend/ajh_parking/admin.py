from django.contrib import admin
from .models import ParkingLot, ParkingSpot, ParkingRecord

@admin.register(ParkingLot)
class ParkingLotAdmin(admin.ModelAdmin):
    list_display = ('name', 'capacity', 'is_active', 'created_at')
    search_fields = ('name', 'address')
    list_filter = ('is_active', 'created_at')

@admin.register(ParkingSpot)
class ParkingSpotAdmin(admin.ModelAdmin):
    list_display = ('identifier', 'parking_lot', 'is_occupied', 'vehicle', 'is_active')
    search_fields = ('identifier', 'parking_lot__name')
    list_filter = ('is_occupied', 'is_active', 'parking_lot')

@admin.register(ParkingRecord)
class ParkingRecordAdmin(admin.ModelAdmin):
    list_display = ('vehicle', 'company', 'status', 'entry_time', 'exit_time', 'created_at')
    search_fields = ('vehicle__plate', 'company__name', 'driver__name')
    list_filter = ('status', 'created_at', 'parking_lot')
    raw_id_fields = ('vehicle', 'company', 'driver', 'parking_spot', 'created_by')
