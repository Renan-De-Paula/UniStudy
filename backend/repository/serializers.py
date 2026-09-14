from rest_framework import serializers
from .models import Material, MaterialComment
from accounts.models import User

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'role']

class MaterialCommentSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)

    class Meta:
        model = MaterialComment
        fields = ['id', 'material', 'author', 'content', 'created_at']

class MaterialSerializer(serializers.ModelSerializer):
    uploaded_by = AuthorSerializer(read_only=True)
    comments = MaterialCommentSerializer(many=True, read_only=True)

    class Meta:
        model = Material
        fields = ['id', 'title', 'discipline', 'uploaded_by', 'material_type', 'privacy', 'link_or_file_url', 'content_html', 'created_at', 'updated_at', 'comments']
