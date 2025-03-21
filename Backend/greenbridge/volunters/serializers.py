from rest_framework import serializers
from .models import VolunteerRegistration
from authentication.serializers import UserProfileSerializer

class VolunteerRegistrationSerializer(serializers.ModelSerializer):
    user_profile = UserProfileSerializer(read_only=True)
    user_details = serializers.SerializerMethodField()

    class Meta:
        model = VolunteerRegistration
        fields = [
            'id', 'user_details', 'user_profile', 'interested_services', 
            'availability', 'additional_skills', 'experience', 
            'preferred_location', 'status', 'created_at'
        ]

    def get_user_details(self, obj):
        if obj.user_profile:
            return {
                'first_name': obj.user_profile.first_name,
                'last_name': obj.user_profile.last_name,
                'phone': obj.user_profile.phone,
                'address': obj.user_profile.default_address,
                'city': obj.user_profile.default_city,
                'state': obj.user_profile.default_state,
                'pincode': obj.user_profile.default_pincode,
            }
        return None
