const API_URL = "/api/trilha"; // adapte se seu backend estiver em outra porta/URL
let step = 1;
const totalSteps = 5;
let objetivo = "";
let requisitos = [];
let perfil = {};
let activeFilter = "all";
let progressState = JSON.parse(localStorage.getItem("trilha-progress") || "{}");

const $ = id => document.getElementById(id);
const questions = [...document.querySelectorAll(".question")];

function renderStep(){
  questions.forEach(q => q.classList.toggle("active", +q.dataset.step === step));
  $("stepCurrent").textContent = String(step).padStart(2,"0");
  $("progressBar").style.width = `${step/totalSteps*100}%`;
  $("backBtn").disabled = step === 1;
  $("nextBtn").textContent = step === totalSteps ? "Analisar meu perfil →" : "Continuar →";
  if(step === 5) renderSummary();
}

function collectProfile(){
  perfil = {
    nome: $("nome").value.trim(),
    curso: $("curso").value.trim(),
    objetivo: objetivo === "Outro" ? $("objetivoOutro").value.trim() : objetivo,
    semanas: Number($("semanas").value) || 4,
    horasPorDia: Number($("horasPorDia").value) || 2
  };
}

function validStep(){
  if(step===1 && !$("nome").value.trim()) return "Digite seu nome.";
  if(step===2 && !$("curso").value.trim()) return "Digite seu curso ou área.";
  if(step===3 && !objetivo) return "Escolha um objetivo.";
  if(step===3 && objetivo==="Outro" && !$("objetivoOutro").value.trim()) return "Digite seu objetivo.";
  if(step===4 && (Number($("semanas").value)<1 || Number($("horasPorDia").value)<=0)) return "Informe um tempo válido.";
  return "";
}

function renderSummary(){
  collectProfile();
  $("summary").innerHTML = `
    <strong>${escapeHtml(perfil.nome)}</strong>, você está em <strong>${escapeHtml(perfil.curso)}</strong>
    e quer avançar para <strong>${escapeHtml(perfil.objetivo)}</strong>.<br>
    A trilha terá <strong>${perfil.semanas} semanas</strong>, com cerca de
    <strong>${perfil.horasPorDia}h por dia</strong>.
  `;
}

$("objetivos").addEventListener("click", e=>{
  const b=e.target.closest("button"); if(!b)return;
  objetivo=b.dataset.value;
  document.querySelectorAll("#objetivos button").forEach(x=>x.classList.remove("selected"));
  b.classList.add("selected");
  $("objetivoOutro").classList.toggle("hidden", objetivo!=="Outro");
  if(objetivo!=="Outro") $("objetivoOutro").value="";
});

$("backBtn").onclick=()=>{if(step>1){step--;renderStep()}};

$("nextBtn").onclick=async ()=>{
  const error=validStep(); if(error){alert(error);return}
  if(step<5){step++;renderStep();return}
  collectProfile();
  await buscarRequisitos();
};

async function buscarRequisitos(){
  $("wizard").classList.add("hidden");
  $("loading").classList.remove("hidden");
  try{
    const data=await postJSON(`${API_URL}/requisitos`,{
      curso:perfil.curso, objetivo:perfil.objetivo
    });
    requisitos=data.habilidades || [];
  }catch(e){
    // Permite testar o front sem backend.
    requisitos=mockRequisitos(perfil.objetivo);
  }
  $("loading").classList.add("hidden");
  renderSkills();
  $("skills").classList.remove("hidden");
}

function renderSkills(){
  $("skillsList").innerHTML=requisitos.map((h,i)=>`
    <div class="skill-row" data-index="${i}">
      <div>
        <div class="skill-name">${escapeHtml(h.nome)}</div>
        <div class="required">MERCADO · NÍVEL ${h.nivel_exigido}</div>
      </div>
      <div class="skill-levels">
        ${[0,1,2,3].map(n=>`<button class="skill-level" data-level="${n}">${n}</button>`).join("")}
      </div>
    </div>`).join("");

  document.querySelectorAll(".skill-level").forEach(btn=>{
    btn.onclick=()=>{
      const row=btn.closest(".skill-row");
      row.querySelectorAll(".skill-level").forEach(x=>x.classList.remove("active"));
      btn.classList.add("active");
      row.dataset.level=btn.dataset.level;
    };
  });
}

