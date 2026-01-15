"""
Serializers for Vote model.
"""
from rest_framework import serializers
from .models import Vote
from candidates.serializers import CandidateSerializer
from users.serializers import UserSerializer


class VoteSerializer(serializers.ModelSerializer):
    """Serializer for Vote model."""
    candidate = CandidateSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    candidate_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Vote
        fields = ['id', 'user', 'candidate', 'candidate_id', 'created_at']
        read_only_fields = ['id', 'user', 'candidate', 'created_at']


class VoterSerializer(serializers.Serializer):
    """Serializer for voters list display."""
    id = serializers.UUIDField()
    name = serializers.CharField()
    linkedin_url = serializers.URLField(allow_blank=True, allow_null=True)
    voted_at = serializers.DateTimeField()

