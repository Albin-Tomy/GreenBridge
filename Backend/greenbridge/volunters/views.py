from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import VolunteerRegistration, BlockchainBlock, VolunteerActivity
from .serializers import VolunteerRegistrationSerializer
from authentication.models import User_profile
from .blockchain import VolunteerBlockchain
from django.core.cache import cache
from time import time
from django.utils import timezone
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from datetime import datetime

# Create your views here.

# Initialize blockchain
def get_blockchain():
    return VolunteerBlockchain()

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_volunteer(request):
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
            pass

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

        # Set user as volunteer
        request.user.is_volunteer = True
        request.user.save()

        # Add to blockchain
        blockchain = get_blockchain()
        blockchain.add_block({
            'volunteer_id': volunteer.id,
            'action': 'REGISTRATION',
            'details': {
                'user_id': request.user.id,
                'interested_services': volunteer.interested_services,
                'availability': volunteer.availability,
                'timestamp': str(time())
            }
        })

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
            volunteer = serializer.save()
            
            # Record update in blockchain
            blockchain = get_blockchain()
            blockchain.add_block({
                'volunteer_id': volunteer.id,
                'action': 'PROFILE_UPDATE',
                'details': {
                    'updated_fields': request.data,
                    'timestamp': str(time())
                }
            })
            
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except VolunteerRegistration.DoesNotExist:
        return Response({
            'error': 'Volunteer profile not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_volunteer_history(request):
    try:
        volunteer = VolunteerRegistration.objects.get(user=request.user)
        blockchain = get_blockchain()
        history = blockchain.get_volunteer_history(volunteer.id)
        return Response({
            'volunteer_id': volunteer.id,
            'history': history
        })
    except VolunteerRegistration.DoesNotExist:
        return Response({
            'error': 'Volunteer profile not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def quit_volunteer(request):
    try:
        volunteer = VolunteerRegistration.objects.get(user=request.user)
        
        # Record quit action in blockchain
        blockchain = get_blockchain()
        blockchain.add_block({
            'volunteer_id': volunteer.id,
            'action': 'QUIT',
            'details': {
                'reason': request.data.get('reason', ''),
                'timestamp': str(time())
            }
        })
        
        # Set user's volunteer status to False
        request.user.is_volunteer = False
        request.user.save()
        
        volunteer.delete()
        return Response({
            'message': 'Successfully removed from volunteer service'
        }, status=status.HTTP_200_OK)
    except VolunteerRegistration.DoesNotExist:
        return Response({
            'error': 'Volunteer profile not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_blockchain_details(request):
    try:
        blockchain = get_blockchain()
        chain_data = []
        
        for block in blockchain.chain:
            block_data = {
                'index': block.index,
                'timestamp': block.timestamp,
                'data': block.data,
                'hash': block.hash,
                'previous_hash': block.previous_hash
            }
            chain_data.append(block_data)
            
        return Response({
            'chain': chain_data,
            'length': len(blockchain.chain),
            'is_valid': blockchain.is_chain_valid()
        })
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def report_food_quality(request):
    try:
        volunteer = VolunteerRegistration.objects.get(user=request.user)
        food_request_id = request.data.get('distribution_id')

        try:
            food_request = FoodRequest.objects.get(id=food_request_id)
        except FoodRequest.DoesNotExist:
            return Response({
                'error': f'Food request with ID {food_request_id} not found'
            }, status=status.HTTP_404_NOT_FOUND)

        # Create quality report
        report = FoodQualityReport.objects.create(
            volunteer=volunteer,
            distribution_request=food_request,
            issue_type=request.data.get('issue_type'),
            description=request.data.get('description'),
            temperature=request.data.get('temperature')
        )

        # Handle image uploads
        if 'images' in request.FILES:
            image_urls = []
            for image in request.FILES.getlist('images'):
                image_name = f"quality_reports/{report.id}/{image.name}"
                image_path = default_storage.save(image_name, image)
                image_url = default_storage.url(image_path)
                image_urls.append(image_url)
            report.images = image_urls
            report.save()

        # Update food request status based on quality report
        if request.data.get('issue_type') == 'good':
            food_request.status = 'collected'
            report.status = 'approved'
        else:
            food_request.status = 'quality_issue'
            report.status = 'pending'
        
        food_request.save()
        report.save()

        # Add to blockchain
        blockchain = get_blockchain()
        blockchain.add_block({
            'volunteer_id': volunteer.id,
            'action': 'QUALITY_REPORT',
            'details': {
                'report_id': report.id,
                'food_request_id': food_request.id,
                'issue_type': report.issue_type,
                'status': report.status,
                'timestamp': str(timezone.now())
            }
        })

        return Response({
            'message': 'Quality report submitted successfully',
            'report_id': report.id,
            'status': report.status
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_quality_reports(request):
    try:
        volunteer = VolunteerRegistration.objects.get(user=request.user)
        reports = FoodQualityReport.objects.filter(volunteer=volunteer)
        
        return Response({
            'reports': [{
                'id': report.id,
                'distribution_id': report.distribution_request_id,
                'issue_type': report.issue_type,
                'description': report.description,
                'status': report.status,
                'reported_at': report.reported_at,
                'images': report.images,
                'temperature': report.temperature,
                'admin_notes': report.admin_notes
            } for report in reports]
        })
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_volunteer_activities(request):
    """
    Get all activities of the logged-in volunteer
    """
    try:
        volunteer_id = request.user.id
        activities = VolunteerActivity.objects.filter(volunteer_id=volunteer_id).order_by('-timestamp')
        
        activity_data = []
        for activity in activities:
            data = {
                'id': activity.id,
                'timestamp': activity.timestamp.timestamp(),
                'action': activity.action,
                'request_type': activity.request_type,
                'request_id': activity.request_id,
                'status': activity.status,
                'details': {
                    'type': activity.request_type,
                    'request_id': activity.request_id,
                    'description': activity.description
                }
            }
            activity_data.append(data)
        
        return Response(activity_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def mark_request_collected(request, request_id, request_type):
    """
    Mark a request as collected and store volunteer information
    """
    try:
        volunteer_id = request.user.id
        
        # Create activity record
        VolunteerActivity.objects.create(
            volunteer_id=volunteer_id,
            request_id=request_id,
            request_type=request_type,
            action='collected',
            status='collected',
            description=f'Collected {request_type} request #{request_id}'
        )
        
        # Add to blockchain
        blockchain = VolunteerBlockchain()
        blockchain.add_block({
            'volunteer_id': volunteer_id,
            'action': 'collected',
            'type': request_type,
            'request_id': request_id,
            'timestamp': datetime.now().timestamp()
        })
        
        return Response({'status': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def mark_request_distributed(request, request_id, request_type):
    """
    Mark a request as distributed and update volunteer activity
    """
    try:
        volunteer_id = request.user.id
        
        # Create activity record
        VolunteerActivity.objects.create(
            volunteer_id=volunteer_id,
            request_id=request_id,
            request_type=request_type,
            action='distributed',
            status='distributed',
            description=f'Distributed {request_type} request #{request_id}'
        )
        
        # Add to blockchain
        blockchain = VolunteerBlockchain()
        blockchain.add_block({
            'volunteer_id': volunteer_id,
            'action': 'distributed',
            'type': request_type,
            'request_id': request_id,
            'timestamp': datetime.now().timestamp()
        })
        
        return Response({'status': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
