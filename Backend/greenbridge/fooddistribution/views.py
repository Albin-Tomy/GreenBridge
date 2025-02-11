from django.shortcuts import render, get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from .models import FoodRequest, FoodDistribution, FoodQualityReport
from .serializers import FoodRequestSerializer, FoodDistributionSerializer, FoodQualityReportSerializer
from authentication.models import User
from volunteer.views import award_points
from django.core.files.storage import default_storage
from volunters.models import VolunteerRegistration

# Create your views here.

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_food_request(request):
    serializer = FoodRequestSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_food_requests(request):
    requests = FoodRequest.objects.filter(user=request.user)
    serializer = FoodRequestSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pending_food_requests(request):
    requests = FoodRequest.objects.filter(status='pending')
    serializer = FoodRequestSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_food_requests(request):
    """Get all food requests with optional status filter"""
    status_filter = request.GET.get('status', None)
    if status_filter:
        requests = FoodRequest.objects.filter(status=status_filter)
    else:
        requests = FoodRequest.objects.all()
    serializer = FoodRequestSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_food_request_status(request, pk):
    """Update the status of a food request"""
    try:
        food_request = get_object_or_404(FoodRequest, pk=pk)
        new_status = request.data.get('status')
        
        if new_status not in [choice[0] for choice in FoodRequest.STATUS_CHOICES]:
            return Response(
                {'error': 'Invalid status value'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        food_request.status = new_status
        food_request.save()
        
        if new_status == 'collected':
            award_points(
                request.user,
                10,  # Points awarded for collection
                f'Collected food donation #{food_request.id}'
            )
        
        serializer = FoodRequestSerializer(food_request)
        return Response(serializer.data)
        
    except FoodRequest.DoesNotExist:
        return Response(
            {'error': 'Food request not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def submit_quality_report(request, request_id):
    try:
        food_request = FoodRequest.objects.get(id=request_id)
        volunteer = VolunteerRegistration.objects.get(user=request.user)

        # Create quality report
        report_data = {
            'food_request': food_request.id,
            'volunteer': volunteer.id,
            'issue_type': request.data.get('issue_type'),
            'description': request.data.get('description'),
            'temperature': request.data.get('temperature'),
            'packaging_integrity': request.data.get('packaging_integrity'),
            'labeling_accuracy': request.data.get('labeling_accuracy'),
            'allergen_check': request.data.get('allergen_check'),
            'hygiene_check': request.data.get('hygiene_check'),
            'weight_check': request.data.get('weight_check'),
            'visual_inspection': request.data.get('visual_inspection'),
            'smell_test': request.data.get('smell_test'),
            'expiration_check': request.data.get('expiration_check'),
            'storage_condition': request.data.get('storage_condition'),
        }

        serializer = FoodQualityReportSerializer(data=report_data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Quality report submitted successfully', 'report_id': serializer.data['id']}, status=201)
        return Response(serializer.errors, status=400)

    except FoodRequest.DoesNotExist:
        return Response({'error': 'Food request not found'}, status=404)
    except VolunteerRegistration.DoesNotExist:
        return Response({'error': 'Volunteer not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_request_status(request, request_id):
    try:
        volunteer = VolunteerRegistration.objects.get(user=request.user)
        food_request = FoodRequest.objects.get(id=request_id)

        # Check if quality report exists
        if not FoodQualityReport.objects.filter(food_request=food_request).exists():
            return Response({
                'error': 'Must submit quality report before updating status'
            }, status=status.HTTP_400_BAD_REQUEST)

        action = request.data.get('action')
        if action == 'accept':
            food_request.status = 'collected'
        elif action == 'cancel':
            food_request.status = 'cancelled'
        else:
            return Response({
                'error': 'Invalid action'
            }, status=status.HTTP_400_BAD_REQUEST)

        food_request.save()
        return Response({
            'message': f'Request {action}ed successfully',
            'status': food_request.status
        })

    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_request_quality_report(request, request_id):
    try:
        food_request = FoodRequest.objects.get(id=request_id)
        report = FoodQualityReport.objects.filter(food_request=food_request).first()

        if not report:
            return Response({
                'message': 'No quality report found for this request'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = FoodQualityReportSerializer(report)
        return Response(serializer.data)

    except FoodRequest.DoesNotExist:
        return Response({
            'error': 'Food request not found'
        }, status=status.HTTP_404_NOT_FOUND)
