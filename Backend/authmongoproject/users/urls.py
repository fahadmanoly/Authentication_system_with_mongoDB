from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView
from .views import *



urlpatterns = [
    path('register/', UserCreate.as_view(), name='user-register'),
    path('profile/', UserDetailView.as_view(), name='user-details'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout')
]