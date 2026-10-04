import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { X, Target, Briefcase } from 'lucide-react';

function OnboardingIA() {
  const [modo, setModo] = useState('objetivo'); // 'objetivo' ou 'vaga'
  const [formData, setFormData] = useState({
    area: '',
    nivel: 'Iniciante',
    horas_dia: '2 horas',
    objetivo: '',
    vaga_texto: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/trilha_ia/generate/', formData);
      navigate('/');
    } catch (err) {
      if (!err.response) {
        setError('Erro de conexão: O servidor backend não está respondendo.');
      } else {
        setError(err.response?.data?.error || err.response?.data?.detail || 'Erro ao gerar trilha na IA.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-darker flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-2xl w-full max-w-2xl animate-fade-in relative">
        
        <button 
          onClick={() => navigate('/')} 
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-600 p-2 rounded-full transition-colors"
          title="Fechar"
        >
          <X size={20} />
        </button>

        <h1 className="text-3xl font-black text-white mb-2 text-center">🧠 O Oráculo da IA</h1>
        <p className="text-slate-400 text-center mb-6">
          Olá, {currentUser?.first_name || 'Estudante'}! Escolha como deseja criar sua trilha de estudos:
        </p>

        <div className="flex gap-4 mb-8 bg-slate-900/50 p-2 rounded-xl">
          <button 
            type="button"
            onClick={() => setModo('objetivo')}
            className={`flex-1 py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${modo === 'objetivo' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
          >
            <Target size={20} /> Por Objetivo
          </button>
          <button 
            type="button"
            onClick={() => setModo('vaga')}
            className={`flex-1 py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${modo === 'vaga' ? 'bg-accent text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
          >
            <Briefcase size={20} /> Match de Vagas
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {modo === 'objetivo' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <div>
                <label className="block text-slate-300 font-bold mb-2">O que você quer estudar?</label>
                <input required type="text" name="area" value={formData.area} onChange={handleChange} className="w-full p-3 rounded bg-darker border border-slate-600 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Ex: React.js, Direito..." />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-2">Seu maior objetivo</label>
                <input required type="text" name="objetivo" value={formData.objetivo} onChange={handleChange} className="w-full p-3 rounded bg-darker border border-slate-600 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Ex: Passar na OAB, Criar um app..." />
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <label className="block text-slate-300 font-bold mb-2">Cole a descrição da Vaga de Emprego</label>
              <textarea required name="vaga_texto" value={formData.vaga_texto} onChange={handleChange} rows="4" className="w-full p-3 rounded bg-darker border border-slate-600 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none" placeholder="Cole aqui os requisitos da vaga que você quer (ex: LinkedIn, Gupy...). A IA vai gerar uma trilha focada no que falta para você passar!"></textarea>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-700/50 mt-6">
            <div>
              <label className="block text-slate-300 font-bold mb-2">Seu nível atual</label>
              <select name="nivel" value={formData.nivel} onChange={handleChange} className="w-full p-3 rounded bg-darker border border-slate-600 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                <option>Iniciante</option>
                <option>Intermediário</option>
                <option>Avançado</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-2">Horas por dia</label>
              <select name="horas_dia" value={formData.horas_dia} onChange={handleChange} className="w-full p-3 rounded bg-darker border border-slate-600 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                <option>1 hora</option>
                <option>2 horas</option>
                <option>4 horas</option>
                <option>Tempo integral</option>
              </select>
            </div>
          </div>

          <button disabled={loading} type="submit" className={`w-full text-white font-black py-4 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2 ${modo === 'vaga' ? 'bg-accent hover:bg-accent/80' : 'bg-primary hover:bg-primary/80'}`}>
            {loading ? (
              <span className="animate-pulse">🧠 O Oráculo está lendo e pensando...</span>
            ) : (
              '✨ Gerar Minha Trilha'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default OnboardingIA;
