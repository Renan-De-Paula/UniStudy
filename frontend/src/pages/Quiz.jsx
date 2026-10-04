import React, { useState, useEffect } from 'react';
import { Brain, Search, Play, CheckCircle2, XCircle, Clock, Award, ChevronRight, User, Star, ArrowLeft, HelpCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const mockQuizzes = [
  {
    id: 1,
    title: 'Fundamentos de Python',
    author: 'Prof. Silva',
    category: 'Programação',
    difficulty: 'Iniciante',
    xpReward: 150,
    questions: [
      {
        id: 1,
        text: 'Qual das opções abaixo é uma estrutura de repetição em Python?',
        options: ['if', 'for', 'def', 'import'],
        correct: 1
      },
      {
        id: 2,
        text: 'Como se define uma função em Python?',
        options: ['function myFunc()', 'def myFunc():', 'func myFunc()', 'create myFunc()'],
        correct: 1
      },
      {
        id: 3,
        text: 'Qual o resultado de 3 ** 2 em Python?',
        options: ['6', '5', '9', 'Error'],
        correct: 2
      }
    ]
  },
  {
    id: 2,
    title: 'Lógica de Programação Avançada',
    author: 'Admin',
    category: 'Lógica',
    difficulty: 'Avançado',
    xpReward: 300,
    questions: [
      {
        id: 1,
        text: 'O que é um algoritmo de ordenação Bubble Sort?',
        options: ['Um algoritmo que divide o array pela metade', 'Um algoritmo que compara pares adjacentes e os troca', 'Um algoritmo de busca em grafos', 'Um método de criptografia'],
        correct: 1
      },
      {
        id: 2,
        text: 'Qual a complexidade de tempo de busca binária não pior caso?',
        options: ['O(1)', 'O(n)', 'O(n log n)', 'O(log n)'],
        correct: 3
      }
    ]
  },
  {
    id: 3,
    title: 'Estruturas de Dados',
    author: 'Guilherme',
    category: 'Computação',
    difficulty: 'Intermediário',
    xpReward: 200,
    questions: [
      {
        id: 1,
        text: 'O que caracteriza uma Pilha (Stack)?',
        options: ['FIFO (First In, First Out)', 'LIFO (Last In, First Out)', 'Acesso aleatório', 'Ordenação alfabética'],
        correct: 1
      }
    ]
  }
];

function Quiz() {
  const { currentUser } = useAuth();
  const [view, setView] = useState('hub'); // hub, player, result
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);

  // Filtros do Hub
  const [searchTerm, setSearchTerm] = useState('');

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setScore(0);
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

  const finishQuiz = () => {
    let finalScore = 0;
    activeQuiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correct) {
        finalScore += 1;
      }
    });
    setScore(finalScore);
    setView('result');
  };

  const resetToHub = () => {
    setActiveQuiz(null);
    setView('hub');
  };

  return (
    <div className="h-full flex flex-col relative z-10 animate-fade-in overflow-y-auto">
      
      {/* -------------------- HUB VIEW -------------------- */}
      {view === 'hub' && (
        <div className="flex-1 flex flex-col gap-6 max-w-5xl mx-auto w-full pb-8">
          {/* HEADER CABEÇALHO */}
          <div className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden flex-shrink-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-black mb-2 flex items-center gap-3">
                <Brain size={36} /> Central de Quizzes
              </h1>
              <p className="text-white/80 max-w-2xl text-lg">
                Teste seus conhecimentos em desafios criados pela comunidade e por professores. Ganhe XP e suba não ranking!
              </p>
            </div>
          </div>

          {/* BARRA DE PESQUISA E FILTROS */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 backdrop-blur-md">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por tecnãologia ou autor..." 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-primary outline-none transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {['Todos', 'Programação', 'Lógica', 'Computação'].map(cat => (
                <button key={cat} className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm font-semibold hover:border-primary hover:text-white transition-colors whitespace-nãowrap">
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* GRID DE QUIZZES */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockQuizzes.filter(q => q.title.toLowerCase().includes(searchTerm.toLowerCase())).map(quiz => (
              <div key={quiz.id} className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden hover:border-primary/50 transition-all hover:-translate-y-1 shadow-lg group flex flex-col">
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded border border-primary/20">
                      {quiz.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded">
                      <Star size={12} /> {quiz.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-primary transition-colors">{quiz.title}</h3>
                  <p className="text-slate-400 text-sm flex items-center gap-2 mb-4">
                    <User size={14} /> Criado por {quiz.author}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-300 bg-slate-900/50 p-2.5 rounded-lg border border-slate-700/50">
                    <span className="flex items-center gap-1.5"><HelpCircle size={14} className="text-purple-400"/> {quiz.questions.length} Questões</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} className="text-emerald-400"/> Sem limite</span>
                  </div>
                </div>
                
                <div className="border-t border-slate-700 p-4 bg-slate-900/30 flex justify-between items-center">
                  <span className="text-primary font-bold text-sm flex items-center gap-1">
                    <Award size={16} /> +{quiz.xpReward} XP
                  </span>
                  <button 
                    onClick={() => startQuiz(quiz)}
                    className="bg-primary hover:bg-accent text-white px-5 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(109,40,217,0.3)] hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                  >
                    Iniciar <Play size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------- PLAYER VIEW -------------------- */}
      {view === 'player' && activeQuiz && (
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full h-full relative pb-8">
          
          {/* HEADER DO PLAYER */}
          <div className="flex items-center justify-between mb-6 bg-slate-800/80 p-4 rounded-xl border border-slate-700 shadow-md">
            <button onClick={resetToHub} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-bold transition-colors">
              <ArrowLeft size={16} /> Abandonar Quiz
            </button>
            <div className="font-bold text-white text-center hidden md:block">
              {activeQuiz.title}
            </div>
            <div className="text-primary font-black text-sm bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
              Questão {currentQuestionIndex + 1} de {activeQuiz.questions.length}
            </div>
          </div>

          {/* BARRA DE PROGRESSO */}
          <div className="w-full h-2 bg-slate-800 rounded-full mb-8 overflow-hidden border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
              style={{ width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%` }}
            ></div>
          </div>

          {/* ÁREA DA PERGUNTA */}
          <div className="flex-1 bg-slate-800/50 p-6 md:p-10 rounded-2xl border border-slate-700 shadow-xl flex flex-col relative overflow-hidden backdrop-blur-sm">
            
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-relaxed">
              {activeQuiz.questions[currentQuestionIndex].text}
            </h2>

            <div className="flex flex-col gap-3 flex-1">
              {activeQuiz.questions[currentQuestionIndex].options.map((option, idx) => {
                const isSelected = selectedAnswers[activeQuiz.questions[currentQuestionIndex].id] === idx;
                
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(activeQuiz.questions[currentQuestionIndex].id, idx)}
                    className={`
                      w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group
                      ${isSelected 
                        ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(109,40,217,0.2)] text-white' 
                        : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-500 hover:bg-slate-800'}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex shrink-0 items-center justify-center font-bold text-sm transition-colors ${isSelected ? 'bg-primary text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white'}`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-base md:text-lg font-medium">{option}</span>
                    </div>
                    
                    {isSelected && <CheckCircle2 className="text-primary shrink-0 ml-2" size={24} />}
                  </button>
                );
              })}
            </div>

            {/* CONTROLES */}
            <div className="mt-8 pt-6 border-t border-slate-700 flex justify-end">
              <button 
                onClick={handleNextQuestion}
                disabled={selectedAnswers[activeQuiz.questions[currentQuestionIndex].id] === undefined}
                className="bg-primary disabled:bg-slate-700 disabled:text-slate-500 hover:bg-accent text-white px-8 py-3 rounded-xl font-bold text-lg transition-all flex items-center gap-2 shadow-lg hover:shadow-primary/50 disabled:shadow-none"
              >
                {currentQuestionIndex === activeQuiz.questions.length - 1 ? 'Finalizar Quiz' : 'Próxima Questão'} <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- RESULT VIEW -------------------- */}
      {view === 'result' && activeQuiz && (
        <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full animate-fade-in-up pb-8">
          <div className="bg-slate-800/80 p-6 md:p-10 rounded-3xl border border-slate-700 shadow-2xl text-center relative overflow-hidden w-full backdrop-blur-md">
            
            {/* Decoração de Fundo */}
            <div className={`absolute top-0 left-0 w-full h-32 blur-3xl opacity-20 ${score === activeQuiz.questions.length ? 'bg-emerald-500' : 'bg-primary'}`}></div>

            <div className="relative z-10">
              <div className="w-24 h-24 mx-auto bg-slate-900 rounded-full border-4 border-slate-700 flex items-center justify-center mb-6 shadow-xl">
                {score === activeQuiz.questions.length ? (
                  <Award size={48} className="text-emerald-400" />
                ) : (
                  <Brain size={48} className="text-primary" />
                )}
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Quiz Finalizado!</h2>
              <p className="text-slate-400 mb-8 font-medium">Você concluiu "{activeQuiz.title}"</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Acertos</p>
                  <p className="text-5xl font-black text-white">
                    {score}<span className="text-2xl text-slate-500">/{activeQuiz.questions.length}</span>
                  </p>
                </div>
                <div className="bg-primary/10 p-6 rounded-2xl border border-primary/20">
                  <p className="text-primary text-sm font-bold uppercase tracking-wider mb-2">XP Ganho</p>
                  <p className="text-5xl font-black text-white drop-shadow-[0_0_10px_rgba(109,40,217,0.5)]">
                    +{(score / activeQuiz.questions.length) * activeQuiz.xpReward}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button onClick={resetToHub} className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-xl font-bold transition-colors">
                  Voltar ao Hub
                </button>
                <button onClick={() => startQuiz(activeQuiz)} className="bg-primary hover:bg-accent text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg hover:shadow-primary/50 flex items-center justify-center gap-2">
                  <Play size={18} /> Tentar Novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Quiz;
