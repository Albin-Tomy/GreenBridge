from django.urls import path
from . import views

urlpatterns = [
    path('request/', views.create_school_supplies_request, name='create-school-supplies-request'),
    path('my-requests/', views.get_user_school_supplies_requests, name='user-school-supplies-requests'),
    path('all/', views.get_all_school_supplies_requests, name='all-school-supplies-requests'),
    path('pending/', views.get_pending_school_supplies_requests, name='pending-school-supplies-requests'),
    path('request/<int:pk>/update-status/', views.update_school_supplies_request_status, name='update-school-supplies-request-status'),
    
    # Distribution plan endpoints
    path('request/<int:supplies_request_id>/distribution/', views.create_school_supplies_distribution_plan, name='create-school-supplies-distribution-plan'),
    path('distribution/<int:plan_id>/complete/', views.complete_school_supplies_distribution, name='complete-school-supplies-distribution'),
    path('distribution/<int:plan_id>/view/', views.get_school_supplies_distribution_plan, name='view-school-supplies-distribution'),
    path('distribution/<int:plan_id>/update-status/', views.update_school_supplies_distribution_status, name='update-school-supplies-distribution-status'),
    path('request/<int:supplies_request_id>/distribution/get/', views.get_school_supplies_distribution_plan_by_request, name='get-school-supplies-distribution-by-request'),
    path('request/<int:supplies_request_id>/distribution/completed/', views.get_completed_school_supplies_distribution_plan, name='get-completed-school-supplies-distribution'),
    path('distribution/<int:plan_id>/feedback/', views.submit_school_supplies_distribution_feedback, name='submit-school-supplies-feedback'),
] 