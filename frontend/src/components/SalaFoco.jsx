import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Users, Coffee, Brain, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function SalaFoco() {
  const { currentUser } = useAuth();
  
  // Modos de tempo: Pomodoro (25m), Curto (5m), Longo (15m)
  const [modo, setModo] = useState('pomodoro');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Lista simulada de alunos online na sala
  const onlineUsers = [
    { id: 1, name: 'Carlos', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=carlos', status: 'Focado' },
    { id: 2, name: 'Ana', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ana', status: 'Pausa' },
    { id: 3, name: 'Beatriz', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=beatriz', status: 'Focado' },
    { id: 4, name: 'Rafael', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=rafa', status: 'Focado' },
  ];

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      if (soundEnabled) {
        // play sound if we had an audio file
        alert("Tempo finalizado! Hora de descansar (ou focar).");
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, soundEnabled]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    if (modo === 'pomodoro') setTimeLeft(25 * 60);
    if (modo === 'curto') setTimeLeft(5 * 60);
    if (modo === 'longo') setTimeLeft(15 * 60);
  };

  const changeModo = (novoModo) => {
    setIsActive(false);
    setModo(novoModo);
    if (novoModo === 'pomodoro') setTimeLeft(25 * 60);
    if (novoModo === 'curto') setTimeLeft(5 * 60);
    if (novoModo === 'longo') setTimeLeft(15 * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Calcula o progresso do anel
  const getTotalSeconds = () => {
    if (modo === 'pomodoro') return 25 * 60;
    if (modo === 'curto') return 5 * 60;
    if (modo === 'longo') return 15 * 60;
    return 1;
  };
  
  const progress = ((getTotalSeconds() - timeLeft) / getTotalSeconds()) * 100;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-2">Sala de Foco Coletivo</h2>
          <p className="text-slate-400 text-lg">Estude junto com outras pessoas usando a técnica Pomodoro.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* TIMER COLUMN */}
        <div className="lg:col-span-2 flex flex-col items-center bg-darker border border-slate-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative blur */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
          
          {/* Controls */}
          <div className="flex bg-slate-800/80 backdrop-blur rounded-full p-1 mb-12 border border-slate-700">
            <button 
              onClick={() => changeModo('pomodoro')} 
              className={`px-6 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${modo === 'pomodoro' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              <Brain size={16} /> Foco (25m)
            </button>
            <button 
              onClick={() => changeModo('curto')} 
              className={`px-6 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${modo === 'curto' ? 'bg-accent text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              <Coffee size={16} /> Pausa Curta (5m)
            </button>
            <button 
              onClick={() => changeModo('longo')} 
              className={`px-6 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${modo === 'longo' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              <Coffee size={16} /> Pausa Longa (15m)
            </button>
          </div>

          {/* Clock Circle */}
          <div className="relative flex items-center justify-center w-64 h-64 sm:w-80 sm:h-80 mb-12">
            {/* SVG Progress Ring */}
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle cx="50%" cy="50%" r="48%" className="stroke-slate-800" strokeWidth="8" fill="none" />
              <circle 
                cx="50%" cy="50%" r="48%" 
                className={`transition-all duration-1000 ease-linear ${modo === 'pomodoro' ? 'stroke-primary' : modo === 'curto' ? 'stroke-accent' : 'stroke-blue-500'}`} 
                strokeWidth="8" fill="none" 
                strokeDasharray="300%" 
                strokeDashoffset={`${300 - (progress * 3)}%`} 
                strokeLinecap="round" 
              />
            </svg>
            <h1 className="text-7xl sm:text-8xl font-black text-white font-mono tracking-tighter drop-shadow-2xl">
              {formatTime(timeLeft)}
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-6">
            <button 
              onClick={resetTimer}
              className="p-4 bg-slate-800 text-slate-400 hover:text-white rounded-2xl hover:bg-slate-700 transition-all shadow-lg border border-slate-700"
              title="Reiniciar"
            >
              <RotateCcw size={24} />
            </button>
            <button 
              onClick={toggleTimer}
              className={`px-12 py-5 rounded-2xl font-black text-2xl flex items-center gap-3 transition-all shadow-xl hover:scale-105 ${modo === 'pomodoro' ? 'bg-primary hover:bg-primary/90' : modo === 'curto' ? 'bg-accent hover:bg-accent/90' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
            >
              {isActive ? (
                <><Pause size={28} /> Pausar</>
              ) : (
                <><Play size={28} className="ml-1" /> Iniciar</>
              )}
            </button>
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-4 rounded-2xl transition-all shadow-lg border ${soundEnabled ? 'bg-slate-700 text-white border-slate-600' : 'bg-slate-800 text-slate-500 border-slate-700'}`}
              title="Som"
            >
              {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </button>
          </div>
        </div>

        {/* ONLINE USERS COLUMN */}
        <div className="bg-darker border border-slate-700 rounded-3xl p-6 shadow-xl flex flex-col max-h-[600px]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="text-primary" size={20} />
              Estudando Agora
            </h3>
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-bold animate-pulse">
              5 online
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {/* Current User */}
            <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="relative">
                <img src={currentUser?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser?.first_name}`} alt="Você" className="w-12 h-12 rounded-full bg-slate-700 object-cover" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-800 rounded-full"></div>
              </div>
              <div className="flex-1">
                <h4 className="text-white font-bold">{currentUser?.first_name || 'Você'} (Você)</h4>
                <p className="text-xs text-primary font-medium flex items-center gap-1">
                  {isActive && modo === 'pomodoro' ? 'Focado' : isActive ? 'Em Pausa' : 'Preparando...'}
                </p>
              </div>
            </div>

            {/* Other Users */}
            {onlineUsers.map(user => (
              <div key={user.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800/30 transition-colors border border-transparent hover:border-slate-700">
                <div className="relative">
                  <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full bg-slate-700" />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-slate-800 rounded-full ${user.status === 'Focado' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                </div>
                <div className="flex-1">
                  <h4 className="text-slate-300 font-bold">{user.name}</h4>
                  <p className={`text-xs font-medium flex items-center gap-1 ${user.status === 'Focado' ? 'text-red-400' : 'text-yellow-400'}`}>
                    {user.status === 'Focado' ? <Brain size={10} /> : <Coffee size={10} />}
                    {user.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-700 text-center">
            <p className="text-xs text-slate-500">
              Focar em grupo aumenta a chance de conclusão das metas em 70%.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SalaFoco;
