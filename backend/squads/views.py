from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Squad, SquadMessage
from trilha_ia.models import Trilha


def serialize_squad(squad, user):
    return {
        'id': squad.id,
        'name': squad.title,
        'description': squad.description,
        'focus': squad.needed_skills[0] if squad.needed_skills else 'Estudos gerais',
        'tags': squad.needed_skills,
        'membersCount': squad.members.count(),
        'maxMembers': squad.max_members,
        'isMember': squad.members.filter(id=user.id).exists(),
        'isLeader': squad.leader_id == user.id,
        'leader': squad.leader.get_full_name() or squad.leader.username,
        'createdAt': squad.created_at,
    }


class SquadListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        squads = Squad.objects.filter(is_active=True).select_related('leader').prefetch_related('members')
        return Response([serialize_squad(squad, request.user) for squad in squads.order_by('-created_at')])

    def post(self, request):
        title = str(request.data.get('name', '')).strip()
        description = str(request.data.get('description', '')).strip()
        if not title or not description:
            return Response({'error': 'Nome e descrição são obrigatórios.'}, status=status.HTTP_400_BAD_REQUEST)
        skills = request.data.get('tags', [])
        if not isinstance(skills, list):
            skills = []
        squad = Squad.objects.create(
            title=title,
            description=description,
            leader=request.user,
            needed_skills=skills[:5],
            max_members=max(int(request.data.get('maxMembers', 4)), 2),
        )
        squad.members.add(request.user)
        return Response(serialize_squad(squad, request.user), status=status.HTTP_201_CREATED)


class SquadRecommendationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        trail = Trilha.objects.filter(user=request.user).order_by('-criado_em').first()
        if not trail:
            return Response(None)
        content = trail.conteudo_gerado or {}
        profile = content.get('perfil') or {}
        title = content.get('title') or trail.titulo
        skills = content.get('gaps') or []
        tags = [item.get('habilidade') for item in skills if item.get('habilidade')]
        if not tags:
            tags = [profile.get('curso') or title]
        squad = Squad.objects.filter(is_active=True, title__iexact=f'Guilda {title}').first()
        if not squad:
            squad = Squad.objects.create(
                title=f'Guilda {title}',
                description=f'Grupo recomendado pela sua trilha: {content.get("description", "estudos colaborativos")}',
                leader=request.user,
                needed_skills=tags[:5],
                max_members=20,
            )
            squad.members.add(request.user)
        return Response(serialize_squad(squad, request.user))


class SquadJoinView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, squad_id):
        try:
            squad = Squad.objects.get(id=squad_id, is_active=True)
        except Squad.DoesNotExist:
            return Response({'error': 'Guilda não encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        if squad.members.filter(id=request.user.id).exists():
            squad.members.remove(request.user)
            joined = False
        elif squad.members.count() >= squad.max_members:
            return Response({'error': 'Esta guilda está cheia.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            squad.members.add(request.user)
            joined = True
        return Response({'joined': joined, 'membersCount': squad.members.count()})


class SquadMessageListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def _get_squad(self, request, squad_id):
        return Squad.objects.filter(id=squad_id, is_active=True, members=request.user).first()

    def get(self, request, squad_id):
        squad = self._get_squad(request, squad_id)
        if not squad:
            return Response({'error': 'Entre na guilda para acessar a sala.'}, status=status.HTTP_403_FORBIDDEN)
        messages = squad.messages.select_related('author').all()
        return Response([{
            'id': item.id,
            'author': item.author.get_full_name() or item.author.username,
            'authorId': item.author_id,
            'content': item.content,
            'createdAt': item.created_at,
        } for item in messages])

    def post(self, request, squad_id):
        squad = self._get_squad(request, squad_id)
        if not squad:
            return Response({'error': 'Entre na guilda para enviar mensagens.'}, status=status.HTTP_403_FORBIDDEN)
        content = str(request.data.get('content', '')).strip()
        if not content:
            return Response({'error': 'A mensagem não pode ficar vazia.'}, status=status.HTTP_400_BAD_REQUEST)
        item = SquadMessage.objects.create(squad=squad, author=request.user, content=content)
        return Response({
            'id': item.id,
            'author': request.user.get_full_name() or request.user.username,
            'authorId': request.user.id,
            'content': item.content,
            'createdAt': item.created_at,
        }, status=status.HTTP_201_CREATED)
