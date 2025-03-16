from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    NGOMoneyRequestViewSet,
    NGOMoneyRequestUpdateViewSet,
    create_donation,
    verify_donation,
    get_user_donations,
    create_ngo_money_request,
    get_ngo_money_requests,
    get_all_money_requests,
    get_money_request_details,
    update_money_request_status,
    add_money_request_update,
)

router = DefaultRouter()
router.register(r'money-requests', NGOMoneyRequestViewSet, basename='money-request')
router.register(r'money-request-updates', NGOMoneyRequestUpdateViewSet, basename='money-request-update')

urlpatterns = [
    path('', include(router.urls)),
    path('create/', create_donation, name='create-donation'),
    path('verify/', verify_donation, name='verify-donation'),
    path('my-donations/', get_user_donations, name='user-donations'),

    path('ngo/money-request/create/', create_ngo_money_request, name='create-ngo-money-request'),
    path('ngo/money-request/my-requests/', get_ngo_money_requests, name='ngo-money-requests'),
    path('ngo/money-request/all/', get_all_money_requests, name='all-money-requests'),
    path('ngo/money-request/<int:request_id>/', get_money_request_details, name='money-request-details'),
    path('ngo/money-request/<int:request_id>/update-status/', update_money_request_status, name='update-money-request-status'),
    path('ngo/money-request/<int:request_id>/add-update/', add_money_request_update, name='add-money-request-update'),
] 