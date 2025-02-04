from django.db import models
from authentication.models import User

class BookRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('collected', 'Collected')
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