from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import GroceryRequest, GroceryDistribution
from .serializers import GroceryRequestSerializer, GroceryDistributionSerializer
from volunteer.views import award_points

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_grocery_request(request):
    serializer = GroceryRequestSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_grocery_requests(request):
    requests = GroceryRequest.objects.filter(user=request.user)
    serializer = GroceryRequestSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pending_grocery_requests(request):
    requests = GroceryRequest.objects.filter(status='pending')
    serializer = GroceryRequestSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_grocery_requests(request):
    status_filter = request.GET.get('status', None)
    if status_filter:
        requests = GroceryRequest.objects.filter(status=status_filter)
    else:
        requests = GroceryRequest.objects.all()
    serializer = GroceryRequestSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_grocery_request_status(request, pk):
    try:
        grocery_request = get_object_or_404(GroceryRequest, pk=pk)
        new_status = request.data.get('status')
        
        # Validate the status value
        valid_statuses = ['pending', 'approved', 'rejected', 'collected']
        if new_status not in valid_statuses:
            return Response(
                {'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update the status
        grocery_request.status = new_status
        grocery_request.save()
        
        # Award points if the request is marked as collected
        if new_status == 'collected':
            award_points(
                request.user,
                10,  # Points awarded for collection
                f'Collected grocery donation #{grocery_request.id}'
            )
        
        serializer = GroceryRequestSerializer(grocery_request)
        return Response(serializer.data)
        
    except GroceryRequest.DoesNotExist:
        return Response(
            {'error': 'Grocery request not found'}, 
            status=status.HTTP_404_NOT_FOUND
        ) 