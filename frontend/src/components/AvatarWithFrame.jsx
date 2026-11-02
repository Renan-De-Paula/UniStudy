import React from 'react';
import { getFrameConfig, getBadgeConfig } from '../utils/customizationStyles';

/**
 * AvatarWithFrame: Componente de Avatar com Moldura e Selo Equipados.
 * Garante que a moldura (borda, anel, brilho neon) fique 100% visível sem ser cortada por overflow-hidden!
 */
export default function AvatarWithFrame({
  src,
  alt = 'Avatar',
  size = 'md',
  frame = null,
  badge = null,
  showBadge = false,
  className = '',
  onClick = null,
  title = ''
}) {
  const frameConf = getFrameConfig(frame);
  const badgeConf = getBadgeConfig(badge);

  const fallbackSrc = 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix';
  const avatarSrc = src || fallbackSrc;

  // Tamanhos padronizados
  const sizeMap = {
    xs: { outer: 'w-7 h-7', inner: 'w-5 h-5', badge: 'text-[9px] -bottom-1 -right-1 p-0.5' },
    sm: { outer: 'w-9 h-9', inner: 'w-7 h-7', badge: 'text-[10px] -bottom-1 -right-1 p-0.5' },
    md: { outer: 'w-11 h-11', inner: 'w-9 h-9', badge: 'text-xs -bottom-1 -right-1 p-0.5' },
    lg: { outer: 'w-16 h-16', inner: 'w-13 h-13', badge: 'text-sm -bottom-1.5 -right-1 p-1' },
    xl: { outer: 'w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40', inner: 'w-full h-full', badge: 'text-lg -bottom-1 -right-1 p-1.5' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Estilos da Moldura
  const frameClass = frameConf ? frameConf.className : 'border-slate-800 shadow-[0_0_15px_rgba(109,40,217,0.3)]';

  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 ${currentSize.outer} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      title={title || (frameConf ? `Moldura: ${frame?.name || 'Equipada'}` : alt)}
    >
      {/* Moldura Externa (Borda + Glow + Halo) */}
      <div 
        className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-300 ${frameClass} ${
          frameConf ? 'border-2 sm:border-[3px]' : 'border-2 border-primary/40'
        }`}
      >
        {/* Recipiente Interno com Overflow Hidden para a Foto */}
        <div className="w-full h-full rounded-full overflow-hidden bg-slate-800 flex items-center justify-center">
          <img 
            src={avatarSrc} 
            alt={alt} 
            className="w-full h-full object-cover select-none"
            loading="lazy"
          />
        </div>
      </div>

      {/* Selo Miniativo no Canto Inferior Direito (opcional) */}
      {showBadge && badgeConf && (
        <span 
          className={`absolute ${currentSize.badge} rounded-full bg-slate-900 border border-amber-400/80 shadow-md flex items-center justify-center animate-bounce-subtle z-10 select-none`}
          title={`Selo: ${badgeConf.name || 'Conquista'}`}
        >
          {badgeConf.emoji}
        </span>
      )}
    </div>
  );
}
