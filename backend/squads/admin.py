from django.contrib import admin
from .models import Squad, SquadMessage, SquadExpulsionLog

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

@admin.register(SquadExpulsionLog)
class SquadExpulsionLogAdmin(admin.ModelAdmin):
    list_display = ('squad', 'expelled_user', 'expelled_by', 'created_at')
    list_filter = ('created_at', 'squad')
    search_fields = ('squad__title', 'expelled_user__username', 'expelled_by__username', 'reason')
    readonly_fields = ('squad', 'expelled_user', 'expelled_by', 'reason', 'created_at')
