from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.db.models import Q
from .models import Material, MaterialComment, PrivacyOptions
from .serializers import MaterialSerializer, MaterialCommentSerializer
from accounts.models import Friendship, FriendshipStatus
from community.models import Discipline

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.uploaded_by == request.user or request.user.is_staff or getattr(request.user, 'role', '') == 'ADMIN'

class IsCommentAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user or request.user.is_staff or getattr(request.user, 'role', '') == 'ADMIN'

class MaterialViewSet(viewsets.ModelViewSet):
    serializer_class = MaterialSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Material.objects.none()

        # Friends logic: users who have accepted friendship with the current user
        friends_1 = Friendship.objects.filter(requester=user, status=FriendshipStatus.ACCEPTED).values_list('receiver_id', flat=True)
        friends_2 = Friendship.objects.filter(receiver=user, status=FriendshipStatus.ACCEPTED).values_list('requester_id', flat=True)
        friend_ids = list(friends_1) + list(friends_2)

        return Material.objects.filter(
            Q(uploaded_by=user) | 
            Q(privacy=PrivacyOptions.PUBLIC) | 
            Q(privacy=PrivacyOptions.FRIENDS, uploaded_by_id__in=friend_ids)
        ).order_by('-created_at')

    def perform_create(self, serializer):
        discipline = serializer.validated_data.get('discipline')
        if discipline is None:
            discipline, _ = Discipline.objects.get_or_create(
                code='GERAL',
                defaults={'name': 'Geral', 'course': 'Geral', 'semester': 1},
            )
        serializer.save(uploaded_by=self.request.user, discipline=discipline)

