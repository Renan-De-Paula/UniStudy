import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { 
  User, Mail, MapPin, Award, BookOpen, Star, Activity, 
  Settings, Camera, Shield, Zap, Target, Edit3, MessageSquare
} from 'lucide-react';

function Perfil() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [trilhas, setTrilhas] = useState([]);

  useEffect(() => {
    async function loadTrilhas() {
      try {
        const response = await api.get('/trilha_ia/');
        setTrilhas(response.data);
      } catch (err) {
        console.error(err);
      }
    }
    loadTrilhas();
  }, []);

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
    { id: 1, name: 'Fundador', icon: '🏆', color: 'from-amber-400 to-orange-600', desc: 'Criou sua conta na primeira semana' },
    { id: 2, name: 'Mestre do Código', icon: '💻', color: 'from-blue-400 to-indigo-600', desc: 'Atingiu Nível 10 em Programação' },
    { id: 3, name: 'Tutor', icon: '🎓', color: 'from-emerald-400 to-teal-600', desc: 'Resolveu 20 dúvidas no fórum' },
  ];

  const generateHeatmap = () => {
    const days = [];
    for (let i = 0; i < 90; i++) {
      const activityLevel = Math.random() > 0.6 ? Math.floor(Math.random() * 3) + 1 : 0; 
      days.push(activityLevel);
    }
    return days;
  };
  const [heatmap] = useState(generateHeatmap());

  const handleExportCV = () => {
    const cvWindow = window.open('', '_blank');
    
    const trilhasHtml = trilhas.map(t => {
      const concluidos = t.topicos_concluidos ? t.topicos_concluidos.length : 0;
      const total = t.conteudo_gerado?.modulos?.reduce((acc, m) => acc + m.topicos.length, 0) || 0;
      return `<li><strong>${t.titulo}:</strong> Concluiu ${concluidos} de ${total} tópicos práticos gerados por IA.</li>`;
    }).join('');

    cvWindow.document.write(`
      <html>
        <head>
          <title>Currículo - ${currentUser?.first_name}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 40px; }
            h1 { color: #4f46e5; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
            h2 { color: #6d28d9; margin-top: 30px; }
            .badge { display: inline-block; background: #f3f4f6; padding: 5px 12px; border-radius: 15px; margin: 5px; font-size: 14px; font-weight: bold; border: 1px solid #e5e7eb; }
            .xp { color: #10b981; font-weight: bold; }
            .contact { color: #6b7280; font-size: 14px; margin-bottom: 30px; }
          </style>
        </head>
        <body>
          <h1>${currentUser?.first_name} ${currentUser?.last_name || ''}</h1>
          <div class="contact">
            Email: ${currentUser?.email} | Nível Unistudy: ${Math.floor((currentUser?.xp || 0) / 100) + 1} (${currentUser?.xp || 0} XP)
          </div>
          
          <h2>Resumo Profissional</h2>
          <p>${userStats.bio}</p>

          <h2>Habilidades Práticas (Trilhas de IA)</h2>
          <ul>
            ${trilhasHtml || '<li>Ainda não completou trilhas.</li>'}
          </ul>

          <h2>Métricas de Estudo Contínuo</h2>
          <ul>
            <li><strong>Apostilas Lidas:</strong> ${userStats.apostilasLidas}</li>
            <li><strong>Dúvidas Resolvidas no Fórum:</strong> ${userStats.duvidasResolvidas}</li>
            <li><strong>Ofensiva Máxima:</strong> ${userStats.diasOfensiva} dias seguidos</li>
          </ul>

          <h2>Conquistas e Certificações (Unistudy)</h2>
          <div>
            ${topBadges.map(b => `<span class="badge">${b.icon} ${b.name}</span>`).join('')}
          </div>

          <h2 style="margin-top: 50px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            Gerado automaticamente por UniStudy Hub - Trilha de Aprendizado Guiada por IA
          </h2>
        </body>
      </html>
    `);
    cvWindow.document.close();
    setTimeout(() => { cvWindow.print(); }, 500);
  };

  return (
    <div className="bg-darker p-4 md:p-8 rounded-xl border border-slate-700 shadow-xl animate-fade-in relative overflow-hidden h-full overflow-y-auto">
      
      {/* CAPA (BANNER) */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-r from-primary/80 via-purple-600/80 to-accent/80 z-0 opacity-40 blur-xl"></div>
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-r from-primary via-purple-600 to-accent z-0 overflow-hidden">
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
              <Shield size={12} /> Nível {Math.floor((currentUser?.xp || 0)/100) + 1}
            </span>
          </div>
          <p className="text-slate-300 font-medium text-lg mt-1">{userStats.title}</p>
          <div className="flex items-center gap-4 text-slate-400 text-sm mt-2 font-semibold">
            <span className="flex items-center gap-1"><MapPin size={14}/> {userStats.location}</span>
            <span className="flex items-center gap-1"><User size={14}/> Membro desde {userStats.joinDate}</span>
          </div>
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div className="w-full md:w-auto mt-4 md:mt-0 flex gap-3">
            <button 
              onClick={handleExportCV}
              className="w-full md:w-auto bg-accent/90 hover:bg-accent text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
            >
              Exportar Currículo (PDF)
            </button>
            <button 
              onClick={() => setActiveTab(activeTab === 'overview' ? 'edit' : 'overview')}
              className="w-full md:w-auto bg-slate-800/80 backdrop-blur hover:bg-slate-700 text-white border border-slate-600 font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {activeTab === 'overview' ? <><Settings size={18} /> Editar Perfil</> : <><User size={18} /> Voltar ao Perfil</>}
            </button>
        </div>
      </div>

      <div className="mt-8 border-t border-slate-800 relative z-10 pt-8 flex flex-col lg:flex-row gap-8">
        
        {/* COLUNA ESQUERDA - CONTEÚDO PRINCIPAL */}
        <div className="flex-1">
          {activeTab === 'overview' ? (
            <div className="space-y-8">
              
              {/* Sobre mim */}
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <User size={16} /> Sobre mim
                </h3>
                <p className="text-slate-300 leading-relaxed">{userStats.bio}</p>
              </div>

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
                    if (level === 3) colorClass = 'bg-primary';

                    return (
                      <div 
                        key={idx} 
                        className={`w-4 h-4 rounded-sm ${colorClass} hover:ring-2 hover:ring-white transition-all cursor-pointer`}
                        title={`${level > 0 ? 'Estudou' : 'Não estudou'}`}
                      ></div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2 mt-4 text-xs font-bold text-slate-500 justify-end">
                  <span>Menos</span>
                  <div className="w-3 h-3 bg-slate-700 rounded-sm"></div>
                  <div className="w-3 h-3 bg-primary/40 rounded-sm"></div>
                  <div className="w-3 h-3 bg-primary/70 rounded-sm"></div>
                  <div className="w-3 h-3 bg-primary rounded-sm"></div>
                  <span>Mais</span>
                </div>
              </div>

              {/* Conquistas (Badges) */}
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Award size={16} /> Top Conquistas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {topBadges.map(badge => (
                    <div key={badge.id} className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl flex items-center gap-4 hover:bg-slate-800 transition-colors cursor-pointer group">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform`}>
                        {badge.icon}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{badge.name}</div>
                        <div className="text-xs text-slate-400 mt-1">{badge.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
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
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Biografia (Sobre mim)</label>
                  <textarea className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-primary outline-none h-32 resize-none" defaultValue={userStats.bio}></textarea>
                </div>

                <div className="pt-4 border-t border-slate-700 flex justify-end gap-3">
                  <button type="button" onClick={() => setActiveTab('overview')} className="px-6 py-2.5 rounded-lg font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">Cancelar</button>
                  <button type="submit" className="px-6 py-2.5 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">Salvar Alterações</button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* COLUNA DIREITA - SIDEBAR DE ESTATÍSTICAS */}
        {activeTab === 'overview' && (
          <div className="w-full lg:w-72 flex flex-col gap-4">
            <div className="bg-slate-800/80 backdrop-blur rounded-xl border border-slate-700 p-5">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Target size={18} className="text-primary"/> Estatísticas</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-2"><BookOpen size={16}/> Lidas</span>
                  <span className="font-black text-white bg-slate-900 px-2 py-1 rounded">{userStats.apostilasLidas}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-2"><Edit3 size={16}/> Criadas</span>
                  <span className="font-black text-white bg-slate-900 px-2 py-1 rounded">{userStats.apostilasCriadas}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-2"><MessageSquare size={16}/> Dúvidas</span>
                  <span className="font-black text-white bg-slate-900 px-2 py-1 rounded">{userStats.duvidasResolvidas}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
                  <span className="text-slate-400 flex items-center gap-2"><Zap size={16} className="text-amber-500"/> Ofensiva</span>
                  <span className="font-black text-amber-500 bg-amber-500/10 px-2 py-1 rounded">{userStats.diasOfensiva} dias</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20 p-5 text-center">
              <Star size={32} className="mx-auto text-primary mb-3" />
              <h4 className="font-bold text-white mb-1">Próximo Nível</h4>
              <p className="text-xs text-slate-400 mb-3">Faltam 120 XP para o Nível {(Math.floor((currentUser?.xp || 0)/100) + 1) + 1}</p>
              <div className="w-full bg-slate-900 rounded-full h-2">
                <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full" style={{width: '60%'}}></div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Perfil;
