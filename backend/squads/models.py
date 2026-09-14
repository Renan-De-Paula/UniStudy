from django.db import models
from django.conf import settings

class Squad(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    leader = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='led_squads')
    needed_skills = models.JSONField(default=list)
    available_shifts = models.CharField(max_length=100, default='Noite')
    max_members = models.IntegerField(default=4)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='squads', blank=True)
    related_material = models.ForeignKey('repository.Material', on_delete=models.SET_NULL, null=True, blank=True, related_name='discussion_groups')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    
    def __str__(self):
        return self.title
