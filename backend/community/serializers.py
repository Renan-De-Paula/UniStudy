from rest_framework import serializers
from .models import Discipline, Post, Answer, DisciplineReview

class DisciplineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discipline
        fields = ('id', 'name', 'code', 'course', 'semester')

class AnswerSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_avatar = serializers.SerializerMethodField()
    author_role = serializers.ReadOnlyField(source='author.role')
    author_is_mentor = serializers.ReadOnlyField(source='author.is_mentor')
    author_level = serializers.SerializerMethodField()

    class Meta:
        model = Answer
        fields = (
            'id', 'post', 'author', 'author_name', 'author_avatar', 
            'author_role', 'author_is_mentor', 'author_level',
            'content', 'is_verified_solution', 'validated_by_professor', 'created_at'
        )
        read_only_fields = ('id', 'author', 'created_at')

    def get_author_name(self, obj):
        name = f"{obj.author.first_name} {obj.author.last_name}".strip()
        return name if name else obj.author.username

    def get_author_avatar(self, obj):
        return obj.author.avatar or f"https://api.dicebear.com/7.x/adventurer/svg?seed={obj.author.username}"

    def get_author_level(self, obj):
        return (obj.author.xp // 100) + 1

class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_avatar = serializers.SerializerMethodField()
    author_role = serializers.ReadOnlyField(source='author.role')
    author_is_mentor = serializers.ReadOnlyField(source='author.is_mentor')
    author_level = serializers.SerializerMethodField()
    discipline_name = serializers.ReadOnlyField(source='discipline.name')
    discipline_code = serializers.ReadOnlyField(source='discipline.code')
    answers = AnswerSerializer(many=True, read_only=True)
    answers_count = serializers.SerializerMethodField()
    upvotes_count = serializers.SerializerMethodField()
    has_upvoted = serializers.SerializerMethodField()
    is_solved = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = (
            'id', 'discipline', 'discipline_name', 'discipline_code',
            'author', 'author_name', 'author_avatar', 'author_role',
            'author_is_mentor', 'author_level', 'title', 'content',
            'is_question', 'upvotes_count', 'has_upvoted', 'is_solved',
            'answers', 'answers_count', 'created_at'
        )
        read_only_fields = ('id', 'author', 'created_at')

    def get_author_name(self, obj):
        name = f"{obj.author.first_name} {obj.author.last_name}".strip()
        return name if name else obj.author.username

    def get_author_avatar(self, obj):
        return obj.author.avatar or f"https://api.dicebear.com/7.x/adventurer/svg?seed={obj.author.username}"

    def get_author_level(self, obj):
        return (obj.author.xp // 100) + 1

    def get_answers_count(self, obj):
        return obj.answers.count()

    def get_upvotes_count(self, obj):
        return obj.upvotes.count()

    def get_has_upvoted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.upvotes.filter(id=request.user.id).exists()
        return False

    def get_is_solved(self, obj):
        return obj.answers.filter(is_verified_solution=True).exists()

class DisciplineReviewSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = DisciplineReview
        fields = ('id', 'discipline', 'author', 'author_name', 'rating', 'comment', 'created_at')
        read_only_fields = ('id', 'author', 'created_at')

    def get_author_name(self, obj):
        name = f"{obj.author.first_name} {obj.author.last_name}".strip()
        return name if name else obj.author.username
