from rest_framework import serializers
from .models import Donation

class DonationSerializer(serializers.ModelSerializer):
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