from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import BookRequest, BookDistribution, BookDistributionPlan, BookDistributionFeedback
from .serializers import (
    BookRequestSerializer, 
    BookDistributionSerializer, 
    BookDistributionPlanSerializer,
    BookDistributionFeedbackSerializer
)
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
        
        # Update valid statuses to include 'distribution_planned' and 'distributed'
        valid_statuses = [
            'pending', 
            'approved', 
            'rejected', 
            'collected', 
            'cancelled',
            'distribution_planned',
            'distributed'
        ]
        
        if new_status not in valid_statuses:
            return Response(
                {'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate status transitions
        valid_transitions = {
            'pending': ['approved', 'rejected', 'cancelled'],
            'approved': ['collected', 'cancelled'],
            'collected': ['distribution_planned', 'cancelled'],
            'distribution_planned': ['distributed', 'cancelled'],
            'rejected': ['pending'],
            'cancelled': ['pending'],
            'distributed': []  # No further transitions allowed
        }
        
        if new_status not in valid_transitions.get(book_request.status, []):
            return Response(
                {'error': f'Invalid status transition from {book_request.status} to {new_status}'}, 
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_book_distribution_plan(request, book_request_id):
    try:
        book_request = BookRequest.objects.get(id=book_request_id)
        
        # Verify request is collected
        if book_request.status != 'collected':
            return Response({
                'error': 'Book request must be collected before creating distribution plan'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        serializer = BookDistributionPlanSerializer(data={
            **request.data,
            'book_request': book_request_id,
            'volunteer': request.user.volunteer.id if hasattr(request.user, 'volunteer') else None,
            'status': 'planned'
        })
        
        if serializer.is_valid():
            distribution_plan = serializer.save()
            
            # Update book request status
            book_request.status = 'distribution_planned'
            book_request.save()
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except BookRequest.DoesNotExist:
        return Response({
            'error': 'Book request not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def complete_book_distribution(request, plan_id):
    try:
        distribution_plan = BookDistributionPlan.objects.get(id=plan_id)
        distribution_plan.status = 'completed'
        distribution_plan.save()
        
        # Update book request status
        distribution_plan.book_request.status = 'distributed'
        distribution_plan.book_request.save()
        
        # Award points for completing distribution
        award_points(
            request.user,
            15,  # Points for completing distribution
            f'Completed book distribution #{plan_id}'
        )
        
        return Response({
            'message': 'Distribution completed successfully'
        })
        
    except BookDistributionPlan.DoesNotExist:
        return Response({
            'error': 'Distribution plan not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_book_distribution_plan(request, plan_id):
    try:
        distribution = BookDistributionPlan.objects.get(id=plan_id)
        serializer = BookDistributionPlanSerializer(distribution)
        return Response(serializer.data)
    except BookDistributionPlan.DoesNotExist:
        return Response({
            'error': f'Distribution plan #{plan_id} not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_book_distribution_status(request, plan_id):
    try:
        distribution = BookDistributionPlan.objects.get(id=plan_id)
        distribution.status = request.data['status']
        distribution.save()
        
        if request.data['status'] == 'completed':
            distribution.book_request.status = 'distributed'
            distribution.book_request.save()
            
        return Response({'message': 'Status updated successfully'})
    except BookDistributionPlan.DoesNotExist:
        return Response({
            'error': 'Distribution plan not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_book_distribution_plan_by_request(request, book_request_id):
    try:
        distribution = BookDistributionPlan.objects.filter(
            book_request_id=book_request_id
        ).order_by('-created_at').first()
        
        if not distribution:
            return Response({
                'error': f'No distribution plan found for request #{book_request_id}'
            }, status=status.HTTP_404_NOT_FOUND)
            
        serializer = BookDistributionPlanSerializer(distribution)
        return Response(serializer.data)
        
    except Exception as e:
        return Response({
            'error': f'Error fetching distribution plan: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_completed_book_distribution_plan(request, book_request_id):
    try:
        distribution = BookDistributionPlan.objects.filter(
            book_request_id=book_request_id,
            status='completed'
        ).first()
        
        if not distribution:
            return Response({
                'error': f'No completed distribution plan found for request #{book_request_id}'
            }, status=status.HTTP_404_NOT_FOUND)
            
        serializer = BookDistributionPlanSerializer(distribution)
        return Response(serializer.data)
        
    except Exception as e:
        return Response({
            'error': f'Error fetching distribution plan: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_book_distribution_feedback(request, plan_id):
    try:
        distribution_plan = BookDistributionPlan.objects.get(id=plan_id)
        
        if distribution_plan.status != 'completed':
            return Response({
                'error': 'Can only submit feedback for completed distributions'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = BookDistributionFeedbackSerializer(data={
            **request.data,
            'distribution': plan_id
        })
        
        if serializer.is_valid():
            feedback = serializer.save()
            return Response({
                'message': 'Feedback submitted successfully',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except BookDistributionPlan.DoesNotExist:
        return Response({
            'error': 'Distribution plan not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def start_book_distribution(request, plan_id):
    try:
        distribution_plan = BookDistributionPlan.objects.get(id=plan_id)
        
        # Verify current status is 'planned'
        if distribution_plan.status != 'planned':
            return Response({
                'error': 'Distribution must be in planned status to start'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        # Update status to in_progress
        distribution_plan.status = 'in_progress'
        distribution_plan.save()
        
        # Award points for starting distribution
        award_points(
            request.user,
            5,  # Points for starting distribution
            f'Started book distribution #{plan_id}'
        )
        
        return Response({
            'message': 'Distribution started successfully',
            'status': distribution_plan.status
        })
        
    except BookDistributionPlan.DoesNotExist:
        return Response({
            'error': 'Distribution plan not found'
        }, status=status.HTTP_404_NOT_FOUND) 