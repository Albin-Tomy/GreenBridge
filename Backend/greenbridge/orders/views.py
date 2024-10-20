from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from products.models import Product
from .models import Order, OrderItems,Wishlist, WishlistItems,Cart, CartItems,Payment,Address,Shipping
from .serializers import OrderSerializer, OrderItemsSerializer,WishlistSerializer, WishlistItemsSerializer
from .serializers import CartSerializer, CartItemsSerializer,PaymentSerializer,AddressSerializer,ShippingSerializer

# order && order_item function based view



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
    
# @api_view(['GET', 'POST'])
# def cart_list_create(request):
#     if request.method == 'GET':
#         user_id = request.query_params.get('user_id')
#         if user_id:
#             carts = Cart.objects.filter(user_id=user_id)
#         else:
#             carts = Cart.objects.all()
        
#         serializer = CartSerializer(carts, many=True)
#         return Response(serializer.data)

#     elif request.method == 'POST':
#         serializer = CartSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# @api_view(['GET'])
# def cart_list_create(request):
#     user_id = request.query_params.get('user_id')
    
#     if not user_id:
#         return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)

#     try:
#         # Get the cart for the logged-in user
#         cart = Cart.objects.get(user_id=user_id)
#     except Cart.DoesNotExist:
#         return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)

#     # Get all items in the cart
#     cart_items = CartItems.objects.filter(cart_id=cart.cart_id)
    
#     # Serialize the cart items along with product details
#     serializer = CartItemsSerializer(cart_items, many=True)
#     return Response(serializer.data, status=status.HTTP_200_OK)

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




# @api_view(['GET', 'PUT', 'DELETE'])
# def cart_items_detail(request, pk):
#     try:
#         cart_item = CartItems.objects.get(pk=pk)
#     except CartItems.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'GET':
#         serializer = CartItemsSerializer(cart_item)
#         return Response(serializer.data)

#     elif request.method == 'PUT':
#         serializer = CartItemsSerializer(cart_item, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     elif request.method == 'DELETE':
#         cart_item.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)    
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
    
@api_view(['GET', 'POST'])
def payment_list_create(request):
    if request.method == 'GET':
        payments = Payment.objects.all()
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = PaymentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def payment_detail(request, pk):
    try:
        payment = Payment.objects.get(pk=pk)
    except Payment.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PaymentSerializer(payment)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = PaymentSerializer(payment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        payment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)  

@api_view(['POST'])
def payment_create(request):
    serializer = PaymentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def payment_update(request, pk):
    try:
        payment = Payment.objects.get(pk=pk)
    except Payment.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = PaymentSerializer(payment, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def payment_delete(request, pk):
    try:
        payment = Payment.objects.get(pk=pk)
    except Payment.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    payment.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)     

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