from django.urls import path

from .views import AnswerCreateView, AnswerSolutionView, PostListCreateView, PostVoteView

urlpatterns = [
    path('posts/', PostListCreateView.as_view(), name='community-posts'),
    path('posts/<int:post_id>/answers/', AnswerCreateView.as_view(), name='community-answers'),
    path('posts/<int:post_id>/vote/', PostVoteView.as_view(), name='community-vote'),
    path('posts/<int:post_id>/answers/<int:answer_id>/solution/', AnswerSolutionView.as_view(), name='community-solution'),
]
