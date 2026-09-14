import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Home as HomeIcon, BookOpen, MessageSquare, Users, Award, GraduationCap, Sun, Moon, LogOut, User, Brain } from 'lucide-react';
import CriarApostila from './CriarApostila';
import Forum from './Forum';
import Guildas from './Guildas';
import Cursos from './Cursos';
import Perfil from './Perfil';
import Quiz from './Quiz';

function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const { currentUser, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const menuItems = [
    { id: 'home', label: 'Início', icon: <HomeIcon size={22} /> },
    { id: 'apostilas', label: 'Apostilas', icon: <BookOpen size={22} /> },
    { id: 'forum', label: 'Fórum de Dúvidas', icon: <MessageSquare size={22} /> },
    { id: 'guildas', label: 'Guildas de Estudo', icon: <Users size={22} /> },
    { id: 'quizzes', label: 'Quizzes & Desafios', icon: <Brain size={22} /> },
    { id: 'cursos', label: 'Cursos Recomendados', icon: <GraduationCap size={22} /> },
    { id: 'perfil', label: 'Meu Perfil', icon: <User size={22} /> },
  ];

  return (
    <div className="flex h-screen bg-dark text-slate-200 font-sans transition-colors duration-300 overflow-hidden">
      
      {/* Sidebar / Menu Moderno Lateral */}
      <aside className="w-20 lg:w-72 flex-shrink-0 bg-darker/80 backdrop-blur-2xl border-r border-slate-700/50 flex flex-col justify-between transition-all duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.2)] z-50">
        
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-slate-700/50">
          <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            <span className="lg:hidden">🚀</span>
            <span className="hidden lg:flex items-center gap-2">🚀 UniHub</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
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
                
                <div className={`${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(109,40,217,0.5)]' : 'group-hover:scale-110'} transition-transform duration-300`}>
                  {item.icon}
                </div>
                
                <span className={`font-semibold hidden lg:block ${isActive ? 'text-white' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* User Profile & Actions Footer */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-800/20">
          
          <div className="flex flex-col gap-4">
            {/* Status (XP/Level) - Apenas Desktop */}
            <div 
              className="hidden lg:flex justify-between items-center bg-darker/50 p-3 rounded-xl border border-slate-700/50 cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => setActiveTab('perfil')}
              title="Acessar Meu Perfil"
            >
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Seu Nível</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-white">{currentUser?.level}</span>
                  <span className="text-xs text-primary font-bold">{currentUser?.xp} XP</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden shadow-[0_0_15px_rgba(109,40,217,0.4)]">
                <img src={currentUser?.avatar} alt="Perfil" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Avatar Mobile */}
            <div 
              className="lg:hidden flex justify-center mb-2 cursor-pointer"
              onClick={() => setActiveTab('perfil')}
              title="Meu Perfil"
            >
              <img src={currentUser?.avatar} alt="Perfil" className="w-10 h-10 rounded-full border-2 border-primary" />
            </div>

            {/* Controles: Tema e Logout */}
            <div className="flex justify-center lg:justify-between items-center gap-2">
              <button 
                onClick={toggleTheme}
                className="flex-1 flex justify-center items-center gap-2 p-2.5 rounded-lg bg-slate-700/30 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-all border border-slate-600/30"
                title={isDarkMode ? 'Tema Claro' : 'Tema Escuro'}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                <span className="text-sm font-semibold hidden lg:block">Tema</span>
              </button>
              
              <button 
                onClick={logout}
                className="flex justify-center items-center p-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all border border-red-500/20"
                title="Sair"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto p-4 md:p-8 relative">
        
        {/* Glow de Fundo Geral */}
        <div className="absolute top-0 left-0 w-full h-64 bg-primary/5 blur-[100px] pointer-events-none z-0"></div>

        <div className="relative z-10 max-w-6xl mx-auto h-full">
          {/* TAB: HOME */}
          {activeTab === 'home' && (
            <div className="animate-fade-in flex flex-col items-center justify-center min-h-[80vh]">
              <div className="text-center mb-16">
                <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-accent mb-6 leading-tight">
                  Bem-vindo ao<br />UniStudy Hub
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  A plataforma definitiva para organizar seus estudos universitários, conectar-se com guildas poderosas e evoluir na sua carreira.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                {menuItems.slice(1).map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => setActiveTab(item.id)}
                    className="flex flex-col items-center justify-center p-6 bg-darker border border-slate-700 rounded-2xl hover:border-primary hover:bg-slate-800 transition-all group"
                  >
                    <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all mb-4">
                      {item.icon}
                    </div>
                    <span className="font-bold text-slate-300 group-hover:text-white text-sm text-center">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB: APOSTILAS */}
          {activeTab === 'apostilas' && <CriarApostila />}

          {/* TAB: FORUM */}
          {activeTab === 'forum' && <Forum />}

          {/* TAB: GUILDAS */}
          {activeTab === 'guildas' && <Guildas />}

          {/* TAB: QUIZZES */}
          {activeTab === 'quizzes' && <Quiz />}

          {/* TAB: CURSOS */}
          {activeTab === 'cursos' && <Cursos />}
          
          {/* TAB: PERFIL */}
          {activeTab === 'perfil' && <Perfil />}
        </div>
      </main>
    </div>
  );
}

export default Home;
