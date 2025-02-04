from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    message = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class VolunteerPoints(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    total_points = models.IntegerField(default=0)
    level = models.IntegerField(default=1)

class PointsActivity(models.Model):
    volunteer = models.ForeignKey(VolunteerPoints, on_delete=models.CASCADE)
    points = models.IntegerField()
    description = models.CharField(max_length=200)
    date = models.DateTimeField(auto_now_add=True) 