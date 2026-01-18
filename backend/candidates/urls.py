"""
URL configuration for candidates app.
"""
from django.urls import path
from . import views

urlpatterns = [
    path('', views.candidate_list, name='candidate-list'),
    path('create/', views.create_candidate, name='create-candidate'),
    path('<int:pk>/', views.update_candidate, name='update-candidate'),
    path('<int:pk>/delete/', views.delete_candidate, name='delete-candidate'),
]

