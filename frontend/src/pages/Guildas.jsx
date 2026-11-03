import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { 
  Users, Crown, Medal, MessageSquare, Target, Trophy, Hash, Send, ChevronLeft, 
  Settings, Clock, Play, Pause, RotateCcw, Pin, Reply, PlusCircle, Bot, X, 
  PenTool, Eraser, Circle, Loader2, AlertCircle, Sparkles, CheckCircle2, LogOut, Plus,
  Trash2, Shield, UserX, UserPlus, AlertTriangle, FileText
} from 'lucide-react';

function Guildas() {
  const { currentUser, updateCurrentUser } = useAuth();
  
  const [guildas, setGuildas] = useState([]);
  const [loadingGuilds, setLoadingGuilds] = useState(true);
  const [activeGuild, setActiveGuild] = useState(null);
  const [activeTab, setActiveTab] = useState('chat'); // chat, pomodoro, whiteboard
  const [activeChannel, setActiveChannel] = useState('geral'); // geral, duvidas, offtopic
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);

  // Modal de Criação de Guilda
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSkills, setNewSkills] = useState('');
  const [newShift, setNewShift] = useState('Noite');
  const [newMaxMembers, setNewMaxMembers] = useState(10);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Modal de Gestão da Guilda (Líder / Admin)
  const [showManageModal, setShowManageModal] = useState(false);
  const [manageTab, setManageTab] = useState('info'); // 'info', 'members', 'audit'
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editShift, setEditShift] = useState('Noite');
  const [editSkills, setEditSkills] = useState('');
  const [editMaxMembers, setEditMaxMembers] = useState(10);
  const [manageLoading, setManageLoading] = useState(false);
  const [manageNotice, setManageNotice] = useState('');
  const [manageError, setManageError] = useState('');

  // Convite de membro
  const [inviteIdentifier, setInviteIdentifier] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);

  // Expulsão com auditoria obrigatória
  const [memberToExpel, setMemberToExpel] = useState(null);
  const [expulsionReason, setExpulsionReason] = useState('');
  const [expellingLoading, setExpellingLoading] = useState(false);

  // Logs de Auditoria de Expulsões
  const [expulsionLogs, setExpulsionLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const [replyingTo, setReplyingTo] = useState(null);
  const [pinnedMessageId, setPinnedMessageId] = useState(null);
  
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

  // 1. Carrega todas as guildas do Backend
  const loadGuildas = async () => {
    try {
      setLoadingGuilds(true);
      const res = await api.get('/squads/squads/');
      const list = res.data || [];
      setGuildas(list);

      // Se houver uma guilda selecionada (ex: recomendada pela IA)
      const selectedId = localStorage.getItem('selected_guild_id');
      if (selectedId) {
        localStorage.removeItem('selected_guild_id');
        let target = list.find(g => String(g.id) === String(selectedId));
        if (!target) {
          try {
            const fetched = (await api.get(`/squads/squads/${selectedId}/`)).data;
            if (fetched) {
              target = fetched;
            }
          } catch (_) {}
        }
        if (target) {
          setActiveGuild(target);
        }
      }
    } catch (err) {
      console.error('Erro ao buscar guildas:', err);
    } finally {
      setLoadingGuilds(false);
    }
  };

  useEffect(() => {
    loadGuildas();
  }, []);

  // 2. Carrega mensagens do canal com sincronização contínua em tempo real
  const loadMessages = async (guildId, channel, isBackground = false) => {
    try {
      if (!isBackground) setLoadingChat(true);
      const res = await api.get(`/squads/squads/${guildId}/messages/`, {
        params: { channel }
      });
      setChatMessages(prev => {
        // Atualiza e rola suavemente se houver novas mensagens
        if (
          prev.length !== res.data.length ||
          (res.data.length > 0 && prev.length > 0 && prev[prev.length - 1].id !== res.data[res.data.length - 1]?.id)
        ) {
          setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
          return res.data;
        }
        return prev;
      });
    } catch (err) {
      if (!isBackground) console.error('Erro ao carregar mensagens:', err);
    } finally {
      if (!isBackground) setLoadingChat(false);
    }
  };

  useEffect(() => {
    if (!activeGuild || activeTab !== 'chat') return;

    // Carga inicial imediata
    loadMessages(activeGuild.id, activeChannel, false);

    // Sincronização em Tempo Real (Live Sync a cada 2.5 segundos)
    const interval = setInterval(() => {
      loadMessages(activeGuild.id, activeChannel, true);
    }, 2500);

    return () => clearInterval(interval);
  }, [activeGuild?.id, activeChannel, activeTab]);

  // 3. Whiteboard logic
  useEffect(() => {
    if (activeTab === 'whiteboard' && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctxRef.current = ctx;
    }
  }, [activeTab]);

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

  // Pomodoro timer
  useEffect(() => {
    let interval = null;
    if (pomodoroActive && pomodoroTime > 0) {
      interval = setInterval(() => setPomodoroTime(t => t - 1), 1000);
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

  // 4. Criar Nova Guilda
  const handleCreateGuild = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) {
      setModalError('Preencha o nome e a descrição da guilda.');
      return;
    }

    setModalLoading(true);
    setModalError('');

    try {
      const skillsArray = newSkills.split(',').map(s => s.trim()).filter(Boolean);
      const payload = {
        title: newTitle.trim(),
        description: newDesc.trim(),
        needed_skills: skillsArray,
        available_shifts: newShift,
        max_members: parseInt(newMaxMembers, 10) || 10
      };

      const res = await api.post('/squads/squads/', payload);
      setGuildas([res.data, ...guildas]);
      setShowCreateModal(false);
      setNewTitle('');
      setNewDesc('');
      setNewSkills('');

      if (currentUser) {
        updateCurrentUser({ xp: (currentUser.xp || 0) + 30 });
      }
      setActiveGuild(res.data);
    } catch (err) {
      setModalError('Erro ao criar guilda. Verifique os dados e tente novamente.');
    } finally {
      setModalLoading(false);
    }
  };

  // 5. Entrar na Guilda
  const handleJoinGuild = async (guildId) => {
    try {
      await api.post(`/squads/squads/${guildId}/join/`);
      await loadGuildas();
      const updated = (await api.get(`/squads/squads/${guildId}/`)).data;
      setActiveGuild(updated);
    } catch (err) {
      const msg = err.response?.data?.error || 'Erro ao entrar na guilda.';
      if (msg.toLowerCase().includes('já é membro')) {
        const target = guildas.find(g => g.id === guildId);
        if (target) {
          setActiveGuild(target);
          return;
        }
        try {
          const updated = (await api.get(`/squads/squads/${guildId}/`)).data;
          setActiveGuild(updated);
          return;
        } catch (_) {}
      }
      alert(msg);
    }
  };

  // 6. Sair da Guilda
  const handleLeaveGuild = async (guildId) => {
    if (!window.confirm('Tem certeza de que deseja sair desta guilda?')) return;
    try {
      await api.post(`/squads/squads/${guildId}/leave/`);
      await loadGuildas();
      setActiveGuild(null);
    } catch (err) {
      const msg = err.response?.data?.error || 'Erro ao sair da guilda.';
      alert(msg);
    }
  };

  // 6.1 Sincroniza dados do formulário de gestão ao selecionar a guilda
  useEffect(() => {
    if (activeGuild) {
      setEditTitle(activeGuild.title || '');
      setEditDesc(activeGuild.description || '');
      setEditShift(activeGuild.available_shifts || 'Noite');
      setEditSkills(Array.isArray(activeGuild.needed_skills) ? activeGuild.needed_skills.join(', ') : (activeGuild.needed_skills || ''));
      setEditMaxMembers(activeGuild.max_members || 10);
      setManageNotice('');
      setManageError('');
    }
  }, [activeGuild]);

  // 6.2 Salvar Configurações da Guilda (Dono / Admin)
  const handleSaveGuildSettings = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editDesc.trim()) {
      setManageError('Nome e descrição são obrigatórios.');
      return;
    }

    setManageLoading(true);
    setManageNotice('');
    setManageError('');

    try {
      const skillsArray = editSkills.split(',').map(s => s.trim()).filter(Boolean);
      const payload = {
        title: editTitle.trim(),
        description: editDesc.trim(),
        available_shifts: editShift,
        needed_skills: skillsArray,
        max_members: parseInt(editMaxMembers, 10) || 10
      };

      const res = await api.patch(`/squads/squads/${activeGuild.id}/`, payload);
      setActiveGuild(res.data);
      setGuildas(prev => prev.map(g => g.id === activeGuild.id ? res.data : g));
      setManageNotice('Dados da guilda atualizados com sucesso!');
    } catch (err) {
      setManageError(err.response?.data?.error || 'Erro ao atualizar dados da guilda.');
    } finally {
      setManageLoading(false);
    }
  };

  // 6.3 Excluir Guilda Definitivamente (Dono / Admin)
  const handleDeleteGuild = async () => {
    if (!window.confirm(`⚠️ Tem certeza de que deseja excluir a guilda "${activeGuild.title}"? Esta ação removerá a sede e o histórico de conversas permanentemente.`)) {
      return;
    }

    setManageLoading(true);
    try {
      await api.delete(`/squads/squads/${activeGuild.id}/`);
      setGuildas(prev => prev.filter(g => g.id !== activeGuild.id));
      setActiveGuild(null);
      setShowManageModal(false);
      alert('Guilda excluída com sucesso.');
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao excluir guilda.');
    } finally {
      setManageLoading(false);
    }
  };

  // 6.4 Convidar Membro para a Guilda
  const handleInviteMember = async (e) => {
    e.preventDefault();
    if (!inviteIdentifier.trim()) return;

    setInviteLoading(true);
    setManageNotice('');
    setManageError('');

    try {
      const res = await api.post(`/squads/squads/${activeGuild.id}/invite/`, {
        identifier: inviteIdentifier.trim()
      });
      setManageNotice(res.data.message || 'Membro adicionado com sucesso!');
      setInviteIdentifier('');
      const updated = (await api.get(`/squads/squads/${activeGuild.id}/`)).data;
      setActiveGuild(updated);
      setGuildas(prev => prev.map(g => g.id === activeGuild.id ? updated : g));
    } catch (err) {
      setManageError(err.response?.data?.error || 'Erro ao convidar usuário.');
    } finally {
      setInviteLoading(false);
    }
  };

  // 6.5 Confirmar Expulsão de Membro com Justificativa Auditada
  const handleConfirmExpel = async (e) => {
    e.preventDefault();
    if (!memberToExpel) return;
    if (!expulsionReason.trim() || expulsionReason.trim().length < 5) {
      alert('Por favor, informe um motivo válido (mínimo de 5 caracteres) para fins de auditoria.');
      return;
    }

    setExpellingLoading(true);
    try {
      const res = await api.post(`/squads/squads/${activeGuild.id}/expel/`, {
        user_id: memberToExpel.id,
        reason: expulsionReason.trim()
      });
      alert(res.data.message || 'Membro expulso da guilda.');
      setMemberToExpel(null);
      setExpulsionReason('');

      const updated = (await api.get(`/squads/squads/${activeGuild.id}/`)).data;
      setActiveGuild(updated);
      setGuildas(prev => prev.map(g => g.id === activeGuild.id ? updated : g));

      loadExpulsionLogs();
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao expulsar membro.');
    } finally {
      setExpellingLoading(false);
    }
  };

  // 6.6 Carregar Histórico de Auditoria de Expulsões
  const loadExpulsionLogs = async () => {
    if (!activeGuild) return;
    setLoadingLogs(true);
    try {
      const res = await api.get(`/squads/squads/${activeGuild.id}/expulsions/`);
      setExpulsionLogs(res.data || []);
    } catch (err) {
      console.error('Erro ao carregar logs de expulsão:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  // 6.7 Excluir Mensagem do Chat (Moderação)
  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm('Deseja realmente excluir esta mensagem do chat da guilda?')) return;
    try {
      await api.delete(`/squads/squads/${activeGuild.id}/messages/`, {
        data: { message_id: msgId }
      });
      setChatMessages(prev => prev.filter(m => m.id !== msgId));
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao excluir mensagem.');
    }
  };

  // 7. Enviar Mensagem Real
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim() || !activeGuild) return;

    const text = chatMessage.trim();

    // Comandos especiais
    if (text.startsWith('/')) {
      const [cmd, arg] = text.split(' ');
      if (cmd.toLowerCase() === '/pomodoro') {
        setPomodoroTime((parseInt(arg, 10) || 25) * 60);
        setActiveTab('pomodoro');
        setPomodoroActive(true);
      } else if (cmd.toLowerCase() === '/dado') {
        const val = Math.floor(Math.random() * 20) + 1;
        setChatMessage('');
        try {
          const res = await api.post(`/squads/squads/${activeGuild.id}/messages/`, {
            content: `🎲 Rolou um d20 e tirou: **${val}**!`,
            channel: activeChannel
          });
          setChatMessages(prev => [...prev, res.data]);
        } catch {}
        return;
      }
    }

    try {
      setChatMessage('');
      const res = await api.post(`/squads/squads/${activeGuild.id}/messages/`, {
        content: text,
        channel: activeChannel
      });
      setChatMessages(prev => [...prev, res.data]);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      alert('Não foi possível enviar a mensagem.');
    }
  };

  const formatMsgTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  // ==========================================
  // TELA 1: LISTAGEM DE GUILDAS
  // ==========================================
  if (!activeGuild) {
    return (
      <div className="bg-darker p-3 sm:p-6 md:p-8 rounded-xl border border-slate-700 shadow-xl animate-fade-in relative overflow-hidden">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-1 flex items-center gap-2 sm:gap-3 flex-wrap">
              <Users className="text-primary" size={28} /> Guildas & Grupos de Estudo
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">Monte equipes para TCC, maratonas de programação e revisões em grupo.</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-sm shrink-0"
          >
            <Plus size={18} /> Criar Nova Guilda (+30 XP)
          </button>
        </div>

        {/* Modal de Criação */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
            <div className="bg-slate-800 border border-slate-700 p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-fade-in">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-700/50 hover:bg-slate-700 transition-colors"
              >
                <X size={20} />
              </button>

              <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
                <Crown className="text-amber-400" size={24} /> Fundar Nova Guilda
              </h3>
              <p className="text-slate-400 text-sm mb-6">Crie um grupo de estudos focado e convide colegas da faculdade.</p>

              {modalError && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{modalError}</span>
                </div>
              )}

              <form onSubmit={handleCreateGuild} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Nome da Guilda *</label>
                  <input 
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: Laboratório de Inteligência Artificial"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Objetivo & Descrição *</label>
                  <textarea 
                    required
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Descreva o foco dos encontros, projetos em andamento, etc..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-primary outline-none h-20 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Foco / Tecnologias</label>
                    <input 
                      type="text"
                      value={newSkills}
                      onChange={(e) => setNewSkills(e.target.value)}
                      placeholder="Ex: Python, React, TCC"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Turno de Estudo</label>
                    <select
                      value={newShift}
                      onChange={(e) => setNewShift(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-primary outline-none font-medium"
                    >
                      <option value="Noite">Noite</option>
                      <option value="Manhã">Manhã</option>
                      <option value="Tarde">Tarde</option>
                      <option value="Fins de Semana">Fins de Semana</option>
                      <option value="Flexível">Horário Flexível</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Capacidade Máxima de Membros</label>
                  <input 
                    type="number"
                    min="2"
                    max="50"
                    value={newMaxMembers}
                    onChange={(e) => setNewMaxMembers(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-primary outline-none"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowCreateModal(false)}
                    className="px-5 py-2.5 rounded-lg text-sm font-bold text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={modalLoading}
                    className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2"
                  >
                    {modalLoading && <Loader2 size={16} className="animate-spin" />}
                    Criar Guilda
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Listagem de Guildas */}
        {loadingGuilds ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 size={32} className="animate-spin text-primary" />
            <span>Carregando guildas de estudo...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guildas.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-400 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                <Users size={40} className="mx-auto text-slate-500 mb-2" />
                <p className="text-lg font-bold text-white">Nenhuma guilda fundada ainda</p>
                <p className="text-sm mt-1">Seja o primeiro a criar um grupo de estudos!</p>
              </div>
            )}

            {guildas.map(guilda => {
              const isGuildLeader = Boolean(
                guilda.is_leader || 
                (currentUser && guilda.leader === currentUser.id) ||
                (currentUser && currentUser.role === 'ADMIN') ||
                (currentUser && currentUser.is_staff)
              );
              const isMember = Boolean(
                guilda.is_member || 
                isGuildLeader || 
                (currentUser && (guilda.members || []).some(m => m.id === currentUser.id))
              );

              return (
                <div key={guilda.id} className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-xl flex flex-col justify-between group hover:border-primary/50 transition-all">
                  
                  {/* Banner da Guilda */}
                  <div className="h-28 bg-gradient-to-r from-purple-900/60 via-primary/40 to-slate-900 relative p-4 flex items-center justify-between border-b border-slate-700/40">
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl border-2 border-primary/50 flex items-center justify-center text-3xl shadow-lg absolute -bottom-6 left-5">
                      ⚔️
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-xs bg-slate-900/80 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-full font-bold">
                        🕒 {guilda.available_shifts}
                      </span>
                      <span className="text-xs bg-primary/20 text-primary-light border border-primary/40 px-2.5 py-1 rounded-full font-bold">
                        👥 {guilda.members_count} / {guilda.max_members}
                      </span>
                    </div>
                  </div>

                  {/* Informações da Guilda */}
                  <div className="p-6 pt-9 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-black text-white leading-tight">{guilda.title}</h3>
                      {isGuildLeader && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold uppercase flex items-center gap-1 shrink-0">
                          <Crown size={11} /> Sua Guilda (Líder)
                        </span>
                      )}
                    </div>
                    
                    <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-2">
                      {guilda.description}
                    </p>

                    {/* Habilidades / Tags */}
                    {guilda.needed_skills && guilda.needed_skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {guilda.needed_skills.map((skill, i) => (
                          <span key={i} className="text-xs bg-slate-900 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto pt-4 border-t border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <img 
                          src={guilda.leader_avatar} 
                          alt={guilda.leader_name} 
                          className="w-6 h-6 rounded-full border border-slate-600 object-cover" 
                        />
                        <span>Líder: <strong className="text-slate-200">{guilda.leader_name}</strong></span>
                      </div>

                      <div className="w-full sm:w-auto flex flex-wrap items-center gap-2">
                        {isGuildLeader && (
                          <button 
                            onClick={() => {
                              setActiveGuild(guilda);
                              setEditTitle(guilda.title || '');
                              setEditDesc(guilda.description || '');
                              setEditShift(guilda.available_shifts || 'Noite');
                              setEditSkills(Array.isArray(guilda.needed_skills) ? guilda.needed_skills.join(', ') : (guilda.needed_skills || ''));
                              setEditMaxMembers(guilda.max_members || 10);
                              setShowManageModal(true);
                              setManageTab('info');
                            }}
                            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2 px-3.5 rounded-xl text-xs transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                            title="Gerenciar configurações, convidar membros ou moderar guilda"
                          >
                            <Settings size={14} /> Gerenciar Guilda
                          </button>
                        )}
                        {isMember ? (
                          <button 
                            onClick={() => setActiveGuild(guilda)}
                            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors shadow-md shadow-primary/20 flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            Acessar Sede
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleJoinGuild(guilda.id)}
                            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                          >
                            <CheckCircle2 size={14} /> Entrar na Guilda
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    );
  }

  // ==========================================
  // TELA 2: SEDE DA GUILDA (CHAT, LOUSA, FOCO)
  // ==========================================
  const isLeader = Boolean(
    activeGuild?.is_leader || 
    (currentUser && activeGuild?.leader === currentUser.id) ||
    (currentUser && currentUser.role === 'ADMIN') ||
    (currentUser && currentUser.is_staff)
  );

  return (
    <div className="bg-[#1e293b] h-[78vh] sm:h-[82vh] md:h-[85vh] rounded-2xl border border-slate-700 shadow-2xl flex flex-col md:flex-row overflow-hidden animate-fade-in relative">
      
      {/* Mobile Top Header da Guilda */}
      <div className="md:hidden flex items-center justify-between p-3 bg-[#0f172a] border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <button 
            onClick={() => setActiveGuild(null)} 
            className="text-slate-400 hover:text-white p-1.5 bg-slate-800 rounded-lg shrink-0"
            title="Voltar para a lista de guildas"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="font-black text-white truncate text-sm">{activeGuild.title}</div>
        </div>

        <div className="flex items-center gap-1.5">
          {isLeader && (
            <button 
              onClick={() => {
                setShowManageModal(true);
                setManageTab('info');
              }}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold p-1.5 rounded-xl text-xs flex items-center gap-1"
              title="Painel de Gestão da Guilda"
            >
              <Settings size={16} />
              <span className="text-[11px] font-bold">Gestão</span>
            </button>
          )}
          <div className="flex items-center gap-1.5">
            {isLeader && (
              <button 
                onClick={() => {
                  setShowManageModal(true);
                  setManageTab('info');
                }}
                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold py-1.5 px-3 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
                title="Painel de Gestão da Guilda (Líder / Admin)"
              >
                <Settings size={15} />
                <span>Painel de Gestão</span>
              </button>
            )}
            {!isLeader && (
              <button 
                onClick={() => handleLeaveGuild(activeGuild.id)}
                className="text-red-400 hover:text-red-300 p-1.5 hover:bg-red-500/10 rounded-lg text-xs"
                title="Sair desta guilda"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Selector de Canais e Ferramentas (Fase 12) */}
      <div className="md:hidden flex items-center gap-1.5 p-2 bg-[#0f172a] border-b border-slate-800 overflow-x-auto no-scrollbar shrink-0">
        <button 
          onClick={() => { setActiveTab('chat'); setActiveChannel('geral'); }} 
          className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 transition-colors ${
            activeTab === 'chat' && activeChannel === 'geral' ? 'bg-primary text-white shadow-sm' : 'bg-slate-800/80 text-slate-400'
          }`}
        >
          <Hash size={13} /> geral
        </button>
        <button 
          onClick={() => { setActiveTab('chat'); setActiveChannel('duvidas'); }} 
          className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 transition-colors ${
            activeTab === 'chat' && activeChannel === 'duvidas' ? 'bg-primary text-white shadow-sm' : 'bg-slate-800/80 text-slate-400'
          }`}
        >
          <Hash size={13} /> dúvidas
        </button>
        <button 
          onClick={() => { setActiveTab('chat'); setActiveChannel('offtopic'); }} 
          className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 transition-colors ${
            activeTab === 'chat' && activeChannel === 'offtopic' ? 'bg-primary text-white shadow-sm' : 'bg-slate-800/80 text-slate-400'
          }`}
        >
          <Hash size={13} /> off-topic
        </button>
        <button 
          onClick={() => setActiveTab('whiteboard')} 
          className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 transition-colors ${
            activeTab === 'whiteboard' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800/80 text-slate-400'
          }`}
        >
          <PenTool size={13} /> Lousa
        </button>
        <button 
          onClick={() => setActiveTab('pomodoro')} 
          className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 transition-colors ${
            activeTab === 'pomodoro' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-800/80 text-slate-400'
          }`}
        >
          <Clock size={13} /> Pomodoro
        </button>
      </div>

      {/* SIDEBAR DA GUILDA DESKTOP */}
      <div className="hidden md:flex w-64 bg-[#0f172a] border-r border-slate-800 flex-col flex-shrink-0">
        
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-2 shadow-md z-10">
          <div className="flex items-center gap-2 min-w-0">
            <button 
              onClick={() => setActiveGuild(null)} 
              className="text-slate-400 hover:text-white p-1.5 bg-slate-800 rounded-lg shrink-0"
              title="Voltar para a lista de guildas"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="font-black text-white truncate text-sm">{activeGuild.title}</div>
          </div>
          
          {!isLeader && (
            <button 
              onClick={() => handleLeaveGuild(activeGuild.id)}
              className="text-red-400 hover:text-red-300 p-1.5 hover:bg-red-500/10 rounded-lg text-xs"
              title="Sair desta guilda"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>

        <div className="p-3 flex-1 overflow-y-auto space-y-6">
          {/* Canais */}
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase mb-2 px-2 tracking-wider">Canais de Texto</div>
            <div className="space-y-1">
              <button 
                onClick={() => { setActiveTab('chat'); setActiveChannel('geral'); }} 
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                  activeTab === 'chat' && activeChannel === 'geral' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800/50'
                }`}
              >
                <Hash size={16} className={activeTab === 'chat' && activeChannel === 'geral' ? 'text-primary' : ''} /> chat-geral
              </button>
              <button 
                onClick={() => { setActiveTab('chat'); setActiveChannel('duvidas'); }} 
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                  activeTab === 'chat' && activeChannel === 'duvidas' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800/50'
                }`}
              >
                <Hash size={16} className={activeTab === 'chat' && activeChannel === 'duvidas' ? 'text-primary' : ''} /> dúvidas-do-projeto
              </button>
              <button 
                onClick={() => { setActiveTab('chat'); setActiveChannel('offtopic'); }} 
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                  activeTab === 'chat' && activeChannel === 'offtopic' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800/50'
                }`}
              >
                <Hash size={16} className={activeTab === 'chat' && activeChannel === 'offtopic' ? 'text-primary' : ''} /> off-topic
              </button>
            </div>
          </div>
          
          {/* Ferramentas */}
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase mb-2 px-2 tracking-wider">Ferramentas da Equipe</div>
            <div className="space-y-1">
              <button 
                onClick={() => setActiveTab('whiteboard')} 
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                  activeTab === 'whiteboard' ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:bg-slate-800/50'
                }`}
              >
                <PenTool size={16} /> Lousa Interativa
              </button>
              <button 
                onClick={() => setActiveTab('pomodoro')} 
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                  activeTab === 'pomodoro' ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2"><Clock size={16} /> Sala Pomodoro</div>
                {pomodoroActive && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>}
              </button>
            </div>
          </div>

          {/* Membros Ativos */}
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase mb-2 px-2 tracking-wider flex items-center justify-between">
              <span>Membros ({activeGuild.members ? activeGuild.members.length : 0})</span>
            </div>
            <div className="space-y-2">
              {activeGuild.members && activeGuild.members.map(member => (
                <div key={member.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-800/40">
                  <img 
                    src={member.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix'} 
                    alt={member.name} 
                    className="w-7 h-7 rounded-full border border-slate-700 object-cover" 
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-200 truncate flex items-center gap-1">
                      {member.name}
                      {member.id === activeGuild.leader && <Crown size={12} className="text-amber-400 shrink-0" />}
                    </div>
                    <div className="text-[10px] text-slate-400">Nv. {member.level}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ÁREA CENTRAL */}
      <div className="flex-1 flex flex-col bg-slate-900 relative min-w-0">
        
        {/* Header Central */}
        <div className="h-14 border-b border-slate-800 flex items-center px-4 justify-between bg-[#1e293b]">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            {activeTab === 'chat' && (
              <div className="flex items-center gap-2">
                <Hash className="text-primary" size={18}/> #{activeChannel}
                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Tempo Real
                </span>
              </div>
            )}
            {activeTab === 'pomodoro' && <><Clock className="text-emerald-400" size={18}/> Ciclo de Concentração Coletiva</>}
            {activeTab === 'whiteboard' && <><PenTool className="text-indigo-400" size={18}/> Lousa de Brainstorming Coletivo</>}
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">Comandos rápidos: <code>/pomodoro 25</code> ou <code>/dado</code></span>
        </div>

        <div className="flex-1 overflow-hidden flex flex-row relative">
          
          {/* TAB: CHAT REAL */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col min-w-0 relative">
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                
                <div className="text-center py-6 border-b border-slate-800/50 mb-2">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2 text-primary">
                    <Hash size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-white">Canal #{activeChannel}</h4>
                  <p className="text-slate-400 text-xs">Mensagens salvas e sincronizadas no banco de dados da guilda.</p>
                  <p className="text-[11px] text-amber-300/90 mt-1.5 inline-flex items-center gap-1 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    🧹 <strong>Faxina semanal:</strong> Todo domingo às 23:59 o chat é reiniciado para manter o banco leve e rápido.
                  </p>
                </div>

                {loadingChat ? (
                  <div className="py-10 text-center text-slate-400 flex items-center justify-center gap-2 text-xs">
                    <Loader2 size={18} className="animate-spin text-primary" />
                    <span>Carregando mensagens...</span>
                  </div>
                ) : (
                  <>
                    {chatMessages.length === 0 && (
                      <div className="text-center text-slate-500 py-10 text-xs">
                        Nenhuma mensagem neste canal ainda. Envie a primeira mensagem abaixo!
                      </div>
                    )}

                    {chatMessages.map(msg => {
                      const canDelete = msg.can_delete || isLeader || (currentUser && currentUser.id === msg.author) || (currentUser && currentUser.role === 'ADMIN');
                      return (
                        <div key={msg.id} className="group relative flex gap-3 hover:bg-slate-800/40 p-2.5 rounded-xl transition-colors">
                          <img 
                            src={msg.author_avatar} 
                            className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5 border border-slate-700" 
                            alt="Avatar" 
                          />
                          <div className="flex-1 min-w-0 pr-8">
                            <div className="flex items-baseline gap-2">
                              <span className="font-bold text-sm text-slate-200">
                                {msg.author_name}
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">
                                {formatMsgTime(msg.created_at)}
                              </span>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed mt-0.5 whitespace-pre-wrap">
                              {msg.content}
                            </p>
                          </div>
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-2 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                              title="Excluir mensagem (Moderação)"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </>
                )}
              </div>

              {/* Input de Mensagem */}
              <div className="p-4 bg-[#1e293b] border-t border-slate-800">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input 
                    type="text" 
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder={`Mensagem em #${activeChannel}... (dica: digite /dado ou /pomodoro)`}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                  <button 
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-white font-bold p-2.5 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center justify-center"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* TAB: POMODORO */}
          {activeTab === 'pomodoro' && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-900/60">
              <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700 text-center max-w-sm w-full shadow-2xl">
                <Clock size={40} className="mx-auto text-emerald-400 mb-3" />
                <h3 className="text-xl font-bold text-white mb-1">Sala de Foco Coletivo</h3>
                <p className="text-slate-400 text-xs mb-6">Mantenha a concentração em grupo sem distrações.</p>

                <div className="text-6xl font-black text-white font-mono mb-8 tracking-wider">
                  {formatTime(pomodoroTime)}
                </div>

                <div className="flex justify-center gap-3">
                  <button 
                    onClick={() => setPomodoroActive(!pomodoroActive)}
                    className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                      pomodoroActive ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                    }`}
                  >
                    {pomodoroActive ? <><Pause size={16}/> Pausar</> : <><Play size={16}/> Iniciar</>}
                  </button>
                  <button 
                    onClick={() => { setPomodoroActive(false); setPomodoroTime(25 * 60); }}
                    className="p-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl"
                    title="Reiniciar"
                  >
                    <RotateCcw size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: WHITEBOARD */}
          {activeTab === 'whiteboard' && (
            <div className="flex-1 flex flex-col bg-slate-950 relative">
              <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400">Cor:</span>
                  {['#ffffff', '#38bdf8', '#4ade80', '#f43f5e', '#fbbf24'].map(color => (
                    <button
                      key={color}
                      onClick={() => setBrushColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${brushColor === color ? 'border-primary scale-110' : 'border-transparent'}`}
                    />
                  ))}
                  <div className="w-px h-5 bg-slate-700 mx-2"></div>
                  <span className="text-xs font-bold text-slate-400">Espessura:</span>
                  {[2, 4, 8].map(size => (
                    <button
                      key={size}
                      onClick={() => setBrushSize(size)}
                      className={`px-2 py-1 text-xs rounded font-bold ${brushSize === size ? 'bg-primary text-white' : 'bg-slate-800 text-slate-400'}`}
                    >
                      {size}px
                    </button>
                  ))}
                </div>
                <button 
                  onClick={clearCanvas}
                  className="text-xs bg-red-500/20 text-red-300 hover:bg-red-500/30 px-3 py-1.5 rounded-lg border border-red-500/30 font-bold"
                >
                  Limpar Lousa
                </button>
              </div>

              <div className="flex-1 relative cursor-crosshair overflow-hidden">
                <canvas 
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-full h-full block"
                />
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MODAL DE GESTÃO DA GUILDA (Líder / Admin Geral) */}
      {showManageModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-6">
          <div className="bg-[#0f172a] border border-slate-700/80 rounded-2xl max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fade-in relative">
            
            {/* Cabeçalho do Modal */}
            <div className="p-4 md:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
                    Painel de Gestão da Guilda
                  </h3>
                  <p className="text-slate-400 text-xs">Administre as configurações, membros e moderação de {activeGuild.title}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowManageModal(false);
                  setManageNotice('');
                  setManageError('');
                }}
                className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Abas de Navegação */}
            <div className="flex border-b border-slate-800 bg-slate-900/40 px-4 pt-2 gap-2">
              <button
                onClick={() => setManageTab('info')}
                className={`flex items-center gap-2 px-3 py-2.5 text-xs font-bold rounded-t-xl transition-colors border-b-2 ${
                  manageTab === 'info'
                    ? 'border-amber-400 text-amber-400 bg-slate-800/60'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Settings size={15} /> Informações & Configurações
              </button>
              <button
                onClick={() => setManageTab('members')}
                className={`flex items-center gap-2 px-3 py-2.5 text-xs font-bold rounded-t-xl transition-colors border-b-2 ${
                  manageTab === 'members'
                    ? 'border-amber-400 text-amber-400 bg-slate-800/60'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users size={15} /> Membros & Convites ({activeGuild.members_count || activeGuild.members?.length || 0})
              </button>
              <button
                onClick={() => {
                  setManageTab('audit');
                  loadExpulsionLogs();
                }}
                className={`flex items-center gap-2 px-3 py-2.5 text-xs font-bold rounded-t-xl transition-colors border-b-2 ${
                  manageTab === 'audit'
                    ? 'border-amber-400 text-amber-400 bg-slate-800/60'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText size={15} /> Auditoria de Expulsões
              </button>
            </div>

            {/* Feedback Messages */}
            {manageNotice && (
              <div className="mx-5 mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{manageNotice}</span>
              </div>
            )}
            {manageError && (
              <div className="mx-5 mt-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{manageError}</span>
              </div>
            )}

            {/* Conteúdo das Abas */}
            <div className="p-5 overflow-y-auto flex-1 space-y-5">
              {/* ABA 1: CONFIGURAÇÕES DA GUILDA */}
              {manageTab === 'info' && (
                <div className="space-y-6">
                  <form onSubmit={handleSaveGuildSettings} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Nome da Guilda *
                      </label>
                      <input 
                        type="text"
                        required
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-sm focus:border-amber-400 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Objetivo & Descrição *
                      </label>
                      <textarea 
                        required
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-sm focus:border-amber-400 outline-none h-24 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Foco / Tecnologias (separadas por vírgula)
                        </label>
                        <input 
                          type="text"
                          value={editSkills}
                          onChange={(e) => setEditSkills(e.target.value)}
                          placeholder="Ex: Python, React, TCC"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-sm focus:border-amber-400 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Turno de Estudo
                        </label>
                        <select
                          value={editShift}
                          onChange={(e) => setEditShift(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-sm focus:border-amber-400 outline-none font-medium"
                        >
                          <option value="Noite">Noite</option>
                          <option value="Manhã">Manhã</option>
                          <option value="Tarde">Tarde</option>
                          <option value="Fins de Semana">Fins de Semana</option>
                          <option value="Flexível">Horário Flexível</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Capacidade Máxima de Membros (5 a 50)
                      </label>
                      <input 
                        type="number"
                        min="2"
                        max="50"
                        value={editMaxMembers}
                        onChange={(e) => setEditMaxMembers(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-sm focus:border-amber-400 outline-none"
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={manageLoading}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
                      >
                        {manageLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                        Salvar Alterações
                      </button>
                    </div>
                  </form>

                  {/* Zona de Perigo */}
                  <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 space-y-3">
                    <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                      <AlertTriangle size={18} /> Zona de Perigo
                    </div>
                    <p className="text-slate-400 text-xs">
                      Excluir permanentemente esta guilda removerá todos os canais, mensagens de chat e membros associados. Esta ação não poderá ser desfeita.
                    </p>
                    <button
                      type="button"
                      onClick={handleDeleteGuild}
                      disabled={manageLoading}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/40 font-bold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-2"
                    >
                      <Trash2 size={14} /> Excluir Guilda Definitivamente
                    </button>
                  </div>
                </div>
              )}

              {/* ABA 2: MEMBROS & CONVITES */}
              {manageTab === 'members' && (
                <div className="space-y-6">
                  {/* Convidar universitário */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <UserPlus size={16} className="text-amber-400" /> Convidar Estudante
                    </h4>
                    <form onSubmit={handleInviteMember} className="flex gap-2">
                      <input 
                        type="text"
                        value={inviteIdentifier}
                        onChange={(e) => setInviteIdentifier(e.target.value)}
                        placeholder="Digite o @username ou e-mail institucional..."
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-400 outline-none"
                      />
                      <button
                        type="submit"
                        disabled={inviteLoading || !inviteIdentifier.trim()}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                      >
                        {inviteLoading ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                        Convidar
                      </button>
                    </form>
                  </div>

                  {/* Lista de membros */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Membros Integrados ({activeGuild.members?.length || 0})
                    </div>
                    
                    <div className="divide-y divide-slate-800/80 bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden">
                      {(activeGuild.members || []).map(member => {
                        const isThisMemberLeader = member.id === activeGuild.leader;
                        return (
                          <div key={member.id} className="p-3.5 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <img 
                                src={member.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${member.username}`}
                                alt={member.name || member.username}
                                className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm text-white truncate">
                                    {member.name || member.username}
                                  </span>
                                  {isThisMemberLeader && (
                                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                                      <Crown size={11} /> Líder
                                    </span>
                                  )}
                                  {member.role === 'ADMIN' && (
                                    <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                                      <Shield size={11} /> Admin
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                                  <span>@{member.username}</span>
                                  <span>•</span>
                                  <span>Nível {member.level || 1}</span>
                                  <span>•</span>
                                  <span>{member.xp || 0} XP</span>
                                </div>
                              </div>
                            </div>

                            {!isThisMemberLeader && (
                              <button
                                type="button"
                                onClick={() => {
                                  setMemberToExpel(member);
                                  setExpulsionReason('');
                                }}
                                className="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                                title="Expulsar membro da guilda (com registro auditado)"
                              >
                                <UserX size={14} />
                                <span className="hidden sm:inline">Expulsar</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 3: AUDITORIA DE EXPULSÕES */}
              {manageTab === 'audit' && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-3">
                    <Shield className="text-amber-400 shrink-0 mt-0.5" size={18} />
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <strong>Transparência & Moderação:</strong> Todas as expulsões realizadas nesta guilda são gravadas de forma permanente e auditadas pelos Administradores Gerais do UniStudy para garantir um ambiente saudável e combater abusos de poder.
                    </p>
                  </div>

                  {loadingLogs ? (
                    <div className="py-12 text-center text-slate-400 flex items-center justify-center gap-2 text-xs">
                      <Loader2 size={18} className="animate-spin text-amber-400" />
                      <span>Carregando logs de auditoria...</span>
                    </div>
                  ) : expulsionLogs.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 text-xs">
                      Nenhum registro de expulsão encontrado nesta guilda. O ambiente segue em harmonia! 🎉
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {expulsionLogs.map(log => (
                        <div key={log.id} className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="text-slate-300">
                              <span className="font-bold text-red-400">{log.expelled_user_name}</span> foi expulso(a) por <span className="font-bold text-amber-400">{log.expelled_by_name}</span>
                            </div>
                            <span className="text-[11px] text-slate-500">
                              {new Date(log.created_at).toLocaleString('pt-BR')}
                            </span>
                          </div>
                          <div className="p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-lg text-xs text-slate-300 font-mono">
                            <span className="text-slate-500 text-[11px] block font-sans font-bold uppercase mb-1">Motivo Registrado:</span>
                            {log.reason}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Rodapé do Modal */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowManageModal(false);
                  setManageNotice('');
                  setManageError('');
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors"
              >
                Fechar Painel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DE JUSTIFICATIVA OBRIGATÓRIA DE EXPULSÃO */}
      {memberToExpel && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          <div className="bg-slate-900 border border-red-500/40 p-5 sm:p-6 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-fade-in space-y-4">
            
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 bg-red-500/15 rounded-xl border border-red-500/30">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Expulsar Membro</h3>
                <p className="text-slate-400 text-xs">Ação permanente com auditoria</p>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Você está prestes a remover <strong className="text-white">{memberToExpel.name || memberToExpel.username}</strong> (@{memberToExpel.username}) da guilda <strong>{activeGuild.title}</strong>.
            </p>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-200 leading-relaxed">
              ⚠️ <strong>Auditoria Obrigatória:</strong> A justificativa fornecida ficará permanentemente registrada no log da guilda e poderá ser revisada pelos administradores gerais da plataforma caso haja suspeita de abuso ou conduta injusta.
            </div>

            <form onSubmit={handleConfirmExpel} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Motivo da Expulsão * (Mínimo de 5 caracteres)
                </label>
                <textarea
                  required
                  rows={3}
                  value={expulsionReason}
                  onChange={(e) => setExpulsionReason(e.target.value)}
                  placeholder="Ex: Mensagens ofensivas no chat e ausência recorrente nos estudos..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs focus:border-red-400 outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMemberToExpel(null);
                    setExpulsionReason('');
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={expellingLoading || expulsionReason.trim().length < 5}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {expellingLoading ? <Loader2 size={14} className="animate-spin" /> : <UserX size={14} />}
                  Confirmar Expulsão
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Guildas;
