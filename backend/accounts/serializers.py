from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from .models import EmailVerificationToken, Friendship, TeacherVerificationRequest

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    equipped_items = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'course', 'semester', 'xp', 'is_mentor', 'bio', 'skills', 'avatar', 'equipped_items')
        read_only_fields = ('id', 'xp', 'equipped_items')

    def get_equipped_items(self, obj):
        try:
            from gamification.models import UserPurchase
            active_purchases = UserPurchase.objects.filter(user=obj, is_active=True).select_related('item')
            result = {'frame': None, 'theme': None, 'badge': None}
            for p in active_purchases:
                item = p.item
                data = {
                    'id': item.id,
                    'name': item.name,
                    'item_type': item.item_type,
                    'asset_url': item.asset_url,
                }
                if item.item_type == 'AVATAR_FRAME':
                    result['frame'] = data
                elif item.item_type == 'THEME_COLOR':
                    result['theme'] = data
                elif item.item_type == 'PROFILE_BADGE':
                    result['badge'] = data
            return result
        except Exception:
            return {'frame': None, 'theme': None, 'badge': None}

class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, required=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=True)
    avatar = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'role', 'course', 'semester', 'avatar')

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "As senhas não coincidem."})
        
        email = attrs['email'].strip().lower()
        attrs['email'] = email

        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError({"email": "Este e-mail já está em uso."})

        username = attrs.get('username', '').strip()
        if not username:
            base_username = email.split('@')[0].replace('.', '_').replace('-', '_')
            username = base_username
            counter = 1
            while User.objects.filter(username__iexact=username).exists():
                username = f"{base_username}_{counter}"
                counter += 1
            attrs['username'] = username
        else:
            if User.objects.filter(username__iexact=username).exists():
                raise serializers.ValidationError({"username": "Este nome de usuário já está em uso."})
            attrs['username'] = username

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
            is_email_verified=True
        )
        EmailVerificationToken.objects.create(user=user, is_used=True)
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        if self.username_field in attrs:
            attrs[self.username_field] = attrs[self.username_field].strip()
        data = super().validate(attrs)
        if not self.user.is_email_verified:
            self.user.is_email_verified = True
            self.user.save(update_fields=['is_email_verified'])
        data['user'] = UserSerializer(self.user).data
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

class TeacherVerificationRequestSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = TeacherVerificationRequest
        fields = [
            'id', 'user', 'username', 'email', 'institution', 
            'proof_url', 'institutional_email', 'bio_statement', 
            'status', 'created_at', 'reviewed_at'
        ]
        read_only_fields = ['id', 'user', 'status', 'created_at', 'reviewed_at']
