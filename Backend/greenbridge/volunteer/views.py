from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Notification, VolunteerPoints, PointsActivity
from .serializers import NotificationSerializer, VolunteerPointsSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, notification_id):
    try:
        notification = Notification.objects.get(id=notification_id, user=request.user)
        notification.read = True
        notification.save()
        return Response({'status': 'success'})
    except Notification.DoesNotExist:
        return Response({'error': 'Notification not found'}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_volunteer_points(request):
    points, created = VolunteerPoints.objects.get_or_create(user=request.user)
    recent_activities = PointsActivity.objects.filter(volunteer=points).order_by('-date')[:5]
    serializer = VolunteerPointsSerializer(points)
    return Response(serializer.data)

def award_points(user, points, description):
    """
    Utility function to award points to a volunteer
    """
    volunteer_points, created = VolunteerPoints.objects.get_or_create(user=user)
    volunteer_points.total_points += points
    
    # Calculate new level (every 100 points = 1 level)
    new_level = (volunteer_points.total_points // 100) + 1
    if new_level > volunteer_points.level:
        volunteer_points.level = new_level
        # Create notification for level up
        Notification.objects.create(
            user=user,
            title='Level Up!',
            message=f'Congratulations! You have reached Level {new_level}!'
        )
    
    volunteer_points.save()
    
    # Record the activity
    PointsActivity.objects.create(
        volunteer=volunteer_points,
        points=points,
        description=description
    )
    
    # Create notification for points earned
    Notification.objects.create(
        user=user,
        title='Points Earned',
        message=f'You earned {points} points for {description}'
    ) 