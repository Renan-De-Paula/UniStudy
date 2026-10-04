import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, CheckCircle2, Circle, Clock, Layout, Trophy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function TrilhaViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, updateXP } = useAuth();
  const [trilha, setTrilha] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrilha() {
      try {
        const response = await api.get('/trilha_ia/');
        const found = response.data.find(t => t.id.toString() === id);
        if (found) {
          if (!found.topicos_concluidos) found.topicos_concluidos = [];
          setTrilha(found);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTrilha();
  }, [id]);

  const toggleTopico = async (topicoTitle) => {
    try {
      const res = await api.post('/trilha_ia/' + id + '/toggle/', { topico_title: topicoTitle });
      setTrilha({
        ...trilha,
        topicos_concluidos: res.data.topicos_concluidos
      });
    } catch (err) {
      console.error('Erro ao marcar topico', err);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Carregando Trilha...</div>;
  if (!trilha) return <div className="p-8 text-center text-red-400">Trilha não encontrada.</div>;

  const modulos = trilha.conteudo_gerado?.modulos || [];

  return (
    <div className="min-h-screen bg-darker p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="text-slate-400 hover:text-white flex items-center gap-2 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Voltar ao Dashboard
        </button>

        <div className="bg-slate-800 rounded-2xl p-8 mb-8 border border-slate-700 shadow-xl">
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-4">
            {trilha.titulo}
          </h1>
          <p className="text-slate-300 text-lg mb-6">{trilha.conteudo_gerado?.description}</p>
          
          <div className="flex gap-4">
            <div className="bg-slate-900/50 px-4 py-2 rounded-lg flex items-center gap-2 border border-slate-700/50">
              <Layout size={18} className="text-primary" />
              <span className="text-slate-300 font-bold">{modulos.length} Módulos</span>
            </div>
            <div className="bg-slate-900/50 px-4 py-2 rounded-lg flex items-center gap-2 border border-slate-700/50">
              <Trophy size={18} className="text-yellow-500" />
              <span className="text-slate-300 font-bold">+10 XP por Tópico</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {modulos.map((modulo, mIndex) => (
            <div key={mIndex} className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="bg-slate-800 p-6 border-b border-slate-700/50">
                <h2 className="text-2xl font-bold text-white mb-2">Módulo {mIndex + 1}: {modulo.title}</h2>
                <p className="text-slate-400">{modulo.description}</p>
              </div>
              <div className="p-6 space-y-4">
                {modulo.topicos.map((topico, tIndex) => {
                  const isDone = trilha.topicos_concluidos.includes(topico.title);
                  return (
                    <div 
                      key={tIndex} 
                      onClick={() => toggleTopico(topico.title)}
                      className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer hover:scale-[1.01] ${isDone ? 'bg-primary/10 border-primary/30' : 'bg-darker border-slate-700/50 hover:border-slate-600'}`}
                    >
                      <div className="mt-1">
                        {isDone ? (
                          <CheckCircle2 size={24} className="text-primary animate-bounce-short" />
                        ) : (
                          <Circle size={24} className="text-slate-500" />
                        )}
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold mb-1 ${isDone ? 'text-primary line-through opacity-70' : 'text-white'}`}>
                          {topico.title}
                        </h3>
                        <p className={`text-slate-400 ${isDone ? 'opacity-70' : ''}`}>
                          {topico.content_summary}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrilhaViewer;
