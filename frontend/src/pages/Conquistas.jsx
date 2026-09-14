import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function Conquistas() {
  const { currentUser } = useAuth();
  
  // Dados simulados
  const stats = [
    { label: 'Respostas no Fórum', value: 34, icon: '💬' },
    { label: 'Apostilas Criadas', value: 3, icon: '📄' },
    { label: 'Dias Seguidos (Ofensiva)', value: 12, icon: '🔥' },
    { label: 'Guildas Ativas', value: 2, icon: '👥' }
  ];

  const badges = [
    { id: 1, name: 'Monitor Iniciante', desc: 'Respondeu 10 dúvidas no fórum.', icon: '🎓', unlocked: true, color: 'from-blue-400 to-blue-600' },
    { id: 2, name: 'Escritor Notável', desc: 'Criou 3 apostilas bem avaliadas.', icon: '✍️', unlocked: true, color: 'from-purple-400 to-purple-600' },
    { id: 3, name: 'Líder de Guilda', desc: 'Fundou e liderou uma guilda.', icon: '👑', unlocked: true, color: 'from-amber-400 to-amber-600' },
    { id: 4, name: 'Sábio do Código', desc: 'Obteve 100 upvotes em respostas de algoritmos.', icon: '💡', unlocked: false, color: 'from-slate-600 to-slate-700' },
    { id: 5, name: 'Mestre da Consistência', desc: 'Estudou 30 dias seguidos.', icon: '🔥', unlocked: false, color: 'from-slate-600 to-slate-700' },
    { id: 6, name: 'Defensor do TCC', desc: 'Ajudou em 5 bancas de TCC.', icon: '🛡️', unlocked: false, color: 'from-slate-600 to-slate-700' },
  ];

  return (
    <div className="bg-darker p-6 md:p-8 rounded-xl border border-slate-700 shadow-xl animate-fade-in relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 blur-3xl rounded-full pointer-events-none"></div>

      {/* Header do Perfil e Progresso */}
      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg">
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-700" />
            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="351.85" strokeDashoffset="150" className="text-primary transition-all duration-1000 ease-out" />
          </svg>
          <img src={currentUser?.avatar} alt={currentUser?.name} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-4 border-darker" />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl font-black text-white mb-2">{currentUser?.name}</h2>
          <p className="text-primary font-bold tracking-wider uppercase text-sm mb-4">Desenvolvedor Frontend • Nível {currentUser?.level}</p>
          
          <div className="bg-darker rounded-lg p-4 inline-block w-full max-w-md border border-slate-700">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400 font-semibold">Progresso para o Nível {currentUser?.level + 1}</span>
              <span className="text-primary font-bold">1250 / 2000 XP</span>
            </div>
            <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full" style={{ width: '62%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Estatísticas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 relative z-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col items-center justify-center text-center hover:border-primary transition-colors">
            <span className="text-3xl mb-2">{stat.icon}</span>
            <span className="text-3xl font-black text-white mb-1">{stat.value}</span>
            <span className="text-xs text-slate-400 font-semibold uppercase">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Painel de Medalhas / Badges */}
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          🏆 Quadro de Conquistas
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map(badge => (
            <div key={badge.id} className={`p-4 rounded-xl border flex items-center gap-4 transition-all duration-300 ${badge.unlocked ? 'bg-slate-800 border-slate-600 hover:border-primary shadow-lg' : 'bg-darker/50 border-slate-800 opacity-60 grayscale'}`}>
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-2xl shadow-inner border border-white/20`}>
                {badge.icon}
              </div>
              <div className="flex-1">
                <h4 className={`font-bold ${badge.unlocked ? 'text-white' : 'text-slate-500'}`}>{badge.name}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-tight">{badge.desc}</p>
              </div>
              {!badge.unlocked && (
                <div className="text-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Conquistas;
