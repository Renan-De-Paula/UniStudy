from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.contrib.auth import get_user_model
from django.db.models import Q
from .models import Squad, SquadMessage, SquadExpulsionLog
from .serializers import SquadSerializer, SquadMessageSerializer, SquadExpulsionLogSerializer

User = get_user_model()

class SquadViewSet(viewsets.ModelViewSet):
    queryset = Squad.objects.filter(is_active=True).select_related('leader').prefetch_related('members').order_by('-created_at')
    serializer_class = SquadSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def _is_leader_or_admin(self, squad, user):
        if not user or not user.is_authenticated:
            return False
        is_admin = getattr(user, 'role', '') == 'ADMIN' or user.is_staff or user.is_superuser
        return squad.leader == user or is_admin

    def perform_create(self, serializer):
        squad = serializer.save(leader=self.request.user)
        squad.members.add(self.request.user)
        # Bônus de +30 XP por fundar uma guilda de estudos
        self.request.user.xp += 30
        self.request.user.save(update_fields=['xp'])

    def update(self, request, *args, **kwargs):
        squad = self.get_object()
        if not self._is_leader_or_admin(squad, request.user):
            return Response({"error": "Apenas o líder ou um administrador pode editar esta guilda."}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        squad = self.get_object()
        if not self._is_leader_or_admin(squad, request.user):
            return Response({"error": "Apenas o líder ou um administrador pode editar esta guilda."}, status=status.HTTP_403_FORBIDDEN)
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        squad = self.get_object()
        if not self._is_leader_or_admin(squad, request.user):
            return Response({"error": "Apenas o líder ou um administrador pode excluir esta guilda."}, status=status.HTTP_403_FORBIDDEN)
        squad.is_active = False
        squad.save(update_fields=['is_active'])
        return Response({"message": f"Guilda '{squad.title}' excluída com sucesso."}, status=status.HTTP_200_OK)

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
            return Response({"error": "O fundador/líder não pode abandonar a guilda. Você pode transferir a liderança ou excluir a guilda."}, status=status.HTTP_400_BAD_REQUEST)

        if not squad.members.filter(id=user.id).exists():
            return Response({"error": "Você não é membro desta guilda."}, status=status.HTTP_400_BAD_REQUEST)

        squad.members.remove(user)
        return Response({
            "message": f"Você saiu da guilda {squad.title}.",
            "members_count": squad.members.count(),
            "is_member": False
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def invite(self, request, pk=None):
        squad = self.get_object()
        if not self._is_leader_or_admin(squad, request.user):
            return Response({"error": "Apenas o líder ou administrador pode convidar novos membros."}, status=status.HTTP_403_FORBIDDEN)

        identifier = request.data.get('identifier', '').strip()
        if not identifier:
            return Response({"error": "Informe o nome de usuário ou e-mail a ser convidado."}, status=status.HTTP_400_BAD_REQUEST)

        target_user = User.objects.filter(Q(username__iexact=identifier) | Q(email__iexact=identifier)).first()
        if not target_user:
            return Response({"error": f"Nenhum usuário encontrado com '{identifier}'."}, status=status.HTTP_404_NOT_FOUND)

        if squad.members.filter(id=target_user.id).exists() or squad.leader == target_user:
            return Response({"error": f"{target_user.username} já faz parte desta guilda."}, status=status.HTTP_400_BAD_REQUEST)

        if squad.members.count() >= squad.max_members:
            return Response({"error": "A guilda atingiu o limite máximo de membros."}, status=status.HTTP_400_BAD_REQUEST)

        squad.members.add(target_user)
        return Response({
            "message": f"Usuário {target_user.username} foi adicionado à guilda com sucesso!",
            "members_count": squad.members.count()
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def expel(self, request, pk=None):
        squad = self.get_object()
        if not self._is_leader_or_admin(squad, request.user):
            return Response({"error": "Apenas o líder da guilda ou um administrador tem autoridade para expulsar membros."}, status=status.HTTP_403_FORBIDDEN)

        user_id = request.data.get('user_id')
        reason = request.data.get('reason', '').strip()

        if not user_id:
            return Response({"error": "ID do usuário a ser expulso é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        if not reason or len(reason) < 5:
            return Response({
                "error": "O preenchimento do motivo detalhado da expulsão é obrigatório (mínimo de 5 caracteres) para fins de auditoria administrativa."
            }, status=status.HTTP_400_BAD_REQUEST)

        target_user = squad.members.filter(id=user_id).first()
        if not target_user:
            return Response({"error": "Este usuário não é membro desta guilda."}, status=status.HTTP_404_NOT_FOUND)

        if target_user == squad.leader:
            return Response({"error": "O líder fundador da guilda não pode ser expulso."}, status=status.HTTP_400_BAD_REQUEST)

        # Remove o usuário da guilda
        squad.members.remove(target_user)

        # Registra auditoria obrigatória de expulsão
        SquadExpulsionLog.objects.create(
            squad=squad,
            expelled_user=target_user,
            expelled_by=request.user,
            reason=reason
        )

        return Response({
            "message": f"Usuário {target_user.username} foi expulso da guilda. O motivo foi registrado com sucesso para auditoria.",
            "members_count": squad.members.count()
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def expulsions(self, request, pk=None):
        squad = self.get_object()
        if not self._is_leader_or_admin(squad, request.user):
            return Response({"error": "Acesso restrito ao líder e administradores."}, status=status.HTTP_403_FORBIDDEN)

        logs = squad.expulsion_logs.all().select_related('expelled_user', 'expelled_by')
        serializer = SquadExpulsionLogSerializer(logs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get', 'post', 'delete'], permission_classes=[IsAuthenticated])
    def messages(self, request, pk=None):
        squad = self.get_object()

        if request.method == 'GET':
            channel = request.query_params.get('channel')
            msgs = squad.messages.all().select_related('author')
            if channel:
                msgs = msgs.filter(channel=channel)
            serializer = SquadMessageSerializer(msgs, many=True, context={'request': request})
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
            serializer = SquadMessageSerializer(msg, context={'request': request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        elif request.method == 'DELETE':
            msg_id = request.data.get('message_id') or request.query_params.get('message_id')
            if not msg_id:
                return Response({"error": "ID da mensagem não informado."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                msg = squad.messages.get(id=msg_id)
            except SquadMessage.DoesNotExist:
                return Response({"error": "Mensagem não encontrada."}, status=status.HTTP_404_NOT_FOUND)

            is_admin = getattr(request.user, 'role', '') == 'ADMIN' or request.user.is_staff or request.user.is_superuser
            is_leader = squad.leader == request.user
            is_author = msg.author == request.user

            if not (is_author or is_leader or is_admin):
                return Response({"error": "Você não tem permissão para excluir esta mensagem."}, status=status.HTTP_403_FORBIDDEN)

            msg.delete()
            return Response({"message": "Mensagem excluída com sucesso.", "deleted_id": msg_id}, status=status.HTTP_200_OK)
