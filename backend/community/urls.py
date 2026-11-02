from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DisciplineViewSet, PostViewSet, AnswerViewSet, DisciplineReviewViewSet

router = DefaultRouter()
router.register(r'disciplines', DisciplineViewSet, basename='discipline')
router.register(r'posts', PostViewSet, basename='post')
router.register(r'answers', AnswerViewSet, basename='answer')
router.register(r'reviews', DisciplineReviewViewSet, basename='review')

urlpatterns = [
    path('', include(router.urls)),
]
