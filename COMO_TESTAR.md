# Como Testar o UniStudy Hub

Aqui estão as instruções de como você pode rodar a sua aplicação localmente, fazer login usando os usuários de teste (seed) e como subir esse projeto no Firebase.

## 1. Como rodar o projeto localmente

Foi criado um arquivo `.bat` que automatiza todo o processo de instalação de dependências e inicialização dos servidores no Windows.

Para testar a aplicação completa, basta dar **duplo clique** no arquivo `start_local.bat` na raiz do projeto (`e:\unistudy\start_local.bat`), ou rodá-lo pelo terminal:

```bash
cd e:\unistudy
.\start_local.bat
```

Este script irá:
1. Instalar as dependências do Frontend e iniciá-lo.
2. Criar o ambiente virtual (venv), instalar as dependências do Backend (Django) e criar o banco de dados.
3. Popular o banco com os dados iniciais.
4. Iniciar o Backend.

Os serviços estarão rodando em:
- **Frontend (Interface):** http://localhost:5173
- **Backend (API):** http://localhost:8000

## 2. Contas para Login (Testes)

Quando o banco de dados é gerado, ele cria automaticamente os seguintes usuários para que você possa testar as diferentes visões da aplicação:

**Perfil Aluno:**
- **Usuário:** `aluno_joao`
- **Senha:** `123`

**Perfil Professor/Mentor:**
- **Usuário:** `prof_alan`
- **Senha:** `123`

Para logar, acesse o frontend (http://localhost:5173), vá na página de login e use as credenciais acima.

> **Dica:** Esses dados de teste podem ser encontrados e alterados no arquivo `backend/seed_data.py`.

---

## 3. Como rodar online RÁPIDO para amigos testarem (via Tunnel)

Se você quer apenas que seus amigos acessem o projeto do computador deles enquanto o servidor roda no seu, a forma mais rápida (sem precisar configurar hospedagem) é usar o **LocalTunnel**.

Siga estes passos:

1. **Inicie o projeto localmente** primeiro (usando o `start_local.bat`).
2. **Abra um novo terminal** na pasta do projeto e rode o comando abaixo para expor o seu Backend (API) para a internet:
   ```bash
   npx localtunnel --port 8000 --subdomain unistudy-api-teste
   ```
   *Isso vai gerar um link como `https://unistudy-api-teste.loca.lt`.*

3. **Altere a URL da API no Frontend:** 
   Vá no arquivo `e:\unistudy\frontend\src\services\api.js` e troque a linha do `baseURL` para o link gerado acima, ficando assim:
   ```javascript
   const api = axios.create({
     baseURL: 'https://unistudy-api-teste.loca.lt/api',
   });
   ```

4. **Abra outro terminal** e exponha o seu Frontend para a internet:
   ```bash
   npx localtunnel --port 5173 --subdomain unistudy-app-teste
   ```
   *Isso vai gerar o link final `https://unistudy-app-teste.loca.lt`.*

Pronto! **Basta enviar o link do passo 4 para os seus amigos**. 
*(Obs: Ao acessar pela primeira vez, o localtunnel pode pedir uma senha ou clicar num botão para confirmar que você sabe que é um túnel de teste. Seus amigos só precisam clicar em "Click to Continue").*

> **Importante:** Quando você terminar de testar, lembre-se de voltar a URL no `api.js` para `http://localhost:8000/api`.

---

## 4. Posso subir esse projeto para o Firebase definitivamente?

**Sim, mas com algumas ressalvas devido à arquitetura atual do projeto.**

O projeto está dividido em duas partes: **Frontend (React)** e **Backend (Django Python)**.

### Hospedando o Frontend no Firebase (Recomendado)
Você pode usar o **Firebase Hosting** para hospedar o frontend (a interface feita em React) muito facilmente.

Passos rápidos para o frontend:
1. Instale o Firebase CLI: `npm install -g firebase-tools`
2. Entre na pasta do frontend: `cd frontend`
3. Faça login: `firebase login`
4. Inicialize o projeto: `firebase init hosting` (Escolha a pasta `dist` como diretório público).
5. Gere a build do projeto: `npm run build`
6. Faça o deploy: `firebase deploy`

### E o Backend (Django)?
O Firebase Hosting serve apenas para arquivos estáticos (HTML, CSS, JS). Para rodar o Backend em Python (Django) e o banco de dados SQLite associado, o Firebase não é a plataforma ideal, pois ele é focado no próprio banco NoSQL deles e em funções estruturadas para Serverless (Firebase Functions), não diretamente para o framework Django tradicional.

**Como resolver o Backend:**
1. **Cloud Run (Google Cloud):** Como o Firebase é do Google, você pode colocar o seu Backend (Django) em um contêiner Docker e rodar no **Google Cloud Run**, que integra muito bem com o Firebase.
2. **Outras plataformas (Mais fácil para Django):** Para o backend, a forma mais fácil e rápida de subir (principalmente se quiser manter um banco relacional como PostgreSQL em vez do SQLite local) é usar plataformas focadas em APIs como **Render**, **Railway**, **Fly.io** ou **Heroku**. 

**Resumo da estratégia ideal para produção:**
- **Frontend:** Firebase Hosting ou Vercel.
- **Backend:** Railway, Render ou Google Cloud Run (com um banco PostgreSQL, pois o SQLite não persistirá adequadamente nesses serviços em nuvem).
