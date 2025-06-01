from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'ajh_parking'

router = DefaultRouter()
router.register('lots', views.ParkingLotViewSet)
router.register('spots', views.ParkingSpotViewSet)
router.register('records', views.ParkingRecordViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
