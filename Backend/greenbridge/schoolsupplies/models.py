from django.db import models
from authentication.models import User

class SchoolSupplyRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('collected', 'Collected'),
        ('distributed', 'Distributed'),
        ('cancelled', 'Cancelled')
    ]

    SUPPLY_TYPE_CHOICES = [
        ('stationery', 'Stationery'),
        ('bags', 'School Bags'),
        ('uniforms', 'School Uniforms'),
        ('shoes', 'School Shoes'),
        ('books', 'Text Books'),
        ('other', 'Other Supplies')
    ]

    EDUCATION_LEVEL_CHOICES = [
        ('primary', 'Primary School'),
        ('secondary', 'Secondary School'),
        ('higher_secondary', 'Higher Secondary'),
        ('other', 'Other')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    supply_type = models.CharField(max_length=50, choices=SUPPLY_TYPE_CHOICES)
    education_level = models.CharField(max_length=50, choices=EDUCATION_LEVEL_CHOICES)
    quantity = models.PositiveIntegerField()
    description = models.TextField()
    condition = models.CharField(max_length=100)
    pickup_address = models.TextField()
    contact_number = models.CharField(max_length=15)
    additional_notes = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.supply_type} - {self.user.email}"

class SchoolSupplyDistribution(models.Model):
    request = models.OneToOneField(SchoolSupplyRequest, on_delete=models.CASCADE)
    distributed_to = models.CharField(max_length=255)
    distribution_date = models.DateTimeField(auto_now_add=True)
    beneficiary_count = models.IntegerField()
    distribution_location = models.TextField()
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Distribution for {self.request}" 