from django.contrib import admin
from .models import DirectMessage, MessagePurgeLog

@admin.register(DirectMessage)
class DirectMessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'receiver', 'content_snippet', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('sender__username', 'receiver__username', 'content')
    readonly_fields = ('sender', 'receiver', 'content', 'created_at', 'read_at')

    def content_snippet(self, obj):
        return obj.content[:50] + ('...' if len(obj.content) > 50 else '')
    content_snippet.short_description = 'Mensagem'


@admin.register(MessagePurgeLog)
class MessagePurgeLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'purged_at', 'squad_messages_deleted', 'direct_messages_deleted', 'total_deleted', 'triggered_by')
    list_filter = ('triggered_by', 'purged_at')
    readonly_fields = ('purged_at', 'squad_messages_deleted', 'direct_messages_deleted', 'triggered_by', 'details')

    def total_deleted(self, obj):
        return obj.squad_messages_deleted + obj.direct_messages_deleted
    total_deleted.short_description = 'Total Excluído'
