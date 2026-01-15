"""
Candidate models for the voting platform.
"""
from django.db import models
from django.utils import timezone


class Candidate(models.Model):
    """
    Candidate model representing a person running for election.
    Each candidate belongs to a team (team_id).
    """
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True, help_text="Brief description of the candidate")
    profile_image = models.ImageField(upload_to='candidates/', blank=True, null=True)
    linkedin_url = models.URLField(max_length=500)
    team_id = models.IntegerField(help_text="Team identifier (1 or 2)")
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'candidates'
        ordering = ['team_id', 'name']
    
    def __str__(self):
        return f"{self.name} (Team {self.team_id})"

