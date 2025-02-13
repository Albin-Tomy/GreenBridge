from django.db import models
from authentication.models import User

class Donation(models.Model):
    DONATION_TYPE_CHOICES = [
        ('one-time', 'One-time Donation'),
        ('monthly', 'Monthly Support'),
        ('project', 'Project Specific'),
        ('emergency', 'Emergency Fund')
    ]

    PURPOSE_CHOICES = [
        ('general', 'General Fund'),
        ('education', 'Education Support'),
        ('food', 'Food Distribution'),
        ('emergency', 'Emergency Relief')
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    donation_type = models.CharField(max_length=20, choices=DONATION_TYPE_CHOICES)
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    razorpay_order_id = models.CharField(max_length=100, null=True, blank=True)
    razorpay_payment_id = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} - ₹{self.amount} - {self.purpose}" 