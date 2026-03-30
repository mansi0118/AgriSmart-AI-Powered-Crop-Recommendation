from . import views
from django.urls import path
from .views import SignupView, LoginView, get_profile, users_list, researcher_list, get_user_by_email

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('', users_list, name='users-list'),
    path('researchers/', researcher_list, name='researcher-list'),
    path('researchers/<int:pk>/', researcher_list, name='researcher-delete'),
    path('get_user_by_email/<str:email>/', get_user_by_email, name='get-user-by-email'),  # ADD THIS
]