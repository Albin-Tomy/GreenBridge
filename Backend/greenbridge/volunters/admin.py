from django.contrib import admin
from .models import VolunteerRegistration, BlockchainBlock, FoodQualityReport

@admin.register(FoodQualityReport)
class FoodQualityReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'volunteer', 'issue_type', 'status', 'reported_at')
    list_filter = ('issue_type', 'status')
    search_fields = ('description', 'volunteer__user__email')
