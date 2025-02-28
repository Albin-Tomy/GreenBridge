# authentication/views.py

from django.http import JsonResponse
from django.views import View
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
class RegisterView(View):
    def post(self, request):
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            User.objects.create_user(username=username, password=password)
            return JsonResponse({'message': 'User created successfully'}, status=201)
        return JsonResponse({'error': 'Invalid data'}, status=400)
