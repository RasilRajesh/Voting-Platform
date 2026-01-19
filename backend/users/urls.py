"""
URL configuration for users app.
"""
from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('verify-email/', views.verify_email, name='verify-email'),
    path('forgot-password/', views.forgot_password, name='forgot-password'),
    path('reset-password/', views.reset_password, name='reset-password'),
    path('me/', views.get_current_user, name='current-user'),
    path('google/', views.google_oauth_simple, name='google-oauth'),
    path('linkedin/', views.linkedin_oauth_simple, name='linkedin-oauth'),
    path('', views.list_users, name='list-users'),
]

