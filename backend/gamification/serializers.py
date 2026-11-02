from rest_framework import serializers
from .models import Badge, UserBadge, StoreItem, UserPurchase, Quiz, QuizSubmission
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
    equipped_frame = serializers.SerializerMethodField()
    equipped_badge = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'avatar', 'xp', 'level', 'course', 'equipped_frame', 'equipped_badge']

    def get_level(self, obj):
        # Fórmula simples de nível: Nível = (XP // 100) + 1
        return (obj.xp // 100) + 1

    def get_equipped_frame(self, obj):
        purchase = UserPurchase.objects.filter(user=obj, item__item_type='AVATAR_FRAME', is_active=True).select_related('item').first()
        return {'id': purchase.item.id, 'name': purchase.item.name, 'asset_url': purchase.item.asset_url} if purchase else None

    def get_equipped_badge(self, obj):
        purchase = UserPurchase.objects.filter(user=obj, item__item_type='PROFILE_BADGE', is_active=True).select_related('item').first()
        return {'id': purchase.item.id, 'name': purchase.item.name, 'asset_url': purchase.item.asset_url} if purchase else None

class StoreItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreItem
        fields = '__all__'

class UserPurchaseSerializer(serializers.ModelSerializer):
    item = StoreItemSerializer(read_only=True)

    class Meta:
        model = UserPurchase
        fields = ['id', 'item', 'purchased_at', 'is_active']

class QuizSerializer(serializers.ModelSerializer):
    creator_name = serializers.SerializerMethodField()
    creator_role = serializers.CharField(source='creator.role', read_only=True)
    questions_count = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = [
            'id', 'title', 'description', 'category', 'difficulty', 
            'xp_reward', 'creator', 'creator_name', 'creator_role', 
            'questions', 'questions_count', 'badge_emoji', 'badge_title', 
            'badge_description', 'created_at', 'is_active'
        ]
        read_only_fields = ['id', 'creator', 'created_at']

    def get_creator_name(self, obj):
        if obj.creator.first_name:
            return f"{obj.creator.first_name} {obj.creator.last_name or ''}".strip()
        return obj.creator.username

    def get_questions_count(self, obj):
        return len(obj.questions) if isinstance(obj.questions, list) else 0

class QuizSubmissionSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    quiz_title = serializers.ReadOnlyField(source='quiz.title')
    badge_name = serializers.ReadOnlyField(source='badge_earned.name')

    class Meta:
        model = QuizSubmission
        fields = [
            'id', 'user', 'username', 'quiz', 'quiz_title', 
            'score', 'total_questions', 'xp_earned', 'badge_earned', 
            'badge_name', 'badge_tier', 'completed_at'
        ]
        read_only_fields = ['id', 'user', 'completed_at']
