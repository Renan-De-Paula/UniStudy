import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle, Filter, MessageCircle, Send, ThumbsUp } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function Forum() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('Todas');
  const [sort, setSort] = useState('Recentes');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('Geral');
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPosts = async () => {
    try {
      const response = await api.get('/community/posts/');
      setPosts(response.data);
    } catch {
      setError('Não foi possível carregar o fórum.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPosts(); }, []);

  const createPost = async (event) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;
    try {
      const response = await api.post('/community/posts/', { title, content, tag });
      setPosts([response.data, ...posts]);
      setTitle('');
      setContent('');
    } catch (err) {
      setError(err.response?.data?.error || 'Não foi possível publicar a dúvida.');
    }
  };

  const vote = async (post) => {
    try {
      const response = await api.post(`/community/posts/${post.id}/vote/`);
      setPosts(posts.map(item => item.id === post.id
        ? { ...item, upvotes: response.data.upvotes, hasVoted: response.data.voted }
        : item));
    } catch { setError('Não foi possível votar agora.'); }
  };

  const answer = async (postId) => {
    const value = (answers[postId] || '').trim();
    if (!value) return;
    try {
      const response = await api.post(`/community/posts/${postId}/answers/`, { content: value });
      setPosts(posts.map(post => post.id === postId ? { ...post, answers: [...post.answers, response.data] } : post));
      setAnswers({ ...answers, [postId]: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Não foi possível responder.');
    }
  };

  const markSolution = async (postId, answerId) => {
    try {
      const response = await api.post(`/community/posts/${postId}/answers/${answerId}/solution/`);
      setPosts(posts.map(post => post.id === postId
        ? { ...post, isSolved: response.data.isVerifiedSolution, answers: post.answers.map(item => item.id === answerId ? response.data : { ...item, isVerifiedSolution: false }) }
        : post));
    } catch (err) {
      setError(err.response?.data?.error || 'Apenas o autor da dúvida pode validar a solução.');
    }
  };

  const displayedPosts = useMemo(() => {
    const result = posts.filter(post => filter === 'Todas' || post.tag === filter);
    if (sort === 'Mais Votadas') return [...result].sort((a, b) => b.upvotes - a.upvotes);
    if (sort === 'Sem Resposta') return result.filter(post => post.answers.length === 0);
    return result;
  }, [posts, filter, sort]);

  return (
    <div className="bg-darker p-4 md:p-8 rounded-xl border border-slate-700 shadow-xl animate-fade-in max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-white flex items-center gap-2"><MessageCircle className="text-primary" size={32} /> Fórum de Dúvidas</h2>
        <p className="text-slate-400 mt-1">Faça perguntas, ajude colegas e marque soluções.</p>
      </div>
      {error && <div className="mb-5 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-red-300">{error}</div>}

      <form onSubmit={createPost} className="bg-slate-800/80 p-5 rounded-xl border border-slate-700 mb-8 space-y-3">
        <div className="flex gap-3">
          <input value={title} onChange={event => setTitle(event.target.value)} placeholder="Título da sua dúvida" className="flex-1 bg-darker border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-primary" />
          <select value={tag} onChange={event => setTag(event.target.value)} className="bg-darker border border-slate-700 rounded-lg p-3 text-white">
            {['Geral', 'Programação', 'Matemática', 'Física'].map(item => <option key={item}>{item}</option>)}
          </select>
        </div>
        <textarea value={content} onChange={event => setContent(event.target.value)} placeholder="Explique sua dúvida..." rows={3} className="w-full bg-darker border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-primary" />
        <button className="bg-primary hover:bg-primary/80 text-white font-bold rounded-lg px-5 py-3 flex items-center gap-2"><Send size={17} /> Publicar dúvida</button>
      </form>

      <div className="flex flex-wrap justify-between gap-3 mb-6">
        <div className="flex gap-2">
          {['Todas', 'Programação', 'Matemática', 'Física', 'Geral'].map(item => (
            <button key={item} onClick={() => setFilter(item)} className={`px-3 py-1.5 rounded-full text-sm ${filter === item ? 'bg-primary text-white' : 'bg-slate-800 text-slate-400'}`}>{item}</button>
          ))}
        </div>
        <label className="text-slate-400 flex items-center gap-2"><Filter size={16} />
          <select value={sort} onChange={event => setSort(event.target.value)} className="bg-slate-800 border border-slate-700 rounded p-1 text-white">
            <option>Recentes</option><option>Mais Votadas</option><option>Sem Resposta</option>
          </select>
        </label>
      </div>

      {loading ? <p className="text-slate-400">Carregando dúvidas...</p> : displayedPosts.map(post => (
        <article key={post.id} className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 mb-5">
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <button onClick={() => vote(post)} className={post.hasVoted ? 'text-primary' : 'hover:text-primary'}><ThumbsUp size={20} /></button>
              <span className="font-bold">{post.upvotes}</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between gap-3">
                <h3 className="text-xl font-bold text-white">{post.title}</h3>
                {post.isSolved && <span className="text-emerald-400 text-sm flex items-center gap-1"><CheckCircle size={16} /> Resolvida</span>}
              </div>
              <p className="text-slate-300 mt-2 whitespace-pre-wrap">{post.content}</p>
              <div className="text-xs text-slate-500 mt-3">{post.author.name} · {post.tag} · {post.answers.length} resposta(s)</div>
              <div className="mt-5 space-y-3">
                {post.answers.map(item => (
                  <div key={item.id} className={`rounded-lg p-3 border ${item.isVerifiedSolution ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-slate-700 bg-darker'}`}>
                    <div className="flex justify-between text-sm text-slate-400"><span>{item.author.name}</span>
                      {item.isVerifiedSolution && <span className="text-emerald-400">Solução verificada</span>}
                    </div>
                    <p className="text-slate-200 mt-1 whitespace-pre-wrap">{item.content}</p>
                    {post.author.id === currentUser?.id && <button onClick={() => markSolution(post.id, item.id)} className="text-xs text-primary mt-2">Marcar como solução</button>}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <input value={answers[post.id] || ''} onChange={event => setAnswers({ ...answers, [post.id]: event.target.value })} placeholder="Escreva uma resposta..." className="flex-1 bg-darker border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-primary" />
                <button onClick={() => answer(post.id)} className="bg-slate-700 hover:bg-primary text-white rounded-lg px-3"><Send size={16} /></button>
              </div>
            </div>
          </div>
        </article>
      ))}
      {!loading && displayedPosts.length === 0 && <p className="text-slate-400 text-center py-8">Nenhuma dúvida encontrada.</p>}
    </div>
  );
}

export default Forum;
