import React, { useState, useEffect, useRef } from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, 
  Heading1, Heading2, Type, 
  List, ListOrdered, CheckSquare,
  Quote, Code, Minus, Image as ImageIcon,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Highlighter, Palette,
  BookOpen, Plus, ChevronLeft, Search, Edit3, Eye, FileText, CheckCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function CriarApostila() {
  const [view, setView] = useState('hub'); // 'hub', 'editor', 'reader'
  const [activeApostilaPath, setActiveApostilaPath] = useState(null);
  const [activeApostilaTitle, setActiveApostilaTitle] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');
  const [loadingMarkdown, setLoadingMarkdown] = useState(false);

  const loadApostila = async (path, title) => {
    setActiveApostilaPath(path);
    setActiveApostilaTitle(title);
    setView('reader');
    setLoadingMarkdown(true);
    setMarkdownContent('');
    try {
      const response = await fetch(`/apostilas/${path}/index.md`);
      if (response.ok) {
        const text = await response.text();
        setMarkdownContent(text);
      } else {
        setMarkdownContent('# Erro ao carregar o conteúdo.\nO arquivo não foi encontrado.');
      }
    } catch (err) {
      setMarkdownContent('# Erro de conexão.\nNão foi possível carregar o conteúdo.');
    } finally {
      setLoadingMarkdown(false);
    }
  };

  // Mocks atualizados para apontar para as pastas extraídas
  const apostilasCriadas = [
    { id: 1, title: 'Lógica de Programação (Notion)', lastEdited: 'Hoje', views: 120, likes: 45, status: 'Publicada', path: 'logica' },
    { id: 2, title: 'Programação Java (Notion)', lastEdited: 'Ontem', views: 80, likes: 30, status: 'Publicada', path: 'java' },
  ];

  const apostilasLendo = [
    { id: 3, title: 'Programação Python (Notion)', author: 'Sistema', progress: 0, lastRead: 'Novo', path: 'python' },
    { id: 4, title: 'Adventure Quest', author: 'Sistema', progress: 0, lastRead: 'Novo', path: 'adventure' },
  ];

  const apostilasParticipando = []; // Mantendo vazio por enquanto

  const renderHub = () => (
    <div className="bg-darker p-4 md:p-8 rounded-xl border border-slate-700 shadow-xl animate-fade-in relative overflow-hidden h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 relative z-10">
        <div>
          <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
            <BookOpen className="text-primary" size={32} /> Biblioteca de Apostilas
          </h2>
          <p className="text-slate-400">Aqui estão suas apostilas importadas dos arquivos ZIP do Notion.</p>
        </div>
        <button 
          onClick={() => setView('editor')}
          className="bg-primary hover:bg-accent text-white font-bold py-2.5 px-6 rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2 transition-all transform hover:scale-105"
        >
          <Plus size={20} /> Novo Rascunho
        </button>
      </div>

      <div className="mb-10 relative z-10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Edit3 className="text-purple-400" size={20} /> Criadas por Mim (Extraídas)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apostilasCriadas.map(ap => (
            <div key={ap.id} onClick={() => loadApostila(ap.path, ap.title)} className="bg-slate-800 border border-slate-700 p-5 rounded-xl hover:border-primary transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-3">
                <div className={`text-xs font-bold px-2 py-1 rounded ${ap.status === 'Publicada' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {ap.status}
                </div>
                <button className="text-slate-500 group-hover:text-primary transition-colors">
                  <Eye size={18} />
                </button>
              </div>
              <h4 className="font-bold text-lg text-white mb-1 truncate">{ap.title}</h4>
              <p className="text-xs text-slate-400 mb-4">Atualizado {ap.lastEdited}</p>
              <div className="flex items-center gap-4 text-sm text-slate-500 font-semibold">
                <span className="flex items-center gap-1"><Eye size={16}/> {ap.views}</span>
                <span className="flex items-center gap-1 text-red-400/80">❤ {ap.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10 relative z-10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="text-emerald-400" size={20} /> Sugestões para Leitura
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apostilasLendo.map(ap => (
            <div key={ap.id} onClick={() => loadApostila(ap.path, ap.title)} className="bg-slate-800 border border-slate-700 p-5 rounded-xl hover:border-emerald-500 transition-colors cursor-pointer">
              <h4 className="font-bold text-lg text-white mb-1 truncate">{ap.title}</h4>
              <p className="text-xs text-slate-400 mb-4">Autor: {ap.author}</p>
              
              <div className="w-full bg-darker rounded-full h-2 mb-1 border border-slate-700 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${ap.progress}%` }}></div>
              </div>
              <div className="text-right text-xs font-bold text-emerald-400">
                {ap.progress}% Concluído
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReader = () => (
    <div className="h-full bg-[#0f172a] text-slate-200 rounded-xl overflow-hidden shadow-2xl border border-slate-700 animate-fade-in flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-800/80 sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('hub')} className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 hover:text-white transition-colors" title="Voltar para Biblioteca">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2 text-slate-400 font-medium text-sm">
            <span className="cursor-pointer hover:text-white hidden md:block" onClick={() => setView('hub')}>Apostilas</span>
            <span className="hidden md:block">/</span>
            <span className="text-white font-bold truncate max-w-[200px] md:max-w-md">{activeApostilaTitle}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-16 lg:px-32 py-10 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          {loadingMarkdown ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-bold">Carregando conteúdo Notion...</p>
            </div>
          ) : (
            <div className="prose prose-invert prose-lg max-w-none 
              prose-headings:text-white prose-headings:font-black 
              prose-a:text-primary hover:prose-a:text-accent 
              prose-img:rounded-xl prose-img:shadow-lg prose-img:mx-auto
              prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800
              prose-code:text-accent prose-code:bg-slate-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-blockquote:border-l-primary prose-blockquote:bg-slate-800/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  // Tratamento especial para imagens: forçar caminho relativo baseado na apostila ativa
                  img: ({node, src, alt, ...props}) => {
                    // Se não for um link web (http), assume que é relativo à pasta da apostila
                    const isAbsolute = src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:');
                    const finalSrc = isAbsolute ? src : `/apostilas/${activeApostilaPath}/${src}`;
                    return <img src={finalSrc} alt={alt} {...props} loading="lazy" />;
                  }
                }}
              >
                {markdownContent}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Manteve-se o editor minimalista para nãovas apostilas
  const [title, setTitle] = useState('');
  const [saveStatus, setSaveStatus] = useState('Salvo');
  const editorRef = useRef(null);

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) editorRef.current.focus();
  };

  const insertImage = () => {
    const url = prompt('Insira o link (URL) da imagem:');
    if (url) formatText('insertImage', url);
  };

  const insertChecklist = () => {
    formatText('insertHTML', '<input type="checkbox" style="margin-right: 8px; transform: scale(1.2); cursor: pointer;" />&nbsp;');
  };

  const ToolbarButton = ({ icon: Icon, onClick, btnTitle, colorClass = "text-slate-300 hover:text-white" }) => (
    <button onClick={onClick} className={`p-1.5 hover:bg-slate-700 rounded transition-colors ${colorClass}`} title={btnTitle}>
      <Icon size={18} />
    </button>
  );

  const Divider = () => <div className="w-px h-5 bg-slate-700 my-auto mx-1"></div>;

  const renderEditor = () => (
    <div className="h-full bg-darker text-slate-200 rounded-xl overflow-hidden shadow-2xl border border-slate-700 animate-fade-in flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-800/50 sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('hub')} className="p-1.5 bg-slate-700/50 hover:bg-slate-600 rounded-md text-slate-300 hover:text-white transition-colors" title="Voltar">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2 text-slate-400 font-medium text-sm hidden md:flex">
            <span>Apostilas / Novo Rascunho</span>
          </div>
        </div>
        <button className="bg-primary hover:bg-accent text-white px-4 py-1.5 rounded-md text-sm font-bold shadow-lg shadow-primary/20">
          Publicar
        </button>
      </div>

      {/* Barra de Ferramentas Avançada */}
      <div className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 p-2 flex flex-wrap gap-1 justify-center z-10 shadow-md flex-shrink-0">
        <ToolbarButton icon={Bold} onClick={() => formatText('bold')} btnTitle="Negrito" />
        <ToolbarButton icon={Italic} onClick={() => formatText('italic')} btnTitle="Itálico" />
        <ToolbarButton icon={Underline} onClick={() => formatText('underline')} btnTitle="Sublinhado" />
        <ToolbarButton icon={Strikethrough} onClick={() => formatText('strikeThrough')} btnTitle="Riscado" />
        <Divider />
        <ToolbarButton icon={Heading1} onClick={() => formatText('formatBlock', 'H1')} btnTitle="Título 1" />
        <ToolbarButton icon={Heading2} onClick={() => formatText('formatBlock', 'H2')} btnTitle="Título 2" />
        <ToolbarButton icon={Type} onClick={() => formatText('formatBlock', 'P')} btnTitle="Parágrafo" />
        <Divider />
        <ToolbarButton icon={AlignLeft} onClick={() => formatText('justifyLeft')} btnTitle="Esquerda" />
        <ToolbarButton icon={AlignCenter} onClick={() => formatText('justifyCenter')} btnTitle="Centro" />
        <ToolbarButton icon={AlignRight} onClick={() => formatText('justifyRight')} btnTitle="Direita" />
        <ToolbarButton icon={AlignJustify} onClick={() => formatText('justifyFull')} btnTitle="Justificar" />
        <Divider />
        <ToolbarButton icon={ListOrdered} onClick={() => formatText('insertOrderedList')} btnTitle="Numerada" />
        <ToolbarButton icon={List} onClick={() => formatText('insertUnãorderedList')} btnTitle="Marcadores" />
        <ToolbarButton icon={CheckSquare} onClick={insertChecklist} btnTitle="Checklist" colorClass="text-emerald-400 hover:text-emerald-300" />
        <Divider />
        <ToolbarButton icon={Quote} onClick={() => formatText('formatBlock', 'BLOCKQUOTE')} btnTitle="Citação" />
        <ToolbarButton icon={Code} onClick={() => formatText('formatBlock', 'PRE')} btnTitle="Código" colorClass="text-accent hover:text-white" />
        <ToolbarButton icon={Minus} onClick={() => formatText('insertHorizontalRule')} btnTitle="Divisória" />
        <ToolbarButton icon={ImageIcon} onClick={insertImage} btnTitle="Imagem" colorClass="text-purple-400 hover:text-purple-300" />
        <Divider />
        
        {/* Color Pickers */}
        <div className="flex gap-2 items-center bg-slate-900/50 rounded p-1.5 px-3 border border-slate-700/50 ml-1">
          <div className="flex items-center gap-1.5 relative group" title="Cor do Texto">
            <Palette size={16} className="text-slate-400 group-hover:text-white" />
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-slate-500 shadow-inner group-hover:scale-110 cursor-pointer">
              <input type="color" onChange={(e) => formatText('foreColor', e.target.value)} className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer" defaultValue="#ffffff" />
            </div>
          </div>
          <Divider />
          <div className="flex items-center gap-1.5 relative group" title="Cor de Fundo">
            <Highlighter size={16} className="text-slate-400 group-hover:text-white" />
            <div className="relative w-6 h-6 rounded overflow-hidden border border-slate-500 shadow-inner group-hover:scale-110 cursor-pointer">
              <input type="color" onChange={(e) => formatText('hiliteColor', e.target.value)} className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer" defaultValue="#fef08a" />
            </div>
            <button onClick={() => formatText('hiliteColor', 'transparent')} className="ml-1 w-6 h-6 rounded flex items-center justify-center border border-slate-500 hover:bg-slate-700 hover:scale-110 text-slate-400" title="Remover Fundo">✖</button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-16 lg:px-32 py-8 bg-slate-900">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-none p-0 text-4xl md:text-5xl font-black text-white focus:outline-none mb-6 placeholder-slate-600"
            placeholder="Título da Apostila"
          />
          
          <style>{`
            .editor-content blockquote { border-left: 4px solid #6d28d9; padding-left: 1rem; margin-left: 0; color: #94a3b8; font-style: italic; background-color: rgba(30, 41, 59, 0.5); padding: 1rem; border-radius: 0.5rem; }
            .editor-content pre { background-color: #020617; padding: 1rem; border-radius: 0.5rem; font-family: monãospace; border: 1px solid #334155; overflow-x: auto; color: #38bdf8; }
            .editor-content hr { border-color: #334155; margin: 2rem 0; }
            .editor-content img { max-width: 100%; border-radius: 0.5rem; margin: 1rem 0; }
            .editor-content ul { list-style-type: disc; padding-left: 2rem; margin: 1rem 0; }
            .editor-content ol { list-style-type: decimal; padding-left: 2rem; margin: 1rem 0; }
          `}</style>

          <div 
            ref={editorRef}
            contentEditable
            className="editor-content w-full min-h-[60vh] bg-transparent border-none p-0 text-lg text-slate-300 focus:outline-none pb-32 outline-none"
            placeholder="Comece a digitar..."
            style={{ lineHeight: '1.8' }}
          />
        </div>
      </div>
    </div>
  );

  return view === 'hub' ? renderHub() : view === 'reader' ? renderReader() : renderEditor();
}

export default CriarApostila;
