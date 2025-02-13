from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Donation
from .serializers import DonationSerializer
import razorpay
from django.conf import settings
import json
import time

client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_donation(request):
    try:
        data = request.data
        amount = int(float(data['amount']) * 100)  # Convert to paise
        
        # Create Razorpay Order
        payment_data = {
            'amount': amount,
            'currency': 'INR',
            'receipt': f'don_{int(time.time())}',
            'payment_capture': 1
        }
        
        order = client.order.create(data=payment_data)
        
        # Create donation record
        donation = Donation.objects.create(
            user=request.user,
            amount=float(data['amount']),
            donation_type=data['donation_type'],
            purpose=data['purpose'],
            razorpay_order_id=order['id']
        )
        
        return Response({
            'order_id': order['id'],
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
        donation = Donation.objects.get(razorpay_order_id=data['order_id'])
        
        # Verify signature
        params_dict = {
            'razorpay_payment_id': data['payment_id'],
            'razorpay_order_id': data['order_id'],
            'razorpay_signature': data['signature']
        }
        
        client.utility.verify_payment_signature(params_dict)
        
        # Update donation status
        donation.status = 'completed'
        donation.razorpay_payment_id = data['payment_id']
        donation.save()
        
        return Response({'status': 'Payment verified successfully'})
        
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_donations(request):
    donations = Donation.objects.filter(user=request.user)
    serializer = DonationSerializer(donations, many=True)
    return Response(serializer.data) 