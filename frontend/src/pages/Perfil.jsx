import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, Mail, MapPin, Award, BookOpen, Star, Activity, 
  Settings, Camera, Shield, Zap, Target, Edit3
} from 'lucide-react';

function Perfil() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // overview, edit

  // Mock dados adicionais do usuário
  const userStats = {
    apostilasLidas: 12,
    apostilasCriadas: 4,
    duvidasResolvidas: 28,
    diasOfensiva: 14,
    title: 'Desenvolvedor Pleno',
    bio: 'Apaixonado por tecnologia e educação. Estudante de Engenharia de Software focando em ecossistema React e Node.js.',
    joinDate: 'Janeiro de 2026',
    location: 'São Paulo, Brasil'
  };

  const topBadges = [
    { id: 1, name: 'Fundador', icon: '👑', color: 'from-amber-400 to-orange-600', desc: 'Criou sua conta na primeira semana' },
    { id: 2, name: 'Mestre do Código', icon: '💻', color: 'from-blue-400 to-indigo-600', desc: 'Atingiu Nível 10 em Programação' },
    { id: 3, name: 'Tutor', icon: '🤝', color: 'from-emerald-400 to-teal-600', desc: 'Resolveu 20 dúvidas no fórum' },
  ];

  // Gerador de mock para o Gráfico do GitHub (Heatmap)
  const generateHeatmap = () => {
    const days = [];
    for (let i = 0; i < 90; i++) {
      // 0: sem atividade, 1-3: niveis de atividade
      const activityLevel = Math.random() > 0.6 ? Math.floor(Math.random() * 3) + 1 : 0; 
      days.push(activityLevel);
    }
    return days;
  };

  const [heatmap] = useState(generateHeatmap());

  return (
    <div className="bg-darker p-4 md:p-8 rounded-xl border border-slate-700 shadow-xl animate-fade-in relative overflow-hidden h-full overflow-y-auto">
      
      {/* CAPA (BANNER) */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-r from-primary/80 via-purple-600/80 to-accent/80 z-0 opacity-40 blur-xl"></div>
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-r from-primary via-purple-600 to-accent z-0 overflow-hidden">
        {/* Padrão de overlay foda no banner */}
        <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
      </div>

      <div className="relative z-10 pt-16 md:pt-24 flex flex-col md:flex-row gap-6 items-end md:items-center">
        
        {/* AVATAR */}
        <div className="relative group">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-slate-900 bg-slate-800 overflow-hidden shadow-[0_0_30px_rgba(109,40,217,0.5)]">
            <img src={currentUser?.avatar || 'https://i.pravatar.cc/150'} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <button className="absolute bottom-2 right-2 p-2 bg-slate-800 border border-slate-600 rounded-full text-white hover:bg-primary transition-colors opacity-0 group-hover:opacity-100 shadow-lg">
            <Camera size={16} />
          </button>
        </div>

        {/* INFOS BÁSICAS */}
        <div className="flex-1 mb-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-md">{currentUser?.name || 'Aluno'}</h1>
            <span className="bg-white/20 border border-white/40 text-white font-bold text-xs px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-md drop-shadow-sm">
              <Shield size={12} /> Nível {currentUser?.level || 1}
            </span>
          </div>
          <p className="text-slate-300 font-medium text-lg mt-1">{userStats.title}</p>
          <div className="flex items-center gap-4 text-slate-400 text-sm mt-2 font-semibold">
            <span className="flex items-center gap-1"><MapPin size={14}/> {userStats.location}</span>
            <span className="flex items-center gap-1"><User size={14}/> Membro desde {userStats.joinDate}</span>
          </div>
        </div>

        {/* BOTÃO EDITAR */}
        <div className="w-full md:w-auto mt-4 md:mt-0">
          <button 
            onClick={() => setActiveTab(activeTab === 'overview' ? 'edit' : 'overview')}
            className="w-full md:w-auto bg-slate-800/80 backdrop-blur hover:bg-slate-700 text-white border border-slate-600 font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {activeTab === 'overview' ? <><Settings size={18} /> Editar Perfil</> : <><User size={18} /> Voltar ao Perfil</>}
          </button>
        </div>
      </div>

      <div className="mt-8 border-t border-slate-800 relative z-10 pt-8 flex flex-col lg:flex-row gap-8">
        
        {/* VISÃO GERAL */}
        {activeTab === 'overview' && (
          <>
            {/* COLUNA ESQUERDA (Bio, Stats) */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6">
              
              {/* Bio */}
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Sobre Mim</h3>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {userStats.bio}
                </p>
              </div>

              {/* Estatísticas Numéricas */}
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Estatísticas Vitais</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-slate-300"><BookOpen size={16} className="text-purple-400"/> Apostilas Lidas</div>
                    <div className="font-bold text-white bg-slate-700 px-2 py-0.5 rounded text-sm">{userStats.apostilasLidas}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-slate-300"><Edit3 size={16} className="text-blue-400"/> Materiais Criados</div>
                    <div className="font-bold text-white bg-slate-700 px-2 py-0.5 rounded text-sm">{userStats.apostilasCriadas}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-slate-300"><Target size={16} className="text-emerald-400"/> Dúvidas Resolvidas</div>
                    <div className="font-bold text-white bg-slate-700 px-2 py-0.5 rounded text-sm">{userStats.duvidasResolvidas}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-slate-300"><Zap size={16} className="text-amber-400"/> Dias em Ofensiva</div>
                    <div className="font-bold text-white bg-slate-700 px-2 py-0.5 rounded text-sm flex items-center gap-1">{userStats.diasOfensiva} <span className="text-amber-400">🔥</span></div>
                  </div>
                </div>
              </div>

            </div>

            {/* COLUNA DIREITA (Atividade, Badges) */}
            <div className="flex-1 flex flex-col gap-6">
              
              {/* Gráfico de Atividade Estilo GitHub */}
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Activity size={16} /> Mapa de Estudos (Últimos 90 dias)
                  </h3>
                  <span className="text-xs text-slate-500 font-bold">{currentUser?.xp || 0} XP Acumulado</span>
                </div>
                
                <div className="flex flex-wrap gap-1.5 justify-start">
                  {heatmap.map((level, idx) => {
                    let colorClass = 'bg-slate-700'; // Nível 0
                    if (level === 1) colorClass = 'bg-primary/40';
                    if (level === 2) colorClass = 'bg-primary/70';
                    if (level === 3) colorClass = 'bg-primary shadow-[0_0_8px_rgba(109,40,217,0.6)]';
                    
                    return (
                      <div 
                        key={idx} 
                        className={`w-3.5 h-3.5 rounded-sm ${colorClass} transition-colors hover:ring-2 ring-white cursor-pointer`}
                        title={`${level > 0 ? 'Estudou' : 'Sem atividade'} neste dia`}
                      ></div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-end gap-2 text-xs font-semibold text-slate-400 mt-4">
                  <span>Menos</span>
                  <div className="w-3 h-3 rounded-sm bg-slate-700"></div>
                  <div className="w-3 h-3 rounded-sm bg-primary/40"></div>
                  <div className="w-3 h-3 rounded-sm bg-primary/70"></div>
                  <div className="w-3 h-3 rounded-sm bg-primary"></div>
                  <span>Mais</span>
                </div>
              </div>

              {/* Conquistas (Badges) em Destaque */}
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Award size={16} /> Conquistas em Destaque
                  </h3>
                  <button onClick={() => setActiveTab('badges')} className="text-primary text-xs font-bold hover:underline">Ver todas</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {topBadges.map(badge => (
                    <div key={badge.id} className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex flex-col items-center text-center hover:border-slate-500 transition-all group">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-3xl mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                        {badge.icon}
                      </div>
                      <h4 className="text-white font-bold mb-1">{badge.name}</h4>
                      <p className="text-xs text-slate-400 leading-tight">{badge.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </>
        )}

        {/* MODO EDIÇÃO */}
        {activeTab === 'edit' && (
          <div className="w-full bg-slate-800/50 p-6 md:p-8 rounded-xl border border-slate-700/50 max-w-3xl mx-auto">
            <h2 className="text-2xl font-black text-white mb-6 border-b border-slate-700 pb-4">Configurações do Perfil</h2>
            
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setActiveTab('overview'); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nome de Exibição</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-primary outline-none" defaultValue={currentUser?.name || ''} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Título de Perfil</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-primary outline-none" defaultValue={userStats.title} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Localização</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-3.5 text-slate-500" />
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 pl-10 text-white focus:border-primary outline-none" defaultValue={userStats.location} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bio</label>
                <textarea className="w-full h-24 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-primary outline-none resize-none" defaultValue={userStats.bio}></textarea>
              </div>

              <div className="pt-4 border-t border-slate-700 flex justify-end gap-3">
                <button type="button" onClick={() => setActiveTab('overview')} className="px-6 py-2.5 rounded-lg font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-6 py-2.5 bg-primary hover:bg-accent text-white rounded-lg font-bold shadow-lg shadow-primary/30 transition-all">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        )}

        {/* CONQUISTAS (NOVA ABA) */}
        {activeTab === 'badges' && (
          <div className="w-full relative z-10 flex flex-col gap-6">
            <div className="flex justify-between items-center bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Award className="text-amber-400" size={28} /> Quadro de Conquistas
                </h2>
                <p className="text-slate-400 mt-1">Todas as medalhas e méritos que você desbloqueou ou ainda pode alcançar.</p>
              </div>
              <button onClick={() => setActiveTab('overview')} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-colors">
                Voltar à Visão Geral
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { id: 1, name: 'Fundador', desc: 'Criou sua conta na primeira semana.', icon: '👑', unlocked: true, color: 'from-amber-400 to-orange-600' },
                { id: 2, name: 'Mestre do Código', desc: 'Atingiu Nível 10 em Programação.', icon: '💻', unlocked: true, color: 'from-blue-400 to-indigo-600' },
                { id: 3, name: 'Tutor', desc: 'Resolveu 20 dúvidas no fórum.', icon: '🤝', unlocked: true, color: 'from-emerald-400 to-teal-600' },
                { id: 4, name: 'Sábio da Lógica', desc: 'Completou a apostila de Lógica de Programação.', icon: '🧠', unlocked: true, color: 'from-purple-400 to-purple-600' },
                { id: 5, name: 'Mestre da Consistência', desc: 'Estudou 30 dias seguidos sem falhar.', icon: '🔥', unlocked: false, color: 'from-slate-600 to-slate-700' },
                { id: 6, name: 'Defensor do TCC', desc: 'Ajudou em 5 bancas de TCC.', icon: '🛡️', unlocked: false, color: 'from-slate-600 to-slate-700' },
                { id: 7, name: 'Escritor Notável', desc: 'Criou 3 apostilas bem avaliadas.', icon: '✍️', unlocked: false, color: 'from-slate-600 to-slate-700' },
                { id: 8, name: 'Líder de Guilda', desc: 'Fundou e liderou uma guilda ativamente.', icon: '🏰', unlocked: false, color: 'from-slate-600 to-slate-700' },
              ].map(badge => (
                <div key={badge.id} className={`p-5 rounded-xl border flex items-center gap-4 transition-all duration-300 ${badge.unlocked ? 'bg-slate-800 border-slate-600 hover:border-primary shadow-lg' : 'bg-darker/50 border-slate-800 opacity-60 grayscale'}`}>
                  <div className={`w-16 h-16 shrink-0 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-3xl shadow-inner border border-white/20`}>
                    {badge.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold ${badge.unlocked ? 'text-white' : 'text-slate-500'}`}>{badge.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-tight">{badge.desc}</p>
                  </div>
                  {!badge.unlocked && (
                    <div className="text-slate-600">
                      <Shield size={20} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Perfil;
