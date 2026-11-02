from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from django.db.models import Q, Max, Count
from django.utils import timezone
from .models import DirectMessage
from .serializers import DirectMessageSerializer

User = get_user_model()

class DirectMessageViewSet(viewsets.ModelViewSet):
    serializer_class = DirectMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return DirectMessage.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).select_related('sender', 'receiver').order_by('created_at')

    def destroy(self, request, *args, **kwargs):
        msg = self.get_object()
        if msg.sender != request.user and msg.receiver != request.user:
            return Response({"error": "Não autorizado."}, status=status.HTTP_403_FORBIDDEN)
        msg.delete()
        return Response({"message": "Mensagem excluída com sucesso."}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def conversation(self, request):
        user = request.user
        target_id = request.query_params.get('user_id')

        if not target_id:
            return Response({"error": "user_id é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        target_user = User.objects.filter(id=target_id).first()
        if not target_user:
            return Response({"error": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        # Marca mensagens recebidas como lidas
        DirectMessage.objects.filter(
            sender=target_user,
            receiver=user,
            is_read=False
        ).update(is_read=True, read_at=timezone.now())

        # Busca todas as mensagens da conversa
        messages = DirectMessage.objects.filter(
            (Q(sender=user, receiver=target_user) | Q(sender=target_user, receiver=user))
        ).select_related('sender', 'receiver').order_by('created_at')

        serializer = self.get_serializer(messages, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def send(self, request):
        user = request.user
        receiver_id = request.data.get('receiver_id')
        content = str(request.data.get('content', '')).strip()

        if not receiver_id:
            return Response({"error": "receiver_id é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        if not content:
            return Response({"error": "O conteúdo da mensagem não pode ser vazio."}, status=status.HTTP_400_BAD_REQUEST)

        receiver = User.objects.filter(id=receiver_id).first()
        if not receiver:
            return Response({"error": "Destinatário não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        if receiver.id == user.id:
            return Response({"error": "Você não pode enviar mensagens para si mesmo."}, status=status.HTTP_400_BAD_REQUEST)

        msg = DirectMessage.objects.create(
            sender=user,
            receiver=receiver,
            content=content
        )

        serializer = self.get_serializer(msg)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        count = DirectMessage.objects.filter(receiver=request.user, is_read=False).count()
        return Response({"unread_count": count})

    @action(detail=False, methods=['get'])
    def conversations_summary(self, request):
        user = request.user

        # Acha todos os parceiros de conversa
        sent_to = DirectMessage.objects.filter(sender=user).values_list('receiver_id', flat=True)
        received_from = DirectMessage.objects.filter(receiver=user).values_list('sender_id', flat=True)
        partner_ids = set(list(sent_to) + list(received_from))

        partners = User.objects.filter(id__in=partner_ids)
        summary = []

        for p in partners:
            last_msg = DirectMessage.objects.filter(
                (Q(sender=user, receiver=p) | Q(sender=p, receiver=user))
            ).order_by('-created_at').first()

            unread = DirectMessage.objects.filter(sender=p, receiver=user, is_read=False).count()

            full_name = f"{p.first_name} {p.last_name}".strip()
            summary.append({
                'user': {
                    'id': p.id,
                    'username': p.username,
                    'name': full_name if full_name else p.username,
                    'avatar': p.avatar or f"https://api.dicebear.com/7.x/adventurer/svg?seed={p.username}",
                    'role': p.role,
                    'level': (p.xp // 100) + 1,
                    'xp': p.xp,
                    'course': p.course
                },
                'last_message': {
                    'content': last_msg.content if last_msg else '',
                    'created_at': last_msg.created_at if last_msg else None,
                    'is_mine': last_msg.sender == user if last_msg else False,
                    'is_read': last_msg.is_read if last_msg else True
                } if last_msg else None,
                'unread_count': unread
            })

        # Ordena pelo horário da última mensagem
        summary.sort(key=lambda x: x['last_message']['created_at'] if (x['last_message'] and x['last_message']['created_at']) else timezone.datetime.min.replace(tzinfo=timezone.utc), reverse=True)
        return Response(summary)
