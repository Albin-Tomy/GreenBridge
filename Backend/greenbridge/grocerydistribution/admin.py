from django.contrib import admin
from .models import GroceryRequest, GroceryDistribution

@admin.register(GroceryRequest)
class GroceryRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'grocery_type', 'quantity', 'status', 'created_at')
    list_filter = ('status', 'grocery_type')
    search_fields = ('user__email', 'pickup_address')

@admin.register(GroceryDistribution)
class GroceryDistributionAdmin(admin.ModelAdmin):
    list_display = ('request', 'distributed_to', 'distribution_date')
    search_fields = ('distributed_to', 'notes') 