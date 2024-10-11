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
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User_profile
from .serializers import UserProfileSerializer
# from bson import id
# from bson import ObjectId 
from django.shortcuts import get_object_or_404

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
                    # 'refresh': str(refresh),
                    # 'access': str(refresh.access_token),
                    # 'user': UserSerializer(user).data
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user_id': user.id,    # Send user ID in the login response
                    'user': UserSerializer(user).data
                }, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Account is disabled."}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
        


# User_profile function-based views

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_user_profile(request):
    # Use the current user's ID from the request
    user_id = request.user.id
    data = request.data
    data['user_id'] = user_id  # Set user_id in the request data

    serializer = UserProfileSerializer(data=data)
    if serializer.is_valid():
        serializer.save()  # Save the profile with the user_id
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def user_profile_detail(request, id):
    try:
        user_profile = get_object_or_404(User_profile, user_id=id)
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)

# Update user profile
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def user_profile_update(request, id):
    try:
        user_profile = get_object_or_404(User_profile, user__id=id)
        
        # Prevent email modification
        if 'email' in request.data:
            request.data.pop('email')
        
        serializer = UserProfileSerializer(user_profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
    
# @api_view(['GET'])
# def user_profile_list(request):
#     user_profiles = User_profile.objects.all()
#     serializer = UserProfileSerializer(user_profiles, many=True)
#     return Response(serializer.data)

# @api_view(['POST'])
# def user_profile_create(request):
#     serializer = UserProfileSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(['GET'])
# def user_profile_detail(request, id):
#     try:
#         # Fetch user profile by custom id
#         user_profile = User_profile.objects.get(id=id)
#     except User_profile.DoesNotExist:
#         return Response({'error': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)

#     # Serialize the user profile data and return it
#     serializer = UserProfileSerializer(user_profile)
#     return Response(serializer.data, status=status.HTTP_200_OK)


# @api_view(['PUT', 'PATCH'])
# def user_profile_update(request, id):
#     try:
#         # Fetch user profile by _id (MongoDB ObjectId)
#         user_profile = User_profile.objects.get(id=ObjectId(id))
        
#         # Use partial=True if using PATCH to allow partial updates
#         serializer = UserProfileSerializer(user_profile, data=request.data, partial=True)

#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#     except User_profile.DoesNotExist:
#         return Response({'error': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)
#     except Exception as e:
#         return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# @api_view(['DELETE'])
# def user_profile_delete(request, pk):
#     try:
#         user_profile = User_profile.objects.get(pk=pk)
#         user_profile.delete()
#         return Response({'message': 'User profile deleted'}, status=status.HTTP_200_OK)
#     except User_profile.DoesNotExist:
#         return Response({'error': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)

    
    
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
