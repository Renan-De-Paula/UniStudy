import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Cursos() {
  const { currentUser } = useAuth();

  const [cursos, setCursos] = useState([
    {
      id: 1,
      title: 'React - O Guia Completo',
      platform: 'Udemy',
      category: 'Frontend',
      description: 'Excelente para quem quer dominar o ecossistema React do zero ao avançado. Muito prático!',
      link: 'https://udemy.com',
      recommendedBy: { name: 'João Silva', avatar: 'https://i.pravatar.cc/150?img=11' },
      upvotes: 24,
    },
    {
      id: 2,
      title: 'Machine Learning A-Z',
      platform: 'Coursera',
      category: 'Inteligência Artificial',
      description: 'Ótima base teórica e prática com Python. Ajuda muito na cadeira de IA.',
      link: 'https://coursera.org',
      recommendedBy: { name: 'Maria Souza', avatar: 'https://i.pravatar.cc/150?img=5' },
      upvotes: 18,
    },
    {
      id: 3,
      title: 'Clean Code e Solid',
      platform: 'Alura',
      category: 'Engenharia de Software',
      description: 'Leitura e prática obrigatória para quem quer escrever código profissional para TCC ou estágio.',
      link: 'https://alura.com.br',
      recommendedBy: { name: 'Carlos Lima', avatar: 'https://i.pravatar.cc/150?img=8' },
      upvotes: 35,
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPlatform, setNewPlatform] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleAddCurso = (e) => {
    e.preventDefault();
    if (!newTitle || !newCategory) return;

    const newCurso = {
      id: Date.nãow(),
      title: newTitle,
      platform: newPlatform || 'Outros',
      category: newCategory,
      description: newDesc,
      link: '#',
      recommendedBy: { name: currentUser.name, avatar: currentUser.avatar },
      upvotes: 1
    };

    setCursos([newCurso, ...cursos]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewPlatform('');
    setNewCategory('');
    setNewDesc('');
  };

  const handleUpvote = (id) => {
    setCursos(cursos.map(curso => {
      if (curso.id === id) {
        return { ...curso, upvotes: curso.upvotes + 1 };
      }
      return curso;
    }));
  };

  return (
    <div className="bg-darker p-6 md:p-8 rounded-xl border border-slate-700 shadow-xl animate-fade-in relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            🎓 Recomendação de Cursos
          </h2>
          <p className="text-slate-400">Descubra os melhores cursos votados pela comunidade para a sua área.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-accent text-white font-bold py-2.5 px-5 rounded-lg shadow-lg hover:shadow-primary/30 transition-all whitespace-nãowrap"
        >
          + Indicar um Curso
        </button>
      </div>

      {/* Grid de Cursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cursos.map(curso => (
          <div key={curso.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-primary transition-all shadow-lg flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold bg-slate-700 text-slate-300 px-2 py-1 rounded">
                {curso.platform}
              </span>
              <span className="text-xs font-semibold text-primary border border-primary/30 bg-primary/10 px-2 py-1 rounded-full">
                {curso.category}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{curso.title}</h3>
            <p className="text-slate-400 text-sm flex-1 mb-6 line-clamp-3">
              {curso.description}
            </p>

            <div className="flex justify-between items-center pt-4 border-t border-slate-700 mt-auto">
              <div className="flex items-center gap-2">
                <img src={curso.recommendedBy.avatar} alt="Avatar" className="w-6 h-6 rounded-full border border-slate-600" />
                <span className="text-xs text-slate-400">por {curso.recommendedBy.name}</span>
              </div>
              
              <button 
                onClick={() => handleUpvote(curso.id)}
                className="flex items-center gap-1 text-sm font-bold text-slate-300 hover:text-emerald-400 transition-colors bg-darker px-3 py-1.5 rounded-lg border border-slate-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenãodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenãodd" />
                </svg>
                {curso.upvotes}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Simples de Criação */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 p-8 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl animate-fade-in">
            <h3 className="text-2xl font-bold text-white mb-6">Indicar um Novo Curso</h3>
            
            <form onSubmit={handleAddCurso} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Nome do Curso</label>
                <input required value={newTitle} onChange={e => setNewTitle(e.target.value)} type="text" className="w-full bg-darker border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary" placeholder="Ex: CS50 Harvard" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Plataforma</label>
                  <input required value={newPlatform} onChange={e => setNewPlatform(e.target.value)} type="text" className="w-full bg-darker border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary" placeholder="Ex: Udemy" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Área / Categoria</label>
                  <input required value={newCategory} onChange={e => setNewCategory(e.target.value)} type="text" className="w-full bg-darker border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary" placeholder="Ex: Frontend" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-slate-400 mb-1">Por que você recomenda?</label>
                <textarea required value={newDesc} onChange={e => setNewDesc(e.target.value)} className="w-full bg-darker border border-slate-700 rounded-lg p-3 text-white h-24 focus:outline-none focus:border-primary resize-none" placeholder="Conte sua experiência..."></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-primary hover:bg-accent text-white rounded-lg font-bold transition-colors">Publicar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cursos;
