from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'ajh_plans'

router = DefaultRouter()
router.register('plans', views.PlanViewSet)
router.register('subscriptions', views.SubscriptionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
