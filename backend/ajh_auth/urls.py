from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from . import views

app_name = 'ajh_auth'

router = DefaultRouter()
router.register('roles', views.RoleViewSet)
router.register('users', views.UserViewSet)
router.register('user-branches', views.UserBranchesViewSet)
router.register('user-logs', views.UserLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
]
