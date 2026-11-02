import React, { useState, useEffect, useRef } from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, 
  Heading1, Heading2, Heading3, Type, 
  List, ListOrdered, CheckSquare,
  Quote, Code, Minus, Image as ImageIcon,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Highlighter, Palette,
  BookOpen, Plus, ChevronLeft, Search, Edit3, Eye, FileText, CheckCircle,
  Trash2, Globe, Clock, User, Sparkles, Loader2, Lock, Share2,
  Upload, Link as LinkIcon, X, Sliders, Check, Maximize2, Lightbulb,
  Table as TableIcon, Copy, Printer, ListTree, Terminal, ArrowUp,
  MessageSquare, Send, MessageCircle,
  Minimize2, ZoomIn, ZoomOut, Sun, Moon,
  Star, Bookmark,
  Columns, Rows, Grid, MoveLeft, MoveRight, Layers, FileCode, Code2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { SUPPORTED_LANGUAGES, highlightCode, generateVsCodeHtml } from '../utils/codeHighlighter';

function CriarApostila() {
  const { currentUser, updateCurrentUser } = useAuth();
  const [view, setView] = useState('hub'); // 'hub', 'editor', 'reader'
  
  // Apostilas do Banco de Dados
  const [materials, setMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(true);

  // Apostila Ativa para Leitura
  const [activeMaterial, setActiveMaterial] = useState(null);
  const [loadingContent, setLoadingContent] = useState(false);

  // Estados do Editor
  const [title, setTitle] = useState('');
  const [privacy, setPrivacy] = useState('PUBLIC');
  const [isPublishing, setIsPublishing] = useState(false);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  // Modal de Inserção de Imagem
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageModalTab, setImageModalTab] = useState('upload'); // 'upload' ou 'url'
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Fase 1: Menu de Caixas de Destaque (Callouts)
  const [showCalloutMenu, setShowCalloutMenu] = useState(false);

  // Fechar menu de callouts ao clicar fora
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (showCalloutMenu && !e.target.closest('.callout-menu-container')) {
        setShowCalloutMenu(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [showCalloutMenu]);


  // Fase 2: Sumário / TOC
  const readerBodyRef = useRef(null);
  const readerContainerRef = useRef(null);
  const [tocItems, setTocItems] = useState([]);
  const [activeHeadingId, setActiveHeadingId] = useState('');
  const [showMobileToc, setShowMobileToc] = useState(false);

  // Fase 5: Estatísticas de Palavras e Tempo de Leitura
  const [editorStats, setEditorStats] = useState({ words: 0, chars: 0, readingTime: 1 });
  const [readerStats, setReaderStats] = useState({ words: 0, readingTime: 1 });

  // Fase 8: Ajustes Recomendados (Edição, Busca e Progresso de Leitura)
  const [editingMaterialId, setEditingMaterialId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Fase 9: Sistema de Perguntas & Comentários nas Apostilas
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Fase 10: Modo Foco / Leitura Imersiva e Tipografia
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [readerFontSize, setReaderFontSize] = useState(100); // 85, 100, 115, 130, 150
  const [readerTheme, setReaderTheme] = useState('dark'); // 'dark', 'sepia', 'light'
  const [showTypographyMenu, setShowTypographyMenu] = useState(false);

  // Fase 11: Favoritos / "Minha Lista"
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(`unistudy_favs_${currentUser?.id || 'guest'}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'favorites', 'community', 'notion'

  // Oráculo IA no Leitor (Fase 13)
  const [showOracleModal, setShowOracleModal] = useState(false);
  const [oracleAction, setOracleAction] = useState('summarize'); // 'summarize', 'explain_eli5', 'quiz', 'ask'
  const [oracleLoading, setOracleLoading] = useState(false);
  const [oracleResult, setOracleResult] = useState(null);
  const [oracleResultType, setOracleResultType] = useState('text'); // 'text' | 'quiz'
  const [oracleQuestion, setOracleQuestion] = useState('');
  const [oracleQuizAnswers, setOracleQuizAnswers] = useState({}); // { [qIdx]: selectedOptionIdx }
  const [oracleQuizXpEarned, setOracleQuizXpEarned] = useState(false);
  const [oracleCopied, setOracleCopied] = useState(false);

  const handleCallOracleAI = async (actionToCall, customQuestion = '') => {
    if (!activeMaterial) return;
    setOracleLoading(true);
    setOracleAction(actionToCall);
    setOracleQuizAnswers({});
    setOracleQuizXpEarned(false);
    setOracleCopied(false);

    try {
      const payload = {
        action: actionToCall,
        title: activeMaterial.title,
        content: activeMaterial.content || '',
        question: customQuestion || oracleQuestion
      };
      const res = await api.post('/repository/oracle_ai/', payload);
      setOracleResult(res.data.result);
      setOracleResultType(res.data.type || (Array.isArray(res.data.result) ? 'quiz' : 'text'));
      if (actionToCall === 'ask') {
        setOracleQuestion('');
      }
    } catch (err) {
      console.error('Erro ao consultar Oráculo IA:', err);
      setOracleResult('Não foi possível conectar ao Oráculo no momento. Tente novamente em instantes.');
      setOracleResultType('text');
    } finally {
      setOracleLoading(false);
    }
  };

  const handleSelectQuizOption = (qIdx, optIdx) => {
    if (oracleQuizAnswers[qIdx] !== undefined) return;
    const nextAnswers = { ...oracleQuizAnswers, [qIdx]: optIdx };
    setOracleQuizAnswers(nextAnswers);

    if (Array.isArray(oracleResult) && Object.keys(nextAnswers).length === oracleResult.length) {
      const correctCount = oracleResult.reduce((acc, q, idx) => {
        return acc + (nextAnswers[idx] === q.correct ? 1 : 0);
      }, 0);
      if (correctCount > 0 && !oracleQuizXpEarned && updateCurrentUser) {
        updateCurrentUser({ xp: (currentUser?.xp || 0) + 20 });
        setOracleQuizXpEarned(true);
      }
    }
  };

  const handleCopyOracleResult = () => {
    if (typeof oracleResult === 'string') {
      navigator.clipboard.writeText(oracleResult);
      setOracleCopied(true);
      setTimeout(() => setOracleCopied(false), 2000);
    }
  };

  // Imagem Ativa Selecionada no Editor para Redimensionamento e Posicionamento
  const [selectedImg, setSelectedImg] = useState(null);
  const [imgWidth, setImgWidth] = useState(75);
  const [imgAlign, setImgAlign] = useState('center'); // 'left', 'center', 'right', 'float-left', 'float-right', 'full'

  // Estados de Tabela Interativa
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableColsInput, setTableColsInput] = useState(2);
  const [tableRowsInput, setTableRowsInput] = useState(2);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);

  // Estados de Bloco de Código VS Code (IDE)
  const [showVsCodeModal, setShowVsCodeModal] = useState(false);
  const [vsCodeLanguage, setVsCodeLanguage] = useState('javascript');
  const [vsCodeFileName, setVsCodeFileName] = useState('main.js');
  const [vsCodeSnippet, setVsCodeSnippet] = useState(SUPPORTED_LANGUAGES[0].defaultCode);
  const [selectedCodeContainer, setSelectedCodeContainer] = useState(null);

  // Apostilas Estáticas do Acervo Notion
  const notionHandouts = [
    { id: 'notion-logica', title: 'Lógica de Programação', category: 'Fundamentos', path: 'logica', author: 'UniStudy Notion', icon: '💡', desc: 'Conceitos fundamentais de algoritmos, variáveis e pseudocódigo.' },
    { id: 'notion-java', title: 'Programação Java', category: 'Backend', path: 'java', author: 'UniStudy Notion', icon: '☕', desc: 'Do básico à orientação a objetos, classes, métodos e boas práticas.' },
    { id: 'notion-python', title: 'Programação Python', category: 'Data & Dev', path: 'python', author: 'UniStudy Notion', icon: '🐍', desc: 'Sintaxe limpa, estruturas de controle, listas e manipulação de dados.' },
    { id: 'notion-adventure', title: 'Adventure Quest — Lógica & RPG', category: 'Gamificação', path: 'adventure', author: 'UniStudy Notion', icon: '⚔️', desc: 'Aprenda programação resolvendo enigmas e missões no reino mágico.' },
  ];

  // Carrega materiais reais do Backend Django
  const fetchMaterials = async () => {
    try {
      setLoadingMaterials(true);
      const res = await api.get('/repository/materials/');
      setMaterials(res.data);
    } catch (err) {
      console.error('Erro ao buscar apostilas do repositório:', err);
    } finally {
      setLoadingMaterials(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Abrir uma apostila estática do Notion
  const openNotionApostila = async (item) => {
    setActiveMaterial({
      isNotion: true,
      id: item.id,
      title: item.title,
      author: item.author,
      path: item.path,
      content: ''
    });
    setComments([]);
    setView('reader');
    setLoadingContent(true);
    try {
      const response = await fetch(`/apostilas/${item.path}/index.md`);
      if (response.ok) {
        const text = await response.text();
        setActiveMaterial(prev => ({ ...prev, content: text }));
      } else {
        setActiveMaterial(prev => ({ ...prev, content: '# Erro ao carregar o conteúdo.\nO arquivo Markdown não foi encontrado.' }));
      }
    } catch (err) {
      setActiveMaterial(prev => ({ ...prev, content: '# Erro de conexão.\nNão foi possível carregar o arquivo da apostila.' }));
    } finally {
      setLoadingContent(false);
    }
  };

  // Fase 11: Persistência e Gerenciamento de Favoritos
  useEffect(() => {
    try {
      localStorage.setItem(`unistudy_favs_${currentUser?.id || 'guest'}`, JSON.stringify(favorites));
    } catch (e) {
      console.error('Erro ao salvar favoritos:', e);
    }
  }, [favorites, currentUser]);

  const toggleFavorite = (id, e) => {
    if (e) e.stopPropagation();
    if (!id) return;
    setFavorites(prev => {
      const exists = prev.includes(id);
      return exists ? prev.filter(item => item !== id) : [...prev, id];
    });
  };

  const isFavorited = (id) => id ? favorites.includes(id) : false;

  // Abrir uma apostila real do Banco de Dados
  const openDatabaseMaterial = (mat) => {
    setActiveMaterial({
      isNotion: false,
      id: mat.id,
      title: mat.title,
      author: mat.uploaded_by?.username || 'Aluno UniStudy',
      authorRole: mat.uploaded_by?.role,
      authorId: mat.uploaded_by?.id,
      privacy: mat.privacy,
      createdAt: mat.created_at,
      content_html: mat.content_html
    });
    setView('reader');
    fetchComments(mat.id);
  };

  // Iniciar criação de nova apostila
  const handleStartCreate = () => {
    setEditingMaterialId(null);
    setTitle('');
    setPrivacy('PUBLIC');
    setSelectedImg(null);
    if (editorRef.current) editorRef.current.innerHTML = '';
    setEditorStats({ words: 0, chars: 0, readingTime: 1 });
    setView('editor');
  };

  // Iniciar edição de apostila existente
  const handleStartEdit = (mat, e) => {
    if (e) e.stopPropagation();
    setEditingMaterialId(mat.id);
    setTitle(mat.title);
    setPrivacy(mat.privacy || 'PUBLIC');
    setSelectedImg(null);
    setView('editor');
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = mat.content_html || '';
        updateEditorStats();
      }
    }, 120);
  };

  // Excluir apostila criada
  const handleDeleteMaterial = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Tem certeza de que deseja excluir esta apostila?')) return;

    try {
      await api.delete(`/repository/materials/${id}/`);
      setMaterials(prev => prev.filter(m => m.id !== id));
      if (activeMaterial?.id === id) {
        setView('hub');
      }
    } catch (err) {
      alert('Não foi possível excluir a apostila.');
    }
  };

  // Publicar ou Atualizar apostila no Backend real
  const handlePublish = async () => {
    // Deseleciona qualquer imagem ou célula antes de salvar para não gravar a classe de seleção
    if (editorRef.current) {
      editorRef.current.querySelectorAll('img').forEach(img => img.classList.remove('selected-img'));
      editorRef.current.querySelectorAll('.selected-cell').forEach(c => c.classList.remove('selected-cell'));
    }

    if (!title.trim()) {
      alert('Por favor, informe um título para a sua apostila.');
      return;
    }

    const htmlContent = editorRef.current ? editorRef.current.innerHTML.trim() : '';
    if (!htmlContent || htmlContent === '<br>' || htmlContent === '<p><br></p>') {
      alert('Por favor, escreva o conteúdo da apostila antes de salvar.');
      return;
    }

    setIsPublishing(true);
    try {
      if (editingMaterialId) {
        await api.patch(`/repository/materials/${editingMaterialId}/`, {
          title: title.trim(),
          privacy: privacy,
          content_html: htmlContent
        });
        alert('🎉 Alterações salvas com sucesso na apostila!');
      } else {
        await api.post('/repository/materials/', {
          title: title.trim(),
          material_type: 'HANDOUT',
          privacy: privacy,
          content_html: htmlContent
        });
        alert('🎉 Apostila publicada com sucesso na biblioteca da comunidade!');
      }

      setTitle('');
      setEditingMaterialId(null);
      if (editorRef.current) editorRef.current.innerHTML = '';
      await fetchMaterials();
      setView('hub');
    } catch (err) {
      console.error('Erro ao salvar:', err);
      alert(err.response?.data?.detail || 'Erro ao salvar apostila no servidor.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Controle de rolagem e botão voltar ao topo
  const handleReaderScroll = (e) => {
    const el = e.currentTarget;
    const scrollTop = el.scrollTop;
    const scrollHeight = el.scrollHeight - el.clientHeight;
    if (scrollHeight > 0) {
      const progress = Math.min(100, Math.max(0, Math.round((scrollTop / scrollHeight) * 100)));
      setReadingProgress(progress);
    }
    setShowScrollTop(scrollTop > 200);
  };

  const scrollToTop = () => {
    if (readerContainerRef.current) {
      readerContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Fase 9: Carregar Comentários da Apostila
  const fetchComments = async (materialId) => {
    try {
      setLoadingComments(true);
      const res = await api.get(`/repository/material_comments/?material=${materialId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Erro ao buscar comentários da apostila:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  // Fase 9: Enviar Nova Dúvida ou Comentário
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    if (!activeMaterial?.id) return;

    setSubmittingComment(true);
    try {
      const res = await api.post('/repository/material_comments/', {
        material: activeMaterial.id,
        content: newCommentText.trim()
      });
      setComments(prev => [...prev, res.data]);
      setNewCommentText('');
    } catch (err) {
      console.error('Erro ao postar comentário:', err);
      alert(err.response?.data?.detail || 'Não foi possível publicar seu comentário.');
    } finally {
      setSubmittingComment(false);
    }
  };

  // Fase 9: Excluir Comentário
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Tem certeza de que deseja excluir este comentário?')) return;
    try {
      await api.delete(`/repository/material_comments/${commentId}/`);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      alert('Não foi possível excluir o comentário.');
    }
  };

  const scrollToComments = () => {
    const el = document.getElementById('comments-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Fase 10: Tecla Esc para sair do Modo Foco
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFocusMode) {
        setIsFocusMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode]);

  // Funções de Formatação de Texto e Títulos (H1, H2, H3, P)
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) editorRef.current.focus();
  };

  const formatHeading = (tag) => {
    // Cross-browser: Chrome, Edge, Firefox aceitam '<H1>', '<H2>', '<H3>', '<P>'
    document.execCommand('formatBlock', false, `<${tag.toUpperCase()}>`);
    if (editorRef.current) editorRef.current.focus();
  };

  const insertChecklist = () => {
    formatText('insertHTML', '<input type="checkbox" style="margin-right: 8px; transform: scale(1.2); cursor: pointer;" />&nbsp;');
  };

  // Fase 1: Inserção de Caixas de Destaque (Callouts)
  const insertCallout = (type) => {
    if (editorRef.current) editorRef.current.focus();

    const configs = {
      dica: {
        title: '💡 DICA DE ESTUDO',
        color: '#f59e0b',
        titleColor: '#fbbf24',
        textColor: '#fef3c7',
        bg: 'rgba(245, 158, 11, 0.12)',
        border: 'rgba(245, 158, 11, 0.35)',
        placeholder: 'Insira aqui uma dica importante, macete ou detalhe de prova...'
      },
      atencao: {
        title: '⚠️ PONTO DE ATENÇÃO',
        color: '#ef4444',
        titleColor: '#f87171',
        textColor: '#fee2e2',
        bg: 'rgba(239, 68, 68, 0.12)',
        border: 'rgba(239, 68, 68, 0.35)',
        placeholder: 'Cuidado com erros frequentes, exceções ou pegadinhas comuns...'
      },
      conceito: {
        title: 'ℹ️ CONCEITO CHAVE',
        color: '#8b5cf6',
        titleColor: '#a78bfa',
        textColor: '#ede9fe',
        bg: 'rgba(139, 92, 246, 0.12)',
        border: 'rgba(139, 92, 246, 0.35)',
        placeholder: 'Definição teórica formal, termo técnico ou regra essencial...'
      },
      exemplo: {
        title: '✅ EXEMPLO PRÁTICO',
        color: '#10b981',
        titleColor: '#34d399',
        textColor: '#d1fae5',
        bg: 'rgba(16, 185, 129, 0.12)',
        border: 'rgba(16, 185, 129, 0.35)',
        placeholder: 'Exemplo prático de código ou exercício resolvido passo a passo...'
      }
    };

    const cfg = configs[type] || configs.dica;
    const calloutHtml = `
      <div class="callout callout-${type}" style="border: 1px solid ${cfg.border}; border-left: 5px solid ${cfg.color}; background-color: ${cfg.bg}; border-radius: 0.75rem; padding: 1rem 1.25rem; margin: 1.25rem 0;">
        <div style="font-weight: 800; color: ${cfg.titleColor}; margin-bottom: 0.35rem; font-size: 0.9rem; letter-spacing: 0.04em;">
          ${cfg.title}
        </div>
        <div style="color: ${cfg.textColor}; font-size: 0.95rem; line-height: 1.6;">
          ${cfg.placeholder}
        </div>
      </div>
      <p><br></p>
    `;

    document.execCommand('insertHTML', false, calloutHtml);
    setShowCalloutMenu(false);
    updateEditorStats();
  };

  // Fase 3: Inserção de Bloco de Código Estilo Terminal
  const insertTerminalCode = () => {
    if (editorRef.current) editorRef.current.focus();
    const terminalHtml = `
      <div class="code-terminal-block" style="margin: 1.5rem 0; border-radius: 0.75rem; overflow: hidden; border: 1px solid #334155; background: #030712; box-shadow: 0 4px 20px rgba(0,0,0,0.35);">
        <div style="background: #1e293b; padding: 0.5rem 1rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; user-select: none;">
          <div style="display: flex; gap: 6px; align-items: center;">
            <span style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444; display: inline-block;"></span>
            <span style="width: 10px; height: 10px; border-radius: 50%; background: #f59e0b; display: inline-block;"></span>
            <span style="width: 10px; height: 10px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
            <span style="margin-left: 8px; font-family: monospace; font-size: 0.75rem; font-weight: 700; color: #94a3b8;">terminal / code</span>
          </div>
          <span style="font-family: monospace; font-size: 0.7rem; color: #64748b;">UniStudy Code</span>
        </div>
        <pre style="margin: 0; padding: 1.25rem; font-family: 'Fira Code', 'Consolas', monospace; font-size: 0.9rem; color: #38bdf8; background: transparent; line-height: 1.6; overflow-x: auto; white-space: pre-wrap;">// Digite ou cole seu código aqui...</pre>
      </div>
      <p><br></p>
    `;
    document.execCommand('insertHTML', false, terminalHtml);
    updateEditorStats();
  };

  // Fase 4: Inserção de Tabela Interativa (2x2, 3x3 ou Personalizada)
  const insertTable = () => {
    setShowTableModal(true);
  };

  const insertInteractiveTable = (cols = 2, rows = 2) => {
    if (editorRef.current) editorRef.current.focus();
    const cleanCols = Math.max(1, parseInt(cols, 10) || 2);
    const cleanRows = Math.max(2, parseInt(rows, 10) || 2);

    let theadThs = '';
    for (let c = 1; c <= cleanCols; c++) {
      theadThs += `<th style="padding: 0.75rem 1rem; border: 1px solid #334155; font-weight: 700;">Coluna ${c}</th>`;
    }

    let tbodyRows = '';
    const bodyRowsCount = Math.max(1, cleanRows - 1);
    for (let r = 1; r <= bodyRowsCount; r++) {
      let tds = '';
      for (let c = 1; c <= cleanCols; c++) {
        tds += `<td style="padding: 0.75rem 1rem; border: 1px solid #334155;">Dado ${r}.${c}</td>`;
      }
      const bg = r % 2 === 1 ? 'rgba(15, 23, 42, 0.7)' : 'rgba(30, 41, 59, 0.4)';
      tbodyRows += `<tr style="background-color: ${bg}; color: #cbd5e1;">${tds}</tr>`;
    }

    const tableHtml = `
      <div class="interactive-table-container" style="overflow-x: auto; margin: 1.5rem 0;">
        <table class="interactive-table" style="width: 100%; border-collapse: collapse; border-radius: 0.5rem; overflow: hidden; border: 1px solid #334155; font-size: 0.95rem;">
          <thead>
            <tr style="background-color: #1e293b; color: #ffffff; text-align: left;">
              ${theadThs}
            </tr>
          </thead>
          <tbody>
            ${tbodyRows}
          </tbody>
        </table>
      </div>
      <p><br></p>
    `;
    document.execCommand('insertHTML', false, tableHtml);
    setShowTableModal(false);
    updateEditorStats();
  };

  const selectTable = (tableEl, cellEl) => {
    deselectImg();
    setSelectedCodeContainer(null);
    if (editorRef.current) {
      editorRef.current.querySelectorAll('.selected-cell').forEach(c => c.classList.remove('selected-cell'));
    }
    if (cellEl) {
      cellEl.classList.add('selected-cell');
      setSelectedCell(cellEl);
    }
    setSelectedTable(tableEl);
  };

  const deselectTable = () => {
    if (editorRef.current) {
      editorRef.current.querySelectorAll('.selected-cell').forEach(c => c.classList.remove('selected-cell'));
    }
    setSelectedTable(null);
    setSelectedCell(null);
  };

  const addTableRow = () => {
    if (!selectedTable) return;
    const tbody = selectedTable.querySelector('tbody') || selectedTable;
    let targetRow = selectedCell ? selectedCell.closest('tr') : null;
    if (!targetRow || !targetRow.parentElement) {
      targetRow = tbody.querySelector('tr:last-child') || selectedTable.querySelector('tr:last-child');
    }

    const sampleRow = selectedTable.querySelector('tr');
    const colCount = sampleRow ? sampleRow.children.length : 2;

    const newRow = document.createElement('tr');
    const rowIdx = tbody.querySelectorAll('tr').length + 1;
    newRow.style.backgroundColor = rowIdx % 2 === 1 ? 'rgba(15, 23, 42, 0.7)' : 'rgba(30, 41, 59, 0.4)';
    newRow.style.color = '#cbd5e1';

    for (let c = 1; c <= colCount; c++) {
      const td = document.createElement('td');
      td.style.padding = '0.75rem 1rem';
      td.style.border = '1px solid #334155';
      td.innerText = `Dado ${rowIdx}.${c}`;
      newRow.appendChild(td);
    }

    if (targetRow && targetRow.parentElement) {
      targetRow.insertAdjacentElement('afterend', newRow);
    } else {
      tbody.appendChild(newRow);
    }
    updateEditorStats();
  };

  const addTableColumn = () => {
    if (!selectedTable) return;
    const colIdx = selectedCell ? Array.from(selectedCell.parentElement.children).indexOf(selectedCell) : -1;
    const rows = selectedTable.querySelectorAll('tr');
    if (rows.length === 0) return;

    rows.forEach((row, rIdx) => {
      const isHeader = row.parentElement?.tagName === 'THEAD' || rIdx === 0;
      const cell = document.createElement(isHeader ? 'th' : 'td');
      cell.style.padding = '0.75rem 1rem';
      cell.style.border = '1px solid #334155';
      if (isHeader) {
        cell.style.fontWeight = '700';
        cell.innerText = `Nova Coluna`;
      } else {
        cell.innerText = `Dado`;
      }

      if (colIdx >= 0 && colIdx < row.children.length) {
        row.children[colIdx].insertAdjacentElement('afterend', cell);
      } else {
        row.appendChild(cell);
      }
    });
    updateEditorStats();
  };

  const deleteTableRow = () => {
    if (!selectedTable) return;
    const targetRow = selectedCell ? selectedCell.closest('tr') : selectedTable.querySelector('tbody tr:last-child');
    if (!targetRow) return;

    const allRows = selectedTable.querySelectorAll('tr');
    if (allRows.length <= 1) {
      deleteSelectedTable();
      return;
    }
    targetRow.remove();
    setSelectedCell(null);
    updateEditorStats();
  };

  const deleteTableColumn = () => {
    if (!selectedTable) return;
    const colIdx = selectedCell ? Array.from(selectedCell.parentElement.children).indexOf(selectedCell) : -1;
    const rows = selectedTable.querySelectorAll('tr');
    if (rows.length === 0) return;

    const colCount = rows[0].children.length;
    if (colCount <= 1) {
      deleteSelectedTable();
      return;
    }

    const targetIdx = colIdx >= 0 ? colIdx : colCount - 1;
    rows.forEach(row => {
      if (row.children[targetIdx]) {
        row.children[targetIdx].remove();
      }
    });
    setSelectedCell(null);
    updateEditorStats();
  };

  const deleteSelectedTable = () => {
    if (!selectedTable) return;
    const container = selectedTable.closest('.interactive-table-container') || selectedTable;
    container.remove();
    deselectTable();
    updateEditorStats();
  };

  // Operações de Código Estilo VS Code (IDE)
  const openVsCodeModal = (existingContainer = null) => {
    if (existingContainer) {
      setSelectedCodeContainer(existingContainer);
      const lang = existingContainer.getAttribute('data-lang') || 'javascript';
      const filename = existingContainer.getAttribute('data-filename') || 'main.js';
      const code = existingContainer.querySelector('code')?.innerText || '';
      setVsCodeLanguage(lang);
      setVsCodeFileName(filename);
      setVsCodeSnippet(code);
    } else {
      setSelectedCodeContainer(null);
      setVsCodeLanguage('javascript');
      setVsCodeFileName('main.js');
      setVsCodeSnippet(SUPPORTED_LANGUAGES[0].defaultCode);
    }
    setShowVsCodeModal(true);
  };

  const handleLanguageChange = (newLang) => {
    setVsCodeLanguage(newLang);
    const langConf = SUPPORTED_LANGUAGES.find(l => l.id === newLang);
    if (langConf) {
      const baseName = vsCodeFileName.replace(/\.[^/.]+$/, '');
      setVsCodeFileName(`${baseName || 'script'}${langConf.ext}`);
      if (!vsCodeSnippet || vsCodeSnippet.startsWith('// Exemplo') || vsCodeSnippet.startsWith('# Exemplo') || vsCodeSnippet.startsWith('<!DOCTYPE') || vsCodeSnippet.startsWith('-- Consulta') || vsCodeSnippet.startsWith('#!/bin/bash')) {
        setVsCodeSnippet(langConf.defaultCode);
      }
    }
  };

  const insertOrUpdateVsCodeBlock = () => {
    const html = generateVsCodeHtml({
      code: vsCodeSnippet || '// Seu código aqui...',
      language: vsCodeLanguage,
      fileName: vsCodeFileName
    });

    if (selectedCodeContainer && selectedCodeContainer.parentElement) {
      selectedCodeContainer.outerHTML = html;
    } else {
      if (editorRef.current) editorRef.current.focus();
      document.execCommand('insertHTML', false, html);
    }

    setShowVsCodeModal(false);
    setSelectedCodeContainer(null);
    updateEditorStats();
  };

  // Fase 5: Atualização em Tempo Real do Contador de Palavras e Tempo de Leitura
  const updateEditorStats = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
    const chars = text.length;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    setEditorStats({ words, chars, readingTime });
  };

  // Fase 7: Atalhos Rápidos de Teclado e Suporte a tecla Tab para indentação
  const handleEditorKeyDown = (e) => {
    // Tecla Tab: indentar com 4 espaços sem perder o foco
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
      updateEditorStats();
      return;
    }

    // Ctrl+S: Atalho para Publicar / Salvar
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      handlePublish();
      return;
    }
  };

  // Fase 2, 3, 5: Extração Dinâmica de Sumário, Cálculo de Estatísticas e Botão de Copiar no Leitor
  const extractToc = () => {
    if (!readerBodyRef.current) return;
    const headings = readerBodyRef.current.querySelectorAll('h1, h2, h3');
    const items = [];
    headings.forEach((h, index) => {
      const id = h.id || `toc-heading-${index}`;
      h.id = id;
      const text = h.innerText.replace(/^[#\s]+/, '').trim();
      if (text) {
        items.push({
          id,
          text,
          level: h.tagName.toLowerCase()
        });
      }
    });
    setTocItems(items);
  };

  const calculateReaderStats = () => {
    if (!readerBodyRef.current) return;
    const text = readerBodyRef.current.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    setReaderStats({ words, readingTime });
  };

  const attachCopyButtons = () => {
    if (!readerBodyRef.current) return;
    const preBlocks = readerBodyRef.current.querySelectorAll('pre');
    preBlocks.forEach((pre) => {
      if (pre.querySelector('.copy-code-btn') || pre.closest('.vscode-ide-container')) return;
      pre.style.position = 'relative';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'copy-code-btn no-print';
      btn.innerText = '📋 Copiar';
      btn.setAttribute('title', 'Copiar código para a área de transferência');
      btn.style.position = 'absolute';
      btn.style.top = '10px';
      btn.style.right = '10px';
      btn.style.fontSize = '11px';
      btn.style.fontWeight = '700';
      btn.style.padding = '4px 10px';
      btn.style.borderRadius = '6px';
      btn.style.backgroundColor = '#1e293b';
      btn.style.color = '#cbd5e1';
      btn.style.border = '1px solid #475569';
      btn.style.cursor = 'pointer';
      btn.style.transition = 'all 0.2s';
      btn.style.zIndex = '10';

      btn.addEventListener('mouseenter', () => {
        btn.style.backgroundColor = '#334155';
        btn.style.color = '#ffffff';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.backgroundColor = '#1e293b';
        btn.style.color = '#cbd5e1';
      });

      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const clone = pre.cloneNode(true);
        const internalBtn = clone.querySelector('.copy-code-btn');
        if (internalBtn) internalBtn.remove();
        const codeText = clone.innerText.trim();
        navigator.clipboard.writeText(codeText);
        btn.innerText = '✅ Copiado!';
        btn.style.color = '#34d399';
        btn.style.borderColor = '#10b981';
        setTimeout(() => {
          btn.innerText = '📋 Copiar';
          btn.style.color = '#cbd5e1';
          btn.style.borderColor = '#475569';
        }, 2000);
      });

      pre.appendChild(btn);
    });
  };

  useEffect(() => {
    if (view === 'reader' && !loadingContent) {
      const timer = setTimeout(() => {
        extractToc();
        calculateReaderStats();
        attachCopyButtons();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [view, activeMaterial, loadingContent]);

  // ==========================================
  // INSERÇÃO E GERENCIAMENTO DE IMAGENS
  // ==========================================
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (PNG, JPG, WebP, GIF).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('A imagem é muito grande. Escolha uma imagem de até 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      insertImageToEditor(event.target.result);
      setShowImageModal(false);
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input
  };

  const handleUrlImageSubmit = (e) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;
    insertImageToEditor(imageUrlInput.trim());
    setImageUrlInput('');
    setShowImageModal(false);
  };

  const insertImageToEditor = (src) => {
    if (editorRef.current) editorRef.current.focus();
    const imgId = 'img_' + Date.now();
    const imgHtml = `<img id="${imgId}" src="${src}" alt="Imagem da Apostila" style="width: 75%; max-width: 100%; border-radius: 0.75rem; margin: 1.5rem auto; display: block; cursor: pointer; transition: all 0.2s;" />&nbsp;`;
    document.execCommand('insertHTML', false, imgHtml);

    setTimeout(() => {
      const imgEl = document.getElementById(imgId);
      if (imgEl) {
        selectImage(imgEl);
      }
    }, 80);
  };

  const selectImage = (imgEl) => {
    deselectTable();
    setSelectedCodeContainer(null);
    if (editorRef.current) {
      editorRef.current.querySelectorAll('img').forEach(img => img.classList.remove('selected-img'));
    }
    imgEl.classList.add('selected-img');
    setSelectedImg(imgEl);
    const curWidth = parseInt(imgEl.style.width, 10) || 75;
    setImgWidth(curWidth);

    // Detectar alinhamento atual
    if (imgEl.style.float === 'left') setImgAlign('float-left');
    else if (imgEl.style.float === 'right') setImgAlign('float-right');
    else if (imgEl.style.width === '100%') setImgAlign('full');
    else if (imgEl.style.margin && imgEl.style.margin.includes('auto 1.5rem 0')) setImgAlign('left');
    else if (imgEl.style.margin && imgEl.style.margin.includes('0 1.5rem auto')) setImgAlign('right');
    else setImgAlign('center');
  };

  const updateImgWidth = (newWidth) => {
    setImgWidth(newWidth);
    if (selectedImg) {
      selectedImg.style.width = `${newWidth}%`;
    }
    updateEditorStats();
  };

  const updateImgAlign = (alignment) => {
    if (!selectedImg) return;
    setImgAlign(alignment);

    if (alignment === 'left') {
      selectedImg.style.margin = '1.5rem auto 1.5rem 0';
      selectedImg.style.display = 'block';
      selectedImg.style.float = 'none';
      selectedImg.style.clear = 'both';
    } else if (alignment === 'right') {
      selectedImg.style.margin = '1.5rem 0 1.5rem auto';
      selectedImg.style.display = 'block';
      selectedImg.style.float = 'none';
      selectedImg.style.clear = 'both';
    } else if (alignment === 'center') {
      selectedImg.style.margin = '1.5rem auto';
      selectedImg.style.display = 'block';
      selectedImg.style.float = 'none';
      selectedImg.style.clear = 'both';
    } else if (alignment === 'float-left') {
      selectedImg.style.float = 'left';
      selectedImg.style.margin = '0.5rem 1.5rem 1rem 0';
      selectedImg.style.display = 'inline-block';
      selectedImg.style.clear = 'none';
      if (parseInt(selectedImg.style.width, 10) > 60) {
        updateImgWidth(50);
      }
    } else if (alignment === 'float-right') {
      selectedImg.style.float = 'right';
      selectedImg.style.margin = '0.5rem 0 1rem 1.5rem';
      selectedImg.style.display = 'inline-block';
      selectedImg.style.clear = 'none';
      if (parseInt(selectedImg.style.width, 10) > 60) {
        updateImgWidth(50);
      }
    } else if (alignment === 'full') {
      selectedImg.style.width = '100%';
      selectedImg.style.margin = '1.5rem 0';
      selectedImg.style.display = 'block';
      selectedImg.style.float = 'none';
      selectedImg.style.clear = 'both';
      setImgWidth(100);
    }
    updateEditorStats();
  };

  const deleteSelectedImg = () => {
    if (selectedImg) {
      selectedImg.remove();
      setSelectedImg(null);
      updateEditorStats();
    }
  };

  const deselectImg = () => {
    if (editorRef.current) {
      editorRef.current.querySelectorAll('img').forEach(img => img.classList.remove('selected-img'));
    }
    setSelectedImg(null);
  };

  const handleEditorClick = (e) => {
    setShowCalloutMenu(false);

    // 1. Clique em Imagem
    if (e.target.tagName === 'IMG') {
      selectImage(e.target);
      return;
    } else {
      if (!e.target.closest('.image-control-bar') && !e.target.closest('.image-modal')) {
        deselectImg();
      }
    }

    // 2. Clique em Célula de Tabela Interativa
    const cell = e.target.closest('td, th');
    const table = e.target.closest('table');
    if (cell && table) {
      selectTable(table, cell);
      return;
    } else {
      if (!e.target.closest('.table-control-bar') && !e.target.closest('.table-modal')) {
        deselectTable();
      }
    }

    // 3. Clique em Bloco de Código VS Code (IDE)
    const vsCodeBlock = e.target.closest('.vscode-ide-container');
    if (vsCodeBlock) {
      setSelectedCodeContainer(vsCodeBlock);
      deselectImg();
      deselectTable();
      return;
    } else {
      if (!e.target.closest('.vscode-control-bar') && !e.target.closest('.vscode-modal')) {
        setSelectedCodeContainer(null);
      }
    }
  };

  const ToolbarButton = ({ icon: Icon, onClick, btnTitle, colorClass = "text-slate-300 hover:text-white" }) => (
    <button type="button" onClick={onClick} className={`p-1.5 hover:bg-slate-700 rounded transition-colors shrink-0 ${colorClass}`} title={btnTitle}>
      <Icon size={18} />
    </button>
  );

  const Divider = () => <div className="w-px h-5 bg-slate-700 my-auto mx-1 shrink-0"></div>;

  // ==========================================
  // TELA 1: BIBLIOTECA (HUB)
  // ==========================================
  const renderHub = () => {
    let filteredMaterials = materials.filter(mat => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return mat.title?.toLowerCase().includes(q) || mat.uploaded_by?.username?.toLowerCase().includes(q);
    });

    let filteredNotion = notionHandouts.filter(item => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return item.title?.toLowerCase().includes(q) || item.desc?.toLowerCase().includes(q) || item.category?.toLowerCase().includes(q);
    });

    if (activeTab === 'favorites') {
      filteredMaterials = filteredMaterials.filter(m => isFavorited(m.id));
      filteredNotion = filteredNotion.filter(n => isFavorited(n.id));
    } else if (activeTab === 'community') {
      filteredNotion = [];
    } else if (activeTab === 'notion') {
      filteredMaterials = [];
    }

    return (
      <div className="bg-darker p-4 md:p-8 rounded-xl border border-slate-700 shadow-xl animate-fade-in relative overflow-hidden h-full overflow-y-auto">
        
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-1 flex items-center gap-2 sm:gap-3 flex-wrap">
              <BookOpen className="text-primary" size={28} /> Biblioteca de Apostilas
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">Acesse apostilas criadas pela comunidade ou publique seu próprio material de estudos com imagens e código.</p>
          </div>
          <button 
            onClick={handleStartCreate}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-sm transition-all shrink-0 active:scale-95"
          >
            <Plus size={18} /> Criar Nova Apostila
          </button>
        </div>

        {/* Abas de Navegação e Filtros (Fase 11) */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'all'
                ? 'bg-primary text-white shadow-md shadow-primary/25'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <BookOpen size={14} /> Todas ({materials.length + notionHandouts.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('favorites')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'favorites'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/25'
                : 'bg-slate-800 text-slate-400 hover:text-amber-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Star size={14} className={activeTab === 'favorites' ? "fill-slate-950 text-slate-950" : "text-amber-400"} />
            <span>Minha Lista ({favorites.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('community')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'community'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-purple-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Sparkles size={14} className="text-purple-400" /> Comunidade ({materials.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notion')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'notion'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-emerald-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <span className="text-xs">🏛️</span> Acervo Oficial ({notionHandouts.length})
          </button>
        </div>

        {/* Barra de Busca em Tempo Real (Fase 8) */}
        <div className="mb-8 relative max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar apostilas por título, tema ou autor..."
            className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-primary transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* SEÇÃO 1: APOSTILAS DA COMUNIDADE (BANCO DE DADOS) */}
        {(activeTab === 'all' || activeTab === 'community' || (activeTab === 'favorites' && filteredMaterials.length > 0)) && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="text-purple-400" size={20} /> Apostilas Criadas pela Comunidade
              </h3>
              <span className="text-xs text-slate-400 font-semibold bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                {filteredMaterials.length} {filteredMaterials.length === 1 ? 'material' : 'materiais'}
              </span>
            </div>

            {loadingMaterials ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                <Loader2 size={28} className="animate-spin text-primary" />
                <span className="text-sm">Carregando apostilas do servidor...</span>
              </div>
            ) : filteredMaterials.length === 0 ? (
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-8 text-center text-slate-400">
                <FileText size={36} className="mx-auto text-slate-500 mb-2" />
                <p className="text-white font-bold text-base">
                  {searchQuery ? 'Nenhuma apostila encontrada para essa busca' : activeTab === 'favorites' ? 'Nenhuma apostila da comunidade nos seus favoritos' : 'Nenhuma apostila criada ainda'}
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  {searchQuery ? 'Tente buscar com outras palavras-chave ou limpe a busca.' : 'Clique no botão "+ Criar Nova Apostila" acima para compartilhar seus resumos.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredMaterials.map(mat => {
                  const isOwner = currentUser && mat.uploaded_by?.id === currentUser.id;
                  const isAdmin = currentUser && (currentUser.role === 'ADMIN' || currentUser.is_staff);

                  return (
                    <div 
                      key={mat.id} 
                      onClick={() => openDatabaseMaterial(mat)} 
                      className="bg-slate-800 rounded-2xl p-5 border border-slate-700 hover:border-primary/60 transition-all cursor-pointer group flex flex-col justify-between shadow-lg hover:shadow-xl"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3 gap-2">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary-light border border-primary/30 flex items-center gap-1">
                            <Globe size={11} /> {mat.privacy === 'PUBLIC' ? 'Pública' : 'Privada'}
                          </span>
                          
                          <div className="flex items-center gap-1">
                            {/* Botão de Favoritar Card (Fase 11) */}
                            <button
                              type="button"
                              onClick={(e) => toggleFavorite(mat.id, e)}
                              className={`p-1 rounded-lg transition-all ${
                                isFavorited(mat.id)
                                  ? 'text-amber-400 hover:text-amber-300'
                                  : 'text-slate-500 hover:text-amber-400 hover:bg-amber-500/10'
                              }`}
                              title={isFavorited(mat.id) ? "Remover dos Favoritos" : "Salvar em Minha Lista"}
                            >
                              <Star size={16} className={isFavorited(mat.id) ? "fill-amber-400 text-amber-400" : ""} />
                            </button>

                            {(isOwner || isAdmin) && (
                              <button 
                                type="button"
                                onClick={(e) => handleStartEdit(mat, e)}
                                className="p-1 text-slate-500 hover:text-purple-400 hover:bg-purple-500/10 rounded transition-colors"
                                title="Editar Apostila"
                              >
                                <Edit3 size={16} />
                              </button>
                            )}
                            {(isOwner || isAdmin) && (
                              <button 
                                type="button"
                                onClick={(e) => handleDeleteMaterial(mat.id, e)}
                                className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                title="Excluir Apostila"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                            <span className="text-slate-400 group-hover:text-primary transition-colors p-1">
                              <Eye size={16} />
                            </span>
                          </div>
                        </div>

                        <h4 className="font-bold text-lg text-white mb-1.5 line-clamp-2 group-hover:text-primary-light transition-colors">
                          {mat.title}
                        </h4>

                        <div className="text-xs text-slate-400 flex items-center gap-2 mb-4">
                          <span className="flex items-center gap-1 text-slate-300 font-medium">
                            <User size={13} className="text-primary" /> {mat.uploaded_by?.username || 'Aluno'}
                          </span>
                          <span>•</span>
                          <span>{new Date(mat.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                        <span className="font-semibold text-slate-400 flex items-center gap-1.5" title="Quantidade de dúvidas e comentários">
                          <MessageSquare size={13} className="text-purple-400" />
                          <span>{mat.comments?.length || 0} {mat.comments?.length === 1 ? 'dúvida' : 'dúvidas'}</span>
                        </span>
                        <span className="text-primary font-bold group-hover:underline flex items-center gap-1">
                          Ler Conteúdo →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SEÇÃO 2: ACERVO INSTITUCIONAL NOTION */}
        {(activeTab === 'all' || activeTab === 'notion' || (activeTab === 'favorites' && filteredNotion.length > 0)) && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="text-emerald-400" size={20} /> Acervo Oficial UniStudy (Notion)
              </h3>
              <span className="text-xs text-slate-400 font-semibold bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                {filteredNotion.length} {filteredNotion.length === 1 ? 'apostila' : 'apostilas'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredNotion.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => openNotionApostila(item)} 
                  className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 hover:border-emerald-500/60 transition-all cursor-pointer group flex flex-col justify-between shadow-lg hover:shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          {item.category}
                        </span>
                      </div>
                      
                      {/* Botão de Favoritar Notion (Fase 11) */}
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(item.id, e)}
                        className={`p-1 rounded-lg transition-all ${
                          isFavorited(item.id)
                            ? 'text-amber-400 hover:text-amber-300'
                            : 'text-slate-500 hover:text-amber-400 hover:bg-amber-500/10'
                        }`}
                        title={isFavorited(item.id) ? "Remover dos Favoritos" : "Salvar em Minha Lista"}
                      >
                        <Star size={16} className={isFavorited(item.id) ? "fill-amber-400 text-amber-400" : ""} />
                      </button>
                    </div>
                    
                    <h4 className="font-bold text-base text-white mb-1.5 group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </h4>
                    
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-slate-500">{item.author}</span>
                    <span className="text-emerald-400 font-bold group-hover:underline flex items-center gap-1">
                      Abrir →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estado Vazio de Favoritos */}
        {activeTab === 'favorites' && filteredMaterials.length === 0 && filteredNotion.length === 0 && (
          <div className="bg-slate-800/40 border border-dashed border-slate-700 rounded-3xl p-12 text-center text-slate-400 my-8">
            <Star size={44} className="mx-auto text-amber-400/50 mb-3" />
            <h4 className="text-white font-bold text-lg mb-1">Sua lista de favoritos está vazia</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
              Você ainda não favoritou nenhuma apostila. Clique na estrela (⭐) de qualquer apostila para salvá-la aqui e estudar quando quiser!
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all"
            >
              Ver Todas as Apostilas
            </button>
          </div>
        )}

      </div>
    );
  };

  // ==========================================
  // TELA 2: LEITOR DE APOSTILA (READER)
  // ==========================================
  const renderReader = () => {
    if (!activeMaterial) return null;

    const isOwner = currentUser && activeMaterial.authorId === currentUser.id;
    const isAdmin = currentUser && (currentUser.role === 'ADMIN' || currentUser.is_staff);

    const scrollToHeading = (id) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveHeadingId(id);
        setShowMobileToc(false);
      }
    };

    const themeStyles = {
      dark: {
        container: 'bg-[#0f172a] text-slate-200',
        header: 'bg-slate-800/90 border-slate-700 text-slate-200',
        title: 'text-white',
        contentBg: 'bg-slate-900',
        tocBg: 'bg-slate-800/70 border-slate-700/80 text-slate-200',
        headingH1: '#ffffff',
        headingH2: '#f1f5f9',
        headingH3: '#cbd5e1',
        text: '#cbd5e1'
      },
      sepia: {
        container: 'bg-[#1c1917] text-[#e7d8c9]',
        header: 'bg-[#292522]/95 border-[#443e38] text-[#e7d8c9]',
        title: 'text-[#fef3c7]',
        contentBg: 'bg-[#181513]',
        tocBg: 'bg-[#292522]/85 border-[#443e38] text-[#e7d8c9]',
        headingH1: '#fef3c7',
        headingH2: '#fde68a',
        headingH3: '#e5d7c3',
        text: '#e7d8c9'
      },
      light: {
        container: 'bg-[#f8fafc] text-slate-800',
        header: 'bg-white/95 border-slate-200 text-slate-800 shadow-sm',
        title: 'text-slate-900',
        contentBg: 'bg-white',
        tocBg: 'bg-slate-50/90 border-slate-200 text-slate-800 shadow-sm',
        headingH1: '#0f172a',
        headingH2: '#1e293b',
        headingH3: '#334155',
        text: '#334155'
      }
    };
    const curTheme = themeStyles[readerTheme] || themeStyles.dark;

    return (
      <div className={`h-full ${isFocusMode ? 'fixed inset-0 z-50 rounded-none border-none' : 'rounded-xl shadow-2xl border border-slate-700'} ${curTheme.container} overflow-hidden animate-fade-in flex flex-col relative reader-container`}>
        {/* Top Header do Leitor */}
        <div className={`flex justify-between items-center p-3 sm:p-4 border-b ${curTheme.header} sticky top-0 z-20 backdrop-blur-md no-print`}>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button 
              onClick={() => {
                if (isFocusMode) setIsFocusMode(false);
                setView('hub');
              }} 
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-300 hover:text-white transition-colors shrink-0" 
              title="Voltar para a Biblioteca"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="min-w-0">
              <span className="text-[11px] text-slate-400 block font-semibold">Biblioteca de Apostilas</span>
              <h3 className={`font-black text-sm sm:text-lg truncate ${curTheme.title}`}>{activeMaterial.title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 overflow-x-auto max-w-[55vw] sm:max-w-none no-scrollbar py-0.5">
            {/* Estatísticas de leitura (Fase 5) */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/60 border border-slate-700/80 px-2.5 py-1.5 rounded-xl text-xs text-amber-300 font-semibold" title="Tempo estimado de leitura">
              <Clock size={13} className="text-amber-400" />
              <span>~{readerStats.readingTime} min</span>
              <span className="text-slate-500 font-normal">({readerStats.words} pal.)</span>
            </div>

            {/* Menu de Tipografia e Temas (Fase 10) */}
            <div className="relative">
              <button 
                type="button"
                onClick={() => setShowTypographyMenu(prev => !prev)}
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-300 hover:text-white transition-colors text-xs font-bold flex items-center gap-1.5 border border-slate-600"
                title="Ajustar tamanho da fonte e tema de leitura"
              >
                <Type size={16} className="text-amber-400" />
                <span className="hidden xl:inline">{readerFontSize}%</span>
              </button>

              {showTypographyMenu && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-2 w-64 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-4 z-40 animate-fade-in text-left text-xs"
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-700 mb-3">
                    Personalizar Leitura
                  </div>

                  {/* Ajuste de Tamanho da Fonte */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center text-slate-300 font-semibold mb-2">
                      <span>Tamanho da Fonte:</span>
                      <span className="font-mono text-primary font-bold">{readerFontSize}%</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {[
                        { label: '85%', val: 85 },
                        { label: '100%', val: 100 },
                        { label: '115%', val: 115 },
                        { label: '130%', val: 130 }
                      ].map(item => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setReaderFontSize(item.val)}
                          className={`py-1.5 rounded-lg font-bold text-center transition-all ${
                            readerFontSize === item.val
                              ? 'bg-primary text-white shadow-md'
                              : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Temas de Leitura */}
                  <div>
                    <div className="text-slate-300 font-semibold mb-2">Tema de Fundo:</div>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setReaderTheme('dark')}
                        className={`p-2 rounded-xl flex flex-col items-center gap-1 font-bold text-[11px] transition-all border ${
                          readerTheme === 'dark'
                            ? 'bg-slate-900 text-white border-primary shadow-md'
                            : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                      >
                        <Moon size={14} className="text-purple-400" />
                        <span>Escuro</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setReaderTheme('sepia')}
                        className={`p-2 rounded-xl flex flex-col items-center gap-1 font-bold text-[11px] transition-all border ${
                          readerTheme === 'sepia'
                            ? 'bg-[#292522] text-[#fef3c7] border-amber-500 shadow-md'
                            : 'bg-[#292522]/70 text-[#d4c3b3] border-[#443e38] hover:text-white'
                        }`}
                      >
                        <span className="text-amber-400">📖</span>
                        <span>Sépia</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setReaderTheme('light')}
                        className={`p-2 rounded-xl flex flex-col items-center gap-1 font-bold text-[11px] transition-all border ${
                          readerTheme === 'light'
                            ? 'bg-white text-slate-900 border-primary shadow-md font-black'
                            : 'bg-white/80 text-slate-700 border-slate-300 hover:bg-white'
                        }`}
                      >
                        <Sun size={14} className="text-amber-500" />
                        <span>Claro</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Botão Oráculo IA (Fase 13) */}
            <button 
              type="button"
              onClick={() => {
                setShowOracleModal(true);
                if (!oracleResult) {
                  handleCallOracleAI('summarize');
                }
              }}
              className="p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all bg-gradient-to-r from-purple-600 via-primary to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-purple-400/40 shadow-md shadow-purple-900/30 active:scale-95 shrink-0"
              title="Abrir o Oráculo IA: Resumos Didáticos, Explicação ELI5 e Quiz de Fixação"
            >
              <Sparkles size={16} className="text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">Oráculo IA</span>
            </button>

            {/* Botão de Favoritar (Fase 11) */}
            <button 
              type="button"
              onClick={(e) => toggleFavorite(activeMaterial.id, e)}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                isFavorited(activeMaterial.id)
                  ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md font-black'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white border-slate-600'
              }`}
              title={isFavorited(activeMaterial.id) ? "Remover dos Favoritos" : "Salvar em Minha Lista"}
            >
              <Star size={16} className={isFavorited(activeMaterial.id) ? "fill-slate-950 text-slate-950" : "text-amber-400"} />
              <span className="hidden sm:inline">
                {isFavorited(activeMaterial.id) ? 'Salva' : 'Favoritar'}
              </span>
            </button>

            {/* Botão Modo Foco / Tela Cheia (Fase 10) */}
            <button 
              type="button"
              onClick={() => setIsFocusMode(prev => !prev)}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                isFocusMode
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30 ring-2 ring-primary/40'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white border-slate-600'
              }`}
              title={isFocusMode ? "Sair do Modo Foco (Esc)" : "Entrar no Modo Foco / Imersivo (Sem distrações)"}
            >
              {isFocusMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              <span className="hidden sm:inline">{isFocusMode ? 'Sair do Foco' : 'Modo Foco'}</span>
            </button>

            {/* Botão de Sumário Mobile (Fase 2) */}
            {tocItems.length > 0 && (
              <button 
                onClick={() => setShowMobileToc(prev => !prev)}
                className="lg:hidden p-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-300 hover:text-white transition-colors text-xs font-bold flex items-center gap-1.5 border border-slate-600"
                title="Abrir Sumário"
              >
                <ListTree size={16} className="text-primary" />
                <span className="hidden xs:inline">Sumário</span>
              </button>
            )}

            {/* Botão de Imprimir / PDF (Fase 6) */}
            <button 
              onClick={() => window.print()}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-300 hover:text-white transition-colors text-xs font-bold flex items-center gap-1.5 border border-slate-600"
              title="Exportar para PDF ou Imprimir"
            >
              <Printer size={16} className="text-sky-400" />
              <span className="hidden md:inline">Imprimir / PDF</span>
            </button>

            {/* Botão para rolar até dúvidas/comentários (Fase 9) */}
            {!activeMaterial.isNotion && (
              <button 
                onClick={scrollToComments}
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-300 hover:text-white transition-colors text-xs font-bold flex items-center gap-1.5 border border-slate-600"
                title="Ver dúvidas e comentários da comunidade"
              >
                <MessageSquare size={16} className="text-purple-400" />
                <span className="hidden md:inline">Dúvidas ({comments.length})</span>
              </button>
            )}

            {/* Autor e data */}
            <div className="text-right text-xs text-slate-400 hidden xl:block">
              <span className="font-bold text-slate-200">Autor: {activeMaterial.author}</span>
              {activeMaterial.createdAt && (
                <span className="block text-[11px] text-slate-500">
                  {new Date(activeMaterial.createdAt).toLocaleDateString('pt-BR')}
                </span>
              )}
            </div>

            {!activeMaterial.isNotion && (isOwner || isAdmin) && (
              <button 
                onClick={(e) => handleStartEdit(activeMaterial, e)}
                className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-xl transition-colors border border-purple-500/20 text-xs font-bold flex items-center gap-1.5"
                title="Editar esta apostila"
              >
                <Edit3 size={16} />
                <span className="hidden sm:inline">Editar</span>
              </button>
            )}

            {!activeMaterial.isNotion && (isOwner || isAdmin) && (
              <button 
                onClick={(e) => handleDeleteMaterial(activeMaterial.id, e)}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors border border-red-500/20 text-xs font-bold flex items-center gap-1.5"
                title="Excluir esta apostila"
              >
                <Trash2 size={16} />
                <span className="hidden sm:inline">Excluir</span>
              </button>
            )}
          </div>
        </div>

        {/* Barra de Progresso de Leitura no Topo (Fase 8) */}
        <div className="w-full bg-slate-800 h-1 sticky top-0 z-30 no-print">
          <div 
            className="h-full bg-gradient-to-r from-primary via-purple-400 to-accent transition-all duration-150"
            style={{ width: `${readingProgress}%` }}
          />
        </div>

        {/* Estilos Tipográficos no Leitor e Regras de Impressão (Fases 1, 2, 3, 4, 6, 10) */}
        <style>{`
          .reader-content, .prose {
            font-size: ${readerFontSize}% !important;
            color: ${curTheme.text} !important;
          }
          .reader-content h1 { font-size: 2.2rem; font-weight: 900; color: ${curTheme.headingH1} !important; margin-top: 1.5rem; margin-bottom: 0.75rem; line-height: 1.25; border-bottom: 2px solid rgba(124, 58, 237, 0.4); padding-bottom: 0.5rem; scroll-margin-top: 5rem; }
          .reader-content h2 { font-size: 1.7rem; font-weight: 800; color: ${curTheme.headingH2} !important; margin-top: 1.25rem; margin-bottom: 0.5rem; line-height: 1.3; border-left: 4px solid #7c3aed; padding-left: 0.75rem; scroll-margin-top: 5rem; }
          .reader-content h3 { font-size: 1.35rem; font-weight: 700; color: ${curTheme.headingH3} !important; margin-top: 1rem; margin-bottom: 0.5rem; line-height: 1.4; scroll-margin-top: 5rem; }
          .reader-content p { line-height: 1.8; margin-bottom: 0.85rem; color: ${curTheme.text} !important; }
          .reader-content blockquote { border-left: 4px solid #7c3aed; padding-left: 1rem; margin-left: 0; color: #94a3b8; font-style: italic; background-color: rgba(30, 41, 59, 0.5); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; }
          .reader-content pre { background-color: #020617; padding: 1.25rem; border-radius: 0.75rem; font-family: 'Fira Code', 'Consolas', monospace; border: 1px solid #334155; overflow-x: auto; color: #38bdf8; margin-bottom: 1.5rem; line-height: 1.6; }
          .reader-content img { border-radius: 0.75rem; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }

          /* Sumário scroll margin no Markdown também */
          .prose h1, .prose h2, .prose h3 { scroll-margin-top: 5rem; }

          /* Suporte a Impressão e PDF limpo */
          @media print {
            body { background: #ffffff !important; color: #000000 !important; }
            .no-print, header, nav, aside, button, .image-control-bar { display: none !important; }
            .reader-container { border: none !important; box-shadow: none !important; background: #ffffff !important; }
            .reader-content, .prose { color: #111827 !important; max-width: 100% !important; font-size: 11pt !important; }
            .reader-content h1, .reader-content h2, .reader-content h3 { color: #111827 !important; page-break-after: avoid; }
            .reader-content pre { background: #f8fafc !important; color: #0f172a !important; border: 1px solid #cbd5e1 !important; page-break-inside: avoid; }
            .callout { background: #f8fafc !important; page-break-inside: avoid; border: 1px solid #cbd5e1 !important; color: #111827 !important; }
            table { page-break-inside: avoid; width: 100% !important; }
            th, td { border: 1px solid #cbd5e1 !important; color: #111827 !important; }
            img { max-width: 100% !important; page-break-inside: avoid; }
            @page { margin: 1.5cm; size: A4; }
          }
        `}</style>

        {/* Corpo do Leitor: Conteúdo + Sumário Sticky (Fase 2) */}
        <div ref={readerContainerRef} onScroll={handleReaderScroll} className={`flex-1 overflow-y-auto px-4 md:px-10 lg:px-16 py-8 ${curTheme.contentBg}`}>
          <div className="max-w-6xl mx-auto flex gap-8 items-start">
            
            {/* Conteúdo Principal */}
            <div ref={readerBodyRef} className="flex-1 min-w-0">
              {loadingContent ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
                  <Loader2 size={36} className="animate-spin text-primary" />
                  <p className="font-bold text-sm">Carregando conteúdo da apostila...</p>
                </div>
              ) : activeMaterial.isNotion ? (
                /* Conteúdo Notion (Markdown) */
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
                      img: ({node, src, alt, ...props}) => {
                        const isAbsolute = src ? (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) : false;
                        const finalSrc = isAbsolute ? src : `/apostilas/${activeMaterial.path}/${src}`;
                        return <img src={finalSrc} alt={alt} {...props} loading="lazy" />;
                      }
                    }}
                  >
                    {activeMaterial.content}
                  </ReactMarkdown>
                </div>
              ) : (
                /* Conteúdo Criado pelo Usuário (HTML Rico) */
                <div 
                  className="reader-content max-w-none"
                  dangerouslySetInnerHTML={{ __html: activeMaterial.content_html || '<p class="text-slate-400">Esta apostila ainda não tem conteúdo.</p>' }}
                />
              )}

              {/* SEÇÃO DE DÚVIDAS E COMENTÁRIOS DA COMUNIDADE (FASE 9) */}
              {!activeMaterial.isNotion && (
                <div id="comments-section" className="mt-16 pt-10 border-t border-slate-700/80 no-print">
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold shadow-md">
                        <MessageSquare size={20} />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-white">Dúvidas & Discussão</h4>
                        <p className="text-xs text-slate-400">Tire suas dúvidas sobre o conteúdo ou compartilhe dicas com outros alunos.</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 bg-slate-800 text-slate-300 rounded-full border border-slate-700">
                      {comments.length} {comments.length === 1 ? 'dúvida' : 'dúvidas'}
                    </span>
                  </div>

                  {/* Formulário de Envio de Dúvida / Comentário */}
                  <form onSubmit={handleAddComment} className="mb-8 bg-slate-800/80 border border-slate-700 rounded-2xl p-4 shadow-lg focus-within:border-primary/60 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0 uppercase text-xs border border-primary/30">
                        {currentUser?.username?.[0] || 'U'}
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          placeholder="Ficou com alguma dúvida sobre esta apostila? Escreva aqui sua pergunta ou contribuição..."
                          rows={3}
                          className="w-full bg-slate-900/60 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary resize-none"
                        />
                        <div className="flex justify-between items-center mt-3 pt-2 flex-wrap gap-2">
                          <span className="text-[11px] text-slate-400">
                            Compartilhe seu aprendizado ou pergunte à turma.
                          </span>
                          <button
                            type="submit"
                            disabled={submittingComment || !newCommentText.trim()}
                            className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold py-2 px-5 rounded-xl text-xs shadow-md shadow-primary/20 flex items-center gap-2 transition-all active:scale-95"
                          >
                            {submittingComment ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            <span>{submittingComment ? 'Publicando...' : 'Publicar Dúvida / Comentário'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>

                  {/* Lista de Comentários */}
                  {loadingComments ? (
                    <div className="py-8 flex flex-col items-center justify-center text-slate-400 gap-2">
                      <Loader2 size={24} className="animate-spin text-primary" />
                      <span className="text-xs">Carregando dúvidas e comentários...</span>
                    </div>
                  ) : comments.length === 0 ? (
                    <div className="bg-slate-800/40 border border-dashed border-slate-700 rounded-2xl p-8 text-center text-slate-400">
                      <MessageCircle size={32} className="mx-auto text-slate-500 mb-2 opacity-60" />
                      <p className="text-white font-bold text-sm">Nenhuma dúvida postada ainda</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                        Seja o primeiro a fazer uma pergunta ou compartilhar um aprendizado sobre este material!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {comments.map(c => {
                        const isCommentOwner = currentUser && c.author?.id === currentUser.id;
                        const isAdmin = currentUser && (currentUser.role === 'ADMIN' || currentUser.is_staff);

                        return (
                          <div key={c.id} className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 shadow-md flex gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-700 text-slate-200 font-bold flex items-center justify-center shrink-0 uppercase text-xs border border-slate-600">
                              {c.author?.username?.[0] || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-white text-xs sm:text-sm">{c.author?.username || 'Aluno'}</span>
                                  {c.author?.role && (
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary-light border border-primary/30">
                                      {c.author.role}
                                    </span>
                                  )}
                                  <span className="text-[11px] text-slate-500">
                                    {new Date(c.created_at).toLocaleDateString('pt-BR')} às {new Date(c.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>

                                {(isCommentOwner || isAdmin) && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteComment(c.id)}
                                    className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                    title="Excluir Comentário"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>

                              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap mt-1">
                                {c.content}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sumário / Índice Dinâmico (Sidebar Desktop - Fase 2) */}
            {tocItems.length > 0 && (
              <aside className={`hidden lg:block w-72 shrink-0 sticky top-4 ${curTheme.tocBg} rounded-2xl p-4 shadow-xl backdrop-blur-md max-h-[calc(100vh-140px)] overflow-y-auto no-print`}>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between pb-2 border-b border-slate-700">
                  <span className="flex items-center gap-2">
                    <ListTree size={16} className="text-primary" /> Sumário do Conteúdo
                  </span>
                  <span className="text-[10px] font-semibold bg-slate-700/60 text-slate-400 px-2 py-0.5 rounded-full">
                    {tocItems.length}
                  </span>
                </div>
                <nav className="flex flex-col gap-1 text-xs">
                  {tocItems.map((item, idx) => (
                    <button
                      key={item.id || idx}
                      type="button"
                      onClick={() => scrollToHeading(item.id)}
                      className={`text-left py-1.5 px-2.5 rounded-lg transition-all truncate block w-full ${
                        item.level === 'h1' ? 'font-bold text-white hover:text-primary-light' :
                        item.level === 'h2' ? 'pl-4 text-slate-300 hover:text-white font-medium' :
                        'pl-7 text-slate-400 hover:text-slate-200 text-[11px]'
                      } ${activeHeadingId === item.id ? 'bg-primary/20 text-primary border border-primary/30 font-bold' : 'hover:bg-slate-700/50'}`}
                      title={item.text}
                    >
                      {item.text}
                    </button>
                  ))}
                </nav>
              </aside>
            )}

          </div>
        </div>

        {/* Modal / Gaveta de Sumário Mobile (Fase 2) */}
        {showMobileToc && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 no-print animate-fade-in">
            <div className="bg-slate-800 border-t sm:border border-slate-700 rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl p-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-3">
                <h4 className="font-bold text-base text-white flex items-center gap-2">
                  <ListTree className="text-primary" size={20} /> Sumário da Apostila
                </h4>
                <button 
                  onClick={() => setShowMobileToc(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 pr-1 flex flex-col gap-1.5">
                {tocItems.map((item, idx) => (
                  <button
                    key={item.id || idx}
                    type="button"
                    onClick={() => scrollToHeading(item.id)}
                    className={`text-left py-2 px-3 rounded-xl transition-all ${
                      item.level === 'h1' ? 'font-bold text-white bg-slate-700/40 text-sm' :
                      item.level === 'h2' ? 'pl-5 text-slate-300 font-medium text-xs' :
                      'pl-8 text-slate-400 text-xs'
                    } ${activeHeadingId === item.id ? 'bg-primary/20 text-primary font-bold' : 'hover:bg-slate-700/70'}`}
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal Oráculo IA - Tutor Inteligente (Fase 13) */}
        {showOracleModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 no-print animate-fade-in">
            <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
              
              {/* Header do Oráculo */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-900/80 via-slate-900 to-indigo-900/80 border-b border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 shrink-0">
                    <Sparkles size={20} className="text-amber-300 animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                      Oráculo Acadêmico <span className="text-[10px] bg-primary/30 border border-primary/50 text-primary-light px-2 py-0.5 rounded-full font-bold uppercase">IA</span>
                    </h3>
                    <p className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md">
                      Tutor inteligente analisando: <strong className="text-slate-300">{activeMaterial.title}</strong>
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setShowOracleModal(false)}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700 shrink-0"
                  title="Fechar Oráculo"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Barra de Abas de Ação */}
              <div className="flex items-center gap-1.5 p-3 bg-slate-950/60 border-b border-slate-800 overflow-x-auto no-scrollbar shrink-0">
                <button
                  type="button"
                  onClick={() => handleCallOracleAI('summarize')}
                  disabled={oracleLoading}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 active:scale-95 ${
                    oracleAction === 'summarize'
                      ? 'bg-primary text-white shadow-md shadow-primary/30'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  <span>⚡ Resumo Rápido</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCallOracleAI('explain_eli5')}
                  disabled={oracleLoading}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 active:scale-95 ${
                    oracleAction === 'explain_eli5'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  <span>💡 Explicar Simples (ELI5)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCallOracleAI('quiz')}
                  disabled={oracleLoading}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 active:scale-95 ${
                    oracleAction === 'quiz'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  <span>🎯 Mini-Quiz de Fixação</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOracleAction('ask')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 active:scale-95 ${
                    oracleAction === 'ask'
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  <span>💬 Tirar Dúvida</span>
                </button>
              </div>

              {/* Caixa de Pergunta (quando na aba 'ask') */}
              {oracleAction === 'ask' && (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (oracleQuestion.trim()) {
                      handleCallOracleAI('ask', oracleQuestion);
                    }
                  }}
                  className="p-3 bg-slate-800/40 border-b border-slate-800 flex gap-2"
                >
                  <input 
                    type="text"
                    value={oracleQuestion}
                    onChange={(e) => setOracleQuestion(e.target.value)}
                    placeholder="Digite sua dúvida sobre a matéria..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    disabled={oracleLoading || !oracleQuestion.trim()}
                    className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
                  >
                    <Send size={14} />
                    <span className="hidden sm:inline">Perguntar</span>
                  </button>
                </form>
              )}

              {/* Conteúdo do Resultado */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
                {oracleLoading ? (
                  <div className="py-16 flex flex-col items-center justify-center text-center gap-3">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                      <Sparkles size={20} className="absolute inset-0 m-auto text-amber-400 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Consultando o Oráculo IA...</p>
                      <p className="text-xs text-slate-400 mt-0.5">Sintetizando e gerando resposta didática.</p>
                    </div>
                  </div>
                ) : oracleResultType === 'quiz' && Array.isArray(oracleResult) ? (
                  <div className="space-y-6">
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-emerald-300 font-bold text-sm flex items-center gap-2">
                          🎯 Teste de Retenção Rápido
                        </h4>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Responda às 3 perguntas abaixo baseadas nesta apostila para ganhar +20 XP!
                        </p>
                      </div>
                      {oracleQuizXpEarned && (
                        <span className="bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full animate-bounce shrink-0">
                          +20 XP Concedidos!
                        </span>
                      )}
                    </div>

                    {oracleResult.map((q, qIdx) => {
                      const answered = oracleQuizAnswers[qIdx] !== undefined;
                      const selectedOpt = oracleQuizAnswers[qIdx];
                      const isCorrect = answered && selectedOpt === q.correct;

                      return (
                        <div key={qIdx} className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-3">
                          <h5 className="font-bold text-white text-sm sm:text-base leading-snug">
                            {qIdx + 1}. {q.question}
                          </h5>

                          <div className="grid grid-cols-1 gap-2 pt-1">
                            {q.options.map((opt, optIdx) => {
                              let btnClass = 'bg-slate-900/90 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white';
                              
                              if (answered) {
                                if (optIdx === q.correct) {
                                  btnClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500 font-bold shadow-md';
                                } else if (selectedOpt === optIdx) {
                                  btnClass = 'bg-red-500/20 text-red-300 border-red-500 line-through opacity-80';
                                } else {
                                  btnClass = 'bg-slate-900/50 text-slate-500 border-slate-800 opacity-60';
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => handleSelectQuizOption(qIdx, optIdx)}
                                  className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-2.5 ${btnClass}`}
                                >
                                  <span className="font-bold text-primary shrink-0">
                                    {String.fromCharCode(65 + optIdx)})
                                  </span>
                                  <span className="flex-1">{opt}</span>
                                  {answered && optIdx === q.correct && (
                                    <Check size={16} className="text-emerald-400 shrink-0 ml-1" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {answered && (
                            <div className={`p-3 rounded-xl text-xs ${isCorrect ? 'bg-emerald-900/20 border border-emerald-500/30 text-emerald-200' : 'bg-slate-900/80 border border-slate-700 text-slate-300'}`}>
                              <strong className={isCorrect ? 'text-emerald-400' : 'text-amber-400'}>
                                {isCorrect ? '✅ Exato! ' : '💡 Explicação: '}
                              </strong>
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 sm:p-6 text-slate-200 text-xs sm:text-sm leading-relaxed space-y-3">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {typeof oracleResult === 'string' ? oracleResult : 'Nenhum resultado gerado.'}
                    </ReactMarkdown>
                  </div>
                )}
              </div>

              {/* Footer do Modal com Botão Copiar */}
              <div className="p-3 sm:p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  ⚡ O Oráculo sintetiza o conhecimento para acelerar seus estudos.
                </span>
                
                <div className="flex items-center gap-2 ml-auto">
                  {typeof oracleResult === 'string' && (
                    <button
                      type="button"
                      onClick={handleCopyOracleResult}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      {oracleCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      <span>{oracleCopied ? 'Copiado!' : 'Copiar Resposta'}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowOracleModal(false)}
                    className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all shadow-md"
                  >
                    Fechar
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Botão Flutuante Voltar ao Topo (Fase 8) */}
        {showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 p-3 bg-slate-800/95 hover:bg-slate-700 text-white rounded-full shadow-2xl border border-slate-600 transition-all active:scale-95 animate-fade-in no-print backdrop-blur-md"
            title="Voltar ao Topo"
          >
            <ArrowUp size={20} className="text-primary" />
          </button>
        )}

      </div>
    );
  };

  // ==========================================
  // TELA 3: CRIADOR / EDITOR DE APOSTILA
  // ==========================================
  const renderEditor = () => (
    <div className="h-full bg-darker text-slate-200 rounded-xl overflow-hidden shadow-2xl border border-slate-700 animate-fade-in flex flex-col relative">
      
      {/* Input Oculto de Upload de Imagem */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/png, image/jpeg, image/webp, image/gif" 
        className="hidden" 
      />

      {/* Top Header do Editor (100% Responsivo no Celular) */}
      <div className="flex justify-between items-center p-2 sm:p-3 md:p-4 border-b border-slate-700 bg-slate-800/90 sticky top-0 z-20 backdrop-blur-md gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1 sm:gap-2.5 min-w-0 max-w-[50%] sm:max-w-none">
          <button 
            type="button"
            onClick={() => {
              deselectImg();
              setEditingMaterialId(null);
              setView('hub');
            }} 
            className="p-1 sm:p-2 bg-slate-700/60 hover:bg-slate-600 rounded-xl text-slate-300 hover:text-white transition-colors shrink-0" 
            title="Voltar para a Biblioteca"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="text-slate-400 font-medium text-xs sm:text-sm truncate">
            <span className="hidden sm:inline">Apostilas / </span>
            <strong className="text-white text-[11px] sm:text-sm">{editingMaterialId ? 'Editar' : 'Criar Nova'}</strong>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <select 
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-1.5 sm:px-3 py-1.5 text-[11px] sm:text-xs text-white outline-none font-bold focus:border-primary cursor-pointer shrink-0 max-w-[95px] sm:max-w-none truncate"
            title="Visibilidade da Apostila"
          >
            <option value="PUBLIC">🌐 Pública</option>
            <option value="PRIVATE">🔒 Privada</option>
          </select>

          <button 
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-2.5 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-1 sm:gap-2 transition-all active:scale-95 shrink-0"
            title={editingMaterialId ? 'Salvar Alterações' : 'Publicar Apostila'}
          >
            {isPublishing ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />}
            <span>
              {isPublishing 
                ? 'Salvando...' 
                : (editingMaterialId ? 'Salvar' : 'Publicar')}
            </span>
            <span className="hidden md:inline">
              {!isPublishing && (editingMaterialId ? ' Alterações' : ' Apostila')}
            </span>
          </button>
        </div>
      </div>

      {/* Barra de Ferramentas Rica */}
      <div className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 p-1.5 sm:p-2 flex items-center gap-1 flex-wrap justify-center overflow-visible z-30 shadow-md flex-shrink-0 relative">
        <ToolbarButton icon={Bold} onClick={() => formatText('bold')} btnTitle="Negrito (Ctrl+B)" />
        <ToolbarButton icon={Italic} onClick={() => formatText('italic')} btnTitle="Itálico (Ctrl+I)" />
        <ToolbarButton icon={Underline} onClick={() => formatText('underline')} btnTitle="Sublinhado (Ctrl+U)" />
        <ToolbarButton icon={Strikethrough} onClick={() => formatText('strikeThrough')} btnTitle="Riscado" />
        <Divider />
        
        {/* TÍTULO H1 E SUBTÍTULOS H2 E H3 */}
        <ToolbarButton icon={Heading1} onClick={() => formatHeading('h1')} btnTitle="Título Principal (H1)" colorClass="text-primary hover:text-white" />
        <ToolbarButton icon={Heading2} onClick={() => formatHeading('h2')} btnTitle="Subtítulo Nível 1 (H2)" colorClass="text-purple-400 hover:text-white" />
        <ToolbarButton icon={Heading3} onClick={() => formatHeading('h3')} btnTitle="Subtítulo Nível 2 (H3)" colorClass="text-sky-400 hover:text-white" />
        <ToolbarButton icon={Type} onClick={() => formatHeading('p')} btnTitle="Texto Normal (Parágrafo)" />
        <Divider />

        <ToolbarButton icon={AlignLeft} onClick={() => formatText('justifyLeft')} btnTitle="Alinhar à Esquerda" />
        <ToolbarButton icon={AlignCenter} onClick={() => formatText('justifyCenter')} btnTitle="Centralizar" />
        <ToolbarButton icon={AlignRight} onClick={() => formatText('justifyRight')} btnTitle="Alinhar à Direita" />
        <ToolbarButton icon={AlignJustify} onClick={() => formatText('justifyFull')} btnTitle="Justificar" />
        <Divider />
        <ToolbarButton icon={ListOrdered} onClick={() => formatText('insertOrderedList')} btnTitle="Lista Numerada" />
        <ToolbarButton icon={List} onClick={() => formatText('insertUnorderedList')} btnTitle="Lista com Marcadores" />
        <ToolbarButton icon={CheckSquare} onClick={insertChecklist} btnTitle="Checklist" colorClass="text-emerald-400 hover:text-emerald-300" />
        <Divider />
        <ToolbarButton icon={Quote} onClick={() => formatText('formatBlock', 'BLOCKQUOTE')} btnTitle="Citação" />
        <ToolbarButton icon={FileCode} onClick={() => openVsCodeModal()} btnTitle="Inserir Código Estilo IDE (VS Code)" colorClass="text-sky-400 hover:text-sky-300" />
        <ToolbarButton icon={TableIcon} onClick={() => setShowTableModal(prev => !prev)} btnTitle="Inserir Tabela Interativa (2x2, 3x3 ou Personalizada)" colorClass="text-cyan-400 hover:text-cyan-300" />
        
        {/* FASE 1: MENU DE CALLOUTS / DESTAQUES NOTION */}
        <div className="relative shrink-0 callout-menu-container">
          <ToolbarButton 
            icon={Lightbulb} 
            onClick={(e) => {
              e.stopPropagation();
              setShowCalloutMenu(prev => !prev);
            }} 
            btnTitle="Caixa de Destaque (Dica, Atenção, Conceito, Exemplo)" 
            colorClass={showCalloutMenu ? "text-amber-400 bg-slate-700 shadow-inner ring-1 ring-amber-400/50" : "text-amber-400 hover:text-amber-300"}
          />

          {showCalloutMenu && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-slate-800/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl p-2.5 z-50 animate-fade-in flex flex-col gap-1.5 text-left ring-1 ring-white/10"
              style={{ minWidth: '240px' }}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1 border-b border-slate-700/60 mb-1 flex items-center justify-between">
                <span>💡 Caixas de Destaque</span>
                <span className="text-[9px] text-amber-400 font-semibold bg-amber-400/10 px-1.5 py-0.5 rounded">Notion Style</span>
              </div>
              <button
                type="button"
                onClick={() => insertCallout('dica')}
                className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/15 rounded-xl transition-colors text-left cursor-pointer group"
              >
                <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">💡</span>
                <div className="min-w-0">
                  <div className="font-bold text-amber-300">Dica de Estudo</div>
                  <div className="text-[10px] font-normal text-amber-200/70 truncate">Macetes e lembretes de prova</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => insertCallout('atencao')}
                className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-bold text-red-300 hover:bg-red-500/15 rounded-xl transition-colors text-left cursor-pointer group"
              >
                <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">⚠️</span>
                <div className="min-w-0">
                  <div className="font-bold text-red-300">Ponto de Atenção</div>
                  <div className="text-[10px] font-normal text-red-200/70 truncate">Pegadinhas e erros comuns</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => insertCallout('conceito')}
                className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-bold text-purple-300 hover:bg-purple-500/15 rounded-xl transition-colors text-left cursor-pointer group"
              >
                <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">ℹ️</span>
                <div className="min-w-0">
                  <div className="font-bold text-purple-300">Conceito Chave</div>
                  <div className="text-[10px] font-normal text-purple-200/70 truncate">Definições teóricas essenciais</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => insertCallout('exemplo')}
                className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/15 rounded-xl transition-colors text-left cursor-pointer group"
              >
                <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">✅</span>
                <div className="min-w-0">
                  <div className="font-bold text-emerald-300">Exemplo Prático</div>
                  <div className="text-[10px] font-normal text-emerald-200/70 truncate">Exercício ou código aplicado</div>
                </div>
              </button>
            </div>
          )}
        </div>

        <ToolbarButton icon={Minus} onClick={() => formatText('insertHorizontalRule')} btnTitle="Linha Divisória" />
        
        {/* BOTÃO DE INSERIR IMAGEM (UPLOAD OU URL) */}
        <ToolbarButton 
          icon={ImageIcon} 
          onClick={() => setShowImageModal(true)} 
          btnTitle="Inserir Imagem (Upload do Computador ou URL)" 
          colorClass="text-purple-400 hover:text-purple-300" 
        />
        <Divider />
        
        {/* Cores */}
        <div className="flex gap-1.5 sm:gap-2 items-center bg-slate-900/50 rounded p-1 sm:p-1.5 px-2 sm:px-3 border border-slate-700/50 shrink-0 ml-0.5 sm:ml-1">
          <div className="flex items-center gap-1.5 relative group" title="Cor do Texto">
            <Palette size={16} className="text-slate-400 group-hover:text-white" />
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-slate-500 shadow-inner group-hover:scale-110 cursor-pointer">
              <input type="color" onChange={(e) => formatText('foreColor', e.target.value)} className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer" defaultValue="#ffffff" />
            </div>
          </div>
          <Divider />
          <div className="flex items-center gap-1.5 relative group" title="Destaque de Fundo">
            <Highlighter size={16} className="text-slate-400 group-hover:text-white" />
            <div className="relative w-6 h-6 rounded overflow-hidden border border-slate-500 shadow-inner group-hover:scale-110 cursor-pointer">
              <input type="color" onChange={(e) => formatText('hiliteColor', e.target.value)} className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer" defaultValue="#fef08a" />
            </div>
            <button type="button" onClick={() => formatText('hiliteColor', 'transparent')} className="ml-1 w-5 h-5 rounded flex items-center justify-center border border-slate-600 hover:bg-slate-700 text-slate-400 text-xs" title="Remover Destaque">✖</button>
          </div>
        </div>
      </div>

      {/* BARRA DE CONTROLE FLUTUANTE DA IMAGEM SELECIONADA */}
      {selectedImg && (
        <div className="image-control-bar bg-slate-950/95 border-b border-primary/50 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-2xl backdrop-blur-md animate-fade-in z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary flex items-center gap-1.5 bg-primary/20 px-2.5 py-1 rounded-md border border-primary/30">
              <Sliders size={14} /> Redimensionar e Alinhar Imagem:
            </span>
          </div>

          {/* Botões de Predefinição de Tamanho */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-semibold mr-1">Tamanho:</span>
            {[
              { label: '25%', val: 25 },
              { label: '33%', val: 33 },
              { label: '50%', val: 50 },
              { label: '75%', val: 75 },
              { label: '100%', val: 100 }
            ].map(preset => (
              <button
                key={preset.val}
                type="button"
                onClick={() => updateImgWidth(preset.val)}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition-all ${
                  imgWidth === preset.val 
                    ? 'bg-primary text-white shadow-md shadow-primary/30' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Slider de Tamanho Contínuo + Campo Numérico Exato */}
          <div className="flex items-center gap-2">
            <input 
              type="range"
              min="10"
              max="100"
              value={imgWidth}
              onChange={(e) => updateImgWidth(parseInt(e.target.value, 10))}
              className="w-24 accent-primary cursor-pointer"
              title="Arrastar para redimensionar"
            />
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5">
              <input
                type="number"
                min="10"
                max="100"
                value={imgWidth}
                onChange={(e) => {
                  const val = Math.min(100, Math.max(10, parseInt(e.target.value, 10) || 10));
                  updateImgWidth(val);
                }}
                className="w-10 bg-transparent text-xs font-mono font-bold text-white text-right focus:outline-none"
              />
              <span className="text-xs font-mono text-slate-400">%</span>
            </div>
          </div>

          {/* Alinhamento e Flutuação (Posicionamento Livre) */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => updateImgAlign('left')}
              className={`p-1.5 rounded transition-colors ${imgAlign === 'left' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              title="Alinhar à Esquerda (Bloco isolado)"
            >
              <AlignLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => updateImgAlign('center')}
              className={`p-1.5 rounded transition-colors ${imgAlign === 'center' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              title="Centralizar (Bloco isolado)"
            >
              <AlignCenter size={16} />
            </button>
            <button
              type="button"
              onClick={() => updateImgAlign('right')}
              className={`p-1.5 rounded transition-colors ${imgAlign === 'right' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              title="Alinhar à Direita (Bloco isolado)"
            >
              <AlignRight size={16} />
            </button>
            <div className="w-px h-4 bg-slate-700 mx-1"></div>
            <button
              type="button"
              onClick={() => updateImgAlign('float-left')}
              className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${imgAlign === 'float-left' ? 'bg-primary text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
              title="Flutuar à Esquerda: O texto da apostila corre ao lado direito da imagem"
            >
              ◀ Flutuar Esq
            </button>
            <button
              type="button"
              onClick={() => updateImgAlign('float-right')}
              className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${imgAlign === 'float-right' ? 'bg-primary text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
              title="Flutuar à Direita: O texto da apostila corre ao lado esquerdo da imagem"
            >
              Flutuar Dir ▶
            </button>
          </div>

          {/* Excluir e Concluir */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={deleteSelectedImg}
              className="p-1.5 px-2 bg-red-500/10 hover:bg-red-500/25 text-red-400 rounded-lg text-xs font-bold flex items-center gap-1 border border-red-500/30"
              title="Remover Imagem"
            >
              <Trash2 size={14} /> Excluir
            </button>
            <button
              type="button"
              onClick={deselectImg}
              className="p-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-md"
            >
              <Check size={14} /> Pronto
            </button>
          </div>
        </div>
      )}

      {/* BARRA DE CONTROLE FLUTUANTE DA TABELA INTERATIVA */}
      {selectedTable && (
        <div className="table-control-bar bg-slate-950/95 border-b border-cyan-500/50 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-2xl backdrop-blur-md animate-fade-in z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 bg-cyan-950/80 px-2.5 py-1 rounded-md border border-cyan-500/30">
              <TableIcon size={14} /> Tabela Interativa Ativa
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              (Clique em qualquer célula para editar o texto)
            </span>
          </div>

          {/* Ações de Linhas e Colunas */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={addTableRow}
                className="px-2.5 py-1 bg-slate-800 hover:bg-cyan-600/30 text-cyan-300 rounded text-xs font-bold flex items-center gap-1 transition-colors"
                title="Adicionar Linha abaixo"
              >
                <Plus size={13} /> Linha
              </button>
              <button
                type="button"
                onClick={addTableColumn}
                className="px-2.5 py-1 bg-slate-800 hover:bg-cyan-600/30 text-cyan-300 rounded text-xs font-bold flex items-center gap-1 transition-colors"
                title="Adicionar Coluna à direita"
              >
                <Plus size={13} /> Coluna
              </button>
            </div>

            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={deleteTableRow}
                className="px-2.5 py-1 bg-slate-800 hover:bg-amber-600/30 text-amber-300 rounded text-xs font-bold flex items-center gap-1 transition-colors"
                title="Excluir Linha Selecionada"
              >
                <Minus size={13} /> Linha
              </button>
              <button
                type="button"
                onClick={deleteTableColumn}
                className="px-2.5 py-1 bg-slate-800 hover:bg-amber-600/30 text-amber-300 rounded text-xs font-bold flex items-center gap-1 transition-colors"
                title="Excluir Coluna Selecionada"
              >
                <Minus size={13} /> Coluna
              </button>
            </div>

            <button
              type="button"
              onClick={deleteSelectedTable}
              className="p-1.5 px-2 bg-red-500/10 hover:bg-red-500/25 text-red-400 rounded-lg text-xs font-bold flex items-center gap-1 border border-red-500/30 transition-colors"
              title="Excluir Tabela Inteira"
            >
              <Trash2 size={13} /> Excluir Tabela
            </button>

            <button
              type="button"
              onClick={deselectTable}
              className="p-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-md transition-colors"
            >
              <Check size={14} /> Concluir
            </button>
          </div>
        </div>
      )}

      {/* BARRA DE CONTROLE FLUTUANTE DO BLOCO VS CODE (IDE) */}
      {selectedCodeContainer && (
        <div className="vscode-control-bar bg-slate-950/95 border-b border-sky-500/50 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-2xl backdrop-blur-md animate-fade-in z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5 bg-sky-950/80 px-2.5 py-1 rounded-md border border-sky-500/30">
              <FileCode size={14} /> Bloco de Código VS Code Selecionado
            </span>
            <span className="text-xs text-slate-300 font-mono">
              {selectedCodeContainer.getAttribute('data-filename') || 'script'} ({selectedCodeContainer.getAttribute('data-lang') || 'code'})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openVsCodeModal(selectedCodeContainer)}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Edit3 size={13} /> Editar Código & Linguagem
            </button>
            <button
              type="button"
              onClick={() => {
                const code = selectedCodeContainer.querySelector('code')?.innerText || '';
                navigator.clipboard.writeText(code);
              }}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors border border-slate-700"
            >
              <Copy size={13} /> Copiar
            </button>
            <button
              type="button"
              onClick={() => {
                selectedCodeContainer.remove();
                setSelectedCodeContainer(null);
                updateEditorStats();
              }}
              className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/25 text-red-400 rounded-lg text-xs font-bold flex items-center gap-1 border border-red-500/30 transition-colors"
            >
              <Trash2 size={13} /> Excluir
            </button>
            <button
              type="button"
              onClick={() => setSelectedCodeContainer(null)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <Check size={13} /> Pronto
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE INSERÇÃO DE TABELA (2x2, 3x3 OU PERSONALIZADA) */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 table-modal">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-md w-full shadow-2xl relative animate-fade-in text-left">
            <button 
              type="button"
              onClick={() => setShowTableModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <TableIcon className="text-cyan-400" size={22} /> Inserir Tabela Interativa
            </h3>
            <p className="text-slate-400 text-xs mb-6">
              Crie sua tabela e configure quantas linhas e colunas desejar. Depois de inserida, você pode adicionar ou remover linhas e colunas a qualquer momento com 1 clique!
            </p>

            {/* Modelos Prontos */}
            <div className="mb-6">
              <span className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Modelos Rápidos:</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => insertInteractiveTable(2, 2)}
                  className="p-3 bg-slate-800 hover:bg-cyan-950/60 border border-slate-700 hover:border-cyan-500/60 rounded-xl text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-white group-hover:text-cyan-300">Tabela 2x2</span>
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-mono font-bold">2 col × 2 lin</span>
                  </div>
                  <p className="text-xs text-slate-400">Ideal para comparações diretas de dois itens ou conceitos.</p>
                </button>

                <button
                  type="button"
                  onClick={() => insertInteractiveTable(3, 3)}
                  className="p-3 bg-slate-800 hover:bg-cyan-950/60 border border-slate-700 hover:border-cyan-500/60 rounded-xl text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-white group-hover:text-cyan-300">Tabela 3x3</span>
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-mono font-bold">3 col × 3 lin</span>
                  </div>
                  <p className="text-xs text-slate-400">Excelente para tabelas conceituais com Descrição e Exemplos.</p>
                </button>
              </div>
            </div>

            {/* Configuração Personalizada */}
            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80 mb-6">
              <span className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Tamanho Personalizado:</span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Colunas:</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={tableColsInput}
                    onChange={(e) => setTableColsInput(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Linhas:</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={tableRowsInput}
                    onChange={(e) => setTableRowsInput(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white font-medium cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => insertInteractiveTable(tableColsInput, tableRowsInput)}
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <TableIcon size={16} /> Criar Tabela
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CÓDIGO ESTILO IDE (VS CODE) */}
      {showVsCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 vscode-modal">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full shadow-2xl relative animate-fade-in flex flex-col max-h-[92vh] overflow-hidden text-left">
            
            {/* Top Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
                  <FileCode size={18} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    Editor de Código Estilo IDE (VS Code)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Diferenciação automática de comandos, palavras-chave, variáveis, strings e funções coloridas.
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setShowVsCodeModal(false);
                  setSelectedCodeContainer(null);
                }}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Controls Bar: Linguagem e Nome do Arquivo */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Linguagem:</label>
                  <select
                    value={vsCodeLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-bold text-sky-300 focus:border-sky-500 focus:outline-none cursor-pointer"
                  >
                    {SUPPORTED_LANGUAGES.map(lang => (
                      <option key={lang.id} value={lang.id}>{lang.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nome da Aba / Arquivo:</label>
                  <input
                    type="text"
                    value={vsCodeFileName}
                    onChange={(e) => setVsCodeFileName(e.target.value)}
                    placeholder="ex: main.js"
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:border-sky-500 focus:outline-none w-40"
                  />
                </div>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Prévia em Tempo Real com Destaque VS Code</span>
              </div>
            </div>

            {/* Editor & Preview Split Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Digite ou Cole o Código:</span>
                  <span className="text-[11px] text-slate-400 font-normal">Suporta indentação com Tab</span>
                </label>
                <textarea
                  value={vsCodeSnippet}
                  onChange={(e) => setVsCodeSnippet(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Tab') {
                      e.preventDefault();
                      const start = e.target.selectionStart;
                      const end = e.target.selectionEnd;
                      const newVal = vsCodeSnippet.substring(0, start) + '  ' + vsCodeSnippet.substring(end);
                      setVsCodeSnippet(newVal);
                      setTimeout(() => {
                        e.target.selectionStart = e.target.selectionEnd = start + 2;
                      }, 0);
                    }
                  }}
                  rows={7}
                  className="w-full bg-[#18181b] border border-slate-700 rounded-xl p-3.5 text-xs sm:text-sm font-mono text-emerald-400 focus:border-sky-500 focus:outline-none leading-relaxed resize-y selection:bg-sky-600/40"
                  placeholder="// Cole seu código aqui..."
                />
              </div>

              {/* Live Preview Box */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Prévia Formatada com Sintaxe Estilo VS Code:
                </label>
                <div 
                  className="rounded-xl overflow-hidden border border-slate-700/80 shadow-inner bg-[#1e1e1e]"
                  dangerouslySetInnerHTML={{
                    __html: generateVsCodeHtml({
                      code: vsCodeSnippet || '// Seu código aparecerá formatado aqui...',
                      language: vsCodeLanguage,
                      fileName: vsCodeFileName
                    })
                  }}
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowVsCodeModal(false);
                  setSelectedCodeContainer(null);
                }}
                className="px-4 py-2 text-xs sm:text-sm text-slate-400 hover:text-white font-medium cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={insertOrUpdateVsCodeBlock}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-sky-600/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Check size={16} /> {selectedCodeContainer ? 'Salvar Alterações no Bloco' : 'Inserir Código na Apostila'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DE INSERÇÃO DE IMAGEM */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 image-modal">
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl max-w-md w-full shadow-2xl relative animate-fade-in">
            <button 
              type="button"
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <ImageIcon className="text-primary" size={22} /> Inserir Imagem na Apostila
            </h3>
            <p className="text-slate-400 text-xs mb-6">
              Você pode enviar uma foto do seu computador ou colar um link da web:
            </p>

            {/* Tabs do Modal */}
            <div className="flex gap-2 p-1 bg-slate-900 rounded-xl mb-6 border border-slate-700/60">
              <button
                type="button"
                onClick={() => setImageModalTab('upload')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                  imageModalTab === 'upload' 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Upload size={15} /> Do Computador
              </button>
              <button
                type="button"
                onClick={() => setImageModalTab('url')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                  imageModalTab === 'url' 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LinkIcon size={15} /> Link da Web (URL)
              </button>
            </div>

            {imageModalTab === 'upload' ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-600 hover:border-primary p-8 rounded-xl text-center cursor-pointer transition-all hover:bg-slate-700/30 group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Upload size={24} />
                </div>
                <p className="text-sm font-bold text-white mb-1">Clique para escolher do seu PC</p>
                <p className="text-xs text-slate-400">Suporta PNG, JPG, GIF e WebP (até 10MB)</p>
              </div>
            ) : (
              <form onSubmit={handleUrlImageSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Endereço da Imagem (URL)</label>
                  <input 
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://exemplo.com/imagem.png"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-primary outline-none"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowImageModal(false)}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-lg shadow-md"
                  >
                    Inserir Imagem
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Área de Digitação com Estilos Customizados para H1, H2, H3 */}
      <div 
        onClick={handleEditorClick}
        className="flex-1 overflow-y-auto px-3.5 sm:px-6 md:px-16 lg:px-28 py-4 sm:py-8 bg-slate-900"
      >
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-none p-0 text-2xl sm:text-4xl font-black text-white focus:outline-none mb-4 sm:mb-6 placeholder-slate-600"
            placeholder="Título da Apostila (ex: Guia Completo de Redes)"
          />
          
          <style>{`
            .editor-content h1 {
              font-size: 2.2rem !important;
              font-weight: 900 !important;
              color: #ffffff !important;
              margin-top: 1.5rem !important;
              margin-bottom: 0.75rem !important;
              line-height: 1.25 !important;
              border-bottom: 2px solid rgba(124, 58, 237, 0.4) !important;
              padding-bottom: 0.5rem !important;
            }
            .editor-content h2 {
              font-size: 1.7rem !important;
              font-weight: 800 !important;
              color: #f1f5f9 !important;
              margin-top: 1.25rem !important;
              margin-bottom: 0.5rem !important;
              line-height: 1.3 !important;
              border-left: 4px solid #7c3aed !important;
              padding-left: 0.75rem !important;
            }
            .editor-content h3 {
              font-size: 1.35rem !important;
              font-weight: 700 !important;
              color: #cbd5e1 !important;
              margin-top: 1rem !important;
              margin-bottom: 0.5rem !important;
              line-height: 1.4 !important;
            }
            .editor-content p {
              font-size: 1.05rem !important;
              line-height: 1.8 !important;
              margin-bottom: 0.85rem !important;
              color: #cbd5e1 !important;
            }
            .editor-content blockquote {
              border-left: 4px solid #7c3aed;
              padding-left: 1rem;
              margin-left: 0;
              color: #94a3b8;
              font-style: italic;
              background-color: rgba(30, 41, 59, 0.5);
              padding: 1rem;
              border-radius: 0.5rem;
              margin-bottom: 1rem;
            }
            .editor-content pre {
              background-color: #020617;
              padding: 1rem;
              border-radius: 0.5rem;
              font-family: monospace;
              border: 1px solid #334155;
              overflow-x: auto;
              color: #38bdf8;
              margin-bottom: 1rem;
            }
            .editor-content hr {
              border-color: #334155;
              margin: 2rem 0;
            }
            .editor-content ul {
              list-style-type: disc !important;
              padding-left: 2rem !important;
              margin-bottom: 1rem !important;
            }
            .editor-content ol {
              list-style-type: decimal !important;
              padding-left: 2rem !important;
              margin-bottom: 1rem !important;
            }
            .editor-content img {
              border-radius: 0.75rem;
              transition: all 0.2s ease;
            }
            .editor-content img.selected-img {
              outline: 3px solid #7c3aed !important;
              box-shadow: 0 0 25px rgba(124, 58, 237, 0.6) !important;
            }
            /* Callouts no Editor */
            .editor-content .callout {
              border-radius: 0.75rem;
              padding: 1rem 1.25rem;
              margin: 1.25rem 0;
            }
            /* Tabelas no Editor */
            .editor-content table {
              width: 100%;
              border-collapse: collapse;
              margin: 1.25rem 0;
            }
            .editor-content th, .editor-content td {
              padding: 0.75rem 1rem;
              border: 1px solid #334155;
            }
            /* Código Terminal no Editor */
            .editor-content .code-terminal-block {
              margin: 1.25rem 0;
              border-radius: 0.75rem;
              overflow: hidden;
              border: 1px solid #334155;
            }
          `}</style>

          <div 
            ref={editorRef}
            contentEditable
            onInput={updateEditorStats}
            onKeyUp={updateEditorStats}
            onKeyDown={handleEditorKeyDown}
            className="editor-content w-full min-h-[50vh] bg-transparent border-none p-0 text-base sm:text-lg text-slate-300 focus:outline-none pb-32 outline-none"
            placeholder="Comece a escrever o conteúdo da sua apostila aqui... use a barra de ferramentas para formatar H1, H2, H3, adicionar código e imagens do seu PC!"
            style={{ lineHeight: '1.8' }}
          />
        </div>
      </div>

      {/* Rodapé com Estatísticas de Leitura e Dicas (Fases 5 e 7) */}
      <div className="bg-slate-950/90 border-t border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between text-xs text-slate-400 z-10 flex-shrink-0 gap-2">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <FileText size={14} className="text-primary" /> {editorStats.words} {editorStats.words === 1 ? 'palavra' : 'palavras'}
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">{editorStats.chars} caracteres</span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5 text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
            <Clock size={13} /> ~{editorStats.readingTime} min de leitura
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-slate-500 text-[11px]">
          <span>Indentação: <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300 font-mono">Tab</kbd></span>
          <span>Salvar: <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300 font-mono">Ctrl+S</kbd></span>
        </div>
      </div>

    </div>
  );

  return view === 'hub' ? renderHub() : view === 'reader' ? renderReader() : renderEditor();
}

export default CriarApostila;
