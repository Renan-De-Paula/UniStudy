require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const cors = require("cors");

const app = express();


// ============================================================
// CONFIGURAÇÃO DO SERVIDOR
// ============================================================

app.use(cors());
app.use(express.json());
app.use(express.static("public"));


// ============================================================
// CONFIGURAÇÃO DA GEMINI
// ============================================================

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY não encontrada no arquivo .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

// Aqui é definido o modelo que será utilizado
const model = genAI.getGenerativeModel({
  model: "gemini-3.5-flash-lite",

  generationConfig: {
    responseMimeType: "application/json"
  }
});

console.log("🤖 Modelo Gemini configurado.");


// ============================================================
// FUNÇÃO: BUSCAR REQUISITOS DO MERCADO
// ============================================================

async function buscarRequisitosMercado(curso, objetivo) {

  console.log("\n🧠 Analisando requisitos do mercado...");
  console.log("Curso:", curso);
  console.log("Objetivo:", objetivo);

  const prompt = `
    Você é um especialista em mercado de trabalho,
    carreira e educação profissional.

    O estudante cursa:

    "${curso}"

    E possui o seguinte objetivo profissional:

    "${objetivo}"

    Identifique EXATAMENTE 4 habilidades cruciais
    para esse objetivo profissional.

    Considere:

    - habilidades técnicas;
    - tecnologias relevantes;
    - conhecimentos práticos;
    - conhecimentos normalmente exigidos pelo mercado;
    - nível esperado para alguém que deseja entrar ou evoluir nessa área.

    Não invente habilidades sem relação com o objetivo.

    Retorne EXCLUSIVAMENTE um JSON válido:

    {
      "habilidades": [
        {
          "nome": "Nome da Habilidade",
          "nivel_exigido": 2
        }
      ]
    }

    Níveis:

    1 = Básico
    2 = Intermediário
    3 = Avançado

    Não adicione explicações fora do JSON.
  `;

  try {

    const resposta = await model.generateContent(prompt);

    const texto = resposta.response.text();

    console.log("📥 Resposta recebida da Gemini.");

    const resultado = JSON.parse(texto);

    console.log(
      "✅ Habilidades identificadas:"
    );

    console.log(resultado);

    return resultado;

  } catch (erro) {

    console.error(
      "❌ Erro ao consultar a Gemini:"
    );

    console.error(erro);

    throw erro;
  }
}


// ============================================================
// FUNÇÃO: GERAR TRILHA
// ============================================================

async function gerarTrilhaFormatada(perfil, gaps) {

  console.log("\n🗺️ Gerando trilha personalizada...");

  console.log("Aluno:", perfil.nome);
  console.log("Curso:", perfil.curso);
  console.log("Objetivo:", perfil.objetivo);
  console.log("Semanas:", perfil.semanas);
  console.log("Horas por dia:", perfil.horasPorDia);

  const prompt = `
    Você é um mentor especializado em educação,
    carreira e planejamento de estudos.

    Crie uma trilha personalizada para o estudante.

    ============================================
    PERFIL
    ============================================

    Nome:
    ${perfil.nome}

    Curso:
    ${perfil.curso}

    Objetivo profissional:
    ${perfil.objetivo}

    Tempo disponível:
    ${perfil.semanas} semanas

    Disponibilidade:
    ${perfil.horasPorDia} horas por dia


    ============================================
    GAPS IDENTIFICADOS
    ============================================

    ${JSON.stringify(gaps, null, 2)}


    ============================================
    REGRAS DA TRILHA
    ============================================

    1. Crie uma trilha realista.

    2. Considere obrigatoriamente o número de semanas
       disponíveis.

    3. Considere as horas disponíveis por dia.

    4. Priorize os gaps identificados.

    5. Comece pelos fundamentos quando necessário.

    6. Aumente gradualmente a dificuldade.

    7. Inclua exercícios práticos.

    8. Inclua pequenos projetos ou desafios.

    9. Relacione os estudos ao objetivo profissional.

    10. Não presuma conhecimentos que o estudante
        ainda não possui.

    11. Evite atividades genéricas como:
        "estude sobre programação".

    12. Diga especificamente o que estudar ou praticar.

    13. Utilize normalmente 5 dias de estudo por semana.

    14. A trilha deve possuir EXATAMENTE
        ${perfil.semanas} semanas.


    ============================================
    FORMATO DA RESPOSTA
    ============================================

    Retorne EXCLUSIVAMENTE JSON válido:

    {
      "resumo_diagnostico": "Texto curto explicando a situação do estudante e a estratégia da trilha.",

      "cronograma_semanal": [
        {
          "semana_numero": 1,
          "foco_principal": "Tema central da semana",

          "dicas_diarias": [
            "Atividade específica do dia 1",
            "Atividade específica do dia 2",
            "Atividade específica do dia 3",
            "Atividade específica do dia 4",
            "Atividade específica do dia 5"
          ]
        }
      ]
    }

    Não adicione explicações fora do JSON.
  `;

  try {

    const resposta = await model.generateContent(prompt);

    const texto = resposta.response.text();

    console.log("📥 Roadmap recebido da Gemini.");

    const trilha = JSON.parse(texto);


    // ========================================================
    // ADICIONAR RECURSOS EXTERNOS
    // ========================================================

    trilha.cronograma_semanal =
      trilha.cronograma_semanal.map(semana => {

        const busca = encodeURIComponent(
          semana.foco_principal
        );

        return {

          ...semana,

          recursos_externos: {

            google_books:
              `https://www.google.com/search?tbm=bks&q=livro+${busca}`,

            youtube_cursos:
              `https://www.youtube.com/results?search_query=curso+${busca}`

          }

        };

      });


    console.log("✅ Roadmap processado.");

    return trilha;

  } catch (erro) {

    console.error(
      "❌ Erro ao gerar a trilha:"
    );

    console.error(erro);

    throw erro;
  }
}


