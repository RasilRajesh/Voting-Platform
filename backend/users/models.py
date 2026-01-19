"""
User models for the voting platform.
"""
import uuid
import secrets
from datetime import timedelta
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
    """Custom user manager."""
    
    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular user."""
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """Create and save a superuser."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model with UUID primary key.
    Supports local authentication and OAuth (Google, LinkedIn).
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    linkedin_url = models.URLField(max_length=500, blank=True, null=True)
    auth_provider = models.CharField(
        max_length=20,
        choices=[
            ('google', 'Google'),
            ('linkedin', 'LinkedIn'),
            ('local', 'Local'),
        ],
        default='local'
    )
    has_voted = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    
    # Password reset fields
    reset_token = models.CharField(max_length=100, blank=True, null=True)
    reset_token_expires = models.DateTimeField(blank=True, null=True)
    
    # Email verification fields
    is_email_verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=100, blank=True, null=True)
    
    # Django admin fields
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']
    
    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.email})"
    
    def generate_verification_token(self):
        """Generate a secure email verification token."""
        self.verification_token = secrets.token_urlsafe(32)
        self.save()
        return self.verification_token
    
    def verify_email(self, token):
        """Verify email with the provided token."""
        if self.verification_token == token:
            self.is_email_verified = True
            self.verification_token = None
            self.save()
            return True
        return False
    
    def generate_reset_token(self):
        """Generate a secure password reset token."""
        self.reset_token = secrets.token_urlsafe(32)
        self.reset_token_expires = timezone.now() + timedelta(hours=1)
        self.save()
        return self.reset_token
    
    def is_reset_token_valid(self, token):
        """Check if the reset token is valid and not expired."""
        if not self.reset_token or not self.reset_token_expires:
            return False
        if self.reset_token != token:
            return False
        if timezone.now() > self.reset_token_expires:
            return False
        return True
    
    def clear_reset_token(self):
        """Clear the reset token after use."""
        self.reset_token = None
        self.reset_token_expires = None
        self.save()

