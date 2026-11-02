from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.db.models import Count
from .models import Discipline, Post, Answer, DisciplineReview
from .serializers import (
    DisciplineSerializer, PostSerializer, AnswerSerializer, DisciplineReviewSerializer
)

class DisciplineViewSet(viewsets.ModelViewSet):
    queryset = Discipline.objects.all().order_by('name')
    serializer_class = DisciplineSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().select_related('author', 'discipline').prefetch_related('answers__author', 'upvotes').order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        discipline_id = self.request.query_params.get('discipline')
        if discipline_id:
            qs = qs.filter(discipline_id=discipline_id)
        
        sort_by = self.request.query_params.get('sort')
        if sort_by == 'most_upvoted':
            qs = qs.annotate(num_upvotes=Count('upvotes')).order_by('-num_upvotes', '-created_at')
        elif sort_by == 'unanswered':
            qs = qs.annotate(num_answers=Count('answers')).filter(num_answers=0).order_by('-created_at')
        return qs

    def perform_create(self, serializer):
        post = serializer.save(author=self.request.user)
        # Recompensa o usuário com +20 XP por criar uma dúvida/discussão
        self.request.user.xp += 20
        self.request.user.save(update_fields=['xp'])

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def upvote(self, request, pk=None):
        post = self.get_object()
        user = request.user
        if post.upvotes.filter(id=user.id).exists():
            post.upvotes.remove(user)
            upvoted = False
        else:
            post.upvotes.add(user)
            upvoted = True
        return Response({
            'upvoted': upvoted,
            'upvotes_count': post.upvotes.count()
        }, status=status.HTTP_200_OK)

class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all().select_related('author', 'post').order_by('created_at')
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        answer = serializer.save(author=self.request.user)
        # Recompensa com +50 XP por responder uma dúvida
        self.request.user.xp += 50
        self.request.user.save(update_fields=['xp'])

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def toggle_solution(self, request, pk=None):
        answer = self.get_object()
        user = request.user

        # Apenas o autor da pergunta, professor ou admin pode validar como solução
        is_author = (user == answer.post.author)
        is_faculty = (user.role in ['PROFESSOR', 'ADMIN'] or user.is_staff)

        if not (is_author or is_faculty):
            return Response(
                {"error": "Apenas o autor da dúvida ou um professor pode marcar a solução."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Alterna status
        answer.is_verified_solution = not answer.is_verified_solution
        if is_faculty:
            answer.validated_by_professor = answer.is_verified_solution

        # Bônus de +100 XP para quem respondeu se for marcado como solução
        if answer.is_verified_solution:
            answer.author.xp += 100
            answer.author.save(update_fields=['xp'])

        answer.save()
        return Response({
            'is_verified_solution': answer.is_verified_solution,
            'validated_by_professor': answer.validated_by_professor
        }, status=status.HTTP_200_OK)

class DisciplineReviewViewSet(viewsets.ModelViewSet):
    queryset = DisciplineReview.objects.all().select_related('author', 'discipline').order_by('-created_at')
    serializer_class = DisciplineReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
