from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Trilha(models.Model):
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='trilhas'
    )
    titulo = models.CharField(max_length=200)
    conteudo_gerado = models.JSONField(
        help_text="Armazena o JSON completo gerado pela IA contendo os módulos e tópicos."
    )
    topicos_concluidos = models.JSONField(default=list, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.titulo} ({self.user.username})"
