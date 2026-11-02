import React, { useState } from 'react';
import { Users, Sparkles, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

function RecomendacaoGuilda({ trilhas, setActiveTab }) {
  const [isEntering, setIsEntering] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');

  if (!trilhas || trilhas.length === 0) return null;
  
  // Pega a trilha mais recente para sugerir a guilda
  const trilhaRecente = trilhas[0];
  const rawTitle = trilhaRecente.titulo || 'Estudos Gerais';
  const tema = rawTitle.replace(/^(Trilha de|Trilha|Aprender)\s+/i, '').trim() || rawTitle;

  const handleEnterRecommendedGuild = async () => {
    setIsEntering(true);
    setSuccessNotice('');

    try {
      const guildTitle = `Guilda: ${tema}`;

      // 1. Busca todas as guildas ativas
      const res = await api.get('/squads/squads/');
      const allGuilds = res.data || [];

      // 2. Verifica se já existe uma guilda com esse tema
      let targetGuild = allGuilds.find(g => 
        g.title.toLowerCase().includes(tema.toLowerCase()) || 
        tema.toLowerCase().includes(g.title.toLowerCase())
      );

      // 3. Se não existir, CRIA AUTOMATICAMENTE a guilda
      if (!targetGuild) {
        const createRes = await api.post('/squads/squads/', {
          title: guildTitle,
          description: `Guilda oficial recomendada pela IA para alunos da trilha "${trilhaRecente.titulo}". Compartilhe dúvidas, materiais e resumos com seus colegas universitários!`,
          needed_skills: [tema, 'Trilha IA', 'Estudos'],
          available_shifts: 'Qualquer',
          max_members: 20
        });
        targetGuild = createRes.data;
        setSuccessNotice(`Guilda "${guildTitle}" criada com sucesso! Redirecionando...`);
      } else {
        // Se já existe e não é membro, ingressa na guilda
        try {
          await api.post(`/squads/squads/${targetGuild.id}/join/`);
        } catch (err) {
          // Ignora se já for membro ou líder
        }
        setSuccessNotice(`Conectado à guilda! Redirecionando...`);
      }

      // 4. Salva a guilda no localStorage para a aba Guildas abri-la diretamente
      if (targetGuild?.id) {
        localStorage.setItem('selected_guild_id', String(targetGuild.id));
      }

      // 5. Redireciona para a aba de Guildas
      setTimeout(() => {
        if (setActiveTab) {
          setActiveTab('guildas');
        }
      }, 600);

    } catch (err) {
      console.error('Erro ao conectar à guilda recomendada:', err);
      // Fallback: abre a aba de guildas mesmo em caso de falha de rede
      if (setActiveTab) {
        setActiveTab('guildas');
      }
    } finally {
      setIsEntering(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary/20 via-purple-900/20 to-accent/20 border border-primary/30 rounded-2xl p-6 mb-8 relative overflow-hidden shadow-xl">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Users size={120} />
      </div>
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} className="text-primary animate-pulse" />
            <span className="text-primary font-bold tracking-wider text-sm uppercase">Matchmaking de Guilda (IA)</span>
          </div>
          <h3 className="text-2xl font-black text-white mb-2">
            Guilda Recomendada: "{tema}"
          </h3>
          <p className="text-slate-300 max-w-xl">
            A Inteligência Artificial identificou que você está focado em <strong>{trilhaRecente.titulo}</strong>. 
            Existem atualmente <span className="font-bold text-white">colegas da sua universidade</span> estudando este mesmo tópico agora. 
            Junte-se a eles para tirar dúvidas, compartilhar resumos e estudar em grupo!
          </p>
          {successNotice && (
            <div className="mt-3 flex items-center gap-2 text-emerald-400 font-semibold text-sm animate-fade-in">
              <CheckCircle2 size={16} />
              <span>{successNotice}</span>
            </div>
          )}
        </div>
        <button 
          onClick={handleEnterRecommendedGuild}
          disabled={isEntering}
          className="whitespace-nowrap bg-primary hover:bg-primary/80 disabled:opacity-75 text-white px-6 py-4 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/30 hover:scale-105 cursor-pointer"
        >
          {isEntering ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Conectando à Guilda...
            </>
          ) : (
            <>
              Entrar na Guilda
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default RecomendacaoGuilda;
