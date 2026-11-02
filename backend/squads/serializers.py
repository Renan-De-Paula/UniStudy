from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Squad, SquadMessage, SquadExpulsionLog

User = get_user_model()

class SquadMemberSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    level = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'name', 'avatar', 'role', 'level', 'xp', 'is_mentor')

    def get_name(self, obj):
        full = f"{obj.first_name} {obj.last_name}".strip()
        return full if full else obj.username

    def get_level(self, obj):
        return (obj.xp // 100) + 1

class SquadMessageSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_avatar = serializers.SerializerMethodField()
    author_role = serializers.ReadOnlyField(source='author.role')
    author_level = serializers.SerializerMethodField()
    can_delete = serializers.SerializerMethodField()

    class Meta:
        model = SquadMessage
        fields = (
            'id', 'squad', 'author', 'author_name', 'author_avatar', 
            'author_role', 'author_level', 'channel', 'content', 'can_delete', 'created_at'
        )
        read_only_fields = ('id', 'author', 'created_at')

    def get_author_name(self, obj):
        full = f"{obj.author.first_name} {obj.author.last_name}".strip()
        return full if full else obj.author.username

    def get_author_avatar(self, obj):
        return obj.author.avatar or f"https://api.dicebear.com/7.x/adventurer/svg?seed={obj.author.username}"

    def get_author_level(self, obj):
        return (obj.author.xp // 100) + 1

    def get_can_delete(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            user = request.user
            is_admin = getattr(user, 'role', '') == 'ADMIN' or user.is_staff or user.is_superuser
            is_leader = obj.squad.leader == user
            is_author = obj.author == user
            return is_author or is_leader or is_admin
        return False

class SquadExpulsionLogSerializer(serializers.ModelSerializer):
    expelled_user_name = serializers.SerializerMethodField()
    expelled_by_name = serializers.SerializerMethodField()

    class Meta:
        model = SquadExpulsionLog
        fields = (
            'id', 'squad', 'expelled_user', 'expelled_user_name', 
            'expelled_by', 'expelled_by_name', 'reason', 'created_at'
        )
        read_only_fields = ('id', 'created_at')

    def get_expelled_user_name(self, obj):
        full = f"{obj.expelled_user.first_name} {obj.expelled_user.last_name}".strip()
        return full if full else obj.expelled_user.username

    def get_expelled_by_name(self, obj):
        full = f"{obj.expelled_by.first_name} {obj.expelled_by.last_name}".strip()
        return full if full else obj.expelled_by.username

class SquadSerializer(serializers.ModelSerializer):
    leader_name = serializers.SerializerMethodField()
    leader_avatar = serializers.SerializerMethodField()
    members = SquadMemberSerializer(many=True, read_only=True)
    members_count = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()
    is_leader = serializers.SerializerMethodField()

    class Meta:
        model = Squad
        fields = (
            'id', 'title', 'description', 'leader', 'leader_name', 'leader_avatar',
            'needed_skills', 'available_shifts', 'max_members', 'members',
            'members_count', 'is_member', 'is_leader', 'is_active', 'created_at'
        )
        read_only_fields = ('id', 'leader', 'created_at')

    def get_leader_name(self, obj):
        full = f"{obj.leader.first_name} {obj.leader.last_name}".strip()
        return full if full else obj.leader.username

    def get_leader_avatar(self, obj):
        return obj.leader.avatar or f"https://api.dicebear.com/7.x/adventurer/svg?seed={obj.leader.username}"

    def get_members_count(self, obj):
        return obj.members.count()

    def get_is_member(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.members.filter(id=request.user.id).exists() or obj.leader == request.user
        return False

    def get_is_leader(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            user = request.user
            is_admin = getattr(user, 'role', '') == 'ADMIN' or user.is_staff or user.is_superuser
            return obj.leader == user or is_admin
        return False
