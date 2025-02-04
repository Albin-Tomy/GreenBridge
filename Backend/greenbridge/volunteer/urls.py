from django.urls import path
from . import views

urlpatterns = [
    path('notifications/', views.get_notifications, name='notifications'),
    path('notifications/<int:notification_id>/read/', views.mark_notification_read, name='mark-notification-read'),
    path('points/', views.get_volunteer_points, name='volunteer-points'),
] 