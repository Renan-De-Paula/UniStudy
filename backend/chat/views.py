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

    def get_permissions(self):
        if self.action in ['purge_weekly', 'purge_status']:
            return [permissions.AllowAny()]
        return super().get_permissions()

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

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def purge_weekly(self, request):
        """
        Endpoint seguro para executar a faxina semanal de mensagens (guildas e privadas).
        Permite execução por Administradores autenticados ou por crons autorizados via header X-Cron-Key.
        """
        from django.conf import settings
        from .cleanup import purge_weekly_messages

        cron_secret = getattr(settings, 'CRON_SECRET', settings.SECRET_KEY)
        req_cron_key = request.headers.get('X-Cron-Key') or request.query_params.get('cron_key')

        is_admin_user = (
            request.user and 
            request.user.is_authenticated and 
            (request.user.is_staff or request.user.is_superuser or getattr(request.user, 'role', '') == 'ADMIN')
        )
        is_valid_cron = bool(req_cron_key and (req_cron_key == cron_secret or req_cron_key == settings.SECRET_KEY))

        if not (is_admin_user or is_valid_cron):
            return Response(
                {"error": "Acesso não autorizado. Apenas administradores ou serviços cron autenticados podem disparar a faxina semanal."},
                status=status.HTTP_403_FORBIDDEN
            )

        caller_name = request.user.username if (request.user and request.user.is_authenticated) else 'EXTERNAL_CRON'
        result = purge_weekly_messages(
            triggered_by='API_ADMIN' if is_admin_user else 'EXTERNAL_CRON',
            details=f"Disparado via endpoint /api/chat/messages/purge_weekly/ por {caller_name}."
        )
        return Response(result, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def purge_status(self, request):
        """
        Retorna informações sobre o agendador e o histórico das últimas faxinas realizadas.
        """
        from .models import MessagePurgeLog
        from squads.models import SquadMessage

        now = timezone.localtime(timezone.now())
        # Calcula próximo domingo às 23:59
        days_ahead = (6 - now.weekday()) % 7
        if days_ahead == 0 and (now.hour > 23 or (now.hour == 23 and now.minute >= 59)):
            days_ahead = 7
        next_sunday = (now + timezone.timedelta(days=days_ahead)).replace(hour=23, minute=59, second=0, microsecond=0)

        logs = MessagePurgeLog.objects.all().order_by('-purged_at')[:5]
        logs_data = [{
            'id': l.id,
            'purged_at': timezone.localtime(l.purged_at).strftime('%d/%m/%Y %H:%M:%S'),
            'squad_messages_deleted': l.squad_messages_deleted,
            'direct_messages_deleted': l.direct_messages_deleted,
            'total_deleted': l.squad_messages_deleted + l.direct_messages_deleted,
            'triggered_by': l.triggered_by,
            'details': l.details
        } for l in logs]

        return Response({
            'current_time_brt': now.strftime('%d/%m/%Y %H:%M:%S'),
            'schedule': 'Todo domingo às 23:59 (Horário de Brasília)',
            'next_purge_at': next_sunday.strftime('%d/%m/%Y %H:%M:%S'),
            'current_squad_messages': SquadMessage.objects.count(),
            'current_direct_messages': DirectMessage.objects.count(),
            'total_current_messages': SquadMessage.objects.count() + DirectMessage.objects.count(),
            'recent_purges': logs_data
        })
