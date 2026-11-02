/**
 * Utilitários de Estilo para Itens da Loja e Personalizações (UniStudy Hub)
 * Garante compatibilidade 100% com Tailwind CSS v4 e CSS nativo.
 */

export const FRAME_CONFIGS = {
  'Moldura Cyber-Volt Relâmpago': {
    className: 'store-frame-cyber-volt',
    borderClass: 'border-blue-500',
    ringClass: 'ring-2 ring-purple-400',
    glowColor: 'rgba(59, 130, 246, 0.95)',
    secondaryGlow: 'rgba(192, 132, 252, 0.75)',
    icon: '⚡'
  },
  'Moldura Neon Cyberpunk': {
    className: 'store-frame-neon-cyberpunk',
    borderClass: 'border-cyan-400',
    ringClass: 'ring-2 ring-fuchsia-500',
    glowColor: 'rgba(34, 211, 238, 0.95)',
    secondaryGlow: 'rgba(217, 70, 239, 0.75)',
    icon: '🌆'
  },
  'Moldura Dourada Real': {
    className: 'store-frame-dourada-real',
    borderClass: 'border-amber-400',
    ringClass: 'ring-2 ring-yellow-300',
    glowColor: 'rgba(251, 191, 36, 0.95)',
    secondaryGlow: 'rgba(245, 158, 11, 0.75)',
    icon: '👑'
  },
  'Moldura Chama Dracônica': {
    className: 'store-frame-chama-draconica',
    borderClass: 'border-orange-500',
    ringClass: 'ring-2 ring-amber-400',
    glowColor: 'rgba(249, 115, 22, 0.95)',
    secondaryGlow: 'rgba(239, 68, 68, 0.75)',
    icon: '🔥'
  },
  'Moldura Glacial do Ártico': {
    className: 'store-frame-glacial-artico',
    borderClass: 'border-cyan-300',
    ringClass: 'ring-2 ring-blue-400',
    glowColor: 'rgba(103, 232, 249, 0.95)',
    secondaryGlow: 'rgba(96, 165, 250, 0.75)',
    icon: '❄️'
  },
  'Moldura Ametista Astral': {
    className: 'store-frame-ametista-astral',
    borderClass: 'border-purple-500',
    ringClass: 'ring-2 ring-fuchsia-400',
    glowColor: 'rgba(168, 85, 247, 0.95)',
    secondaryGlow: 'rgba(232, 121, 249, 0.75)',
    icon: '🔮'
  },
  'Moldura Égide de Titânio': {
    className: 'store-frame-egide-titanio',
    borderClass: 'border-slate-300',
    ringClass: 'ring-2 ring-indigo-400',
    glowColor: 'rgba(203, 213, 225, 0.95)',
    secondaryGlow: 'rgba(129, 140, 248, 0.75)',
    icon: '🛡️'
  }
};

export const THEME_CONFIGS = {
  'Tema Cyberpunk Neon Tokyo': {
    key: 'cyberpunk',
    className: 'store-theme-cyberpunk',
    gradient: 'linear-gradient(135deg, rgba(88, 28, 135, 0.95) 0%, rgba(15, 23, 42, 0.95) 50%, rgba(8, 51, 68, 0.95) 100%)',
    borderColor: 'rgba(217, 70, 239, 0.6)',
    glow: '0 0 35px rgba(217, 70, 239, 0.35)',
    accentColor: '#d946ef',
    tagBg: 'bg-fuchsia-950/80 text-fuchsia-300 border-fuchsia-400/50',
    icon: '🌆'
  },
  'Tema Dark Matrix': {
    key: 'matrix',
    className: 'store-theme-matrix',
    gradient: 'linear-gradient(135deg, rgba(6, 78, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 50%, rgba(19, 78, 74, 0.95) 100%)',
    borderColor: 'rgba(16, 185, 129, 0.6)',
    glow: '0 0 35px rgba(16, 185, 129, 0.35)',
    accentColor: '#10b981',
    tagBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-400/50',
    icon: '💻'
  },
  'Tema Sunset Synthwave': {
    key: 'synthwave',
    className: 'store-theme-synthwave',
    gradient: 'linear-gradient(135deg, rgba(131, 24, 67, 0.95) 0%, rgba(59, 7, 100, 0.95) 50%, rgba(120, 53, 15, 0.95) 100%)',
    borderColor: 'rgba(236, 72, 153, 0.6)',
    glow: '0 0 35px rgba(236, 72, 153, 0.35)',
    accentColor: '#ec4899',
    tagBg: 'bg-pink-950/80 text-pink-300 border-pink-400/50',
    icon: '🌅'
  },
  'Tema Cósmico Estelar': {
    key: 'cosmic',
    className: 'store-theme-cosmic',
    gradient: 'linear-gradient(135deg, rgba(49, 46, 129, 0.95) 0%, rgba(59, 7, 100, 0.95) 50%, rgba(15, 23, 42, 0.95) 100%)',
    borderColor: 'rgba(129, 140, 248, 0.6)',
    glow: '0 0 35px rgba(129, 140, 248, 0.35)',
    accentColor: '#818cf8',
    tagBg: 'bg-indigo-950/80 text-indigo-300 border-indigo-400/50',
    icon: '✨'
  },
  'Tema Floresta Esmeralda Mística': {
    key: 'forest',
    className: 'store-theme-forest',
    gradient: 'linear-gradient(135deg, rgba(6, 78, 59, 0.95) 0%, rgba(15, 118, 110, 0.95) 50%, rgba(15, 23, 42, 0.95) 100%)',
    borderColor: 'rgba(52, 211, 153, 0.6)',
    glow: '0 0 35px rgba(52, 211, 153, 0.35)',
    accentColor: '#34d399',
    tagBg: 'bg-teal-950/80 text-teal-300 border-teal-400/50',
    icon: '🍃'
  }
};

