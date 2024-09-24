from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from .models import SHGRegistration, SHGProfile, User
from .serializers import SHGRegistrationSerializer
from authentication.models import User
from django.contrib.auth.hashers import make_password


@api_view(['POST'])
def register_shg(request):
    try:
        data = request.data
        email = data.get('email')
        password = data.get('password')

        # Check if email and password are provided
        if not email or not password:
            return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user with this email already exists
        if User.objects.filter(email=email).exists():
            return Response({"error": "User with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # Create a user but set is_active=False until admin approves
        user = User.objects.create(
            email=email,
            password=make_password(password),  # Hash the password
            is_active=False  # Initially inactive, awaiting admin approval
        )

        # Create the SHG registration with basic information
        shg_registration = SHGRegistration.objects.create(
            name=data.get('name'),
            email=email,
            password=user.password,  # Store the hashed password
            registration_number=data.get('registration_number')
        )

        return Response({'message': 'Registration submitted successfully. Awaiting admin approval.'}, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def approve_shg(request):
    try:
        shg_id = request.data.get('shg_id')
        action = request.data.get('action')
        
        shg_registration = SHGRegistration.objects.get(id=shg_id)

        if action == 'approve':
            # Activate the corresponding user
            user = User.objects.get(email=shg_registration.email)
            user.is_active = True  # Activate user upon approval
            user.save()

            # Create SHG profile upon approval
            shg_profile = SHGProfile.objects.create(
                registration=shg_registration,
                contact_person=request.data.get('contact_person', ''),
                contact_phone=request.data.get('contact_phone', ''),
                description=request.data.get('description', ''),
                status='Approved',
                approved_by=request.user  # Admin who approved
            )

            return Response({'message': 'SHG approved successfully!'}, status=status.HTTP_200_OK)

        elif action == 'reject':
            # If rejected, mark SHG as rejected and keep user inactive
            shg_registration.status = 'Rejected'
            shg_registration.save()
            return Response({'message': 'SHG rejected successfully!'}, status=status.HTTP_200_OK)

    except SHGRegistration.DoesNotExist:
        return Response({'error': 'SHG registration not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# View to get all pending SHG requests
@api_view(['GET'])
@permission_classes([IsAdminUser])  # Ensure only admins can access this view
def get_pending_shg_requests(request):
    try:
        # Fetch SHGs where status is 'Pending' or not approved yet
        pending_shgs = SHGRegistration.objects.filter(status='Pending')
        
        # Serialize the data
        serializer = SHGRegistrationSerializer(pending_shgs, many=True)
        
        # Return the serialized data
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# View to get all SHGs (both pending and approved)
@api_view(['GET'])
@permission_classes([IsAdminUser])  # Ensure only admins can access this view
def get_all_shgs(request):
    try:
        # Fetch all SHGs regardless of their status
        all_shgs = SHGRegistration.objects.all()
        
        # Serialize the data
        serializer = SHGRegistrationSerializer(all_shgs, many=True)
        
        # Return the serialized data
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
