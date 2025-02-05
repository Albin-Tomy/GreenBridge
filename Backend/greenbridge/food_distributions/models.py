from django.db import models
from authentication.models import User

class FoodDistributionRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('collected', 'Collected'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
        ('quality_issue', 'Quality Issue Reported')
    ]

    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name='food_requests')
    food_type = models.CharField(max_length=100)
    quantity = models.CharField(max_length=100)
    pickup_location = models.TextField()
    contact_number = models.CharField(max_length=15)
    requested_date = models.DateTimeField(auto_now_add=True)
    preferred_pickup_time = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    assigned_volunteer = models.ForeignKey(
        'volunters.VolunteerRegistration',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_distributions'
    )
    notes = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"Food Distribution #{self.id} - {self.food_type}"

    class Meta:
        ordering = ['-requested_date'] 