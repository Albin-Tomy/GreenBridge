from rest_framework import serializers
from .models import FoodRequest, FoodDistribution, FoodQualityReport

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
