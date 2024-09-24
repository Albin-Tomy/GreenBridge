from rest_framework import serializers
from shg.models import SHG

class AdminSHGApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = SHG
        fields = ['id', 'name', 'status', 'approved_by', 'created_at', 'contact_person']
