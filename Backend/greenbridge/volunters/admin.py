from django.contrib import admin
from .models import VolunteerRegistration, BlockchainBlock

@admin.register(VolunteerRegistration)
class VolunteerRegistrationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'interested_services', 'availability', 'status')
    list_filter = ('status', 'interested_services', 'availability')
    search_fields = ('user__email', 'additional_skills')

@admin.register(BlockchainBlock)
class BlockchainBlockAdmin(admin.ModelAdmin):
    list_display = ('index', 'timestamp', 'hash', 'created_at')
    search_fields = ('hash',)
    readonly_fields = ('index', 'timestamp', 'data', 'previous_hash', 'hash')