$("generateBtn").onclick=async ()=>{
  const rows=[...document.querySelectorAll(".skill-row")];
  if(rows.some(r=>r.dataset.level===undefined)){alert("Avalie todas as habilidades antes de continuar.");return}
  const gapsEncontrados=[];
  rows.forEach((r,i)=>{
    const hab=requisitos[i], atual=Number(r.dataset.level);
    if(atual<hab.nivel_exigido) gapsEncontrados.push({
      habilidade:hab.nome,nivel_atual:atual,nivel_exigido:hab.nivel_exigido,
      gap_para_cobrir:hab.nivel_exigido-atual
    });
  });
  $("skills").classList.add("hidden");
  $("loading").classList.remove("hidden");
  try{
    const trilha=await postJSON(`${API_URL}/trilha`,{perfil,gaps:gapsEncontrados});
    renderRoadmap(trilha);
  }catch(e){
    renderRoadmap(mockRoadmap(gapsEncontrados));
  }
};

function renderRoadmap(data){
  $("loading").classList.add("hidden");
  $("roadmap").classList.remove("hidden");
  $("roadmapTitle").textContent=`A rota de ${perfil.nome}.`;
  $("diagnosis").textContent=data.resumo_diagnostico || "Uma trilha construída a partir dos seus gaps e do tempo disponível.";
  if($("weeksStat")) $("weeksStat").textContent=`${perfil.semanas} semanas`;
  if($("hoursStat")) $("hoursStat").textContent=`${perfil.semanas * perfil.horasPorDia * 5}h de dedicação planejada`;
  const weeks=data.cronograma_semanal || [];
  $("weeks").innerHTML=weeks.map(w=>`
    <article class="week">
      <div class="node"></div>
      <div class="week-tag">SEMANA ${w.semana_numero}</div>
      <h3>${escapeHtml(w.foco_principal)}</h3>
      <div class="week-card">
        ${(w.dicas_diarias||[]).map((d,i)=>`
          <div class="day ${progressState[`${w.semana_numero}-${i}`] ? "done" : ""}" data-task="${w.semana_numero}-${i}">
            <strong>DIA ${i+1}</strong>
            <div class="day-check"><span class="checkmark"></span><div><p>${escapeHtml(d)}</p>
              ${i===0 && w.recursos_externos ? `<div class="resources">
                <a target="_blank" href="${w.recursos_externos.google_books}">Google Books ↗</a>
                <a target="_blank" href="${w.recursos_externos.youtube_cursos}">YouTube ↗</a>
              </div>`:""}
            </div></div>
          </div>`).join("")}
      </div>
    </article>`).join("");
  document.querySelectorAll(".day-check").forEach(day=>day.onclick=()=>toggleTask(day.closest(".day")));
  updateProgress();
}

function toggleTask(day){
  const key=day.dataset.task;
  progressState[key]=!progressState[key];
  if(!progressState[key]) delete progressState[key];
  localStorage.setItem("trilha-progress",JSON.stringify(progressState));
  day.classList.toggle("done",Boolean(progressState[key]));
  updateProgress();
  showToast(progressState[key] ? "Tarefa concluída. Bom ritmo." : "Tarefa reaberta.");
}

function updateProgress(){
  const days=[...document.querySelectorAll(".day")];
  const done=days.filter(day=>progressState[day.dataset.task]).length;
  const percent=days.length ? Math.round(done/days.length*100) : 0;
  const overall=$("overallProgress");
  if(overall) overall.textContent=`${percent}%`;
  if($("overallProgressBar")) $("overallProgressBar").style.width=`${percent}%`;
  if($("completedLabel")) $("completedLabel").textContent=`${done} de ${days.length} tarefas concluídas`;
  const next=days.find(day=>!progressState[day.dataset.task]);
  if($("nextFocus")) $("nextFocus").textContent=next ? next.querySelector("p").textContent : "Trilha concluída";
  days.forEach(day=>day.style.display=activeFilter==="all" || (activeFilter==="done" ? progressState[day.dataset.task] : !progressState[day.dataset.task]) ? "grid" : "none");
}

