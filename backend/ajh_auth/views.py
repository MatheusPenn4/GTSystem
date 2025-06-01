from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Role, User, UserBranches, UserLog
from .serializers import RoleSerializer, UserSerializer, UserBranchesSerializer, UserLogSerializer
from .permissions import IsAdminUser, IsCompanyAdmin

class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [permissions.IsAuthenticated]

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    """Endpoint personalizado para login com retorno de informações do usuário"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Por favor, forneça nome de usuário e senha.'},
                        status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)
    
    if not user:
        # Tentar autenticar usando e-mail
        try:
            user_obj = User.objects.get(email=username)
            user = authenticate(username=user_obj.username, password=password)
        except User.DoesNotExist:
            user = None
    
    if not user:
        return Response({'error': 'Credenciais inválidas.'},
                        status=status.HTTP_401_UNAUTHORIZED)
    
    if not user.is_active:
        return Response({'error': 'Esta conta está desativada.'},
                        status=status.HTTP_403_FORBIDDEN)
    
    # Gerar tokens JWT
    refresh = RefreshToken.for_user(user)
    
    # Registrar log de login
    UserLog.objects.create(
        user=user,
        action='login',
        details='Login via API',
        ip_address=request.META.get('REMOTE_ADDR', '')
    )
    
    # Serializar dados do usuário
    serializer = UserSerializer(user)
    
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': serializer.data
    })

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    """Endpoint para logout"""
    try:
        # Registrar log de logout
        UserLog.objects.create(
            user=request.user,
            action='logout',
            details='Logout via API',
            ip_address=request.META.get('REMOTE_ADDR', '')
        )
        
        # O front-end deve descartar os tokens
        return Response({'success': 'Logout realizado com sucesso.'})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=True, methods=['get'])
    def logs(self, request, pk=None):
        """Retorna os logs do usuário"""
        user = self.get_object()
        logs = UserLog.objects.filter(user=user)
        page = self.paginate_queryset(logs)
        if page is not None:
            serializer = UserLogSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = UserLogSerializer(logs, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_branch(self, request, pk=None):
        """Adiciona uma filial ao usuário"""
        user = self.get_object()
        branch_id = request.data.get('branch_id')
        if not branch_id:
            return Response({'error': 'branch_id é obrigatório'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            from ajh_company.models import Branch
            branch = Branch.objects.get(id=branch_id)
            user_branch, created = UserBranches.objects.get_or_create(user=user, branch=branch)
            serializer = UserBranchesSerializer(user_branch)
            return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Retorna informações do usuário autenticado"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class UserBranchesViewSet(viewsets.ModelViewSet):
    queryset = UserBranches.objects.all()
    serializer_class = UserBranchesSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UserLog.objects.all()
    serializer_class = UserLogSerializer
    permission_classes = [permissions.IsAuthenticated]
