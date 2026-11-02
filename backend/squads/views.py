from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .models import Squad, SquadMessage
from .serializers import SquadSerializer, SquadMessageSerializer

class SquadViewSet(viewsets.ModelViewSet):
    queryset = Squad.objects.filter(is_active=True).select_related('leader').prefetch_related('members').order_by('-created_at')
    serializer_class = SquadSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        squad = serializer.save(leader=self.request.user)
        squad.members.add(self.request.user)
        # Bônus de +30 XP por fundar uma guilda de estudos
        self.request.user.xp += 30
        self.request.user.save(update_fields=['xp'])

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def join(self, request, pk=None):
        squad = self.get_object()
        user = request.user

        if squad.members.filter(id=user.id).exists() or squad.leader == user:
            return Response({"error": "Você já é membro desta guilda."}, status=status.HTTP_400_BAD_REQUEST)

        if squad.members.count() >= squad.max_members:
            return Response({"error": "Esta guilda atingiu a capacidade máxima de membros."}, status=status.HTTP_400_BAD_REQUEST)

        squad.members.add(user)
        return Response({
            "message": f"Você ingressou na guilda {squad.title}!",
            "members_count": squad.members.count(),
            "is_member": True
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def leave(self, request, pk=None):
        squad = self.get_object()
        user = request.user

        if squad.leader == user:
            return Response({"error": "O fundador/líder não pode abandonar a guilda."}, status=status.HTTP_400_BAD_REQUEST)

        if not squad.members.filter(id=user.id).exists():
            return Response({"error": "Você não é membro desta guilda."}, status=status.HTTP_400_BAD_REQUEST)

        squad.members.remove(user)
        return Response({
            "message": f"Você saiu da guilda {squad.title}.",
            "members_count": squad.members.count(),
            "is_member": False
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get', 'post'], permission_classes=[IsAuthenticated])
    def messages(self, request, pk=None):
        squad = self.get_object()

        if request.method == 'GET':
            channel = request.query_params.get('channel')
            msgs = squad.messages.all().select_related('author')
            if channel:
                msgs = msgs.filter(channel=channel)
            serializer = SquadMessageSerializer(msgs, many=True)
            return Response(serializer.data)

        elif request.method == 'POST':
            content = request.data.get('content', '').strip()
            channel = request.data.get('channel', 'geral')

            if not content:
                return Response({"error": "O conteúdo da mensagem não pode estar vazio."}, status=status.HTTP_400_BAD_REQUEST)

            msg = SquadMessage.objects.create(
                squad=squad,
                author=request.user,
                channel=channel,
                content=content
            )
            serializer = SquadMessageSerializer(msg)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
