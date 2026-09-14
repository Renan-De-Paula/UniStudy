# PLANO DE AÇÃO & PROMPT MESTRE PARA O ANTIGRAVITY
## Projeto: UniStudy Hub (Ecossistema Acadêmico para Alunos e Mestres)

Este documento contém o plano de ação passo a passo e o prompt consolidado pronto para você copiar e colar no Antigravity.

---

### 📋 Fases do Plano de Ação

| Fase | Objetivo Principal | Entregáveis Técnicos |
| :--- | :--- | :--- |
| **Fase 1: Fundação & Setup** | Configurar ambiente Docker, Django REST e React. | `docker-compose.yml`, `Dockerfile`, boilerplate Django e Vite React. |
| **Fase 2: Modelos & Autenticação** | Criar RBAC (Aluno/Mestre), autenticação JWT e perfis. | Apps `accounts`, models customizados, endpoints `/api/auth/`. |
| **Fase 3: Módulos Acadêmicos** | Implementar Fórum, Squads, Mentoria e Biblioteca. | Apps `community`, `squads`, `repository`, `gamification`. |
| **Fase 4: Frontend & UI/UX** | Construir interfaces responsivas com TailwindCSS. | Telas de Feed de Matérias, Criador de Squads, Painel do Professor. |
| **Fase 5: Seed & Demonstração** | Criar massa de dados fictícia para teste e vídeo. | Script `seed_data.py` com cursos, dúvidas reais e squads. |

---

### 🤖 PROMPT PARA COPIAR E COLAR NO ANTIGRAVITY

```markdown
Olá Antigravity! Você atuará como o Arquiteto e Tech Lead responsável por implementar o projeto completo "UniStudy Hub" (Plataforma Acadêmica de Aprendizagem Colaborativa, Mentoria Docente e Formação de Squads).

Use a skill `unistudy-hub-architect` como base de referência de arquitetura e modelos.

Por favor, execute o desenvolvimento seguindo este roteiro estruturado:

1. ARQUITETURA & CONFIGURAÇÃO:
   - Estruture o projeto em duas pastas principais: `/backend` (Django 5, DRF, SimpleJWT, Postgres) e `/frontend` (React + Vite + TailwindCSS + Lucide Icons).
   - Forneça o `docker-compose.yml` para rodar backend, banco PostgreSQL e frontend em um único comando.

2. BACKEND & APIS REST:
   - Crie os modelos relacionais:
     * `User` (com papéis: ALUNO, PROFESSOR; controle de semestre, skills e XP).
     * `Discipline` e `Post`/`Answer` (fórum por disciplina com upvotes e validação docente).
     * `Squad` (criação e busca de equipes para projetos/TCC por competências).
     * `Material` (biblioteca acadêmica de resumos e códigos).
   - Implemente o serviço de gamificação: atribuição de XP automática quando uma resposta for marcada como solução (+30 XP) ou validada por um professor (+50 XP).
   - Documente os endpoints REST para fácil consumo pelo frontend.

3. FRONTEND & DESIGN SYSTEM (DARK & CLEAN TECH):
   - Construa uma interface moderna, intuitiva e acessível (Mobile-First):
     * Header com saldo de XP, nível acadêmico e seletor de perfil (Aluno / Mestre).
     * Feed de Dúvidas segmentado por Curso e Disciplina.
     * Painel de Squads ("Encontre sua Equipe") com filtros de horário e skills.
     * Painel do Mestre (exclusivo para perfil Professor com mapa de dúvidas).
     * Biblioteca de Resumos e Códigos abertos.

4. DADOS DE DEMONSTRAÇÃO (SEED):
   - Crie um script `seed_data.py` que popule o sistema com dados realistas (ex.: cursos de TI, disciplinas como Algoritmos, Banco de Dados, Cálculo, dúvidas postadas e squads abertos).

Gere o código completo, modular, limpo e com as instruções de execução passo a passo.
```