export const BADGE_CONFIGS = {
  'Selo Coruja da Sabedoria': { emoji: '🦉', color: 'from-amber-400 to-amber-600', border: 'border-amber-400/60' },
  'Selo Perfil Verificado': { emoji: '⭐', color: 'from-blue-400 to-indigo-600', border: 'border-blue-400/60' },
  'Selo Café com Código': { emoji: '☕', color: 'from-amber-600 to-orange-700', border: 'border-amber-500/60' },
  'Selo Mestre Lendário dos Quizzes': { emoji: '👑', color: 'from-yellow-400 to-amber-500', border: 'border-yellow-400/80' }
};

export function getFrameConfig(frame) {
  if (!frame) return null;
  const name = frame.name || '';
  if (FRAME_CONFIGS[name]) return FRAME_CONFIGS[name];

  // Busca parcial por palavras-chave
  for (const [key, conf] of Object.entries(FRAME_CONFIGS)) {
    if (name.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(name.toLowerCase())) {
      return conf;
    }
  }

  // Fallback padrão se houver asset_url com classes tailwind
  return {
    className: 'store-frame-custom',
    borderClass: 'border-primary',
    ringClass: 'ring-2 ring-primary/60',
    glowColor: 'rgba(109, 40, 217, 0.8)',
    secondaryGlow: 'rgba(56, 189, 248, 0.6)',
    icon: '✨'
  };
}

export function getThemeConfig(theme) {
  if (!theme) return null;
  const name = theme.name || '';
  if (THEME_CONFIGS[name]) return THEME_CONFIGS[name];

  for (const [key, conf] of Object.entries(THEME_CONFIGS)) {
    if (name.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(name.toLowerCase())) {
      return conf;
    }
  }

  return {
    key: 'custom',
    className: 'store-theme-custom',
    gradient: 'linear-gradient(135deg, rgba(109, 40, 217, 0.9) 0%, rgba(147, 51, 234, 0.8) 50%, rgba(56, 189, 248, 0.8) 100%)',
    borderColor: 'rgba(147, 51, 234, 0.5)',
    glow: '0 0 30px rgba(109, 40, 217, 0.3)',
    accentColor: '#a855f7',
    tagBg: 'bg-purple-950/80 text-purple-300 border-purple-400/50',
    icon: '🎨'
  };
}

export function getBadgeConfig(badge) {
  if (!badge) return null;
  const name = badge.name || '';
  const asset = badge.asset_url || '';
  const emoji = asset && asset.length <= 4 ? asset : (BADGE_CONFIGS[name]?.emoji || '⭐');

  if (BADGE_CONFIGS[name]) {
    return { ...BADGE_CONFIGS[name], emoji, name };
  }

  return {
    emoji,
    name,
    color: 'from-amber-400 to-purple-600',
    border: 'border-amber-400/60'
  };
}

export function applyThemeToApp(theme) {
  if (typeof document === 'undefined') return;
  const themeClasses = ['theme-cyberpunk', 'theme-matrix', 'theme-synthwave', 'theme-cosmic', 'theme-forest'];
  themeClasses.forEach(cls => document.body.classList.remove(cls));

  const conf = getThemeConfig(theme);
  if (conf && conf.key && conf.key !== 'custom') {
    document.body.classList.add(`theme-${conf.key}`);
  }
}
