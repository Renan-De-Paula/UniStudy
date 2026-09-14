from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.crypto import get_random_string
from django.utils import timezone
from datetime import timedelta
import uuid

class UserRole(models.TextChoices):
    STUDENT = 'STUDENT', 'Estudante'
    PROFESSOR = 'PROFESSOR', 'Professor / Mestre'
    ADMIN = 'ADMIN', 'Administrador'

class User(AbstractUser):
    role = models.CharField(max_length=20, choices=UserRole.choices, default=UserRole.STUDENT)
    course = models.CharField(max_length=150, blank=True, null=True)
    semester = models.IntegerField(default=1, blank=True, null=True)
    xp = models.IntegerField(default=0)
    is_mentor = models.BooleanField(default=False)
    bio = models.TextField(blank=True, null=True)
    skills = models.JSONField(default=list, blank=True)
    is_email_verified = models.BooleanField(default=False)

class EmailVerificationToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='email_tokens')
    token = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = get_random_string(64)
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(hours=24)
        super().save(*args, **kwargs)

    def is_valid(self):
        return not self.is_used and timezone.now() <= self.expires_at

class FriendshipStatus(models.TextChoices):
    PENDING = 'PENDING', 'Pendente'
    ACCEPTED = 'ACCEPTED', 'Aceita'
    REJECTED = 'REJECTED', 'Recusada'

class Friendship(models.Model):
    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_requests')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_requests')
    status = models.CharField(max_length=20, choices=FriendshipStatus.choices, default=FriendshipStatus.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('requester', 'receiver')

    def __str__(self):
        return f"{self.requester.username} -> {self.receiver.username} ({self.status})"
