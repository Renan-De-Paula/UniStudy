from django.db import models
from django.conf import settings
from community.models import Discipline

class PrivacyOptions(models.TextChoices):
    PRIVATE = 'PRIVATE', 'Privado'
    FRIENDS = 'FRIENDS', 'Amigos'
    PUBLIC = 'PUBLIC', 'Público'

class Material(models.Model):
    title = models.CharField(max_length=200)
    discipline = models.ForeignKey(Discipline, on_delete=models.CASCADE)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    material_type = models.CharField(max_length=50, choices=[('SUMMARY', 'Resumo'), ('CODE', 'Código'), ('MAP', 'Mapa Mental'), ('HANDOUT', 'Apostila (Texto Rico)')])
    privacy = models.CharField(max_length=20, choices=PrivacyOptions.choices, default=PrivacyOptions.PRIVATE)
    link_or_file_url = models.URLField(blank=True, null=True)
    content_html = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} - {self.get_material_type_display()}"

class MaterialComment(models.Model):
    material = models.ForeignKey(Material, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Comment by {self.author.username} on {self.material.title}"
