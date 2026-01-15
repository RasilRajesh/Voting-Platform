"""
URL configuration for candidates app.
"""
from django.urls import path
from . import views

urlpatterns = [
    path('', views.candidate_list, name='candidate-list'),
]

