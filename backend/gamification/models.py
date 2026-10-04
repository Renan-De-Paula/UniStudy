from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Badge(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon_url = models.URLField(blank=True, null=True, help_text="URL para o ícone do selo/badge")
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
