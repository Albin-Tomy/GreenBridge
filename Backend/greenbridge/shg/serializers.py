from rest_framework import serializers
from .models import SHGRegistration, SHGProfile

class SHGRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SHGRegistration
        fields = ['user', 'shg_name', 'registration_number', 'is_approved', 'is_rejected']

class SHGProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SHGProfile
        fields = ['user', 'shg_name', 'registration_number', 'products', 'created_at']
