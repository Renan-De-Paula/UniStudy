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
            role=UserRole.PROFESSOR, is_mentor=True, xp=1000, is_email_verified=True
        )
        print("Professor Alan criado.")
    else:
        prof = User.objects.get(username='prof_alan')

    if not User.objects.filter(username='aluno_joao').exists():
        aluno = User.objects.create_user(
            username='aluno_joao', password='123', email='joao@uni.edu',
            role=UserRole.STUDENT, course='Engenharia de Software', semester=3, xp=50, is_email_verified=True
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

    # 4. Itens da Loja de Gamificação & Personalização
    from gamification.models import StoreItem, Quiz
    from gamification.views import setup_quiz_badges

    store_items = [
        {"name": "Moldura Neon Cyberpunk", "item_type": "AVATAR_FRAME", "cost_xp": 150, "description": "Moldura holográfica brilhante para seu avatar.", "asset_url": "border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.85)] ring-2 ring-fuchsia-500"},
        {"name": "Moldura Dourada Real", "item_type": "AVATAR_FRAME", "cost_xp": 300, "description": "Borda de ouro polido para destacar suas postagens.", "asset_url": "border-amber-400 shadow-[0_0_22px_rgba(251,191,36,0.9)] ring-2 ring-yellow-300"},
        {"name": "Tema Dark Matrix", "item_type": "THEME_COLOR", "cost_xp": 200, "description": "Esquema de cores verde esmeralda e preto profundo.", "asset_url": "from-emerald-950/90 via-slate-900 to-teal-950/80 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]"},
        {"name": "Tema Sunset Synthwave", "item_type": "THEME_COLOR", "cost_xp": 250, "description": "Gradiente roxo e laranja neon para personalizar seu painel.", "asset_url": "from-pink-950/80 via-purple-950/70 to-amber-950/70 border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.3)]"},
        {"name": "Selo Perfil Verificado", "item_type": "PROFILE_BADGE", "cost_xp": 500, "description": "Badge exclusiva de autenticidade acadêmica no UniStudy.", "asset_url": "⭐"},
        {"name": "Guia Definitivo de Carreiras Tech", "item_type": "PREMIUM_CONTENT", "cost_xp": 400, "description": "E-book exclusivo com roadmaps e dicas para o mercado.", "asset_url": None},
        {"name": "Moldura Chama Dracônica", "item_type": "AVATAR_FRAME", "cost_xp": 350, "description": "Borda incandescente em tons de fogo e ouro com aura pulsante de energia para guerreiros do estudo.", "asset_url": "border-orange-500 shadow-[0_0_25px_rgba(249,115,22,0.85)] ring-2 ring-amber-400"},
        {"name": "Tema Cósmico Estelar", "item_type": "THEME_COLOR", "cost_xp": 300, "description": "Gradiente espacial profundo com nebulosas em violeta cósmico, constelações e brilho estelar para sua interface de estudo.", "asset_url": "from-indigo-950/90 via-purple-950/70 to-slate-900 border-indigo-400/50 shadow-[0_0_35px_rgba(129,140,248,0.35)]"},
        {"name": "Moldura Glacial do Ártico", "item_type": "AVATAR_FRAME", "cost_xp": 250, "description": "Borda cristalina de gelo eterno com aura ciano congelante e reflexos brilhantes para quem mantém a mente fria e focada nos estudos.", "asset_url": "border-cyan-300 shadow-[0_0_25px_rgba(103,232,249,0.85)] ring-2 ring-blue-400"},
        {"name": "Selo Coruja da Sabedoria", "item_type": "PROFILE_BADGE", "cost_xp": 200, "description": "Emblema lendário da coruja guardiã do conhecimento. Exibe o selo místico de sabedoria ao lado do seu nome em todo o UniStudy.", "asset_url": "🦉"},
        {"name": "Guia Mestre de Algoritmos & Estruturas de Dados", "item_type": "PREMIUM_CONTENT", "cost_xp": 450, "description": "Apostila premium com mapas mentais, análise de complexidade Big-O e mais de 50 exercícios resolvidos de árvores, grafos e ordenação.", "asset_url": "https://raw.githubusercontent.com/unistudy/materials/main/algoritmos-guia.pdf"},
        {"name": "Moldura Cyber-Volt Relâmpago", "item_type": "AVATAR_FRAME", "cost_xp": 320, "description": "Borda eletrificada em tons de azul neon elétrico e ultravioleta com aura de descarga estática para mentes ultra velozes.", "asset_url": "border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.9)] ring-2 ring-purple-400"},
        {"name": "Selo Café com Código", "item_type": "PROFILE_BADGE", "cost_xp": 150, "description": "Para quem transforma café em código e dedicação nos estudos madruga adentro. Exibe o emblema da xícara fumegante ao lado do seu nome no perfil.", "asset_url": "☕"},
        {"name": "Tema Floresta Esmeralda Mística", "item_type": "THEME_COLOR", "cost_xp": 280, "description": "Gradiente orgânico com tons profundos de verde esmeralda, musgo bioluminescente e reflexos de folhas mágicas para sua área de estudos.", "asset_url": "from-emerald-950/90 via-teal-950/70 to-slate-900 border-emerald-400/50 shadow-[0_0_35px_rgba(52,211,153,0.35)]"},
        {"name": "Moldura Ametista Astral", "item_type": "AVATAR_FRAME", "cost_xp": 290, "description": "Borda mística lapidada em cristal ametista púrpura com pulsação arcana e reflexos dimensionais para mentes estrategistas.", "asset_url": "border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.85)] ring-2 ring-fuchsia-400"},
        {"name": "Selo Mestre Lendário dos Quizzes", "item_type": "PROFILE_BADGE", "cost_xp": 600, "description": "O distintivo supremo concedido àqueles que conquistaram o topo do conhecimento e gabaritaram os desafios mais árduos da plataforma.", "asset_url": "👑"},
        {"name": "Moldura Égide de Titânio", "item_type": "AVATAR_FRAME", "cost_xp": 380, "description": "Borda blindada forjada em liga de titânio puro com anel de plasma defensivo para quem tem foco impenetrável.", "asset_url": "border-slate-300 shadow-[0_0_25px_rgba(203,213,225,0.9)] ring-2 ring-indigo-400"},
        {"name": "Tema Cyberpunk Neon Tokyo", "item_type": "THEME_COLOR", "cost_xp": 300, "description": "Paisagem noturna futurista inspirada em Tóquio, com arranha-céus, luzes em magenta e ciano elétrico para o visual do seu perfil.", "asset_url": "from-fuchsia-950/90 via-slate-900 to-cyan-950/80 border-fuchsia-500/50 shadow-[0_0_35px_rgba(217,70,239,0.35)]"}
    ]

    for s_item in store_items:
        obj, was_created = StoreItem.objects.update_or_create(
            name=s_item['name'],
            defaults={
                'item_type': s_item['item_type'],
                'cost_xp': s_item['cost_xp'],
                'description': s_item['description'],
                'asset_url': s_item['asset_url']
            }
        )

    print(f"Loja sincronizada: {len(store_items)} itens disponíveis.")

    # 5. Quizzes Iniciais com Selos Automáticos
    if not Quiz.objects.filter(title='Fundamentos de Python').exists():
        q_py = Quiz.objects.create(
            creator=prof,
            title='Fundamentos de Python',
            description='Teste seus conhecimentos básicos de sintaxe, laços e funções.',
            category='Programação',
            difficulty='Iniciante',
            xp_reward=150,
            badge_emoji='🐍',
            badge_title='Mestre em Python',
            badge_description='Dominou sintaxe, estruturas condicionais e funções em Python.',
            questions=[
                {"id": 1, "text": "Qual das opções abaixo é uma estrutura de repetição em Python?", "options": ["if", "for", "def", "import"], "correct": 1},
                {"id": 2, "text": "Como se define uma função em Python?", "options": ["function myFunc()", "def myFunc():", "func myFunc()", "create myFunc()"], "correct": 1},
                {"id": 3, "text": "Qual o tipo de dado resultante de: type(3.14)?", "options": ["int", "string", "float", "double"], "correct": 2}
            ]
        )
        setup_quiz_badges(q_py)
        print("Quiz Fundamentos de Python e selos criados.")

if __name__ == '__main__':
    print("Iniciando Seed de Dados...")
    seed()
    print("Seed Concluído com Sucesso!")
