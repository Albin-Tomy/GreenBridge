from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from .models import SHGRegistration, SHGProfile
from .serializers import SHGRegistrationSerializer
from authentication.models import User
from django.contrib.auth.hashers import make_password

@api_view(['POST'])
def register_shg(request):
    try:
        data = request.data
        print('Received Data:', data)  # Log received data

        # Required fields
        # required_fields = ['name', 'email', 'password', 'registration_number']
        # for field in required_fields:
        #     if field not in data:
        #         return Response({ "error": f"{field.replace('_', ' ').capitalize()} is required." }, status=status.HTTP_400_BAD_REQUEST)

        email = data.get('email')
        password = data.get('password')
        registration_number = data.get('registration_number')

        # Check if user with this email already exists
        # if User.objects.filter(email=email).exists():
        #     return Response({"error": "User with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        user = User(
        email=email,
        password=make_password(password),  # Hash the password
        is_active=False  # Initially inactive, awaiting admin approval
    )
        user.save()
        # Create the SHG registration with basic information
        shg_registration = SHGRegistration(
            name=data.get('name'),
            email=email,
            password=user.password,  # Store the hashed password
            registration_number=registration_number,
            status='Pending'  # Set the status as Pending
        )
        shg_registration.save()
        return Response({'message': 'Registration submitted successfully. Awaiting admin approval.'}, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        print("Error occurred:", e)  # Log any other errors
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
# @permission_classes([IsAdminUser])
def approve_shg(request):
    print("approved")
    try:
        shg_id = request.data.get('shg_email')
        action = request.data.get('action')
        print(shg_id)
        print(action)
        # if not action or action not in ['approve', 'reject']:
        #     return Response({'error': 'Invalid action. Use "approve" or "reject".'}, status=status.HTTP_400_BAD_REQUEST)

        shg_registration = SHGRegistration.objects.get(email=shg_id)

        if action == 'approve':
            # Activate the user and approve SHG registration
            user = User.objects.get(email=shg_id)
            user.is_active = True
            user.is_shg=True
            shg_registration.status='approved'
            shg_registration.save()
            user.save()

            # # Create SHG profile upon approval
            # shg_profile = SHGProfile.objects.create(
            #     registration=shg_registration,
            #     contact_person=request.data.get('contact_person', ''),
            #     contact_phone=request.data.get('contact_phone', ''),
            #     description=request.data.get('description', ''),
            #     status='Approved',
            #     approved_by=request.user  # Admin who approved
            # )

            return Response({'message': 'SHG approved successfully!'}, status=status.HTTP_200_OK)

        elif action == 'reject':
            # Reject SHG
            shg_registration.status = 'Rejected'
            shg_registration.save()

            return Response({'message': 'SHG rejected successfully!'}, status=status.HTTP_200_OK)

    except SHGRegistration.DoesNotExist:
        return Response({'error': 'SHG registration not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
# @permission_classes([IsAdminUser])  # Ensure admin has access
def get_pending_shg_requests(request):
    print("entered")
    try:
        pending_shgs = SHGRegistration.objects.filter(status='Pending')  # Ensure this query fetches results
        serializer = SHGRegistrationSerializer(pending_shgs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
# @permission_classes([IsAdminUser])
def get_all_shgs(request):
    try:
        all_shgs = SHGRegistration.objects.all()
        serializer = SHGRegistrationSerializer(all_shgs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
