import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, CheckCircle2, Circle, ExternalLink, Layout, Trophy } from 'lucide-react';
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
  const semanas = trilha.conteudo_gerado?.cronograma_semanal || [];

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

        {semanas.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-primary text-sm font-bold uppercase tracking-widest">Seu roadmap</p>
                <h2 className="text-2xl font-black text-white">Plano semanal de evolução</h2>
              </div>
              <span className="text-slate-400 text-sm">{semanas.length} semanas planejadas</span>
            </div>
            <div className="space-y-5">
              {semanas.map((semana) => (
                <article key={semana.semana_numero} className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="min-w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-black">
                      {semana.semana_numero}
                    </div>
                    <div>
                      <p className="text-xs text-primary font-bold uppercase tracking-widest">Semana {semana.semana_numero}</p>
                      <h3 className="text-xl font-bold text-white">{semana.foco_principal}</h3>
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {(semana.dicas_diarias || []).map((atividade, index) => {
                      const topicoTitle = `Semana ${semana.semana_numero} - Dia ${index + 1}`;
                      const isDone = trilha.topicos_concluidos.includes(topicoTitle);
                      return (
                        <button
                          key={topicoTitle}
                          type="button"
                          onClick={() => toggleTopico(topicoTitle)}
                          className={`text-left flex items-start gap-3 rounded-lg border p-3 transition-colors ${isDone ? 'border-primary/40 bg-primary/10' : 'border-slate-700 bg-darker hover:border-primary/40'}`}
                        >
                          {isDone ? <CheckCircle2 size={20} className="text-primary mt-0.5 shrink-0" /> : <Circle size={20} className="text-slate-500 mt-0.5 shrink-0" />}
                          <span className={isDone ? 'text-primary line-through opacity-70' : 'text-slate-300'}>
                            <strong className="block text-xs uppercase text-slate-500 mb-1">Dia {index + 1}</strong>
                            {atividade}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex gap-3 mt-4 text-xs">
                    <a href={`https://www.google.com/search?tbm=bks&q=${encodeURIComponent(semana.foco_principal)}`} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary flex items-center gap-1">
                      Google Books <ExternalLink size={12} />
                    </a>
                    <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(semana.foco_principal)}`} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary flex items-center gap-1">
                      YouTube <ExternalLink size={12} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

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
