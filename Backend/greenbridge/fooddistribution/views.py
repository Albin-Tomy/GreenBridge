from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import FoodRequest, FoodDistribution
from .serializers import FoodRequestSerializer, FoodDistributionSerializer

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

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_food_request_status(request, pk):
    try:
        food_request = FoodRequest.objects.get(pk=pk)
        food_request.status = request.data.get('status')
        food_request.save()
        serializer = FoodRequestSerializer(food_request)
        return Response(serializer.data)
    except FoodRequest.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
