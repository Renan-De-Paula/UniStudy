---
name: unistudy-hub-architect
description: Skill de engenharia de software e arquitetura de produto para guiar o Antigravity na construção completa, modular e autônoma da plataforma UniStudy Hub (Django REST + React + PostgreSQL).
---

# UniStudy Hub Architect Skill

Esta skill fornece diretrizes de arquitetura, padrões de código, modelagem de dados e planos de implementação passo a passo para construir a plataforma **UniStudy Hub** (Ecossistema Acadêmico Colaborativo para Estudantes e Mestres).

## 🎯 Escopo do Sistema

O UniStudy Hub é dividido em 4 pilares acadêmicos fundamentais:
1. **Comunidade & Fórum por Disciplina:** Fóruns organizados por Curso -> Semestre -> Matéria, com suporte a upvotes, respostas verificadas e validação docente.
2. **Squads de Estudo ("Encontre sua Equipe"):** Criação e busca de grupos acadêmicos com filtros por habilidades faltantes, horários e propósito (TCC, Trabalhos, Iniciação Científica).
3. **Painel do Mestre & Mentoria:** Espaço do professor para gestão de dúvidas frequentes, mapa de calor de matérias críticas e nomeação de monitores.
4. **Repositório Acadêmico & Gamificação:** Biblioteca de materiais abertos/resumos e ranking de reputação meritocrática ("Aprenda Ensinando" - XP por soluções úteis).

---

## 🛠️ Stack Tecnológica & Padrões

* **Backend:** Python 3.11+, Django 5.x, Django REST Framework (DRF), `django-cors-headers`, `djangorestframework-simplejwt`.
* **Banco de Dados:** PostgreSQL (com suporte a JSONB para tags/skills).
* **Frontend:** React 18+ (Vite), TailwindCSS, Lucide-React (ícones), Axios, React Router Dom.
* **Infraestrutura:** Docker & Docker Compose para orquestração local e deploy simplificado.

---

## 🏛️ Modelagem de Dados Relacional (Django Models Blueprint)

```python
# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class UserRole(models.TextChoices):
    STUDENT = 'STUDENT', 'Estudante'
    PROFESSOR = 'PROFESSOR', 'Professor / Mestre'
    ADMIN = 'ADMIN', 'Administrador'

class User(AbstractUser):
    role = models.CharField(max_length=20, choices=UserRole.choices, default=UserRole.STUDENT)
    course = models.CharField(max_length=150, blank=True, null=True)
    semester = models.IntegerField(default=1, blank=True, null=True)
    xp = models.IntegerField(default=0)
    is_mentor = models.BooleanField(default=False)
    bio = models.TextField(blank=True, null=True)
    skills = models.JSONField(default=list, blank=True)

# community/models.py
from django.db import models
from django.conf import settings

class Discipline(models.Model):
    name = models.CharField(max_length=150)
    code = models.CharField(max_length=20, unique=True)
    course = models.CharField(max_length=150)
    semester = models.IntegerField(default=1)

class Post(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
    discipline = models.ForeignKey(Discipline, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=255)
    content = models.TextField()
    is_question = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    upvotes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='upvoted_posts', blank=True)

class Answer(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='answers')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='answers')
    content = models.TextField()
    is_verified_solution = models.BooleanField(default=False)
    validated_by_professor = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

# squads/models.py
class Squad(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    leader = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='led_squads')
    needed_skills = models.JSONField(default=list)
    available_shifts = models.CharField(max_length=100, default='Noite')
    max_members = models.IntegerField(default=4)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='squads', blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

# repository/models.py
class Material(models.Model):
    title = models.CharField(max_length=200)
    discipline = models.ForeignKey(Discipline, on_delete=models.CASCADE)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    material_type = models.CharField(max_length=50, choices=[('SUMMARY', 'Resumo'), ('CODE', 'Código'), ('MAP', 'Mapa Mental')])
    link_or_file_url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
```

---

## 🚦 Regras de Negócio e Gamificação

1. **Atribuição de XP (`GamificationService`):**
   * Criar Pergunta: `+5 XP`
   * Responder Dúvida: `+10 XP`
   * Resposta marcada como Solução pelo Autor: `+30 XP`
   * Resposta validada com "Selo Mestre" por Professor: `+50 XP`
   * Upload de Resumo/Material Aprovado: `+20 XP`
2. **Autorização & RBAC:**
   * Apenas usuários com `role == 'PROFESSOR'` podem validar respostas com o Selo Mestre e acessar o painel analítico pedagógico.
   * Estudantes podem criar squads, candidatar-se a squads abertos e postar dúvidas.

---

## 🚀 Guia de Execução Autônoma para o Antigravity

Quando instruído a implementar uma fase:
1. Gere o código limpo, comentado e tipado.
2. Forneça os arquivos de configuração necessários (`docker-compose.yml`, `requirements.txt`, `package.json`).
3. Crie testes automatizados essenciais (endpoints DRF e componentes React).
4. Forneça o script de seed (`seed_data.py`) para popular cursos, matérias e usuários de demonstração.
