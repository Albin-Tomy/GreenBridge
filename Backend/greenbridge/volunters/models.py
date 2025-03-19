from django.db import models
from authentication.models import User, User_profile
from django.utils import timezone

class VolunteerRegistration(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='volunteer')
    user_profile = models.OneToOneField(User_profile, on_delete=models.CASCADE, null=True, blank=True)
    
    # Additional volunteer-specific fields
    interested_services = models.CharField(
        max_length=50,
        choices=[
            ('waste_collection', 'Waste Collection'),
            ('shg_training', 'SHG Training'),
            ('product_marketing', 'Product Marketing'),
            ('community_service', 'Community Service'),
            ('environmental', 'Environmental Activities')
        ],
        default='community_service'
    )
    
    availability = models.CharField(
        max_length=20,
        choices=[
            ('weekdays', 'Weekdays'),
            ('weekends', 'Weekends'),
            ('both', 'Both'),
            ('flexible', 'Flexible')
        ],
        default='flexible'
    )

    additional_skills = models.TextField(blank=True, null=True)
    experience = models.TextField(blank=True, null=True)
    preferred_location = models.CharField(max_length=255, blank=True, null=True)
    
    status = models.CharField(
        max_length=20,
        choices=[('Active', 'Active'), ('Inactive', 'Inactive')],
        default='Active'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Volunteer: {self.user.email}"

class BlockchainBlock(models.Model):
    index = models.IntegerField()
    timestamp = models.FloatField()
    data = models.JSONField()
    previous_hash = models.CharField(max_length=64)
    hash = models.CharField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['index']

    def __str__(self):
        return f"Block #{self.index}"

class VolunteerActivity(models.Model):
    volunteer_id = models.IntegerField()
    request_id = models.IntegerField()
    request_type = models.CharField(max_length=50)  # food, grocery, book, school_supplies
    action = models.CharField(max_length=50)  # collected, distributed, cancelled
    status = models.CharField(max_length=50)
    description = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.action} - {self.request_type} #{self.request_id} by Volunteer #{self.volunteer_id}"
