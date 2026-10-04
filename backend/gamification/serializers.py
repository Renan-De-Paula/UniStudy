from rest_framework import serializers
from .models import Badge, UserBadge, StoreItem, UserPurchase
from django.contrib.auth import get_user_model

User = get_user_model()

class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = '__all__'

class UserBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer(read_only=True)
    
    class Meta:
        model = UserBadge
        fields = ['id', 'badge', 'date_earned']

class LeaderboardUserSerializer(serializers.ModelSerializer):
    level = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'xp', 'level', 'course']

    def get_level(self, obj):
        # Fórmula simples de nível: Nível = (XP // 100) + 1
        return (obj.xp // 100) + 1

class StoreItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreItem
        fields = '__all__'

class UserPurchaseSerializer(serializers.ModelSerializer):
    item = StoreItemSerializer(read_only=True)

    class Meta:
        model = UserPurchase
        fields = ['id', 'item', 'purchased_at', 'is_active']
