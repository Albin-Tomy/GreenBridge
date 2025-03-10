from rest_framework import serializers
from .models import BookRequest, BookDistribution, BookDistributionPlan, BookDistributionFeedback

class BookRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookRequest
        fields = '__all__'
        read_only_fields = ('user', 'status', 'created_at', 'updated_at')

class BookDistributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookDistribution
        fields = '__all__'

class BookDistributionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookDistributionPlan
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class BookDistributionFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookDistributionFeedback
        fields = '__all__'
        read_only_fields = ('created_at',) 