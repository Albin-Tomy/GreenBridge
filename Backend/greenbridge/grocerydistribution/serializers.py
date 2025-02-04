from rest_framework import serializers
from .models import GroceryRequest, GroceryDistribution

class GroceryRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryRequest
        fields = '__all__'
        read_only_fields = ('user', 'status', 'created_at', 'updated_at')

class GroceryDistributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryDistribution
        fields = '__all__' 