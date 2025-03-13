from django.urls import path
from . import views

urlpatterns = [
    path('request/', views.create_book_request, name='create-book-request'),
    path('my-requests/', views.get_user_book_requests, name='user-book-requests'),
    path('all/', views.get_all_book_requests, name='all-book-requests'),
    path('pending/', views.get_pending_book_requests, name='pending-book-requests'),
    path('request/<int:pk>/update-status/', views.update_book_request_status, name='update-book-request-status'),
    
    # Distribution plan endpoints
    path('request/<int:book_request_id>/distribution/', views.create_book_distribution_plan, name='create-book-distribution-plan'),
    path('distribution/<int:plan_id>/start/', views.start_book_distribution, name='start-book-distribution'),
    path('distribution/<int:plan_id>/complete/', views.complete_book_distribution, name='complete-book-distribution'),
    path('distribution/<int:plan_id>/view/', views.get_book_distribution_plan, name='view-book-distribution'),
    path('distribution/<int:plan_id>/update-status/', views.update_book_distribution_status, name='update-book-distribution-status'),
    path('request/<int:book_request_id>/distribution/get/', views.get_book_distribution_plan_by_request, name='get-book-distribution-by-request'),
    path('request/<int:book_request_id>/distribution/completed/', views.get_completed_book_distribution_plan, name='get-completed-book-distribution'),
    path('distribution/<int:plan_id>/feedback/', views.submit_book_distribution_feedback, name='submit-book-feedback'),
] 