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

class GenerateTrilhaView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data
        
        area = data.get('area', 'Programação')
        nivel = data.get('nivel', 'Iniciante')
        horas_dia = data.get('horas_dia', '2 horas')
        objetivo = data.get('objetivo', 'Aprender do zero')
        vaga_texto = data.get('vaga_texto', '')

        client = genai.Client(api_key=os.getenv("GEMINI_API_KEY", "SUA_CHAVE_AQUI"))
        
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
            response = client.models.generate_content(
                model='gemini-3.5-flash',
                contents=prompt,
                config=genai.types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=TrilhaSchema,
                    temperature=0.7
                )
            )
            trilha_data = json.loads(response.text)
        except Exception as e:
            return Response({"error": f"Erro ao gerar trilha na IA: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
