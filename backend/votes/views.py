"""
Views for Vote model.
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from django.db import IntegrityError
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from .models import Vote
from .serializers import VoteSerializer, VoterSerializer
from candidates.models import Candidate


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_vote(request, candidate_id):
    """
    Create a vote for a candidate.
    Enforces one vote per user using OneToOneField.
    """
    user = request.user
    
    # Check if user has already voted
    if user.has_voted:
        return Response(
            {'error': 'You have already voted. Each user can vote only once.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if vote already exists (shouldn't happen due to OneToOneField, but check anyway)
    if hasattr(user, 'vote'):
        return Response(
            {'error': 'You have already voted. Each user can vote only once.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Validate candidate exists
    try:
        candidate = Candidate.objects.get(id=candidate_id)
    except Candidate.DoesNotExist:
        return Response(
            {'error': 'Candidate not found.'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Create vote
    try:
        vote = Vote.objects.create(user=user, candidate=candidate)
        serializer = VoteSerializer(vote)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except IntegrityError:
        return Response(
            {'error': 'You have already voted. Each user can vote only once.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def has_voted(request):
    """
    Check if the current user has already voted.
    """
    user = request.user
    has_voted = hasattr(user, 'vote') or user.has_voted
    return Response({'has_voted': has_voted}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def results(request):
    """
    ADMIN-ONLY: Get election results with vote counts for each candidate.
    Results are hidden from regular voters following real-world voting standards.
    """
    candidates = Candidate.objects.annotate(
        vote_count=Count('votes')
    ).order_by('-vote_count')
    
    results_data = []
    for candidate in candidates:
        results_data.append({
            'id': candidate.id,
            'name': candidate.name,
            'description': candidate.description or '',
            'vote_count': candidate.vote_count,
        })
    
    return Response(results_data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def voters_list(request):
    """
    Get list of all voters with their LinkedIn profiles.
    Public endpoint (authenticated users can view).
    """
    votes = Vote.objects.select_related('user', 'candidate').all()
    
    voters_data = []
    for vote in votes:
        voters_data.append({
            'id': vote.user.id,
            'name': vote.user.name,
            'linkedin_url': vote.user.linkedin_url or '',
            'voted_at': vote.created_at,
        })
    
    serializer = VoterSerializer(voters_data, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def vote_statistics(request):
    """
    Get voting statistics including vote counts, percentages, and trends.
    """
    total_votes = Vote.objects.count()
    
    # Get vote counts per candidate
    candidate_stats = Vote.objects.values('candidate__id', 'candidate__name').annotate(
        vote_count=Count('id')
    ).order_by('-vote_count')
    
    # Calculate percentages
    stats_data = []
    for stat in candidate_stats:
        percentage = (stat['vote_count'] / total_votes * 100) if total_votes > 0 else 0
        stats_data.append({
            'candidate_id': stat['candidate__id'],
            'candidate_name': stat['candidate__name'],
            'vote_count': stat['vote_count'],
            'percentage': round(percentage, 2),
        })
    
    # Get votes by time (last 24 hours, last week, etc.)
    now = timezone.now()
    last_24h = Vote.objects.filter(created_at__gte=now - timedelta(hours=24)).count()
    last_week = Vote.objects.filter(created_at__gte=now - timedelta(days=7)).count()
    
    # Get votes by auth provider
    votes_by_provider = Vote.objects.values('user__auth_provider').annotate(
        count=Count('id')
    )
    
    return Response({
        'total_votes': total_votes,
        'candidate_statistics': stats_data,
        'recent_votes': {
            'last_24_hours': last_24h,
            'last_7_days': last_week,
        },
        'votes_by_auth_provider': list(votes_by_provider),
    }, status=status.HTTP_200_OK)

