from django.db import models
from authentication.models import User
from volunters.models import VolunteerRegistration

class SchoolSuppliesRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('collected', 'Collected'),
        ('cancelled', 'Cancelled'),
        ('distribution_planned', 'Distribution Planned'),
        ('distributed', 'Distributed')
    ]

    SUPPLY_TYPE_CHOICES = [
        ('notebooks', 'Notebooks'),
        ('textbooks', 'Textbooks'),
        ('stationery', 'Stationery'),
        ('uniforms', 'Uniforms'),
        ('bags', 'School Bags'),
        ('others', 'Others')
    ]

    EDUCATION_LEVEL_CHOICES = [
        ('primary', 'Primary School'),
        ('middle', 'Middle School'),
        ('high', 'High School'),
        ('higher_secondary', 'Higher Secondary'),
        ('college', 'College'),
        ('other', 'Other')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    supply_type = models.CharField(max_length=20, choices=SUPPLY_TYPE_CHOICES)
    quantity = models.PositiveIntegerField()
    education_level = models.CharField(max_length=20, choices=EDUCATION_LEVEL_CHOICES)
    condition = models.CharField(max_length=100)
    pickup_address = models.TextField()
    contact_number = models.CharField(max_length=15)
    additional_notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.supply_type} - {self.education_level} - {self.status}"

class SchoolSuppliesDistributionPlan(models.Model):
    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    ]

    BENEFICIARY_TYPE_CHOICES = [
        ('school', 'School'),
        ('ngo', 'NGO'),
        ('community_center', 'Community Center'),
        ('individual_students', 'Individual Students'),
        ('orphanage', 'Orphanage'),
        ('other', 'Other')
    ]

    supplies_request = models.ForeignKey(SchoolSuppliesRequest, on_delete=models.CASCADE, related_name='distribution_plans')
    volunteer = models.ForeignKey('volunters.VolunteerRegistration', on_delete=models.SET_NULL, null=True)
    
    # Distribution Details
    distribution_date = models.DateTimeField()
    distribution_location = models.CharField(max_length=255)
    beneficiary_type = models.CharField(max_length=50, choices=BENEFICIARY_TYPE_CHOICES)
    beneficiary_name = models.CharField(max_length=255)
    beneficiary_contact = models.CharField(max_length=15)
    number_of_students = models.IntegerField()
    grade_levels = models.JSONField(help_text="List of grade levels receiving supplies")
    
    # Actual Distribution Details
    actual_students_served = models.IntegerField(null=True, blank=True)
    items_distributed = models.JSONField(null=True, blank=True, help_text="List of items actually distributed")
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')
    notes = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"School Supplies Distribution Plan #{self.id} - {self.beneficiary_type} - {self.distribution_date}"

    class Meta:
        ordering = ['-created_at']

class SchoolSuppliesDistributionFeedback(models.Model):
    distribution = models.ForeignKey(SchoolSuppliesDistributionPlan, on_delete=models.CASCADE, related_name='feedback')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    feedback_text = models.TextField()
    items_condition_rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    completeness_rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    missing_items = models.JSONField(null=True, blank=True)
    suggestions = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback for School Supplies Distribution #{self.distribution.id}"

    class Meta:
        ordering = ['-created_at']

class SchoolSupplyDistribution(models.Model):
    request = models.OneToOneField(SchoolSuppliesRequest, on_delete=models.CASCADE)
    distributed_to = models.CharField(max_length=255)
    distribution_date = models.DateTimeField(auto_now_add=True)
    beneficiary_count = models.IntegerField()
    distribution_location = models.TextField()
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Distribution for {self.request}" 