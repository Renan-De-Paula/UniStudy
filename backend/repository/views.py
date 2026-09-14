from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.db.models import Q
from .models import Material, MaterialComment, PrivacyOptions
from .serializers import MaterialSerializer, MaterialCommentSerializer
from accounts.models import Friendship, FriendshipStatus

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.uploaded_by == request.user

class MaterialViewSet(viewsets.ModelViewSet):
    serializer_class = MaterialSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Material.objects.none()

        # Friends logic: users who have accepted friendship with the current user
        friends_1 = Friendship.objects.filter(requester=user, status=FriendshipStatus.ACCEPTED).values_list('receiver_id', flat=True)
        friends_2 = Friendship.objects.filter(receiver=user, status=FriendshipStatus.ACCEPTED).values_list('requester_id', flat=True)
        friend_ids = list(friends_1) + list(friends_2)

        return Material.objects.filter(
            Q(uploaded_by=user) | 
            Q(privacy=PrivacyOptions.PUBLIC) | 
            Q(privacy=PrivacyOptions.FRIENDS, uploaded_by_id__in=friend_ids)
        ).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

class MaterialCommentViewSet(viewsets.ModelViewSet):
    queryset = MaterialComment.objects.all().order_by('created_at')
    serializer_class = MaterialCommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
