from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'ajh_company'

router = DefaultRouter()
router.register('companies', views.CompanyViewSet)
router.register('branches', views.BranchViewSet)
router.register('drivers', views.DriverViewSet)
router.register('vehicles', views.VehicleViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
