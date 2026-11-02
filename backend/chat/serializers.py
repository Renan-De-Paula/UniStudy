from rest_framework import serializers
from .models import DirectMessage
from django.contrib.auth import get_user_model

User = get_user_model()

class DirectMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    sender_username = serializers.ReadOnlyField(source='sender.username')
    sender_avatar = serializers.SerializerMethodField()
    
    receiver_name = serializers.SerializerMethodField()
    receiver_username = serializers.ReadOnlyField(source='receiver.username')
    receiver_avatar = serializers.SerializerMethodField()
    
    is_mine = serializers.SerializerMethodField()

    class Meta:
        model = DirectMessage
        fields = (
            'id', 'sender', 'sender_name', 'sender_username', 'sender_avatar',
            'receiver', 'receiver_name', 'receiver_username', 'receiver_avatar',
            'content', 'is_read', 'read_at', 'created_at', 'is_mine'
        )
        read_only_fields = ('id', 'sender', 'is_read', 'read_at', 'created_at')

    def get_sender_name(self, obj):
        full = f"{obj.sender.first_name} {obj.sender.last_name}".strip()
        return full if full else obj.sender.username

    def get_sender_avatar(self, obj):
        return obj.sender.avatar or f"https://api.dicebear.com/7.x/adventurer/svg?seed={obj.sender.username}"

    def get_receiver_name(self, obj):
        full = f"{obj.receiver.first_name} {obj.receiver.last_name}".strip()
        return full if full else obj.receiver.username

    def get_receiver_avatar(self, obj):
        return obj.receiver.avatar or f"https://api.dicebear.com/7.x/adventurer/svg?seed={obj.receiver.username}"

    def get_is_mine(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.sender == request.user
        return False
