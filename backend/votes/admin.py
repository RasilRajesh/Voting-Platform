"""
Admin configuration for votes app.
"""
from django.contrib import admin
from .models import Vote


@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    """Admin interface for Vote model."""
    list_display = ['user', 'candidate', 'created_at']
    list_filter = ['created_at', 'candidate__team_id']
    search_fields = ['user__name', 'user__email', 'candidate__name']
    ordering = ['-created_at']
    readonly_fields = ['created_at']

