from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Role, User, UserBranches, UserLog

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    search_fields = ('name', 'description')
    list_filter = ('created_at',)

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'role', 'is_active', 'is_staff', 'created_at')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    list_filter = ('is_active', 'is_staff', 'role', 'created_at')
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Informações Pessoais', {'fields': ('first_name', 'last_name', 'role')}),
        ('Permissões', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Datas Importantes', {'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')}),
    )
    readonly_fields = ('created_at', 'updated_at')

@admin.register(UserBranches)
class UserBranchesAdmin(admin.ModelAdmin):
    list_display = ('user', 'branch', 'created_at')
    search_fields = ('user__email', 'branch__name')
    list_filter = ('created_at',)

@admin.register(UserLog)
class UserLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'ip_address', 'created_at')
    search_fields = ('user__email', 'action', 'details')
    list_filter = ('created_at', 'action')
    readonly_fields = ('user', 'action', 'details', 'ip_address', 'created_at')
