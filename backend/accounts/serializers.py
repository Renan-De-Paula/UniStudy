from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from .models import EmailVerificationToken, Friendship

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'course', 'semester', 'xp', 'is_mentor', 'bio', 'skills', 'avatar')
        read_only_fields = ('id', 'xp')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=True)
    avatar = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'role', 'course', 'semester', 'avatar')

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "As senhas não coincidem."})
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "Este e-mail já está em uso."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role', 'STUDENT'),
            course=validated_data.get('course', ''),
            semester=validated_data.get('semester', 1),
            avatar=validated_data.get('avatar', ''),
            is_email_verified=False
        )
        token = EmailVerificationToken.objects.create(user=user)
        print(f"=== EMAIL SIMULATION ===")
        print(f"To: {user.email}")
        print(f"Token de confirmação: {token.token}")
        print(f"========================")
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.is_email_verified:
            raise serializers.ValidationError({"email": "E-mail não verificado. Por favor, verifique seu e-mail antes de fazer login."})
        return data

class VerifyEmailSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=64, required=True)

class FriendshipSerializer(serializers.ModelSerializer):
    requester_username = serializers.ReadOnlyField(source='requester.username')
    receiver_username = serializers.ReadOnlyField(source='receiver.username')

    class Meta:
        model = Friendship
        fields = ['id', 'requester', 'requester_username', 'receiver', 'receiver_username', 'status', 'created_at']
        read_only_fields = ['id', 'requester', 'status', 'created_at']
