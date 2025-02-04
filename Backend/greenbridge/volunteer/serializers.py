from rest_framework import serializers
from .models import Notification, VolunteerPoints, PointsActivity

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'read', 'created_at']

class PointsActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = PointsActivity
        fields = ['id', 'points', 'description', 'date']

class VolunteerPointsSerializer(serializers.ModelSerializer):
    recentActivities = PointsActivitySerializer(source='pointsactivity_set', many=True, read_only=True)
    nextLevelPoints = serializers.SerializerMethodField()

    class Meta:
        model = VolunteerPoints
        fields = ['total_points', 'level', 'nextLevelPoints', 'recentActivities']

    def get_nextLevelPoints(self, obj):
        return (obj.level + 1) * 100 