from rest_framework import serializers
from .models import Order, OrderItems,Wishlist, WishlistItems,Cart, CartItems
from .models import Payment,Address,Shipping
from products.serializers import ProductSerializer


class OrderItemsSerializer(serializers.ModelSerializer):
    product_id = ProductSerializer(read_only=True) 
    class Meta:
        model = OrderItems
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemsSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'


class WishlistItemsSerializer(serializers.ModelSerializer):
    product = ProductSerializer(source='product_id', read_only=True)
    class Meta:
        model = WishlistItems
        fields = '__all__'

class WishlistSerializer(serializers.ModelSerializer):
    wishlist_items = WishlistItemsSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = '__all__'        


class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'

class CartItemsSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True, source='product_id')
    class Meta:
        model = CartItems
        fields = '__all__'


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__' 


class ShippingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipping
        fields = '__all__'