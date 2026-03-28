
from django.contrib import admin
from django.urls import path, include

from accounts.views import send_otp, verify_otp

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/accounts/', include('accounts.urls')),
]



