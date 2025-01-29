from django.urls import path
from . import views

urlpatterns = [
    path('request/', views.create_food_request, name='create-food-request'),
    path('my-requests/', views.get_user_food_requests, name='user-food-requests'),
    path('pending/', views.get_pending_food_requests, name='pending-food-requests'),
    path('update-status/<int:pk>/', views.update_food_request_status, name='update-food-request-status'),
]
