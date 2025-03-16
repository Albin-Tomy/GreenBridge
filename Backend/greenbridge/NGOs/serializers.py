from rest_framework import serializers
from .models import NGORegistration, NGOProfile

class NGORegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = NGORegistration
        fields = ['id', 'name', 'email', 'registration_number', 'status', 'created_at']
        read_only_fields = ['status', 'created_at']

class NGOProfileSerializer(serializers.ModelSerializer):
    registration_number = serializers.CharField(source='registration.registration_number', read_only=True)
    ngo_name = serializers.CharField(source='registration.name', read_only=True)
    registration_status = serializers.CharField(source='registration.status', read_only=True)

    class Meta:
        model = NGOProfile
        fields = [
            'id', 'registration', 'description', 'contact_person', 'contact_phone',
            'address', 'website', 'bank_account_name', 'bank_account_number',
            'bank_name', 'bank_branch', 'ifsc_code', 'registration_certificate',
            'tax_exemption_certificate', 'annual_report', 'registration_number',
            'ngo_name', 'registration_status'
        ]
        read_only_fields = ['registration', 'registration_number', 'ngo_name', 'registration_status']
        extra_kwargs = {
            'contact_phone': {'required': False, 'allow_blank': True},
            'website': {'required': False, 'allow_blank': True},
            'description': {'required': False, 'allow_blank': True},
            'address': {'required': False, 'allow_blank': True},
            'bank_account_name': {'required': False, 'allow_blank': True},
            'bank_account_number': {'required': False, 'allow_blank': True},
            'bank_name': {'required': False, 'allow_blank': True},
            'bank_branch': {'required': False, 'allow_blank': True},
            'ifsc_code': {'required': False, 'allow_blank': True},
        }

    def validate_contact_phone(self, value):
        if value and not value.isdigit():
            raise serializers.ValidationError("Contact phone should contain only digits")
        if value and not (10 <= len(value) <= 15):
            raise serializers.ValidationError("Contact phone should be between 10 and 15 digits")
        return value

    def validate_website(self, value):
        if value and not (value.startswith('http://') or value.startswith('https://')):
            value = 'https://' + value
        return value

    def validate(self, data):
        # Validate bank details if any of them are provided
        bank_fields = ['bank_account_name', 'bank_account_number', 'bank_name', 'bank_branch', 'ifsc_code']
        provided_bank_fields = [field for field in bank_fields if field in data]
        
        if provided_bank_fields:
            # Check if we're updating all bank fields or none
            current_bank_details = {
                field: getattr(self.instance, field) if self.instance else None
                for field in bank_fields
            }
            
            # Combine current and new data
            for field in bank_fields:
                if field not in data and current_bank_details[field]:
                    data[field] = current_bank_details[field]
            
            # Check for missing fields
            missing_fields = [
                field for field in bank_fields 
                if not data.get(field) and not current_bank_details.get(field)
            ]
            
            if missing_fields:
                raise serializers.ValidationError({
                    'bank_details': f'Please provide all bank details. Missing: {", ".join(missing_fields)}'
                })
            
            # Validate IFSC code format
            if 'ifsc_code' in data and data['ifsc_code']:
                ifsc = data['ifsc_code'].upper()
                if not (len(ifsc) == 11 and ifsc[:4].isalpha() and ifsc[4:].isdigit()):
                    raise serializers.ValidationError({
                        'ifsc_code': 'Invalid IFSC code format. It should be 11 characters: first 4 alphabets followed by 7 numbers'
                    })
                data['ifsc_code'] = ifsc

            # Validate account number
            if 'bank_account_number' in data and data['bank_account_number']:
                acc_num = data['bank_account_number']
                if not (acc_num.isdigit() and 8 <= len(acc_num) <= 20):
                    raise serializers.ValidationError({
                        'bank_account_number': 'Account number should be between 8 and 20 digits'
                    })

        return data

    def update(self, instance, validated_data):
        # Preserve existing values if not provided in update
        for field in self.Meta.fields:
            if field not in validated_data and field not in self.Meta.read_only_fields:
                validated_data[field] = getattr(instance, field)
        
        return super().update(instance, validated_data) 