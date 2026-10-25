import React, { useMemo, useState } from 'react';
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
    semanas: 4,
    objetivo: '',
    vaga_texto: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [etapa, setEtapa] = useState('formulario');
  const [habilidades, setHabilidades] = useState([]);
  const [niveis, setNiveis] = useState({});
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
      const response = await api.post('/trilha_ia/requisitos/', {
        curso: formData.area,
        objetivo: formData.objetivo,
        vaga_texto: formData.vaga_texto,
      });
      const encontradas = response.data.habilidades || [];
      setHabilidades(encontradas);
      setNiveis({});
      setEtapa('habilidades');
    } catch (err) {
      if (!err.response) {
        setError('Erro de conexão: O servidor backend não está respondendo.');
      } else {
        setError(err.response?.data?.error || 'Erro ao analisar habilidades na IA.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (habilidades.some((_, index) => niveis[index] === undefined)) {
      setError('Avalie todas as habilidades antes de gerar sua trilha.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const gaps = habilidades
        .map((habilidade, index) => ({
          habilidade: habilidade.nome,
          nivel_atual: Number(niveis[index]),
          nivel_exigido: habilidade.nivel_exigido,
          gap_para_cobrir: Math.max(habilidade.nivel_exigido - Number(niveis[index]), 0),
        }))
        .filter((gap) => gap.gap_para_cobrir > 0);

      await api.post('/trilha_ia/generate/', {
        perfil: {
          nome: currentUser?.first_name || currentUser?.username || 'Estudante',
          curso: formData.area,
          objetivo: modo === 'vaga' ? 'Preparação para a vaga desejada' : formData.objetivo,
          semanas: Number(formData.semanas),
          horasPorDia: Number(formData.horas_dia.split(' ')[0]) || 2,
        },
        gaps,
      });
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

  const nivelLabel = useMemo(() => ['Nenhum', 'Básico', 'Intermediário', 'Avançado'], []);

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
          {etapa === 'formulario'
            ? `Olá, ${currentUser?.first_name || 'Estudante'}! Escolha como deseja criar sua trilha de estudos:`
            : 'Agora avalie seu nível atual em cada habilidade. Seja honesto: isso deixa a rota mais precisa.'}
        </p>

        {etapa === 'formulario' && <div className="flex gap-4 mb-8 bg-slate-900/50 p-2 rounded-xl">
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
        </div>}

        {error && <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded mb-6">{error}</div>}

        {etapa === 'habilidades' ? (
          <div className="space-y-4">
            {habilidades.map((habilidade, index) => (
              <div key={habilidade.nome} className="rounded-xl border border-slate-700 bg-darker p-4">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <h2 className="text-white font-bold text-lg">{habilidade.nome}</h2>
                    <p className="text-slate-400 text-sm">Mercado: nível {habilidade.nivel_exigido}</p>
                  </div>
                  <span className="text-xs text-slate-500">Seu nível</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 1, 2, 3].map((nivel) => (
                    <button
                      key={nivel}
                      type="button"
                      onClick={() => setNiveis({ ...niveis, [index]: nivel })}
                      className={`rounded-lg border px-2 py-2 text-sm transition-colors ${
                        niveis[index] === nivel
                          ? 'border-primary bg-primary text-white'
                          : 'border-slate-600 text-slate-400 hover:border-primary'
                      }`}
                    >
                      {nivel} · {nivelLabel[nivel]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button disabled={loading} type="button" onClick={handleGenerate} className="w-full bg-primary hover:bg-primary/80 text-white font-black py-4 rounded-xl shadow-lg">
              {loading ? '🧠 Desenhando sua rota...' : '✨ Gerar minha trilha'}
            </button>
            <button type="button" onClick={() => setEtapa('formulario')} className="w-full text-slate-400 hover:text-white py-2">
              ← Ajustar informações
            </button>
          </div>
        ) : (
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
            <div>
              <label className="block text-slate-300 font-bold mb-2">Duração da trilha</label>
              <select name="semanas" value={formData.semanas} onChange={handleChange} className="w-full p-3 rounded bg-darker border border-slate-600 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                {[4, 6, 8, 12].map((semanas) => <option key={semanas} value={semanas}>{semanas} semanas</option>)}
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
        )}
      </div>
    </div>
  );
}

export default OnboardingIA;
