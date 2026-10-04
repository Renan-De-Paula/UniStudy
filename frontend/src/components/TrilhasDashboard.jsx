import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BrainCircuit, PlayCircle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import RecomendacaoGuilda from './RecomendacaoGuilda';

function TrilhasDashboard({ setActiveTab }) {
  const [trilhas, setTrilhas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadTrilhas() {
      try {
        const response = await api.get('/trilha_ia/');
        setTrilhas(response.data);
      } catch (err) {
        console.error("Erro ao buscar trilhas:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTrilhas();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Carregando suas trilhas...</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-2">Meu Dashboard de Estudos</h2>
          <p className="text-slate-400 text-lg">Continue sua jornada de aprendizado guiada por IA.</p>
        </div>
        <button 
          onClick={() => navigate('/onboarding')}
          className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <Plus size={20} />
          Nova Trilha IA
        </button>
      </div>

      <RecomendacaoGuilda trilhas={trilhas} setActiveTab={setActiveTab} />

      {trilhas.length === 0 ? (
        <div className="bg-darker border border-slate-700 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-500">
            <BrainCircuit size={48} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Você ainda não tem trilhas</h3>
          <p className="text-slate-400 max-w-md mb-8">O Oráculo está pronto para criar um caminho de estudos personalizado para o seu objetivo.</p>
          <button 
            onClick={() => navigate('/onboarding')}
            className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-3"
          >
            <BrainCircuit size={20} />
            Gerar Minha Primeira Trilha
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trilhas.map((trilha) => {
            const numModulos = trilha.conteudo_gerado?.modulos?.length || 0;
            const concluidos = trilha.topicos_concluidos ? trilha.topicos_concluidos.length : 0;
            return (
              <div key={trilha.id} className="bg-darker border border-slate-700 rounded-2xl p-6 hover:border-primary/50 transition-all group flex flex-col">
                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{trilha.titulo}</h3>
                
                <div className="text-sm text-slate-400 mb-2">
                  {numModulos} módulos gerados pela IA
                </div>
                {concluidos > 0 && (
                  <div className="text-sm text-primary font-bold mb-6 flex items-center gap-1">
                    <CheckCircle2 size={14} /> {concluidos} tópicos concluídos
                  </div>
                )}
                {!concluidos && <div className="mb-6 h-5"></div>}
                
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-800">
                  <span className="text-xs text-slate-500">
                    Criada em: {new Date(trilha.criado_em).toLocaleDateString('pt-BR')}
                  </span>
                  <button 
                    onClick={() => navigate('/trilha/' + trilha.id)}
                    className="text-primary hover:text-accent font-bold text-sm flex items-center gap-1 group-hover:underline"
                  >
                    <PlayCircle size={16} />
                    Estudar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TrilhasDashboard;
