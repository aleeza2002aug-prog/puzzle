import React, { useEffect, useRef } from 'react';
import { Direction, MatchMergeState } from '../../game/logic/matchMerge';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
  state: MatchMergeState;
  onSlide: (dir: Direction) => void;
  disabled?: boolean;
}

const TILE_STYLES: Record<number, { bg: string; text: string; label: string }> = {
  2: { bg: 'bg-emerald-950/80 border-emerald-600/50 text-emerald-300', text: 'text-emerald-300', label: 'Jade' },
  4: { bg: 'bg-teal-950/80 border-teal-500/50 text-teal-300', text: 'text-teal-300', label: 'Cyan' },
  8: { bg: 'bg-sky-950/80 border-sky-500/60 text-sky-200', text: 'text-sky-200', label: 'Sapphire' },
  16: { bg: 'bg-indigo-950/80 border-indigo-500/60 text-indigo-200', text: 'text-indigo-200', label: 'Lapis' },
  32: { bg: 'bg-purple-950/80 border-purple-500/60 text-purple-200', text: 'text-purple-200', label: 'Amethyst' },
  64: { bg: 'bg-rose-950/80 border-rose-500/60 text-rose-200', text: 'text-rose-200', label: 'Ruby' },
  128: { bg: 'bg-amber-950/80 border-amber-500/70 text-amber-200', text: 'text-amber-200', label: 'Amber' },
  256: { bg: 'bg-yellow-950/90 border-yellow-400 text-yellow-300 shadow-yellow-500/30 shadow-lg', text: 'text-yellow-300', label: 'Diamond' },
};

export const MatchMergeBoard: React.FC<Props> = ({ state, onSlide, disabled }) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        onSlide('up');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        onSlide('down');
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        onSlide('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        onSlide('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, onSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || disabled) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.hypot(dx, dy) < 25) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      onSlide(dx > 0 ? 'right' : 'left');
    } else {
      onSlide(dy > 0 ? 'down' : 'up');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-2 w-full">
      {/* Board */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="p-3 rounded-3xl bg-slate-900 border-2 border-slate-800 shadow-2xl max-w-[340px] sm:max-w-[380px] w-full aspect-square flex flex-col justify-between select-none"
        style={{ touchAction: 'none' }}
      >
        <div
          className="grid gap-2 w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${state.size}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${state.size}, minmax(0, 1fr))`,
          }}
        >
          {state.grid.map((val, idx) => {
            const isEmpty = val === 0;
            const isObstacle = val === -1;
            const style = TILE_STYLES[val] || {
              bg: 'bg-indigo-900 border-indigo-400 text-white',
              text: 'text-white',
              label: 'Gem',
            };

            if (isEmpty) {
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-950/60 border border-slate-800/40"
                />
              );
            }

            if (isObstacle) {
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-stone-900 border-2 border-stone-700 flex flex-col items-center justify-center text-xs font-bold text-stone-400"
                >
                  <span>🪨</span>
                  <span className="text-[10px] mt-0.5 uppercase tracking-wider">Rock</span>
                </div>
              );
            }

            return (
              <div
                key={idx}
                className={`rounded-2xl border-2 flex flex-col items-center justify-center font-black text-xl sm:text-2xl transition-all shadow-sm ${style.bg}`}
              >
                <span>{val}</span>
                <span className="text-[9px] uppercase tracking-wider opacity-60 font-semibold">
                  {style.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Touch Directional Controls */}
      <div className="mt-4 flex flex-col items-center gap-1">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSlide('up')}
          className="w-12 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-indigo-600 border border-slate-700 text-slate-200 flex items-center justify-center cursor-pointer transition-all shadow-sm"
          aria-label="Slide Up"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-6">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onSlide('left')}
            className="w-12 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-indigo-600 border border-slate-700 text-slate-200 flex items-center justify-center cursor-pointer transition-all shadow-sm"
            aria-label="Slide Left"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onSlide('down')}
            className="w-12 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-indigo-600 border border-slate-700 text-slate-200 flex items-center justify-center cursor-pointer transition-all shadow-sm"
            aria-label="Slide Down"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onSlide('right')}
            className="w-12 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-indigo-600 border border-slate-700 text-slate-200 flex items-center justify-center cursor-pointer transition-all shadow-sm"
            aria-label="Slide Right"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
