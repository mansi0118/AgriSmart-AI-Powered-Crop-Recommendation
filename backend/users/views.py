from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.core.cache import cache
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
# views.py ke TOP pe ye do lines add karo
from django.conf import settings


from .serializers import SignupSerializer, LoginSerializer


# =========================
# 👤 GET PROFILE
# =========================
@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user
    return Response({
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
        "user_id": user.id   # ✅ added
    })


# =========================
# 🔐 SIGNUP
# =========================
class SignupView(APIView):
    def post(self, request):
        email = request.data.get('email')

        if not cache.get(email):
            return Response(
                {"error": "Email not verified via OTP"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = SignupSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            cache.delete(email)
            return Response(
                {"message": "User registered successfully"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =========================
# 🔐 LOGIN
# =========================
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)

        return Response({
            "message": "Login successful",
            "token": token.key,
            "role": user.role,
            "email": user.email,
            "full_name": user.full_name,
            "user_id": user.id
        }, status=status.HTTP_200_OK)


# =========================
# 👥 USERS LIST
# =========================
@api_view(['GET'])
def users_list(request):
    User = get_user_model()

    users = User.objects.all().values(
        'id', 'email', 'full_name', 'role', 'is_active'
    )

    result = []
    for u in users:
        result.append({
            'id': u['id'],
            'name': u['full_name'] or u['email'].split('@')[0],
            'role': u['role'] if u['role'] else 'Researcher',
            'email': u['email'],
            'status': "Active" if u['is_active'] else "Inactive",
        })

    return Response(result)


# =========================
# 📊 RESEARCHER DATA
# =========================
# views.py

@api_view(['GET', 'DELETE'])
def researcher_list(request, pk=None):
    from .models import Researcher

    if request.method == 'DELETE' and pk:
        try:
            r = Researcher.objects.get(id=pk)
            r.delete()
            return Response({"message": "Deleted"}, status=204)
        except Researcher.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

    if request.method == 'GET':
        data = Researcher.objects.all().select_related('user').values(
            'id', 'name', 'url', 'date', 'user_id', 'user__full_name'
        )
        return Response([{
            'id': d['id'],
            'name': d['name'],
            'url': d['url'],
            'date': d['date'],
            'user_id': d['user_id'],
            'researcher_name': d['user__full_name'] or f"User {d['user_id']}"
        } for d in data])


# ✅ Fix: get user from token, not from body
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def researcher_add(request):
    from .models import Researcher
    from django.utils import timezone

    name = request.data.get('name')
    url = request.data.get('url')

    if not name or not url:
        return Response({"error": "name and url are required"}, status=400)

    r = Researcher.objects.create(
        name=name,
        url=url,
        user=request.user,          # ✅ from token, no need to send user_id
        date=timezone.now().date()
    )

    return Response({
        "message": "Dataset added",
        "id": r.id,
        "name": r.name,
        "url": r.url,
        "date": r.date,
        "researcher_name": request.user.full_name
    }, status=201)
# =========================
# 🔍 GET USER BY EMAIL
# =========================
@api_view(['GET'])
def get_user_by_email(request, email):
    User = get_user_model()

    try:
        user = User.objects.get(email=email)
        return Response({
            'id': user.id,
            'email': user.email,
            'full_name': user.full_name,
            'role': user.role,
            'is_active': user.is_active,
        })
    except User.DoesNotExist:
        return Response(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )


# =========================
# ✏️ UPDATE USER
# =========================
@api_view(["PUT"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_user(request):
    user = request.user

    user.full_name = request.data.get("full_name", user.full_name)
    user.email = request.data.get("email", user.email)
    user.save()

    return Response({
        "message": "Profile updated successfully",
        "full_name": user.full_name,
        "email": user.email,
    })
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import logout

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['POST'])
def logout_user(request):
    try:
        refresh_token = request.data.get("refresh")

        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()   # 🔥 JWT destroy

        return Response({"message": "Logout successful"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)
# =========================
# 🌾 ADD FIELD
# =========================
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_field(request):
    from .models import Field

    user = request.user

    field = Field.objects.create(
        user=user,
        field_name=request.data.get('field_name'),
        crop=request.data.get('crop'),
        area=request.data.get('area'),
        lat=request.data.get('lat'),
        lng=request.data.get('lng')
    )

    return Response({
        "message": "Field added successfully",
        "id": field.id
    })


# =========================
# 📍 GET USER FIELDS
# =========================
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_fields(request):
    from .models import Field

    user = request.user

    fields = Field.objects.filter(user=user)

    data = []
    for f in fields:
        data.append({
            "id": f.id,
            "field_name": f.field_name,
            "crop": f.crop,
            "area": f.area,
            "lat": f.lat,
            "lng": f.lng
        })

    return Response(data)

class ResetPasswordView(APIView):
    def post(self, request, uidb64, token):
        User = get_user_model()
        password = request.data.get("password")

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except:
            return Response({"error": "Invalid link"}, status=400)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired token"}, status=400)

        user.set_password(password)
        user.save()

        return Response({"message": "Password reset successful"})

from django.core.mail import send_mail

class ForgotPasswordView(APIView):
    def post(self, request):
        User = get_user_model()
        email = request.data.get("email")

        if not email:
            return Response({"error": "Email required"}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        reset_link = f"http://localhost:3000/reset-password/{uid}/{token}/"

        # ✅ ACTUAL EMAIL BHEJO
        send_mail(
            subject="AgriSmart - Password Reset Link",
            message=f"Hi {user.full_name},\n\nYour password reset link:\n{reset_link}\n\nThis link expires in 15 minutes.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

        return Response({"message": "Reset link sent to your email ✅"})

import sys
import os
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Path fix
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from crop_ml.model_utils import predict_soil_health, predict_season, predict_nutrient


# =========================
# 🌱 SOIL HEALTH API
# =========================
@api_view(['POST'])
def soil_health_api(request):
    try:
        data = request.data

        required_fields = ["N","P","K","EC","OC","pH","S","Fe","Zn","Mn","Cu"]

        if not all(k in data for k in required_fields):
            return Response({"error": "Missing required fields"}, status=400)

        features = [
            float(data.get("N")),
            float(data.get("P")),
            float(data.get("K")),
            float(data.get("EC")),
            float(data.get("OC")),
            float(data.get("pH")),   # note: training me pH tha, yaha ph aa raha hai
            float(data.get("S")),
            float(data.get("Fe")),
            float(data.get("Zn")),
            float(data.get("Mn")),
            float(data.get("Cu")),
        ]

        result = predict_soil_health(features)

        return Response({"soil_health": result})

    except Exception as e:
        return Response({"error": str(e)}, status=500)
# =========================
# 🌦️ SEASON API
# =========================
@api_view(['POST'])
def season_api(request):
    try:
        data = request.data

        required_fields = ["temperature", "humidity", "rainfall"]

        if not all(k in data for k in required_fields):
            return Response({"error": "Missing required fields"}, status=400)

        features = [
            float(data.get("temperature")),
            float(data.get("humidity")),
            float(data.get("rainfall")),
        ]

        result = predict_season(features)

        return Response({"season": result})

    except Exception as e:
        return Response({"error": str(e)}, status=500)

# =========================
# 🧪 NUTRIENT DEFICIENCY API
# =========================
@api_view(['POST'])
def nutrient_api(request):
    try:
        data = request.data

        required_fields = ["N","P","K"]

        if not all(k in data for k in required_fields):
            return Response({"error": "Missing required fields"}, status=400)

        features = [
            float(data.get("N")),
            float(data.get("P")),
            float(data.get("K")),
        ]

        result = predict_nutrient(features)

        return Response({"deficiency": result})

    except Exception as e:
        return Response({"error": str(e)}, status=500)