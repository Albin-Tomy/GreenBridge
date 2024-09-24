from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminSHGViewSet

router = DefaultRouter()
router.register(r'admin/shgs', AdminSHGViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