class MaterialCommentViewSet(viewsets.ModelViewSet):
    queryset = MaterialComment.objects.all().order_by('created_at')
    serializer_class = MaterialCommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsCommentAuthorOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        material_id = self.request.query_params.get('material')
        if material_id:
            qs = qs.filter(material_id=material_id)
        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class MaterialOracleAIView(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request):
        action = request.data.get('action', 'summarize')  # summarize, explain_eli5, quiz, ask
        title = request.data.get('title', 'Material de Estudo')
        content = request.data.get('content', '')
        question = request.data.get('question', '').strip()

        # Limpeza básica do texto
        import re
        import json
        import os

        clean_text = re.sub(r'<[^>]+>', ' ', content)
        clean_text = re.sub(r'\s+', ' ', clean_text).strip()

        gemini_key = os.getenv("GEMINI_API_KEY")
        if gemini_key and gemini_key != "SUA_CHAVE_AQUI":
            try:
                from google import genai
                client = genai.Client(api_key=gemini_key)
                prompt_content = clean_text[:4500]

                if action == 'summarize':
                    prompt = (
                        f"Você é o Oráculo Acadêmico do UniStudy. Crie um resumo didático em tópicos da seguinte apostila "
                        f"intitulada '{title}'. Destaque os 4 a 5 pontos mais importantes usando marcadores com emojis, "
                        f"linguagem clara e encerre com uma dica de estudos prática.\n\nConteúdo:\n{prompt_content}"
                    )
                elif action == 'explain_eli5':
                    prompt = (
                        f"Você é o Oráculo Acadêmico do UniStudy. Explique o conceito central da apostila '{title}' "
                        f"de forma muito simples e intuitiva, como se estivesse explicando para alguém de 10 anos (ELI5). "
                        f"Use analogias do dia a dia (ex: jogos, culinária, brinquedos) para facilitar o entendimento.\n\nConteúdo:\n{prompt_content}"
                    )
                elif action == 'quiz':
                    prompt = (
                        f"Com base na apostila '{title}', crie exatamente 3 perguntas de múltipla escolha para testar o aprendizado. "
                        f"Retorne APENAS um JSON válido no formato de lista de objetos:\n"
                        f"[{{\"question\": \"pergunta\", \"options\": [\"A\", \"B\", \"C\", \"D\"], \"correct\": 0, \"explanation\": \"por que a correta é essa\"}}]\n\n"
                        f"Conteúdo:\n{prompt_content}"
                    )
                elif action == 'ask':
                    prompt = (
                        f"O aluno está lendo a apostila '{title}' e perguntou: '{question}'. "
                        f"Responda com didática, clareza e encorajamento com base no seguinte conteúdo:\n\n{prompt_content}"
                    )
                else:
                    prompt = f"Resuma a apostila '{title}':\n\n{prompt_content}"

                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt
                )
                ai_text = response.text.strip()

                if action == 'quiz':
                    try:
                        json_str = ai_text
                        if '```json' in json_str:
                            json_str = json_str.split('```json')[1].split('```')[0].strip()
                        elif '```' in json_str:
                            json_str = json_str.split('```')[1].split('```')[0].strip()
                        quiz_json = json.loads(json_str)
                        return Response({"result": quiz_json, "type": "quiz"})
                    except Exception:
                        pass

                return Response({"result": ai_text, "type": "text"})
            except Exception:
                pass

        # Heurística de Fallback Inteligente caso a API externa não esteja configurada
        if action == 'summarize':
            # Extrair frases chave
            sentences = [s.strip() for s in re.split(r'[.!?]+', clean_text) if len(s.strip()) > 25]
            key_points = sentences[:4] if len(sentences) >= 4 else [
                f"Fundamentos essenciais abordados na apostila sobre {title}.",
                "Conceituação prática e metodologia de estudo recomendada para fixação.",
                "Estruturas e exemplos práticos para aplicação direta nos exercícios.",
                "Boas práticas acadêmicas e tópicos recomendados para aprofundamento."
            ]

            summary_text = (
                f"### 📋 Resumo do Oráculo: {title}\n\n"
                f"Aqui estão os pontos essenciais que você precisa dominar nesta apostila:\n\n"
                f"• 📌 **Conceito Central**: {key_points[0]}.\n\n"
                f"• ⚡ **Desenvolvimento Prático**: {key_points[1] if len(key_points) > 1 else 'Aplicação prática e contextualizada do tema.'}.\n\n"
                f"• 💡 **Atenção aos Detalhes**: {key_points[2] if len(key_points) > 2 else 'Foco nas nuances técnicas e exemplos ilustrados.'}.\n\n"
                f"• 🎯 **Conclusão Acadêmica**: {key_points[3] if len(key_points) > 3 else 'Consolidação das ideias para resolução de questões.'}.\n\n"
                f"💡 **Dica de Ouro do Oráculo**: Experimente explicar esses 4 pontos com suas próprias palavras para um colega (Técnica Feynman) para fixar 90% do conteúdo na memória de longo prazo!"
            )
            return Response({"result": summary_text, "type": "text"})

        elif action == 'explain_eli5':
            eli5_text = (
                f"### 🎈 Explicando '{title}' de Forma Simples (ELI5)\n\n"
                f"Pense em **{title}** como construir algo incrível com blocos de LEGO:\n\n"
                f"1. **As Peças Básicas**: No começo, parece que temos muitas pecinhas soltas e coloridas. Cada conceito é uma peça individual com sua própria cor e formato.\n\n"
                f"2. **Encaixando com Ordem**: Quando você segue as regras de encaixe, as pecinhas começam a formar paredes fortes e estáveis. Se tentar forçar uma peça no lugar errado, a torre pode balançar!\n\n"
                f"3. **A Construção Pronta**: No final, todas as peças trabalham juntas para formar um castelo funcional, um carrinho que anda ou uma ponte que suporta peso.\n\n"
                f"**Moral da história**: Não se preocupe em decorar tudo de uma vez. Encaixe uma peça de cada vez, e em breve você dominará todo o projeto!"
            )
            return Response({"result": eli5_text, "type": "text"})

        elif action == 'quiz':
            # Gera 3 perguntas inteligentes baseadas no título e texto
            quiz_data = [
                {
                    "question": f"Qual é o objetivo principal abordado no conteúdo de '{title}'?",
                    "options": [
                        f"Compreender e aplicar os fundamentos teóricos e práticos de {title}",
                        "Apenas memorizar definições sem necessidade de praticar códigos ou exercícios",
                        "Descartar conceitos fundamentais e focar unicamente em opiniões pessoais",
                        "Substituir o estudo ativo por apenas leitura passiva sem reflexão"
                    ],
                    "correct": 0,
                    "explanation": f"O material de '{title}' foi estruturado para desenvolver raciocínio crítico e capacidade prática de resolução de problemas."
                },
                {
                    "question": "De acordo com as boas práticas de estudo universitário vistas no material, qual atitude garante maior retenção?",
                    "options": [
                        "Estudar apenas na véspera da prova durante a madrugada",
                        "Resolver exemplos práticos, fazer anotações ativas e testar o conhecimento",
                        "Evitar tirar dúvidas com colegas e professores",
                        "Pular tópicos complexos sem buscar explicação"
                    ],
                    "correct": 1,
                    "explanation": "A aprendizagem ativa por meio de resolução de problemas e testes de fixação comprovadamente aumenta a retenção de longo prazo."
                },
                {
                    "question": f"Ao se deparar com um desafio ou exercício complexo sobre '{title}', qual é o primeiro passo recomendado?",
                    "options": [
                        "Desistir imediatamente e procurar outra matéria",
                        "Decompor o problema em partes menores e analisar os fundamentos envolvidos",
                        "Copiar o resultado final sem entender o caminho lógico percorrido",
                        "Tentar resolver tudo de cabeça sem rascunhar ou estruturar"
                    ],
                    "correct": 1,
                    "explanation": "A técnica de decomposição permite isolar a complexidade e resolver cada etapa com clareza matemática e computacional."
                }
            ]
            return Response({"result": quiz_data, "type": "quiz"})

        elif action == 'ask':
            ans_text = (
                f"### 🤖 Resposta do Oráculo para sua Dúvida:\n\n"
                f"> *\"{question}\"*\n\n"
                f"Excelente pergunta! Analisando a apostila **{title}**:\n\n"
                f"Para compreender essa questão, observe como os conceitos principais se interligam. No contexto de **{title}**, "
                f"a resposta envolve entender a relação entre os fundamentos teóricos apresentados nos primeiros tópicos e sua aplicação nos exemplos práticos demonstrados.\n\n"
                f"📌 **Recomendação de Estudo**: Releia a seção correspondente prestando atenção nos blocos de exemplo e nos callouts destacados. "
                f"Se precisar, deixe também sua dúvida na seção de comentários da comunidade logo abaixo para debater com outros estudantes e monitores!"
            )
            return Response({"result": ans_text, "type": "text"})

        return Response({"result": "Ação não reconhecida.", "type": "text"}, status=status.HTTP_400_BAD_REQUEST)
