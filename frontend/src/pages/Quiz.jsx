import React, { useState, useEffect } from 'react';
import { 
  Brain, Search, Play, CheckCircle2, Clock, Award, ChevronRight, 
  User, Star, ArrowLeft, HelpCircle, PlusCircle, Trash2, Check, 
  Loader2, GraduationCap, X, Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getQuizzes, createQuiz, submitQuiz } from '../services/gamificationService';

function Quiz() {
  const { currentUser, updateCurrentUser, addXP } = useAuth();
  const [view, setView] = useState('hub'); // hub, player, result
  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submissionResult, setSubmissionResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Modal de Criação de Quiz (Exclusivo para Professor e Admin)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    category: 'Programação',
    difficulty: 'Iniciante',
    xp_reward: 150,
    badge_emoji: '🏆',
    badge_title: '',
    badge_description: '',
    questions: [
      {
        id: 1,
        text: '',
        options: ['', '', '', ''],
        correct: 0
      }
    ]
  });

  const isTeacherOrAdmin = Boolean(
    currentUser?.role === 'PROFESSOR' || 
    currentUser?.role === 'ADMIN' || 
    currentUser?.is_staff || 
    currentUser?.is_superuser
  );

  const loadQuizzes = async () => {
    try {
      setLoadingQuizzes(true);
      const data = await getQuizzes();
      setQuizzes(data || []);
    } catch (err) {
      console.error('Erro ao carregar quizzes:', err);
    } finally {
      setLoadingQuizzes(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setSubmissionResult(null);
    setView('player');
  };

  const handleSelectAnswer = (questionId, optionIndex) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionIndex });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    try {
      // Submeter para o backend
      const res = await submitQuiz(activeQuiz.id, selectedAnswers);
      setSubmissionResult(res);

      if (res.xp_earned > 0) {
        if (updateCurrentUser) {
          updateCurrentUser({ xp: res.user_xp });
        } else if (addXP) {
          addXP(res.xp_earned);
        }
      }
    } catch (err) {
      console.error('Erro ao submeter quiz:', err);
      // Fallback local caso offline
      let localScore = 0;
      activeQuiz.questions.forEach(q => {
        if (selectedAnswers[q.id] === q.correct) localScore++;
      });
      const pct = Math.round((localScore / activeQuiz.questions.length) * 100);
      const earned = pct >= 50 ? activeQuiz.xp_reward : Math.round(activeQuiz.xp_reward * (pct / 100));
      const tier = pct === 100 ? 'OURO' : (pct >= 70 ? 'PRATA' : (pct >= 50 ? 'BRONZE' : null));
      const badgeInfo = tier ? {
        name: `${tier === 'OURO' ? '🥇 [Ouro]' : tier === 'PRATA' ? '🥈 [Prata]' : '🥉 [Bronze]'} ${activeQuiz.badge_title || activeQuiz.title}`,
        description: `${activeQuiz.badge_description || activeQuiz.description || 'Conquista do Quiz'} (${tier === 'OURO' ? '100% Gabaritado!' : tier === 'PRATA' ? '70%+ de acerto' : '50%+ de acerto'})`,
        tier,
        emoji: tier === 'OURO' ? '🥇' : tier === 'PRATA' ? '🥈' : '🥉'
      } : null;

      setSubmissionResult({
        score: localScore,
        total_questions: activeQuiz.questions.length,
        score_percentage: pct,
        passed: pct >= 50,
        xp_earned: earned,
        badge_tier: tier,
        badge_awarded: badgeInfo
      });
      if (earned > 0 && addXP) addXP(earned);
    }

    setView('result');
  };

  const resetToHub = () => {
    setActiveQuiz(null);
    setView('hub');
  };

  // Funções do Modal de Criação de Quiz
  const handleAddQuestion = () => {
    setNewQuiz(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: prev.questions.length + 1,
          text: '',
          options: ['', '', '', ''],
          correct: 0
        }
      ]
    }));
  };

  const handleRemoveQuestion = (idx) => {
    if (newQuiz.questions.length <= 1) return;
    setNewQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx)
    }));
  };

  const handleQuestionTextChange = (idx, text) => {
    setNewQuiz(prev => {
      const qList = [...prev.questions];
      qList[idx].text = text;
      return { ...prev, questions: qList };
    });
  };

  const handleOptionChange = (qIdx, optIdx, val) => {
    setNewQuiz(prev => {
      const qList = [...prev.questions];
      const opts = [...qList[qIdx].options];
      opts[optIdx] = val;
      qList[qIdx].options = opts;
      return { ...prev, questions: qList };
    });
  };

  const handleCorrectChoice = (qIdx, optIdx) => {
    setNewQuiz(prev => {
      const qList = [...prev.questions];
      qList[qIdx].correct = optIdx;
      return { ...prev, questions: qList };
    });
  };

  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    if (!newQuiz.title.trim()) {
      alert('Por favor, informe o título do Quiz.');
      return;
    }

    for (let i = 0; i < newQuiz.questions.length; i++) {
      const q = newQuiz.questions[i];
      if (!q.text.trim()) {
        alert(`A questão #${i + 1} precisa ter um enunciado.`);
        return;
      }
      const filledOpts = q.options.filter(o => o.trim().length > 0);
      if (filledOpts.length < 2) {
        alert(`A questão #${i + 1} precisa ter pelo menos 2 alternativas preenchidas.`);
        return;
      }
    }

    try {
      setIsPublishing(true);
      await createQuiz({
        title: newQuiz.title,
        description: newQuiz.description,
        category: newQuiz.category,
        difficulty: newQuiz.difficulty,
        xp_reward: Number(newQuiz.xp_reward) || 150,
        badge_emoji: newQuiz.badge_emoji || '🏆',
        badge_title: newQuiz.badge_title || newQuiz.title,
        badge_description: newQuiz.badge_description || newQuiz.description,
        questions: newQuiz.questions
      });

      alert('🎉 Quiz criado com sucesso! As conquistas de Bronze (50%), Prata (70%) e Ouro (100%) foram geradas automaticamente!');
      setShowCreateModal(false);
      // Resetar formulário
      setNewQuiz({
        title: '',
        description: '',
        category: 'Programação',
        difficulty: 'Iniciante',
        xp_reward: 150,
        badge_emoji: '🏆',
        badge_title: '',
        badge_description: '',
        questions: [{ id: 1, text: '', options: ['', '', '', ''], correct: 0 }]
      });
      loadQuizzes();
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.detail || 'Erro ao publicar quiz.');
    } finally {
      setIsPublishing(false);
    }
  };

  const filteredQuizzes = quizzes.filter(q => {
    const matchSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (q.category && q.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCat = selectedCategory === 'Todos' || q.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="h-full flex flex-col relative z-10 animate-fade-in overflow-y-auto">
      
      {/* -------------------- HUB VIEW -------------------- */}
      {view === 'hub' && (
        <div className="flex-1 flex flex-col gap-6 max-w-5xl mx-auto w-full pb-8">
          
          {/* HEADER CABEÇALHO */}
          <div className="bg-gradient-to-r from-primary via-purple-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex-shrink-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white flex items-center gap-1 backdrop-blur-md">
                  <Sparkles size={12} /> Desafios Acadêmicos
                </span>
                {isTeacherOrAdmin && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-400/25 text-amber-200 border border-amber-300/40 flex items-center gap-1">
                    🎓 Modo Criador Docente
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 flex items-center gap-2.5">
                <Brain size={32} /> Central de Quizzes & Desafios
              </h1>
              <p className="text-white/85 text-xs sm:text-sm md:text-base leading-relaxed">
                Resolva questionários oficiais criados por professores e administradores. Acumule XP, suba no ranking e desbloqueie itens na Loja!
              </p>
            </div>

            {/* BOTÃO EXCLUSIVO DE CRIAR QUIZ PARA PROFESSORES E ADMINS */}
            {isTeacherOrAdmin && (
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="relative z-10 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-3 rounded-xl shadow-lg shadow-amber-400/30 flex items-center gap-2 transition-all active:scale-95 text-xs sm:text-sm shrink-0 whitespace-nowrap cursor-pointer"
                title="Criar novo questionário para a comunidade de alunos"
              >
                <PlusCircle size={18} /> Criar Novo Quiz
              </button>
            )}
          </div>

          {/* BARRA DE PESQUISA E FILTROS */}
          <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center bg-slate-800/60 p-3 sm:p-4 rounded-2xl border border-slate-700/60 backdrop-blur-md">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input 
                type="text" 
                placeholder="Buscar quiz por título ou matéria..." 
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-2 pl-10 pr-4 text-xs sm:text-sm text-white focus:border-primary outline-none transition-all placeholder-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            
            <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
              {['Todos', 'Programação', 'Lógica', 'Computação', 'Matemática', 'Geral'].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat 
                      ? 'bg-primary text-white shadow-md shadow-primary/30' 
                      : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* GRID DE QUIZZES */}
          {loadingQuizzes ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <Loader2 size={32} className="animate-spin text-primary" />
              <span className="text-sm font-semibold">Carregando quizzes do servidor...</span>
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="py-16 text-center text-slate-400 bg-slate-800/40 rounded-2xl border border-slate-700 p-8">
              <Brain size={40} className="mx-auto text-slate-500 mb-2" />
              <p className="text-white font-bold text-base">Nenhum quiz encontrado</p>
              <p className="text-xs text-slate-400 mt-1">Tente buscar por outro termo ou categoria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredQuizzes.map(quiz => {
                const qCount = quiz.questions?.length || quiz.questions_count || 0;
                const isProf = quiz.creator_role === 'PROFESSOR';
                const isAdmin = quiz.creator_role === 'ADMIN';

                return (
                  <div key={quiz.id} className="bg-slate-800/90 border border-slate-700/80 rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:-translate-y-1 shadow-lg group flex flex-col">
                    <div className="p-5 flex-1">
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <span className="bg-primary/20 text-primary text-xs font-bold px-2.5 py-1 rounded-lg border border-primary/20">
                          {quiz.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                          <Star size={12} /> {quiz.difficulty}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-1.5 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {quiz.title}
                      </h3>
                      
                      {quiz.description && (
                        <p className="text-xs text-slate-400 mb-3 line-clamp-2">{quiz.description}</p>
                      )}

                      <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-4 font-medium">
                        <User size={13} className="text-slate-400" />
                        <span>Por <strong className="text-slate-200">{quiz.creator_name || quiz.author || 'Docente UniStudy'}</strong></span>
                        {isProf && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30 font-bold" title="Criador é Professor Verificado">
                            🎓 Prof
                          </span>
                        )}
                        {isAdmin && (
                          <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30 font-bold" title="Criador é Administrador">
                            🛡️ Admin
                          </span>
                        )}
                      </p>
                      
                      <div className="flex items-center gap-3 text-xs font-semibold text-slate-300 bg-slate-900/50 p-2.5 rounded-xl border border-slate-700/60">
                        <span className="flex items-center gap-1.5"><HelpCircle size={14} className="text-purple-400"/> {qCount} Questões</span>
                        <span className="text-slate-600">•</span>
                        <span className="flex items-center gap-1.5 text-emerald-400"><Clock size={13}/> Sem tempo</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-slate-700/80 p-3.5 bg-slate-900/30 flex justify-between items-center">
                      <span className="text-primary font-bold text-sm flex items-center gap-1">
                        <Award size={16} /> +{quiz.xp_reward || quiz.xpReward || 150} XP
                      </span>
                      <button 
                        onClick={() => startQuiz(quiz)}
                        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-md shadow-primary/30 active:scale-95 cursor-pointer"
                      >
                        Iniciar <Play size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* -------------------- PLAYER VIEW -------------------- */}
      {view === 'player' && activeQuiz && (
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full h-full relative pb-8">
          
          {/* HEADER DO PLAYER */}
          <div className="flex items-center justify-between mb-6 bg-slate-800/80 p-3.5 sm:p-4 rounded-2xl border border-slate-700 shadow-md">
            <button onClick={resetToHub} className="text-slate-400 hover:text-white flex items-center gap-1.5 text-xs sm:text-sm font-bold transition-colors">
              <ArrowLeft size={16} /> Sair do Quiz
            </button>
            <div className="font-bold text-white text-xs sm:text-sm text-center hidden md:block truncate max-w-md">
              {activeQuiz.title}
            </div>
            <div className="text-primary font-black text-xs sm:text-sm bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20 shrink-0">
              Questão {currentQuestionIndex + 1} de {activeQuiz.questions.length}
            </div>
          </div>

          {/* PERGUNTA ATUAL */}
          {(() => {
            const currentQuestion = activeQuiz.questions[currentQuestionIndex];
            const isAnswered = selectedAnswers[currentQuestion.id] !== undefined;

            return (
              <div className="flex-1 flex flex-col justify-between bg-slate-800/90 border border-slate-700 rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden">
                <div>
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-2">Pergunta #{currentQuestionIndex + 1}</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 leading-snug">
                    {currentQuestion.text}
                  </h2>

                  {/* OPÇÕES */}
                  <div className="space-y-3">
                    {currentQuestion.options.map((opt, optIdx) => {
                      if (!opt) return null;
                      const isSelected = selectedAnswers[currentQuestion.id] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectAnswer(currentQuestion.id, optIdx)}
                          className={`w-full text-left p-3.5 sm:p-4 rounded-xl font-medium text-xs sm:text-sm transition-all flex items-center justify-between border cursor-pointer ${
                            isSelected
                              ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30 scale-[1.01]'
                              : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:border-primary/50 hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                              isSelected ? 'bg-white text-primary' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isSelected && <CheckCircle2 size={18} className="shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* BOTÃO AVANÇAR */}
                <div className="mt-8 pt-4 border-t border-slate-700 flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    disabled={!isAnswered}
                    className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95 text-xs sm:text-sm cursor-pointer"
                  >
                    {currentQuestionIndex < activeQuiz.questions.length - 1 ? 'Próxima Questão' : 'Finalizar e Ver Resultado'} 
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* -------------------- RESULT VIEW -------------------- */}
      {view === 'result' && activeQuiz && (
        <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full text-center pb-8 animate-fade-in">
          <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl w-full">
            <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-5 text-4xl shadow-inner ${
              submissionResult?.score_percentage === 100
                ? 'bg-yellow-500/25 text-yellow-300 border-2 border-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.4)]'
                : submissionResult?.score_percentage >= 70
                  ? 'bg-slate-300/25 text-slate-200 border-2 border-slate-300 shadow-[0_0_20px_rgba(203,213,225,0.3)]'
                  : submissionResult?.score_percentage >= 50
                    ? 'bg-amber-600/25 text-amber-300 border-2 border-amber-600 shadow-[0_0_20px_rgba(217,119,6,0.3)]'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {submissionResult?.score_percentage === 100 ? '🥇' : submissionResult?.score_percentage >= 70 ? '🥈' : submissionResult?.score_percentage >= 50 ? '🥉' : '📚'}
            </div>

            <h2 className="text-2xl font-black text-white mb-2">
              {submissionResult?.score_percentage === 100 
                ? '🎉 100% Gabaritado! Lendário!' 
                : submissionResult?.score_percentage >= 70 
                  ? '🥈 Excelente Desempenho!' 
                  : submissionResult?.score_percentage >= 50 
                    ? '🥉 Bom Trabalho!' 
                    : 'Tente Novamente!'}
            </h2>
            
            <p className="text-slate-400 text-xs sm:text-sm mb-6">
              {submissionResult?.score_percentage >= 50 
                ? 'Você alcançou os critérios mínimos e desbloqueou a recompensa!' 
                : 'Você precisa de pelo menos 50% de acertos para conquistar o primeiro selo deste Quiz.'}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5 bg-slate-900/60 p-4 rounded-2xl border border-slate-700">
              <div>
                <span className="text-xs text-slate-400 font-semibold block">Acertos</span>
                <span className="text-xl font-black text-white">{submissionResult?.score || 0} / {submissionResult?.total_questions || activeQuiz.questions.length}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block">Aproveitamento</span>
                <span className={`text-xl font-black ${
                  submissionResult?.score_percentage >= 70 ? 'text-emerald-400' : submissionResult?.score_percentage >= 50 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {submissionResult?.score_percentage || 0}%
                </span>
              </div>
            </div>

            {/* SEÇÃO DO SELO DA CONQUISTA (BRONZE 50%, PRATA 70%, OURO 100%) */}
            {submissionResult?.badge_awarded ? (
              <div className={`mb-5 p-4 rounded-2xl border text-center transition-all ${
                submissionResult.badge_tier === 'OURO'
                  ? 'bg-gradient-to-br from-yellow-500/20 via-amber-500/10 to-slate-900 border-yellow-400/60 shadow-[0_0_25px_rgba(234,179,8,0.25)]'
                  : submissionResult.badge_tier === 'PRATA'
                    ? 'bg-gradient-to-br from-slate-400/20 via-slate-600/10 to-slate-900 border-slate-300/60 shadow-[0_0_20px_rgba(203,213,225,0.2)]'
                    : 'bg-gradient-to-br from-amber-700/20 via-orange-900/10 to-slate-900 border-amber-600/50 shadow-[0_0_20px_rgba(217,119,6,0.2)]'
              }`}>
                <div className="text-3xl mb-1.5 drop-shadow">
                  {submissionResult.badge_awarded.emoji || (submissionResult.badge_tier === 'OURO' ? '🥇' : submissionResult.badge_tier === 'PRATA' ? '🥈' : '🥉')}
                </div>
                <span className={`inline-block text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full mb-1 ${
                  submissionResult.badge_tier === 'OURO'
                    ? 'bg-yellow-400/30 text-yellow-300 border border-yellow-400/50'
                    : submissionResult.badge_tier === 'PRATA'
                      ? 'bg-slate-300/30 text-slate-200 border border-slate-300/50'
                      : 'bg-amber-600/30 text-amber-300 border border-amber-500/50'
                }`}>
                  {submissionResult.badge_tier === 'OURO' ? '🥇 Selo de Ouro Desbloqueado!' : submissionResult.badge_tier === 'PRATA' ? '🥈 Selo de Prata Desbloqueado!' : '🥉 Selo de Bronze Desbloqueado!'}
                </span>
                <h3 className="text-sm sm:text-base font-black text-white mt-1">{submissionResult.badge_awarded.name}</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto leading-relaxed">{submissionResult.badge_awarded.description}</p>
                <div className="mt-2 text-[11px] text-emerald-400 font-bold flex items-center justify-center gap-1">
                  <Sparkles size={12} /> Salvo em Minhas Conquistas & Perfil!
                </div>
              </div>
            ) : (
              <div className="mb-5 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/60 text-center">
                <span className="text-xl block mb-1">🔒</span>
                <p className="text-xs font-bold text-slate-300">Nenhum Selo Desbloqueado</p>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Abaixo de 50% não há concessão de selo. Obtenha 50% para o 🥉 Selo Bronze, 70% para 🥈 Prata ou 100% para 🥇 Ouro!
                </p>
              </div>
            )}

            {Boolean(submissionResult?.xp_earned > 0) && (
              <div className="mb-6 p-3 rounded-xl bg-primary/20 border border-primary/30 text-primary font-bold text-sm flex items-center justify-center gap-2">
                <Award size={18} /> +{submissionResult?.xp_earned} XP Adicionado ao Seu Perfil!
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => startQuiz(activeQuiz)}
                className="flex-1 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs sm:text-sm transition-all"
              >
                Tentar Novamente
              </button>
              <button
                onClick={resetToHub}
                className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-primary/25"
              >
                Voltar à Central
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- MODAL DE CRIAÇÃO DE QUIZ (EXCLUSIVO DOCENTE/ADMIN) -------------------- */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl relative animate-fade-in overflow-hidden">
            
            {/* Header Sticky */}
            <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold shrink-0">
                  <GraduationCap size={22} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg md:text-xl font-black text-white truncate">Criar Novo Quiz Oficial</h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 truncate">Elabore perguntas para desafiar os alunos e distribuir XP acadêmico.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors shrink-0 ml-2 cursor-pointer"
                title="Fechar modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form com Scroll no Corpo */}
            <form onSubmit={handleSaveQuiz} className="flex-1 flex flex-col min-h-0">
              <div className="p-4 sm:p-6 md:p-7 overflow-y-auto flex-1 space-y-5">
                
                {/* Título */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Título do Quiz *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Introdução a Algoritmos e Estruturas"
                    value={newQuiz.title}
                    onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:border-primary outline-none transition-colors"
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Breve Descrição</label>
                  <input
                    type="text"
                    placeholder="Ex: Questionário sobre vetores, matrizes e laços de repetição."
                    value={newQuiz.description}
                    onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:border-primary outline-none transition-colors"
                  />
                </div>

                {/* Categoria, Dificuldade e Recompensa (Grid Responsivo) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Categoria</label>
                    <select
                      value={newQuiz.category}
                      onChange={(e) => setNewQuiz({ ...newQuiz, category: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-primary outline-none font-medium cursor-pointer"
                    >
                      <option value="Programação">Programação</option>
                      <option value="Lógica">Lógica</option>
                      <option value="Computação">Computação</option>
                      <option value="Matemática">Matemática</option>
                      <option value="Engenharia">Engenharia</option>
                      <option value="Geral">Geral</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Dificuldade</label>
                    <select
                      value={newQuiz.difficulty}
                      onChange={(e) => setNewQuiz({ ...newQuiz, difficulty: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-primary outline-none font-medium cursor-pointer"
                    >
                      <option value="Iniciante">Iniciante</option>
                      <option value="Intermediário">Intermediário</option>
                      <option value="Avançado">Avançado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Recompensa (XP)</label>
                    <input
                      type="number"
                      min="50"
                      max="1000"
                      step="50"
                      value={newQuiz.xp_reward}
                      onChange={(e) => setNewQuiz({ ...newQuiz, xp_reward: Number(e.target.value) })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:border-primary outline-none"
                    />
                  </div>
                </div>

                {/* CONFIGURAÇÃO DA CONQUISTA & SELOS (BRONZE 50%, PRATA 70%, OURO 100%) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-purple-950/20 to-slate-900 border border-primary/30 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-base shrink-0 shadow-sm">
                      🏅
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-white">Configurar Selo da Conquista do Quiz</h4>
                      <p className="text-[11px] text-slate-400">Os 3 níveis de medalhas serão gerados automaticamente conforme a pontuação.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                    <div className="md:col-span-5 space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">Emoji do Selo</label>
                      <div className="flex items-center gap-2 flex-wrap">
                        <input
                          type="text"
                          maxLength="4"
                          value={newQuiz.badge_emoji}
                          onChange={(e) => setNewQuiz({ ...newQuiz, badge_emoji: e.target.value })}
                          className="w-12 h-10 text-center bg-slate-800 border border-slate-700 rounded-xl text-lg text-white focus:border-primary outline-none shrink-0"
                        />
                        <div className="flex items-center gap-1 flex-wrap">
                          {['🏆', '🧠', '⚡', '🐍', '🎯', '💻', '🚀', '🦉'].map(em => (
                            <button
                              type="button"
                              key={em}
                              onClick={() => setNewQuiz({ ...newQuiz, badge_emoji: em })}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all border cursor-pointer ${
                                newQuiz.badge_emoji === em 
                                  ? 'bg-primary border-primary text-white scale-110 shadow-md shadow-primary/30' 
                                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                              }`}
                            >
                              {em}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-7">
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Título da Conquista / Selo *</label>
                      <input
                        type="text"
                        placeholder="Ex: Mestre em Algoritmos e Lógica"
                        value={newQuiz.badge_title}
                        onChange={(e) => setNewQuiz({ ...newQuiz, badge_title: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:border-primary outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Descrição da Conquista</label>
                    <input
                      type="text"
                      placeholder="Ex: Demonstrou domínio em sintaxe, estruturas condicionais e laços."
                      value={newQuiz.badge_description}
                      onChange={(e) => setNewQuiz({ ...newQuiz, badge_description: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:border-primary outline-none"
                    />
                  </div>

                  {/* Prévia automática dos 3 níveis de medalhas */}
                  <div className="pt-3 border-t border-slate-800/80">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                      <Sparkles size={12} className="text-amber-400" /> Prévia dos Selos gerados automaticamente pelo sistema:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-700/50 text-amber-200 flex flex-col justify-between">
                        <span className="font-bold flex items-center gap-1.5 text-xs text-amber-300 mb-1">
                          🥉 Bronze (50%+)
                        </span>
                        <p className="text-[11px] text-amber-200/90 leading-tight break-words">
                          🥉 {newQuiz.badge_emoji || '🏆'} [Bronze] {newQuiz.badge_title || newQuiz.title || 'Título da Conquista'}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-400/40 text-slate-200 flex flex-col justify-between">
                        <span className="font-bold flex items-center gap-1.5 text-xs text-slate-300 mb-1">
                          🥈 Prata (70%+)
                        </span>
                        <p className="text-[11px] text-slate-300/90 leading-tight break-words">
                          🥈 {newQuiz.badge_emoji || '🏆'} [Prata] {newQuiz.badge_title || newQuiz.title || 'Título da Conquista'}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-yellow-950/30 border border-yellow-500/50 text-yellow-200 flex flex-col justify-between">
                        <span className="font-bold flex items-center gap-1.5 text-xs text-yellow-400 mb-1">
                          🥇 Ouro (100%)
                        </span>
                        <p className="text-[11px] text-yellow-300/90 leading-tight break-words">
                          🥇 {newQuiz.badge_emoji || '🏆'} [Ouro] {newQuiz.badge_title || newQuiz.title || 'Título da Conquista'}
                        </p>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 italic">
                      * Abaixo de 50%, o participante não atinge a pontuação mínima para selo.
                    </p>
                  </div>
                </div>

                {/* Construtor de Perguntas */}
                <div className="pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <HelpCircle size={16} className="text-purple-400" /> Perguntas ({newQuiz.questions.length})
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="text-xs font-bold text-primary hover:text-white flex items-center gap-1.5 bg-primary/20 hover:bg-primary/30 px-3 py-1.5 rounded-xl border border-primary/40 transition-colors cursor-pointer"
                    >
                      <PlusCircle size={14} /> Adicionar Pergunta
                    </button>
                  </div>

                  <div className="space-y-4">
                    {newQuiz.questions.map((q, qIdx) => (
                      <div key={qIdx} className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4 relative space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-primary/30 text-primary-light flex items-center justify-center text-[10px] font-black">
                              {qIdx + 1}
                            </span>
                            Questão #{qIdx + 1}
                          </span>
                          {newQuiz.questions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveQuestion(qIdx)}
                              className="text-red-400 hover:text-red-300 p-1.5 hover:bg-red-500/10 rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                              title="Remover esta questão"
                            >
                              <Trash2 size={14} />
                              <span className="text-[11px] hidden sm:inline">Excluir</span>
                            </button>
                          )}
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Enunciado da Pergunta *</label>
                          <input
                            type="text"
                            required
                            placeholder="Enunciado da pergunta..."
                            value={q.text}
                            onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:border-primary outline-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <span className="text-[11px] text-slate-400 block font-semibold">Alternativas (selecione a correta):</span>
                          {q.options.map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-2 bg-slate-900/60 p-1.5 pr-2 rounded-xl border border-slate-800 focus-within:border-primary/50 transition-colors">
                              <label className="flex items-center gap-1.5 cursor-pointer pl-1 shrink-0" title="Marcar como alternativa correta">
                                <input
                                  type="radio"
                                  name={`correct-${qIdx}`}
                                  checked={q.correct === optIdx}
                                  onChange={() => handleCorrectChoice(qIdx, optIdx)}
                                  className="accent-primary cursor-pointer w-4 h-4"
                                />
                                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black transition-colors ${
                                  q.correct === optIdx ? 'bg-primary text-white' : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                              </label>
                              <input
                                type="text"
                                required
                                placeholder={`Alternativa ${String.fromCharCode(65 + optIdx)}`}
                                value={opt}
                                onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                                className="flex-1 min-w-0 bg-transparent border-none text-xs sm:text-sm text-white focus:outline-none px-1"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Footer Sticky com botões de Ação */}
              <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-t border-slate-800 flex items-center justify-end gap-3 shrink-0 bg-slate-900/95 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-primary/25 disabled:opacity-50 cursor-pointer active:scale-95 transition-all"
                >
                  {isPublishing ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  {isPublishing ? 'Publicando...' : 'Publicar Quiz Oficial'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Quiz;
