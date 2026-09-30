import { useState, useCallback } from 'react';
import { initGame, move } from './core/engine';
import type { Direction } from './types/game';
import { TileView } from './components/TileView';
import { useGameControls } from './hooks/useGameControls';

export default function App() {
  const [game, setGame] = useState(() => initGame());

  const handleMove = useCallback((dir: Direction) => {
    setGame(prev => move(prev, dir));
  }, []);

  const { handleTouchStart, handleTouchEnd } = useGameControls(handleMove);

  const resetGame = () => setGame(initGame());

  return (
    <main className="min-h-screen bg-[#faf8ef] text-[#776e65] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-5xl font-black text-[#776e65]">2048</h1>
          <div className="flex gap-2">
            <div className="bg-[#bbada0] text-white px-3 py-1.5 rounded font-bold text-center">
              <div className="text-[10px] tracking-wider uppercase">Score</div>
              <div className="text-lg">{game.score}</div>
            </div>
            <div className="bg-[#bbada0] text-white px-3 py-1.5 rounded font-bold text-center">
              <div className="text-[10px] tracking-wider uppercase">Best</div>
              <div className="text-lg">{game.bestScore}</div>
            </div>
          </div>
        </header>

        {/* Action bar */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm">Join the numbers to get to the <strong>2048 tile!</strong></p>
          <button
            onClick={resetGame}
            className="bg-[#8f7a66] hover:bg-[#9f8a76] text-white font-bold py-2 px-4 rounded text-sm transition"
          >
            New Game
          </button>
        </div>

        {/* Board */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative bg-[#bbada0] p-2.5 rounded-lg aspect-square touch-none select-none"
        >
          {/* Background Grid Cells */}
          <div className="grid grid-cols-4 grid-rows-4 gap-2.5 w-full h-full">
            {Array.from({ length: 16 }).map((_, idx) => (
              <div key={idx} className="bg-[#cdc1b4] rounded-md w-full h-full" />
            ))}
          </div>

          {/* Dynamic Tiles */}
          <div className="absolute inset-2.5">
            {game.tiles.map(tile => (
              <TileView key={tile.id} tile={tile} />
            ))}
          </div>

          {/* Overlays */}
          {game.over && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center rounded-lg">
              <h2 className="text-4xl font-extrabold text-[#776e65] mb-2">Game Over!</h2>
              <button
                onClick={resetGame}
                className="bg-[#8f7a66] text-white font-bold py-2 px-6 rounded shadow"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}