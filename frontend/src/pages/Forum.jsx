import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, Code, Bold, Italic, ThumbsUp, Medal, Filter, MessageSquare, Check, Tag } from 'lucide-react';

function Forum() {
  const { currentUser } = useAuth();
  
  // Dados simulados
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: { id: 999, name: 'Maria Souza', avatar: 'https://i.pravatar.cc/150?img=5', level: 3, isMentor: false },
      title: 'Dúvida em Cálculo II - Integrais Duplas',
      content: 'Alguém consegue me explicar como definir os limites de integração quando a região é limitada por um círculo e uma parábola?',
      tags: ['Matemática'],
      upvotes: 12,
      timestamp: 'Há 2 horas',
      isSolved: true,
      comments: [
        {
          id: 101,
          author: { id: 2, name: 'Prof. Carlos Lima', avatar: 'https://i.pravatar.cc/150?img=8', level: 25, isMentor: true },
          content: 'Você precisa igualar as duas equações para achar os pontos de interseção. A partir daí, vê qual curva está por cima para os limites em y, e a projeção em x pros limites externos.',
          timestamp: 'Há 1 hora',
          isVerifiedSolution: true,
          upvotes: 8
        }
      ]
    },
    {
      id: 2,
      author: { id: 4, name: 'Pedro Alves', avatar: 'https://i.pravatar.cc/150?img=12', level: 2, isMentor: false },
      title: 'Erro de CORS no Node.js + React',
      content: 'Estou tentando fazer uma requisição do meu frontend pro backend mas o navegador bloqueia dizendo "No Access-Control-Allow-Origin header is present".',
      tags: ['Programação'],
      upvotes: 25,
      timestamp: 'Há 5 horas',
      isSolved: false,
      comments: []
    }
  ]);

  // Estados da interface
  const [activeFilter, setActiveFilter] = useState('Todas');
  const [activeSort, setActiveSort] = useState('Recentes'); // Recentes, Mais Votadas, Sem Resposta

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedTag, setSelectedTag] = useState('Geral');

  const commentRefs = useRef({});

  const availableTags = ['Todas', 'Programação', 'Matemática', 'Física', 'Geral'];

  // Lógica de Postagem
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost = {
      id: Date.now(),
      author: { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar, level: currentUser.level, isMentor: currentUser.role === 'PROFESSOR' },
      title: newPostTitle,
      content: newPostContent,
      tags: [selectedTag === 'Todas' ? 'Geral' : selectedTag],
      upvotes: 0,
      timestamp: 'Agora mesmo',
      isSolved: false,
      comments: []
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
  };

  // Rich Text do Comentário
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

  const handleAddComment = (postId) => {
    const el = commentRefs.current[postId];
    const content = el ? el.innerHTML : '';
    
    if (!content || content.trim() === '' || content === '<br>') return;

    const newComment = {
      id: Date.now(),
      author: { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar, level: currentUser.level, isMentor: currentUser.role === 'PROFESSOR' },
      content: content,
      timestamp: 'Agora mesmo',
      isVerifiedSolution: false,
      upvotes: 0
    };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    }));

    if (el) el.innerHTML = '';
  };

  // Marcar como Solução
  const toggleSolution = (postId, commentId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        // Apenas o autor do post pode marcar a solução (mock check)
        const isAuthor = currentUser?.id === post.author.id;
        
        // Em um sistema real a validação é no backend. Aqui flexibilizamos para testar visualmente.
        const updatedComments = post.comments.map(c => 
          c.id === commentId ? { ...c, isVerifiedSolution: !c.isVerifiedSolution } : { ...c, isVerifiedSolution: false }
        );
        const hasSolution = updatedComments.some(c => c.isVerifiedSolution);
        return { ...post, comments: updatedComments, isSolved: hasSolution };
      }
      return post;
    }));
  };

  // Upvote de Post
  const handleUpvote = (postId) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, upvotes: p.upvotes + 1 } : p));
  };

  // Filtros e Ordenação
  let displayedPosts = posts.filter(post => activeFilter === 'Todas' || post.tags.includes(activeFilter));
  
  if (activeSort === 'Mais Votadas') {
    displayedPosts.sort((a, b) => b.upvotes - a.upvotes);
  } else if (activeSort === 'Sem Resposta') {
    displayedPosts = displayedPosts.filter(p => p.comments.length === 0);
  }

  return (
    <div className="bg-darker p-4 md:p-8 rounded-xl border border-slate-700 shadow-xl animate-fade-in max-w-5xl mx-auto">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-2">
            <MessageSquare className="text-primary" size={32} /> Fórum de Dúvidas
          </h2>
          <p className="text-slate-400 mt-1">Troque conhecimento, faça perguntas e ganhe XP ajudando a comunidade.</p>
        </div>
      </div>

      {/* Faixa de Filtros Rápidos */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/50 p-3 rounded-lg border border-slate-700 mb-8">
        <div className="flex flex-wrap gap-2">
          {availableTags.map(tag => (
            <button 
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${activeFilter === tag ? 'bg-primary text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]' : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-600'}`}
            >
              {tag}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Filter size={16} />
          <span className="font-semibold">Ordenar:</span>
          <select 
            className="bg-slate-900 border border-slate-600 rounded-md py-1 px-2 focus:outline-none focus:border-primary text-white"
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value)}
          >
            <option>Recentes</option>
            <option>Mais Votadas</option>
            <option>Sem Resposta</option>
          </select>
        </div>
      </div>
      
      {/* Criar Novo Post */}
      <div className="bg-slate-800/80 p-5 md:p-6 rounded-xl border border-slate-700 mb-8 shadow-lg">
        <div className="flex gap-4">
          <img src={currentUser?.avatar || 'https://i.pravatar.cc/150'} alt="Avatar" className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-primary hidden md:block" />
          <div className="flex-1">
            <div className="flex gap-2 mb-3">
              <select 
                className="bg-darker border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary font-bold text-sm"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                <option value="Geral">🔖 Geral</option>
                <option value="Programação">💻 Programação</option>
                <option value="Matemática">📐 Matemática</option>
                <option value="Física">⚛️ Física</option>
              </select>
              <input 
                type="text" 
                placeholder="Título da sua dúvida..." 
                className="flex-1 bg-darker border border-slate-700 rounded-lg p-3 text-white font-bold focus:outline-none focus:border-primary"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
              />
            </div>
            <textarea 
              placeholder="Descreva seu problema com detalhes..." 
              className="w-full bg-darker border border-slate-700 rounded-lg p-3 text-white h-24 focus:outline-none focus:border-primary resize-none mb-3"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            ></textarea>
            <div className="flex justify-end">
              <button onClick={handleCreatePost} className="bg-primary hover:bg-accent text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-lg shadow-primary/20">
                Publicar Pergunta
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Posts */}
      <div className="space-y-6">
        {displayedPosts.length === 0 && (
          <div className="text-center text-slate-500 py-10">
            Nenhuma dúvida encontrada com estes filtros.
          </div>
        )}

        {displayedPosts.map(post => (
          <div key={post.id} className={`bg-slate-800 p-5 md:p-6 rounded-xl border transition-all ${post.isSolved ? 'border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]' : 'border-slate-700'}`}>
            
            {/* Cabeçalho do Post */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={post.author.avatar} alt={post.author.name} className={`w-10 h-10 rounded-full border-2 ${post.author.isMentor ? 'border-amber-400' : 'border-slate-600'}`} />
                <div>
                  <h4 className="font-bold text-white flex items-center gap-2">
                    {post.author.name}
                    {post.author.isMentor && <Medal size={14} className="text-amber-400" title="Mentor/Professor" />}
                    <span className="text-xs bg-slate-700/80 text-slate-300 px-2 py-0.5 rounded-full font-medium">Nv. {post.author.level}</span>
                  </h4>
                  <p className="text-xs text-slate-400 flex items-center gap-2">
                    {post.timestamp}
                    {post.tags.map(tag => (
                      <span key={tag} className="text-[10px] uppercase font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">{tag}</span>
                    ))}
                  </p>
                </div>
              </div>

              {/* Badges de Status (Resolvido / Upvotes) */}
              <div className="flex items-center gap-2">
                {post.isSolved && (
                  <div className="hidden md:flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2 py-1 rounded-md border border-emerald-500/20">
                    <CheckCircle size={14} /> Resolvido
                  </div>
                )}
                <button onClick={() => handleUpvote(post.id)} className="flex items-center gap-1.5 bg-slate-700/50 hover:bg-primary/20 hover:text-primary text-slate-300 px-3 py-1.5 rounded-lg border border-slate-600 transition-colors">
                  <ThumbsUp size={14} /> <span className="font-bold">{post.upvotes}</span>
                </button>
              </div>
            </div>
            
            {/* Conteúdo da Pergunta */}
            <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
            <p className="text-slate-300 mb-6 leading-relaxed whitespace-pre-wrap">{post.content}</p>

            {/* Divisão */}
            <div className="border-t border-slate-700/50 my-6"></div>

            {/* Comentários / Respostas */}
            <div className="space-y-4 mb-6">
              <h5 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                Respostas ({post.comments.length})
              </h5>
              
              {post.comments.map(comment => (
                <div key={comment.id} className={`flex gap-3 md:gap-4 p-4 rounded-xl relative ${comment.isVerifiedSolution ? 'bg-emerald-900/20 border border-emerald-500/30' : comment.author.isMentor ? 'bg-slate-900/60 border border-amber-500/20' : 'bg-darker border border-transparent'}`}>
                  
                  {comment.isVerifiedSolution && (
                    <div className="absolute -top-3 -right-3 bg-emerald-500 text-white rounded-full p-1 shadow-lg shadow-emerald-500/30" title="Solução Verificada">
                      <Check size={16} strokeWidth={3} />
                    </div>
                  )}

                  <img src={comment.author.avatar} alt={comment.author.name} className={`w-8 h-8 md:w-10 md:h-10 rounded-full border ${comment.author.isMentor ? 'border-amber-400' : 'border-slate-600'}`} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-bold text-sm ${comment.author.isMentor ? 'text-amber-400' : 'text-white'}`}>
                          {comment.author.name}
                        </h4>
                        {comment.author.isMentor && <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Professor</span>}
                        <span className="text-xs text-slate-500 hidden md:inline">{comment.timestamp}</span>
                      </div>
                      
                      {/* Botão Marcar Solução (Visível para o Autor ou para testes) */}
                      <button 
                        onClick={() => toggleSolution(post.id, comment.id)}
                        className={`text-xs flex items-center gap-1 font-bold px-2 py-1 rounded transition-all ${comment.isVerifiedSolution ? 'bg-emerald-500 text-white' : 'text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/30'}`}
                      >
                        {comment.isVerifiedSolution ? 'Solução' : 'Marcar Solução'}
                      </button>
                    </div>
                    
                    {/* Renderiza HTML devido ao Rich Text */}
                    <div 
                      className="text-slate-300 text-sm md:text-base leading-relaxed prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: comment.content }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Input de Novo Comentário (Mini Rich Text) */}
            <div className="bg-darker rounded-xl border border-slate-700 overflow-hidden focus-within:border-primary transition-colors">
              <div className="bg-slate-800/80 border-b border-slate-700 px-3 py-2 flex gap-2">
                <button type="button" onClick={() => formatComment(post.id, 'bold')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors" title="Negrito"><Bold size={14}/></button>
                <button type="button" onClick={() => formatComment(post.id, 'italic')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors" title="Itálico"><Italic size={14}/></button>
                <div className="w-px h-5 bg-slate-700 my-auto mx-1"></div>
                <button type="button" onClick={() => formatComment(post.id, 'code')} className="p-1.5 text-slate-400 hover:text-accent hover:bg-slate-700 rounded transition-colors" title="Bloco de Código"><Code size={14}/></button>
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
                className="comment-editor w-full p-4 min-h-[80px] max-h-[300px] overflow-y-auto text-sm text-slate-200 outline-none"
                placeholder="Escreva sua resposta e ganhe XP..."
              />
              
              <div className="bg-slate-800/50 border-t border-slate-700 p-2 flex justify-end">
                <button 
                  onClick={() => handleAddComment(post.id)}
                  className="bg-primary hover:bg-blue-500 text-white font-bold py-1.5 px-4 rounded-lg text-sm transition-colors shadow-lg"
                >
                  Enviar Resposta
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Forum;
