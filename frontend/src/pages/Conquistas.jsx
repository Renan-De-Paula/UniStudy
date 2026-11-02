import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getLeaderboard, getMyBadges, getStoreItems, buyItem, toggleEquipItem } from '../services/gamificationService';
import { Award, ShoppingBag, Trophy, CheckCircle, Sparkles, Check, Loader2 } from 'lucide-react';
import AvatarWithFrame from '../components/AvatarWithFrame';
import { getThemeConfig } from '../utils/customizationStyles';

function Conquistas() {
  const { currentUser, updateCurrentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('badges'); // badges, leaderboard, store
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [storeItems, setStoreItems] = useState([]);
  const [loadingActionId, setLoadingActionId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [badgesData, leaderboardData, storeData] = await Promise.all([
          getMyBadges(),
          getLeaderboard(),
          getStoreItems()
        ]);
        setBadges(badgesData || []);
        setLeaderboard(leaderboardData || []);
        setStoreItems(storeData || []);
      } catch (error) {
        console.error("Erro ao buscar dados de gamificação", error);
      }
    };
    fetchData();
  }, []);

  const handleBuy = async (item) => {
    if ((currentUser?.xp || 0) < item.cost_xp) {
      alert(`Você precisa de mais ${item.cost_xp - (currentUser?.xp || 0)} XP para adquirir "${item.name}". Complete quizzes para ganhar mais XP!`);
      return;
    }

    try {
      setLoadingActionId(item.id);
      await buyItem(item.id);
      alert(`🎉 Parabéns! Você adquiriu "${item.name}". O item já está ativo na sua conta!`);
      
      if (updateCurrentUser) {
        updateCurrentUser({ xp: Math.max(0, (currentUser?.xp || 0) - item.cost_xp) });
      }

      setStoreItems(prev => prev.map(it => it.id === item.id ? { ...it, purchased: true, is_active: true } : it));
    } catch (error) {
      alert(error.response?.data?.error || "Erro ao comprar item.");
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleToggleEquip = async (item) => {
    try {
      setLoadingActionId(item.id);
      const res = await toggleEquipItem(item.id);
      setStoreItems(prev => prev.map(it => {
        if (it.id === item.id) return { ...it, is_active: res.is_active };
        if (it.item_type === item.item_type && res.is_active) return { ...it, is_active: false };
        return it;
      }));
      if (updateCurrentUser && res.equipped_items) {
        updateCurrentUser({ equipped_items: res.equipped_items });
      }
    } catch (error) {
      alert(error.response?.data?.error || "Erro ao alternar personalização.");
    } finally {
      setLoadingActionId(null);
    }
  };

  return (
    <div className="bg-darker p-3 sm:p-6 md:p-8 rounded-xl border border-slate-700 shadow-xl animate-fade-in relative overflow-hidden">
      {/* Header do Perfil e Progresso */}
      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 mb-6 bg-slate-800 p-4 sm:p-6 rounded-2xl border border-slate-700 shadow-lg">
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-black text-white">{currentUser?.first_name ? `${currentUser.first_name} ${currentUser.last_name || ''}`.trim() : currentUser?.username}</h2>
            {Boolean(currentUser?.role === 'PROFESSOR') && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                🎓 Professor Verificado
              </span>
            )}
            {Boolean(currentUser?.role === 'ADMIN' || currentUser?.is_staff) && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                🛡️ Administrador
              </span>
            )}
          </div>
          <p className="text-primary font-bold tracking-wider uppercase text-xs sm:text-sm mb-4">Nível {Math.floor((currentUser?.xp || 0) / 100) + 1}</p>
          
          <div className="bg-darker rounded-xl p-3 sm:p-4 inline-block w-full max-w-md border border-slate-700 shadow-inner">
            <div className="flex justify-between text-xs sm:text-sm mb-2">
              <span className="text-slate-400 font-semibold">Saldo Atual de XP</span>
              <span className="text-primary font-bold">{currentUser?.xp || 0} XP</span>
            </div>
            <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (currentUser?.xp % 100))}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-slate-700 pb-2 overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveTab('badges')} className={`pb-2 font-bold text-sm whitespace-nowrap flex items-center gap-1.5 transition-colors ${activeTab === 'badges' ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-white'}`}>
          <Award size={16} /> Meus Selos ({badges.length})
        </button>
        <button onClick={() => setActiveTab('leaderboard')} className={`pb-2 font-bold text-sm whitespace-nowrap flex items-center gap-1.5 transition-colors ${activeTab === 'leaderboard' ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-white'}`}>
          <Trophy size={16} /> Ranking Global
        </button>
        <button onClick={() => setActiveTab('store')} className={`pb-2 font-bold text-sm whitespace-nowrap flex items-center gap-1.5 transition-colors ${activeTab === 'store' ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-white'}`}>
          <ShoppingBag size={16} /> Loja de XP & Personalização
        </button>
      </div>

      {/* Badges Tab */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 bg-slate-800/40 rounded-2xl border border-slate-700">
              <Award size={36} className="mx-auto text-slate-500 mb-2" />
              <p className="font-bold text-white">Nenhum selo conquistado ainda</p>
              <p className="text-xs text-slate-400 mt-1">Conclua trilhas e responda quizzes para desbloquear suas conquistas!</p>
            </div>
          ) : badges.map(ub => {
            const tier = ub.badge?.badge_tier;
            const badgeBg = tier === 'OURO'
              ? 'bg-gradient-to-br from-yellow-400 to-amber-600 border-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.4)]'
              : tier === 'PRATA'
                ? 'bg-gradient-to-br from-slate-200 to-slate-400 border-white text-slate-900 shadow-[0_0_15px_rgba(203,213,225,0.3)]'
                : tier === 'BRONZE'
                  ? 'bg-gradient-to-br from-amber-600 to-orange-800 border-amber-400 shadow-[0_0_15px_rgba(217,119,6,0.3)]'
                  : 'bg-gradient-to-br from-blue-400 to-blue-600 border-white/20';

            return (
              <div key={ub.id} className="p-4 rounded-xl bg-slate-800 border border-slate-600 flex items-center gap-4 hover:border-primary/50 transition-all">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-inner border shrink-0 ${badgeBg}`}>
                  {ub.badge.icon_url ? <img src={ub.badge.icon_url} alt="icon" className="w-8 h-8"/> : (ub.badge.icon_emoji || '⭐')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-white truncate text-sm sm:text-base">{ub.badge.name}</h4>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{ub.badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-3">
          {leaderboard.map((user, index) => (
            <div key={user.id} className="flex justify-between items-center bg-slate-800 p-3.5 sm:p-4 rounded-xl border border-slate-700">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <span className={`text-xl sm:text-2xl font-black w-7 sm:w-8 text-center shrink-0 ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-600' : 'text-slate-500'}`}>#{index + 1}</span>
                <AvatarWithFrame 
                  src={user.avatar} 
                  size="sm" 
                  frame={user.equipped_frame} 
                  badge={user.equipped_badge} 
                  showBadge={true} 
                />
                <div className="min-w-0">
                  <span className="font-bold text-white truncate block flex items-center gap-1.5 text-xs sm:text-sm">
                    <span>{user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.username}</span>
                    {user.equipped_badge && <span className="text-xs" title={user.equipped_badge.name}>{user.equipped_badge.asset_url || '⭐'}</span>}
                  </span>
                  {user.course && <p className="text-[11px] text-slate-400 truncate">{user.course}</p>}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-primary font-bold text-sm sm:text-base">{user.xp} XP</p>
                <p className="text-xs text-slate-400">Nível {user.level}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Store Tab */}
      {activeTab === 'store' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {storeItems.map(item => {
            const isAffordable = (currentUser?.xp || 0) >= item.cost_xp;
            const isLoading = loadingActionId === item.id;

            return (
              <div key={item.id} className="p-5 sm:p-6 rounded-2xl bg-slate-800 border border-slate-700 flex flex-col justify-between text-center gap-4 hover:border-primary/50 transition-all shadow-md">
                <div>
                  {item.item_type === 'AVATAR_FRAME' ? (
                    <div className="flex justify-center mb-3">
                      <AvatarWithFrame 
                        src="https://api.dicebear.com/7.x/adventurer/svg?seed=Felix" 
                        size="lg" 
                        frame={item} 
                      />
                    </div>
                  ) : item.item_type === 'THEME_COLOR' ? (
                    <div className="mx-auto w-full max-w-[140px] h-12 rounded-xl overflow-hidden mb-3 p-0.5 border border-slate-600/60 shadow-md">
                      <div 
                        className={`w-full h-full rounded-[10px] flex items-center justify-center gap-1.5 ${getThemeConfig(item)?.className || ''}`}
                        style={getThemeConfig(item)?.gradient ? { background: getThemeConfig(item).gradient } : {}}
                      >
                        <span className="text-sm">{getThemeConfig(item)?.icon || '🎨'}</span>
                        <span className="text-[11px] font-bold text-white drop-shadow">Tema</span>
                      </div>
                    </div>
                  ) : item.item_type === 'PROFILE_BADGE' ? (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-400/40 text-amber-300 mx-auto flex items-center justify-center font-bold text-2xl mb-3 shadow-inner">
                      {item.asset_url || '⭐'}
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary mx-auto flex items-center justify-center font-bold text-xl mb-3 shadow-inner">
                      📚
                    </div>
                  )}
                  <h4 className="font-bold text-white text-base sm:text-lg">{item.name}</h4>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1.5 min-h-[38px]">{item.description}</p>
                  
                  <div className="mt-3 inline-block bg-darker px-3.5 py-1.5 rounded-full border border-slate-700 text-xs font-bold text-accent">
                    {item.cost_xp} XP
                  </div>
                </div>

                {item.purchased ? (
                  item.item_type === 'PREMIUM_CONTENT' ? (
                    <div className="w-full mt-2 py-2.5 rounded-xl bg-emerald-600/20 text-emerald-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 border border-emerald-500/40 shadow-sm">
                      <CheckCircle size={16} /> Conteúdo Desbloqueado
                    </div>
                  ) : item.is_active ? (
                    <button 
                      onClick={() => handleToggleEquip(item)}
                      disabled={isLoading}
                      className="w-full mt-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                      title="Clique para desativar este item do seu perfil"
                    >
                      {isLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                      Em Uso (Equipado)
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleToggleEquip(item)}
                      disabled={isLoading}
                      className="w-full mt-2 py-2.5 rounded-xl bg-slate-700/80 hover:bg-primary text-slate-200 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 border border-slate-600 active:scale-95 transition-all"
                      title="Clique para ativar este item no seu perfil"
                    >
                      {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} className="text-amber-400" />}
                      Adquirido • Equipar
                    </button>
                  )
                ) : (
                  <button 
                    onClick={() => handleBuy(item)}
                    disabled={!isAffordable || isLoading}
                    className={`w-full mt-2 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                      isAffordable 
                        ? 'bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/25' 
                        : 'bg-slate-700/40 text-slate-500 border border-slate-700/50 cursor-not-allowed'
                    }`}
                  >
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                    {isAffordable ? 'Comprar com XP' : `XP Insuficiente (${item.cost_xp} XP)`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default Conquistas;
