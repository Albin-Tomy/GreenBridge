from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import (
    SchoolSuppliesRequest,
    SchoolSupplyDistribution,
    SchoolSuppliesDistributionPlan,
    SchoolSuppliesDistributionFeedback
)
from .serializers import (
    SchoolSuppliesRequestSerializer,
    SchoolSupplyDistributionSerializer,
    SchoolSuppliesDistributionPlanSerializer,
    SchoolSuppliesDistributionFeedbackSerializer
)
from volunteer.views import award_points

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_school_supplies_request(request):
    serializer = SchoolSuppliesRequestSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_school_supplies_requests(request):
    requests = SchoolSuppliesRequest.objects.filter(user=request.user)
    serializer = SchoolSuppliesRequestSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_school_supplies_requests(request):
    status_filter = request.GET.get('status', None)
    if status_filter:
        requests = SchoolSuppliesRequest.objects.filter(status=status_filter)
    else:
        requests = SchoolSuppliesRequest.objects.all()
    serializer = SchoolSuppliesRequestSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pending_school_supplies_requests(request):
    requests = SchoolSuppliesRequest.objects.filter(status='pending')
    serializer = SchoolSuppliesRequestSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_school_supplies_request_status(request, pk):
    try:
        supply_request = SchoolSuppliesRequest.objects.get(pk=pk)
        supply_request.status = request.data.get('status')
        supply_request.save()
        serializer = SchoolSuppliesRequestSerializer(supply_request)
        return Response(serializer.data)
    except SchoolSuppliesRequest.DoesNotExist:
        return Response(
            {'error': 'Request not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_school_supplies_distribution_plan(request, supplies_request_id):
    try:
        supplies_request = SchoolSuppliesRequest.objects.get(id=supplies_request_id)
        
        # Verify request is collected
        if supplies_request.status != 'collected':
            return Response({
                'error': 'School supplies request must be collected before creating distribution plan'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        serializer = SchoolSuppliesDistributionPlanSerializer(data={
            **request.data,
            'supplies_request': supplies_request_id,
            'volunteer': request.user.volunteer.id if hasattr(request.user, 'volunteer') else None,
            'status': 'planned'
        })
        
        if serializer.is_valid():
            distribution_plan = serializer.save()
            
            # Update request status
            supplies_request.status = 'distribution_planned'
            supplies_request.save()
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except SchoolSuppliesRequest.DoesNotExist:
        return Response({
            'error': 'School supplies request not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def complete_school_supplies_distribution(request, plan_id):
    try:
        distribution_plan = SchoolSuppliesDistributionPlan.objects.get(id=plan_id)
            
        distribution_plan.status = 'completed'
        distribution_plan.actual_students_served = request.data.get('actual_students_served')
        distribution_plan.items_distributed = request.data.get('items_distributed')
        distribution_plan.save()
        
        # Update request status
        distribution_plan.supplies_request.status = 'distributed'
        distribution_plan.supplies_request.save()
        
        # Award points for completing distribution
        award_points(
            request.user,
            15,  # Points for completing distribution
            f'Completed school supplies distribution #{plan_id}'
        )
        
        return Response({
            'message': 'Distribution completed successfully'
        })
        
    except SchoolSuppliesDistributionPlan.DoesNotExist:
        return Response({
            'error': 'Distribution plan not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_school_supplies_distribution_plan(request, plan_id):
    try:
        distribution = SchoolSuppliesDistributionPlan.objects.get(id=plan_id)
        serializer = SchoolSuppliesDistributionPlanSerializer(distribution)
        return Response(serializer.data)
    except SchoolSuppliesDistributionPlan.DoesNotExist:
        return Response({
            'error': f'Distribution plan #{plan_id} not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_school_supplies_distribution_status(request, plan_id):
    try:
        distribution = SchoolSuppliesDistributionPlan.objects.get(id=plan_id)
        distribution.status = request.data['status']
        distribution.save()
        
        if request.data['status'] == 'completed':
            distribution.supplies_request.status = 'distributed'
            distribution.supplies_request.save()
            
        return Response({'message': 'Status updated successfully'})
    except SchoolSuppliesDistributionPlan.DoesNotExist:
        return Response({
            'error': 'Distribution plan not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_school_supplies_distribution_plan_by_request(request, supplies_request_id):
    try:
        distribution = SchoolSuppliesDistributionPlan.objects.filter(
            supplies_request_id=supplies_request_id
        ).order_by('-created_at').first()
        
        if not distribution:
            return Response({
                'error': f'No distribution plan found for request #{supplies_request_id}'
            }, status=status.HTTP_404_NOT_FOUND)
            
        serializer = SchoolSuppliesDistributionPlanSerializer(distribution)
        return Response(serializer.data)
        
    except Exception as e:
        return Response({
            'error': f'Error fetching distribution plan: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_completed_school_supplies_distribution_plan(request, supplies_request_id):
    try:
        distribution = SchoolSuppliesDistributionPlan.objects.filter(
            supplies_request_id=supplies_request_id,
            status='completed'
        ).first()
        
        if not distribution:
            return Response({
                'error': f'No completed distribution plan found for request #{supplies_request_id}'
            }, status=status.HTTP_404_NOT_FOUND)
            
        serializer = SchoolSuppliesDistributionPlanSerializer(distribution)
        return Response(serializer.data)
        
    except Exception as e:
        return Response({
            'error': f'Error fetching distribution plan: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_school_supplies_distribution_feedback(request, plan_id):
    try:
        distribution_plan = SchoolSuppliesDistributionPlan.objects.get(id=plan_id)
        
        if distribution_plan.status != 'completed':
            return Response({
                'error': 'Can only submit feedback for completed distributions'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = SchoolSuppliesDistributionFeedbackSerializer(data={
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
        
    except SchoolSuppliesDistributionPlan.DoesNotExist:
        return Response({
            'error': 'Distribution plan not found'
        }, status=status.HTTP_404_NOT_FOUND) 