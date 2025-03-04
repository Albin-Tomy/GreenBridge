from rest_framework import serializers
from .models import FoodRequest, FoodDistribution, FoodQualityReport, DistributionMetrics, Donor, Donation, FoodDistributionPlan, DistributionFeedback

class FoodRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodRequest
        fields = '__all__'
        read_only_fields = ('status', 'created_at', 'updated_at')

class FoodDistributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodDistribution
        fields = '__all__'

class FoodQualityReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodQualityReport
        fields = '__all__'
        read_only_fields = ('reported_at', 'status', 'admin_notes', 'resolved_at')

class DistributionMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DistributionMetrics
        fields = '__all__'

class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = '__all__'

class DonorSerializer(serializers.ModelSerializer):
    donations = DonationSerializer(many=True, read_only=True)
    
    class Meta:
        model = Donor
        fields = ['id', 'name', 'contact_info', 'reliability_score', 'donations']

class FoodDistributionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodDistributionPlan
        fields = [
            'id', 'food_request', 'volunteer', 'distribution_date',
            'distribution_location', 'beneficiary_type', 'beneficiary_name',
            'beneficiary_contact', 'estimated_beneficiaries', 'status',
            'notes', 'created_at', 'updated_at'
        ]

class DistributionFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = DistributionFeedback
        fields = ['id', 'distribution', 'rating', 'feedback_text', 'created_at']
        read_only_fields = ['created_at']
