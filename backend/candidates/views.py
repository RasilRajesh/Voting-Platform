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
    Get list of all candidates WITHOUT vote counts.
    Vote counts are hidden from voters for election integrity.
    Should return exactly 2 candidates (one per team).
    """
    candidates = Candidate.objects.all()
    serializer = CandidateSerializer(candidates, many=True, context={'request': request})
    
    # DO NOT send vote counts to voters (real-world voting standard)
    return Response(serializer.data, status=status.HTTP_200_OK)

