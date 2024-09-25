from django.urls import path
from .views import register_shg, approve_shg, get_pending_shg_requests, get_all_shgs

urlpatterns = [
    path('register/', register_shg, name='register_shg'),
    path('approve/', approve_shg, name='approve_shg'),
    path('pending/', get_pending_shg_requests, name='pending_shgs'),  # Fetch pending SHGs
    path('all/', get_all_shgs, name='all_shgs'),  # Fetch all SHGs (approved + pending)
]
