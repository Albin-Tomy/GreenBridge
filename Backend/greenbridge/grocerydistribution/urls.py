from django.urls import path
from . import views

urlpatterns = [
    path('request/', views.create_grocery_request, name='create-grocery-request'),
    path('my-requests/', views.get_user_grocery_requests, name='user-grocery-requests'),
    path('pending/', views.get_pending_grocery_requests, name='pending-grocery-requests'),
    path('all/', views.get_all_grocery_requests, name='all-grocery-requests'),
    path('request/<int:pk>/update-status/', views.update_grocery_request_status, name='update-grocery-request-status'),
] 