from django.shortcuts import render, get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import FoodRequest, FoodDistribution
from .serializers import FoodRequestSerializer, FoodDistributionSerializer
from authentication.models import User
from volunteer.views import award_points

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
