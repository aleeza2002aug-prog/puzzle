import React, { useState, useRef } from 'react';
import { PathConnectState, isAdjacent, isSameCell } from '../../game/logic/pathConnect';

interface Props {
  state: PathConnectState;
  onUpdatePaths: (paths: Record<string, { r: number; c: number }[]>) => void;
  disabled?: boolean;
}

export const PathConnectBoard: React.FC<Props> = ({ state, onUpdatePaths, disabled }) => {
  const [activePairId, setActivePairId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getCellFromCoordinates = (clientX: number, clientY: number) => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (x < 0 || x > rect.width || y < 0 || y > rect.height) return null;

    const cellWidth = rect.width / state.cols;
    const cellHeight = rect.height / state.rows;

    const c = Math.floor(x / cellWidth);
    const r = Math.floor(y / cellHeight);

    if (r >= 0 && r < state.rows && c >= 0 && c < state.cols) {
      return { r, c };
    }
    return null;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    const cell = getCellFromCoordinates(e.clientX, e.clientY);
    if (!cell) return;

    // Check if clicked cell is a node terminal or an existing path
    const pair = state.pairs.find(
      (p) => isSameCell(p.start, cell) || isSameCell(p.end, cell)
    );

    if (pair) {
      setActivePairId(pair.id);
      // Start fresh path from this terminal
      const initialPath = [cell];
      onUpdatePaths({
        ...state.paths,
        [pair.id]: initialPath,
      });
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (disabled || !activePairId) return;
    const cell = getCellFromCoordinates(e.clientX, e.clientY);
    if (!cell) return;

    const currentPath = state.paths[activePairId] || [];
    if (currentPath.length === 0) return;

    const lastCell = currentPath[currentPath.length - 1];
    if (isSameCell(lastCell, cell)) return; // already here

    // Must be adjacent
    if (!isAdjacent(lastCell, cell)) return;

    // Cannot hit barrier
    const isBarrierCell = state.barriers.some((b) => isSameCell(b, cell));
    if (isBarrierCell) return;

    // If retracing back to second-to-last cell, allow undo
    if (currentPath.length > 1 && isSameCell(currentPath[currentPath.length - 2], cell)) {
      onUpdatePaths({
        ...state.paths,
        [activePairId]: currentPath.slice(0, -1),
      });
      return;
    }

    // Check if occupied by another line
    for (const [otherId, otherPath] of Object.entries(state.paths)) {
      if (otherId !== activePairId) {
        if (otherPath.some((c) => isSameCell(c, cell))) {
          return; // occupied!
        }
      }
    }

    // Add cell to path if not already in our own path
    if (!currentPath.some((c) => isSameCell(c, cell))) {
      onUpdatePaths({
        ...state.paths,
        [activePairId]: [...currentPath, cell],
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setActivePairId(null);
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  return (
    <div className="flex flex-col items-center justify-center py-4 w-full">
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative p-2 rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-2xl max-w-[340px] sm:max-w-[380px] w-full aspect-square select-none cursor-crosshair"
        style={{ touchAction: 'none' }}
      >
        <div
          className="grid gap-1.5 w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${state.cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${state.rows}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: state.rows * state.cols }).map((_, idx) => {
            const r = Math.floor(idx / state.cols);
            const c = idx % state.cols;

            // Check if barrier
            const isBarrier = state.barriers.some((b) => b.r === r && b.c === c);
            // Check if switch
            const switchObj = state.switches?.find((s) => s.r === r && s.c === c);
            // Check if terminal
            const startNode = state.pairs.find((p) => isSameCell(p.start, { r, c }));
            const endNode = state.pairs.find((p) => isSameCell(p.end, { r, c }));
            const node = startNode || endNode;

            // Check if traversed by any path
            let pathColor: string | null = null;
            for (const pair of state.pairs) {
              const path = state.paths[pair.id] || [];
              if (path.some((cell) => isSameCell(cell, { r, c }))) {
                pathColor = pair.color;
                break;
              }
            }

            return (
              <div
                key={idx}
                className={`relative rounded-xl flex items-center justify-center font-bold transition-colors ${
                  isBarrier
                    ? 'bg-stone-900 border border-stone-800'
                    : pathColor
                    ? 'border'
                    : 'bg-slate-950/70 border border-slate-800/60'
                }`}
                style={{
                  backgroundColor: pathColor ? `${pathColor}22` : undefined,
                  borderColor: pathColor || undefined,
                }}
              >
                {/* Barrier render */}
                {isBarrier && (
                  <div className="w-full h-full flex items-center justify-center text-stone-600">
                    ✕
                  </div>
                )}

                {/* Switch render */}
                {switchObj && !isBarrier && !node && (
                  <div className="w-7 h-7 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-xs text-amber-300">
                    {switchObj.label}
                  </div>
                )}

                {/* Path Trail Dot */}
                {pathColor && !node && !isBarrier && !switchObj && (
                  <div
                    className="w-4 h-4 rounded-full shadow-lg"
                    style={{ backgroundColor: pathColor }}
                  />
                )}

                {/* Terminal Node */}
                {node && (
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm sm:text-base shadow-md ring-2 ring-white/20"
                    style={{ backgroundColor: node.color }}
                  >
                    {node.symbol}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-400 text-center">
        Drag between matching letters without crossing lines
      </p>
    </div>
  );
};
