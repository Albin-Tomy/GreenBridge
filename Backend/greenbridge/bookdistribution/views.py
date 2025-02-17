from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import BookRequest, BookDistribution
from .serializers import BookRequestSerializer, BookDistributionSerializer
from volunteer.views import award_points

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_book_request(request):
    serializer = BookRequestSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_book_requests(request):
    requests = BookRequest.objects.filter(user=request.user)
    serializer = BookRequestSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pending_book_requests(request):
    requests = BookRequest.objects.filter(status='pending')
    serializer = BookRequestSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_book_requests(request):
    status_filter = request.GET.get('status', None)
    if status_filter:
        requests = BookRequest.objects.filter(status=status_filter)
    else:
        requests = BookRequest.objects.all()
    serializer = BookRequestSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_book_request_status(request, pk):
    try:
        book_request = get_object_or_404(BookRequest, pk=pk)
        new_status = request.data.get('status')
        
        # Update valid statuses to include 'cancelled'
        valid_statuses = ['pending', 'approved', 'rejected', 'collected', 'cancelled']
        if new_status not in valid_statuses:
            return Response(
                {'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update the status
        book_request.status = new_status
        book_request.save()
        
        # Award points if the request is marked as collected
        if new_status == 'collected':
            award_points(
                request.user,
                10,  # Points awarded for collection
                f'Collected book donation #{book_request.id}'
            )
        
        serializer = BookRequestSerializer(book_request)
        return Response(serializer.data)
        
    except BookRequest.DoesNotExist:
        return Response(
            {'error': 'Book request not found'}, 
            status=status.HTTP_404_NOT_FOUND
        ) 