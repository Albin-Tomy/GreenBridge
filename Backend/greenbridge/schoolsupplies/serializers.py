from rest_framework import serializers
from .models import SchoolSupplyRequest, SchoolSupplyDistribution

class SchoolSupplyRequestSerializer(serializers.ModelSerializer):
    user_email = serializers.SerializerMethodField()

    class Meta:
        model = SchoolSupplyRequest
        fields = [
            'id', 'user', 'user_email', 'supply_type', 'education_level',
            'quantity', 'description', 'condition', 'pickup_address',
            'contact_number', 'additional_notes', 'status',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'user_email']

    def get_user_email(self, obj):
        return obj.user.email if obj.user else None

class SchoolSupplyDistributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolSupplyDistribution
        fields = [
            'id', 'request', 'distributed_to', 'distribution_date',
            'beneficiary_count', 'distribution_location', 'notes'
        ] 