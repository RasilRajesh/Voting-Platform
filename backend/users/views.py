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
from django.core.mail import send_mail
from django.conf import settings
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
    """Forgot password endpoint - sends reset email with token."""
    serializer = ForgotPasswordSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        try:
            user = User.objects.get(email=email)
            
            # Only allow password reset for local auth users
            if user.auth_provider != 'local':
                return Response({
                    'error': f'This account uses {user.auth_provider} authentication. Please use {user.auth_provider} to sign in.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Generate reset token
            token = user.generate_reset_token()
            
            # Build reset URL
            frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
            reset_url = f"{frontend_url}/reset-password?token={token}"
            
            # Send email
            subject = 'Password Reset Request - Voting Platform'
            message = f"""Hello {user.name},

You requested to reset your password for the Voting Platform.

Click the link below to reset your password:
{reset_url}

This link will expire in 1 hour.

If you didn't request this, please ignore this email.

Best regards,
Voting Platform Team
"""
            
            try:
                send_mail(
                    subject,
                    message,
                    settings.EMAIL_HOST_USER,
                    [email],
                    fail_silently=False,
                )
                return Response({
                    'message': 'Password reset email sent successfully! Please check your inbox.'
                }, status=status.HTTP_200_OK)
            except Exception as e:
                # For development, return the token in response if email fails
                if settings.DEBUG:
                    return Response({
                        'message': 'Email sending failed (dev mode). Use this token:',
                        'reset_url': reset_url,
                        'token': token
                    }, status=status.HTTP_200_OK)
                return Response({
                    'error': 'Failed to send email. Please try again later.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except User.DoesNotExist:
            # Don't reveal that user doesn't exist
            return Response({
                'message': 'If an account exists with this email, a password reset link has been sent.'
            }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    """Reset password with token."""
    serializer = ResetPasswordSerializer(data=request.data)
    if serializer.is_valid():
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['password']
        
        try:
            # Find user with this token
            user = User.objects.get(reset_token=token)
            
            # Validate token
            if not user.is_reset_token_valid(token):
                return Response({
                    'error': 'Invalid or expired reset token. Please request a new password reset.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Set new password
            user.set_password(new_password)
            user.clear_reset_token()
            
            return Response({
                'message': 'Password reset successful! You can now login with your new password.'
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({
                'error': 'Invalid reset token.'
            }, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    """Reset password using token."""
    from .serializers import ResetPasswordSerializer
    from datetime import timedelta
    
    serializer = ResetPasswordSerializer(data=request.data)
    if serializer.is_valid():
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']
        
        try:
            user = User.objects.get(reset_token=token)
            
            # Check if token is expired (1 hour expiry)
            if user.reset_token_created_at:
                token_age = timezone.now() - user.reset_token_created_at
                if token_age > timedelta(hours=1):
                    return Response({
                        'error': 'Reset token has expired. Please request a new one.'
                    }, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({
                    'error': 'Invalid reset token.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Reset password
            user.set_password(new_password)
            user.reset_token = None
            user.reset_token_created_at = None
            user.save()
            
            return Response({
                'message': 'Password reset successfully. You can now login with your new password.'
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({
                'error': 'Invalid reset token.'
            }, status=status.HTTP_400_BAD_REQUEST)
    
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
    Frontend can send either credential (ID token) or access_token from Google OAuth flow.
    """
    import logging
    import requests as http_requests
    from google.oauth2 import id_token
    from google.auth.transport import requests as google_requests
    from django.conf import settings
    
    logger = logging.getLogger(__name__)
    
    credential = request.data.get('credential')
    access_token = request.data.get('access_token')
    
    if not credential and not access_token:
        return Response(
            {'error': 'credential or access_token is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        logger.info(f"Google OAuth attempt - Client ID configured: {bool(settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY)}")
        
        # Handle access_token (from useGoogleLogin hook)
        if access_token:
            logger.info("Using access_token to fetch user info")
            userinfo_response = http_requests.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                headers={'Authorization': f'Bearer {access_token}'}
            )
            
            if userinfo_response.status_code != 200:
                return Response(
                    {'error': 'Failed to fetch user info from Google'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            idinfo = userinfo_response.json()
            email = idinfo.get('email')
            name = idinfo.get('name', '')
        else:
            # Handle credential (ID token from GoogleLogin component)
            logger.info("Using credential ID token")
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
    LinkedIn OAuth endpoint.
    Frontend can send either:
    - 'code' + 'redirect_uri' (authorization code flow)
    - 'access_token' (implicit flow)
    """
    import requests
    from django.conf import settings
    import logging
    
    logger = logging.getLogger(__name__)
    
    code = request.data.get('code')
    redirect_uri = request.data.get('redirect_uri')
    access_token = request.data.get('access_token')
    
    logger.info(f"LinkedIn OAuth - code: {code[:10] if code else None}, redirect_uri: {redirect_uri}")
    
    # If code is provided, exchange it for access token
    if code and redirect_uri:
        try:
            token_url = 'https://www.linkedin.com/oauth/v2/accessToken'
            token_data = {
                'grant_type': 'authorization_code',
                'code': code,
                'redirect_uri': redirect_uri,
                'client_id': settings.SOCIAL_AUTH_LINKEDIN_OAUTH2_KEY,
                'client_secret': settings.SOCIAL_AUTH_LINKEDIN_OAUTH2_SECRET,
            }
            
            logger.info(f"Exchanging code for token with client_id: {settings.SOCIAL_AUTH_LINKEDIN_OAUTH2_KEY}")
            token_response = requests.post(token_url, data=token_data)
            
            logger.info(f"Token response status: {token_response.status_code}")
            logger.info(f"Token response: {token_response.text}")
            
            if token_response.status_code != 200:
                error_msg = f'Failed to exchange code for token. Status: {token_response.status_code}, Response: {token_response.text}'
                logger.error(error_msg)
                return Response(
                    {'error': error_msg},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            access_token = token_response.json().get('access_token')
            logger.info(f"Got access token: {access_token[:10] if access_token else None}...")
        except Exception as e:
            error_msg = f'Token exchange failed: {str(e)}'
            logger.error(error_msg)
            return Response(
                {'error': error_msg},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    if not access_token:
        error_msg = 'Either code+redirect_uri or access_token is required'
        logger.error(error_msg)
        return Response(
            {'error': error_msg},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Get user profile from LinkedIn OpenID Connect userinfo endpoint
        profile_url = 'https://api.linkedin.com/v2/userinfo'
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(profile_url, headers=headers)
        
        if response.status_code != 200:
            return Response(
                {'error': f'Invalid access token. Status: {response.status_code}, Response: {response.text}'},
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_users(request):
    """List all users - admin only for full access."""
    if not request.user.is_staff:
        return Response(
            {'error': 'Admin privileges required'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    users = User.objects.all().order_by('-created_at')
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

