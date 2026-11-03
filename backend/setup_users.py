import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'unistudy_hub.settings')
django.setup()

from django.contrib.auth import get_user_model
from accounts.models import UserRole

User = get_user_model()

def setup():
    print("=" * 60)
    print("CONFIGURANDO USUARIOS E CREDENCIAIS DO UNISTUDY HUB")
    print("=" * 60)

    # 1. Trocar admin@lab220.com.br por Admin@unistudy.edu (senha "admin")
    old_admin = User.objects.filter(email='admin@lab220.com.br').first()
    if old_admin:
        old_admin.email = 'Admin@unistudy.edu'
        old_admin.username = 'admin'
        old_admin.set_password('admin')
        old_admin.role = UserRole.ADMIN
        old_admin.is_staff = True
        old_admin.is_superuser = True
        old_admin.is_active = True
        old_admin.is_email_verified = True
        old_admin.first_name = 'Administrador'
        old_admin.last_name = 'Geral'
        old_admin.save()
        print(" -> Admin geral atualizado: 'admin' / 'Admin@unistudy.edu' (senha: 'admin')")
    else:
        u, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'Admin@unistudy.edu',
                'role': UserRole.ADMIN,
                'is_staff': True,
                'is_superuser': True,
                'is_active': True,
                'is_email_verified': True,
                'first_name': 'Administrador',
                'last_name': 'Geral',
            }
        )
        u.email = 'Admin@unistudy.edu'
        u.set_password('admin')
        u.role = UserRole.ADMIN
        u.is_staff = True
        u.is_superuser = True
        u.is_active = True
        u.is_email_verified = True
        u.save()
        print(" -> Admin geral configurado: 'admin' / 'Admin@unistudy.edu' (senha: 'admin')")

    # 2. Configurar prof_Renan (rsdepaula2014@gmail.com, senha 123456, admin sim)
    renan = User.objects.filter(email='rsdepaula2014@gmail.com').first()
    if not renan:
        renan = User.objects.filter(username='prof_Renan').first()
    if not renan:
        renan = User.objects.filter(username='rsdepaula2014').first()

    if renan:
        renan.username = 'prof_Renan'
        renan.email = 'rsdepaula2014@gmail.com'
        renan.set_password('123456')
        renan.role = UserRole.ADMIN
        renan.is_staff = True
        renan.is_superuser = True
        renan.is_active = True
        renan.is_email_verified = True
        renan.is_mentor = True
        renan.first_name = 'Renan'
        renan.last_name = 'de Paula'
        renan.xp = 3000
        renan.save()
        print(" -> Prof. Renan atualizado: 'prof_Renan' / 'rsdepaula2014@gmail.com' (senha: '123456', Admin: SIM)")
    else:
        renan = User.objects.create_superuser(
            username='prof_Renan',
            email='rsdepaula2014@gmail.com',
            password='123456',
            role=UserRole.ADMIN,
            is_staff=True,
            is_superuser=True,
            is_active=True,
            is_email_verified=True,
            is_mentor=True,
            first_name='Renan',
            last_name='de Paula',
            xp=3000
        )
        print(" -> Prof. Renan criado: 'prof_Renan' / 'rsdepaula2014@gmail.com' (senha: '123456', Admin: SIM)")

    # 3. Integrantes do Grupo (Matheus, Suedson, Milly, Larissa, Davi, Diego)
    # Contas de Admin para cada integrante:
    members_admin = [
        ('matheus', 'Matheus', 'matheus@unistudy.edu', '123456'),
        ('suedson', 'Suedson', 'suedson@unistudy.edu', '123456'),
        ('milly', 'Milly', 'milly@unistudy.edu', '123456'),
        ('larissa', 'Larissa', 'larissa@unistudy.edu', '123456'),
        ('davi', 'Davi', 'davi@unistudy.edu', '123456'),
        ('diego', 'Diego', 'diego@unistudy.edu', '123456'),
    ]

    print("\n--- Criando / Atualizando Contas de Administrador para os Integrantes ---")
    for username, name, email, pwd in members_admin:
        u = User.objects.filter(email=email).first() or User.objects.filter(username=username).first()
        if not u:
            u = User(username=username, email=email)
        u.username = username
        u.email = email
        u.first_name = name
        u.role = UserRole.ADMIN
        u.is_staff = True
        u.is_superuser = True
        u.is_active = True
        u.is_email_verified = True
        u.set_password(pwd)
        u.xp = 2500
        u.save()
        print(f" -> Admin {name}: usuário '{username}' / email '{email}' / senha '{pwd}'")

    # Contas Intercaladas (Estudantes e Professores para testes de papéis)
    # Intercalado:
    # Matheus -> Estudante
    # Suedson -> Professor
    # Milly   -> Estudante
    # Larissa -> Professora
    # Davi    -> Estudante
    # Diego   -> Professor
    members_roles = [
        ('matheus_aluno', 'Matheus Aluno', 'matheus.aluno@unistudy.edu', '123456', UserRole.STUDENT, 450, False),
        ('prof_suedson', 'Prof. Suedson', 'suedson.prof@unistudy.edu', '123456', UserRole.PROFESSOR, 1500, True),
        ('milly_aluna', 'Milly Aluna', 'milly.aluna@unistudy.edu', '123456', UserRole.STUDENT, 380, False),
        ('prof_larissa', 'Prof. Larissa', 'larissa.prof@unistudy.edu', '123456', UserRole.PROFESSOR, 1400, True),
        ('davi_aluno', 'Davi Aluno', 'davi.aluno@unistudy.edu', '123456', UserRole.STUDENT, 520, False),
        ('prof_diego', 'Prof. Diego', 'diego.prof@unistudy.edu', '123456', UserRole.PROFESSOR, 1600, True),
    ]

    print("\n--- Criando / Atualizando Contas Intercaladas (Estudantes & Professores) ---")
    for username, name, email, pwd, role, xp, is_mentor in members_roles:
        u = User.objects.filter(email=email).first() or User.objects.filter(username=username).first()
        if not u:
            u = User(username=username, email=email)
        u.username = username
        u.email = email
        u.first_name = name.split()[0]
        u.last_name = name.split()[1] if len(name.split()) > 1 else ''
        u.role = role
        u.is_staff = False
        u.is_superuser = False
        u.is_active = True
        u.is_email_verified = True
        u.is_mentor = is_mentor
        u.xp = xp
        u.set_password(pwd)
        u.save()
        print(f" -> {role} {name}: usuário '{username}' / email '{email}' / senha '{pwd}'")

    print("\nTotal de usuários no banco:", User.objects.count())
    print("=" * 60)
    print("CONFIGURACAO CONCLUIDA COM SUCESSO! (Apenas os 14 usuários oficiais do Guia)")
    print("=" * 60)

if __name__ == '__main__':
    setup()
