from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.utils import timezone
from .models import EmailVerificationToken, Friendship, FriendshipStatus
from .serializers import UserSerializer, RegisterSerializer, CustomTokenObtainPairSerializer, VerifyEmailSerializer, FriendshipSerializer

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
        return Friendship.objects.filter(Q(requester=user) | Q(receiver=user)).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(requester=self.request.user)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        friendship = self.get_object()
        if friendship.receiver != request.user:
            return Response({"error": "Não autorizado."}, status=status.HTTP_403_FORBIDDEN)
        friendship.status = FriendshipStatus.ACCEPTED
        friendship.save()
        return Response({"status": "Amizade aceita."})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        friendship = self.get_object()
        if friendship.receiver != request.user:
            return Response({"error": "Não autorizado."}, status=status.HTTP_403_FORBIDDEN)
        friendship.status = FriendshipStatus.REJECTED
        friendship.save()
        return Response({"status": "Amizade recusada."})


from rest_framework.views import APIView

class RedirecionamentoPosLoginView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.trilhas.count() == 0:
            return Response({'redirect_to': '/onboarding'})
        else:
            return Response({'redirect_to': '/'})

