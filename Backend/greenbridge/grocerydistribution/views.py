from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import GroceryRequest, GroceryDistribution, GroceryDistributionPlan
from .serializers import GroceryRequestSerializer, GroceryDistributionSerializer, GroceryDistributionPlanSerializer, GroceryDistributionFeedbackSerializer
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
        
        # Update valid statuses to include 'distribution_planned'
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
        
        if new_status not in valid_transitions.get(grocery_request.status, []):
            return Response(
                {'error': f'Invalid status transition from {grocery_request.status} to {new_status}'}, 
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_grocery_distribution_plan(request, grocery_request_id):
    try:
        grocery_request = GroceryRequest.objects.get(id=grocery_request_id)
        
        # Verify request is collected
        if grocery_request.status != 'collected':
            return Response({
                'error': 'Grocery request must be collected before creating distribution plan'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        serializer = GroceryDistributionPlanSerializer(data={
            **request.data,
            'grocery_request': grocery_request_id,
            'volunteer': request.user.volunteer.id if hasattr(request.user, 'volunteer') else None,
            'status': 'planned'
        })
        
        if serializer.is_valid():
            distribution_plan = serializer.save()
            
            # Update grocery request status
            grocery_request.status = 'distribution_planned'
            grocery_request.save()
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except GroceryRequest.DoesNotExist:
        return Response({
            'error': 'Grocery request not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def complete_grocery_distribution(request, plan_id):
    try:
        distribution_plan = GroceryDistributionPlan.objects.get(id=plan_id)
        
        # Handle file upload for distribution proof
        if 'distribution_proof' in request.FILES:
            distribution_plan.distribution_proof = request.FILES['distribution_proof']
            
        distribution_plan.status = 'completed'
        distribution_plan.actual_households_served = request.data.get('actual_households_served')
        distribution_plan.items_distributed = request.data.get('items_distributed')
        distribution_plan.save()
        
        # Update grocery request status
        distribution_plan.grocery_request.status = 'distributed'
        distribution_plan.grocery_request.save()
        
        # Award points for completing distribution
        award_points(
            request.user,
            15,  # Points for completing distribution
            f'Completed grocery distribution #{plan_id}'
        )
        
        return Response({
            'message': 'Distribution completed successfully'
        })
        
    except GroceryDistributionPlan.DoesNotExist:
        return Response({
            'error': 'Distribution plan not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_grocery_distribution_plan(request, plan_id):
    try:
        distribution = GroceryDistributionPlan.objects.get(id=plan_id)
        serializer = GroceryDistributionPlanSerializer(distribution)
        return Response(serializer.data)
    except GroceryDistributionPlan.DoesNotExist:
        return Response({
            'error': f'Distribution plan #{plan_id} not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_grocery_distribution_status(request, plan_id):
    try:
        distribution = GroceryDistributionPlan.objects.get(id=plan_id)
        distribution.status = request.data['status']
        distribution.save()
        
        if request.data['status'] == 'completed':
            distribution.grocery_request.status = 'distributed'
            distribution.grocery_request.save()
            
        return Response({'message': 'Status updated successfully'})
    except GroceryDistributionPlan.DoesNotExist:
        return Response({
            'error': 'Distribution plan not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_grocery_distribution_plan_by_request(request, grocery_request_id):
    try:
        distribution = GroceryDistributionPlan.objects.filter(
            grocery_request_id=grocery_request_id
        ).order_by('-created_at').first()
        
        if not distribution:
            return Response({
                'error': f'No distribution plan found for request #{grocery_request_id}'
            }, status=status.HTTP_404_NOT_FOUND)
            
        serializer = GroceryDistributionPlanSerializer(distribution)
        return Response(serializer.data)
        
    except Exception as e:
        return Response({
            'error': f'Error fetching distribution plan: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_completed_grocery_distribution_plan(request, grocery_request_id):
    try:
        distribution = GroceryDistributionPlan.objects.filter(
            grocery_request_id=grocery_request_id,
            status='completed'
        ).first()
        
        if not distribution:
            return Response({
                'error': f'No completed distribution plan found for request #{grocery_request_id}'
            }, status=status.HTTP_404_NOT_FOUND)
            
        serializer = GroceryDistributionPlanSerializer(distribution)
        return Response(serializer.data)
        
    except Exception as e:
        return Response({
            'error': f'Error fetching distribution plan: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_grocery_distribution_feedback(request, plan_id):
    try:
        distribution_plan = GroceryDistributionPlan.objects.get(id=plan_id)
        
        if distribution_plan.status != 'completed':
            return Response({
                'error': 'Can only submit feedback for completed distributions'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = GroceryDistributionFeedbackSerializer(data={
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
        
    except GroceryDistributionPlan.DoesNotExist:
        return Response({
            'error': 'Distribution plan not found'
        }, status=status.HTTP_404_NOT_FOUND) 