from django.urls import path
from . import views

urlpatterns = [
    path('request/', views.create_supply_request, name='create-supply-request'),
    path('my-requests/', views.get_user_supply_requests, name='user-supply-requests'),
    path('all/', views.get_all_supply_requests, name='all-supply-requests'),
    path('request/<int:pk>/update-status/', views.update_supply_request_status, name='update-supply-request-status'),
] 