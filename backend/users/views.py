from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework.authtoken.models import Token
from django.core.cache import cache

from .serializers import SignupSerializer, LoginSerializer
from .models import Researcher


# =========================
# 🔐 SIGNUP
# =========================
class SignupView(APIView):
    def post(self, request):
        email = request.data.get('email')

        # ❌ OTP not verified
        if not cache.get(email):
            return Response(
                {"error": "Email not verified via OTP"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = SignupSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            # ✅ remove OTP after use
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
            "full_name": user.full_name
        }, status=status.HTTP_200_OK)


# =========================
# 📊 GET RESEARCH DATA
# =========================
@api_view(["GET"])
def get_data(request, user_id):
    data = list(Researcher.objects.filter(user_id=user_id).values())
    return Response(data)


# =========================
# ➕ ADD DATASET
# =========================
@api_view(["POST"])
def add_data(request):
    Researcher.objects.create(
        user_id=request.data.get("user_id"),
        name=request.data.get("name"),
        url=request.data.get("url")
    )

    return Response({"msg": "Dataset added successfully"})


# =========================
# ⚙️ UPDATE USER SETTINGS
# =========================
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_user(request):
    user = request.user

    user.full_name = request.data.get("full_name", user.full_name)
    user.email = request.data.get("email", user.email)

    # optional fields (only if exist in model)
    if hasattr(user, "phone"):
        user.phone = request.data.get("phone", user.phone)

    if hasattr(user, "region"):
        user.region = request.data.get("region", user.region)

    user.save()

    return Response({"msg": "User updated successfully"})