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

class NGOMoneyRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('transferred', 'Transferred'),
        ('cancelled', 'Cancelled')
    ]

    PURPOSE_CHOICES = [
        ('operational_costs', 'Operational Costs'),
        ('emergency_relief', 'Emergency Relief'),
        ('project_funding', 'Project Funding'),
        ('infrastructure', 'Infrastructure Development'),
        ('education_program', 'Education Program'),
        ('healthcare_program', 'Healthcare Program'),
        ('food_distribution', 'Food Distribution Program'),
        ('other', 'Other')
    ]

    ngo = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'is_ngo': True})
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    purpose = models.CharField(max_length=50, choices=PURPOSE_CHOICES)
    description = models.TextField()
    supporting_documents = models.FileField(upload_to='ngo_money_requests/', null=True, blank=True)
    
    # Bank Details
    bank_account_name = models.CharField(max_length=255)
    bank_account_number = models.CharField(max_length=50)
    bank_name = models.CharField(max_length=255)
    bank_branch = models.CharField(max_length=255)
    ifsc_code = models.CharField(max_length=20)
    
    # Status and Admin Response
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True, null=True)
    transfer_reference = models.CharField(max_length=100, blank=True, null=True)
    transfer_date = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.ngo.name} - ₹{self.amount} - {self.purpose}"

class NGOMoneyRequestUpdate(models.Model):
    money_request = models.ForeignKey(NGOMoneyRequest, on_delete=models.CASCADE, related_name='updates')
    message = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Update for {self.money_request} at {self.created_at}" 