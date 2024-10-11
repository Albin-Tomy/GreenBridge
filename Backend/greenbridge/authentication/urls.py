from django.urls import path
from .views import user_login,user_registration
from .views import password_reset_request, password_reset_confirm
from .views import (
    user_profile_list, user_profile_create, user_profile_detail,
    user_profile_update, user_profile_delete
)

urlpatterns = [
    path('register/', user_registration),
    path('login/',user_login),
    path('password-reset/', password_reset_request, name='password-reset'),
    path('reset-password/<uidb64>/<token>/', password_reset_confirm, name='reset-password'),
    path('user_profiles/', user_profile_list, name='user-profile-list'),
    path('user_profiles/create/', user_profile_create, name='user-profile-create'),
    path('user_profiles/<int:id>/', user_profile_detail, name='user-profile-detail'),
    path('user_profiles/update/<int:id>/', user_profile_update, name='user-profile-update'),
    path('user_profiles/<str:pk>/delete/', user_profile_delete, name='user-profile-delete'),

]
