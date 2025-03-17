from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import FoodRequest
from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth

@api_view(['GET'])
def get_metrics_analytics(request):
    try:
        # Calculate total food distributed
        total_food = FoodRequest.objects.filter(status='distributed').aggregate(
            total=Sum('quantity'))['total'] or 0

        # Calculate total beneficiaries
        total_beneficiaries = FoodRequest.objects.filter(
            status='distributed').aggregate(
            total=Sum('beneficiaries'))['total'] or 0

        # Calculate food waste prevented (same as total food for now)
        total_waste_prevented = total_food

        # Get monthly trends
        monthly_trends = FoodRequest.objects.filter(
            status='distributed'
        ).annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(
            monthly_food=Sum('quantity'),
            monthly_beneficiaries=Sum('beneficiaries')
        ).order_by('month')

        return Response({
            'total_food': total_food,
            'total_beneficiaries': total_beneficiaries,
            'total_waste_prevented': total_waste_prevented,
            'monthly_trends': monthly_trends
        })
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        ) 