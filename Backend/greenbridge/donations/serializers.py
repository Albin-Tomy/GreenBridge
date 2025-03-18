from rest_framework import serializers
from .models import Donation, NGOMoneyRequest, NGOMoneyRequestUpdate
from authentication.serializers import UserSerializer
from NGOs.models import NGOProfile

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
        fields = ['id', 'money_request', 'message', 'created_by', 'created_at']
        read_only_fields = ['created_by', 'created_at']

class NGOMoneyRequestSerializer(serializers.ModelSerializer):
    ngo = UserSerializer(read_only=True)
    updates = NGOMoneyRequestUpdateSerializer(many=True, read_only=True)
    status_display = serializers.SerializerMethodField()
    purpose_display = serializers.SerializerMethodField()
    ngo_bank_details = serializers.SerializerMethodField()
    
    # Add absolute URL fields for documents
    necessity_certificate_url = serializers.SerializerMethodField()
    budget_document_url = serializers.SerializerMethodField()
    project_proposal_url = serializers.SerializerMethodField()
    additional_documents_url = serializers.SerializerMethodField()

    class Meta:
        model = NGOMoneyRequest
        fields = [
            'id', 'ngo', 'amount', 'purpose', 'description',
            'necessity_certificate', 'project_proposal', 'budget_document', 'additional_documents',
            'status', 'admin_notes', 'transfer_reference', 'transfer_date',
            'created_at', 'updated_at', 'updates', 'status_display', 'purpose_display',
            'ngo_bank_details', 'necessity_certificate_url', 'budget_document_url',
            'project_proposal_url', 'additional_documents_url'
        ]
        read_only_fields = [
            'ngo', 'status', 'admin_notes', 'transfer_reference', 'transfer_date',
            'created_at', 'updated_at'
        ]

    def get_status_display(self, obj):
        return dict(NGOMoneyRequest.STATUS_CHOICES)[obj.status]

    def get_purpose_display(self, obj):
        return dict(NGOMoneyRequest.PURPOSE_CHOICES)[obj.purpose]

    def get_ngo_bank_details(self, obj):
        try:
            profile = obj.ngo.ngoprofile
            return {
                'bank_account_name': profile.bank_account_name,
                'bank_account_number': profile.bank_account_number,
                'bank_name': profile.bank_name,
                'bank_branch': profile.bank_branch,
                'ifsc_code': profile.ifsc_code
            }
        except:
            return None

    def get_necessity_certificate_url(self, obj):
        if obj.necessity_certificate:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.necessity_certificate.url)
        return None
    
    def get_budget_document_url(self, obj):
        if obj.budget_document:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.budget_document.url)
        return None
    
    def get_project_proposal_url(self, obj):
        if obj.project_proposal:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.project_proposal.url)
        return None
    
    def get_additional_documents_url(self, obj):
        if obj.additional_documents:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.additional_documents.url)
        return None

    def validate(self, data):
        if not self.instance:  # Only for new requests
            # Validate required documents
            if not data.get('necessity_certificate'):
                raise serializers.ValidationError({
                    'necessity_certificate': 'Necessity certificate is required for new requests.'
                })
            if not data.get('budget_document'):
                raise serializers.ValidationError({
                    'budget_document': 'Budget document is required for new requests.'
                })

            # Validate amount
            amount = float(data.get('amount', 0))
            if not data.get('amount') or amount <= 0:
                raise serializers.ValidationError({
                    'amount': 'Please enter a valid amount greater than 0.'
                })
            
            # Validate amount limits
            if amount < 1000:
                raise serializers.ValidationError({
                    'amount': 'Minimum request amount is ₹1,000.'
                })
            if amount > 1000000:
                raise serializers.ValidationError({
                    'amount': 'Maximum request amount is ₹10,00,000 (10 Lakhs).'
                })

            # Validate purpose and description
            if not data.get('purpose'):
                raise serializers.ValidationError({
                    'purpose': 'Please select a valid purpose.'
                })
            if not data.get('description'):
                raise serializers.ValidationError({
                    'description': 'Please provide a detailed description.'
                })

        return data

    def create(self, validated_data):
        # Set the NGO user before creating the request
        validated_data['ngo'] = self.context['request'].user
        return super().create(validated_data) 