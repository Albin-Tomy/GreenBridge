from django.contrib import admin
from .models import BookRequest, BookDistribution

@admin.register(BookRequest)
class BookRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'book_type', 'education_level', 'subject', 'status', 'created_at')
    list_filter = ('status', 'book_type', 'education_level')
    search_fields = ('user__email', 'subject', 'pickup_address')

@admin.register(BookDistribution)
class BookDistributionAdmin(admin.ModelAdmin):
    list_display = ('request', 'distributed_to', 'distribution_date')
    search_fields = ('distributed_to', 'notes') 