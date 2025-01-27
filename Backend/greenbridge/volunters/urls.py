from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_volunteer, name='register-volunteer'),
    path('dashboard/', views.volunteer_dashboard, name='volunteer-dashboard'),
    path('quit/', views.quit_volunteering, name='quit-volunteering'),
    path('requests/', views.get_volunteer_requests, name='volunteer-requests'),
    path('requests/<int:request_id>/respond/', views.respond_to_request, name='respond-to-request'),
]