// ============================================================
// API — BUSCAR REQUISITOS
// ============================================================

app.post(
  "/api/trilha/requisitos",
  async (req, res) => {

    console.log(
      "\n=============================================="
    );

    console.log(
      "📡 POST /api/trilha/requisitos"
    );

    try {

      const {
        curso,
        objetivo
      } = req.body;


      if (!curso || !objetivo) {

        return res.status(400).json({

          erro:
            "Curso e objetivo são obrigatórios."

        });

      }


      const resultado =
        await buscarRequisitosMercado(
          curso,
          objetivo
        );


      res.json(resultado);

    } catch (erro) {

      console.error(
        "❌ Erro na rota /requisitos"
      );

      res.status(500).json({

        erro:
          "Não foi possível analisar os requisitos."

      });

    }

  }
);


// ============================================================
// API — GERAR TRILHA
// ============================================================

app.post(
  "/api/trilha/trilha",
  async (req, res) => {

    console.log(
      "\n=============================================="
    );

    console.log(
      "📡 POST /api/trilha/trilha"
    );

    try {

      const {
        perfil,
        gaps
      } = req.body;


      if (!perfil || !gaps) {

        return res.status(400).json({

          erro:
            "Perfil e gaps são obrigatórios."

        });

      }


      const resultado =
        await gerarTrilhaFormatada(
          perfil,
          gaps
        );


      res.json(resultado);

    } catch (erro) {

      console.error(
        "❌ Erro na rota /trilha"
      );

      res.status(500).json({

        erro:
          "Não foi possível gerar a trilha."

      });

    }

  }
);


// ============================================================
// STATUS DA API
// ============================================================

app.get(
  "/api/status",
  (req, res) => {

    res.json({

      status: "online",

      projeto: "Trilha",

      ia: "Google Gemini",

      servidor: "Node.js + Express"

    });

  }
);


// ============================================================
// INICIAR SERVIDOR
// ============================================================

app.listen(
  3000,
  () => {

    console.log("");
    console.log(
      "=============================================="
    );

    console.log(
      "🚀 TRILHA ESTÁ FUNCIONANDO!"
    );

    console.log(
      "=============================================="
    );

    console.log(
      "🌐 Front-end:"
    );

    console.log(
      "http://localhost:3000"
    );

    console.log(
      ""
    );

    console.log(
      "🔌 API:"
    );

    console.log(
      "http://localhost:3000/api/status"
    );

    console.log(
      ""
    );

    console.log(
      "🤖 Gemini: configurada"
    );

    console.log(
      "=============================================="
    );

    console.log(
      "\nAguardando requisições...\n"
    );

  }
);
