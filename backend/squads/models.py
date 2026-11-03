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


class SquadMembership(models.Model):
    """
    Níveis hierárquicos e papéis dos integrantes dentro de uma Guilda de Estudos.
    O criador da guilda é o único Líder Supremo imutável.
    O Líder Supremo pode nomear Sub-Líderes, Orientadores, Veteranos e Membros,
    cada um com permissões e benefícios acadêmicos padronizados.
    """
    ROLE_CHOICES = [
        ('LEADER', 'Líder Supremo'),
        ('SUB_LEADER', 'Sub-Líder'),
        ('MENTOR', 'Orientador'),
        ('VETERAN', 'Veterano'),
        ('MEMBER', 'Membro'),
    ]

    ROLE_BENEFITS = {
        'LEADER': {
            'title': 'Líder Supremo',
            'badge': '👑 Líder Supremo',
            'color': 'amber',
            'xp_bonus_percent': 25,
            'can_manage_roles': True,
            'can_invite': True,
            'can_moderate_chat': True,
            'can_expel': True,
            'description': 'Fundador e autoridade máxima da guilda. +25% de XP e gestão irrestrita.'
        },
        'SUB_LEADER': {
            'title': 'Sub-Líder',
            'badge': '⚔️ Sub-Líder',
            'color': 'purple',
            'xp_bonus_percent': 15,
            'can_manage_roles': False,
            'can_invite': True,
            'can_moderate_chat': True,
            'can_expel': False,
            'description': 'Braço direito do líder. Modera chat, convida alunos e recebe +15% de XP em grupo.'
        },
        'MENTOR': {
            'title': 'Orientador',
            'badge': '🧠 Orientador',
            'color': 'cyan',
            'xp_bonus_percent': 10,
            'can_manage_roles': False,
            'can_invite': False,
            'can_moderate_chat': False,
            'can_expel': False,
            'description': 'Tutor e mentor acadêmico. +10% de XP em estudos e destaque oficial nas dúvidas.'
        },
        'VETERAN': {
            'title': 'Veterano',
            'badge': '⭐ Veterano',
            'color': 'yellow',
            'xp_bonus_percent': 10,
            'can_manage_roles': False,
            'can_invite': False,
            'can_moderate_chat': False,
            'can_expel': False,
            'description': 'Membro com destaque e tempo de casa. +10% de XP nas sessões Pomodoro.'
        },
        'MEMBER': {
            'title': 'Membro',
            'badge': '🌱 Membro',
            'color': 'emerald',
            'xp_bonus_percent': 5,
            'can_manage_roles': False,
            'can_invite': False,
            'can_moderate_chat': False,
            'can_expel': False,
            'description': 'Membro ativo da guilda. +5% de bônus de XP base em estudos coletivos.'
        }
    }

    squad = models.ForeignKey(Squad, on_delete=models.CASCADE, related_name='memberships')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='squad_memberships')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='MEMBER')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('squad', 'user')
        ordering = ['joined_at']

    def __str__(self):
        return f"{self.user.username} ({self.get_role_display()}) em {self.squad.title}"
