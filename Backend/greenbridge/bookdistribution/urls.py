from django.urls import path
from . import views

urlpatterns = [
    path('request/', views.create_book_request, name='create-book-request'),
    path('my-requests/', views.get_user_book_requests, name='user-book-requests'),
    path('all/', views.get_all_book_requests, name='all-book-requests'),
    path('pending/', views.get_pending_book_requests, name='pending-book-requests'),
    path('request/<int:pk>/update-status/', views.update_book_request_status, name='update-book-request-status'),
] 