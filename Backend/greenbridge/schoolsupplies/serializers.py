from rest_framework import serializers
from .models import (
    SchoolSuppliesRequest,
    SchoolSupplyDistribution,
    SchoolSuppliesDistributionPlan,
    SchoolSuppliesDistributionFeedback
)

class SchoolSuppliesRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolSuppliesRequest
        fields = '__all__'
        read_only_fields = ('user', 'status', 'created_at', 'updated_at')

class SchoolSupplyDistributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolSupplyDistribution
        fields = '__all__'

class SchoolSuppliesDistributionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolSuppliesDistributionPlan
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class SchoolSuppliesDistributionFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolSuppliesDistributionFeedback
        fields = '__all__'
        read_only_fields = ('created_at',) 