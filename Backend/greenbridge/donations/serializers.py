from rest_framework import serializers
from .models import Donation, NGOMoneyRequest, NGOMoneyRequestUpdate
from authentication.serializers import UserSerializer

class DonationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_email = serializers.SerializerMethodField()

    class Meta:
        model = Donation
        fields = [
            'id', 'user', 'user_email', 'amount', 'donation_type',
            'purpose', 'status', 'razorpay_order_id', 'razorpay_payment_id',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'user_email', 'razorpay_order_id', 'razorpay_payment_id']

    def get_user_email(self, obj):
        return obj.user.email if obj.user else None

class NGOMoneyRequestUpdateSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = NGOMoneyRequestUpdate
        fields = '__all__'
        read_only_fields = ('created_at',)

class NGOMoneyRequestSerializer(serializers.ModelSerializer):
    ngo = UserSerializer(read_only=True)
    updates = NGOMoneyRequestUpdateSerializer(many=True, read_only=True)
    status_display = serializers.SerializerMethodField()
    purpose_display = serializers.SerializerMethodField()

    class Meta:
        model = NGOMoneyRequest
        fields = '__all__'
        read_only_fields = ('status', 'admin_notes', 'transfer_reference', 'transfer_date', 'created_at', 'updated_at')

    def get_status_display(self, obj):
        return dict(NGOMoneyRequest.STATUS_CHOICES)[obj.status]

    def get_purpose_display(self, obj):
        return dict(NGOMoneyRequest.PURPOSE_CHOICES)[obj.purpose] 