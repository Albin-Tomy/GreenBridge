from django.shortcuts import render, get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from .models import FoodRequest, FoodDistribution, FoodQualityReport, DistributionMetrics, FoodDistributionPlan
from .serializers import FoodRequestSerializer, FoodDistributionSerializer, FoodQualityReportSerializer, DistributionMetricsSerializer, FoodDistributionPlanSerializer
from authentication.models import User
from volunteer.views import award_points
from django.core.files.storage import default_storage
from volunters.models import VolunteerRegistration
from django.db import models
from django.db.models.functions import TruncMonth
from django.core.mail import send_mail, BadHeaderError
from django.template.loader import render_to_string
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

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
        
        # Send email notifications to volunteers when request is approved
        if new_status == 'approved':
            # Get all users who are marked as volunteers
            volunteers = User.objects.filter(is_volunteer=True, is_active=True)
            
            success_count = 0
            for volunteer in volunteers:
                try:
                    # Prepare email content
                    context = {
                        'food_type': food_request.food_type,
                        'quantity': food_request.quantity,
                        'pickup_address': food_request.pickup_address,
                        'expiry_time': food_request.expiry_time,
                        'login_url': 'http://localhost:3000/login'
                    }
                    
                    # Render email content using template
                    email_content = render_to_string('emails/collection_request.html', context)
                    
                    # Send email
                    sent = send_mail(
                        subject='[GreenBridge] Urgent Food Collection Request',
                        message=f"""
Food Collection Request Details:
- Type: {food_request.food_type}
- Quantity: {food_request.quantity}
- Location: {food_request.pickup_address}
- Collection Deadline: {food_request.expiry_time}

Please login to accept this collection request.""",
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[volunteer.email],
                        html_message=email_content,
                        fail_silently=False,
                    )
                    
                    if sent:
                        success_count += 1
                        print(f"Email sent successfully to {volunteer.email}")
                    
                except Exception as e:
                    print(f"Failed to send email to volunteer {volunteer.email}: {str(e)}")
                    continue
            
            print(f"Successfully sent emails to {success_count} out of {len(volunteers)} volunteers")
            
        serializer = FoodRequestSerializer(food_request)
        return Response({
            'request': serializer.data,
            'email_notifications': {
                'total_volunteers': len(volunteers) if new_status == 'approved' else 0,
                'successful_emails': success_count if new_status == 'approved' else 0
            }
        })
        
    except FoodRequest.DoesNotExist:
        return Response(
            {'error': 'Food request not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# @parser_classes([MultiPartParser, FormParser])
# def submit_quality_report(request, request_id):
#     try:
#         food_request = FoodRequest.objects.get(id=request_id)
#         volunteer = VolunteerRegistration.objects.get(user=request.user)

#         # Create quality report
#         report_data = {
#             'food_request': food_request.id,
#             'volunteer': volunteer.id,
#             'issue_type': request.data.get('issue_type'),
#             'description': request.data.get('description'),
#             'temperature': request.data.get('temperature'),
#             'packaging_integrity': request.data.get('packaging_integrity'),
#             'labeling_accuracy': request.data.get('labeling_accuracy'),
#             'allergen_check': request.data.get('allergen_check'),
#             'hygiene_check': request.data.get('hygiene_check'),
#             'weight_check': request.data.get('weight_check'),
#             'visual_inspection': request.data.get('visual_inspection'),
#             'smell_test': request.data.get('smell_test'),
#             'expiration_check': request.data.get('expiration_check'),
#             'storage_condition': request.data.get('storage_condition'),
#         }

#         serializer = FoodQualityReportSerializer(data=report_data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({'message': 'Quality report submitted successfully', 'report_id': serializer.data['id']}, status=201)
#         return Response(serializer.errors, status=400)

#     except FoodRequest.DoesNotExist:
#         return Response({'error': 'Food request not found'}, status=404)
#     except VolunteerRegistration.DoesNotExist:
#         return Response({'error': 'Volunteer not found'}, status=404)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_quality_report(request, request_id):
    try:
        food_request = FoodRequest.objects.get(id=request_id)
        volunteer = VolunteerRegistration.objects.get(user=request.user)

        report_data = {
            'food_request': food_request.id,
            'volunteer': volunteer.id,
            **request.data
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

        
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_request_status(request, request_id):
    try:
        food_request = FoodRequest.objects.get(id=request_id)
        new_status = request.data.get('status')
        
        # Validate the status transition
        valid_transitions = {
            'pending': ['approved', 'cancelled'],
            'approved': ['collected', 'cancelled'],
            'collected': ['distribution_planned', 'quality_issue'],
            'quality_issue': ['approved', 'cancelled'],
            'distribution_planned': ['distributed'],
            'distributed': []  # No further transitions allowed
        }
        
        if new_status not in valid_transitions.get(food_request.status, []):
            return Response({
                'error': f'Invalid status transition from {food_request.status} to {new_status}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Update the status
        food_request.status = new_status
        food_request.save()
        
        return Response({'message': 'Status updated successfully'})
        
    except FoodRequest.DoesNotExist:
        return Response({
            'error': 'Food request not found'
        }, status=status.HTTP_404_NOT_FOUND)
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

class MetricsViewSet(viewsets.ModelViewSet):
    queryset = DistributionMetrics.objects.all()
    serializer_class = DistributionMetricsSerializer
    permission_classes = [IsAuthenticated]
    
    def get_analytics(self, request):
        try:
            # Get overall statistics
            total_metrics = DistributionMetrics.objects.aggregate(
                total_food=models.Sum('total_food_distributed'),
                total_beneficiaries=models.Sum('number_of_beneficiaries'),
                total_waste_prevented=models.Sum('food_waste_prevented')
            )
            
            # Get monthly trends
            monthly_metrics = DistributionMetrics.objects.annotate(
                month=TruncMonth('date')
            ).values('month').annotate(
                monthly_food=models.Sum('total_food_distributed'),
                monthly_beneficiaries=models.Sum('number_of_beneficiaries'),
                monthly_waste=models.Sum('food_waste_prevented')
            ).order_by('month')
            
            return Response({
                'overall_metrics': total_metrics,
                'monthly_trends': monthly_metrics
            })
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

# Add this view for testing
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def test_email(request):
    try:
        send_mail(
            subject='Test Email',
            message='This is a test email.',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[request.user.email],
            fail_silently=False,
        )
        return Response({'message': 'Test email sent successfully'})
    except Exception as e:
        logger.error(f"Test email failed: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_distribution_plan(request, food_request_id):
    try:
        food_request = FoodRequest.objects.get(id=food_request_id)
        
        # Verify request is collected
        if food_request.status != 'collected':
            return Response({
                'error': 'Food request must be collected before creating distribution plan'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        serializer = FoodDistributionPlanSerializer(data={
            **request.data,
            'food_request': food_request_id,
            'volunteer': request.user.volunteer.id if hasattr(request.user, 'volunteer') else None,
            'status': 'planned'  # Ensure status is set
        })
        
        if serializer.is_valid():
            distribution_plan = serializer.save()
            
            # Update food request status
            food_request.status = 'distribution_planned'
            food_request.save()
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except FoodRequest.DoesNotExist:
        return Response({
            'error': 'Food request not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def complete_distribution(request, plan_id):
    try:
        distribution_plan = FoodDistributionPlan.objects.get(id=plan_id)
        
        # Handle file upload for distribution proof
        if 'distribution_proof' in request.FILES:
            distribution_plan.distribution_proof = request.FILES['distribution_proof']
            
        distribution_plan.status = 'completed'
        distribution_plan.actual_beneficiaries = request.data.get('actual_beneficiaries')
        distribution_plan.food_condition_on_delivery = request.data.get('food_condition')
        distribution_plan.save()
        
        # Update food request status
        distribution_plan.food_request.status = 'distributed'
        distribution_plan.food_request.save()
        
        return Response({
            'message': 'Distribution completed successfully'
        })
        
    except FoodDistributionPlan.DoesNotExist:
        return Response({
            'error': 'Distribution plan not found'
        }, status=status.HTTP_404_NOT_FOUND)

# Add this new view for distribution feedback
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_distribution_feedback(request, plan_id):
    try:
        distribution_plan = FoodDistributionPlan.objects.get(id=plan_id)
        
        # Check if distribution is completed
        if distribution_plan.status != 'completed':
            return Response({
                'error': 'Can only submit feedback for completed distributions'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create feedback
        serializer = DistributionFeedbackSerializer(data={
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
        
    except FoodDistributionPlan.DoesNotExist:
        return Response({
            'error': 'Distribution plan not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_distribution_plan(request, plan_id):
    try:
        # Get distribution plan directly by its ID
        distribution = FoodDistributionPlan.objects.get(id=plan_id)
        serializer = FoodDistributionPlanSerializer(distribution)
        return Response(serializer.data)
    except FoodDistributionPlan.DoesNotExist:
        return Response({
            'error': f'Distribution plan #{plan_id} not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': f'Error fetching distribution plan: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_distribution_status(request, plan_id):
    try:
        distribution = FoodDistributionPlan.objects.get(id=plan_id)
        distribution.status = request.data['status']
        distribution.save()
        
        if request.data['status'] == 'completed':
            distribution.food_request.status = 'distributed'
            distribution.food_request.save()
            
        return Response({'message': 'Status updated successfully'})
    except FoodDistributionPlan.DoesNotExist:
        return Response({
            'error': 'Distribution plan not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_distribution_plan_by_request(request, food_request_id):
    try:
        # Get the latest distribution plan for this food request
        distribution = FoodDistributionPlan.objects.filter(
            food_request_id=food_request_id
        ).order_by('-created_at').first()  # Get the most recent plan
        
        if not distribution:
            return Response({
                'error': f'No distribution plan found for request #{food_request_id}'
            }, status=status.HTTP_404_NOT_FOUND)
            
        serializer = FoodDistributionPlanSerializer(distribution)
        return Response(serializer.data)
        
    except Exception as e:
        return Response({
            'error': f'Error fetching distribution plan: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_completed_distribution_plan(request, food_request_id):
    try:
        # Get the completed distribution plan for this food request
        distribution = FoodDistributionPlan.objects.filter(
            food_request_id=food_request_id,
            status='completed'  # Only get completed distributions
        ).first()
        
        if not distribution:
            return Response({
                'error': f'No completed distribution plan found for request #{food_request_id}'
            }, status=status.HTTP_404_NOT_FOUND)
            
        serializer = FoodDistributionPlanSerializer(distribution)
        return Response(serializer.data)
        
    except Exception as e:
        return Response({
            'error': f'Error fetching distribution plan: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
