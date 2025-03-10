from django.db import models
from authentication.models import User
from volunters.models import VolunteerRegistration

class BookRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('collected', 'Collected'),
        ('distribution_planned', 'Distribution Planned'),
        ('distributed', 'Distributed'),
        ('cancelled', 'Cancelled')
    ]

    BOOK_TYPE_CHOICES = [
        ('school', 'School Textbooks'),
        ('college', 'College Textbooks'),
        ('reference', 'Reference Books'),
        ('study_materials', 'Study Materials'),
        ('others', 'Others')
    ]

    EDUCATION_LEVEL_CHOICES = [
        ('primary', 'Primary School'),
        ('secondary', 'Secondary School'),
        ('higher_secondary', 'Higher Secondary'),
        ('undergraduate', 'Undergraduate'),
        ('postgraduate', 'Postgraduate'),
        ('others', 'Others')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book_type = models.CharField(max_length=20, choices=BOOK_TYPE_CHOICES)
    education_level = models.CharField(max_length=20, choices=EDUCATION_LEVEL_CHOICES)
    subject = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    condition = models.CharField(max_length=100)
    pickup_address = models.TextField()
    contact_number = models.CharField(max_length=15)
    additional_notes = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.book_type} - {self.subject}"

class BookDistribution(models.Model):
    request = models.OneToOneField(BookRequest, on_delete=models.CASCADE)
    distributed_to = models.CharField(max_length=255)
    distribution_date = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Distribution for {self.request}"

class BookDistributionPlan(models.Model):
    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    ]

    book_request = models.ForeignKey(BookRequest, on_delete=models.CASCADE, related_name='distribution_plans')
    volunteer = models.ForeignKey('volunters.VolunteerRegistration', on_delete=models.SET_NULL, null=True)
    
    # Distribution Details
    distribution_date = models.DateTimeField()
    distribution_location = models.CharField(max_length=255)
    beneficiary_type = models.CharField(max_length=100)
    beneficiary_name = models.CharField(max_length=255)
    beneficiary_contact = models.CharField(max_length=15)
    number_of_beneficiaries = models.IntegerField()
    education_level = models.CharField(max_length=100)
    subject_preferences = models.TextField(blank=True, null=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')
    notes = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Distribution Plan #{self.id} for Book Request #{self.book_request.id}"

class BookDistributionFeedback(models.Model):
    distribution = models.ForeignKey(BookDistributionPlan, on_delete=models.CASCADE, related_name='feedback')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    feedback_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback for Distribution #{self.distribution.id}" 