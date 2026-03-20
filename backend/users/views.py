from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import SignupSerializer
from rest_framework.authtoken.models import Token
from .serializers import LoginSerializer

from django.core.cache import cache   # 👈 add this

class SignupView(APIView):
    def post(self, request):
        email = request.data.get('email')

        # ❌ agar OTP verify nahi hua
        if not cache.get(email):
            return Response(
                {"error": "Email not verified via OTP"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = SignupSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            # ✅ OTP flag hata de (reuse na ho)
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