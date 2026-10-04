import React from 'react';
import { Users, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function RecomendacaoGuilda({ trilhas, setActiveTab }) {
  const navigate = useNavigate();
  if (!trilhas || trilhas.length === 0) return null;
  
  // Pega a trilha mais recente para sugerir a guilda
  const trilhaRecente = trilhas[0];
  const tema = trilhaRecente.titulo.split(' ').slice(-2).join(' ') || trilhaRecente.titulo;

  return (
    <div className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-2xl p-6 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
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
            Existem atualmente <span className="font-bold text-white">7 alunos</span> da sua faculdade estudando o mesmo assunto agora. 
            Junte-se a eles para tirar dúvidas, compartilhar resumos e estudar em grupo!
          </p>
        </div>
        <button 
          onClick={() => setActiveTab('guildas')}
          className="whitespace-nowrap bg-primary hover:bg-primary/80 text-white px-6 py-4 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/30 hover:scale-105"
        >
          Entrar na Guilda
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

export default RecomendacaoGuilda;
