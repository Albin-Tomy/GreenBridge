from django.db import models
from authentication.models import User, User_profile

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

class VolunteerRequest(models.Model):
    volunteer = models.ForeignKey('VolunteerRegistration', on_delete=models.CASCADE, related_name='requests')
    requested_by = models.ForeignKey(User, on_delete=models.CASCADE)
    request_type = models.CharField(
        max_length=50,
        choices=[
            ('admin_request', 'Admin Request'),
            ('ngo_request', 'NGO Request'),
            ('shg_request', 'SHG Request')
        ]
    )
    service_type = models.CharField(
        max_length=50,
        choices=[
            ('waste_collection', 'Waste Collection'),
            ('shg_training', 'SHG Training'),
            ('product_marketing', 'Product Marketing'),
            ('community_service', 'Community Service'),
            ('environmental', 'Environmental Activities')
        ]
    )
    description = models.TextField()
    location = models.CharField(max_length=255)
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('accepted', 'Accepted'),
            ('rejected', 'Rejected'),
            ('completed', 'Completed')
        ],
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Request for {self.volunteer} by {self.requested_by}"

class VolunteerActivity(models.Model):
    volunteer = models.ForeignKey('VolunteerRegistration', on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=100)
    description = models.TextField()
    date = models.DateField()
    hours_spent = models.IntegerField()
    location = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.volunteer} - {self.activity_type}"
