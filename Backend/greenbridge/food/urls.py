from django.urls import path
from . import views

urlpatterns = [
    # ... existing urls ...
    path('metrics/analytics/', views.get_metrics_analytics, name='food-metrics-analytics'),
] 