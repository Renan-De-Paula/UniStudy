from django.contrib import admin
from .models import Discipline, Post, Answer, DisciplineReview

@admin.register(Discipline)
class DisciplineAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'course', 'semester')
    search_fields = ('name', 'code', 'course')
    list_filter = ('course', 'semester')

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'discipline', 'is_question', 'created_at')
    list_filter = ('is_question', 'created_at', 'discipline')
    search_fields = ('title', 'content', 'author__username')

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ('post', 'author', 'is_verified_solution', 'validated_by_professor', 'created_at')
    list_filter = ('is_verified_solution', 'validated_by_professor', 'created_at')
    search_fields = ('content', 'author__username', 'post__title')

@admin.register(DisciplineReview)
class DisciplineReviewAdmin(admin.ModelAdmin):
    list_display = ('discipline', 'author', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('discipline__name', 'author__username', 'comment')
