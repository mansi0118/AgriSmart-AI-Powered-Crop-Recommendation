from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token

from django.core.cache import cache
from django.contrib.auth import get_user_model

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
@api_view(['GET', 'DELETE'])
def researcher_list(request, pk=None):
    from .models import Researcher

    # 🔴 DELETE
    if request.method == 'DELETE' and pk:
        try:
            r = Researcher.objects.get(id=pk)
            r.delete()
            return Response({"message": "Deleted"}, status=204)
        except Researcher.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

    # 🟢 GET (THIS WAS MISSING PROPERLY)
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
# =========================
# ➕ ADD RESEARCHER DATASET
# =========================
@api_view(['POST'])
def researcher_add(request):
    from .models import Researcher
    from django.utils import timezone

    name = request.data.get('name')
    url = request.data.get('url')
    user_id = request.data.get('user_id')

    if not name or not url or not user_id:
        return Response({"error": "name, url, user_id required"}, status=400)

    r = Researcher.objects.create(
        name=name,
        url=url,
        user_id=user_id,
        date=timezone.now().date()
    )

    return Response({"message": "Dataset added", "id": r.id}, status=201)


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