from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from django.core.cache import cache
from django.contrib.auth import get_user_model
from .serializers import SignupSerializer, LoginSerializer



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
    data = Researcher.objects.all().values('id', 'name', 'url', 'date', 'user_id')
    return Response(list(data))
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
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
