import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, Crown, Medal, MessageSquare, Target, Trophy, Mic, Hash, Send, ChevronLeft, Volume2, 
  Settings, Clock, Library, ShoppingCart, SmilePlus, Play, Pause, RotateCcw, Link2, FileText,
  Pin, Reply, PlusCircle, Image as ImageIcon, Code, BookOpen, Bot, X, Square, 
  PenTool, Eraser, Circle, MousePointer2, Type
} from 'lucide-react';

function Guildas() {
  const { currentUser } = useAuth();
  const [activeGuild, setActiveGuild] = useState(null);
  const [activeTab, setActiveTab] = useState('chat'); // chat, repo, pomodoro, quests, ranking, store, whiteboard
  const [activeChannel, setActiveChannel] = useState('geral'); // geral, duvidas, offtopic
  const [chatMessage, setChatMessage] = useState('');
  
  const [replyingTo, setReplyingTo] = useState(null);
  const [pinnedMessageId, setPinnedMessageId] = useState(1);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  
  const chatEndRef = useRef(null);

  // Pomodoro State
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [pomodoroActive, setPomodoroActive] = useState(false);

  // Whiteboard State
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(3);
  const ctxRef = useRef(null);

  // Inicializar Canvas
  useEffect(() => {
    if (activeTab === 'whiteboard' && canvasRef.current) {
      const canvas = canvasRef.current;
      // Define a resolução real do canvas para evitar desfoque
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctxRef.current = ctx;
    }
  }, [activeTab]); // Recalcula quando abre a aba

  // Atualizar cor e tamanho quando mudam
  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = brushColor;
      ctxRef.current.lineWidth = brushSize;
    }
  }, [brushColor, brushSize]);

  const startDrawing = (e) => {
    if (!ctxRef.current) return;
    const { offsetX, offsetY } = e.nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || !ctxRef.current) return;
    const { offsetX, offsetY } = e.nativeEvent;
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    if (ctxRef.current) ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (canvasRef.current && ctxRef.current) {
      ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  useEffect(() => {
    let interval = null;
    if (pomodoroActive && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime(time => time - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      setPomodoroActive(false);
    }
    return () => clearInterval(interval);
  }, [pomodoroActive, pomodoroTime]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Simula alguém digitando aleatoriamente não canal geral
  useEffect(() => {
    if (activeGuild && activeTab === 'chat' && activeChannel === 'geral') {
      const timer = setTimeout(() => {
        setTypingUser('Mariana S.');
        setTimeout(() => setTypingUser(null), 4000);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activeGuild, activeTab, activeChannel]);

  const [guildas, setGuildas] = useState([
    {
      id: 1,
      name: 'Núcleo de Algoritmos Avançados',
      focus: 'Estrutura de Dados & C',
      description: 'Grupo focado em resolução de problemas lógicos e desafios de programação.',
      level: 7,
      xp: 14500,
      membersCount: 15,
      maxMembers: 20,
      tags: ['Alta Performance', 'Prática Diária'],
      color: 'from-blue-600 to-slate-900',
      icon: '💻',
      members: [
        { id: 1, name: 'Lucas P.', role: 'LEADER', level: 12, avatar: 'https://i.pravatar.cc/150?img=11', customTitle: 'Senhor dos Bugs' },
        { id: 2, name: 'Mariana S.', role: 'VETERAN', level: 9, avatar: 'https://i.pravatar.cc/150?img=5', customTitle: 'Maga do C++' },
        { id: 999, name: currentUser?.name || 'Você', role: 'ROOKIE', level: 10, avatar: currentUser?.avatar || 'https://i.pravatar.cc/150?img=68', customTitle: 'Recruta' },
      ],
      chat: [
        { id: 1, channel: 'geral', author: 'Lucas P.', content: 'Galera, lembrem que amanhã temos a revisão de Árvores Binárias. Não percam!', time: '10:30', role: 'LEADER', reactions: { '👍': 2, '🔥': 1 }, replyTo: null, type: 'text' },
        { id: 2, channel: 'geral', author: 'Sistema', content: '🏆 O Recruta Lucas P. acabou de subir para o Nível 13!', time: '10:32', role: 'BOT', reactions: {}, replyTo: null, type: 'system' },
        { id: 3, channel: 'geral', author: 'Mariana S.', content: '@Lucas P. Fechado! Vou levar alguns exercícios da prova antiga.', time: '10:35', role: 'VETERAN', reactions: { '🚀': 1 }, replyTo: { author: 'Lucas P.', content: 'Galera, lembrem que amanhã temos a revisão...' }, type: 'text' },
        { id: 4, channel: 'duvidas', author: 'João V.', content: 'Alguém me ajuda com um ponteiro duplo em C?', time: '09:15', role: 'ROOKIE', reactions: {}, replyTo: null, type: 'text' },
        { id: 5, channel: 'offtopic', author: 'Lucas P.', content: 'Vocês viram o nãovo filme de ficção científica?', time: '20:00', role: 'LEADER', reactions: { '👀': 3 }, replyTo: null, type: 'text' },
        { id: 6, channel: 'geral', author: 'Sistema', content: '📚 Mariana S. publicou uma nãova Apostila: "Resumo Cálculo II".', time: '10:40', role: 'BOT', reactions: {}, replyTo: null, type: 'system' },
      ],
      quests: [
        { id: 1, title: 'Resolver 10 exercícios não Fórum', progress: 7, total: 10, reward: '500 XP' },
      ],
      repo: [],
      store: []
    }
  ]);

  const renderMessageContent = (content) => {
    return content.split(' ').map((word, i) => {
      if (word.startsWith('@')) return <span key={i} className="text-primary font-bold bg-primary/10 px-1 rounded mx-0.5 cursor-pointer hover:underline">{word} </span>;
      return word + ' ';
    });
  };

  const sendAudioMessage = () => {
    setIsRecording(false);
    const newMessage = {
      id: Date.nãow(),
      channel: activeChannel,
      author: currentUser?.name || 'Você',
      content: '', // Sem texto, é audio
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      role: 'ROOKIE',
      reactions: {},
      replyTo: replyingTo,
      type: 'audio',
      duration: '0:12'
    };
    appendMessageToChat(newMessage);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim() || !activeGuild) return;

    let finalContent = chatMessage;
    let botResponse = null;

    if (chatMessage.startsWith('/')) {
      const command = chatMessage.split(' ')[0].toLowerCase();
      const arg = chatMessage.split(' ')[1];
      
      if (command === '/pomodoro') {
        finalContent = `Iniciou um Pomodoro coletivo de ${arg || 25} minutos! ⏰`;
        setPomodoroTime((parseInt(arg) || 25) * 60);
        setActiveTab('pomodoro');
        setPomodoroActive(true);
      } else if (command === '/dado') {
        const result = Math.floor(Math.random() * 20) + 1;
        botResponse = {
          id: Date.nãow() + 1,
          channel: activeChannel,
          author: 'UniBot',
          content: `🎲 Rolou um d20 e tirou: **${result}**!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          role: 'BOT',
          reactions: {},
          type: 'text',
          isBot: true
        };
        finalContent = `Rolou os dados...`;
      }
    }
    
    const newMessage = {
      id: Date.nãow(),
      channel: activeChannel,
      author: currentUser?.name || 'Você',
      content: finalContent,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      role: 'ROOKIE',
      reactions: {},
      replyTo: replyingTo,
      type: 'text'
    };

    appendMessageToChat(newMessage, botResponse);
  };

  const appendMessageToChat = (newMessage, botResponse = null) => {
    const updatedGuilds = guildas.map(g => {
      if (g.id === activeGuild.id) {
        const newChat = [...g.chat, newMessage];
        if (botResponse) newChat.push(botResponse);
        const updatedGuild = { ...g, chat: newChat };
        setActiveGuild(updatedGuild);
        return updatedGuild;
      }
      return g;
    });

    setGuildas(updatedGuilds);
    setChatMessage('');
    setReplyingTo(null);
    setShowAttachMenu(false);
    
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleReact = (msgId, emoji) => {
    const updatedGuilds = guildas.map(g => {
      if (g.id === activeGuild.id) {
        const updatedChat = g.chat.map(msg => {
          if (msg.id === msgId) {
            const currentCount = msg.reactions[emoji] || 0;
            return { ...msg, reactions: { ...msg.reactions, [emoji]: currentCount + 1 } };
          }
          return msg;
        });
        const updatedGuild = { ...g, chat: updatedChat };
        setActiveGuild(updatedGuild);
        return updatedGuild;
      }
      return g;
    });
    setGuildas(updatedGuilds);
  };

  // Visão Geral (Omitida visualmente)
  if (!activeGuild) {
    return (
      <div className="bg-darker p-4 md:p-8 rounded-xl border border-slate-700 shadow-xl animate-fade-in relative overflow-hidden">
        <div className="flex justify-between items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3"><Users className="text-primary" size={32} /> Guildas de Estudo</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {guildas.map(guilda => (
            <div key={guilda.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg flex flex-col group">
              <div className={`h-28 bg-gradient-to-r ${guilda.color} relative p-4 flex items-center justify-between`}>
                <div className="w-20 h-20 bg-slate-800 rounded-xl border-2 border-slate-600 flex items-center justify-center text-4xl absolute -bottom-8 left-5">{guilda.icon}</div>
              </div>
              <div className="p-6 pt-12 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white leading-tight">{guilda.name}</h3>
                <div className="mt-6 pt-5 border-t border-slate-700 flex gap-3">
                  <button onClick={() => setActiveGuild(guilda)} className="flex-1 bg-slate-700 hover:bg-primary text-white font-semibold py-2.5 px-4 rounded-lg flex justify-center items-center gap-2">
                    Acessar Sede
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const pinnedMessage = activeGuild.chat.find(m => m.id === pinnedMessageId && m.channel === activeChannel);
  const visibleChat = activeGuild.chat.filter(m => m.channel === activeChannel);

  return (
    <div className="bg-[#1e293b] md:h-[85vh] min-h-[650px] rounded-xl border border-slate-700 shadow-2xl flex flex-col md:flex-row overflow-hidden animate-fade-in relative">
      
      {/* SIDEBAR */}
      <div className="w-full md:w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 shadow-md z-10">
          <button onClick={() => setActiveGuild(null)} className="text-slate-400 hover:text-white p-1 bg-slate-800 rounded-md"><ChevronLeft size={20} /></button>
          <div className="font-black text-white truncate text-lg">{activeGuild.name}</div>
        </div>

        <div className="p-3 flex-1 overflow-y-auto space-y-6">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase mb-2 px-2 tracking-wider">Canais de Texto</div>
            <div className="space-y-1">
              <button onClick={() => {setActiveTab('chat'); setActiveChannel('geral');}} className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'chat' && activeChannel === 'geral' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}>
                <Hash size={18} className={activeTab === 'chat' && activeChannel === 'geral' ? 'text-primary' : ''} /> chat-geral
              </button>
              <button onClick={() => {setActiveTab('chat'); setActiveChannel('duvidas');}} className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'chat' && activeChannel === 'duvidas' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}>
                <Hash size={18} className={activeTab === 'chat' && activeChannel === 'duvidas' ? 'text-primary' : ''} /> dúvidas-de-código
              </button>
              <button onClick={() => {setActiveTab('chat'); setActiveChannel('offtopic');}} className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'chat' && activeChannel === 'offtopic' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}>
                <Hash size={18} className={activeTab === 'chat' && activeChannel === 'offtopic' ? 'text-primary' : ''} /> off-topic
              </button>
            </div>
          </div>
          
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase mb-2 px-2 tracking-wider">Colaboração</div>
            <div className="space-y-1">
              <button onClick={() => setActiveTab('whiteboard')} className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'whiteboard' ? 'bg-indigo-900/40 text-indigo-400' : 'text-slate-400 hover:bg-slate-800/50'}`}>
                <PenTool size={18} /> Lousa Interativa
              </button>
              <button onClick={() => setActiveTab('pomodoro')} className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'pomodoro' ? 'bg-emerald-900/40 text-emerald-400' : 'text-slate-400 hover:bg-slate-800/50'}`}>
                <div className="flex items-center gap-2"><Clock size={18} /> Sala de Foco</div>
                {pomodoroActive && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ÁREA CENTRAL */}
      <div className="flex-1 flex flex-col bg-slate-900 relative">
        
        {/* Header Central */}
        <div className="h-14 border-b border-slate-800 flex items-center px-4 justify-between bg-[#1e293b]">
          <div className="flex items-center gap-2 text-white font-bold">
            {activeTab === 'chat' && <><Hash className="text-slate-400" size={20}/> {activeChannel}</>}
            {activeTab === 'pomodoro' && <><Clock className="text-emerald-400" size={20}/> Sala de Foco</>}
            {activeTab === 'whiteboard' && <><PenTool className="text-indigo-400" size={20}/> Lousa Interativa</>}
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-row relative">
          
          {/* TAB: CHAT */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col min-w-0 relative">
              
              {/* Mensagem Fixada */}
              {pinnedMessage && (
                <div className="bg-slate-800/80 border-b border-slate-700 p-2 flex items-center gap-3 text-sm shadow-md backdrop-blur-md z-10">
                  <Pin size={16} className="text-amber-500" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-amber-500 text-xs">Fixado em #{activeChannel}</div>
                    <div className="text-slate-300 truncate">{pinnedMessage.content}</div>
                  </div>
                  <button onClick={() => setPinnedMessageId(null)} className="text-slate-500 hover:text-white"><X size={16}/></button>
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                
                <div className="text-center py-6 border-b border-slate-800/50 mb-4">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3"><Hash size={32} className="text-slate-400"/></div>
                  <h3 className="text-2xl font-bold text-white">Bem-vindo a #{activeChannel}!</h3>
                  <p className="text-slate-400 text-sm mt-1">Este é o começo do histórico deste canal.</p>
                </div>

                {visibleChat.map(msg => (
                  <div key={msg.id} className={`flex gap-3 hover:bg-slate-800/50 p-2 rounded-md -mx-2 transition-colors group relative ${msg.isBot || msg.type === 'system' ? 'bg-primary/5 border-l-2 border-primary' : ''}`}>
                    
                    {msg.isBot || msg.type === 'system' ? (
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mt-0.5"><Bot size={20} className="text-primary"/></div>
                    ) : (
                      <img src={activeGuild.members.find(m => m.name === msg.author)?.avatar || 'https://i.pravatar.cc/150'} className="w-10 h-10 rounded-full mt-0.5 cursor-pointer hover:ring-2 ring-primary transition-all" alt="Avatar" />
                    )}

                    <div className="flex-1 min-w-0">
                      
                      {msg.replyTo && (
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                          <Reply size={12} className="text-slate-600" />
                          <img src={activeGuild.members.find(m => m.name === msg.replyTo.author)?.avatar || 'https://i.pravatar.cc/150'} className="w-4 h-4 rounded-full" alt="Av" />
                          <span className="font-bold">{msg.replyTo.author}:</span>
                          <span className="truncate max-w-[200px]">{msg.replyTo.content}</span>
                        </div>
                      )}

                      <div className="flex items-baseline gap-2">
                        <span className={`font-bold ${msg.isBot || msg.type === 'system' ? 'text-primary' : msg.role === 'LEADER' ? 'text-amber-500' : msg.role === 'VETERAN' ? 'text-purple-400' : 'text-emerald-400'}`}>
                          {msg.author}
                        </span>
                        {(msg.isBot || msg.type === 'system') && <span className="bg-primary text-white text-[10px] font-bold px-1 rounded uppercase">Sistema</span>}
                        <span className="text-xs text-slate-500">{msg.time}</span>
                      </div>
                      
                      {/* Audio Message */}
                      {msg.type === 'audio' ? (
                        <div className="mt-2 bg-slate-800 border border-slate-700 rounded-full flex items-center gap-3 p-1 pr-4 max-w-xs shadow-inner">
                          <button className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-blue-500 transition-colors">
                            <Play size={14} className="ml-0.5"/>
                          </button>
                          <div className="flex-1 h-3 flex items-center gap-0.5">
                            {/* Fake Waveform */}
                            {[2,4,3,5,6,4,2,3,4,6,3,2,1].map((h, i) => (
                              <div key={i} className="w-1 bg-primary/60 rounded-full" style={{ height: `${h * 2}px` }}></div>
                            ))}
                          </div>
                          <span className="text-xs font-monão text-slate-400 font-bold">{msg.duration}</span>
                        </div>
                      ) : (
                        <p className="text-slate-300 text-sm leading-relaxed mt-0.5">
                          {renderMessageContent(msg.content)}
                        </p>
                      )}
                      
                      {Object.keys(msg.reactions).length > 0 && (
                        <div className="flex gap-1.5 mt-2">
                          {Object.entries(msg.reactions).map(([emoji, count]) => (
                            <button key={emoji} onClick={() => handleReact(msg.id, emoji)} className="flex items-center gap-1 bg-slate-800/80 border border-slate-700 hover:border-primary/50 px-2 py-0.5 rounded-full text-xs text-slate-300 transition-colors">
                              {emoji} <span className="font-bold">{count}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {!msg.isBot && msg.type !== 'system' && (
                      <div className="absolute right-4 top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 border border-slate-700 rounded-md shadow-lg flex p-1 gap-1">
                        <button onClick={() => setReplyingTo({ author: msg.author, content: msg.type === 'audio' ? 'Mensagem de voz' : msg.content })} className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Responder"><Reply size={16}/></button>
                        <button onClick={() => setPinnedMessageId(msg.id)} className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Fixar"><Pin size={16}/></button>
                        <div className="w-px h-5 bg-slate-700 my-auto mx-1"></div>
                        <button onClick={() => handleReact(msg.id, '👍')} className="p-1.5 hover:bg-slate-700 rounded text-sm">👍</button>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              
              {/* Typing Indicator */}
              <div className="px-5 pb-1 h-5">
                {typingUser && (
                  <div className="flex items-center gap-2 text-xs font-bold text-primary animate-pulse">
                    <span className="flex gap-0.5">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                    </span>
                    {typingUser} está digitando...
                  </div>
                )}
              </div>

              {/* Chat Input Area */}
              <div className="px-4 pb-4 pt-0 bg-[#1e293b] flex flex-col relative">
                
                {replyingTo && (
                  <div className="flex items-center justify-between bg-slate-800 border-l-4 border-primary px-3 py-2 rounded-t-lg text-sm mb-0">
                    <div className="flex items-center gap-2 text-slate-300 truncate">
                      <Reply size={14} className="text-primary"/>
                      <span>Respondendo a <strong className="text-white">{replyingTo.author}</strong></span>
                    </div>
                    <button onClick={() => setReplyingTo(null)} className="text-slate-500 hover:text-white"><X size={16}/></button>
                  </div>
                )}

                <form onSubmit={handleSendMessage} className={`bg-slate-800 flex items-center p-1.5 border border-slate-700 focus-within:border-primary transition-colors ${replyingTo ? 'rounded-b-lg rounded-t-none' : 'rounded-lg'}`}>
                  
                  <div className="relative">
                    <button type="button" onClick={() => setShowAttachMenu(!showAttachMenu)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors">
                      <PlusCircle size={20}/>
                    </button>
                    {showAttachMenu && (
                      <div className="absolute bottom-12 left-0 bg-slate-800 border border-slate-700 rounded-lg shadow-xl w-48 p-2 flex flex-col gap-1 z-50">
                        <button type="button" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-700 text-sm text-slate-300 rounded-md text-left"><ImageIcon size={16} className="text-blue-400"/> Enviar Imagem</button>
                        <button type="button" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-700 text-sm text-slate-300 rounded-md text-left"><BookOpen size={16} className="text-emerald-400"/> Anexar Apostila</button>
                      </div>
                    )}
                  </div>

                  {isRecording ? (
                    <div className="flex-1 bg-red-500/10 border border-red-500/30 rounded px-3 py-2 mx-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-red-400 text-sm font-bold animate-pulse">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div> Gravando Áudio... 0:04
                      </div>
                      <button type="button" onClick={() => setIsRecording(false)} className="text-slate-400 hover:text-red-400"><X size={16}/></button>
                    </div>
                  ) : (
                    <input 
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder={`Conversar em #${activeChannel}`}
                      className="flex-1 bg-transparent px-3 py-2 outline-none text-sm text-white"
                      autoFocus
                    />
                  )}
                  
                  {isRecording ? (
                    <button type="button" onClick={sendAudioMessage} className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30">
                      <Send size={18} />
                    </button>
                  ) : chatMessage.trim() ? (
                    <button type="submit" className="p-2 bg-primary text-white hover:bg-blue-500 rounded-md shadow-lg shadow-primary/30 mr-1">
                      <Send size={18} />
                    </button>
                  ) : (
                    <button type="button" onClick={() => setIsRecording(true)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md mr-1 transition-colors">
                      <Mic size={20} />
                    </button>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* TAB: POMODORO (SALA DE FOCO) */}
          {activeTab === 'pomodoro' && (
            <div className="flex-1 flex flex-col bg-[#0f172a] relative items-center justify-center p-8">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 to-transparent pointer-events-none"></div>
              
              <div className="z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  <Clock size={40} className="text-emerald-400" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">Sala de Foco Coletivo</h3>
                <p className="text-slate-400 text-center max-w-md mb-12">
                  Você está estudando com a guilda. Nenhuma nãotificação vai te atrapalhar agora. Concentre-se!
                </p>

                {/* Circular Timer Display */}
                <div className="relative w-64 h-64 flex items-center justify-center mb-10 group">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle cx="128" cy="128" r="120" fill="none" stroke="#1e293b" strokeWidth="8" />
                    <circle 
                      cx="128" 
                      cy="128" 
                      r="120" 
                      fill="none" 
                      stroke="#10b981" 
                      strokeWidth="8" 
                      strokeDasharray={2 * Math.PI * 120}
                      strokeDashoffset={2 * Math.PI * 120 * (1 - pomodoroTime / (25 * 60))}
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  <div className="text-6xl font-black text-white font-monão tracking-tighter drop-shadow-lg">
                    {formatTime(pomodoroTime)}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex gap-4">
                  <button 
                    onClick={() => setPomodoroActive(!pomodoroActive)}
                    className="flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full shadow-lg shadow-emerald-500/30 transition-transform hover:scale-105"
                  >
                    {pomodoroActive ? <><Pause size={20}/> Pausar Foco</> : <><Play size={20}/> Iniciar Foco</>}
                  </button>
                  <button 
                    onClick={() => { setPomodoroActive(false); setPomodoroTime(25 * 60); }}
                    className="flex items-center justify-center w-12 h-12 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full border border-slate-700 transition-colors"
                    title="Reiniciar Timer"
                  >
                    <RotateCcw size={20}/>
                  </button>
                </div>
              </div>

              {/* Members in Focus */}
              <div className="absolute bottom-8 left-8 right-8 bg-slate-800/80 backdrop-blur-md p-4 rounded-xl border border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {activeGuild.members.slice(0, 3).map(m => (
                      <img key={m.id} src={m.avatar} className="w-10 h-10 rounded-full border-2 border-slate-800" alt="Av" />
                    ))}
                  </div>
                  <div className="text-sm text-slate-300">
                    <span className="font-bold text-emerald-400">3 membros</span> estão focados agora.
                  </div>
                </div>
                <button className="text-sm font-bold text-slate-400 hover:text-white px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors">
                  Ver Tarefas da Guilda
                </button>
              </div>
            </div>
          )}

          {/* TAB WHITEBOARD (NOVA - AGORA INTERATIVA) */}
          {activeTab === 'whiteboard' && (
            <div className="flex-1 flex flex-col bg-[#0f172a] relative">
              <div className="h-12 bg-slate-800 border-b border-slate-700 flex items-center justify-center gap-2 px-4 shadow-md z-20">
                <button 
                  onClick={() => { setBrushColor('#ffffff'); setBrushSize(3); }} 
                  className={`p-2 rounded transition-colors ${brushColor === '#ffffff' && brushSize === 3 ? 'bg-primary text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                  title="Lápis Branco"
                >
                  <PenTool size={16}/>
                </button>
                <button 
                  onClick={() => { setBrushColor('#0f172a'); setBrushSize(20); }} 
                  className={`p-2 rounded transition-colors ${brushColor === '#0f172a' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                  title="Borracha"
                >
                  <Eraser size={16}/>
                </button>
                <div className="w-px h-6 bg-slate-700 mx-2"></div>
                <div className="flex gap-2 items-center">
                  {['#ffffff', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#a855f7'].map(color => (
                    <div 
                      key={color}
                      onClick={() => { setBrushColor(color); setBrushSize(3); }}
                      className={`w-6 h-6 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-md ${brushColor === color && brushSize !== 20 ? 'ring-2 ring-offset-2 ring-offset-slate-800 ring-primary scale-110' : ''}`}
                      style={{ backgroundColor: color }}
                    ></div>
                  ))}
                </div>
                <div className="w-px h-6 bg-slate-700 mx-2"></div>
                <button onClick={clearCanvas} className="px-3 py-1.5 text-xs font-bold text-red-400 hover:text-white hover:bg-red-500/20 rounded transition-colors border border-red-500/30">
                  Limpar Lousa
                </button>
              </div>
              
              <div className="flex-1 relative overflow-hidden" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                  <span className="text-4xl font-black text-white/50 tracking-widest uppercase">Canvas Interativo</span>
                </div>
                
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="absolute inset-0 w-full h-full cursor-crosshair z-10"
                />
              </div>
            </div>
          )}

          {/* PAINEL DIREITO (Membros) */}
          {(activeTab === 'chat' || activeTab === 'whiteboard') && (
            <div className="hidden md:flex flex-col w-56 lg:w-64 bg-[#1e293b] border-l border-slate-800 flex-shrink-0 p-4 overflow-y-auto z-20 shadow-[-10px_0_20px_rgba(0,0,0,0.2)]">
              {['LEADER', 'VETERAN', 'ROOKIE'].map(roleName => {
                const roleMembers = activeGuild.members.filter(m => m.role === roleName);
                if (roleMembers.length === 0) return null;
                const roleColors = { LEADER: 'text-amber-500 border-amber-500', VETERAN: 'text-purple-400 border-purple-500', ROOKIE: 'text-emerald-400 border-emerald-500' };
                const roleTitle = { LEADER: 'Líderes', VETERAN: 'Veteranãos', ROOKIE: 'Membros' };

                return (
                  <div key={roleName} className="mb-6">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{roleTitle[roleName]} — {roleMembers.length}</div>
                    {roleMembers.map(m => (
                      <div key={m.id} className="flex items-center gap-3 mb-3 hover:bg-slate-800/50 p-1.5 -mx-1.5 rounded-md cursor-pointer transition-colors group">
                        <div className="relative">
                          <img src={m.avatar} className={`w-9 h-9 rounded-full border ${roleColors[roleName].split(' ')[1]}`} alt="Av" />
                          {m.role === 'LEADER' && <div className="absolute -bottom-1 -right-1 bg-darker rounded-full p-0.5"><Crown size={12} className="text-amber-500"/></div>}
                        </div>
                        <div>
                          <div className={`font-bold text-sm ${roleColors[roleName].split(' ')[0]}`}>{m.name}</div>
                          {m.customTitle && <div className="text-[10px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded mt-0.5">{m.customTitle}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Guildas;
