from rest_framework import serializers
from .models import User,User_profile
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User_profile
        fields = [
            'first_name', 
            'last_name', 
            'phone', 
            'default_address', 
            'default_city', 
            'default_state', 
            'default_pincode',
            'updated_at',  # Optional to show these fields if needed in response
            'created_at'   # Optional
        ]
        read_only_fields = ['updated_at', 'created_at']


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
 
    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("There is no user registered with this email address.")
        return value
 
 
class PasswordResetConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
 
    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data