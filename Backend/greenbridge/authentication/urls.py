from django.urls import path
from .views import user_login,user_registration,profile_update
from .views import password_reset_request, password_reset_confirm

urlpatterns = [
    path('register/', user_registration),
    path('login/',user_login),
    path('profile/update/', profile_update, name='profile_update'),
    path('password-reset/', password_reset_request, name='password-reset'),
    path('reset-password/<uidb64>/<token>/', password_reset_confirm, name='reset-password'),
]
