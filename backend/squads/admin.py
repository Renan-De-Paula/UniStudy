from django.contrib import admin
from .models import Squad, SquadMessage

@admin.register(Squad)
class SquadAdmin(admin.ModelAdmin):
    list_display = ('title', 'leader', 'available_shifts', 'max_members', 'is_active', 'created_at')
    list_filter = ('is_active', 'available_shifts', 'created_at')
    search_fields = ('title', 'description', 'leader__username')

@admin.register(SquadMessage)
class SquadMessageAdmin(admin.ModelAdmin):
    list_display = ('squad', 'author', 'channel', 'created_at')
    list_filter = ('channel', 'created_at')
    search_fields = ('squad__title', 'author__username', 'content')
