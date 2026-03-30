import random
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import OTP


@api_view(['POST'])
def send_otp(request):
    email = request.data.get('email')
    OTP.objects.filter(email=email).delete()
    otp = str(random.randint(100000, 999999))
    OTP.objects.create(email=email, otp=otp)
    send_mail(
        'AgriSmart OTP',
        f'Your OTP is {otp}',
        settings.EMAIL_HOST_USER,
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
            cache.set(email, True, timeout=300)
            otp_obj.delete()
            return Response({"message": "Verified"})
        else:
            return Response({"error": "OTP expired"})
    return Response({"error": "Invalid OTP"})


@api_view(['GET'])
def users_list(request):
    User = get_user_model()
    users = User.objects.all().values(
        'id', 'email', 'first_name', 'last_name',
        'is_active', 'is_superuser', 'is_staff'
    )
    result = []
    for u in users:
        full_name = f"{u['first_name']} {u['last_name']}".strip() or u['email'].split('@')[0]
        if u['is_superuser']:
            role = "Super Admin"
        elif u['is_staff']:
            role = "Staff"
        else:
            role = "Researcher"
        result.append({
            'id': u['id'],
            'name': full_name,
            'role': role,
            'email': u['email'],
            'status': "Active" if u['is_active'] else "Inactive",
        })
    return Response(result)