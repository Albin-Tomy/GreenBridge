from django.urls import path
from . import views

urlpatterns = [
    path('request/', views.create_food_request, name='create-food-request'),
    path('my-requests/', views.get_user_food_requests, name='user-food-requests'),
    path('pending/', views.get_pending_food_requests, name='pending-food-requests'),
    path('all/', views.get_all_food_requests, name='all-food-requests'),
    path('request/<int:pk>/update-status/', views.update_food_request_status, name='update-food-request-status'),
]
