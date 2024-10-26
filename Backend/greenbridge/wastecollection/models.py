from django.db import models # Assuming you are using Django's built-in User model
from authentication.models import User
# WasteCategory Model
class WasteCategory(models.Model):
    id = models.AutoField(primary_key=True)  # Primary Key
    name = models.CharField(max_length=255)  # Waste Category Name

    def __str__(self):
        return self.name

# WasteSubcategory Model
class WasteSubcategory(models.Model):
    id = models.AutoField(primary_key=True)  # Primary Key
    name = models.CharField(max_length=255)  # Subcategory Name
    waste_category = models.ForeignKey(WasteCategory, on_delete=models.CASCADE)  # Foreign Key linking to WasteCategory

    def __str__(self):
        return self.name

# Location Model
class Location(models.Model):
    id = models.AutoField(primary_key=True)  # Primary Key
    name = models.CharField(max_length=255)  # Location Name

    def __str__(self):
        return self.name

class Request(models.Model):
    STATUS_CHOICES = [
        ('Approved', 'Approved'),
        ('Pending', 'Pending'),
        ('Rejected', 'Rejected'),
    ]
    
    COLLECTION_STATUS_CHOICES = [
        ('On the Way', 'On the Way'),
        ('Completed', 'Completed'),
        ('Not Started', 'Not Started'),
    ]
    
    id = models.AutoField(primary_key=True)  # Primary Key
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Foreign Key linking to User
    collection_status = models.CharField(max_length=15, choices=COLLECTION_STATUS_CHOICES, default='Not Started')  # Collection Status
    waste_subcategory = models.ForeignKey(WasteSubcategory, on_delete=models.CASCADE)  # Foreign Key linking to WasteSubcategory
    location = models.ForeignKey(Location, on_delete=models.CASCADE)  # Foreign Key linking to Location
    request_status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pending')  # Request Status

    def __str__(self):
        return f"Request {self.id} by {self.user.username}, Status: {self.request_status}, Collection: {self.collection_status}"
