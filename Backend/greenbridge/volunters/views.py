from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import VolunteerRegistration, VolunteerRequest
from .serializers import VolunteerRegistrationSerializer, VolunteerDashboardSerializer, VolunteerRequestSerializer
from authentication.models import User_profile

# Create your views here.

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_volunteer(request):
    print("=== Debug Info ===")
    print("Request method:", request.method)
    print("Request path:", request.path)
    print("Request data:", request.data)
    print("Request user:", request.user)
    print("=================")
    
    try:
        # Check if user already registered as volunteer
        if hasattr(request.user, 'volunteer'):
            return Response({
                'error': 'You are already registered as a volunteer'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Try to get user profile if it exists
        user_profile = None
        try:
            user_profile = User_profile.objects.get(user=request.user)
        except User_profile.DoesNotExist:
            pass  # Profile doesn't exist, but that's okay

        # Create volunteer registration
        volunteer = VolunteerRegistration.objects.create(
            user=request.user,
            user_profile=user_profile,
            interested_services=request.data.get('interested_services', 'community_service'),
            availability=request.data.get('availability', 'flexible'),
            additional_skills=request.data.get('additional_skills', ''),
            experience=request.data.get('experience', ''),
            preferred_location=request.data.get('preferred_location', '')
        )

        serializer = VolunteerRegistrationSerializer(volunteer)
        return Response({
            'message': 'Volunteer registration successful',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        print(f"Error in volunteer registration: {str(e)}")
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_volunteer_profile(request):
    try:
        volunteer = VolunteerRegistration.objects.get(user=request.user)
        serializer = VolunteerRegistrationSerializer(volunteer)
        return Response(serializer.data)
    except VolunteerRegistration.DoesNotExist:
        return Response({
            'error': 'Volunteer profile not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_volunteer_profile(request):
    try:
        volunteer = VolunteerRegistration.objects.get(user=request.user)
        serializer = VolunteerRegistrationSerializer(volunteer, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except VolunteerRegistration.DoesNotExist:
        return Response({
            'error': 'Volunteer profile not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def volunteer_dashboard(request):
    try:
        volunteer = VolunteerRegistration.objects.get(user=request.user)
        serializer = VolunteerDashboardSerializer(volunteer)
        return Response(serializer.data)
    except VolunteerRegistration.DoesNotExist:
        return Response({
            'error': 'Volunteer profile not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def quit_volunteering(request):
    try:
        volunteer = VolunteerRegistration.objects.get(user=request.user)
        volunteer.status = 'Inactive'
        volunteer.save()
        return Response({
            'message': 'Successfully quit volunteering service'
        })
    except VolunteerRegistration.DoesNotExist:
        return Response({
            'error': 'Volunteer profile not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_volunteer_requests(request):
    try:
        volunteer = VolunteerRegistration.objects.get(user=request.user)
        requests = VolunteerRequest.objects.filter(volunteer=volunteer)
        serializer = VolunteerRequestSerializer(requests, many=True)
        return Response(serializer.data)
    except VolunteerRegistration.DoesNotExist:
        return Response({
            'error': 'Volunteer profile not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def respond_to_request(request, request_id):
    try:
        volunteer_request = VolunteerRequest.objects.get(id=request_id)
        action = request.data.get('action')
        
        if action not in ['accept', 'reject']:
            return Response({
                'error': 'Invalid action'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        volunteer_request.status = 'accepted' if action == 'accept' else 'rejected'
        volunteer_request.save()
        
        return Response({
            'message': f'Request {volunteer_request.status} successfully'
        })
    except VolunteerRequest.DoesNotExist:
        return Response({
            'error': 'Request not found'
        }, status=status.HTTP_404_NOT_FOUND)
