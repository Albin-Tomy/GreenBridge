from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'metrics', views.MetricsViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('request/', views.create_food_request, name='create-food-request'),
    path('my-requests/', views.get_user_food_requests, name='user-food-requests'),
    path('pending/', views.get_pending_food_requests, name='pending-food-requests'),
    path('all/', views.get_all_food_requests, name='all-food-requests'),
    path('request/<int:pk>/update-status/', views.update_food_request_status, name='update-food-request-status'),
    path('request/<int:request_id>/quality-report/', views.submit_quality_report, name='submit-quality-report'),
    path('request/<int:request_id>/update-status/', views.update_request_status, name='update-request-status'),
    path('request/<int:request_id>/quality-report/view/', views.get_request_quality_report, name='get-quality-report'),
    path('metrics/analytics/', views.MetricsViewSet.as_view({'get': 'get_analytics'})),
    path('test-email/', views.test_email, name='test-email'),
    path('request/<int:food_request_id>/distribution/', views.create_distribution_plan, name='create-distribution-plan'),
    path('distribution/<int:plan_id>/complete/', views.complete_distribution, name='complete-distribution'),
    path('distribution/<int:plan_id>/feedback/', views.submit_distribution_feedback, name='submit-feedback'),
    path('distribution/<int:plan_id>/view/', views.get_distribution_plan, name='view-distribution'),
    path('distribution/<int:plan_id>/update-status/', views.update_distribution_status, name='update-distribution-status'),
    path('request/<int:food_request_id>/distribution/get/', views.get_distribution_plan_by_request, name='get-distribution-by-request'),
    path('request/<int:food_request_id>/distribution/completed/', views.get_completed_distribution_plan, name='get-completed-distribution'),
]
