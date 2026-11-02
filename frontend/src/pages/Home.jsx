import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import { X, Menu, ChevronDown, ChevronUp, Home as HomeIcon, BookOpen, MessageSquare, Users, Award, GraduationCap, Sun, Moon, LogOut, User, Brain, Shield, UserCheck } from 'lucide-react';

import AvatarWithFrame from '../components/AvatarWithFrame';
import logo from '../img/logo.png';




import CriarApostila from './CriarApostila';




import Forum from './Forum';




import Guildas from './Guildas';




import Cursos from './Cursos';




import Perfil from './Perfil';




import Quiz from './Quiz';
import Conquistas from './Conquistas';
import Amigos from './Amigos';









import TrilhasDashboard from '../components/TrilhasDashboard';
import SalaFoco from '../components/SalaFoco';









function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [pendingFriendsCount, setPendingFriendsCount] = useState(0);
  const { currentUser, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchPendingFriends = async () => {
      try {
        const res = await api.get('/accounts/friendships/requests/');
        setPendingFriendsCount(res.data?.pending_count || 0);
      } catch {}
    };
    if (currentUser) {
      fetchPendingFriends();
      const interval = setInterval(fetchPendingFriends, 30000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);









  const menuItems = [




    { id: 'home', label: 'Início', icon: <HomeIcon size={22} /> },
    { id: 'foco', label: 'Sala de Foco', icon: <Brain size={22} /> },
    { id: 'amigos', label: 'Amigos & Chat', icon: <UserCheck size={22} />, badge: pendingFriendsCount > 0 ? pendingFriendsCount : null },
    { id: 'apostilas', label: 'Apostilas', icon: <BookOpen size={22} /> },
    { id: 'forum', label: 'Fórum de Dúvidas', icon: <MessageSquare size={22} /> },
    { id: 'guildas', label: 'Guildas de Estudo', icon: <Users size={22} /> },
    { id: 'quizzes', label: 'Quizzes & Desafios', icon: <Brain size={22} /> },
    { id: 'cursos', label: 'Cursos Recomendados', icon: <GraduationCap size={22} /> },
    { id: 'conquistas', label: 'Conquistas & Loja', icon: <Award size={22} /> },
];










  return (
    <div className="flex flex-col md:flex-row h-screen bg-dark text-slate-200 font-sans transition-colors duration-300 overflow-hidden">
      
      {/* Mobile Top Header (100% Responsivo no Celular) */}
      <header className="md:hidden flex items-center justify-between px-3 py-2 bg-darker/95 backdrop-blur-md border-b border-slate-700/60 z-30 shrink-0 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 text-slate-300 hover:text-white bg-slate-800/90 border border-slate-700/80 rounded-xl active:scale-95 transition-transform shrink-0"
            title="Abrir Menu Completo de Navegação"
          >
            <Menu size={18} />
          </button>
          <img src={logo} alt="UniStudy Hub" className="h-6 object-contain cursor-pointer shrink-0" onClick={() => setActiveTab('home')} />
        </div>
        
        <div className="flex items-center gap-1.5 shrink-0">
          {activeTab !== 'home' && (
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-1 bg-primary/15 hover:bg-primary/25 text-primary-light border border-primary/35 py-1 px-2 rounded-lg text-xs font-bold active:scale-95 transition-all shadow-sm"
              title="Voltar ao Início"
            >
              <HomeIcon size={12} />
              <span className="hidden sm:inline">Início</span>
            </button>
          )}

          <button 
            onClick={() => setActiveTab('perfil')}
            className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 py-1 px-2 rounded-full text-xs font-bold text-white transition-all shadow-sm active:scale-95 shrink-0"
            title="Ver Perfil"
          >
            <AvatarWithFrame src={currentUser?.avatar} size="xs" frame={currentUser?.equipped_items?.frame} badge={currentUser?.equipped_items?.badge} showBadge={false} />
            <span className="max-w-[70px] truncate text-[11px]">{currentUser?.first_name || currentUser?.username}</span>
          </button>
        </div>
      </header>

      {/* Drawer Lateral Mobile com Menu Completo e Sair da Conta */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-darker border-r border-slate-700/80 h-full flex flex-col justify-between p-4 shadow-2xl z-10 animate-fade-in overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-700/50">
                <img src={logo} alt="UniStudy" className="h-9 object-contain" />
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800/80 rounded-xl"
                  title="Fechar Menu"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div 
                onClick={() => { setActiveTab('perfil'); setMobileMenuOpen(false); }}
                className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 mb-4 flex items-center gap-3 cursor-pointer hover:border-primary/50 transition-colors"
              >
                <AvatarWithFrame src={currentUser?.avatar} size="md" frame={currentUser?.equipped_items?.frame} badge={currentUser?.equipped_items?.badge} showBadge={true} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{currentUser?.first_name ? `${currentUser.first_name} ${currentUser.last_name || ''}` : currentUser?.username}</p>
                  <p className="text-xs text-primary font-semibold">Nível {currentUser?.level} • {currentUser?.xp} XP</p>
                </div>
              </div>

              <nav className="flex flex-col gap-1.5">
                {menuItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-all ${isActive ? 'bg-primary text-white shadow-md shadow-primary/30' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                    >
                      <div className="flex items-center gap-3.5">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-700/60 flex items-center justify-between gap-2">
              {Boolean(currentUser?.role === 'ADMIN' || currentUser?.is_staff) && (
                <a 
                  href="http://localhost:8001/admin/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 h-10 flex items-center justify-center rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30"
                  title="Painel Django Admin (/admin)"
                >
                  <Shield size={18} />
                </a>
              )}
              <button 
                onClick={toggleTheme}
                className="flex-1 h-10 flex items-center justify-center rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                title={isDarkMode ? 'Tema Claro' : 'Tema Escuro'}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button 
                onClick={() => {
                  if (window.confirm('Deseja realmente sair da conta?')) {
                    logout();
                  }
                }}
                className="flex-1 h-10 flex items-center justify-center rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors"
                title="Sair da Conta"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Desktop (Oculto em Telas Menores que Tablet/Mobile) */}
      <aside className="hidden md:flex w-20 lg:w-72 flex-shrink-0 bg-darker/80 backdrop-blur-2xl border-r border-slate-700/50 flex flex-col justify-between transition-all duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.2)] z-30 h-screen max-h-screen overflow-hidden">
        
        {/* Logo Area */}
        <div className="h-16 lg:h-20 shrink-0 flex items-center justify-center border-b border-slate-700/50">
          <div className="flex justify-center items-center">
            <img src={logo} alt="UniStudy Hub" className="h-[44px] lg:h-[64px] object-contain drop-shadow-[0_0_10px_rgba(109,40,217,0.3)]" />
          </div>
        </div>

        {/* Navigation Links (com rolagem suave se a tela for baixa) */}
        <nav className="flex-1 min-h-0 py-3 px-3 flex flex-col gap-1.5 overflow-y-auto overflow-x-hidden">




          {menuItems.map((item) => {




            const isActive = activeTab === item.id;




            return (




              <button




                key={item.id}




                onClick={() => setActiveTab(item.id)}




                className={`




                  relative flex items-center justify-center lg:justify-start gap-4 p-3 lg:px-4 rounded-xl transition-all duration-300 group




                  ${isActive ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'}




                `}




                title={item.label}




              >




                {/* Indicador de ativo (Glow na lateral) */}




                {isActive && (




                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-r-full shadow-[0_0_10px_rgba(109,40,217,0.8)]"></div>




                )}




                




                <div className="relative">
                  <div className={`${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(109,40,217,0.5)]' : 'group-hover:scale-110'} transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow-md">
                      {item.badge}
                    </span>
                  )}
                </div>

                <span className={`font-semibold hidden lg:flex items-center justify-between flex-1 ${isActive ? 'text-white' : ''}`}>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </span>




              </button>




            );




          })}




        </nav>









        {/* User Profile & Actions Footer */}
        <div className="shrink-0 p-3 pb-3 border-t border-slate-700/50 bg-slate-800/30">
          <div className="flex flex-col gap-2">

            {/* Ações Rápidas: Admin, Tema e Sair (Aparece como Dropup ACIMA do Card de Perfil) */}
            {showUserMenu && (
              <div className="flex items-center justify-between gap-1.5 p-1.5 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl animate-fade-in backdrop-blur-md">
                {Boolean(currentUser?.role === 'ADMIN' || currentUser?.is_staff) && (
                  <a 
                    href="http://localhost:8001/admin/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 h-9 flex items-center justify-center rounded-lg bg-purple-600/20 hover:bg-purple-600/35 text-purple-300 border border-purple-500/30 transition-all shadow-sm active:scale-95"
                    title="Painel Django Admin (/admin)"
                  >
                    <Shield size={16} />
                  </a>
                )}

                <button 
                  onClick={toggleTheme}
                  className="flex-1 h-9 flex items-center justify-center rounded-lg bg-slate-700/30 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-all border border-slate-600/30 active:scale-95"
                  title={isDarkMode ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
                >
                  {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                </button>

                <button 
                  onClick={() => {
                    if (window.confirm('Deseja realmente sair da sua conta?')) {
                      logout();
                    }
                  }}
                  className="flex-1 h-9 flex items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all border border-red-500/30 active:scale-95"
                  title="Sair da Conta (Logout)"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}

            {/* Status (XP/Level/Avatar) - Desktop Expandido (lg:w-72) */}
            <div className="hidden lg:flex items-center justify-between bg-darker/60 p-2.5 rounded-xl border border-slate-700/60 hover:border-primary/50 transition-colors shadow-sm">
              <div 
                className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer group"
                onClick={() => setActiveTab('perfil')}
                title="Acessar Meu Perfil"
              >
                <AvatarWithFrame src={currentUser?.avatar} size="sm" frame={currentUser?.equipped_items?.frame} badge={currentUser?.equipped_items?.badge} showBadge={true} />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate group-hover:text-primary transition-colors">
                    {currentUser?.first_name ? `${currentUser.first_name} ${currentUser.last_name || ''}`.trim() : currentUser?.username}
                  </p>
                  <p className="text-[11px] text-primary font-bold">Nível {currentUser?.level} • {currentUser?.xp} XP</p>
                </div>
              </div>

              {/* Botão de Toggle para Ações Rápidas */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserMenu(!showUserMenu);
                }}
                className={`p-1.5 rounded-lg transition-all ${showUserMenu ? 'bg-primary text-white shadow-md shadow-primary/30' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
                title={showUserMenu ? "Ocultar botões rápidos" : "Abrir botões de ação (Tema, Admin, Sair)"}
              >
                {showUserMenu ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
              </button>
            </div>

            {/* Avatar - Desktop Compacto (w-20) */}
            <div 
              className="lg:hidden flex flex-col items-center gap-1 cursor-pointer"
              onClick={() => setShowUserMenu(!showUserMenu)}
              title="Opções de Usuário"
            >
              <AvatarWithFrame src={currentUser?.avatar} size="sm" frame={currentUser?.equipped_items?.frame} badge={currentUser?.equipped_items?.badge} showBadge={true} />
            </div>

          </div>
        </div>




      </aside>









      {/* Main Content Area */}




      <main className="flex-1 h-screen overflow-y-auto p-2 sm:p-4 md:p-8 pb-20 md:pb-8 relative">




        




        {/* Glow de Fundo Geral */}




        <div className="absolute top-0 left-0 w-full h-64 bg-primary/5 blur-[100px] pointer-events-none z-0"></div>









        <div className="relative z-10 max-w-6xl mx-auto h-full">




          {activeTab !== 'home' && (
            <div className="hidden md:flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80 animate-fade-in">
              <button 
                onClick={() => setActiveTab('home')} 
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 px-3.5 py-1.5 rounded-xl transition-all shadow-sm group active:scale-95"
                title="Voltar ao Painel Início"
              >
                <span className="text-primary font-black group-hover:-translate-x-0.5 transition-transform">←</span>
                <span>Voltar ao Início</span>
              </button>
              <span className="text-xs text-slate-500 font-semibold tracking-wider">
                UniStudy Hub • <strong className="text-slate-400">{menuItems.find(m => m.id === activeTab)?.label || 'Seção'}</strong>
              </span>
            </div>
          )}




          




          {/* TAB: HOME */}




          {activeTab === 'home' && <TrilhasDashboard setActiveTab={setActiveTab} />}









          {/* TAB: APOSTILAS */}




          {activeTab === 'apostilas' && <CriarApostila />}
          {activeTab === 'foco' && <SalaFoco />}









          {/* TAB: FORUM */}




          {activeTab === 'forum' && <Forum />}









          {/* TAB: GUILDAS */}




          {activeTab === 'guildas' && <Guildas />}









          {/* TAB: QUIZZES */}




          {activeTab === 'quizzes' && <Quiz />}









          {/* TAB: CURSOS */}




          {activeTab === 'cursos' && <Cursos />}
          {activeTab === 'conquistas' && <Conquistas />}




          




          {/* TAB: AMIGOS */}
          {activeTab === 'amigos' && <Amigos />}

          {/* TAB: PERFIL */}
          {activeTab === 'perfil' && <Perfil />}




        </div>
      </main>

      {/* Mobile Bottom Navigation Bar (Fase 12: Navegação Rápida com o Polegar no Celular) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-darker/95 backdrop-blur-xl border-t border-slate-700/80 px-1 py-1 z-40 flex items-center justify-around shadow-2xl safe-area-bottom">
        {[
          { id: 'home', label: 'Início', icon: <HomeIcon size={19} /> },
          { id: 'apostilas', label: 'Apostilas', icon: <BookOpen size={19} /> },
          { id: 'cursos', label: 'Cursos', icon: <GraduationCap size={19} /> },
          { id: 'forum', label: 'Fórum', icon: <MessageSquare size={19} /> },
          { id: 'perfil', label: 'Perfil', icon: <User size={19} /> },
        ].map(navItem => {
          const isActive = activeTab === navItem.id;
          return (
            <button
              key={navItem.id}
              onClick={() => setActiveTab(navItem.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-95 ${
                isActive 
                  ? 'text-primary font-bold' 
                  : 'text-slate-400 hover:text-white font-medium'
              }`}
            >
              <div className={`p-1 rounded-lg transition-colors ${isActive ? 'bg-primary/20 text-primary shadow-sm' : ''}`}>
                {navItem.icon}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold text-white' : ''}`}>
                {navItem.label}
              </span>
            </button>
          );
        })}
        
        {/* Botão "Mais" para abrir a gaveta com ferramentas secundárias */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2.5 text-slate-400 hover:text-white rounded-xl active:scale-95 transition-all"
          title="Abrir Menu Completo (Sala de Foco, Guildas, Quizzes, Conquistas)"
        >
          <div className="p-1 rounded-lg">
            <Menu size={19} />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Mais</span>
        </button>
      </nav>

    </div>




  );




}









export default Home;














