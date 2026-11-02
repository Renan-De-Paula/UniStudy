import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  ExternalLink, ThumbsUp, Video, FileText, GraduationCap, 
  Plus, X, Globe, Sparkles, CheckCircle2, Search 
} from 'lucide-react';

function Cursos() {
  const { currentUser } = useAuth();

  const [cursos, setCursos] = useState([
    {
      id: 1,
      title: 'React.js — Do Zero ao Avançado',
      platform: 'YouTube (Vídeo)',
      format: 'VIDEO',
      category: 'Frontend',
      description: 'Curso completo em vídeo cobrindo Hooks, State, Componentes e integração com APIs. Essencial para o projeto!',
      link: 'https://www.youtube.com/watch?v=FXqX7ussxZ8',
      recommendedBy: { name: 'prof_Renan', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=prof_Renan' },
      upvotes: 42,
      userHasUpvoted: false
    },
    {
      id: 2,
      title: 'Machine Learning & IA com Python',
      platform: 'Coursera (Vídeo & Prática)',
      format: 'VIDEO',
      category: 'Inteligência Artificial',
      description: 'Fundamentos de redes neurais e algoritmos supervisionados ministrado pelo Prof. Andrew Ng. Excelente para TCC.',
      link: 'https://www.coursera.org/learn/machine-learning',
      recommendedBy: { name: 'Matheus', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Matheus' },
      upvotes: 38,
      userHasUpvoted: false
    },
    {
      id: 3,
      title: 'Clean Code: Boas Práticas e SOLID',
      platform: 'Guia Escrito (GitHub)',
      format: 'TEXT',
      category: 'Engenharia de Software',
      description: 'Manual de leitura obrigatória para quem quer escrever código limpo, arquitetura escalável e padrões de projeto.',
      link: 'https://github.com/ryanmcdermott/clean-code-javascript',
      recommendedBy: { name: 'Milly', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Milly' },
      upvotes: 29,
      userHasUpvoted: false
    },
    {
      id: 4,
      title: 'CS50 Harvard — Introdução à Ciência da Computação',
      platform: 'Harvard / YouTube (Vídeo)',
      format: 'VIDEO',
      category: 'Ciência da Computação',
      description: 'O curso mais famoso do mundo de introdução à computação, estruturas de dados, C e Python. Totalmente gratuito!',
      link: 'https://www.youtube.com/watch?v=8mAITcNt710',
      recommendedBy: { name: 'Larissa', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Larissa' },
      upvotes: 56,
      userHasUpvoted: false
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState('ALL'); // ALL, VIDEO, TEXT
  const [newTitle, setNewTitle] = useState('');
  const [newPlatform, setNewPlatform] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newFormat, setNewFormat] = useState('VIDEO');
  const [newLink, setNewLink] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const filteredCursos = cursos.filter(c => {
    const matchesFormat = formatFilter === 'ALL' || c.format === formatFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.platform.toLowerCase().includes(q);
    return matchesFormat && matchesSearch;
  });

  const handleAddCurso = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLink.trim()) {
      alert('Por favor, informe o nome do curso e o link.');
      return;
    }

    // Garante que o link comece com http:// ou https://
    let finalLink = newLink.trim();
    if (!finalLink.startsWith('http://') && !finalLink.startsWith('https://')) {
      finalLink = 'https://' + finalLink;
    }

    const newCurso = {
      id: Date.now(),
      title: newTitle.trim(),
      platform: newPlatform.trim() || 'Internet',
      format: newFormat,
      category: newCategory.trim() || 'Geral',
      description: newDesc.trim() || 'Curso recomendado pela comunidade UniStudy.',
      link: finalLink,
      recommendedBy: {
        name: currentUser?.first_name ? `${currentUser.first_name} ${currentUser.last_name || ''}`.trim() : currentUser?.username || 'Aluno UniStudy',
        avatar: currentUser?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser?.username || 'user'}`
      },
      upvotes: 1,
      userHasUpvoted: true
    };

    setCursos([newCurso, ...cursos]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewPlatform('');
    setNewCategory('');
    setNewLink('');
    setNewDesc('');
  };

  const handleToggleUpvote = (id) => {
    setCursos(cursos.map(curso => {
      if (curso.id === id) {
        const isUpvoted = curso.userHasUpvoted;
        return {
          ...curso,
          upvotes: isUpvoted ? curso.upvotes - 1 : curso.upvotes + 1,
          userHasUpvoted: !isUpvoted
        };
      }
      return curso;
    }));
  };

  return (
    <div className="bg-darker p-3 sm:p-6 md:p-8 rounded-xl border border-slate-700 shadow-xl animate-fade-in relative">
      
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-1 flex items-center gap-2 sm:gap-3 flex-wrap">
            <GraduationCap className="text-primary" size={28} /> Recomendação de Cursos & Materiais
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Descubra videoaulas, cursos e guias recomendados e votados pelos alunos da universidade.
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-sm transition-all shrink-0 active:scale-95"
        >
          <Plus size={18} /> + Indicar um Curso
        </button>
      </div>

      {/* Barra de Busca e Filtros Rápidos (Fase 12) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome, assunto, linguagem ou plataforma..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <button 
            type="button"
            onClick={() => setFormatFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              formatFilter === 'ALL'
                ? 'bg-primary text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            Todos ({cursos.length})
          </button>
          <button 
            type="button"
            onClick={() => setFormatFilter('VIDEO')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              formatFilter === 'VIDEO'
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            <Video size={13} className="text-red-400" /> Vídeos ({cursos.filter(c => c.format === 'VIDEO').length})
          </button>
          <button 
            type="button"
            onClick={() => setFormatFilter('TEXT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              formatFilter === 'TEXT'
                ? 'bg-sky-500 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            <FileText size={13} className="text-sky-400" /> Artigos & Guias ({cursos.filter(c => c.format === 'TEXT').length})
          </button>
        </div>
      </div>

      {/* Grid de Cursos */}
      {filteredCursos.length === 0 ? (
        <div className="py-16 text-center text-slate-400 bg-slate-800/40 rounded-2xl border border-slate-700/60 p-6">
          <GraduationCap size={40} className="mx-auto text-slate-500 mb-3" />
          <h4 className="text-lg font-bold text-white mb-1">Nenhum curso ou material encontrado</h4>
          <p className="text-xs sm:text-sm max-w-md mx-auto text-slate-400 mb-4">
            Não encontramos recomendações com os filtros atuais "{searchQuery}".
          </p>
          <button 
            onClick={() => { setSearchQuery(''); setFormatFilter('ALL'); }}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all"
          >
            Limpar Filtros de Busca
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCursos.map(curso => (
            <div 
              key={curso.id} 
              className="bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-700 hover:border-primary/60 transition-all shadow-xl flex flex-col justify-between group"
            >
              <div>
                {/* Badges de Formato e Categoria */}
                <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
                  <span className="text-xs font-bold bg-slate-900 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                    {curso.format === 'VIDEO' ? <Video size={13} className="text-red-400" /> : <FileText size={13} className="text-sky-400" />}
                    {curso.platform}
                  </span>
                  
                  <span className="text-xs font-semibold text-primary border border-primary/30 bg-primary/10 px-2.5 py-0.5 rounded-full">
                    {curso.category}
                  </span>
                </div>
                
                {/* Título do Curso */}
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-tight group-hover:text-primary-light transition-colors">
                  {curso.title}
                </h3>
                
                {/* Descrição */}
                <p className="text-slate-300 text-sm leading-relaxed mb-6 line-clamp-3">
                  {curso.description}
                </p>
              </div>

              <div>
                {/* BOTÃO PARA IR DIRETO AO LINK DO CURSO (VÍDEO OU ESCRITA) */}
                <a 
                  href={curso.link} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-full bg-primary/20 hover:bg-primary text-primary-light hover:text-white border border-primary/40 hover:border-primary font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 mb-4 group/btn"
                  title={`Acessar material: ${curso.title}`}
                >
                  {curso.format === 'VIDEO' ? <Video size={16} /> : <ExternalLink size={16} />}
                  <span>Acessar {curso.format === 'VIDEO' ? 'Vídeo / Aula' : 'Material Escrito'}</span>
                  <ExternalLink size={13} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>

                {/* Rodapé: Quem indicou + Botão de Votos (Upvotes) */}
                <div className="flex justify-between items-center pt-3 border-t border-slate-700/60">
                  <div className="flex items-center gap-2 min-w-0">
                    <img 
                      src={curso.recommendedBy.avatar} 
                      alt={curso.recommendedBy.name} 
                      className="w-6 h-6 rounded-full border border-slate-600 object-cover shrink-0" 
                    />
                    <span className="text-xs text-slate-400 truncate">
                      por <strong className="text-slate-200">{curso.recommendedBy.name}</strong>
                    </span>
                  </div>
                  
                  {/* BOTÃO DE UPVOTE / VOTO DA COMUNIDADE */}
                  <button 
                    type="button"
                    onClick={() => handleToggleUpvote(curso.id)}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all active:scale-95 ${
                      curso.userHasUpvoted 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm' 
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white hover:border-slate-500'
                    }`}
                    title={curso.userHasUpvoted ? "Você recomendou este curso! Clique para remover seu voto." : "Recomendar este curso para outros alunos (Voto da Comunidade)"}
                  >
                    <ThumbsUp size={14} className={curso.userHasUpvoted ? "text-emerald-400 fill-emerald-400/20" : ""} />
                    <span>{curso.upvotes} {curso.upvotes === 1 ? 'voto' : 'votos'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Indicação de Curso */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 p-6 sm:p-8 rounded-2xl w-full max-w-lg border border-slate-700 shadow-2xl animate-fade-in relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <GraduationCap className="text-primary" size={24} /> Indicar um Novo Curso
            </h3>
            <p className="text-slate-400 text-xs mb-6">
              Compartilhe um curso, videoaula do YouTube ou material escrito de alta qualidade com seus colegas.
            </p>
            
            <form onSubmit={handleAddCurso} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Nome do Curso ou Conteúdo
                </label>
                <input 
                  required 
                  value={newTitle} 
                  onChange={e => setNewTitle(e.target.value)} 
                  type="text" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary text-sm font-medium" 
                  placeholder="Ex: Curso Completo de Docker e Kubernetes" 
                />
              </div>

              {/* LINK DIRETO DO CURSO OU VÍDEO */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Link Direto (URL do Vídeo ou Site)
                </label>
                <input 
                  required 
                  value={newLink} 
                  onChange={e => setNewLink(e.target.value)} 
                  type="url" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary text-sm font-medium" 
                  placeholder="https://youtube.com/watch?v=... ou https://udemy.com/..." 
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Plataforma</label>
                  <input 
                    required 
                    value={newPlatform} 
                    onChange={e => setNewPlatform(e.target.value)} 
                    type="text" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary text-sm" 
                    placeholder="Ex: YouTube, Alura, Coursera" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Formato</label>
                  <select
                    value={newFormat}
                    onChange={e => setNewFormat(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary text-sm font-medium"
                  >
                    <option value="VIDEO">🎬 Videoaula / Vídeo</option>
                    <option value="TEXT">📄 Artigo / Guia Escrito</option>
                    <option value="COURSE">🎓 Curso Completo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Área / Categoria</label>
                <input 
                  required 
                  value={newCategory} 
                  onChange={e => setNewCategory(e.target.value)} 
                  type="text" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary text-sm" 
                  placeholder="Ex: Frontend, Backend, Inteligência Artificial, Redes" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Por que você recomenda?</label>
                <textarea 
                  required 
                  value={newDesc} 
                  onChange={e => setNewDesc(e.target.value)} 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white h-20 focus:outline-none focus:border-primary resize-none text-sm" 
                  placeholder="Explique o que aprendeu e como ajudou nos seus estudos..."
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-primary/20"
                >
                  Indicar Curso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cursos;
