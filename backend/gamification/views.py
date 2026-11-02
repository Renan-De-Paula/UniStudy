from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Badge, UserBadge, StoreItem, UserPurchase, Quiz, QuizSubmission
from .serializers import (
    BadgeSerializer, UserBadgeSerializer, LeaderboardUserSerializer,
    StoreItemSerializer, UserPurchaseSerializer, QuizSerializer, QuizSubmissionSerializer
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
        # Se a loja estiver vazia, povoar com itens iniciais de personalização
        if not items.exists():
            default_items = [
                {"name": "Moldura Mística Roxa", "description": "Borda neon roxa para destacar seu avatar.", "item_type": "AVATAR_FRAME", "cost_xp": 250, "asset_url": "border-primary"},
                {"name": "Moldura Dourada Mestre", "description": "Borda dourada de mestre para perfil lendário.", "item_type": "AVATAR_FRAME", "cost_xp": 500, "asset_url": "border-amber-400"},
                {"name": "Moldura Esmeralda Hacker", "description": "Borda verde cyberpunk para seu perfil.", "item_type": "AVATAR_FRAME", "cost_xp": 350, "asset_url": "border-emerald-400"},
                {"name": "Selo de Estudante Dedicado", "description": "Insígnia especial no card de usuário e comentários.", "item_type": "PROFILE_BADGE", "cost_xp": 200, "asset_url": "badge-scholar"},
                {"name": "Tema Dark Cyberpunk Neon", "description": "Cores de destaque exclusivas no editor e perfil.", "item_type": "THEME_COLOR", "cost_xp": 600, "asset_url": "theme-cyberpunk"},
            ]
            for it in default_items:
                StoreItem.objects.create(**it)
            items = StoreItem.objects.all()

        user_purchases = {p.item_id: p.is_active for p in UserPurchase.objects.filter(user=request.user)}
        serializer = StoreItemSerializer(items, many=True)
        data = []
        for item_data in serializer.data:
            item_id = item_data['id']
            item_data['purchased'] = item_id in user_purchases
            item_data['is_active'] = user_purchases.get(item_id, False)
            data.append(item_data)
        return Response(data)

    @action(detail=False, methods=['get'])
    def my_purchases(self, request):
        purchases = UserPurchase.objects.filter(user=request.user)
        serializer = UserPurchaseSerializer(purchases, many=True)
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

        purchase = UserPurchase.objects.create(user=request.user, item=item, is_active=True)
        if item.item_type in ['AVATAR_FRAME', 'THEME_COLOR', 'PROFILE_BADGE']:
            UserPurchase.objects.filter(user=request.user, item__item_type=item.item_type).exclude(pk=purchase.pk).update(is_active=False)
        
        # Enviar notificação via canal com tratamento de erro resiliente
        try:
            from channels.layers import get_channel_layer
            from asgiref.sync import async_to_sync
            channel_layer = get_channel_layer()
            if channel_layer:
                async_to_sync(channel_layer.group_send)(
                    "global_notifications",
                    {
                        "type": "send_notification",
                        "message": f"Você comprou {item.name} com sucesso!",
                        "notif_type": "success"
                    }
                )
        except Exception:
            pass

        active_purchases = UserPurchase.objects.filter(user=request.user, is_active=True).select_related('item')
        equipped_items = {'frame': None, 'theme': None, 'badge': None}
        for p in active_purchases:
            item_data = {
                'id': p.item.id,
                'name': p.item.name,
                'item_type': p.item.item_type,
                'asset_url': p.item.asset_url,
            }
            if p.item.item_type == 'AVATAR_FRAME':
                equipped_items['frame'] = item_data
            elif p.item.item_type == 'THEME_COLOR':
                equipped_items['theme'] = item_data
            elif p.item.item_type == 'PROFILE_BADGE':
                equipped_items['badge'] = item_data

        serializer = UserPurchaseSerializer(purchase)
        response_data = serializer.data
        response_data['equipped_items'] = equipped_items
        return Response(response_data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def toggle_equip(self, request, pk=None):
        try:
            purchase = UserPurchase.objects.filter(user=request.user, item_id=pk).first()
            if not purchase:
                return Response({"error": "Você ainda não adquiriu este item."}, status=status.HTTP_404_NOT_FOUND)

            # Se for frame de avatar, tema de cor ou selo, desativa outros da mesma categoria e ativa este (ou desativa se já ativo)
            if purchase.item.item_type in ['AVATAR_FRAME', 'THEME_COLOR', 'PROFILE_BADGE']:
                if not purchase.is_active:
                    UserPurchase.objects.filter(user=request.user, item__item_type=purchase.item.item_type).update(is_active=False)
                    purchase.is_active = True
                else:
                    purchase.is_active = False
            else:
                purchase.is_active = not purchase.is_active
            purchase.save()

            active_purchases = UserPurchase.objects.filter(user=request.user, is_active=True).select_related('item')
            equipped_items = {'frame': None, 'theme': None, 'badge': None}
            for p in active_purchases:
                item_data = {
                    'id': p.item.id,
                    'name': p.item.name,
                    'item_type': p.item.item_type,
                    'asset_url': p.item.asset_url,
                }
                if p.item.item_type == 'AVATAR_FRAME':
                    equipped_items['frame'] = item_data
                elif p.item.item_type == 'THEME_COLOR':
                    equipped_items['theme'] = item_data
                elif p.item.item_type == 'PROFILE_BADGE':
                    equipped_items['badge'] = item_data

            return Response({
                "success": True, 
                "is_active": purchase.is_active, 
                "item_id": purchase.item_id,
                "equipped_items": equipped_items
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

def setup_quiz_badges(quiz):
    title = quiz.badge_title.strip() if quiz.badge_title else quiz.title.strip()
    emoji = quiz.badge_emoji.strip() if quiz.badge_emoji else '🏆'
    desc = quiz.badge_description.strip() if quiz.badge_description else (quiz.description.strip() or f"Desafio de {quiz.title}")

    # Bronze: 50%
    Badge.objects.update_or_create(
        quiz=quiz,
        badge_tier='BRONZE',
        defaults={
            'name': f"🥉 [Bronze] {title}"[:100],
            'description': f"{desc} (Conquista de Nível Bronze - 50%+ de acerto)",
            'icon_emoji': f"🥉 {emoji}",
            'xp_required': 0
        }
    )

    # Prata: 70%
    Badge.objects.update_or_create(
        quiz=quiz,
        badge_tier='PRATA',
        defaults={
            'name': f"🥈 [Prata] {title}"[:100],
            'description': f"{desc} (Conquista de Nível Prata - 70%+ de acerto)",
            'icon_emoji': f"🥈 {emoji}",
            'xp_required': 0
        }
    )

    # Ouro: 100%
    Badge.objects.update_or_create(
        quiz=quiz,
        badge_tier='OURO',
        defaults={
            'name': f"🥇 [Ouro] {title}"[:100],
            'description': f"{desc} (Conquista de Nível Ouro - 100% Gabaritado!)",
            'icon_emoji': f"🥇 {emoji}",
            'xp_required': 0
        }
    )

class QuizViewSet(viewsets.ModelViewSet):
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Auto-seed quizzes iniciais se o banco estiver vazio
        if not Quiz.objects.exists():
            default_quizzes = [
                {
                    "title": "Fundamentos de Python",
                    "description": "Teste seus conhecimentos básicos de sintaxe, estruturas de repetição e funções.",
                    "category": "Programação",
                    "difficulty": "Iniciante",
                    "xp_reward": 150,
                    "questions": [
                        {
                            "id": 1,
                            "text": "Qual das opções abaixo é uma estrutura de repetição em Python?",
                            "options": ["if", "for", "def", "import"],
                            "correct": 1
                        },
                        {
                            "id": 2,
                            "text": "Como se define uma função em Python?",
                            "options": ["function myFunc()", "def myFunc():", "func myFunc()", "create myFunc()"],
                            "correct": 1
                        },
                        {
                            "id": 3,
                            "text": "Qual o resultado de 3 ** 2 em Python?",
                            "options": ["6", "5", "9", "Error"],
                            "correct": 2
                        }
                    ]
                },
                {
                    "title": "Lógica de Programação Avançada",
                    "description": "Desafios sobre algoritmos de ordenação, complexidade assintótica e estruturas.",
                    "category": "Lógica",
                    "difficulty": "Avançado",
                    "xp_reward": 300,
                    "questions": [
                        {
                            "id": 1,
                            "text": "O que é o algoritmo de ordenação Bubble Sort?",
                            "options": ["Um algoritmo que divide o array pela metade", "Um algoritmo que compara pares adjacentes e os troca", "Um algoritmo de busca em grafos", "Um método de criptografia"],
                            "correct": 1
                        },
                        {
                            "id": 2,
                            "text": "Qual a complexidade de tempo de busca binária no pior caso?",
                            "options": ["O(1)", "O(n)", "O(n log n)", "O(log n)"],
                            "correct": 3
                        }
                    ]
                },
                {
                    "title": "Estruturas de Dados Essenciais",
                    "description": "Pilhas, filas, listas e conceitos fundamentais de memória.",
                    "category": "Computação",
                    "difficulty": "Intermediário",
                    "xp_reward": 200,
                    "questions": [
                        {
                            "id": 1,
                            "text": "O que caracteriza uma Pilha (Stack)?",
                            "options": ["FIFO (First In, First Out)", "LIFO (Last In, First Out)", "Acesso aleatório", "Ordenação alfabética"],
                            "correct": 1
                        }
                    ]
                }
            ]
            for dq in default_quizzes:
                Quiz.objects.create(creator=self.request.user, **dq)

        category = self.request.query_params.get('category')
        difficulty = self.request.query_params.get('difficulty')
        qs = Quiz.objects.filter(is_active=True)
        if category and category != 'Todas':
            qs = qs.filter(category__iexact=category)
        if difficulty and difficulty != 'Todos':
            qs = qs.filter(difficulty__iexact=difficulty)
        return qs

    def perform_create(self, serializer):
        user = self.request.user
        is_teacher = getattr(user, 'role', '') in ['PROFESSOR', 'ADMIN'] or user.is_staff or user.is_superuser
        if not is_teacher:
            raise permissions.PermissionDenied("Apenas Professores e Administradores podem criar Quizzes e Desafios.")
        quiz = serializer.save(creator=user)
        setup_quiz_badges(quiz)

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        quiz = self.get_object()
        user_answers = request.data.get('answers', {})
        questions = quiz.questions or []
        total = len(questions)

        if total == 0:
            return Response({"error": "Quiz sem perguntas."}, status=status.HTTP_400_BAD_REQUEST)

        correct_count = 0
        for q in questions:
            qid = str(q.get('id'))
            if qid in user_answers and user_answers[qid] == q.get('correct'):
                correct_count += 1

        score_pct = int((correct_count / total) * 100) if total > 0 else 0
        passed = score_pct >= 50

        # Conceder XP proporcional ou total se aprovado
        xp_awarded = quiz.xp_reward if passed else int(quiz.xp_reward * (score_pct / 100))
        request.user.xp += xp_awarded
        request.user.save()

        # Configurar selos do quiz se ainda não configurados
        setup_quiz_badges(quiz)

        # Regras de Selos:
        # < 50%: Não ganha selo
        # >= 50% e < 70%: Selo Bronze (🥉)
        # >= 70% e < 100%: Selo Prata (🥈)
        # == 100%: Selo Ouro (🥇)
        badge_tier = None
        if score_pct == 100:
            badge_tier = 'OURO'
        elif score_pct >= 70:
            badge_tier = 'PRATA'
        elif score_pct >= 50:
            badge_tier = 'BRONZE'

        awarded_badge = None
        newly_unlocked = False

        if badge_tier:
            awarded_badge = Badge.objects.filter(quiz=quiz, badge_tier=badge_tier).first()
            if awarded_badge:
                user_badge, created = UserBadge.objects.get_or_create(user=request.user, badge=awarded_badge)
                newly_unlocked = created

        submission = QuizSubmission.objects.create(
            user=request.user,
            quiz=quiz,
            score=correct_count,
            total_questions=total,
            xp_earned=xp_awarded,
            badge_earned=awarded_badge,
            badge_tier=badge_tier or ''
        )

        badge_info = None
        if awarded_badge:
            badge_info = {
                "id": awarded_badge.id,
                "name": awarded_badge.name,
                "description": awarded_badge.description,
                "tier": badge_tier,
                "emoji": awarded_badge.icon_emoji or ('🥇' if badge_tier == 'OURO' else '🥈' if badge_tier == 'PRATA' else '🥉'),
                "newly_unlocked": newly_unlocked
            }

        return Response({
            "score": correct_count,
            "total_questions": total,
            "score_percentage": score_pct,
            "passed": passed,
            "xp_earned": xp_awarded,
            "user_xp": request.user.xp,
            "badge_tier": badge_tier,
            "badge_awarded": badge_info
        })