function showToast(message){
  const toast=$("toast"); if(!toast)return;
  toast.textContent=message; toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>toast.classList.remove("show"),2200);
}

$("restartBtn").onclick=()=>{
  $("roadmap").classList.add("hidden");
  $("wizard").classList.remove("hidden");
  $("skills").classList.add("hidden");
  step=1; renderStep();
};

document.querySelectorAll(".filter").forEach(button=>button.onclick=()=>{
  activeFilter=button.dataset.filter;
  document.querySelectorAll(".filter").forEach(item=>item.classList.toggle("active",item===button));
  updateProgress();
});

$("exportBtn") && ($("exportBtn").onclick=()=>{
  const text=[`TRILHA DE ${perfil.nome.toUpperCase()}`,`Objetivo: ${perfil.objetivo}`,`Duração: ${perfil.semanas} semanas`,"",...([...document.querySelectorAll(".week")].map(week=>`${week.querySelector(".week-tag").textContent} — ${week.querySelector("h3").textContent}\n${[...week.querySelectorAll(".day")].map(day=>`${progressState[day.dataset.task]?"[x]":"[ ]"} ${day.querySelector("p").textContent}`).join("\n")}`))].join("\n");
  const blob=new Blob([text],{type:"text/plain;charset=utf-8"}); const link=document.createElement("a"); link.href=URL.createObjectURL(blob); link.download="minha-trilha.txt"; link.click(); URL.revokeObjectURL(link.href); showToast("Roadmap exportado.");
});

async function postJSON(url,body){
  const res=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  if(!res.ok) throw new Error("API error");
  return res.json();
}
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function mockRequisitos(obj){
  const common={
    "Desenvolvimento de Software":["Git e GitHub","Lógica de programação","JavaScript","APIs REST"],
    "Backend / APIs":["Python","APIs REST","SQL / PostgreSQL","Git e GitHub"],
    "Dados / IA":["Python","SQL","Estatística","Machine Learning"],
    "Automação Industrial":["CLP e lógica de controle","Eletrônica","Sensores e atuadores","Programação"],
    "Eletrônica / Hardware":["Eletrônica básica","Microcontroladores","C/C++","Instrumentação"]
  };
  return (common[obj]||["Lógica de programação","Git e GitHub","Comunicação técnica","Resolução de problemas"]).map(nome=>({nome,nivel_exigido:2}));
}
function mockRoadmap(gaps){
  const temas=gaps.length?gaps.map(g=>g.habilidade):["Consolidação das competências"];
  return {
    resumo_diagnostico:`Seu roadmap prioriza ${temas.slice(0,3).join(", ")} e distribui a carga de forma progressiva para ${perfil.objetivo}.`,
    cronograma_semanal:Array.from({length:perfil.semanas},(_,i)=>({
      semana_numero:i+1,
      foco_principal:temas[i%temas.length],
      dicas_diarias:Array.from({length:Math.min(5,Math.max(3,Math.ceil(perfil.horasPorDia)))},(_,d)=>[
        "Entenda os conceitos fundamentais e monte um pequeno resumo.",
        "Faça exercícios guiados e reproduza um exemplo do zero.",
        "Construa uma mini aplicação/protótipo usando o conteúdo.",
        "Enfrente um problema sem tutorial e registre os erros.",
        "Revise, documente o que aprendeu e faça um desafio final."
      ][d]),
      recursos_externos:{
        google_books:`https://www.google.com/search?tbm=bks&q=${encodeURIComponent("livro "+temas[i%temas.length])}`,
        youtube_cursos:`https://www.youtube.com/results?search_query=${encodeURIComponent("curso "+temas[i%temas.length])}`
      }
    }))
  };
}
renderStep();