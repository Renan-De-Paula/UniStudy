from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, CurrentUserView, CustomTokenObtainPairView, VerifyEmailView, FriendshipViewSet, RedirecionamentoPosLoginView

router = DefaultRouter()
router.register(r'friendships', FriendshipViewSet, basename='friendship')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify_email'),
    path('me/', CurrentUserView.as_view(), name='current_user'),
    path('redirecionamento_pos_login/', RedirecionamentoPosLoginView.as_view(), name='redirecionamento_pos_login'),
]
