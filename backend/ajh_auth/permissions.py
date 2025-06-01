from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Permite acesso somente a usuários administradores.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_staff

class IsCompanyAdmin(permissions.BasePermission):
    """
    Permite acesso a usuários com papel de administrador de empresa.
    """
    def has_permission(self, request, view):
        return request.user and request.user.role and request.user.role.name == 'company_admin'

class IsBranchAdmin(permissions.BasePermission):
    """
    Permite acesso a usuários com papel de administrador de filial.
    """
    def has_permission(self, request, view):
        return request.user and request.user.role and request.user.role.name == 'branch_admin'

class IsCompanyStaff(permissions.BasePermission):
    """
    Permite acesso a usuários que fazem parte da mesma empresa do objeto.
    """
    def has_object_permission(self, request, view, obj):
        # Admins podem acessar tudo
        if request.user.is_staff:
            return True
            
        # Verifica se o objeto tem campo company e se o usuário tem acesso a essa empresa
        if hasattr(obj, 'company'):
            user_branches = request.user.user_branches.all()
            company_branches = [ub.branch.company for ub in user_branches]
            return obj.company in company_branches
            
        return False
