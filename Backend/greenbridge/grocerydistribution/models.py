from django.db import models
from authentication.models import User

class GroceryRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('collected', 'Collected')
    ]

    GROCERY_TYPE_CHOICES = [
        ('grains', 'Grains & Cereals'),
        ('pulses', 'Pulses & Lentils'),
        ('spices', 'Spices & Condiments'),
        ('oils', 'Cooking Oils'),
        ('dry_fruits', 'Dry Fruits & Nuts'),
        ('others', 'Others')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    grocery_type = models.CharField(max_length=20, choices=GROCERY_TYPE_CHOICES)
    quantity = models.PositiveIntegerField(help_text="Quantity in kg")
    expiry_date = models.DateField()
    pickup_address = models.TextField()
    contact_number = models.CharField(max_length=15)
    additional_notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.grocery_type} - {self.user.email}"

class GroceryDistribution(models.Model):
    request = models.OneToOneField(GroceryRequest, on_delete=models.CASCADE)
    distributed_to = models.CharField(max_length=255)
    distribution_date = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Distribution for {self.request}" 