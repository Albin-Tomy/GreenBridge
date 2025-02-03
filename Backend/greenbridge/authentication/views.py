from django.shortcuts import render
import requests
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from .models import User,User_profile
from .serializers import UserSerializer,UserProfileSerializer
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from django.template.loader import render_to_string
from .serializers import PasswordResetRequestSerializer,PasswordResetConfirmSerializer
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.hashers import make_password
from .models import User, User_profile
from django.http import HttpResponse  # assuming your custom User model is defined here
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

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

            with transaction.atomic():
                # Create user
                user = User.objects.create(
                    email=email,
                    password=make_password(password),
                    is_active=False  # Set to inactive until email is verified
                )

                # Create the user profile for the registered user
                User_profile.objects.create(
                    user=user,
                    first_name='',
                    last_name='',
                    phone='',
                    default_address='',
                    default_city='',
                    default_state='',
                    default_pincode=''
                )

                # Generate email verification token
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))

                # Construct verification URL
                verification_url = request.build_absolute_uri(
                    reverse('verify_email', kwargs={'uidb64': uid, 'token': token})
                )

                # Send verification email
                send_mail(
                    'Verify Your Email',
                    f'Click the link to verify your email: {verification_url}',
                    'your_email@example.com',  # Replace with your sender email
                    [email],
                    fail_silently=False,
                )

            serializer = UserSerializer(user)
            return Response({"message": "Registration successful. Please check your email to verify your account."}, status=status.HTTP_201_CREATED)
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
                # Ensure the user has a profile
                if not User_profile.objects.filter(user=user).exists():
                    User_profile.objects.create(user=user)

                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user_id': user.id,  # Send user ID in the login response
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
@permission_classes([IsAuthenticated])
def user_profile_detail(request, id):
    try:
        # Try to get existing profile or create a basic one
        profile, created = User_profile.objects.get_or_create(
            user_id=id,
            defaults={
                'first_name': '',
                'last_name': '',
                'email': request.user.email,
                'phone': '',
                'default_address': '',
                'default_city': '',
                'default_state': '',
                'default_pincode': ''
            }
        )

        # Check if profile is complete
        is_complete = all([
            profile.first_name,
            profile.last_name,
            profile.phone,
            profile.default_address,
            profile.default_city,
            profile.default_state,
            profile.default_pincode
        ])
        
        serializer = UserProfileSerializer(profile)
        data = serializer.data
        data['is_profile_completed'] = is_complete
        return Response(data, status=status.HTTP_200_OK)
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
        
        # Convert pincode to string if it's a number
        if 'default_pincode' in request.data:
            request.data['default_pincode'] = str(request.data['default_pincode'])
        
        serializer = UserProfileSerializer(user_profile, data=request.data, partial=True)
        if serializer.is_valid():
            profile = serializer.save()
            
            # Check if all required fields are filled
            is_complete = all([
                profile.first_name,
                profile.last_name,
                profile.phone,
                profile.default_address,
                profile.default_city,
                profile.default_state,
                profile.default_pincode
            ])
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(f"Error updating profile: {str(e)}")  # Add debug logging
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

    
    
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

# @api_view(['POST'])
# def google_sign_in(request):
#     access_token = request.data.get('token')
#     print("Received access_token:", access_token)
#     if not access_token:
#         return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

#     # Verify the access token with Google
#     google_response = requests.get(
#         f"https://www.googleapis.com/oauth2/v1/userinfo?access_token={access_token}"
#     )

#     if google_response.status_code != 200:
#         return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

#     google_data = google_response.json()
#     email = google_data.get('email')

#     # Use the google_user_id to identify the user
#     try:
#         user = User.objects.get(email=email)
#     except User.DoesNotExist:
#         user = User.objects.create(
#             email=email,
#         )
#         user.save()

#     # Generate JWT tokens
#     refresh = RefreshToken.for_user(user)
#     access_token = str(refresh.access_token)

#     return Response({
#         'access_token': access_token,
#         'refresh_token': str(refresh),
#         'user': {
#             'id': user.id,
#             'email': user.email,
#         }
#     }, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_all_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users,many=True)
    if serializer.is_valid:
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['DELETE'])
def delete_user(request, user_id):
    user = get_object_or_404(User, id=user_id)
    user.delete()
    return Response({"message": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)



User = get_user_model()

@api_view(['GET'])
def verify_email(request, uidb64, token):
    try:
        # Decode the user ID from the URL
        uid = urlsafe_base64_decode(uidb64).decode()
        user = get_object_or_404(User, pk=uid)

        # Verify the token
        if default_token_generator.check_token(user, token):
            # Activate the user account
            user.is_active = True
            user.save()

            # Enhanced HTML response for successful verification
            html_content = """
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f0f8ff;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }
                    .message-container {
                        text-align: center;
                        background-color: #fff;
                        padding: 40px;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    }
                    .message-container h1 {
                        font-size: 32px;
                        color: #4CAF50;
                    }
                    .message-container p {
                        font-size: 18px;
                        color: #333;
                    }
                </style>
            </head>
            <body>
                <div class="message-container">
                    <h1>Email Verified Successfully!</h1>
                    <p>You can now log in.</p>
                </div>
            </body>
            </html>
            """
            return HttpResponse(html_content)
        else:
            # Enhanced response for invalid or expired token
            html_content = """
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #ffebee;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }
                    .message-container {
                        text-align: center;
                        background-color: #fff;
                        padding: 40px;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    }
                    .message-container h1 {
                        font-size: 32px;
                        color: #f44336;
                    }
                    .message-container p {
                        font-size: 18px;
                        color: #333;
                    }
                </style>
            </head>
            <body>
                <div class="message-container">
                    <h1>Invalid Verification Link</h1>
                    <p>The verification link is invalid or has expired.</p>
                </div>
            </body>
            </html>
            """
            return HttpResponse(html_content, status=400)
    except Exception as e:
        print(f"Verification Error: {str(e)}")
        # Enhanced response for unexpected errors
        html_content = """
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #ffe0b2;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .message-container {
                    text-align: center;
                    background-color: #fff;
                    padding: 40px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }
                .message-container h1 {
                    font-size: 32px;
                    color: #ff9800;
                }
                .message-container p {
                    font-size: 18px;
                    color: #333;
                }
            </style>
        </head>
        <body>
            <div class="message-container">
                <h1>Error Occurred</h1>
                <p>An error occurred during email verification. Please try again later.</p>
            </div>
        </body>
        </html>
        """
        return HttpResponse(html_content, status=400)


@api_view(['POST'])
def google_sign_in(request):
    access_token = request.data.get('token')
    if not access_token:
        return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        google_response = requests.get(
            f"https://www.googleapis.com/oauth2/v1/userinfo?access_token={access_token}"
        )

        if google_response.status_code != 200:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

        google_data = google_response.json()
        email = google_data.get('email')

        # Get or create user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'is_active': True,
            }
        )

        # Create a basic profile if it doesn't exist
        try:
            profile = User_profile.objects.get(user=user)
        except User_profile.DoesNotExist:
            profile = User_profile.objects.create(
                user=user,
                first_name=google_data.get('given_name', ''),
                last_name=google_data.get('family_name', ''),
                email=email,
            )

        # Generate JWT token
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response({
            'access': access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'is_superuser': user.is_superuser,
                'is_shg': user.is_shg,
                'is_ngo': user.is_ngo,
                'is_active': user.is_active,
            }
        })

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
