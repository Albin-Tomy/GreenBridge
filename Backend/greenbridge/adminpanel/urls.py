from django.urls import path
from shg.views import approve_shg, get_pending_shg_requests, get_all_shgs

urlpatterns = [
    path('approve/', approve_shg, name='admin_approve_shg'),  # Admin approval/rejection
    path('pending/', get_pending_shg_requests, name='admin_pending_shgs'),  # Admin view pending SHGs
    path('all/', get_all_shgs, name='admin_all_shgs'),  # Admin view all SHGs
]
