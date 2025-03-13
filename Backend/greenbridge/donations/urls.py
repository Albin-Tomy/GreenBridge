from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_donation, name='create-donation'),
    path('verify/', views.verify_donation, name='verify-donation'),
    path('my-donations/', views.get_user_donations, name='user-donations'),

    path('ngo/money-request/create/', views.create_ngo_money_request, name='create-ngo-money-request'),
    path('ngo/money-request/my-requests/', views.get_ngo_money_requests, name='ngo-money-requests'),
    path('ngo/money-request/all/', views.get_all_money_requests, name='all-money-requests'),
    path('ngo/money-request/<int:request_id>/', views.get_money_request_details, name='money-request-details'),
    path('ngo/money-request/<int:request_id>/update-status/', views.update_money_request_status, name='update-money-request-status'),
    path('ngo/money-request/<int:request_id>/add-update/', views.add_money_request_update, name='add-money-request-update'),
] 