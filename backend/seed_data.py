import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'unistudy_hub.settings')
django.setup()

from accounts.models import User, UserRole
from community.models import Discipline, Post, Answer
from squads.models import Squad

def seed():
    # Criação de Usuários
    if not User.objects.filter(username='prof_alan').exists():
        prof = User.objects.create_user(
            username='prof_alan', password='123', email='alan@uni.edu',
            role=UserRole.PROFESSOR, is_mentor=True, xp=1000
        )
        print("Professor Alan criado.")
    else:
        prof = User.objects.get(username='prof_alan')

    if not User.objects.filter(username='aluno_joao').exists():
        aluno = User.objects.create_user(
            username='aluno_joao', password='123', email='joao@uni.edu',
            role=UserRole.STUDENT, course='Engenharia de Software', semester=3, xp=50
        )
        print("Aluno João criado.")
    else:
        aluno = User.objects.get(username='aluno_joao')

    # Disciplinas
    d1, _ = Discipline.objects.get_or_create(name='Algoritmos e Estrutura de Dados', code='AED101', course='TI', semester=1)
    d2, _ = Discipline.objects.get_or_create(name='Banco de Dados', code='BD201', course='TI', semester=2)
    d3, _ = Discipline.objects.get_or_create(name='Cálculo', code='CALC101', course='Engenharia', semester=1)

    # Post / Dúvida
    if not Post.objects.filter(title='Como balancear uma árvore AVL?').exists():
        post = Post.objects.create(
            author=aluno, discipline=d1, title='Como balancear uma árvore AVL?',
            content='Estou com dificuldade em entender as rotações LL e RR.', is_question=True
        )
        print("Post criado.")
        
        # Resposta do Professor
        Answer.objects.create(
            post=post, author=prof, content='Lembre-se que a rotação LL (Left-Left) ocorre quando inserimos no sub-filho esquerdo do filho esquerdo.',
            is_verified_solution=True, validated_by_professor=True
        )
        print("Resposta do professor criada.")
    
    # Squads
    if not Squad.objects.filter(title='TCC - Aplicativo de Mobilidade').exists():
        Squad.objects.create(
            title='TCC - Aplicativo de Mobilidade',
            description='Buscamos dev mobile e designer para app de caronas na faculdade.',
            leader=aluno,
            needed_skills=['React Native', 'Figma', 'Node.js'],
            available_shifts='Noite',
            max_members=4
        )
        print("Squad criado.")

if __name__ == '__main__':
    print("Iniciando Seed de Dados...")
    seed()
    print("Seed Concluído com Sucesso!")
