import os
import json
from functools import lru_cache
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from google import genai
from pydantic import BaseModel
from .models import Trilha

class HabilidadeSchema(BaseModel):
    nome: str
    nivel_exigido: int

class HabilidadesSchema(BaseModel):
    habilidades: list[HabilidadeSchema]

class SemanaSchema(BaseModel):
    semana_numero: int
    foco_principal: str
    dicas_diarias: list[str]

class RoadmapSchema(BaseModel):
    resumo_diagnostico: str
    cronograma_semanal: list[SemanaSchema]

@lru_cache(maxsize=1)
def get_gemini_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY não configurada no ambiente do backend.")
    return genai.Client(api_key=api_key)

def generate_json(prompt, schema):
    client = get_gemini_client()
    response = client.models.generate_content(
        model='gemini-3.5-flash-lite',
        contents=prompt,
        config=genai.types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=schema,
            temperature=0.7
        )
    )
    return json.loads(response.text)

class RequisitosTrilhaView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data
        try:
            curso = data.get('curso') or data.get('area')
            objetivo = data.get('objetivo')
            vaga_texto = data.get('vaga_texto', '')
            if vaga_texto:
                contexto = f"Analise esta vaga:\n{vaga_texto}"
            else:
                if not curso or not objetivo:
                    return Response({"error": "Área/curso e objetivo são obrigatórios."}, status=status.HTTP_400_BAD_REQUEST)
                contexto = f'O estudante cursa/estuda "{curso}" e quer alcançar "{objetivo}".'

            prompt = f"""
Você é um especialista em mercado de trabalho, carreira e educação profissional.
{contexto}
Identifique exatamente 4 habilidades cruciais para esse objetivo.
Considere habilidades técnicas, tecnologias, conhecimentos práticos e exigências reais do mercado.
Retorne níveis de 1 (básico), 2 (intermediário) ou 3 (avançado).
Retorne exclusivamente JSON no formato solicitado.
"""
            resultado = generate_json(prompt, HabilidadesSchema)
            if len(resultado.get('habilidades', [])) != 4:
                raise ValueError("A IA não retornou exatamente 4 habilidades.")
            return Response(resultado)
        except Exception as error:
            return Response({"error": f"Erro ao analisar habilidades na IA: {error}"}, status=status.HTTP_502_BAD_GATEWAY)

class GenerateTrilhaView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data
        perfil = data.get('perfil', {})
        gaps = data.get('gaps', [])

        # Mantém compatibilidade com o formulário antigo do UniStudy.
        if not perfil:
            perfil = {
                'nome': request.user.first_name or request.user.username,
                'curso': data.get('area', 'Programação'),
                'objetivo': data.get('objetivo', 'Aprender do zero'),
                'semanas': int(data.get('semanas', 4)),
                'horasPorDia': float(str(data.get('horas_dia', '2')).split()[0] or 2),
            }
        if not gaps:
            gaps = data.get('habilidades', [])

        semanas = int(perfil.get('semanas', 4))
        horas = perfil.get('horasPorDia', 2)
        nome = perfil.get('nome') or request.user.first_name or request.user.username
        curso = perfil.get('curso') or perfil.get('area') or 'Programação'
        objetivo = perfil.get('objetivo') or 'Aprender do zero'

        try:
            prompt = f"""
Você é um mentor especializado em educação, carreira e planejamento de estudos.
Crie uma trilha personalizada para:
Nome: {nome}
Curso ou área: {curso}
Objetivo profissional: {objetivo}
Tempo disponível: {semanas} semanas
Disponibilidade: {horas} horas por dia

GAPS IDENTIFICADOS:
{json.dumps(gaps, ensure_ascii=False)}

Crie exatamente {semanas} semanas, normalmente com 5 dias de estudo por semana.
Comece pelos fundamentos necessários, aumente gradualmente a dificuldade, priorize os gaps,
inclua exercícios e pequenos projetos e descreva atividades específicas, não genéricas.
Retorne exclusivamente JSON no formato solicitado.
"""
            roadmap = generate_json(prompt, RoadmapSchema)
            if len(roadmap.get('cronograma_semanal', [])) != semanas:
                raise ValueError(f"A IA não retornou exatamente {semanas} semanas.")

            modulos = [
                {
                    'title': semana['foco_principal'],
                    'description': f"Foco e prática da semana {semana['semana_numero']}.",
                    'topicos': [
                        {'title': f"Semana {semana['semana_numero']} - Dia {index + 1}", 'content_summary': atividade}
                        for index, atividade in enumerate(semana['dicas_diarias'])
                    ],
                }
                for semana in roadmap['cronograma_semanal']
            ]
            trilha_data = {
                'title': f"Trilha de {objetivo}",
                'description': roadmap['resumo_diagnostico'],
                'modulos': modulos,
                'cronograma_semanal': roadmap['cronograma_semanal'],
                'perfil': perfil,
                'gaps': gaps,
            }
        except (ValueError, TypeError) as error:
            return Response({"error": f"Dados inválidos para gerar a trilha: {error}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as error:
            return Response({"error": f"Erro ao gerar trilha na IA: {error}"}, status=status.HTTP_502_BAD_GATEWAY)

        trilha = Trilha.objects.create(
            user=request.user,
            titulo=trilha_data['title'],
            conteudo_gerado=trilha_data
        )

        return Response({
            "message": "Trilha criada com sucesso!",
            "trilha_id": trilha.id,
            "trilha_titulo": trilha.titulo,
            "trilha": trilha_data,
        }, status=status.HTTP_201_CREATED)

class TrilhaListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        trilhas = Trilha.objects.filter(user=request.user).order_by('-criado_em')
        data = [{'id': t.id, 'titulo': t.titulo, 'criado_em': t.criado_em, 'conteudo_gerado': t.conteudo_gerado, 'topicos_concluidos': t.topicos_concluidos} for t in trilhas]
        return Response(data)

class ToggleTopicoView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, trilha_id):
        try:
            trilha = Trilha.objects.get(id=trilha_id, user=request.user)
            topico_title = request.data.get('topico_title')
            
            if not topico_title:
                return Response({"error": "topico_title is required"}, status=status.HTTP_400_BAD_REQUEST)
                
            if topico_title in trilha.topicos_concluidos:
                trilha.topicos_concluidos.remove(topico_title)
                # Opcional: remover XP (request.user.xp -= 10) se quiser ser punitivo, mas vamos deixar s na adio
                concluido = False
            else:
                trilha.topicos_concluidos.append(topico_title)
                request.user.xp += 10
                request.user.save()
                concluido = True
                
            trilha.save()
            
            return Response({"message": "Tpico atualizado", "concluido": concluido, "topicos_concluidos": trilha.topicos_concluidos, "new_xp": request.user.xp}, status=status.HTTP_200_OK)
        except Trilha.DoesNotExist:
            return Response({"error": "Trilha no encontrada"}, status=status.HTTP_404_NOT_FOUND)
