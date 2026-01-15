"""
Serializers for Candidate model.
"""
from rest_framework import serializers
from .models import Candidate


class CandidateSerializer(serializers.ModelSerializer):
    """Serializer for Candidate model."""
    profile_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Candidate
        fields = ['id', 'name', 'profile_image', 'profile_image_url', 'linkedin_url', 'team_id', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_profile_image_url(self, obj):
        """Get full URL for profile image."""
        if obj.profile_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_image.url)
        return None

