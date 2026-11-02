from django.contrib import admin
from .models import Trilha

@admin.register(Trilha)
class TrilhaAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'user', 'criado_em')
    search_fields = ('titulo', 'user__username')
    list_filter = ('criado_em',)
