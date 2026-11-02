import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { 
  CheckCircle, Code, Bold, Italic, ThumbsUp, Medal, Filter, 
  MessageSquare, Check, Tag, Loader2, AlertCircle, Sparkles, Send
} from 'lucide-react';

function Forum() {
  const { currentUser, updateCurrentUser } = useAuth();
  
  const [posts, setPosts] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingPost, setSubmittingPost] = useState(false);
  
  // Filtros e Ordenação
  const [selectedDiscipline, setSelectedDiscipline] = useState('ALL');
  const [activeSort, setActiveSort] = useState('Recentes'); // Recentes, Mais Votadas, Sem Resposta

  // Formulário de Nova Dúvida
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [postDisciplineId, setPostDisciplineId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const commentRefs = useRef({});

  // 1. Carrega disciplinas e dúvidas do Banco de Dados
  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoading(true);
        const [discRes, postsRes] = await Promise.all([
          api.get('/community/disciplines/'),
          api.get('/community/posts/')
        ]);
        setDisciplines(discRes.data);
        if (discRes.data.length > 0) {
          setPostDisciplineId(discRes.data[0].id);
        }
        setPosts(postsRes.data);
      } catch (err) {
        console.error('Erro ao carregar dados do fórum:', err);
        setErrorMsg('Não foi possível carregar os posts do fórum.');
      } finally {
        setLoading(false);
      }
    }
    fetchInitialData();
  }, []);

  // 2. Filtra ou reordena quando seleciona disciplina ou ordem
  const fetchFilteredPosts = async (discId, sort) => {
    try {
      const params = {};
      if (discId && discId !== 'ALL') {
        params.discipline = discId;
      }
      if (sort === 'Mais Votadas') {
        params.sort = 'most_upvoted';
      } else if (sort === 'Sem Resposta') {
        params.sort = 'unanswered';
      }
      const response = await api.get('/community/posts/', { params });
      setPosts(response.data);
    } catch (err) {
      console.error('Erro ao filtrar posts:', err);
    }
  };

  const handleDisciplineFilter = (discId) => {
    setSelectedDiscipline(discId);
    fetchFilteredPosts(discId, activeSort);
  };

  const handleSortChange = (newSort) => {
    setActiveSort(newSort);
    fetchFilteredPosts(selectedDiscipline, newSort);
  };

  // 3. Criar Post real no Backend
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      setErrorMsg('Por favor, informe o título e a descrição da sua dúvida.');
      return;
    }
    if (!postDisciplineId) {
      setErrorMsg('Selecione uma disciplina para a dúvida.');
      return;
    }

    setSubmittingPost(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        title: newPostTitle.trim(),
        content: newPostContent.trim(),
        discipline: postDisciplineId,
        is_question: true
      };

      const res = await api.post('/community/posts/', payload);
      setPosts([res.data, ...posts]);
      setNewPostTitle('');
      setNewPostContent('');
      setSuccessMsg('Pergunta publicada com sucesso! +20 XP concedidos.');
      
      // Recompensa visual no XP do usuário
      if (currentUser) {
        updateCurrentUser({ xp: (currentUser.xp || 0) + 20 });
      }

      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Erro ao publicar pergunta. Tente novamente.');
    } finally {
      setSubmittingPost(false);
    }
  };

  // 4. Formatar Editor de Comentário
  const formatComment = (postId, command) => {
    const el = commentRefs.current[postId];
    if (el) {
      el.focus();
      if (command === 'code') {
        document.execCommand('formatBlock', false, 'PRE');
      } else {
        document.execCommand(command, false, null);
      }
    }
  };

  // 5. Adicionar Resposta real no Backend
  const handleAddComment = async (postId) => {
    const el = commentRefs.current[postId];
    const content = el ? el.innerHTML : '';
    
    if (!content || content.trim() === '' || content === '<br>') return;

    try {
      const response = await api.post('/community/answers/', {
        post: postId,
        content: content
      });

      const newAnswer = response.data;

      setPosts(posts.map(p => {
        if (p.id === postId) {
          const updatedAnswers = [...(p.answers || []), newAnswer];
          return { ...p, answers: updatedAnswers, answers_count: updatedAnswers.length };
        }
        return p;
      }));

      if (el) el.innerHTML = '';

      if (currentUser) {
        updateCurrentUser({ xp: (currentUser.xp || 0) + 50 });
      }
    } catch (err) {
      alert('Não foi possível enviar sua resposta. Tente novamente.');
    }
  };

  // 6. Marcar como Solução no Backend
  const toggleSolution = async (postId, answerId) => {
    try {
      const response = await api.post(`/community/answers/${answerId}/toggle_solution/`);
      const { is_verified_solution, validated_by_professor } = response.data;

      setPosts(posts.map(post => {
        if (post.id === postId) {
          const updatedAnswers = post.answers.map(ans => 
            ans.id === answerId 
              ? { ...ans, is_verified_solution, validated_by_professor } 
              : { ...ans, is_verified_solution: false }
          );
          return { 
            ...post, 
            answers: updatedAnswers, 
            is_solved: updatedAnswers.some(a => a.is_verified_solution) 
          };
        }
        return post;
      }));
    } catch (err) {
      const msg = err.response?.data?.error || 'Apenas o autor da pergunta ou professor pode validar a solução.';
      alert(msg);
    }
  };

  // 7. Upvote no Backend
  const handleUpvote = async (postId) => {
    try {
      const res = await api.post(`/community/posts/${postId}/upvote/`);
      setPosts(posts.map(p => {
        if (p.id === postId) {
          return { 
            ...p, 
            has_upvoted: res.data.upvoted, 
            upvotes_count: res.data.upvotes_count 
          };
        }
        return p;
      }));
    } catch (err) {
      console.error('Erro ao curtir post:', err);
    }
  };

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return 'Recente';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-darker p-3 sm:p-6 md:p-8 rounded-xl border border-slate-700 shadow-xl animate-fade-in max-w-5xl mx-auto">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2 flex-wrap">
            <MessageSquare className="text-primary" size={28} /> Fórum Acadêmico de Dúvidas
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Tire dúvidas, ajude colegas e ganhe XP e selos resolvendo questões da comunidade.</p>
        </div>
      </div>

      {/* Faixa de Filtros por Disciplina */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/50 p-3.5 rounded-xl border border-slate-700 mb-8">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => handleDisciplineFilter('ALL')}
            className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-bold transition-all ${selectedDiscipline === 'ALL' ? 'bg-primary text-white shadow-[0_0_12px_rgba(109,40,217,0.5)]' : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-600'}`}
          >
            Todas as Disciplinas
          </button>
          {disciplines.map(disc => (
            <button 
              key={disc.id}
              onClick={() => handleDisciplineFilter(disc.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all ${selectedDiscipline === disc.id ? 'bg-primary text-white shadow-[0_0_12px_rgba(109,40,217,0.5)]' : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-600'}`}
            >
              {disc.name}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Filter size={16} className="text-primary" />
          <span className="font-semibold">Ordenar:</span>
          <select 
            className="bg-slate-900 border border-slate-600 rounded-lg py-1.5 px-3 focus:outline-none focus:border-primary text-white text-xs md:text-sm font-medium"
            value={activeSort}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="Recentes">Mais Recentes</option>
            <option value="Mais Votadas">Mais Votadas</option>
            <option value="Sem Resposta">Sem Resposta</option>
          </select>
        </div>
      </div>

      {/* Mensagens de Sucesso / Erro */}
      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3 animate-fade-in">
          <Sparkles size={18} className="text-emerald-400 shrink-0" />
          <span className="font-bold">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm flex items-center gap-3 animate-fade-in">
          <AlertCircle size={18} className="text-red-400 shrink-0" />
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}
      
      {/* Formulário de Criação de Novo Post */}
      <div className="bg-slate-800/80 p-5 md:p-6 rounded-xl border border-slate-700 mb-8 shadow-lg">
        <div className="flex gap-4">
          <img 
            src={currentUser?.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix'} 
            alt="Avatar" 
            className="w-11 h-11 rounded-full border-2 border-primary hidden md:block object-cover" 
          />
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <select 
                className="bg-darker border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary font-bold text-sm sm:max-w-xs"
                value={postDisciplineId}
                onChange={(e) => setPostDisciplineId(e.target.value)}
              >
                {disciplines.map(d => (
                  <option key={d.id} value={d.id}>📚 {d.name} ({d.code})</option>
                ))}
              </select>
              <input 
                type="text" 
                placeholder="Título da sua dúvida (ex: Dúvida em Cálculo II - Limites)..." 
                className="flex-1 bg-darker border border-slate-700 rounded-lg p-3 text-white font-bold text-sm focus:outline-none focus:border-primary"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
              />
            </div>

            <textarea 
              placeholder="Descreva seu problema com detalhes, fórmulas ou código..." 
              className="w-full bg-darker border border-slate-700 rounded-lg p-3 text-white h-24 focus:outline-none focus:border-primary resize-none mb-3 text-sm"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            ></textarea>

            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-400" />
                Ganhe <strong>+20 XP</strong> ao publicar uma dúvida
              </span>
              <button 
                onClick={handleCreatePost} 
                disabled={submittingPost}
                className="bg-primary hover:bg-accent text-white font-bold py-2 px-5 rounded-lg transition-colors shadow-lg shadow-primary/20 flex items-center gap-2 text-sm"
              >
                {submittingPost && <Loader2 size={16} className="animate-spin" />}
                Publicar Pergunta
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Dúvidas / Posts */}
      {loading ? (
        <div className="text-center py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 size={32} className="animate-spin text-primary" />
          <span>Carregando dúvidas da comunidade...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.length === 0 && (
            <div className="text-center text-slate-400 py-12 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <MessageSquare size={36} className="mx-auto text-slate-500 mb-2" />
              <p className="font-semibold text-lg text-white">Nenhuma dúvida encontrada</p>
              <p className="text-sm mt-1">Seja o primeiro a fazer uma pergunta nesta disciplina!</p>
            </div>
          )}

          {posts.map(post => (
            <div 
              key={post.id} 
              className={`bg-slate-800 p-5 md:p-6 rounded-xl border transition-all ${
                post.is_solved ? 'border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.06)]' : 'border-slate-700'
              }`}
            >
              
              {/* Cabeçalho do Post */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={post.author_avatar} 
                    alt={post.author_name} 
                    className={`w-10 h-10 rounded-full border-2 object-cover ${
                      post.author_role === 'PROFESSOR' ? 'border-amber-400' : 'border-slate-600'
                    }`} 
                  />
                  <div>
                    <h4 className="font-bold text-white flex items-center gap-2 text-sm md:text-base">
                      {post.author_name}
                      {post.author_role === 'PROFESSOR' && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1">
                          <Medal size={12} className="text-amber-400" /> Professor
                        </span>
                      )}
                      <span className="text-xs bg-slate-700/80 text-slate-300 px-2 py-0.5 rounded-full font-medium">
                        Nv. {post.author_level}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{formatTimestamp(post.created_at)}</span>
                      {post.discipline_name && (
                        <span className="text-[10px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                          {post.discipline_name}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Status Resolvido & Botão de Upvote */}
                <div className="flex items-center gap-2">
                  {post.is_solved && (
                    <div className="hidden sm:flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-lg border border-emerald-500/30">
                      <CheckCircle size={14} /> Resolvido
                    </div>
                  )}
                  <button 
                    onClick={() => handleUpvote(post.id)} 
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
                      post.has_upvoted 
                        ? 'bg-primary text-white border-primary shadow-[0_0_10px_rgba(109,40,217,0.5)]' 
                        : 'bg-slate-700/50 hover:bg-primary/20 hover:text-primary text-slate-300 border-slate-600'
                    }`}
                    title="Votar como útil"
                  >
                    <ThumbsUp size={14} /> 
                    <span className="font-bold text-xs">{post.upvotes_count}</span>
                  </button>
                </div>
              </div>
              
              {/* Conteúdo da Pergunta */}
              <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
              <p className="text-slate-300 mb-6 leading-relaxed whitespace-pre-wrap text-sm md:text-base">{post.content}</p>

              {/* Divisão */}
              <div className="border-t border-slate-700/50 my-6"></div>

              {/* Comentários / Respostas */}
              <div className="space-y-4 mb-6">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <MessageSquare size={14} /> Respostas ({post.answers ? post.answers.length : 0})
                </h5>
                
                {post.answers && post.answers.map(comment => (
                  <div 
                    key={comment.id} 
                    className={`flex gap-3 md:gap-4 p-4 rounded-xl relative transition-all ${
                      comment.is_verified_solution 
                        ? 'bg-emerald-950/30 border border-emerald-500/40 shadow-sm' 
                        : comment.author_role === 'PROFESSOR' 
                          ? 'bg-slate-900/70 border border-amber-500/30' 
                          : 'bg-darker border border-slate-700/40'
                    }`}
                  >
                    {comment.is_verified_solution && (
                      <div className="absolute -top-3 -right-3 bg-emerald-500 text-white rounded-full p-1.5 shadow-lg shadow-emerald-500/40" title="Solução Verificada">
                        <Check size={16} strokeWidth={3} />
                      </div>
                    )}

                    <img 
                      src={comment.author_avatar} 
                      alt={comment.author_name} 
                      className={`w-9 h-9 md:w-10 md:h-10 rounded-full border object-cover shrink-0 ${
                        comment.author_role === 'PROFESSOR' ? 'border-amber-400' : 'border-slate-600'
                      }`} 
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1 flex-wrap gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`font-bold text-sm ${comment.author_role === 'PROFESSOR' ? 'text-amber-400' : 'text-white'}`}>
                            {comment.author_name}
                          </h4>
                          {comment.author_role === 'PROFESSOR' && (
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                              Professor
                            </span>
                          )}
                          <span className="text-xs text-slate-500">{formatTimestamp(comment.created_at)}</span>
                        </div>
                        
                        {/* Botão de Marcar Solução (autor da pergunta, professor ou admin) */}
                        <button 
                          onClick={() => toggleSolution(post.id, comment.id)}
                          className={`text-xs flex items-center gap-1 font-bold px-2.5 py-1 rounded-lg transition-all ${
                            comment.is_verified_solution 
                              ? 'bg-emerald-500 text-white shadow-sm' 
                              : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-slate-700 hover:border-emerald-500/30'
                          }`}
                        >
                          <CheckCircle size={13} />
                          {comment.is_verified_solution ? 'Solução Aprovada' : 'Validar Solução'}
                        </button>
                      </div>
                      
                      <div 
                        className="text-slate-200 text-sm md:text-base leading-relaxed prose prose-invert max-w-none mt-1"
                        dangerouslySetInnerHTML={{ __html: comment.content }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Input de Novo Comentário (Mini Rich Text) */}
              <div className="bg-darker rounded-xl border border-slate-700 overflow-hidden focus-within:border-primary transition-colors">
                <div className="bg-slate-800/80 border-b border-slate-700 px-3 py-2 flex gap-2 items-center">
                  <button type="button" onClick={() => formatComment(post.id, 'bold')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors" title="Negrito"><Bold size={14}/></button>
                  <button type="button" onClick={() => formatComment(post.id, 'italic')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors" title="Itálico"><Italic size={14}/></button>
                  <div className="w-px h-5 bg-slate-700 my-auto mx-1"></div>
                  <button type="button" onClick={() => formatComment(post.id, 'code')} className="p-1.5 text-slate-400 hover:text-accent hover:bg-slate-700 rounded transition-colors" title="Bloco de Código"><Code size={14}/></button>
                  <span className="text-[11px] text-slate-400 ml-auto flex items-center gap-1">
                    <Sparkles size={12} className="text-amber-400" />
                    +50 XP por resposta
                  </span>
                </div>
                
                <style>{`
                  .comment-editor pre {
                    background-color: #0f172a;
                    padding: 0.75rem;
                    border-radius: 0.375rem;
                    font-family: monospace;
                    border: 1px solid #334155;
                    color: #38bdf8;
                    margin-top: 0.5rem;
                    margin-bottom: 0.5rem;
                  }
                `}</style>

                <div 
                  ref={el => commentRefs.current[post.id] = el}
                  contentEditable
                  className="comment-editor w-full p-4 min-h-[75px] max-h-[250px] overflow-y-auto text-sm text-slate-200 outline-none"
                  placeholder="Escreva sua explicação e ajude seu colega..."
                />
                
                <div className="bg-slate-800/50 border-t border-slate-700 p-2.5 flex justify-end">
                  <button 
                    onClick={() => handleAddComment(post.id)}
                    className="bg-primary hover:bg-primary/90 text-white font-bold py-1.5 px-4 rounded-lg text-sm transition-colors shadow-lg shadow-primary/20 flex items-center gap-1.5"
                  >
                    <Send size={14} />
                    Enviar Resposta (+50 XP)
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Forum;
