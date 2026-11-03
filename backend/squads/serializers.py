from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Squad, SquadMessage, SquadExpulsionLog, SquadMembership

User = get_user_model()

class SquadMemberSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    level = serializers.SerializerMethodField()
    guild_role = serializers.SerializerMethodField()
    guild_role_display = serializers.SerializerMethodField()
    benefits = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'name', 'avatar', 'role', 
            'level', 'xp', 'is_mentor', 'guild_role', 'guild_role_display', 'benefits'
        )

    def get_name(self, obj):
        full = f"{obj.first_name} {obj.last_name}".strip()
        return full if full else obj.username

    def get_level(self, obj):
        return (obj.xp // 100) + 1

    def _get_role(self, obj):
        squad = self.context.get('squad')
        if not squad:
            return 'MEMBER'
        if obj.id == squad.leader_id:
            return 'LEADER'
        membership = SquadMembership.objects.filter(squad=squad, user=obj).first()
        return membership.role if membership else 'MEMBER'

    def get_guild_role(self, obj):
        return self._get_role(obj)

    def get_guild_role_display(self, obj):
        role_key = self._get_role(obj)
        role_dict = dict(SquadMembership.ROLE_CHOICES)
        return role_dict.get(role_key, 'Membro')

    def get_benefits(self, obj):
        role_key = self._get_role(obj)
        return SquadMembership.ROLE_BENEFITS.get(role_key, SquadMembership.ROLE_BENEFITS['MEMBER'])


class SquadMessageSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_avatar = serializers.SerializerMethodField()
    author_role = serializers.ReadOnlyField(source='author.role')
    author_level = serializers.SerializerMethodField()
    author_guild_role = serializers.SerializerMethodField()
    author_guild_role_display = serializers.SerializerMethodField()
    author_guild_badge = serializers.SerializerMethodField()
    author_guild_color = serializers.SerializerMethodField()
    can_delete = serializers.SerializerMethodField()

    class Meta:
        model = SquadMessage
        fields = (
            'id', 'squad', 'author', 'author_name', 'author_avatar', 
            'author_role', 'author_level', 'author_guild_role', 'author_guild_role_display',
            'author_guild_badge', 'author_guild_color', 'channel', 'content', 'can_delete', 'created_at'
        )
        read_only_fields = ('id', 'author', 'created_at')

    def get_author_name(self, obj):
        full = f"{obj.author.first_name} {obj.author.last_name}".strip()
        return full if full else obj.author.username

    def get_author_avatar(self, obj):
        return obj.author.avatar or f"https://api.dicebear.com/7.x/adventurer/svg?seed={obj.author.username}"

    def get_author_level(self, obj):
        return (obj.author.xp // 100) + 1

    def _get_membership_role(self, obj):
        if obj.author_id == obj.squad.leader_id:
            return 'LEADER'
        membership = SquadMembership.objects.filter(squad=obj.squad, user=obj.author).first()
        return membership.role if membership else 'MEMBER'

    def get_author_guild_role(self, obj):
        return self._get_membership_role(obj)

    def get_author_guild_role_display(self, obj):
        role_key = self._get_membership_role(obj)
        return dict(SquadMembership.ROLE_CHOICES).get(role_key, 'Membro')

    def get_author_guild_badge(self, obj):
        role_key = self._get_membership_role(obj)
        return SquadMembership.ROLE_BENEFITS.get(role_key, {}).get('badge', '🌱 Membro')

    def get_author_guild_color(self, obj):
        role_key = self._get_membership_role(obj)
        return SquadMembership.ROLE_BENEFITS.get(role_key, {}).get('color', 'emerald')

    def get_can_delete(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            user = request.user
            is_admin = getattr(user, 'role', '') == 'ADMIN' or user.is_staff or user.is_superuser
            is_leader = obj.squad.leader_id == user.id
            is_author = obj.author_id == user.id
            is_sub_leader = SquadMembership.objects.filter(squad=obj.squad, user=user, role='SUB_LEADER').exists()
            return is_author or is_leader or is_sub_leader or is_admin
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
    members = serializers.SerializerMethodField()
    members_count = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()
    is_leader = serializers.SerializerMethodField()
    user_guild_role = serializers.SerializerMethodField()
    available_roles = serializers.SerializerMethodField()

    class Meta:
        model = Squad
        fields = (
            'id', 'title', 'description', 'leader', 'leader_name', 'leader_avatar',
            'needed_skills', 'available_shifts', 'max_members', 'members',
            'members_count', 'is_member', 'is_leader', 'user_guild_role',
            'available_roles', 'is_active', 'created_at'
        )
        read_only_fields = ('id', 'leader', 'created_at')

    def get_leader_name(self, obj):
        full = f"{obj.leader.first_name} {obj.leader.last_name}".strip()
        return full if full else obj.leader.username

    def get_leader_avatar(self, obj):
        return obj.leader.avatar or f"https://api.dicebear.com/7.x/adventurer/svg?seed={obj.leader.username}"

    def get_members(self, obj):
        members_qs = obj.members.all()
        serializer = SquadMemberSerializer(
            members_qs, 
            many=True, 
            context={'squad': obj, 'request': self.context.get('request')}
        )
        members_data = list(serializer.data)
        
        # Garante que o líder apareça na lista de membros se não estiver no M2M
        if not any(m['id'] == obj.leader_id for m in members_data):
            leader_data = SquadMemberSerializer(
                obj.leader, 
                context={'squad': obj, 'request': self.context.get('request')}
            ).data
            members_data.insert(0, leader_data)

        # Ordena hierarquicamente: LEADER (0) > SUB_LEADER (1) > MENTOR (2) > VETERAN (3) > MEMBER (4)
        order = {'LEADER': 0, 'SUB_LEADER': 1, 'MENTOR': 2, 'VETERAN': 3, 'MEMBER': 4}
        members_data.sort(key=lambda m: order.get(m.get('guild_role'), 99))
        return members_data

    def get_members_count(self, obj):
        count = obj.members.count()
        if not obj.members.filter(id=obj.leader_id).exists():
            count += 1
        return count

    def get_is_member(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.members.filter(id=request.user.id).exists() or obj.leader_id == request.user.id
        return False

    def get_is_leader(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            user = request.user
            is_admin = getattr(user, 'role', '') == 'ADMIN' or user.is_staff or user.is_superuser
            return obj.leader_id == user.id or is_admin
        return False

    def get_user_guild_role(self, obj):
        request = self.context.get('request')
        if not (request and request.user.is_authenticated):
            return None
        user = request.user
        if obj.leader_id == user.id:
            return 'LEADER'
        membership = SquadMembership.objects.filter(squad=obj, user=user).first()
        return membership.role if membership else None

    def get_available_roles(self, obj):
        return [
            {
                'id': code,
                'title': info['title'],
                'badge': info['badge'],
                'color': info['color'],
                'xp_bonus_percent': info['xp_bonus_percent'],
                'description': info['description']
            }
            for code, info in SquadMembership.ROLE_BENEFITS.items()
            if code != 'LEADER'
        ]
