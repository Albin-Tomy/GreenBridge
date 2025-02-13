from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_donation, name='create-donation'),
    path('verify/', views.verify_donation, name='verify-donation'),
    path('my-donations/', views.get_user_donations, name='user-donations'),
] 