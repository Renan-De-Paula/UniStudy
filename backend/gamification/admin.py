from django.contrib import admin
from .models import Badge, UserBadge, StoreItem, UserPurchase, Quiz, QuizSubmission

@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ('name', 'badge_tier', 'quiz', 'xp_required', 'is_secret')
    list_filter = ('badge_tier', 'is_secret')
    search_fields = ('name', 'description')

@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ('user', 'badge', 'date_earned')
    list_filter = ('badge', 'date_earned')
    search_fields = ('user__username', 'badge__name')

@admin.register(StoreItem)
class StoreItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'item_type', 'cost_xp')
    list_filter = ('item_type',)
    search_fields = ('name', 'description')

@admin.register(UserPurchase)
class UserPurchaseAdmin(admin.ModelAdmin):
    list_display = ('user', 'item', 'purchased_at', 'is_active')
    list_filter = ('is_active', 'item__item_type', 'purchased_at')
    search_fields = ('user__username', 'item__name')

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'difficulty', 'xp_reward', 'creator', 'created_at', 'is_active')
    list_filter = ('difficulty', 'category', 'is_active')
    search_fields = ('title', 'description', 'creator__username')

@admin.register(QuizSubmission)
class QuizSubmissionAdmin(admin.ModelAdmin):
    list_display = ('user', 'quiz', 'score', 'total_questions', 'badge_tier', 'xp_earned', 'completed_at')
    list_filter = ('badge_tier', 'completed_at')
    search_fields = ('user__username', 'quiz__title')
