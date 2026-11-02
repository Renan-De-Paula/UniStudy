from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GamificationViewSet, QuizViewSet

router = DefaultRouter()
router.register(r'quizzes', QuizViewSet, basename='quizzes')
router.register(r'', GamificationViewSet, basename='gamification')

urlpatterns = [
    path('buy_item/<int:pk>/', GamificationViewSet.as_view({'post': 'buy_item'}), name='gamification-buy-item-compat'),
    path('', include(router.urls)),
]
