from rest_framework import serializers
from .models import NGORegistration, NGOProfile

class NGORegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = NGORegistration
        fields = ['id', 'name', 'email', 'registration_number', 'status', 'created_at']

class NGOProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = NGOProfile
        fields = ['id', 'description', 'contact_person', 'contact_phone', 'address', 'website'] 