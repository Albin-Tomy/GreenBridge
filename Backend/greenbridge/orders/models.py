from django.db import models
from authentication.models import User
from products.models import Product

class Order(models.Model):
    order_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    order_date = models.DateTimeField()
    order_status = models.CharField(max_length=50)
    tax_amount = models.FloatField()
    total_amount = models.FloatField()
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return f"Order {self.order_id} - {self.order_status}"


class OrderItems(models.Model):
    order_item_id = models.AutoField(primary_key=True)
    order_id = models.ForeignKey(Order, on_delete=models.CASCADE)
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.FloatField()
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return f"Order Item {self.order_item_id} for Order {self.order_id}"


class Wishlist(models.Model):
    wishlist_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return f"Wishlist {self.wishlist_id} for User {self.user_id}"


class WishlistItems(models.Model):
    wishlist_item_id = models.AutoField(primary_key=True)
    wishlist_id = models.ForeignKey(Wishlist, on_delete=models.CASCADE)
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return f"Wishlist Item {self.wishlist_item_id} for Wishlist {self.wishlist_id}"


class Cart(models.Model):
    cart_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return f"Cart {self.cart_id} for User {self.user_id}"


class CartItems(models.Model):
    cart_item_id = models.AutoField(primary_key=True)
    cart_id = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return f"Cart Item {self.cart_item_id} for Cart {self.cart_id}"



class Payment(models.Model):
    payment_id = models.AutoField(primary_key=True)
    cart_id = models.ForeignKey(Cart, on_delete=models.CASCADE)
    amount = models.FloatField()
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return f"Payment {self.payment_id} for Cart {self.cart_id}"
    

class Address(models.Model):
    address_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    address_line1 = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    pincode = models.CharField(max_length=20)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return f"Address {self.address_id} for User {self.user_id}"


class Shipping(models.Model):
    shipping_id = models.AutoField(primary_key=True)
    order_id = models.ForeignKey(Order, on_delete=models.CASCADE)
    address_id = models.ForeignKey(Address, on_delete=models.CASCADE)
    shipping_date = models.DateTimeField()
    tracking_number = models.CharField(max_length=100)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return f"Shipping {self.shipping_id} for Order {self.order_id}"