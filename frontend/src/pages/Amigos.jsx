import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { 
  Users, UserPlus, UserCheck, UserMinus, Search, MessageCircle, 
  Send, Check, X, Clock, Award, Shield, GraduationCap, Loader2, 
  Sparkles, AlertCircle, CheckCircle2, ChevronRight, UserX
} from 'lucide-react';

function Amigos({ onOpenChat }) {
  const { currentUser, updateCurrentUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState('friends'); // 'friends', 'requests', 'search'
  const [friends, setFriends] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  
  const [notice, setNotice] = useState('');
  const [errorNotice, setErrorNotice] = useState('');

  // 1. Carregar Amigos Confirmados
  const loadFriends = async () => {
    setLoadingFriends(true);
    try {
      const res = await api.get('/accounts/friendships/friends/');
      setFriends(res.data || []);
    } catch (err) {
      console.error('Erro ao carregar lista de amigos:', err);
    } finally {
      setLoadingFriends(false);
    }
  };

  // 2. Carregar Solicitações Pendentes (Recebidas e Enviadas)
  const loadRequests = async () => {
    setLoadingRequests(true);
    try {
      const res = await api.get('/accounts/friendships/requests/');
      setIncomingRequests(res.data.incoming || []);
      setOutgoingRequests(res.data.outgoing || []);
    } catch (err) {
      console.error('Erro ao carregar solicitações:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  // 3. Buscar Universitários
  const handleSearch = async (queryToSearch) => {
    setLoadingSearch(true);
    try {
      const q = queryToSearch !== undefined ? queryToSearch : searchQuery;
      const res = await api.get(`/accounts/friendships/search/?q=${encodeURIComponent(q.trim())}`);
      setSearchResults(res.data || []);
    } catch (err) {
      console.error('Erro ao buscar universitários:', err);
    } finally {
      setLoadingSearch(false);
    }
  };

  // Inicialização
  useEffect(() => {
    loadFriends();
    loadRequests();
    handleSearch('');
  }, []);

  // Notificação temporária
  const showNotice = (msg, isError = false) => {
    if (isError) {
      setErrorNotice(msg);
      setNotice('');
    } else {
      setNotice(msg);
      setErrorNotice('');
    }
    setTimeout(() => {
      setNotice('');
      setErrorNotice('');
    }, 4500);
  };

  // 4. Enviar Solicitação de Amizade
  const handleSendRequest = async (userId, username) => {
    setActionLoadingId(`send-${userId}`);
    try {
      const res = await api.post('/accounts/friendships/send_request/', { user_id: userId });
      showNotice(res.data.message || `Solicitação enviada para @${username}!`);
      
      // Atualiza resultados de busca
      setSearchResults(prev => prev.map(u => {
        if (u.id === userId) {
          return { ...u, friendship_status: 'PENDING_SENT', friendship_id: res.data.friendship?.id };
        }
        return u;
      }));

      loadRequests();
      loadFriends();
    } catch (err) {
      showNotice(err.response?.data?.error || 'Erro ao enviar solicitação de amizade.', true);
    } finally {
      setActionLoadingId(null);
    }
  };

  // 5. Aceitar Solicitação de Amizade
  const handleAcceptRequest = async (friendshipId, friendName) => {
    setActionLoadingId(`accept-${friendshipId}`);
    try {
      const res = await api.post(`/accounts/friendships/${friendshipId}/accept/`);
      showNotice(res.data.message || `Amizade com ${friendName} confirmada! +10 XP`);
      
      // Concede +10 XP no estado do usuário localmente
      if (currentUser && updateCurrentUser) {
        updateCurrentUser({ ...currentUser, xp: (currentUser.xp || 0) + 10 });
      }

      loadFriends();
      loadRequests();
      handleSearch(searchQuery);
    } catch (err) {
      showNotice(err.response?.data?.error || 'Erro ao aceitar solicitação.', true);
    } finally {
      setActionLoadingId(null);
    }
  };

  // 6. Recusar ou Cancelar Solicitação
  const handleRejectOrCancel = async (friendshipId, isCancel = false) => {
    setActionLoadingId(`reject-${friendshipId}`);
    try {
      await api.post(`/accounts/friendships/${friendshipId}/reject/`);
      showNotice(isCancel ? 'Solicitação cancelada.' : 'Solicitação recusada.');
      loadRequests();
      handleSearch(searchQuery);
    } catch (err) {
      showNotice(err.response?.data?.error || 'Erro ao processar ação.', true);
    } finally {
      setActionLoadingId(null);
    }
  };

  // 7. Desfazer Amizade (Remover Amigo)
  const handleRemoveFriend = async (friendshipId, friendName) => {
    if (!window.confirm(`Tem certeza de que deseja desfazer a amizade com ${friendName}?`)) {
      return;
    }

    setActionLoadingId(`remove-${friendshipId}`);
    try {
      await api.delete(`/accounts/friendships/${friendshipId}/`);
      showNotice(`Amizade com ${friendName} desfeita.`);
      setFriends(prev => prev.filter(f => f.id !== friendshipId));
      loadRequests();
      handleSearch(searchQuery);
    } catch (err) {
      showNotice(err.response?.data?.error || 'Erro ao desfazer amizade.', true);
    } finally {
      setActionLoadingId(null);
    }
  };

  const pendingCount = incomingRequests.length;

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-6xl mx-auto">
      
      {/* CABEÇALHO */}
      <div className="bg-gradient-to-r from-slate-900 via-[#1e1b4b] to-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-primary/10 blur-3xl pointer-events-none rounded-full" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-primary/20 text-primary border border-primary/30 rounded-2xl shadow-inner">
              <Users size={28} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                Rede de Amigos & Parcerias de Estudo
              </h2>
              <p className="text-slate-400 text-xs md:text-sm mt-0.5">
                Conecte-se com colegas universitários, forme duplas de estudo e ganhe +10 XP por nova amizade!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="bg-slate-800/80 border border-slate-700/80 px-3.5 py-2 rounded-xl text-center">
              <div className="text-base md:text-lg font-black text-white">{friends.length}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Amigos</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/80 px-3.5 py-2 rounded-xl text-center">
              <div className="text-base md:text-lg font-black text-amber-400">{pendingCount}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pendentes</div>
            </div>
          </div>
        </div>

        {/* NOTIFICAÇÃO TOAST FEEDBACK */}
        {notice && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{notice}</span>
          </div>
        )}
        {errorNotice && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 animate-fade-in">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorNotice}</span>
          </div>
        )}
      </div>

      {/* ABAS DE NAVEGAÇÃO */}
      <div className="flex border-b border-slate-800 bg-[#0f172a] rounded-xl p-1 gap-1">
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'friends'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <UserCheck size={16} />
          <span>Meus Amigos ({friends.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('requests');
            loadRequests();
          }}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all relative ${
            activeTab === 'requests'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Clock size={16} />
          <span>Solicitações</span>
          {pendingCount > 0 && (
            <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full animate-pulse ml-1">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('search');
            handleSearch(searchQuery);
          }}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'search'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <UserPlus size={16} />
          <span>Encontrar Universitários</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* ABA 1: MEUS AMIGOS */}
      {/* ========================================================= */}
      {activeTab === 'friends' && (
        <div className="space-y-4">
          {loadingFriends ? (
            <div className="py-16 text-center text-slate-400 flex items-center justify-center gap-2 text-sm">
              <Loader2 size={20} className="animate-spin text-primary" />
              <span>Carregando sua lista de amigos...</span>
            </div>
          ) : friends.length === 0 ? (
            <div className="bg-[#1e293b]/70 border border-slate-800 rounded-2xl p-10 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Users size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Nenhum amigo adicionado ainda</h3>
                <p className="text-slate-400 text-xs md:text-sm max-w-md mx-auto mt-1">
                  Encontre seus colegas de curso na plataforma para trocar ideias, tirar dúvidas e estudar juntos em salas privadas.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('search')}
                className="bg-primary hover:bg-primary/90 text-white font-bold px-5 py-2.5 rounded-xl text-xs md:text-sm transition-all shadow-lg shadow-primary/20 inline-flex items-center gap-2"
              >
                <UserPlus size={16} /> Encontrar Universitários Agora
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map(friendship => {
                const friend = friendship.friend || {};
                const isActionLoading = actionLoadingId === `remove-${friendship.id}`;

                return (
                  <div 
                    key={friendship.id}
                    className="bg-[#1e293b] border border-slate-700/80 hover:border-slate-600 rounded-2xl p-4 shadow-lg transition-all flex flex-col justify-between gap-4 group"
                  >
                    <div className="flex items-start gap-3.5">
                      <img 
                        src={friend.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${friend.username}`}
                        alt={friend.name || friend.username}
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary/40 shrink-0 bg-slate-900"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm truncate">
                            {friend.name || friend.username}
                          </h4>
                          {friend.role === 'ADMIN' && (
                            <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0">
                              Admin
                            </span>
                          )}
                          {friend.role === 'PROFESSOR' && (
                            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0">
                              Docente
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-400 mt-0.5 truncate">
                          @{friend.username}
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2">
                          <span className="bg-slate-800 px-2 py-0.5 rounded font-medium text-primary">
                            Nível {friend.level || 1}
                          </span>
                          <span>•</span>
                          <span>{friend.xp || 0} XP</span>
                          {friend.course && (
                            <>
                              <span>•</span>
                              <span className="truncate max-w-[100px]">{friend.course}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => {
                          if (onOpenChat) {
                            onOpenChat(friend);
                          } else {
                            showNotice(`Chat com @${friend.username} disponível na próxima etapa de estudos!`);
                          }
                        }}
                        className="flex-1 bg-primary/20 hover:bg-primary text-primary hover:text-white font-bold py-2 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 border border-primary/30"
                        title="Iniciar Mensagem Privada / Estudo Individual"
                      >
                        <MessageCircle size={14} />
                        <span>Mensagem Privada</span>
                      </button>

                      <button
                        disabled={isActionLoading}
                        onClick={() => handleRemoveFriend(friendship.id, friend.name || friend.username)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors shrink-0"
                        title="Desfazer Amizade"
                      >
                        {isActionLoading ? <Loader2 size={16} className="animate-spin text-red-400" /> : <UserMinus size={16} />}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* ABA 2: SOLICITAÇÕES PENDENTES */}
      {/* ========================================================= */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          {loadingRequests ? (
            <div className="py-16 text-center text-slate-400 flex items-center justify-center gap-2 text-sm">
              <Loader2 size={20} className="animate-spin text-primary" />
              <span>Carregando solicitações...</span>
            </div>
          ) : (
            <>
              {/* Solicitações Recebidas */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <UserPlus size={16} className="text-amber-400" />
                    Solicitações Recebidas ({incomingRequests.length})
                  </h3>
                  {incomingRequests.length > 0 && (
                    <span className="text-[11px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      Ganhe +10 XP ao aceitar
                    </span>
                  )}
                </div>

                {incomingRequests.length === 0 ? (
                  <div className="bg-[#1e293b]/60 border border-slate-800 rounded-xl p-6 text-center text-slate-400 text-xs">
                    Nenhuma solicitação de amizade pendente no momento.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {incomingRequests.map(req => {
                      const requester = req.requester_details || {};
                      const isAccepting = actionLoadingId === `accept-${req.id}`;
                      const isRejecting = actionLoadingId === `reject-${req.id}`;

                      return (
                        <div 
                          key={req.id}
                          className="bg-[#1e293b] border border-amber-500/30 rounded-2xl p-4 shadow-lg flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img 
                              src={requester.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${requester.username}`}
                              alt={requester.name || requester.username}
                              className="w-11 h-11 rounded-full object-cover border border-amber-400/40 shrink-0 bg-slate-900"
                            />
                            <div className="min-w-0">
                              <h4 className="font-bold text-white text-sm truncate">
                                {requester.name || requester.username}
                              </h4>
                              <div className="text-[11px] text-slate-400">
                                @{requester.username} • Nível {requester.level || 1}
                              </div>
                              {requester.course && (
                                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                                  {requester.course}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              disabled={isAccepting || isRejecting}
                              onClick={() => handleAcceptRequest(req.id, requester.name || requester.username)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-2 rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1 disabled:opacity-50"
                              title="Aceitar Amizade (+10 XP)"
                            >
                              {isAccepting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                              <span>Aceitar</span>
                            </button>

                            <button
                              disabled={isAccepting || isRejecting}
                              onClick={() => handleRejectOrCancel(req.id, false)}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 p-2 rounded-xl text-xs transition-colors"
                              title="Recusar"
                            >
                              {isRejecting ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Solicitações Enviadas */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Send size={15} className="text-slate-400" />
                  Solicitações Enviadas por Você ({outgoingRequests.length})
                </h3>

                {outgoingRequests.length === 0 ? (
                  <div className="bg-[#1e293b]/40 border border-slate-800 rounded-xl p-4 text-center text-slate-500 text-xs">
                    Você não tem convites de amizade aguardando resposta.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {outgoingRequests.map(req => {
                      const receiver = req.receiver_details || {};
                      const isCanceling = actionLoadingId === `reject-${req.id}`;

                      return (
                        <div 
                          key={req.id}
                          className="bg-[#1e293b]/70 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img 
                              src={receiver.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${receiver.username}`}
                              alt={receiver.name || receiver.username}
                              className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0 bg-slate-900"
                            />
                            <div className="min-w-0">
                              <h4 className="font-bold text-white text-sm truncate">
                                {receiver.name || receiver.username}
                              </h4>
                              <div className="text-[11px] text-slate-400">
                                @{receiver.username} • Aguardando resposta...
                              </div>
                            </div>
                          </div>

                          <button
                            disabled={isCanceling}
                            onClick={() => handleRejectOrCancel(req.id, true)}
                            className="text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors"
                          >
                            {isCanceling ? <Loader2 size={13} className="animate-spin inline" /> : 'Cancelar'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* ABA 3: ENCONTRAR UNIVERSITÁRIOS */}
      {/* ========================================================= */}
      {activeTab === 'search' && (
        <div className="space-y-5">
          {/* Barra de Busca Instantânea */}
          <div className="p-4 bg-[#1e293b] border border-slate-700/80 rounded-2xl shadow-lg">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch(searchQuery);
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  placeholder="Pesquise por @username, nome, curso ou e-mail..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:border-primary outline-none placeholder-slate-500"
                />
              </div>

              <button
                type="submit"
                disabled={loadingSearch}
                className="bg-primary hover:bg-primary/90 text-white font-bold px-5 py-2.5 rounded-xl text-xs md:text-sm transition-all shadow-md shadow-primary/20 flex items-center gap-1.5 shrink-0"
              >
                {loadingSearch ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                <span className="hidden sm:inline">Buscar</span>
              </button>
            </form>
            <div className="text-[11px] text-slate-400 mt-2 px-1">
              💡 Dica: Digite o nome do curso (ex: Ciência de Dados, Engenharia, Pedagogia) para encontrar colegas de graduação!
            </div>
          </div>

          {/* Resultados de Busca */}
          {loadingSearch ? (
            <div className="py-16 text-center text-slate-400 flex items-center justify-center gap-2 text-sm">
              <Loader2 size={20} className="animate-spin text-primary" />
              <span>Procurando universitários...</span>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="bg-[#1e293b]/60 border border-slate-800 rounded-2xl p-10 text-center text-slate-400 text-sm">
              Nenhum universitário encontrado para "{searchQuery}". Tente outro termo de busca!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map(user => {
                const status = user.friendship_status; // 'NONE', 'FRIENDS', 'PENDING_SENT', 'PENDING_RECEIVED'
                const isSending = actionLoadingId === `send-${user.id}`;
                const isAccepting = actionLoadingId === `accept-${user.friendship_id}`;

                return (
                  <div 
                    key={user.id}
                    className="bg-[#1e293b] border border-slate-700/80 rounded-2xl p-4 shadow-lg flex flex-col justify-between gap-3 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <img 
                        src={user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`}
                        alt={user.name || user.username}
                        className="w-12 h-12 rounded-full object-cover border border-slate-700 shrink-0 bg-slate-900"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-white text-sm truncate">
                            {user.name || user.username}
                          </h4>
                          {user.role === 'ADMIN' && (
                            <span className="bg-red-500/20 text-red-300 text-[9px] font-bold px-1.5 py-0.2 rounded">
                              Admin
                            </span>
                          )}
                          {user.role === 'PROFESSOR' && (
                            <span className="bg-indigo-500/20 text-indigo-300 text-[9px] font-bold px-1.5 py-0.2 rounded">
                              Docente
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 truncate">
                          @{user.username}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                          <span className="bg-slate-800 px-1.5 py-0.5 rounded font-medium text-primary">
                            Nível {user.level || 1}
                          </span>
                          <span>•</span>
                          <span>{user.xp || 0} XP</span>
                        </div>
                        {user.course && (
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-1 truncate">
                            <GraduationCap size={13} className="text-slate-500 shrink-0" />
                            <span className="truncate">{user.course}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="pt-2 border-t border-slate-800">
                      {status === 'FRIENDS' && (
                        <div className="w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5">
                          <CheckCircle2 size={15} /> Vocês já são amigos
                        </div>
                      )}

                      {status === 'PENDING_SENT' && (
                        <div className="w-full bg-slate-800/80 border border-slate-700 text-slate-400 text-xs font-medium py-2 rounded-xl flex items-center justify-center gap-1.5">
                          <Clock size={14} className="text-amber-400" /> Solicitação enviada
                        </div>
                      )}

                      {status === 'PENDING_RECEIVED' && (
                        <button
                          disabled={isAccepting}
                          onClick={() => handleAcceptRequest(user.friendship_id, user.name || user.username)}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          {isAccepting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                          <span>Aceitar Solicitação (+10 XP)</span>
                        </button>
                      )}

                      {status === 'NONE' && (
                        <button
                          disabled={isSending}
                          onClick={() => handleSendRequest(user.id, user.username)}
                          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 rounded-xl text-xs transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          {isSending ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                          <span>Adicionar Amigo (+10 XP)</span>
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default Amigos;
