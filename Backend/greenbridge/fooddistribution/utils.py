from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings

def send_volunteer_notification(volunteer, food_request):
    """
    Send email notification to volunteer about new food collection request
    """
    context = {
        'volunteer_name': volunteer.user.get_full_name(),
        'food_type': food_request.food_type,
        'quantity': food_request.quantity,
        'pickup_address': food_request.pickup_address,
        'expiry_time': food_request.expiry_time,
        'login_url': 'http://localhost:3000/login'
    }
    
    try:
        send_mail(
            subject='New Food Collection Request Available',
            message='',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[volunteer.user.email],
            html_message=render_to_string('emails/collection_request.html', context),
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending email to {volunteer.user.email}: {str(e)}")
        return False 