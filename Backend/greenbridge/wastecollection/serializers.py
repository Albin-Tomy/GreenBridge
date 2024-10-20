from rest_framework import serializers
from .models import WasteCategory, WasteSubcategory, Location, Request

# WasteCategory Serializer
class WasteCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = WasteCategory
        fields = '__all__'

# WasteSubcategory Serializer
class WasteSubcategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = WasteSubcategory
        fields = '__all__'

# Location Serializer
class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

# Request Serializer
class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = '__all__'
