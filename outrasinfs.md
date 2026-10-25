# Outras informações — Trilhas personalizadas por IA

## Visão geral

O UniStudy possui um módulo de trilhas personalizadas que utiliza inteligência
artificial para montar um plano de estudos de acordo com o objetivo, o tempo
disponível e o nível atual de cada aluno.

A proposta é substituir uma trilha genérica por um percurso adaptado ao
contexto individual do usuário. A IA identifica os conhecimentos necessários,
organiza os conteúdos em uma sequência lógica e transforma o resultado em
semanas e atividades práticas.

## Como funciona

O fluxo principal acontece em algumas etapas:

1. O aluno informa o objetivo que deseja alcançar.
2. O sistema coleta informações sobre prazo, quantidade de horas disponíveis e
   experiência prévia.
3. A IA analisa o objetivo e sugere as principais habilidades relacionadas.
4. O aluno informa seu nível em cada habilidade sugerida.
5. O backend identifica os gaps de conhecimento e envia o diagnóstico para a
   IA.
6. A IA gera a trilha com módulos, tópicos, semanas, atividades diárias e
   recursos complementares.
7. O resultado é salvo na conta do aluno e pode ser acompanhado pelo
   visualizador de trilhas.

O aluno pode consultar novamente a trilha depois de sair da aplicação. O
progresso dos tópicos concluídos também fica associado à trilha gerada.

## Estrutura da trilha

Cada trilha pode conter:

- objetivo de aprendizagem;
- diagnóstico das habilidades;
- habilidades necessárias;
- gaps identificados;
- módulos de estudo;
- tópicos e atividades práticas;
- roadmap semanal;
- atividades distribuídas por dia;
- links e recursos externos;
- controle de tópicos concluídos.

O roadmap semanal permanece visível junto dos módulos para que o aluno tenha
uma visão geral do percurso e, ao mesmo tempo, consiga acompanhar a tarefa
correspondente ao dia.

## Integração técnica

O projeto experimental `node-gpt` foi utilizado como referência para o fluxo
de geração, mas a funcionalidade final foi integrada ao backend Django do
UniStudy. Dessa forma, a aplicação não precisa manter um segundo servidor
separado para gerar as trilhas.

### Backend

O módulo principal está em `backend/trilha_ia/`. Ele é responsável por:

- validar os dados recebidos;
- autenticar o usuário;
- conversar com o modelo Gemini;
- interpretar e validar a resposta da IA;
- garantir a quantidade esperada de habilidades e semanas;
- salvar a trilha, os módulos e o roadmap no banco.

As principais rotas são:

```text
GET  /api/trilha_ia/
POST /api/trilha_ia/requisitos/
POST /api/trilha_ia/avaliar/
POST /api/trilha_ia/gerar/
```

As rotas exigem autenticação JWT. O frontend envia o token no formato:

```text
Authorization: Bearer <access_token>
```

### Frontend

O fluxo da interface está dividido principalmente entre:

- `frontend/src/pages/OnboardingIA.jsx`: coleta os dados e conduz o diagnóstico;
- `frontend/src/pages/TrilhaViewer.jsx`: exibe módulos, semanas e atividades;
- `frontend/src/services/api.js`: configura a comunicação autenticada com a API.

O design utiliza a identidade visual do UniStudy. A interface da aplicação
experimental serviu como referência para a organização das informações, mas a
experiência final permanece dentro do layout principal da plataforma.

## Inteligência artificial

O backend utiliza o SDK `google-genai` para acessar o modelo configurado no
projeto. A chave deve ser definida em uma variável de ambiente no arquivo
`.env` do backend:

```env
GEMINI_API_KEY=sua_chave_aqui
```

Nunca coloque uma chave real no Git ou em arquivos enviados para o
repositório. O arquivo `.env` deve permanecer ignorado.

O cliente da IA é reutilizado pelo backend para evitar o encerramento
prematuro da conexão entre uma etapa e outra da geração.

Se a chave não estiver configurada, se a resposta da IA for inválida ou se o
serviço estiver indisponível, a API deve retornar um erro para que o frontend
possa informar o usuário. Não é recomendado simular uma trilha como se ela
tivesse sido gerada pela IA.

## Dados e autenticação

As trilhas pertencem ao usuário autenticado. Por isso:

- cada aluno visualiza suas próprias trilhas;
- as requisições precisam conter um JWT válido;
- o login deve ser realizado antes de iniciar o onboarding;
- o progresso é salvo no backend, não apenas no navegador.

Durante o desenvolvimento local, o projeto utiliza SQLite. Em produção, o
backend pode utilizar PostgreSQL conforme a configuração de deploy descrita no
`README.md`.

## Relação com as funcionalidades da comunidade

As trilhas podem servir de base para recursos colaborativos do UniStudy. A
partir do objetivo ou dos conteúdos estudados, o sistema pode recomendar uma
guilda relacionada ao percurso do aluno.

O aluno também pode:

- participar de guildas;
- trocar mensagens com outros membros;
- publicar e consultar materiais;
- tirar dúvidas no fórum;
- acompanhar respostas e soluções verificadas.

Esses recursos são complementares: a trilha organiza o estudo individual,
enquanto a comunidade oferece colaboração e apoio durante o percurso.

## Execução local

Para executar o projeto, consulte o [README principal](./README.md). De forma
resumida:

```powershell
# Backend
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
$env:AUTOBAHN_USE_NVX="0"
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8001
```

Em outro terminal:

```powershell
# Frontend
cd frontend
npm install
npm run dev
```

Depois, acesse a URL informada pelo Vite e faça login com uma conta válida.

## Evoluções planejadas

O módulo foi estruturado para evoluir sem obrigar a IA a criar todas as
habilidades do zero. Uma evolução planejada é manter um banco de habilidades
curadas, permitindo que a IA selecione as competências mais relevantes para
cada objetivo e usuário.

Outras melhorias possíveis incluem:

- recalcular uma trilha quando o aluno mudar de objetivo;
- adaptar automaticamente o roadmap com base no progresso;
- registrar métricas de desempenho;
- recomendar materiais e guildas com maior precisão;
- integrar o chat das guildas em tempo real por WebSocket.
