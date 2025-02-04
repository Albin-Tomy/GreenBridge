from rest_framework import serializers
from .models import BookRequest, BookDistribution

class BookRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookRequest
        fields = '__all__'
        read_only_fields = ('user', 'status', 'created_at', 'updated_at')

class BookDistributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookDistribution
        fields = '__all__' 