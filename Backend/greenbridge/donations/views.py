from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Donation, NGOMoneyRequest, NGOMoneyRequestUpdate
from .serializers import DonationSerializer, NGOMoneyRequestSerializer, NGOMoneyRequestUpdateSerializer
import razorpay
from django.conf import settings
import json
from django.utils import timezone
from rest_framework import viewsets, serializers
from rest_framework.decorators import action
from NGOs.models import NGOProfile
from django.contrib.auth import get_user_model

# Initialize Razorpay client
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_API_KEY, settings.RAZORPAY_API_SECRET))

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_donation(request):
    try:
        data = request.data
        amount = int(float(data['amount']))

        # Create Razorpay Order
        razorpay_order = razorpay_client.order.create({
            'amount': amount * 100,  # Convert to paise
            'currency': 'INR',
            'payment_capture': 1,
            'receipt': f'don_{int(timezone.now().timestamp())}'
        })

        # Create donation record with pending status
        donation = Donation.objects.create(
            user=request.user,
            amount=amount,
            donation_type=data['donation_type'],
            purpose=data['purpose'],
            status='pending',
            razorpay_order_id=razorpay_order['id']
        )

        return Response({
            'order_id': razorpay_order['id'],
            'donation_id': donation.id
        })

    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_donation(request):
    try:
        data = request.data
        
        # Verify the payment signature
        params_dict = {
            'razorpay_payment_id': data['payment_id'],
            'razorpay_order_id': data['order_id'],
            'razorpay_signature': data['signature']
        }

        # Verify signature
        razorpay_client.utility.verify_payment_signature(params_dict)

        # Update donation status
        donation = Donation.objects.get(razorpay_order_id=data['order_id'])
        donation.status = 'completed'
        donation.razorpay_payment_id = data['payment_id']
        donation.save()

        return Response({
            'status': 'Payment verified successfully',
            'donation_id': donation.id
        })

    except Exception as e:
        # If verification fails, mark donation as failed
        try:
            donation = Donation.objects.get(razorpay_order_id=data['order_id'])
            donation.status = 'failed'
            donation.save()
        except:
            pass

        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_donations(request):
    donations = Donation.objects.filter(user=request.user).order_by('-created_at')
    serializer = DonationSerializer(donations, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_ngo_money_request(request):
    if not request.user.is_ngo:
        return Response({
            'error': 'Only NGOs can create money requests'
        }, status=status.HTTP_403_FORBIDDEN)

    print("Request Files:", request.FILES)  # Debug to see what files are coming in
    
    # Check if required files are in the request
    if 'necessity_certificate' not in request.FILES:
        return Response({
            'error': 'Necessity certificate file is required'
        }, status=status.HTTP_400_BAD_REQUEST)
        
    if 'budget_document' not in request.FILES:
        return Response({
            'error': 'Budget document file is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = NGOMoneyRequestSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        money_request = serializer.save(ngo=request.user)
        
        # Debug log to verify file paths
        print("Saved necessity_certificate:", money_request.necessity_certificate.path if money_request.necessity_certificate else "None")
        print("Saved budget_document:", money_request.budget_document.path if money_request.budget_document else "None")
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_ngo_money_requests(request):
    if not request.user.is_ngo:
        return Response({
            'error': 'Only NGOs can view their money requests'
        }, status=status.HTTP_403_FORBIDDEN)

    requests = NGOMoneyRequest.objects.filter(ngo=request.user).order_by('-created_at')
    serializer = NGOMoneyRequestSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_money_requests(request):
    if not request.user.is_superuser:
        return Response({
            'error': 'Only admin can view all money requests'
        }, status=status.HTTP_403_FORBIDDEN)

    status_filter = request.GET.get('status', None)
    if status_filter:
        requests = NGOMoneyRequest.objects.filter(status=status_filter)
    else:
        requests = NGOMoneyRequest.objects.all()
    
    requests = requests.order_by('-created_at')
    serializer = NGOMoneyRequestSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_money_request_details(request, request_id):
    try:
        money_request = NGOMoneyRequest.objects.get(id=request_id)
        
        # Check if user is admin or the NGO that made the request
        if not (request.user.is_superuser or request.user.role == 'admin' or request.user == money_request.ngo):
            return Response(
                {'error': 'You do not have permission to view this request'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = NGOMoneyRequestSerializer(money_request, context={'request': request})
        return Response(serializer.data)
    except NGOMoneyRequest.DoesNotExist:
        return Response(
            {'error': 'Money request not found'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_money_request_status(request, request_id):
    if not request.user.is_superuser:
        return Response({
            'error': 'Only admin can update money request status'
        }, status=status.HTTP_403_FORBIDDEN)

    try:
        money_request = NGOMoneyRequest.objects.get(id=request_id)
        new_status = request.data.get('status')
        admin_notes = request.data.get('admin_notes', '')
        
        valid_transitions = {
            'pending': ['approved', 'rejected', 'cancelled'],
            'approved': ['transferred', 'cancelled'],
            'rejected': ['pending'],
            'cancelled': ['pending'],
            'transferred': []  # No further transitions allowed
        }
        
        if new_status not in valid_transitions.get(money_request.status, []):
            return Response({
                'error': f'Invalid status transition from {money_request.status} to {new_status}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        money_request.status = new_status
        money_request.admin_notes = admin_notes
        
        if new_status == 'transferred':
            money_request.transfer_date = timezone.now()
            money_request.transfer_reference = request.data.get('transfer_reference')
            
        money_request.save()
        
        # Create an update record
        NGOMoneyRequestUpdate.objects.create(
            money_request=money_request,
            message=f"Status updated to {new_status}. {admin_notes}",
            created_by=request.user
        )
        
        serializer = NGOMoneyRequestSerializer(money_request, context={'request': request})
        return Response(serializer.data)
        
    except NGOMoneyRequest.DoesNotExist:
        return Response({
            'error': 'Money request not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_money_request_update(request, request_id):
    try:
        money_request = NGOMoneyRequest.objects.get(id=request_id)
        
        # Check if user has permission to add updates
        if not (request.user.is_staff or request.user == money_request.ngo):
            return Response({
                'error': 'You do not have permission to add updates to this request'
            }, status=status.HTTP_403_FORBIDDEN)
            
        serializer = NGOMoneyRequestUpdateSerializer(data={
            'money_request': request_id,
            'message': request.data.get('message'),
            'created_by': request.user.id
        })
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except NGOMoneyRequest.DoesNotExist:
        return Response({
            'error': 'Money request not found'
        }, status=status.HTTP_404_NOT_FOUND)

class NGOMoneyRequestViewSet(viewsets.ModelViewSet):
    serializer_class = NGOMoneyRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return NGOMoneyRequest.objects.filter(ngo=self.request.user)

    def perform_create(self, serializer):
        # Get the NGO user
        ngo = self.request.user

        # Check if NGO profile exists and has bank details
        try:
            profile = NGOProfile.objects.get(registration__email=ngo.email)
            if not all([
                profile.bank_account_name,
                profile.bank_account_number,
                profile.bank_name,
                profile.bank_branch,
                profile.ifsc_code
            ]):
                raise serializers.ValidationError({
                    'bank_details': 'Please complete your NGO profile with all bank details before submitting a money request.'
                })
        except NGOProfile.DoesNotExist:
            raise serializers.ValidationError({
                'profile': 'NGO profile not found. Please complete your profile before submitting a money request.'
            })

        # Save the money request with the NGO user
        serializer.save(ngo=ngo)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        if not request.user.is_superuser:
            return Response(
                {'error': 'Only admin can update request status'},
                status=status.HTTP_403_FORBIDDEN
            )

        money_request = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(NGOMoneyRequest.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )

        money_request.status = new_status
        if new_status == 'transferred':
            money_request.transfer_reference = request.data.get('transfer_reference')
            money_request.transfer_date = timezone.now()
        
        money_request.admin_notes = request.data.get('admin_notes', '')
        money_request.save()

        # Create status update record
        NGOMoneyRequestUpdate.objects.create(
            money_request=money_request,
            message=f"Status updated to {new_status}",
            created_by=request.user
        )

        return Response(self.get_serializer(money_request).data)

    @action(detail=True, methods=['get'])
    def updates(self, request, pk=None):
        money_request = self.get_object()
        updates = NGOMoneyRequestUpdate.objects.filter(money_request=money_request)
        serializer = NGOMoneyRequestUpdateSerializer(updates, many=True)
        return Response(serializer.data)

class NGOMoneyRequestUpdateViewSet(viewsets.ModelViewSet):
    serializer_class = NGOMoneyRequestUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return NGOMoneyRequestUpdate.objects.filter(
            money_request__ngo=self.request.user
        ) if self.request.user.is_ngo else NGOMoneyRequestUpdate.objects.all()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user) 