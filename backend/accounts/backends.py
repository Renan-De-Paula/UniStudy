from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

class EmailOrUsernameModelBackend(ModelBackend):
    """
    Permite autenticação tanto por nome de usuário (username)
    quanto por endereço de e-mail (email), de forma insensível a maiúsculas/minúsculas.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        
        # Suporta se for passado como 'username' ou 'email'
        identifier = username or kwargs.get('email')
        if not identifier or not password:
            return None

        identifier = identifier.strip()

        try:
            # Busca por username ou email (case-insensitive)
            user = UserModel.objects.filter(
                Q(username__iexact=identifier) | Q(email__iexact=identifier)
            ).first()
        except UserModel.DoesNotExist:
            return None

        if user and user.check_password(password) and self.user_can_authenticate(user):
            return user

        return None
