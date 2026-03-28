from django.contrib.auth import logout
from django.views.decorators.csrf import csrf_exempt
import random
from django.core.mail import send_mail
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import OTP
from django.core.cache import cache
def logout_user(request):
    if request.method == "POST":
        logout(request)
        return Response({"message": "Logged out successfully"})
    return Response({"error": "Invalid request"}, status=400)
@api_view(['POST'])
def send_otp(request):
    email = request.data.get('email')

    OTP.objects.filter(email=email).delete()

    otp = str(random.randint(100000, 999999))
    OTP.objects.create(email=email, otp=otp)

    send_mail(
        'AgriSmart OTP',
        f'Your OTP is {otp}',
        'jeeya.dhiman.2006@gmail.com',
        [email],
        fail_silently=False,
    )

    return Response({"message": "OTP sent"})


@api_view(['POST'])
def verify_otp(request):
    email = request.data.get('email')
    otp = request.data.get('otp')

    otp_obj = OTP.objects.filter(email=email).last()

    if otp_obj and otp_obj.otp == otp:
        if not otp_obj.is_expired():

            # ✅ YAHAN hona chahiye
            cache.set(email, True, timeout=300)

            otp_obj.delete() 
            return Response({"message": "Verified"})
        else:
            return Response({"error": "OTP expired"})
    
    return Response({"error": "Invalid OTP"})
