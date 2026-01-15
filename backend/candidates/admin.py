"""
Admin configuration for candidates app.
"""
from django.contrib import admin
from .models import Candidate


@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    """Admin interface for Candidate model."""
    list_display = ['name', 'team_id', 'linkedin_url', 'created_at']
    list_filter = ['team_id', 'created_at']
    search_fields = ['name']
    ordering = ['team_id', 'name']

