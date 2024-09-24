from django.db import models
from authentication.models import User

# SHG Registration: Only stores basic registration information
class SHGRegistration(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    registration_number = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# SHG Profile: Stores detailed information about the SHG after registration
class SHGProfile(models.Model):
    registration = models.OneToOneField(SHGRegistration, on_delete=models.CASCADE, related_name='profile')
    description = models.TextField(blank=True, null=True)
    contact_person = models.CharField(max_length=255)
    contact_phone = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=[('Pending', 'Pending'), ('Approved', 'Approved'), ('Rejected', 'Rejected')], default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_shgs')

    def __str__(self):
        return self.registration.name
