from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Badge(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon_url = models.URLField(blank=True, null=True, help_text="URL para o ícone do selo/badge")
    icon_emoji = models.CharField(max_length=20, blank=True, default='🏆', help_text="Emoji do selo")
    quiz = models.ForeignKey('Quiz', on_delete=models.CASCADE, null=True, blank=True, related_name='badges')
    badge_tier = models.CharField(max_length=20, blank=True, default='', help_text="BRONZE, PRATA, OURO ou padrão")
    xp_required = models.IntegerField(default=0, help_text="XP mínimo para desbloquear")
    is_secret = models.BooleanField(default=False, help_text="Se verdadeiro, não aparece até ser desbloqueado")
    
    def __str__(self):
        return self.name

class UserBadge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    date_earned = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'badge')

    def __str__(self):
        return f"{self.user.username} - {self.badge.name}"

class StoreItem(models.Model):
    class ItemType(models.TextChoices):
        AVATAR_FRAME = 'AVATAR_FRAME', 'Moldura de Avatar'
        THEME_COLOR = 'THEME_COLOR', 'Cor de Tema'
        PROFILE_BADGE = 'PROFILE_BADGE', 'Selo de Perfil'
        PREMIUM_CONTENT = 'PREMIUM_CONTENT', 'Conteúdo Premium'

    name = models.CharField(max_length=100)
    description = models.TextField()
    item_type = models.CharField(max_length=20, choices=ItemType.choices)
    cost_xp = models.IntegerField(help_text="Custo em XP")
    asset_url = models.URLField(blank=True, null=True, help_text="URL da imagem ou código do recurso")

    def __str__(self):
        return f"{self.name} ({self.cost_xp} XP)"

class UserPurchase(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='purchases')
    item = models.ForeignKey(StoreItem, on_delete=models.CASCADE)
    purchased_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True, help_text="Se o usuário está usando isso atualmente")

    def __str__(self):
        return f"{self.user.username} comprou {self.item.name}"

class Quiz(models.Model):
    class Difficulty(models.TextChoices):
        EASY = 'Iniciante', 'Iniciante'
        MEDIUM = 'Intermediário', 'Intermediário'
        HARD = 'Avançado', 'Avançado'

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    category = models.CharField(max_length=100, default='Geral')
    difficulty = models.CharField(max_length=20, choices=Difficulty.choices, default=Difficulty.EASY)
    xp_reward = models.IntegerField(default=150, help_text="XP concedido ao concluir com sucesso")
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_quizzes')
    questions = models.JSONField(default=list, help_text="Lista de perguntas com texto, opções e índice correto")
    badge_emoji = models.CharField(max_length=20, default='🏆', help_text="Emoji principal do selo do quiz")
    badge_title = models.CharField(max_length=150, blank=True, default='', help_text="Nome da conquista do selo")
    badge_description = models.TextField(blank=True, default='', help_text="Descrição da conquista do selo")
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Quiz / Desafio'
        verbose_name_plural = 'Quizzes & Desafios'

    def __str__(self):
        return f"{self.title} ({self.difficulty}) - {self.creator.username}"

class QuizSubmission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quiz_submissions')
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='submissions')
    score = models.IntegerField(default=0)
    total_questions = models.IntegerField(default=0)
    xp_earned = models.IntegerField(default=0)
    badge_earned = models.ForeignKey(Badge, on_delete=models.SET_NULL, null=True, blank=True, related_name='quiz_submissions')
    badge_tier = models.CharField(max_length=20, blank=True, default='', help_text="BRONZE, PRATA, OURO ou vazio")
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-completed_at']
        verbose_name = 'Tentativa de Quiz'
        verbose_name_plural = 'Tentativas de Quiz'

    def __str__(self):
        return f"{self.user.username} - {self.quiz.title} ({self.score}/{self.total_questions})"
