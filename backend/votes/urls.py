"""
URL configuration for votes app.
"""
from django.urls import path
from . import views

urlpatterns = [
    path('', views.list_votes, name='list-votes'),
    path('<int:candidate_id>/', views.create_vote, name='create-vote'),
    path('has_voted/', views.has_voted, name='has-voted'),
    path('results/', views.results, name='results'),
    path('voters/', views.voters_list, name='voters-list'),
    path('statistics/', views.vote_statistics, name='vote-statistics'),
    path('reset/', views.reset_votes, name='reset-votes'),
]

