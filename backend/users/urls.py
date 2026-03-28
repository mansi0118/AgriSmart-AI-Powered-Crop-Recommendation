from . import views
from django.urls import path
from .views import SignupView, LoginView   # 👈 ye line MOST IMPORTANT

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path("researcher/<int:user_id>/", views.get_data),
    path("researcher/add/", views.add_data),
    path("update_user/", views.update_user),
]
