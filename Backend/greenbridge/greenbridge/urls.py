"""greenbridge URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static




urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/',include('authentication.urls'),name='api/v1/auth'),
    path('api/shg/', include('shg.urls')),
    path('api/adminpanel/', include('adminpanel.urls')),
    path('api/v1/products/',include('products.urls'),name='api/v1/products'),
    path('api/v1/orders/',include('orders.urls'),name='api/v1/orders'),
    path('api/v1/collection/',include('wastecollection.urls'),name='api/v1/collection'),
    path('api/ngo/', include('NGOs.urls')),
    path('api/volunteer/', include('volunters.urls')),
    path('api/v1/food/', include('fooddistribution.urls')),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
