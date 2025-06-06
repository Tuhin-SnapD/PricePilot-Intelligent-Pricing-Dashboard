from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.role == 'admin'

class IsSupplierOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.role in ['supplier', 'admin']:
            return True
        return False
