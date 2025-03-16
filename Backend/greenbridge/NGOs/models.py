from django.db import models
from authentication.models import User

class NGORegistration(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True, db_index=True)
    password = models.CharField(max_length=128)
    registration_number = models.CharField(max_length=255, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20, 
        choices=[('Pending', 'Pending'), ('Approved', 'Approved'), ('Rejected', 'Rejected')], 
        default='Pending'
    )

    def __str__(self):
        return self.name

class NGOProfile(models.Model):
    registration = models.OneToOneField(NGORegistration, on_delete=models.CASCADE, related_name='profile')
    description = models.TextField(blank=True, null=True)
    contact_person = models.CharField(max_length=255)
    contact_phone = models.CharField(max_length=20)
    address = models.TextField()
    website = models.URLField(blank=True, null=True)
    
    # Bank Details
    bank_account_name = models.CharField(max_length=255, null=True, blank=True)
    bank_account_number = models.CharField(max_length=50, null=True, blank=True)
    bank_name = models.CharField(max_length=255, null=True, blank=True)
    bank_branch = models.CharField(max_length=255, null=True, blank=True)
    ifsc_code = models.CharField(max_length=20, null=True, blank=True)
    
    # Documents
    registration_certificate = models.FileField(upload_to='ngo_documents/registration/', null=True, blank=True)
    tax_exemption_certificate = models.FileField(upload_to='ngo_documents/tax/', null=True, blank=True)
    annual_report = models.FileField(upload_to='ngo_documents/reports/', null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_ngos')

    def __str__(self):
        return self.registration.name 