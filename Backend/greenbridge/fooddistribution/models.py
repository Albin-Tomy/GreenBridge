from django.db import models
from authentication.models import User

class FoodRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('collected', 'Collected'),
        ('distributed', 'Distributed'),
        ('cancelled', 'Cancelled'),
        ('quality_issue', 'Quality Issue Reported')
    ]

    FOOD_TYPE_CHOICES = [
        ('cooked', 'Cooked Food'),
        ('raw', 'Raw Food'),
        ('packaged', 'Packaged Food'),
        ('beverages', 'Beverages'),
        ('other', 'Other')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    food_type = models.CharField(max_length=50, choices=FOOD_TYPE_CHOICES)
    quantity = models.CharField(max_length=100)  # e.g., "5 kg", "3 boxes"
    expiry_time = models.DateTimeField()  # When the food needs to be collected by
    pickup_address = models.TextField()
    contact_number = models.CharField(max_length=15)
    additional_notes = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.food_type} - {self.status} - {self.created_at.date()}"

class FoodDistribution(models.Model):
    food_request = models.ForeignKey(FoodRequest, on_delete=models.CASCADE)
    volunteer = models.ForeignKey('volunters.VolunteerRegistration', on_delete=models.SET_NULL, null=True)
    beneficiary_type = models.CharField(max_length=100)  # e.g., "Orphanage", "Old Age Home"
    beneficiary_count = models.IntegerField()  # Number of people who received food
    distribution_date = models.DateTimeField()
    distribution_location = models.TextField()
    proof_of_distribution = models.ImageField(upload_to='food_distribution_proofs/', null=True, blank=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Distribution for {self.food_request} - {self.distribution_date.date()}"
