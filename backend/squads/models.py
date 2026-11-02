from django.db import models
from django.conf import settings

class Squad(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    leader = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='led_squads')
    needed_skills = models.JSONField(default=list, blank=True)
    available_shifts = models.CharField(max_length=100, default='Noite')
    max_members = models.IntegerField(default=10)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='squads', blank=True)
    related_material = models.ForeignKey('repository.Material', on_delete=models.SET_NULL, null=True, blank=True, related_name='discussion_groups')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title

class SquadMessage(models.Model):
    squad = models.ForeignKey(Squad, on_delete=models.CASCADE, related_name='messages')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='squad_messages')
    channel = models.CharField(max_length=50, default='geral')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"[{self.squad.title}][{self.channel}] {self.author.username}: {self.content[:30]}"

class SquadExpulsionLog(models.Model):
    squad = models.ForeignKey(Squad, on_delete=models.CASCADE, related_name='expulsion_logs')
    expelled_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='expulsions_received')
    expelled_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='expulsions_given')
    reason = models.TextField(help_text="Motivo detalhado da expulsão para fins de auditoria administrativa.")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Expulsão de {self.expelled_user.username} da guilda {self.squad.title} por {self.expelled_by.username}"
