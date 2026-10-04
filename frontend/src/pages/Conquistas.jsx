import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getLeaderboard, getMyBadges, getStoreItems, buyItem } from '../services/gamificationService';

function Conquistas() {
  const { currentUser, setCurrentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('badges'); // badges, leaderboard, store
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [storeItems, setStoreItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [badgesData, leaderboardData, storeData] = await Promise.all([
          getMyBadges(),
          getLeaderboard(),
          getStoreItems()
        ]);
        setBadges(badgesData);
        setLeaderboard(leaderboardData);
        setStoreItems(storeData);
      } catch (error) {
        console.error("Erro ao buscar dados de gamificação", error);
      }
    };
    fetchData();
  }, []);

  const handleBuy = async (item) => {
    try {
      await buyItem(item.id);
      alert(`Você comprou ${item.name}!`);
      if (setCurrentUser) {
          setCurrentUser(prev => ({...prev, xp: prev.xp - item.cost_xp}));
      }
    } catch (error) {
      alert(error.response?.data?.error || "Erro ao comprar item.");
    }
  };

  return (
    <div className="bg-darker p-6 md:p-8 rounded-xl border border-slate-700 shadow-xl animate-fade-in relative overflow-hidden">
      {/* Header do Perfil e Progresso */}
      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 mb-8 bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl font-black text-white mb-2">{currentUser?.first_name || currentUser?.username || 'Usuário'}</h2>
          <p className="text-primary font-bold tracking-wider uppercase text-sm mb-4">Nível {Math.floor((currentUser?.xp || 0) / 100) + 1}</p>
          
          <div className="bg-darker rounded-lg p-4 inline-block w-full max-w-md border border-slate-700">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400 font-semibold">Seu XP</span>
              <span className="text-primary font-bold">{currentUser?.xp || 0} XP</span>
            </div>
            <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full" style={{ width: `${(currentUser?.xp % 100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-slate-700 pb-2">
        <button onClick={() => setActiveTab('badges')} className={`pb-2 font-bold ${activeTab === 'badges' ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-white'}`}>Meus Selos</button>
        <button onClick={() => setActiveTab('leaderboard')} className={`pb-2 font-bold ${activeTab === 'leaderboard' ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-white'}`}>Ranking Global</button>
        <button onClick={() => setActiveTab('store')} className={`pb-2 font-bold ${activeTab === 'store' ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-white'}`}>Loja de XP</button>
      </div>

      {/* Badges Tab */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.length === 0 ? <p className="text-slate-400">Você ainda não tem selos.</p> : badges.map(ub => (
            <div key={ub.id} className="p-4 rounded-xl bg-slate-800 border border-slate-600 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-2xl shadow-inner border border-white/20">
                {ub.badge.icon_url ? <img src={ub.badge.icon_url} alt="icon" className="w-8 h-8"/> : '⭐'}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white">{ub.badge.name}</h4>
                <p className="text-xs text-slate-400 mt-1">{ub.badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          {leaderboard.map((user, index) => (
            <div key={user.id} className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
              <div className="flex items-center gap-4">
                <span className={`text-2xl font-black ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-600' : 'text-slate-500'}`}>#{index + 1}</span>
                <span className="font-bold text-white">{user.username}</span>
              </div>
              <div className="text-right">
                <p className="text-primary font-bold">{user.xp} XP</p>
                <p className="text-xs text-slate-400">Nível {user.level}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Store Tab */}
      {activeTab === 'store' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {storeItems.map(item => (
            <div key={item.id} className="p-6 rounded-xl bg-slate-800 border border-slate-700 flex flex-col justify-between text-center gap-4 hover:border-primary transition-colors">
              <div>
                <h4 className="font-bold text-white text-lg">{item.name}</h4>
                <p className="text-sm text-slate-400 mt-2">{item.description}</p>
                <div className="mt-4 inline-block bg-darker px-4 py-2 rounded-full border border-slate-700">
                  <span className="font-bold text-accent">{item.cost_xp} XP</span>
                </div>
              </div>
              <button 
                onClick={() => handleBuy(item)}
                className="w-full mt-4 py-3 rounded-lg bg-primary/20 text-primary font-bold hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1"
              >
                Comprar Item
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Conquistas;
