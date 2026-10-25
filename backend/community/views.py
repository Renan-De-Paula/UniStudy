from django.db.models import Count
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Answer, Discipline, Post


def serialize_answer(answer):
    return {
        'id': answer.id,
        'author': {
            'id': answer.author_id,
            'name': answer.author.get_full_name() or answer.author.username,
            'username': answer.author.username,
            'avatar': answer.author.avatar,
            'role': answer.author.role,
        },
        'content': answer.content,
        'isVerifiedSolution': answer.is_verified_solution,
        'createdAt': answer.created_at,
    }


def serialize_post(post):
    return {
        'id': post.id,
        'author': {
            'id': post.author_id,
            'name': post.author.get_full_name() or post.author.username,
            'username': post.author.username,
            'avatar': post.author.avatar,
            'role': post.author.role,
        },
        'title': post.title,
        'content': post.content,
        'tag': post.discipline.name,
        'upvotes': post.upvotes.count(),
        'hasVoted': False,
        'isSolved': post.answers.filter(is_verified_solution=True).exists(),
        'createdAt': post.created_at,
        'answers': [serialize_answer(answer) for answer in post.answers.select_related('author').all()],
    }


class PostListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        posts = Post.objects.select_related('author', 'discipline').prefetch_related('answers__author', 'upvotes')
        data = [serialize_post(post) for post in posts.order_by('-created_at')]
        for item, post in zip(data, posts):
            item['hasVoted'] = post.upvotes.filter(id=request.user.id).exists()
        return Response(data)

    def post(self, request):
        title = str(request.data.get('title', '')).strip()
        content = str(request.data.get('content', '')).strip()
        tag = str(request.data.get('tag', 'Geral')).strip() or 'Geral'
        if not title or not content:
            return Response({'error': 'Título e conteúdo são obrigatórios.'}, status=status.HTTP_400_BAD_REQUEST)
        discipline, _ = Discipline.objects.get_or_create(
            code=f'UNI-{tag.upper()[:12]}',
            defaults={'name': tag, 'course': 'Geral', 'semester': 1},
        )
        post = Post.objects.create(author=request.user, discipline=discipline, title=title, content=content)
        return Response(serialize_post(post), status=status.HTTP_201_CREATED)


class AnswerCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, post_id):
        content = str(request.data.get('content', '')).strip()
        if not content:
            return Response({'error': 'A resposta não pode ficar vazia.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({'error': 'Dúvida não encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        answer = Answer.objects.create(post=post, author=request.user, content=content)
        return Response(serialize_answer(answer), status=status.HTTP_201_CREATED)


class PostVoteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({'error': 'Dúvida não encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        if post.upvotes.filter(id=request.user.id).exists():
            post.upvotes.remove(request.user)
            voted = False
        else:
            post.upvotes.add(request.user)
            voted = True
        return Response({'voted': voted, 'upvotes': post.upvotes.count()})


class AnswerSolutionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, post_id, answer_id):
        try:
            post = Post.objects.get(id=post_id)
            answer = post.answers.get(id=answer_id)
        except (Post.DoesNotExist, Answer.DoesNotExist):
            return Response({'error': 'Dúvida ou resposta não encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        if post.author_id != request.user.id:
            return Response({'error': 'Somente o autor pode validar a solução.'}, status=status.HTTP_403_FORBIDDEN)
        post.answers.exclude(id=answer.id).update(is_verified_solution=False)
        answer.is_verified_solution = not answer.is_verified_solution
        answer.save(update_fields=['is_verified_solution'])
        return Response(serialize_answer(answer))
