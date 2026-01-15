"""
Views for user authentication and management.
"""
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.utils import timezone
from social_django.utils import psa
from .serializers import (
    UserSerializer,
    SignupSerializer,
    LoginSerializer,
    ForgotPasswordSerializer,
    OAuthSerializer
)

User = get_user_model()


def get_tokens_for_user(user):
    """Generate JWT tokens for a user."""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    """User registration endpoint."""
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': tokens
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """User login endpoint."""
    serializer = LoginSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        user = serializer.validated_data['user']
        tokens = get_tokens_for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': tokens
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    """Forgot password endpoint (placeholder - implement email sending)."""
    serializer = ForgotPasswordSerializer(data=request.data)
    if serializer.is_valid():
        # TODO: Send password reset email
        return Response({
            'message': 'Password reset email sent (not implemented in this demo)'
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """Get current authenticated user."""
    serializer = UserSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
@psa('social:complete')
def google_oauth(request, backend):
    """Google OAuth authentication endpoint."""
    try:
        user = request.backend.do_auth(request.data.get('access_token'))
        if user and user.is_active:
            # Update or create user
            user.auth_provider = 'google'
            if not user.linkedin_url:
                # Try to get LinkedIn URL from Google profile if available
                pass
            user.save()
            
            tokens = get_tokens_for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'tokens': tokens
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'Authentication failed'},
                status=status.HTTP_400_BAD_REQUEST
            )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([AllowAny])
@psa('social:complete')
def linkedin_oauth(request, backend):
    """LinkedIn OAuth authentication endpoint."""
    try:
        user = request.backend.do_auth(request.data.get('access_token'))
        if user and user.is_active:
            # Update user with LinkedIn info
            user.auth_provider = 'linkedin'
            # Extract LinkedIn URL from social auth extra data
            social = user.social_auth.get(provider='linkedin')
            if social and social.extra_data:
                linkedin_id = social.extra_data.get('id')
                if linkedin_id:
                    user.linkedin_url = f"https://www.linkedin.com/in/{linkedin_id}/"
            user.save()
            
            tokens = get_tokens_for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'tokens': tokens
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'Authentication failed'},
                status=status.HTTP_400_BAD_REQUEST
            )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


# Alternative OAuth implementation using access token directly
@api_view(['POST'])
@permission_classes([AllowAny])
def google_oauth_simple(request):
    """
    Google OAuth endpoint.
    Frontend should send the credential (ID token) from Google OAuth flow.
    """
    import logging
    from google.oauth2 import id_token
    from google.auth.transport import requests as google_requests
    from django.conf import settings
    
    logger = logging.getLogger(__name__)
    
    credential = request.data.get('credential')
    if not credential:
        return Response(
            {'error': 'credential is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        logger.info(f"Google OAuth attempt - Client ID configured: {bool(settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY)}")
        
        # Verify the token with clock skew tolerance
        idinfo = id_token.verify_oauth2_token(
            credential, 
            google_requests.Request(), 
            settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY,
            clock_skew_in_seconds=300  # Allow 5 minutes tolerance
        )
        
        # Get user info from the token
        email = idinfo.get('email')
        name = idinfo.get('name', '')
        
        logger.info(f"Google OAuth successful - Email: {email}, Name: {name}")
        
        if not email:
            return Response(
                {'error': 'Email not found in Google profile'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get or create user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'name': name or email.split('@')[0],
                'auth_provider': 'google',
            }
        )
        
        if not created:
            # Update existing user
            user.name = name or user.name
            user.auth_provider = 'google'
            user.save()
        
        tokens = get_tokens_for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': tokens
        }, status=status.HTTP_200_OK)
        
    except ValueError as ve:
        # Token validation error
        logger.error(f"Google OAuth token validation error: {str(ve)}")
        return Response(
            {'error': f'Invalid Google token: {str(ve)}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.error(f"Google OAuth error: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def linkedin_oauth_simple(request):
    """
    Simplified LinkedIn OAuth endpoint.
    Frontend should send the access_token from LinkedIn OAuth flow.
    Note: This uses LinkedIn OpenID Connect userinfo endpoint.
    """
    access_token = request.data.get('access_token')
    if not access_token:
        return Response(
            {'error': 'access_token is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        import requests
        
        # Get user profile from LinkedIn OpenID Connect userinfo endpoint
        # This requires OpenID Connect product to be enabled in LinkedIn app
        profile_url = 'https://api.linkedin.com/v2/userinfo'
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(profile_url, headers=headers)
        
        if response.status_code != 200:
            # Fallback: try to get basic profile info
            try:
                # Alternative: use legacy profile endpoint (requires different scopes)
                profile_url_legacy = 'https://api.linkedin.com/v2/me'
                response_legacy = requests.get(profile_url_legacy, headers=headers)
                if response_legacy.status_code == 200:
                    user_data = response_legacy.json()
                    # Extract name from firstName and lastName
                    first_name = user_data.get('firstName', {}).get('localized', {}).get('en_US', '')
                    last_name = user_data.get('lastName', {}).get('localized', {}).get('en_US', '')
                    name = f"{first_name} {last_name}".strip()
                    linkedin_id = user_data.get('id', '')
                    
                    # For email, we'd need emailAddress endpoint with proper scope
                    # For now, use a placeholder or require email in request
                    email = request.data.get('email')
                    if not email:
                        return Response(
                            {'error': 'Email is required. Please provide email in request.'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    
                    # Get or create user
                    user, created = User.objects.get_or_create(
                        email=email,
                        defaults={
                            'name': name or email.split('@')[0],
                            'auth_provider': 'linkedin',
                            'linkedin_url': f"https://www.linkedin.com/in/{linkedin_id}/" if linkedin_id else '',
                        }
                    )
                    
                    if not created:
                        user.name = name or user.name
                        user.auth_provider = 'linkedin'
                        if linkedin_id and not user.linkedin_url:
                            user.linkedin_url = f"https://www.linkedin.com/in/{linkedin_id}/"
                        user.save()
                    
                    tokens = get_tokens_for_user(user)
                    return Response({
                        'user': UserSerializer(user).data,
                        'tokens': tokens
                    }, status=status.HTTP_200_OK)
            except:
                pass
            
            return Response(
                {'error': f'Invalid access token. Status: {response.status_code}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user_data = response.json()
        email = user_data.get('email')
        name = user_data.get('name', '')
        linkedin_id = user_data.get('sub', '')
        
        if not email:
            return Response(
                {'error': 'Email not found in LinkedIn profile'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get or create user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'name': name or email.split('@')[0],
                'auth_provider': 'linkedin',
                'linkedin_url': f"https://www.linkedin.com/in/{linkedin_id}/" if linkedin_id else '',
            }
        )
        
        if not created:
            # Update existing user
            user.name = name or user.name
            user.auth_provider = 'linkedin'
            if linkedin_id and not user.linkedin_url:
                user.linkedin_url = f"https://www.linkedin.com/in/{linkedin_id}/"
            user.save()
        
        tokens = get_tokens_for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': tokens
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

