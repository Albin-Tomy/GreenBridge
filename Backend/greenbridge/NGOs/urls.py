from django.urls import path
from . import views

urlpatterns = [
    # Registration and approval endpoints
    path('register/', views.register_ngo, name='register-ngo'),
    path('approve/', views.approve_ngo, name='approve-ngo'),
    path('pending/', views.get_pending_ngo_requests, name='pending-ngos'),
    path('all/', views.get_all_ngos, name='all-ngos'),
    
    # NGO Profile endpoints
    path('profile/', views.get_ngo_profile, name='get-ngo-profile'),
    path('profile/create/', views.create_ngo_profile, name='create-ngo-profile'),
    path('profile/update/', views.update_ngo_profile, name='update-ngo-profile'),
    path('upload-document/<str:document_type>/', views.upload_document, name='upload-document'),
] 