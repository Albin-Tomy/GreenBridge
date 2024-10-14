from django.db import models
from django.utils import timezone

class Category(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return self.name
    
class MadeOf(models.Model):
    madeof_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return self.name

class Country(models.Model):
    country_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return self.name
    
class Brand(models.Model):
    brand_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return self.name


# class Product(models.Model):
#     product_id = models.AutoField(primary_key=True)
#     name = models.CharField(max_length=255)
#     description = models.TextField()
#     price = models.FloatField()
#     quantity = models.CharField(max_length=255)
#     brand = models.ForeignKey('Brand', on_delete=models.CASCADE)
#     country = models.ForeignKey('Country', on_delete=models.CASCADE)
#     made_of = models.ForeignKey('MadeOf',on_delete=models.CASCADE)
#     category = models.ForeignKey('Category', on_delete=models.CASCADE)
#     stock_quantity = models.IntegerField()
#     updated_at = models.DateTimeField(auto_now=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     image = models.ImageField(upload_to='product_images/', null=True, blank=True)

#     def _str_(self):
#         return self.name

class SubCategory(models.Model):
    subcategory_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey('Category', on_delete=models.CASCADE)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    

class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.FloatField()
    quantity = models.CharField(max_length=255)
    brand = models.ForeignKey('Brand', on_delete=models.CASCADE)
    country = models.ForeignKey('Country', on_delete=models.CASCADE)
    made_of = models.ForeignKey('MadeOf', on_delete=models.CASCADE)
    category = models.ForeignKey('Category', on_delete=models.CASCADE)
    stock_quantity = models.IntegerField()
    image = models.ImageField(upload_to='product_images/', null=True, blank=True)  
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name