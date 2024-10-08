from django.shortcuts import render
import requests
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from .models import User,User_profile
from .serializers import UserSerializer,UserProfileSerializer
from django.contrib.auth.hashers import make_password
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import default_token_generator
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode,urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.template.loader import render_to_string
from .serializers import PasswordResetRequestSerializer,PasswordResetConfirmSerializer


@api_view(['POST'])
def user_registration(request):
    if request.method == 'POST':
        try:
            data = request.data
            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

            if User.objects.filter(email=email).exists():
                return Response({"error": "User with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.create(
                email=email,
                password=make_password(password),
                is_active=True
            )
            
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"Error : {str(e)}")
            return Response({"error": "Failed to create user"}, status=status.HTTP_400_BAD_REQUEST)
    return Response({"error": "Invalid request method."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['POST'])
def user_login(request):
    if request.method == 'POST':
        data = request.data
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(email=email, password=password)
        
        if user is not None:
            if user.is_active:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': UserSerializer(user).data
                }, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Account is disabled."}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
        

@api_view(['GET'])
# @permission_classes([IsAuthenticated])  # Still ensure the user is authenticated
def profile_update(request):
    # Extract the token from the query parameters
    token = request.GET.get('tok')
    print(token)

    # Here, you would need to verify the token and authenticate the user
    user = None
    if token:
        try:
            # Your logic to authenticate the user using the token
            user = User.objects.get(auth_token=token)  # This line assumes you are using token-based authentication
            request.user = user  # Set the user on the request
        except User.DoesNotExist:
            return Response({"error": "Invalid token."}, status=status.HTTP_401_UNAUTHORIZED)

    if request.method == 'GET' and user:
        try:
            # Fetch the latest user profile
            profile = user.user_profile_set.latest('created_at')
            profile_data = {
                "first_name": profile.first_name,
                "last_name": profile.last_name,
                "phone": profile.phone,
                "default_address": profile.default_address,
                "default_city": profile.default_city,
                "default_state": profile.default_state,
                "default_pincode": profile.default_pincode,
            }
            return Response({"profile": profile_data}, status=status.HTTP_200_OK)
        except User_profile.DoesNotExist:
            return Response({"error": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)
        except User_profile.MultipleObjectsReturned:
            return Response({"error": "Multiple profiles found."}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"error": "User not authenticated."}, status=status.HTTP_401_UNAUTHORIZED)

    
    
# function for senting password reset link
@api_view(['POST'])
def password_reset_request(request):
    serializer = PasswordResetRequestSerializer(data=request.data)
    if serializer.is_valid():
        user = User.objects.get(email=serializer.validated_data['email'])
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_link = f"{request.scheme}://{request.get_host()}/api/v1/auth/reset-password/{uid}/{token}/"
        message = render_to_string('password_reset_email.html', {
            'user': user,
            'reset_link': reset_link,
        })
        send_mail(
            'Password Reset Request',
            message,
            'no-reply@example.com',
            [user.email],
            fail_silently=False,
        )
        return Response({"message": "Password reset link has been sent to your email."}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




@api_view(['GET', 'POST'])
def password_reset_confirm(request, uidb64, token):
    if request.method == 'GET':
        return render(request, 'password_reset_form.html', context={'uidb64': uidb64, 'token': token})
 
    serializer = PasswordResetConfirmSerializer(data=request.data)
    if serializer.is_valid():
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"error": "Invalid reset link"}, status=status.HTTP_400_BAD_REQUEST)
 
        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)
 
        if request.data.get('new_password') != request.data.get('confirm_password'):
            return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)
 
        user.set_password(serializer.validated_data['new_password'])
        user.save()
 
        return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)
 
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
