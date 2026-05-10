
from django.contrib import admin
from django.urls import path, include
from users.views import researcher_list, researcher_add

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/accounts/', include('accounts.urls')),
]



