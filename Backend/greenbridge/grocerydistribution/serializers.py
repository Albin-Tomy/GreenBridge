from rest_framework import serializers
from .models import GroceryRequest, GroceryDistribution, GroceryDistributionPlan, GroceryDistributionFeedback

class GroceryRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryRequest
        fields = '__all__'
        read_only_fields = ('user', 'status', 'created_at', 'updated_at')

class GroceryDistributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryDistribution
        fields = '__all__'

class GroceryDistributionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryDistributionPlan
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class GroceryDistributionFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryDistributionFeedback
        fields = '__all__'
        read_only_fields = ('created_at',) 