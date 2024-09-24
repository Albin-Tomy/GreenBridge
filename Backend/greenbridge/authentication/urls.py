from django.urls import path
from .views import user_login,user_registration

urlpatterns = [
    path('register/', user_registration),
    path('login/',user_login),
]
