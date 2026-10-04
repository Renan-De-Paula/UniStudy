from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Badge, UserBadge, StoreItem, UserPurchase
from .serializers import (
    BadgeSerializer, UserBadgeSerializer, LeaderboardUserSerializer,
    StoreItemSerializer, UserPurchaseSerializer
)

User = get_user_model()

class GamificationViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def leaderboard(self, request):
        # Top 10 users by XP
        users = User.objects.all().order_by('-xp')[:10]
        serializer = LeaderboardUserSerializer(users, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_badges(self, request):
        user_badges = UserBadge.objects.filter(user=request.user)
        serializer = UserBadgeSerializer(user_badges, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def store_items(self, request):
        items = StoreItem.objects.all()
        serializer = StoreItemSerializer(items, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def buy_item(self, request, pk=None):
        try:
            item = StoreItem.objects.get(pk=pk)
        except StoreItem.DoesNotExist:
            return Response({"error": "Item não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        if request.user.xp < item.cost_xp:
            return Response({"error": "XP insuficiente."}, status=status.HTTP_400_BAD_REQUEST)

        if UserPurchase.objects.filter(user=request.user, item=item).exists():
            return Response({"error": "Você já possui este item."}, status=status.HTTP_400_BAD_REQUEST)

        # Deduzir XP e salvar compra
        request.user.xp -= item.cost_xp
        request.user.save()

        purchase = UserPurchase.objects.create(user=request.user, item=item)
        
        # Enviar evento WebSocket (opicional, pode ser feito via sinal)
        from channels.layers import get_channel_layer
        from asgiref.sync import async_to_sync
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "global_notifications",
            {
                "type": "send_notification",
                "message": f"Você comprou {item.name} com sucesso!",
                "notif_type": "success"
            }
        )

        serializer = UserPurchaseSerializer(purchase)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
