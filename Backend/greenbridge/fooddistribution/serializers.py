from rest_framework import serializers
from .models import FoodRequest, FoodDistribution

class FoodRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodRequest
        fields = '__all__'
        read_only_fields = ('status', 'created_at', 'updated_at')

class FoodDistributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodDistribution
        fields = '__all__'
