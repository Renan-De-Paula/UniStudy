from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class DirectMessage(models.Model):
    sender = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='sent_direct_messages',
        verbose_name='Remetente'
    )
    receiver = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='received_direct_messages',
        verbose_name='Destinatário'
    )
    content = models.TextField(verbose_name='Conteúdo da Mensagem')
    is_read = models.BooleanField(default=False, verbose_name='Lida?')
    read_at = models.DateTimeField(null=True, blank=True, verbose_name='Lida em')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Enviada em')

    class Meta:
        verbose_name = 'Mensagem Privada'
        verbose_name_plural = 'Mensagens Privadas'
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['sender', 'receiver', 'created_at']),
            models.Index(fields=['receiver', 'is_read']),
        ]

    def __str__(self):
        return f"{self.sender.username} -> {self.receiver.username} ({self.created_at.strftime('%d/%m/%Y %H:%M')})"
