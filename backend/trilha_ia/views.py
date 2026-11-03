import os
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import permissions
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from google import genai
from pydantic import BaseModel
from .models import Trilha

User = get_user_model()

class TopicoSchema(BaseModel):
    title: str
    content_summary: str

class ModuloSchema(BaseModel):
    title: str
    description: str
    topicos: list[TopicoSchema]

class TrilhaSchema(BaseModel):
    title: str
    description: str
    modulos: list[ModuloSchema]

def generate_fallback_trilha(area, nivel, objetivo, vaga_texto=""):
    titulo = f"Trilha de {area}: Do {nivel} ao Avançado" if not vaga_texto else f"Trilha Direcionada: {area}"
    return {
        "title": titulo,
        "description": f"Plano de estudos intensivo para {area}. Objetivo: {objetivo}. Nível inicial: {nivel}.",
        "modulos": [
            {
                "title": f"Módulo 1: Fundamentos e Base Teórica em {area}",
                "description": "Conceitos fundamentais, terminologia técnica, boas práticas e preparação de ambiente.",
                "topicos": [
                    {"title": f"Introdução aos Conceitos Chave de {area}", "content_summary": "Visão geral, terminologias essenciais e ferramentas de trabalho."},
                    {"title": "Estruturas Lógicas e Práticas Iniciais", "content_summary": "Desenvolvimento do raciocínio analítico aplicado à área."},
                    {"title": "Primeiro Projeto Prático Integrador", "content_summary": "Construção de um exercício prático consolidando o aprendizado da base."}
                ]
            },
            {
                "title": f"Módulo 2: Técnicas Avançadas e Arquitetura",
                "description": "Padrões de projeto, modularização, integração com dados e desenvolvimento aprofundado.",
                "topicos": [
                    {"title": "Integração e Manipulação de Dados", "content_summary": "Trabalho com fontes externas de dados, persistência e APIs."},
                    {"title": "Arquitetura Limpa e Padrões de Projeto", "content_summary": "Boas práticas de código, modularidade e manutenibilidade."},
                    {"title": "Testes, Qualidade e Resolução de Problemas", "content_summary": "Metodologias de validação, tratamento de erros e depuração."}
                ]
            },
            {
                "title": f"Módulo 3: Especialização para o Mercado",
                "description": "Requisitos mercadológicos, otimização de performance, portfólio e publicação.",
                "topicos": [
                    {"title": "Otimização, Performance e Boas Práticas", "content_summary": "Melhorias de desempenho, segurança e boas práticas de entrega."},
                    {"title": "Projeto Final de Portfólio", "content_summary": "Desenvolvimento de uma solução completa pronta para apresentação profissional."}
                ]
            }
        ]
    }

class GenerateTrilhaView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data
        
        area = data.get('area', 'Programação')
        nivel = data.get('nivel', 'Iniciante')
        horas_dia = data.get('horas_dia', '2 horas')
        objetivo = data.get('objetivo', 'Aprender do zero')
        vaga_texto = data.get('vaga_texto', '')

        gemini_key = os.getenv("GEMINI_API_KEY")
        trilha_data = None

        if gemini_key and gemini_key != "SUA_CHAVE_AQUI":
            if vaga_texto:
                prompt = f"""
                Atue como um recrutador técnico e tutor acadêmico. Crie uma trilha de estudos personalizada em JSON estruturado para aprovação na seguinte vaga de emprego:
                
                VAGA:
                '{vaga_texto}'
                
                Nível atual do aluno: {nivel}.
                Disponibilidade: {horas_dia} por dia.
                
                Analise as habilidades exigidas pela vaga e gere a trilha exatamente no que ele precisa aprender para ser contratado.
                Retorne exatamente 3 módulos progressivos. Cada módulo deve ter 2 a 3 tópicos extremamente práticos voltados para o mercado.
                """
            else:
                prompt = f"""
                Atue como um tutor acadêmico especialista. Crie uma trilha de estudos personalizada em JSON estruturado.
                O aluno quer estudar: {area}.
                Nível atual: {nivel}.
                Disponibilidade: {horas_dia} por dia.
                Objetivo principal: {objetivo}.
                
                Retorne exatamente 3 módulos. Cada módulo deve ter 2 a 3 tópicos.
                """

            try:
                client = genai.Client(api_key=gemini_key)
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt,
                    config=genai.types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=TrilhaSchema,
                        temperature=0.7
                    )
                )
                trilha_data = json.loads(response.text)
            except Exception as e:
                print(f"[TrilhaIA] Erro na API do Gemini: {e}. Acionando gerador inteligente de contingência.")

        if not trilha_data:
            trilha_data = generate_fallback_trilha(area, nivel, objetivo, vaga_texto)

        trilha = Trilha.objects.create(
            user=request.user,
            titulo=trilha_data.get('title', f'Trilha de {area}'),
            conteudo_gerado=trilha_data
        )

        return Response({
            "message": "Trilha criada com sucesso!",
            "trilha_id": trilha.id,
            "trilha_titulo": trilha.titulo
        }, status=status.HTTP_201_CREATED)

class TrilhaListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        trilhas = Trilha.objects.filter(user=request.user).order_by('-criado_em')
        data = [{
            'id': t.id, 
            'titulo': t.titulo, 
            'criado_em': t.criado_em, 
            'conteudo_gerado': t.conteudo_gerado, 
            'topicos_concluidos': t.topicos_concluidos
        } for t in trilhas]
        return Response(data)

class TrilhaDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, trilha_id):
        try:
            trilha = Trilha.objects.get(id=trilha_id, user=request.user)
            titulo = trilha.titulo
            trilha.delete()
            return Response({
                "message": f"Trilha '{titulo}' excluída com sucesso!",
                "deleted_id": trilha_id
            }, status=status.HTTP_200_OK)
        except Trilha.DoesNotExist:
            return Response({"error": "Trilha não encontrada ou você não tem permissão para excluí-la."}, status=status.HTTP_404_NOT_FOUND)

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
                concluido = False
            else:
                trilha.topicos_concluidos.append(topico_title)
                request.user.xp += 10
                request.user.save(update_fields=['xp'])
                concluido = True
                
            trilha.save()
            
            return Response({
                "message": "Tópico atualizado", 
                "concluido": concluido, 
                "topicos_concluidos": trilha.topicos_concluidos, 
                "new_xp": request.user.xp
            }, status=status.HTTP_200_OK)
        except Trilha.DoesNotExist:
            return Response({"error": "Trilha não encontrada"}, status=status.HTTP_404_NOT_FOUND)
