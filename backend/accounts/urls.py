from django.urls import path,include
from .views import send_otp, verify_otp

urlpatterns = [
    path('send-otp/', send_otp),
    path('verify-otp/', verify_otp),
    path('api/', include('users.urls')),
]