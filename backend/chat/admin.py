from django.contrib import admin
from .models import DirectMessage

@admin.register(DirectMessage)
class DirectMessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'receiver', 'content_snippet', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('sender__username', 'receiver__username', 'content')
    readonly_fields = ('sender', 'receiver', 'content', 'created_at', 'read_at')

    def content_snippet(self, obj):
        return obj.content[:50] + ('...' if len(obj.content) > 50 else '')
    content_snippet.short_description = 'Mensagem'
