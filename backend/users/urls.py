from django.urls import path
from .views import (
    SignupView,
    LoginView,
    logout_user,
    ForgotPasswordView,
    ResetPasswordView,
    get_profile,
    users_list,
    researcher_list,
    researcher_add,
    get_user_by_email,
    update_user,
    add_field,
    get_fields,
    soil_health_api,
    predict

)

urlpatterns = [
    # 🔐 Auth APIs
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', logout_user, name='logout'),

    # 🔁 Password Reset
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset-password/<str:uidb64>/<str:token>/', ResetPasswordView.as_view(), name='reset-password'),

    # 👤 User APIs
    path('profile/', get_profile, name='get-profile'),  # OR UserProfileView.as_view()
    path('update_user/', update_user, name='update-user'),
    path('', users_list, name='users-list'),  # OR UserListView.as_view()
    path('get_user_by_email/<str:email>/', get_user_by_email, name='get-user-by-email'),

    # 👨‍🔬 Researcher APIs
    path('researchers/add/', researcher_add, name='researcher-add'),        # ✅ UPAR
    path('researchers/', researcher_list, name='researcher-list'),
    path('researchers/<int:pk>/', researcher_list, name='researcher-detail'),
    path('add-field/', add_field, name='add-field'),
    path('fields/', get_fields, name='get-fields'),
    path('soil-health/', soil_health_api),
    path('predict/', predict),
    path('weather/', weather_api)
]