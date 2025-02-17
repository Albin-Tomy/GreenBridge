from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from .views import search_products

urlpatterns = [
    path('list/', views.list_products, name='list_products'),  # List all products
    path('details/<int:pk>/', views.product_details, name='product_details'),  # Retrieve product details
    path('delete/<int:pk>/', views.delete_product, name='delete_product'),  # Delete product
    path('create/', views.create_product, name='create_product'),  # Create product
    path('update/<int:pk>/', views.update_product, name='update_product'),  # Update product
    path('api/search/', search_products, name='search_products'),
    path('filter/', views.product_filter, name='product_filter'),

    path('category-list/', views.category_list, name='category-list'),
    path('category-create/', views.category_create, name='category-create'),
    path('category-details/<int:pk>/', views.category_detail, name='category-detail'),
    path('category-update/<int:pk>/', views.category_update, name='category-update'),
    path('category-delete/<int:pk>/', views.category_delete, name='category-delete'),
    path('madeof-list/', views.madeof_list, name='madeof-list'),
    path('madeof-details/<int:madeof_id>/', views.madeof_detail, name='madeof-detail'),
    path('madeof-create/', views.madeof_create, name='madeof-create'),  # Create API
    path('madeof-update/<int:madeof_id>/', views.madeof_update, name='madeof-update'),  # Update API
    path('madeof-delete/<int:madeof_id>/', views.madeof_delete, name='madeof-delete'),  # Delete API
    path('country-list/', views.country_list, name='country-list'),
    path('country-create/', views.country_create, name='country-create'),
    path('country-detail/<int:pk>/', views.country_detail, name='country-detail'),
    path('country-update/<int:pk>/', views.country_update, name='country-update'), 
    path('country-delete/<int:pk>/', views.country_delete, name='country-delete'),  
    path('brand-list/', views.brand_list, name='brand-list'),
    path('brand-create/', views.brand_create, name='brand-create'), 
    path('brand-details/<int:pk>/', views.brand_detail, name='brand-detail'),
    path('brand-update/<int:pk>/', views.brand_update, name='brand-update'),
    path('brand-delete/<int:pk>/', views.brand_delete, name='brand-delete'),
    # SubCategory URLs
    path('subcategory-list/', views.subcategory_list, name='subcategory-list'),  # List all subcategories
    path('subcategory-create/', views.subcategory_create, name='subcategory-create'),  # Create a new subcategory
    path('subcategory-details/<int:pk>/', views.subcategory_detail, name='subcategory-detail'),  # Retrieve subcategory details
    path('subcategory-update/<int:pk>/', views.subcategory_update, name='subcategory-update'),  # Update a subcategory
    path('subcategory-delete/<int:pk>/', views.subcategory_delete, name='subcategory-delete'),  # Delete a subcategory

    path('disable-or-enable/<int:pk>/',views.disable_enable_product,name='disable_or_enable_product'),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)