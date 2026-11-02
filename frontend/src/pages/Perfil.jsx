import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { 
  getTeacherRequestStatus, submitTeacherRequest, 
  getStoreItems, toggleEquipItem, getMyBadges 
} from '../services/gamificationService';
import AvatarWithFrame from '../components/AvatarWithFrame';
import { getFrameConfig, getThemeConfig, getBadgeConfig, applyThemeToApp } from '../utils/customizationStyles';
import { 
  User, Mail, MapPin, Award, BookOpen, Star, Activity, 
  Settings, Camera, Shield, Zap, Target, Edit3, MessageSquare,
  CheckCircle, AlertCircle, Loader2, Upload, GraduationCap, LogOut,
  ShoppingBag, Sparkles, Check, Clock, X, ExternalLink
} from 'lucide-react';

function Perfil() {
  const { currentUser, updateCurrentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [trilhas, setTrilhas] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  // Estados dos campos de edição
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState(1);
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');

  // Estados de Personalizações da Loja
  const [myPurchases, setMyPurchases] = useState([]);
  const [loadingEquipId, setLoadingEquipId] = useState(null);
  const [myBadges, setMyBadges] = useState([]);

  // Estados de Solicitação Docente / Professor
  const [teacherStatus, setTeacherStatus] = useState(null);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [submittingTeacher, setSubmittingTeacher] = useState(false);
  const [teacherForm, setTeacherForm] = useState({
    institution: '',
    proof_url: '',
    institutional_email: '',
    bio_statement: ''
  });
  
  // Opções de Avatar
  const avatarSeeds = ['Felix', 'Aneka', 'Daisy', 'George', 'Bella', 'Leo'];

  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.first_name || '');
      setLastName(currentUser.last_name || '');
      setCourse(currentUser.course || '');
      setSemester(currentUser.semester || 1);
      setBio(currentUser.bio || '');
      setAvatar(currentUser.avatar || '');
    }
  }, [currentUser]);

  useEffect(() => {
    async function loadData() {
      try {
        const [trilhasRes, storeRes, teacherRes, badgesRes] = await Promise.all([
          api.get('/trilha_ia/').catch(() => ({ data: [] })),
          getStoreItems().catch(() => []),
          getTeacherRequestStatus().catch(() => ({ has_request: false })),
          getMyBadges().catch(() => [])
        ]);
        setTrilhas(trilhasRes.data || []);
        setMyPurchases((storeRes || []).filter(item => item.purchased));
        setMyBadges(badgesRes || []);
        if (teacherRes && teacherRes.has_request) {
          setTeacherStatus(teacherRes.request);
        }
      } catch (err) {
        console.error('Erro ao carregar dados do perfil:', err);
      }
    }
    loadData();
  }, [currentUser]);

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        const reader = new FileReader();
        reader.onload = (event) => {
          setAvatar(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Apenas imagens PNG ou JPG são permitidas.');
      }
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const payload = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        course: course.trim(),
        semester: parseInt(semester, 10) || 1,
        bio: bio.trim(),
        avatar: avatar
      };

      const response = await api.patch('/accounts/me/', payload);
      updateCurrentUser(response.data);
      setSuccessMsg('Perfil atualizado com sucesso!');
      setTimeout(() => {
        setActiveTab('overview');
        setSuccessMsg('');
      }, 1200);
    } catch (err) {
      setErrorMsg('Não foi possível salvar as alterações. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleEquip = async (item) => {
    try {
      setLoadingEquipId(item.id);
      const res = await toggleEquipItem(item.id);
      setMyPurchases(prev => prev.map(it => {
        if (it.id === item.id) return { ...it, is_active: res.is_active };
        if (it.item_type === item.item_type && res.is_active) return { ...it, is_active: false };
        return it;
      }));
      if (updateCurrentUser && res.equipped_items) {
        updateCurrentUser({ equipped_items: res.equipped_items });
      }
    } catch (err) {
      alert('Erro ao alternar personalização.');
    } finally {
      setLoadingEquipId(null);
    }
  };

  const handleSubmitTeacherRequest = async (e) => {
    e.preventDefault();
    if (!teacherForm.institution.trim()) {
      alert('Por favor, informe a instituição de ensino, escola ou atuação.');
      return;
    }

    try {
      setSubmittingTeacher(true);
      const res = await submitTeacherRequest(teacherForm);
      alert(res.message);
      setTeacherStatus(res.data);
      setShowTeacherModal(false);

      if (res.auto_approved && updateCurrentUser) {
        updateCurrentUser({ role: 'PROFESSOR' });
      }
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.detail || 'Erro ao enviar solicitação.');
    } finally {
      setSubmittingTeacher(false);
    }
  };

  const displayName = `${currentUser?.first_name || ''} ${currentUser?.last_name || ''}`.trim() || currentUser?.username || 'Aluno';
  const displayRole = currentUser?.role === 'PROFESSOR' ? 'Professor / Mestre' : (currentUser?.role === 'ADMIN' ? 'Administrador' : 'Estudante');

  // Itens Ativos da Loja (consolidados com prioridade para seleções ativas)
  const activeFrame = myPurchases.find(p => p.item_type === 'AVATAR_FRAME' && p.is_active) || currentUser?.equipped_items?.frame;
  const activeTheme = myPurchases.find(p => p.item_type === 'THEME_COLOR' && p.is_active) || currentUser?.equipped_items?.theme;
  const activeBadge = myPurchases.find(p => p.item_type === 'PROFILE_BADGE' && p.is_active) || currentUser?.equipped_items?.badge;

  const themeConf = getThemeConfig(activeTheme);
  const badgeConf = getBadgeConfig(activeBadge);

  const userStats = {
    apostilasLidas: 12,
    apostilasCriadas: 4,
    duvidasResolvidas: 28,
    diasOfensiva: 14,
    location: 'Brasil'
  };

  const topBadges = [
    { id: 1, name: 'Fundador', icon: '🏆', color: 'from-amber-400 to-orange-600', desc: 'Criou sua conta na primeira semana' },
    { id: 2, name: 'Mestre do Código', icon: '💻', color: 'from-blue-400 to-indigo-600', desc: 'Atingiu Nível 10 em Programação' },
    { id: 3, name: 'Tutor Acadêmico', icon: '🎓', color: 'from-emerald-400 to-teal-600', desc: 'Contribuiu com a comunidade' },
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
      const total = t.topicos ? t.topicos.length : 0;
      return `<li style="margin-bottom: 8px;"><strong>${t.nome_area || 'Trilha Acadêmica'}</strong>: ${concluidos}/${total} tópicos concluídos</li>`;
    }).join('');

    cvWindow.document.write(`
      <html>
        <head>
          <title>Currículo Acadêmico - ${displayName}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1f2937; line-height: 1.6; }
            h1 { color: #6d28d9; border-bottom: 2px solid #6d28d9; padding-bottom: 8px; }
            .badge { background: #f3f4f6; padding: 4px 10px; border-radius: 6px; font-size: 13px; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>${displayName}</h1>
          <p><strong>Cargo / Função:</strong> ${displayRole}</p>
          <p><strong>Curso:</strong> ${currentUser?.course || 'Não informado'} (${currentUser?.semester || 1}º Semestre)</p>
          <p><strong>E-mail:</strong> ${currentUser?.email}</p>
          <p><strong>Nível UniStudy:</strong> Nível ${Math.floor((currentUser?.xp || 0)/100) + 1} (${currentUser?.xp || 0} XP)</p>
          <h2>Sobre Mim</h2>
          <p>${currentUser?.bio || 'Estudante ativo na plataforma acadêmica UniStudy Hub.'}</p>
          <h2>Trilhas Concluídas e em Andamento</h2>
          <ul>${trilhasHtml || '<li>Nenhuma trilha iniciada ainda.</li>'}</ul>
        </body>
      </html>
    `);
    cvWindow.document.close();
    setTimeout(() => { cvWindow.print(); }, 500);
  };

  return (
    <div className="bg-darker p-4 md:p-8 rounded-xl border border-slate-700 shadow-xl animate-fade-in relative overflow-hidden h-full overflow-y-auto">
      
      {/* CAPA (BANNER) - DINÂMICO COM TEMA ADQUIRIDO */}
      <div 
        className={`absolute top-0 left-0 w-full h-48 z-0 opacity-40 blur-xl transition-all duration-500 ${themeConf ? themeConf.className : 'bg-gradient-to-r from-primary/80 via-purple-600/80 to-accent/80'}`}
        style={themeConf?.gradient ? { background: themeConf.gradient } : {}}
      ></div>
      <div 
        className={`absolute top-0 left-0 w-full h-48 z-0 overflow-hidden transition-all duration-500 border-b border-white/10 ${themeConf ? themeConf.className : 'bg-gradient-to-r from-primary via-purple-600 to-accent'}`}
        style={themeConf?.gradient ? { background: themeConf.gradient, borderColor: themeConf.borderColor, boxShadow: themeConf.glow } : {}}
      >
        <div className="w-full h-full opacity-35" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
        {activeTheme && (
          <div className="absolute top-3 right-4 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-300 border border-amber-400/40 flex items-center gap-1.5 shadow-lg animate-fade-in">
            <span>{themeConf?.icon || '🎨'}</span> <span>Tema Ativo: {activeTheme.name}</span>
          </div>
        )}
      </div>

      <div className="relative z-10 pt-12 sm:pt-16 md:pt-24 flex flex-col sm:flex-row gap-5 sm:gap-6 items-center sm:items-end text-center sm:text-left">
        
        {/* AVATAR COM SUPORTE A MOLDURAS ADQUIRIDAS */}
        <div className="relative group shrink-0">
          <AvatarWithFrame 
            src={currentUser?.avatar} 
            size="xl" 
            frame={activeFrame} 
            badge={activeBadge} 
            showBadge={false} 
          />
          <button 
            onClick={() => setActiveTab('edit')}
            className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 p-2 sm:p-2.5 bg-primary border-2 border-slate-900 rounded-full text-white hover:scale-110 transition-transform shadow-lg cursor-pointer z-10"
            title="Alterar Foto de Perfil"
          >
            <Camera size={15} />
          </button>
        </div>

        {/* INFOS BÁSICAS */}
        <div className="flex-1 mb-2 min-w-0">
          <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-md truncate">{displayName}</h1>
            <span className="bg-white/20 border border-white/40 text-white font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-md drop-shadow-sm">
              <Shield size={13} /> Nível {Math.floor((currentUser?.xp || 0)/100) + 1}
            </span>
            
            {/* BADGES OFICIAIS DE CARGO */}
            {currentUser?.role === 'PROFESSOR' ? (
              <span className="bg-amber-500/25 border border-amber-400/50 text-amber-300 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                🎓 Professor Verificado
              </span>
            ) : currentUser?.role === 'ADMIN' ? (
              <span className="bg-purple-600/30 border border-purple-500/50 text-purple-200 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                🛡️ Administrador
              </span>
            ) : (
              <span className="bg-primary/20 border border-primary/40 text-primary-light font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-md">
                Estudante
              </span>
            )}

            {/* SELO DE PERFIL ATIVO DA LOJA */}
            {activeBadge && badgeConf && (
              <span className={`bg-gradient-to-r ${badgeConf.color} border ${badgeConf.border} text-white font-black text-xs px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-md shadow-amber-500/20 animate-fade-in drop-shadow`}>
                <span className="text-sm">{badgeConf.emoji}</span>
                <span>{activeBadge.name}</span>
              </span>
            )}
          </div>

          <p className="text-slate-300 font-medium text-sm sm:text-base mt-1.5 flex items-center justify-center sm:justify-start gap-2">
            <GraduationCap size={18} className="text-primary shrink-0" />
            <span>{currentUser?.course ? `${currentUser.course} • ${currentUser.semester || 1}º Semestre` : 'Curso não cadastrado'}</span>
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4 text-slate-400 text-xs sm:text-sm mt-2 font-semibold flex-wrap">
            <span className="flex items-center gap-1.5"><Mail size={13}/> {currentUser?.email}</span>
            <span className="flex items-center gap-1.5"><User size={13}/> @{currentUser?.username}</span>
            <span className="flex items-center gap-1.5"><MapPin size={13}/> {userStats.location}</span>
          </div>
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div className="w-full sm:w-auto mt-2 sm:mt-0 flex gap-2 sm:gap-3 flex-wrap justify-center sm:justify-end">
          {/* BOTÃO DE SOLICITAR SELO DE PROFESSOR (SE FOR ALUNO) */}
          {Boolean(currentUser?.role === 'STUDENT') && (
            teacherStatus?.status === 'PENDING' ? (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5" title="Sua solicitação está em análise pelo Administrador">
                <Clock size={14} /> Docente em Análise
              </span>
            ) : (
              <button 
                type="button"
                onClick={() => setShowTeacherModal(true)}
                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold py-2 sm:py-2.5 px-3.5 sm:px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm active:scale-95 cursor-pointer"
                title="É professor ou educador? Solicite seu selo docente"
              >
                <GraduationCap size={16} />
                <span>Sou Professor</span>
              </button>
            )
          )}

          {Boolean(currentUser?.role === 'ADMIN' || currentUser?.is_staff) && (
            <a 
              href="http://localhost:8001/admin/" 
              target="_blank" 
              rel="noreferrer"
              className="flex-1 sm:flex-initial bg-purple-700/90 hover:bg-purple-600 text-white font-bold py-2 sm:py-2.5 px-3.5 sm:px-5 rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg shadow-purple-900/30 border border-purple-500/40 text-xs sm:text-sm active:scale-95"
              title="Acessar o Painel Administrativo do Django"
            >
              <Shield size={16} />
              <span>Admin</span>
            </a>
          )}

          <button 
            onClick={handleExportCV}
            className="flex-1 sm:flex-initial bg-accent/90 hover:bg-accent text-white font-bold py-2 sm:py-2.5 px-3.5 sm:px-5 rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg shadow-accent/20 text-xs sm:text-sm active:scale-95"
          >
            Exportar CV (PDF)
          </button>
          <button 
            onClick={() => { setActiveTab(activeTab === 'overview' ? 'edit' : 'overview'); setSuccessMsg(''); setErrorMsg(''); }}
            className="flex-1 sm:flex-initial bg-slate-800/80 backdrop-blur hover:bg-slate-700 text-white border border-slate-600 font-bold py-2 sm:py-2.5 px-3.5 sm:px-5 rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm active:scale-95"
          >
            {activeTab === 'overview' ? <><Settings size={16} /> Editar</> : <><User size={16} /> Ver Perfil</>}
          </button>
          <button 
            onClick={() => {
              if (window.confirm('Deseja realmente sair da sua conta no UniStudy?')) {
                logout();
              }
            }}
            className="p-2 sm:p-2.5 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white rounded-xl border border-red-500/30 transition-all flex items-center justify-center active:scale-95"
            title="Sair da Conta"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="mt-8 border-t border-slate-800 relative z-10 pt-8 flex flex-col lg:flex-row gap-8">
        
        {/* COLUNA ESQUERDA - CONTEÚDO PRINCIPAL */}
        <div className="flex-1">
          {activeTab === 'overview' ? (
            <div className="space-y-8">
              
              {/* Sobre mim */}
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <User size={16} /> Sobre mim (Biografia)
                </h3>
                <p className="text-slate-200 leading-relaxed text-sm md:text-base">
                  {currentUser?.bio || 'Você ainda não adicionou uma biografia. Clique em "Editar Perfil" acima para falar sobre você, seus interesses e objetivos acadêmicos!'}
                </p>
              </div>

              {/* SEÇÃO DE PERSONALIZAÇÕES ADQUIRIDAS NA LOJA */}
              {myPurchases.length > 0 && (
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ShoppingBag size={16} className="text-primary" /> Meus Itens Adquiridos na Loja ({myPurchases.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {myPurchases.map(item => (
                      <div key={item.id} className={`p-3.5 rounded-xl bg-slate-900/70 border flex items-center justify-between gap-3 transition-all ${item.is_active ? 'border-primary/60 shadow-[0_0_15px_rgba(109,40,217,0.2)]' : 'border-slate-700/80'}`}>
                        <div className="flex items-center gap-2.5 min-w-0">
                          {item.item_type === 'AVATAR_FRAME' ? (
                            <AvatarWithFrame src={currentUser?.avatar} size="xs" frame={item} />
                          ) : (
                            <span className="text-xl shrink-0">
                              {item.item_type === 'PROFILE_BADGE' ? (item.asset_url || '🎖️') : item.item_type === 'PREMIUM_CONTENT' ? '📚' : (getThemeConfig(item)?.icon || '🎨')}
                            </span>
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-white text-xs sm:text-sm truncate">{item.name}</p>
                            <p className="text-[11px] text-slate-400 truncate">{item.description}</p>
                          </div>
                        </div>

                        {item.item_type === 'PREMIUM_CONTENT' ? (
                          <span className="px-2.5 py-1.5 rounded-lg text-xs font-bold shrink-0 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shadow-sm">
                            <CheckCircle size={13} /> Desbloqueado
                          </span>
                        ) : (
                          <button
                            onClick={() => handleToggleEquip(item)}
                            disabled={loadingEquipId === item.id}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all active:scale-95 flex items-center gap-1 cursor-pointer ${
                              item.is_active 
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/25 ring-1 ring-emerald-400' 
                                : 'bg-slate-700 hover:bg-primary text-slate-300 hover:text-white'
                            }`}
                          >
                            {loadingEquipId === item.id ? <Loader2 size={13} className="animate-spin" /> : (item.is_active ? <><Check size={13} /> Equipado</> : 'Equipar')}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gráfico de Atividade Estilo GitHub */}
              <div className="bg-slate-800/50 p-5 sm:p-6 rounded-xl border border-slate-700/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Activity size={16} /> Mapa de Estudos (Últimos 90 dias)
                  </h3>
                  <span className="text-xs text-primary font-bold">{currentUser?.xp || 0} XP Acumulado</span>
                </div>
                
                <div className="overflow-x-auto pb-2">
                  <div className="flex flex-wrap gap-1.5 min-w-[280px]">
                    {heatmap.map((level, idx) => {
                      let colorClass = 'bg-slate-700';
                      if (level === 1) colorClass = 'bg-primary/40';
                      if (level === 2) colorClass = 'bg-primary/70';
                      if (level === 3) colorClass = 'bg-primary';

                      return (
                        <div 
                          key={idx} 
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm ${colorClass} hover:ring-2 hover:ring-white transition-all cursor-pointer`}
                          title={`${level > 0 ? 'Estudou' : 'Não estudou'}`}
                        ></div>
                      );
                    })}
                  </div>
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
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Award size={16} /> Minhas Conquistas & Selos ({myBadges.length > 0 ? myBadges.length : topBadges.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {myBadges.length > 0 ? (
                    myBadges.map(ub => {
                      const tier = ub.badge?.badge_tier;
                      const badgeBg = tier === 'OURO'
                        ? 'from-yellow-400 to-amber-600 shadow-[0_0_15px_rgba(234,179,8,0.35)]'
                        : tier === 'PRATA'
                          ? 'from-slate-200 to-slate-400 text-slate-900 shadow-[0_0_15px_rgba(203,213,225,0.25)]'
                          : tier === 'BRONZE'
                            ? 'from-amber-600 to-orange-800 shadow-[0_0_15px_rgba(217,119,6,0.25)]'
                            : 'from-blue-400 to-indigo-600';

                      return (
                        <div key={ub.id} className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl flex items-center gap-4 hover:bg-slate-800 transition-colors group">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${badgeBg} flex items-center justify-center text-xl shadow-lg shrink-0 group-hover:scale-110 transition-transform`}>
                            {ub.badge.icon_url ? <img src={ub.badge.icon_url} alt="icon" className="w-6 h-6"/> : (ub.badge.icon_emoji || '⭐')}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-white text-sm truncate">{ub.badge.name}</div>
                            <div className="text-xs text-slate-400 mt-0.5 line-clamp-2">{ub.badge.description}</div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    topBadges.map(badge => (
                      <div key={badge.id} className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl flex items-center gap-4 hover:bg-slate-800 transition-colors cursor-pointer group">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform`}>
                          {badge.icon}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{badge.name}</div>
                          <div className="text-xs text-slate-400 mt-1">{badge.desc}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full bg-slate-800/50 p-6 md:p-8 rounded-xl border border-slate-700/50 max-w-3xl mx-auto">
              <h2 className="text-2xl font-black text-white mb-6 border-b border-slate-700 pb-4">Editar Perfil Acadêmico</h2>
              
              {successMsg && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3">
                  <CheckCircle size={18} className="text-emerald-400 shrink-0" />
                  <span className="font-medium">{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm flex items-center gap-3">
                  <AlertCircle size={18} className="text-red-400 shrink-0" />
                  <span className="font-medium">{errorMsg}</span>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSaveProfile}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Primeiro Nome</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-primary outline-none" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ex: Carlos"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sobrenome</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-primary outline-none" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Ex: Silva"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Curso / Graduação</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-primary outline-none" 
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      placeholder="Ex: Engenharia de Software, Medicina, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Semestre Atual</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="20"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-primary outline-none" 
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Biografia (Sobre mim)</label>
                  <textarea 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-primary outline-none h-32 resize-none" 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Conte um pouco sobre sua trajetória, projetos e interesses de estudo..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Escolher Avatar</label>
                  <div className="flex gap-3 items-center flex-wrap">
                    {avatarSeeds.map((seed) => {
                      const seedUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
                      const isSelected = avatar === seedUrl;
                      return (
                        <div
                          key={seed}
                          onClick={() => setAvatar(seedUrl)}
                          className={`w-12 h-12 rounded-full cursor-pointer transition-all transform hover:scale-110 overflow-hidden bg-slate-700 border-2
                            ${isSelected ? 'border-primary shadow-[0_0_12px_rgba(109,40,217,0.8)] scale-105' : 'border-slate-600 opacity-70 hover:opacity-100'}
                          `}
                        >
                          <img src={seedUrl} alt={`Avatar ${seed}`} className="w-full h-full object-cover" />
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-12 h-12 rounded-full border-2 border-dashed border-slate-600 hover:border-primary flex items-center justify-center text-slate-400 hover:text-white transition-colors bg-slate-800"
                      title="Enviar foto do computador"
                    >
                      <Upload size={18} />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleAvatarUpload} 
                      accept=".png, .jpg, .jpeg" 
                      className="hidden" 
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('overview')} 
                    className="px-6 py-2.5 rounded-lg font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                  >
                    {isSaving && <Loader2 size={16} className="animate-spin" />}
                    Salvar Alterações
                  </button>
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
              <p className="text-xs text-slate-400 mb-3">Faltam {100 - ((currentUser?.xp || 0) % 100)} XP para o Nível {(Math.floor((currentUser?.xp || 0)/100) + 1) + 1}</p>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(currentUser?.xp || 0) % 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL DE SOLICITAÇÃO DE SELO DE PROFESSOR */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative my-8 animate-fade-in">
            <button
              onClick={() => setShowTeacherModal(false)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-2xl">
                🎓
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Solicitar Selo de Professor</h3>
                <p className="text-xs text-slate-400">Ativação de recursos de criação de Quizzes e selo oficial.</p>
              </div>
            </div>

            <div className="mb-5 p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-slate-300 leading-relaxed">
              💡 <strong>Dica de Aprovação:</strong> Se você possui e-mail institucional acadêmico (terminado em <code>.edu</code>, <code>.edu.br</code> ou domínio de faculdade), seu acesso é aprovado <strong>instantaneamente</strong>! Se for de rede privada ou aulas particulares, anexe seu LinkedIn ou Lattes para validação do Administrador.
            </div>

            <form onSubmit={handleSubmitTeacherRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Instituição de Ensino ou Atuação *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: USP, Colégio Objetivo ou Aulas Particulares"
                  value={teacherForm.institution}
                  onChange={(e) => setTeacherForm({ ...teacherForm, institution: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Link do LinkedIn, Lattes ou Portfólio</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/seuperfil ou lattes"
                  value={teacherForm.proof_url}
                  onChange={(e) => setTeacherForm({ ...teacherForm, proof_url: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">E-mail Institucional Acadêmico (Opcional)</label>
                <input
                  type="email"
                  placeholder="professor@faculdade.edu.br"
                  value={teacherForm.institutional_email}
                  onChange={(e) => setTeacherForm({ ...teacherForm, institutional_email: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Matérias e Área de Ensino</label>
                <textarea
                  rows="2"
                  placeholder="Ex: Leciono Algoritmos, Banco de Dados e Matemática Discreta."
                  value={teacherForm.bio_statement}
                  onChange={(e) => setTeacherForm({ ...teacherForm, bio_statement: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:border-primary outline-none resize-none"
                ></textarea>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowTeacherModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submittingTeacher}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-400/25 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {submittingTeacher ? <Loader2 size={16} className="animate-spin" /> : <GraduationCap size={16} />}
                  {submittingTeacher ? 'Enviando...' : 'Enviar Solicitação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Perfil;
