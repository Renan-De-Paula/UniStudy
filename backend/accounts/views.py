from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.utils import timezone
from .models import EmailVerificationToken, Friendship, FriendshipStatus
from .serializers import UserSerializer, RegisterSerializer, CustomTokenObtainPairSerializer, VerifyEmailSerializer, FriendshipSerializer, FriendProfileSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class CurrentUserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

    def perform_update(self, serializer):
        user = serializer.save()
        if 'xp' in self.request.data:
            try:
                user.xp = int(self.request.data['xp'])
                user.save(update_fields=['xp'])
            except (ValueError, TypeError):
                pass

class AddXPView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        try:
            amount = int(request.data.get('amount', 0))
        except (ValueError, TypeError):
            return Response({"error": "Valor de XP inválido."}, status=status.HTTP_400_BAD_REQUEST)

        if amount > 0:
            request.user.xp += amount
            request.user.save(update_fields=['xp'])

        return Response({
            "message": f"+{amount} XP adicionado!",
            "xp": request.user.xp,
            "level": (request.user.xp // 100) + 1
        }, status=status.HTTP_200_OK)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class VerifyEmailView(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = VerifyEmailSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token_str = serializer.validated_data['token']
        
        try:
            token = EmailVerificationToken.objects.get(token=token_str)
        except EmailVerificationToken.DoesNotExist:
            return Response({"error": "Token inválido."}, status=status.HTTP_400_BAD_REQUEST)
        
        if not token.is_valid():
            return Response({"error": "Token expirado ou já utilizado."}, status=status.HTTP_400_BAD_REQUEST)
        
        user = token.user
        user.is_email_verified = True
        user.save()
        
        token.is_used = True
        token.save()
        
        return Response({"message": "E-mail verificado com sucesso!"}, status=status.HTTP_200_OK)

class FriendshipViewSet(viewsets.ModelViewSet):
    serializer_class = FriendshipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Friendship.objects.filter(
            Q(requester=user) | Q(receiver=user)
        ).select_related('requester', 'receiver').order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(requester=self.request.user)

    def destroy(self, request, *args, **kwargs):
        friendship = self.get_object()
        if friendship.receiver != request.user and friendship.requester != request.user:
            return Response({"error": "Não autorizado."}, status=status.HTTP_403_FORBIDDEN)
        friendship.delete()
        return Response({"message": "Amizade desfeita com sucesso."}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def friends(self, request):
        user = request.user
        friendships = Friendship.objects.filter(
            (Q(requester=user) | Q(receiver=user)),
            status=FriendshipStatus.ACCEPTED
        ).select_related('requester', 'receiver').order_by('-updated_at')
        serializer = self.get_serializer(friendships, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def requests(self, request):
        user = request.user
        incoming = Friendship.objects.filter(
            receiver=user,
            status=FriendshipStatus.PENDING
        ).select_related('requester').order_by('-created_at')
        
        outgoing = Friendship.objects.filter(
            requester=user,
            status=FriendshipStatus.PENDING
        ).select_related('receiver').order_by('-created_at')

        return Response({
            'incoming': self.get_serializer(incoming, many=True).data,
            'outgoing': self.get_serializer(outgoing, many=True).data,
            'pending_count': incoming.count()
        })

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '').strip()
        user = request.user

        users_qs = User.objects.exclude(id=user.id)
        if query:
            clean_q = query.lstrip('@')
            users_qs = users_qs.filter(
                Q(username__icontains=clean_q) |
                Q(first_name__icontains=clean_q) |
                Q(last_name__icontains=clean_q) |
                Q(email__icontains=clean_q) |
                Q(course__icontains=clean_q)
            )
        else:
            users_qs = users_qs.order_by('-xp', '-date_joined')[:20]

        users = list(users_qs[:30])
        user_ids = [u.id for u in users]

        existing = Friendship.objects.filter(
            (Q(requester=user, receiver_id__in=user_ids) |
             Q(receiver=user, requester_id__in=user_ids))
        )
        friendship_map = {}
        for f in existing:
            other_id = f.receiver_id if f.requester_id == user.id else f.requester_id
            if f.status == FriendshipStatus.ACCEPTED:
                st = 'FRIENDS'
            elif f.status == FriendshipStatus.PENDING:
                st = 'PENDING_SENT' if f.requester_id == user.id else 'PENDING_RECEIVED'
            else:
                st = 'NONE'
            friendship_map[other_id] = {'status': st, 'friendship_id': f.id}

        results = []
        for u in users:
            info = FriendProfileSerializer(u).data
            rel = friendship_map.get(u.id, {'status': 'NONE', 'friendship_id': None})
            info['friendship_status'] = rel['status']
            info['friendship_id'] = rel['friendship_id']
            results.append(info)

        return Response(results)

    @action(detail=False, methods=['post'])
    def send_request(self, request):
        user = request.user
        target_id = request.data.get('user_id')
        identifier = str(request.data.get('identifier', '')).strip()

        target_user = None
        if target_id:
            target_user = User.objects.filter(id=target_id).first()
        elif identifier:
            clean_id = identifier.lstrip('@')
            target_user = User.objects.filter(
                Q(username__iexact=clean_id) | Q(email__iexact=clean_id)
            ).first()

        if not target_user:
            return Response({"error": "Estudante não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        if target_user.id == user.id:
            return Response({"error": "Você não pode enviar solicitação de amizade para você mesmo."}, status=status.HTTP_400_BAD_REQUEST)

        friendship = Friendship.objects.filter(
            (Q(requester=user, receiver=target_user) | Q(requester=target_user, receiver=user))
        ).first()

        if friendship:
            if friendship.status == FriendshipStatus.ACCEPTED:
                return Response({"message": f"Você e {target_user.username} já são amigos!"})
            
            if friendship.status == FriendshipStatus.PENDING:
                if friendship.requester == user:
                    return Response({"message": "Solicitação já enviada anteriormente. Aguarde a resposta!"})
                else:
                    # Solicitação mútua -> aceita automaticamente
                    friendship.status = FriendshipStatus.ACCEPTED
                    friendship.save()
                    user.xp += 10
                    user.save(update_fields=['xp'])
                    target_user.xp += 10
                    target_user.save(update_fields=['xp'])
                    return Response({
                        "message": f"Solicitação mútua! Você e {target_user.username} agora são amigos! (+10 XP)",
                        "friendship": self.get_serializer(friendship).data
                    })

            friendship.requester = user
            friendship.receiver = target_user
            friendship.status = FriendshipStatus.PENDING
            friendship.save()
        else:
            friendship = Friendship.objects.create(
                requester=user,
                receiver=target_user,
                status=FriendshipStatus.PENDING
            )

        return Response({
            "message": f"Solicitação de amizade enviada para {target_user.username}!",
            "friendship": self.get_serializer(friendship).data
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        friendship = self.get_object()
        if friendship.receiver != request.user:
            return Response({"error": "Apenas quem recebeu a solicitação pode aceitar."}, status=status.HTTP_403_FORBIDDEN)
        
        friendship.status = FriendshipStatus.ACCEPTED
        friendship.save()

        request.user.xp += 10
        request.user.save(update_fields=['xp'])
        friendship.requester.xp += 10
        friendship.requester.save(update_fields=['xp'])

        return Response({
            "message": "Solicitação de amizade aceita com sucesso! (+10 XP de estudo)",
            "friendship": self.get_serializer(friendship).data
        })

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        friendship = self.get_object()
        if friendship.receiver != request.user and friendship.requester != request.user:
            return Response({"error": "Não autorizado."}, status=status.HTTP_403_FORBIDDEN)
        
        friendship.status = FriendshipStatus.REJECTED
        friendship.save()
        return Response({"message": "Solicitação de amizade recusada."})

    @action(detail=True, methods=['delete', 'post'])
    def remove(self, request, pk=None):
        friendship = self.get_object()
        if friendship.receiver != request.user and friendship.requester != request.user:
            return Response({"error": "Não autorizado."}, status=status.HTTP_403_FORBIDDEN)
        
        friendship.delete()
        return Response({"message": "Amizade desfeita / Solicitação cancelada com sucesso."})


from rest_framework.views import APIView
from django.utils import timezone
from .models import TeacherVerificationRequest, UserRole
from .serializers import TeacherVerificationRequestSerializer

class RedirecionamentoPosLoginView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.trilhas.count() == 0:
            return Response({'redirect_to': '/onboarding'})
        else:
            return Response({'redirect_to': '/'})

class TeacherRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        req = TeacherVerificationRequest.objects.filter(user=request.user).first()
        if not req:
            return Response({"has_request": False, "role": request.user.role})
        serializer = TeacherVerificationRequestSerializer(req)
        return Response({
            "has_request": True,
            "role": request.user.role,
            "request": serializer.data
        })

    def post(self, request):
        if request.user.role in [UserRole.PROFESSOR, UserRole.ADMIN]:
            return Response({"detail": "Você já possui cargo docente ou administrativo."}, status=status.HTTP_400_BAD_REQUEST)

        institution = request.data.get('institution', '').strip()
        proof_url = request.data.get('proof_url', '').strip()
        institutional_email = request.data.get('institutional_email', '').strip().lower()
        bio_statement = request.data.get('bio_statement', '').strip()

        if not institution:
            return Response({"error": "Por favor, informe a instituição de ensino ou área de atuação."}, status=status.HTTP_400_BAD_REQUEST)

        # Verificação automática de e-mail institucional acadêmico
        auto_approved = False
        inst_domains = ('.edu', '.edu.br', '@usp.br', '@ufmg.br', '@ufrj.br', '@unicamp.br', '@unesp.br', '@puc.br', '@mackenzie.br', '@fgv.br', '@fiap.com.br')
        user_email = (request.user.email or '').lower()

        if any(user_email.endswith(dom) or (institutional_email and institutional_email.endswith(dom)) for dom in inst_domains):
            auto_approved = True

        status_val = TeacherVerificationRequest.Status.APPROVED if auto_approved else TeacherVerificationRequest.Status.PENDING

        req, created = TeacherVerificationRequest.objects.update_or_create(
            user=request.user,
            defaults={
                'institution': institution,
                'proof_url': proof_url or None,
                'institutional_email': institutional_email or None,
                'bio_statement': bio_statement or None,
                'status': status_val,
                'admin_notes': 'Aprovação automática por domínio institucional.' if auto_approved else None,
                'reviewed_at': timezone.now() if auto_approved else None
            }
        )

        if auto_approved:
            request.user.role = UserRole.PROFESSOR
            request.user.save()

        serializer = TeacherVerificationRequestSerializer(req)
        return Response({
            "success": True,
            "auto_approved": auto_approved,
            "message": "Parabéns! Seu cargo de Professor foi ativado automaticamente pelo seu e-mail institucional." if auto_approved else "Sua solicitação foi enviada com sucesso e está em análise pelo Administrador.",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)

