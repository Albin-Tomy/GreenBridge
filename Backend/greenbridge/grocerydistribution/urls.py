from django.urls import path
from . import views

urlpatterns = [
    path('request/', views.create_grocery_request, name='create-grocery-request'),
    path('my-requests/', views.get_user_grocery_requests, name='user-grocery-requests'),
    path('all/', views.get_all_grocery_requests, name='all-grocery-requests'),
    path('pending/', views.get_pending_grocery_requests, name='pending-grocery-requests'),
    path('request/<int:pk>/update-status/', views.update_grocery_request_status, name='update-grocery-request-status'),
    
    # Distribution plan endpoints
    path('request/<int:grocery_request_id>/distribution/', views.create_grocery_distribution_plan, name='create-grocery-distribution-plan'),
    path('distribution/<int:plan_id>/complete/', views.complete_grocery_distribution, name='complete-grocery-distribution'),
    path('distribution/<int:plan_id>/view/', views.get_grocery_distribution_plan, name='view-grocery-distribution'),
    path('distribution/<int:plan_id>/update-status/', views.update_grocery_distribution_status, name='update-grocery-distribution-status'),
    path('request/<int:grocery_request_id>/distribution/get/', views.get_grocery_distribution_plan_by_request, name='get-grocery-distribution-by-request'),
    path('request/<int:grocery_request_id>/distribution/completed/', views.get_completed_grocery_distribution_plan, name='get-completed-grocery-distribution'),
    path('distribution/<int:plan_id>/feedback/', views.submit_grocery_distribution_feedback, name='submit-grocery-feedback'),
] 