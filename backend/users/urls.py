from . import views
from django.urls import path
from .views import SignupView, LoginView, get_profile, users_list, researcher_list, researcher_add, get_user_by_email, update_user
urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('', users_list, name='users-list'),
    path('profile/', get_profile, name='get-profile'),
    path('update_user/', update_user, name='update-user'),
    path('researchers/add/', researcher_add, name='researcher-add'),        # ✅ UPAR
    path('researchers/', researcher_list, name='researcher-list'),
    path('researchers/<int:pk>/', researcher_list, name='researcher-detail'),
    path('get_user_by_email/<str:email>/', get_user_by_email, name='get-user-by-email'),
]