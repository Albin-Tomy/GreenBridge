from django.db import models
from authentication.models import User
from volunters.models import VolunteerRegistration

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

class FoodQualityReport(models.Model):
    QUALITY_ISSUES = [
        ('good', 'Good Quality'),
        ('expired', 'Food Expired'),
        ('contaminated', 'Food Contaminated'),
        ('spoiled', 'Food Spoiled'),
        ('packaging_damaged', 'Packaging Damaged'),
        ('temperature_issue', 'Temperature Control Issue'),
        ('other', 'Other Issue')
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Report Approved'),
        ('rejected', 'Report Rejected')
    ]

    food_request = models.ForeignKey(FoodRequest, on_delete=models.CASCADE, related_name='quality_reports')
    volunteer = models.ForeignKey(VolunteerRegistration, on_delete=models.CASCADE, related_name='food_quality_reports')
    issue_type = models.CharField(max_length=20, choices=QUALITY_ISSUES)
    description = models.TextField()

    # Additional Quality Testing Fields
    temperature = models.FloatField(null=True, blank=True, help_text="Temperature of the food at the time of pickup (in Celsius).")
    packaging_integrity = models.BooleanField(default=True, help_text="Is the packaging intact and undamaged?")
    labeling_accuracy = models.BooleanField(default=True, help_text="Are the labels accurate and legible?")
    allergen_check = models.BooleanField(default=True, help_text="Are allergens properly labeled and separated?")
    hygiene_check = models.BooleanField(default=True, help_text="Is the food stored in a hygienic condition?")
    weight_check = models.FloatField(null=True, blank=True, help_text="Weight of the food package (in kilograms).")
    visual_inspection = models.BooleanField(default=True, help_text="Does the food pass visual inspection for spoilage or contamination?")
    smell_test = models.BooleanField(default=True, help_text="Does the food pass the smell test for freshness?")
    expiration_check = models.BooleanField(default=True, help_text="Is the food within its expiration date?")
    storage_condition = models.CharField(max_length=50, null=True, blank=True, help_text="Condition of storage (e.g., refrigerated, frozen, room temperature).")

    reported_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Quality Report #{self.id} for Food Request #{self.food_request.id}"

    class Meta:
        ordering = ['-reported_at']

class DistributionMetrics(models.Model):
    date = models.DateField(auto_now_add=True)
    total_food_distributed = models.FloatField(default=0)
    number_of_beneficiaries = models.IntegerField(default=0)
    food_waste_prevented = models.FloatField(default=0)
    
    class Meta:
        ordering = ['-date']

class Donor(models.Model):
    name = models.CharField(max_length=200)
    contact_info = models.CharField(max_length=200)
    reliability_score = models.FloatField(default=5.0)
    
    def __str__(self):
        return self.name

class Donation(models.Model):
    donor = models.ForeignKey(Donor, on_delete=models.CASCADE, related_name='donations')
    date = models.DateTimeField(auto_now_add=True)
    items = models.JSONField()
    quantity = models.FloatField()
    
    def __str__(self):
        return f"Donation by {self.donor.name} on {self.date}"

class FoodDistributionPlan(models.Model):
    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    ]

    food_request = models.ForeignKey(FoodRequest, on_delete=models.CASCADE, related_name='distribution_plans')
    volunteer = models.ForeignKey('volunters.VolunteerRegistration', on_delete=models.SET_NULL, null=True)
    
    # Distribution Details
    distribution_date = models.DateTimeField()
    distribution_location = models.CharField(max_length=255)
    beneficiary_type = models.CharField(max_length=100)  # e.g., "Orphanage", "Old Age Home"
    beneficiary_name = models.CharField(max_length=255)
    beneficiary_contact = models.CharField(max_length=15)
    estimated_beneficiaries = models.IntegerField()
    
    # Actual Distribution Details
    actual_beneficiaries = models.IntegerField(null=True, blank=True)
    food_condition_on_delivery = models.TextField(null=True, blank=True)
    distribution_proof = models.ImageField(upload_to='distribution_proofs/', null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')
    notes = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Distribution Plan #{self.id} for Food Request #{self.food_request.id}"

class DistributionFeedback(models.Model):
    distribution = models.ForeignKey(FoodDistributionPlan, on_delete=models.CASCADE, related_name='feedback')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    feedback_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback for Distribution #{self.distribution.id}"

