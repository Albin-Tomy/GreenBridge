from django.urls import path
from . import views

urlpatterns = [
    # WasteCategory URLs
    path('waste-categories/', views.waste_category_list_create, name='waste_category_list_create'),
    path('waste-categories/<int:pk>/', views.waste_category_detail, name='waste_category_detail'),
    
    # WasteSubcategory URLs
    path('waste-subcategories/', views.waste_subcategory_list_create, name='waste_subcategory_list_create'),
    path('waste-subcategories/<int:pk>/', views.waste_subcategory_detail, name='waste_subcategory_detail'),
    
    # Request URLs
    path('requests/', views.request_list_create, name='request_list_create'),
    path('requests/<int:pk>/', views.request_detail, name='request_detail'),
]
