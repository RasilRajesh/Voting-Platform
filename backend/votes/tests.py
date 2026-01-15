"""
Tests for votes app.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from candidates.models import Candidate
from .models import Vote

User = get_user_model()


class VoteModelTest(TestCase):
    """Test Vote model."""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            name='Test User'
        )
        self.candidate = Candidate.objects.create(
            name='Test Candidate',
            linkedin_url='https://www.linkedin.com/in/test/',
            team_id=1
        )
    
    def test_create_vote(self):
        """Test creating a vote."""
        vote = Vote.objects.create(
            user=self.user,
            candidate=self.candidate
        )
        self.assertEqual(vote.user, self.user)
        self.assertEqual(vote.candidate, self.candidate)
        self.assertTrue(self.user.has_voted)
    
    def test_one_vote_per_user(self):
        """Test that OneToOneField enforces one vote per user."""
        Vote.objects.create(user=self.user, candidate=self.candidate)
        
        # Try to create another vote for the same user
        candidate2 = Candidate.objects.create(
            name='Candidate 2',
            linkedin_url='https://www.linkedin.com/in/test2/',
            team_id=2
        )
        
        with self.assertRaises(Exception):
            Vote.objects.create(user=self.user, candidate=candidate2)


class VoteAPITest(TestCase):
    """Test Vote API endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            name='Test User'
        )
        self.candidate = Candidate.objects.create(
            name='Test Candidate',
            linkedin_url='https://www.linkedin.com/in/test/',
            team_id=1
        )
    
    def test_create_vote_authenticated(self):
        """Test creating a vote when authenticated."""
        self.client.force_authenticate(user=self.user)
        response = self.client.post(f'/api/votes/{self.candidate.id}/')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Vote.objects.filter(user=self.user).exists())
    
    def test_create_vote_unauthenticated(self):
        """Test that unauthenticated users cannot vote."""
        response = self.client.post(f'/api/votes/{self.candidate.id}/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_double_vote_prevention(self):
        """Test that users cannot vote twice."""
        self.client.force_authenticate(user=self.user)
        
        # First vote
        response1 = self.client.post(f'/api/votes/{self.candidate.id}/')
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)
        
        # Second vote attempt
        candidate2 = Candidate.objects.create(
            name='Candidate 2',
            linkedin_url='https://www.linkedin.com/in/test2/',
            team_id=2
        )
        response2 = self.client.post(f'/api/votes/{candidate2.id}/')
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_get_voters_list(self):
        """Test getting voters list."""
        self.client.force_authenticate(user=self.user)
        Vote.objects.create(user=self.user, candidate=self.candidate)
        
        response = self.client.get('/api/votes/voters/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

