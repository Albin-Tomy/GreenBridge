from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Donation
from .serializers import DonationSerializer
import razorpay
from django.conf import settings
import json
from django.utils import timezone

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