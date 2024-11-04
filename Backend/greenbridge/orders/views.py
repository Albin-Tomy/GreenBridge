from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from products.models import Product
from .models import Order, OrderItems,Wishlist, WishlistItems,Cart, CartItems,Payment,Address,Shipping
from .serializers import OrderSerializer, OrderItemsSerializer,WishlistSerializer, WishlistItemsSerializer
from .serializers import CartSerializer, CartItemsSerializer,PaymentSerializer,AddressSerializer,ShippingSerializer


# Wishlist && wishlist_item function based view

@api_view(['GET', 'POST'])
def wishlist_list_create(request):
    if request.method == 'GET':
        user_id = request.GET.get('user_id')  # Get user_id from query parameters
        if user_id:
            wishlists = Wishlist.objects.filter(user_id=user_id)  # Filter wishlist by user_id
        else:
            wishlists = Wishlist.objects.all()
        serializer = WishlistSerializer(wishlists, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = WishlistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def wishlist_items_list_create(request):
    if request.method == 'GET':
        wishlist_items = WishlistItems.objects.all()
        serializer = WishlistItemsSerializer(wishlist_items, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        wishlist_id = request.data.get('wishlist_id')
        product_id = request.data.get('product_id')

        # Ensure both wishlist_id and product_id are provided
        if not wishlist_id or not product_id:
            return Response({"error": "Wishlist ID and Product ID are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the product already exists in the wishlist
        existing_item = WishlistItems.objects.filter(wishlist_id=wishlist_id, product_id=product_id).first()
        if existing_item:
            return Response({"error": "Product is already in the wishlist"}, status=status.HTTP_400_BAD_REQUEST)

        # If not already in the wishlist, proceed with saving
        serializer = WishlistItemsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# View for handling individual wishlist item (GET, PUT, DELETE)
@api_view(['GET', 'PUT', 'DELETE'])
def wishlist_items_detail(request, pk):
    try:
        wishlist_item = WishlistItems.objects.get(pk=pk)
    except WishlistItems.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = WishlistItemsSerializer(wishlist_item)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = WishlistItemsSerializer(wishlist_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        wishlist_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# cart && caert_item function based view


# View for listing or creating carts
@api_view(['GET', 'POST'])
def cart_list_view(request):
    if request.method == 'GET':
        user_id = request.query_params.get('user_id')
        if user_id:
            carts = Cart.objects.filter(user_id=user_id)
        else:
            carts = Cart.objects.all()

        serializer = CartSerializer(carts, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = CartSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View for getting cart items
@api_view(['GET'])
def cart_items_list_view(request):
    user_id = request.query_params.get('user_id')

    if not user_id:
        return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        cart = Cart.objects.get(user_id=user_id)
    except Cart.DoesNotExist:
        return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)

    cart_items = CartItems.objects.filter(cart_id=cart.cart_id)
    serializer = CartItemsSerializer(cart_items, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET', 'PUT', 'DELETE'])
def cart_detail(request, pk):
    try:
        cart = Cart.objects.get(pk=pk)
    except Cart.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = CartSerializer(cart, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        cart.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



@api_view(['POST'])
def cart_items_list_create(request):
    print("Incoming request data:", request.data)
    user_id = request.data.get('user_id')
    product_id = request.data.get('product_id')
    product_id = int(request.data.get('product_id'))
    quantity = request.data.get('quantity', 1)  # Default quantity to 1 if not provided

    # Check for missing fields
    if not user_id:
        return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)
    if not product_id:
        return Response({'error': 'Product ID is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Get the user's cart
        cart = Cart.objects.get(user_id=user_id)
    except Cart.DoesNotExist:
        return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)

    try:
        # Validate if the product exists before adding to cart
        product = Product.objects.get(product_id=product_id)  # Ensure the product exists
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    # Check if the product is already in the cart
    cart_item, created = CartItems.objects.get_or_create(
        cart_id=cart,  # Use cart instance directly for cart_id field
        product_id=product,  # Use the product instance here
        defaults={'quantity': quantity}
    )

    if not created:
        # If the product already exists in the cart, update the quantity
        cart_item.quantity += int(quantity)
        cart_item.save()

    serializer = CartItemsSerializer(cart_item)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PUT', 'DELETE', 'PATCH'])  # Add PATCH here
def cart_items_detail(request, pk):
    try:
        cart_item = CartItems.objects.get(pk=pk)
    except CartItems.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CartItemsSerializer(cart_item)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = CartItemsSerializer(cart_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PATCH':  # Handle PATCH for partial updates
        serializer = CartItemsSerializer(cart_item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['DELETE'])
def clear_cart_items(request):
    user_id = request.query_params.get('user_id')
    if not user_id:
        return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        cart = Cart.objects.get(user_id=user_id)
        CartItems.objects.filter(cart_id=cart.cart_id).delete()
        return Response({'message': 'Cart cleared successfully'}, status=status.HTTP_200_OK)
    except Cart.DoesNotExist:
        return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)


# order && order_item function based view

# @api_view(['GET'])
# def user_orders(request, user_id):
#     try:
#         orders = Order.objects.filter(user_id=user_id)
#         serialized_orders = []

#         for order in orders:
#             order_serializer = OrderSerializer(order)
#             order_items = OrderItems.objects.filter(order_id=order.order_id)
#             order_items_serializer = OrderItemsSerializer(order_items, many=True)
            
#             serialized_orders.append({
#                 'order': order_serializer.data,
#                 'order_items': order_items_serializer.data
#             })

#         return Response(serialized_orders, status=status.HTTP_200_OK)

#     except Order.DoesNotExist:
#         return Response({'error': 'No orders found for this user'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def user_orders(request, user_id):
    try:
        orders = Order.objects.filter(user_id=user_id)
        serialized_orders = []

        for order in orders:
            order_serializer = OrderSerializer(order)
            order_items = OrderItems.objects.filter(order_id=order.order_id)
            order_items_serializer = OrderItemsSerializer(order_items, many=True)
            
            serialized_orders.append({
                'order': order_serializer.data,
                'order_items': order_items_serializer.data
            })

        return Response(serialized_orders, status=status.HTTP_200_OK)

    except Order.DoesNotExist:
        return Response({'error': 'No orders found for this user'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def order_items(request, order_id):
    try:
        items = OrderItems.objects.filter(order_id=order_id)
        serializer = OrderItemsSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def order_list(request):
    if request.method == 'GET':
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def order_detail(request, pk):
    try:
        order = Order.objects.get(pk=pk)
    except Order.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = OrderSerializer(order)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = OrderSerializer(order, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
       

@api_view(['DELETE'])
def delete_order(request, pk):
    try:
        order = Order.objects.get(pk=pk)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    try:
        order_item = OrderItems.objects.filter(order_id=pk)
    except OrderItems.DoesNotExist:
        order_item=None

    if request.method == 'DELETE':
        order.delete()
        if order_item:
            order_item.delete()
        return Response({'message': 'Order deleted successfully'}, status=status.HTTP_200_OK)


@api_view(['PUT'])
def update_order(request, pk):
    try:
        order = Order.objects.get(pk=pk)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = OrderSerializer(order, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_order_item(request, pk):
    try:
        order_item = OrderItems.objects.get(pk=pk)
    except OrderItems.DoesNotExist:
        return Response({'error': 'Order Item not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        order_item.delete()
        return Response({'message': 'Order Item deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def order_items_list(request):
    if request.method == 'GET':
        order_items = OrderItems.objects.all()
        serializer = OrderItemsSerializer(order_items, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = OrderItemsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def order_item_detail(request, pk):
    try:
        order_item = OrderItems.objects.get(pk=pk)
    except OrderItems.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = OrderItemsSerializer(order_item)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = OrderItemsSerializer(order_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        order_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Payment function based view   



from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from .models import Payment, Cart, Order
from .serializers import PaymentSerializer
import razorpay
from django.conf import settings

# Initialize Razorpay client
# razorpay_client = razorpay.Client(auth=("rzp_test_yIjQWNT42YCgb7", "Ynez8xNEVxPeFn3DDYV2TgqQ"))
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_API_KEY, settings.RAZORPAY_API_SECRET))


@api_view(['POST'])
def create_payment(request):
    payment_method = request.data.get('payment_method')
    amount = request.data.get('amount')
    cart_id = request.data.get('cart_id')

    try:
        cart = Cart.objects.get(cart_id=cart_id)
    except Cart.DoesNotExist:
        return Response({'error': 'Invalid cart ID'}, status=status.HTTP_400_BAD_REQUEST)

    if payment_method == 'cod':
        # Create order entry before saving payment
        order = Order.objects.create(
            user_id=cart.user_id,
            order_status="Placed",
            order_date=timezone.now(),
            tax_amount=0,  # Modify as needed
            total_amount=amount
        )

        payment = Payment(
            payment_method='cod',
            amount=amount,
            cart_id=cart,
            is_successful=True,
            order_id=order  # Link to order
        )
        payment.save()

        create_order_items(order, cart_id)

        update_stock_quantities(cart)

        return Response({'message': 'Order placed successfully with COD', 'order_id': order.order_id}, status=status.HTTP_201_CREATED)

    elif payment_method == 'online':
        # Razorpay order creation
        razorpay_order = razorpay_client.order.create({
            'amount': int(amount * 100),
            'currency': 'INR',
            'payment_capture': 1
        })

        payment = Payment(
            payment_method='online',
            amount=amount,
            cart_id=cart,
            payment_id=razorpay_order['id'],
            is_successful=False
        )
        payment.save()
        return Response({'order_id': razorpay_order['id']}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def verify_payment(request):
    payment_id = request.data.get('payment_id')
    razorpay_order_id = request.data.get('order_id')

    try:
        payment = Payment.objects.get(payment_id=razorpay_order_id)
        razorpay_payment = razorpay_client.payment.fetch(payment_id)

        if razorpay_payment['status'] == 'captured':
            # Create an order for the successful payment
            order = Order.objects.create(
                user_id=payment.cart_id.user_id,
                order_status="Placed",
                order_date=timezone.now(),
                tax_amount=0,
                total_amount=payment.amount
            )

            # Update payment details
            payment.is_successful = True
            payment.payment_id = payment_id  # Save actual Razorpay payment ID
            payment.order_id = order  # Associate the order with payment
            payment.save()

            update_stock_quantities(payment.cart_id)

            create_order_items(order, payment.cart_id)
            
            return Response({'message': 'Payment verified and order created', 'order_id': order.order_id}, status=status.HTTP_200_OK)

        else:
            return Response({'error': 'Payment not captured. Please try again.'}, status=status.HTTP_400_BAD_REQUEST)

    except Payment.DoesNotExist:
        return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

from django.shortcuts import get_object_or_404

# Helper function to update stock quantities for the items in the cart
def update_stock_quantities(cart):
    cart_items = CartItems.objects.filter(cart_id=cart.cart_id)
    for item in cart_items:
        product = get_object_or_404(Product, product_id=item.product_id.product_id)
        if product.stock_quantity >= item.quantity:
            product.stock_quantity -= item.quantity  # Decrease stock quantity
            product.save()
        else:
            # If stock is insufficient, raise an error or handle accordingly
            raise ValueError(f'Insufficient stock for product: {product.name}')
        
def create_order_items(order, cart_id):
    cart_items = CartItems.objects.filter(cart_id=cart_id)
    for item in cart_items:
        # Get product and quantity from each cart item
        product = item.product_id
        quantity = item.quantity

        # Calculate price based on product price and quantity
        price = product.price * quantity

        # Create an OrderItem instance
        OrderItems.objects.create(
            order_id=order,
            product_id=product,
            quantity=quantity,
            price=price
        )

    # Clear cart items after order items are created
    cart_items.delete()

    
# @api_view(['GET', 'POST'])
# def address_list(request):
#     if request.method == 'GET':
#         addresses = Address.objects.all()
#         serializer = AddressSerializer(addresses, many=True)
#         return Response(serializer.data)

#     elif request.method == 'POST':
#         serializer = AddressSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['GET', 'PUT', 'DELETE'])
# def address_detail(request, pk):
#     try:
#         address = Address.objects.get(pk=pk)
#     except Address.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'GET':
#         serializer = AddressSerializer(address)
#         return Response(serializer.data)

#     elif request.method == 'PUT':
#         serializer = AddressSerializer(address, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     elif request.method == 'DELETE':
#         address.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
    

 #  Address function based view   
    
# @api_view(['GET', 'POST'])
# def address_list(request):
#     if request.method == 'GET':
#         addresses = Address.objects.all()
#         serializer = AddressSerializer(addresses, many=True)
#         return Response(serializer.data)

#     elif request.method == 'POST':
#         serializer = AddressSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['GET', 'PUT', 'DELETE'])
# def address_detail(request, pk):
#     try:
#         address = Address.objects.get(pk=pk)
#     except Address.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'GET':
#         serializer = AddressSerializer(address)
#         return Response(serializer.data)

#     elif request.method == 'PUT':
#         serializer = AddressSerializer(address, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     elif request.method == 'DELETE':
#         address.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
@api_view(['GET', 'POST'])
def address_list(request):
    if request.method == 'GET':
        addresses = Address.objects.all()
        serializer = AddressSerializer(addresses, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = AddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def address_detail(request, pk):
    try:
        address = Address.objects.get(pk=pk)
    except Address.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = AddressSerializer(address)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = AddressSerializer(address, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        address.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

@api_view(['POST'])
def create_address(request):
    if request.method == 'POST':
        serializer = AddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def update_address(request, pk):
    try:
        address = Address.objects.get(pk=pk)
    except Address.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = AddressSerializer(address, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_address(request, pk):
    try:
        address = Address.objects.get(pk=pk)
    except Address.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        address.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


#  Shipping function based view   
    
@api_view(['GET', 'POST'])
def shipping_list(request):
    if request.method == 'GET':
        shippings = Shipping.objects.all()
        serializer = ShippingSerializer(shippings, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ShippingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def shipping_detail(request, pk):
    try:
        shipping = Shipping.objects.get(pk=pk)
    except Shipping.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ShippingSerializer(shipping)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ShippingSerializer(shipping, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        shipping.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

@api_view(['POST'])
def shipping_create(request):
    serializer = ShippingSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def shipping_update(request, pk):
    try:
        shipping = Shipping.objects.get(pk=pk)
    except Shipping.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = ShippingSerializer(shipping, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def shipping_delete(request, pk):
    try:
        shipping = Shipping.objects.get(pk=pk)
    except Shipping.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    shipping.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)