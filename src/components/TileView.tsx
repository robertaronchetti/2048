import React from 'react';
import type { Tile } from '../types/game';

const COLOR_MAP: Record<number, { bg: string; text: string }> = {
  2: { bg: 'bg-[#eee4da]', text: 'text-[#776e65]' },
  4: { bg: 'bg-[#ede0c8]', text: 'text-[#776e65]' },
  8: { bg: 'bg-[#f2b179]', text: 'text-white' },
  16: { bg: 'bg-[#f59563]', text: 'text-white' },
  32: { bg: 'bg-[#f67c5f]', text: 'text-white' },
  64: { bg: 'bg-[#f65e3b]', text: 'text-white' },
  128: { bg: 'bg-[#edcf72]', text: 'text-white' },
  256: { bg: 'bg-[#edcc61]', text: 'text-white' },
  512: { bg: 'bg-[#edc850]', text: 'text-white' },
  1024: { bg: 'bg-[#edc53f]', text: 'text-white' },
  2048: { bg: 'bg-[#edc22e]', text: 'text-white' },
};

export const TileView: React.FC<{ tile: Tile }> = ({ tile }) => {
  const theme = COLOR_MAP[tile.value] || { bg: 'bg-[#3c3a32]', text: 'text-white' };

  const style: React.CSSProperties = {
    transform: `translate3d(${tile.col * 100}%, ${tile.row * 100}%, 0)`,
    transition: 'transform 100ms ease-in-out',
  };

  return (
    <div
      style={style}
      className="absolute top-0 left-0 w-1/4 h-1/4 p-1.5 box-border"
    >
      <div
        className={`w-full h-full rounded-md flex items-center justify-center font-bold text-2xl md:text-3xl select-none shadow-sm ${
          theme.bg
        } ${theme.text} ${tile.isNew ? 'animate-scale-in' : ''} ${
          tile.isMerged ? 'animate-pop' : ''
        }`}
      >
        {tile.value}
      </div>
    </div>
  );
};