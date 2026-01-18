"""
Views for Candidate model.
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_candidate(request):
    """Create a new candidate - admin only."""
    if not request.user.is_staff:
        return Response(
            {'error': 'Admin privileges required'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = CandidateSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_candidate(request, pk):
    """Update a candidate - admin only."""
    if not request.user.is_staff:
        return Response(
            {'error': 'Admin privileges required'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        candidate = Candidate.objects.get(pk=pk)
    except Candidate.DoesNotExist:
        return Response(
            {'error': 'Candidate not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = CandidateSerializer(
        candidate, 
        data=request.data, 
        partial=request.method == 'PATCH',
        context={'request': request}
    )
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_candidate(request, pk):
    """Delete a candidate - admin only."""
    if not request.user.is_staff:
        return Response(
            {'error': 'Admin privileges required'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        candidate = Candidate.objects.get(pk=pk)
        candidate.delete()
        return Response(
            {'message': 'Candidate deleted successfully'},
            status=status.HTTP_200_OK
        )
    except Candidate.DoesNotExist:
        return Response(
            {'error': 'Candidate not found'},
            status=status.HTTP_404_NOT_FOUND
        )

