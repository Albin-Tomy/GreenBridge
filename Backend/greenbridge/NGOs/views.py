from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from .models import NGORegistration, NGOProfile
from .serializers import NGORegistrationSerializer, NGOProfileSerializer
from authentication.models import User
from django.contrib.auth.hashers import make_password
from .permissions import IsAdmin

@api_view(['POST'])
def register_ngo(request):
    try:
        data = request.data
        print('Received Data:', data)

        email = data.get('email')
        password = data.get('password')
        registration_number = data.get('registration_number')

        # Check if user with this email already exists
        if User.objects.filter(email=email).exists():
            return Response({"error": "User with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # Create user account (initially inactive)
        user = User(
            email=email,
            password=make_password(password),
            is_active=False  # Initially inactive until approved
        )
        user.save()

        # Create the NGO registration with pending status
        ngo_registration = NGORegistration(
            name=data.get('name'),
            email=email,
            password=user.password,
            registration_number=registration_number,
            status='Pending'
        )
        ngo_registration.save()

        return Response({
            'message': 'Registration submitted successfully. Awaiting admin approval.'
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        print("Error occurred:", e)
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAdmin])
def approve_ngo(request):
    try:
        ngo_id = request.data.get('ngo_email')
        action = request.data.get('action')

        ngo_registration = NGORegistration.objects.get(email=ngo_id)
        user = User.objects.get(email=ngo_id)

        if action == 'approve':
            # Activate the user
            user.is_active = True
            if hasattr(user, 'is_ngo'):  # Only set is_ngo if the field exists
                user.is_ngo = True
            user.save()

            ngo_registration.status = 'Approved'
            ngo_registration.save()

            return Response({
                'message': 'NGO approved successfully!'
            }, status=status.HTTP_200_OK)

        elif action == 'reject':
            ngo_registration.status = 'Rejected'
            ngo_registration.save()

            # Keep user inactive
            user.is_active = False
            if hasattr(user, 'is_ngo'):  # Only set is_ngo if the field exists
                user.is_ngo = False
            user.save()

            return Response({
                'message': 'NGO rejected successfully!'
            }, status=status.HTTP_200_OK)

    except NGORegistration.DoesNotExist:
        return Response({
            'error': 'NGO registration not found.'
        }, status=status.HTTP_404_NOT_FOUND)
    except User.DoesNotExist:
        return Response({
            'error': 'User not found.'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAdmin])
def get_pending_ngo_requests(request):
    try:
        pending_ngos = NGORegistration.objects.filter(status='Pending')
        serializer = NGORegistrationSerializer(pending_ngos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAdmin])
def get_all_ngos(request):
    try:
        all_ngos = NGORegistration.objects.all()
        serializer = NGORegistrationSerializer(all_ngos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_ngo_profile(request):
    try:
        # Get the NGO registration associated with the user's email
        ngo_registration = NGORegistration.objects.get(email=request.user.email)
        
        # Get or create the NGO profile with registration details
        profile, created = NGOProfile.objects.get_or_create(
            registration=ngo_registration,
            defaults={
                'contact_person': ngo_registration.name,
                'contact_phone': '',
                'address': '',
                'description': f'NGO registered with number: {ngo_registration.registration_number}',
            }
        )

        # Update profile with registration details if they're missing
        if not created and (not profile.contact_person or not profile.description):
            profile.contact_person = profile.contact_person or ngo_registration.name
            profile.description = profile.description or f'NGO registered with number: {ngo_registration.registration_number}'
            profile.save()
        
        # Include registration details in the response
        serializer = NGOProfileSerializer(profile)
        data = serializer.data
        data.update({
            'registration_number': ngo_registration.registration_number,
            'ngo_name': ngo_registration.name,
            'registration_status': ngo_registration.status
        })
        
        return Response(data, status=status.HTTP_200_OK)
    except NGORegistration.DoesNotExist:
        return Response(
            {'error': 'NGO registration not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_ngo_profile(request):
    try:
        # Get the NGO registration associated with the user's email
        ngo_registration = NGORegistration.objects.get(email=request.user.email)
        
        # Check if profile already exists
        if hasattr(ngo_registration, 'profile'):
            return Response(
                {'error': 'Profile already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create new profile with registration details
        profile_data = request.data
        profile_data['registration'] = ngo_registration.id
        profile_data.setdefault('contact_person', ngo_registration.name)
        profile_data.setdefault('description', f'NGO registered with number: {ngo_registration.registration_number}')
        
        serializer = NGOProfileSerializer(data=profile_data)
        if serializer.is_valid():
            profile = serializer.save()
            
            # Include registration details in response
            response_data = serializer.data
            response_data.update({
                'registration_number': ngo_registration.registration_number,
                'ngo_name': ngo_registration.name,
                'registration_status': ngo_registration.status
            })
            
            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except NGORegistration.DoesNotExist:
        return Response(
            {'error': 'NGO registration not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_ngo_profile(request):
    try:
        # Get the NGO registration associated with the user's email
        ngo_registration = NGORegistration.objects.get(email=request.user.email)
        
        # Get the profile
        profile = NGOProfile.objects.get(registration=ngo_registration)
        
        # Update profile while preserving registration details
        profile_data = request.data.copy()  # Make a mutable copy of the data
        
        # Ensure contact person is preserved if not provided
        if not profile_data.get('contact_person'):
            profile_data['contact_person'] = profile.contact_person or ngo_registration.name
            
        # Handle bank details validation
        bank_fields = ['bank_account_name', 'bank_account_number', 'bank_name', 'bank_branch', 'ifsc_code']
        has_bank_fields = any(field in profile_data for field in bank_fields)
        
        if has_bank_fields:
            # If updating bank details, ensure all required fields are present
            for field in bank_fields:
                if field not in profile_data:
                    profile_data[field] = getattr(profile, field, '')
        
        serializer = NGOProfileSerializer(profile, data=profile_data, partial=True)
        if serializer.is_valid():
            updated_profile = serializer.save()
            
            # Include registration details in response
            response_data = serializer.data
            response_data.update({
                'registration_number': ngo_registration.registration_number,
                'ngo_name': ngo_registration.name,
                'registration_status': ngo_registration.status
            })
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        # If validation fails, return detailed error messages
        return Response({
            'error': 'Validation failed',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    except NGORegistration.DoesNotExist:
        return Response(
            {'error': 'NGO registration not found for this user'},
            status=status.HTTP_404_NOT_FOUND
        )
    except NGOProfile.DoesNotExist:
        return Response(
            {'error': 'NGO profile not found. Please create a profile first'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {
                'error': 'An unexpected error occurred',
                'details': str(e)
            },
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_document(request, document_type):
    try:
        # Get the NGO registration associated with the user's email
        ngo_registration = NGORegistration.objects.get(email=request.user.email)
        
        # Get the profile
        profile = NGOProfile.objects.get(registration=ngo_registration)
        
        # Check if document type is valid
        if document_type not in ['registration_certificate', 'tax_exemption_certificate', 'annual_report']:
            return Response(
                {'error': 'Invalid document type'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get the file from request
        if document_type not in request.FILES:
            return Response(
                {'error': 'No file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update the document
        setattr(profile, document_type, request.FILES[document_type])
        profile.save()
        
        return Response(
            {'message': f'{document_type} uploaded successfully'},
            status=status.HTTP_200_OK
        )
    
    except NGORegistration.DoesNotExist:
        return Response(
            {'error': 'NGO registration not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except NGOProfile.DoesNotExist:
        return Response(
            {'error': 'NGO profile not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        ) 