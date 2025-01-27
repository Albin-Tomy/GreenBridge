from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_ngo, name='register-ngo'),
    path('approve/', views.approve_ngo, name='approve-ngo'),
    path('pending/', views.get_pending_ngo_requests, name='pending-ngos'),
    path('all/', views.get_all_ngos, name='all-ngos'),
] 