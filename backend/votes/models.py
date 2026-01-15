"""
Vote models for the voting platform.
"""
from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from users.models import User


class Vote(models.Model):
    """
    Vote model representing a user's vote for a candidate.
    Uses OneToOneField to enforce one vote per user.
    """
    id = models.AutoField(primary_key=True)
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='vote',
        help_text="One vote per user (enforced by OneToOneField)"
    )
    candidate = models.ForeignKey(
        'candidates.Candidate',
        on_delete=models.CASCADE,
        related_name='votes'
    )
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'votes'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.name} voted for {self.candidate.name}"
    
    def clean(self):
        """Validate that user hasn't already voted."""
        if self.user.has_voted:
            raise ValidationError('User has already voted.')
    
    def save(self, *args, **kwargs):
        """Override save to update user's has_voted flag."""
        self.full_clean()
        super().save(*args, **kwargs)
        # Update user's has_voted flag
        self.user.has_voted = True
        self.user.save(update_fields=['has_voted'])

