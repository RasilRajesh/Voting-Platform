"""
Views for Candidate model.
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db.models import Count
from .models import Candidate
from .serializers import CandidateSerializer
from votes.models import Vote


@api_view(['GET'])
@permission_classes([AllowAny])
def candidate_list(request):
    """
    Get list of all candidates with vote counts.
    Should return exactly 2 candidates (one per team).
    """
    candidates = Candidate.objects.annotate(
        vote_count=Count('votes')
    ).all()
    serializer = CandidateSerializer(candidates, many=True, context={'request': request})
    
    # Add vote count to response
    data = serializer.data
    for i, candidate in enumerate(candidates):
        data[i]['vote_count'] = candidate.vote_count
    
    return Response(data, status=status.HTTP_200_OK)

