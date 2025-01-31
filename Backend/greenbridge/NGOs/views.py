from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from .models import NGORegistration, NGOProfile
from .serializers import NGORegistrationSerializer
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