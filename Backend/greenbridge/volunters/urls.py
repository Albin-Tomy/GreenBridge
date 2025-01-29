from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_volunteer, name='register-volunteer'),
    path('profile/', views.get_volunteer_profile, name='volunteer-profile'),
    path('update/', views.update_volunteer_profile, name='update-volunteer'),
    path('quit/', views.quit_volunteer, name='quit-volunteer'),
    path('history/', views.get_volunteer_history, name='volunteer-history'),
    path('blockchain/', views.get_blockchain_details, name='blockchain-details'),
]
