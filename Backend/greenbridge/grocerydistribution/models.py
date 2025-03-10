from django.db import models
from authentication.models import User
from volunters.models import VolunteerRegistration

class GroceryRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('collected', 'Collected'),
        ('cancelled', 'Cancelled'),
        ('distribution_planned', 'Distribution Planned'),
        ('distributed', 'Distributed')
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

class GroceryDistributionPlan(models.Model):
    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    ]

    grocery_request = models.ForeignKey(GroceryRequest, on_delete=models.CASCADE, related_name='distribution_plans')
    volunteer = models.ForeignKey('volunters.VolunteerRegistration', on_delete=models.SET_NULL, null=True)
    
    # Distribution Details
    distribution_date = models.DateTimeField()
    distribution_location = models.CharField(max_length=255)
    beneficiary_type = models.CharField(max_length=100)  # e.g., "Family", "Community Center"
    beneficiary_name = models.CharField(max_length=255)
    beneficiary_contact = models.CharField(max_length=15)
    number_of_households = models.IntegerField()
    persons_per_household = models.IntegerField()
    
    # Actual Distribution Details
    actual_households_served = models.IntegerField(null=True, blank=True)
    items_distributed = models.JSONField(null=True, blank=True, help_text="List of items actually distributed")
    distribution_proof = models.ImageField(upload_to='grocery_distribution_proofs/', null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')
    notes = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Grocery Distribution Plan #{self.id} - {self.beneficiary_type} - {self.distribution_date}"

    class Meta:
        ordering = ['-created_at']

class GroceryDistributionFeedback(models.Model):
    distribution = models.ForeignKey(GroceryDistributionPlan, on_delete=models.CASCADE, related_name='feedback')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    feedback_text = models.TextField()
    items_quality_rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    packaging_rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    missing_items = models.JSONField(null=True, blank=True)
    suggestions = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback for Grocery Distribution #{self.distribution.id}"

    class Meta:
        ordering = ['-created_at']