import React, { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Send, Users } from 'lucide-react';
import api from '../services/api';

function Guildas() {
  const [guildas, setGuildas] = useState([]);
  const [activeGuild, setActiveGuild] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', tags: '' });
  const [error, setError] = useState('');

  const loadGuildas = async () => {
    try {
      const response = await api.get('/squads/');
      setGuildas(response.data);
    } catch { setError('Não foi possível carregar as guildas.'); }
  };

  useEffect(() => { loadGuildas(); }, []);

  const createGuild = async (event) => {
    event.preventDefault();
    try {
      await api.post('/squads/', { ...form, tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean) });
      setForm({ name: '', description: '', tags: '' });
      setShowCreate(false);
      loadGuildas();
    } catch (err) { setError(err.response?.data?.error || 'Não foi possível criar a guilda.'); }
  };

  const toggleMembership = async (guild) => {
    try {
      const response = await api.post(`/squads/${guild.id}/join/`);
      setGuildas(guildas.map(item => item.id === guild.id ? { ...item, isMember: response.data.joined, membersCount: response.data.membersCount } : item));
      if (activeGuild?.id === guild.id) setActiveGuild({ ...guild, isMember: response.data.joined, membersCount: response.data.membersCount });
    } catch (err) { setError(err.response?.data?.error || 'Não foi possível atualizar sua participação.'); }
  };

  const openGuild = async (guild) => {
    setActiveGuild(guild);
    try {
      const response = await api.get(`/squads/${guild.id}/messages/`);
      setMessages(response.data);
    } catch (err) {
      setMessages([]);
      setError(err.response?.data?.error || 'Entre na guilda para acessar a sala.');
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!message.trim() || !activeGuild) return;
    try {
      const response = await api.post(`/squads/${activeGuild.id}/messages/`, { content: message });
      setMessages([...messages, response.data]);
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.error || 'Não foi possível enviar a mensagem.');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
      {!activeGuild ? (
        <>
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-black text-white flex items-center gap-3"><Users className="text-primary" size={32} /> Guildas de Estudo</h2>
              <p className="text-slate-400 mt-1">Encontre colegas e estude em grupo.</p>
            </div>
            <button onClick={() => setShowCreate(!showCreate)} className="bg-primary hover:bg-primary/80 text-white rounded-xl px-5 py-3 font-bold flex items-center gap-2"><Plus size={18} /> Criar guilda</button>
          </div>
          {error && <div className="mb-5 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-red-300">{error}</div>}
          {showCreate && <form onSubmit={createGuild} className="bg-slate-800 border border-slate-700 rounded-xl p-5 mb-6 space-y-3">
            <input required value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} placeholder="Nome da guilda" className="w-full bg-darker border border-slate-700 rounded-lg p-3 text-white" />
            <textarea required value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} placeholder="Qual é o objetivo do grupo?" className="w-full bg-darker border border-slate-700 rounded-lg p-3 text-white" rows={3} />
            <input value={form.tags} onChange={event => setForm({ ...form, tags: event.target.value })} placeholder="Tags separadas por vírgula (ex.: React, Frontend)" className="w-full bg-darker border border-slate-700 rounded-lg p-3 text-white" />
            <button className="bg-primary text-white rounded-lg px-5 py-2 font-bold">Criar guilda</button>
          </form>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {guildas.map(guild => <div key={guild.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex justify-between gap-3">
                <h3 className="text-xl font-bold text-white">{guild.name}</h3>
                <span className="text-primary text-sm">{guild.membersCount}/{guild.maxMembers}</span>
              </div>
              <p className="text-slate-400 mt-3 min-h-12">{guild.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">{guild.tags.map(tag => <span key={tag} className="bg-primary/10 text-primary text-xs rounded-full px-2 py-1">{tag}</span>)}</div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => openGuild(guild)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg py-2 font-bold">Abrir sala</button>
                <button onClick={() => toggleMembership(guild)} className={`flex-1 rounded-lg py-2 font-bold ${guild.isMember ? 'bg-red-500/20 text-red-300' : 'bg-primary text-white'}`}>{guild.isMember ? 'Sair' : 'Entrar'}</button>
              </div>
            </div>)}
          </div>
          {guildas.length === 0 && <p className="text-center text-slate-400 py-12">Nenhuma guilda criada ainda. Crie a primeira.</p>}
        </>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-700 flex items-center gap-3">
            <button onClick={() => setActiveGuild(null)} className="text-slate-400 hover:text-white"><ArrowLeft /></button>
            <div><h2 className="text-2xl font-black text-white">{activeGuild.name}</h2><p className="text-slate-400">{activeGuild.description}</p></div>
          </div>
          <div className="h-80 overflow-y-auto p-5 space-y-3">
            {messages.length === 0 && <p className="text-center text-slate-500 mt-24">Nenhuma mensagem ainda. Comece a conversa.</p>}
            {messages.map(item => <div key={item.id} className="bg-darker border border-slate-700 rounded-lg p-3">
              <div className="text-xs text-primary font-bold mb-1">{item.author}</div>
              <p className="text-slate-200 whitespace-pre-wrap">{item.content}</p>
            </div>)}
          </div>
          <form onSubmit={sendMessage} className="p-4 border-t border-slate-700 flex gap-2">
            <input value={message} onChange={event => setMessage(event.target.value)} placeholder="Mensagem para a guilda..." className="flex-1 bg-darker border border-slate-700 rounded-lg p-3 text-white" />
            <button className="bg-primary text-white rounded-lg px-4"><Send size={18} /></button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Guildas;
