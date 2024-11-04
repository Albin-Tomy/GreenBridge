from django.urls import path
from . import views
from .views import (
    location_list_create,
    location_detail,
    update_collection_status
)

urlpatterns = [
    # WasteCategory URLs
    path('waste-categories/', views.waste_category_list_create, name='waste_category_list_create'),
    path('waste-categories/<int:pk>/', views.waste_category_detail, name='waste_category_detail'),
    path('waste-categories/<int:pk>/', views.waste_category_detail, name='waste_category_detail'),
    
    # WasteSubcategory URLs
    path('waste-subcategories/', views.waste_subcategory_list_create, name='waste_subcategory_list_create'),
    path('waste-subcategories/<int:pk>/', views.waste_subcategory_detail, name='waste_subcategory_detail'),
    
    # Request URLs
    path('requests/', views.request_list_create, name='request_list_create'),
    path('requests/<int:pk>/', views.request_detail, name='request_detail'),

    path('requests/<int:pk>/approve/', views.approve_request, name='approve_request'),
    path('requests/<int:pk>/update-status/', update_collection_status, name='update-collection-status'),

    path('locations/', location_list_create, name='location-list-create'),
    path('locations/<int:pk>/', location_detail, name='location-detail'),
]
