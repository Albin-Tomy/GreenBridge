from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import SchoolSupplyRequest
from .serializers import SchoolSupplyRequestSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_supply_request(request):
    serializer = SchoolSupplyRequestSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_supply_requests(request):
    requests = SchoolSupplyRequest.objects.filter(user=request.user)
    serializer = SchoolSupplyRequestSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_supply_requests(request):
    status_filter = request.GET.get('status', None)
    if status_filter:
        requests = SchoolSupplyRequest.objects.filter(status=status_filter)
    else:
        requests = SchoolSupplyRequest.objects.all()
    serializer = SchoolSupplyRequestSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_supply_request_status(request, pk):
    try:
        supply_request = SchoolSupplyRequest.objects.get(pk=pk)
        supply_request.status = request.data.get('status')
        supply_request.save()
        serializer = SchoolSupplyRequestSerializer(supply_request)
        return Response(serializer.data)
    except SchoolSupplyRequest.DoesNotExist:
        return Response(
            {'error': 'Request not found'}, 
            status=status.HTTP_404_NOT_FOUND
        ) 