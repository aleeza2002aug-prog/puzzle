import React, { useEffect, useRef } from 'react';
import { getValidSlideMoves } from '../../game/logic/slidingTile';
import { Lock } from 'lucide-react';

interface Props {
  size: number;
  tiles: number[];
  lockedTileIndices?: number[];
  hintHighlightIdx?: number | null;
  onMoveTile: (tileIndex: number) => void;
  disabled?: boolean;
}

export const SlidingTileBoard: React.FC<Props> = ({
  size,
  tiles,
  lockedTileIndices = [],
  hintHighlightIdx,
  onMoveTile,
  disabled,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      const emptyIdx = tiles.indexOf(0);
      if (emptyIdx === -1) return;

      const emptyRow = Math.floor(emptyIdx / size);
      const emptyCol = emptyIdx % size;

      let targetIdx = -1;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        // Tile BELOW empty moves UP into empty space
        if (emptyRow < size - 1) targetIdx = emptyIdx + size;
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        // Tile ABOVE empty moves DOWN into empty space
        if (emptyRow > 0) targetIdx = emptyIdx - size;
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        // Tile to the RIGHT of empty moves LEFT into empty space
        if (emptyCol < size - 1) targetIdx = emptyIdx + 1;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        // Tile to the LEFT of empty moves RIGHT into empty space
        if (emptyCol > 0) targetIdx = emptyIdx - 1;
      }

      if (targetIdx !== -1 && !lockedTileIndices.includes(targetIdx)) {
        e.preventDefault();
        onMoveTile(targetIdx);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tiles, size, disabled, lockedTileIndices, onMoveTile]);

  // Touch Swipe Handling
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

    if (Math.hypot(dx, dy) < 30) return; // ignore tiny taps

    const emptyIdx = tiles.indexOf(0);
    if (emptyIdx === -1) return;
    const emptyRow = Math.floor(emptyIdx / size);
    const emptyCol = emptyIdx % size;

    let targetIdx = -1;
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe
      if (dx > 0) {
        // Swiped right -> tile left moves right
        if (emptyCol > 0) targetIdx = emptyIdx - 1;
      } else {
        // Swiped left -> tile right moves left
        if (emptyCol < size - 1) targetIdx = emptyIdx + 1;
      }
    } else {
      // Vertical swipe
      if (dy > 0) {
        // Swiped down -> tile above moves down
        if (emptyRow > 0) targetIdx = emptyIdx - size;
      } else {
        // Swiped up -> tile below moves up
        if (emptyRow < size - 1) targetIdx = emptyIdx + size;
      }
    }

    if (targetIdx !== -1 && !lockedTileIndices.includes(targetIdx)) {
      onMoveTile(targetIdx);
    }
  };

  const emptyIdx = tiles.indexOf(0);
  const validMoves = getValidSlideMoves(size, emptyIdx);

  return (
    <div className="flex flex-col items-center justify-center py-4 w-full">
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative p-3 rounded-3xl bg-slate-900/90 border-2 border-slate-700/80 shadow-2xl shadow-black/60 max-w-[340px] sm:max-w-[400px] w-full aspect-square flex flex-col justify-between select-none"
        style={{
          touchAction: 'none',
        }}
      >
        <div
          className="grid gap-2 w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
          }}
        >
          {tiles.map((val, idx) => {
            const isEmpty = val === 0;
            const isLocked = lockedTileIndices.includes(idx);
            const isValidMove = !isEmpty && !isLocked && validMoves.includes(idx);
            const isHint = hintHighlightIdx === idx;

            if (isEmpty) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="rounded-2xl bg-slate-950/60 border border-slate-800/40 flex items-center justify-center transition-all duration-150"
                />
              );
            }

            return (
              <button
                key={`tile-${val}`}
                type="button"
                disabled={disabled || !isValidMove}
                onClick={() => onMoveTile(idx)}
                className={`relative rounded-2xl flex flex-col items-center justify-center font-black transition-all duration-150 cursor-pointer text-2xl sm:text-3xl border shadow-md active:scale-95 ${
                  isLocked
                    ? 'bg-slate-800 border-red-500/50 text-slate-400 cursor-not-allowed'
                    : isHint
                    ? 'bg-amber-500 text-slate-950 border-amber-300 ring-4 ring-amber-400/50 scale-105 animate-pulse'
                    : isValidMove
                    ? 'bg-gradient-to-b from-indigo-500 to-indigo-700 border-indigo-400/50 text-white hover:brightness-110 shadow-indigo-900/40 hover:scale-[1.02]'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 opacity-90'
                }`}
                style={{
                  textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                }}
              >
                <span>{val}</span>
                {isLocked && (
                  <div className="absolute top-1 right-1 text-red-400">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-400 text-center font-medium">
        Use <span className="text-slate-200 font-bold">Arrow Keys / WASD</span> or tap an adjacent tile to slide
      </p>
    </div>
  );
};
