import React, { useEffect, useRef } from 'react';
import { PhysicsObjectState, simulatePhysicsStep } from '../../game/logic/physicsObject';
import { RotateCcw, Play } from 'lucide-react';

interface Props {
  state: PhysicsObjectState;
  onUpdateState: (newState: PhysicsObjectState) => void;
  disabled?: boolean;
}

export const PhysicsObjectBoard: React.FC<Props> = ({ state, onUpdateState, disabled }) => {
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!state.isSimulating || state.won || state.failed) return;

    let currentState = state;
    const tick = () => {
      currentState = simulatePhysicsStep(currentState);
      onUpdateState(currentState);

      if (currentState.isSimulating && !currentState.won && !currentState.failed) {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [state.isSimulating, state.won, state.failed]);

  const handleBlockClick = (blockId: string) => {
    if (disabled || state.won) return;
    const block = state.blocks.find((b) => b.id === blockId);
    if (!block || block.type !== 'wood') return; // only wood blocks can be removed

    const updatedBlocks = state.blocks.map((b) =>
      b.id === blockId ? { ...b, active: !b.active } : b
    );

    // Auto-start simulation if not already
    onUpdateState({
      ...state,
      blocks: updatedBlocks,
      isSimulating: true,
    });
  };

  const handleResetBall = () => {
    if (disabled) return;
    onUpdateState({
      ...state,
      ball: { x: state.initialBall.x, y: state.initialBall.y, vx: 0, vy: 0, settled: false },
      isSimulating: false,
      failed: false,
      won: false,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center py-2 w-full max-w-sm mx-auto">
      <div className="relative rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-2xl overflow-hidden w-[320px] h-[380px] select-none">
        {/* Goal Basket */}
        <div
          className="absolute rounded-xl bg-emerald-950/80 border-2 border-emerald-400 flex items-center justify-center text-xs font-black text-emerald-300 shadow-lg shadow-emerald-500/20"
          style={{
            left: state.goal.x,
            top: state.goal.y,
            width: state.goal.w,
            height: state.goal.h,
          }}
        >
          <span>🎯 GOAL</span>
        </div>

        {/* Blocks */}
        {state.blocks.map((block) => {
          if (!block.active) return null;

          let style = 'bg-amber-900/90 border-amber-600 text-amber-200 cursor-pointer hover:scale-102';
          let label = 'WOOD';

          if (block.type === 'stone') {
            style = 'bg-stone-800 border-stone-600 text-stone-300 cursor-default';
            label = 'STONE';
          } else if (block.type === 'bouncy') {
            style = 'bg-emerald-600 border-emerald-300 text-emerald-950 font-black cursor-default';
            label = 'BOUNCE';
          } else if (block.type === 'portal-in') {
            style = 'bg-cyan-600 border-cyan-300 text-cyan-950 font-black cursor-default';
            label = 'PORTAL';
          } else if (block.type === 'portal-out') {
            style = 'bg-purple-600 border-purple-300 text-purple-950 font-black cursor-default';
            label = 'EXIT';
          }

          return (
            <button
              key={block.id}
              type="button"
              disabled={disabled || block.type !== 'wood'}
              onClick={() => handleBlockClick(block.id)}
              className={`absolute rounded-xl border-2 flex items-center justify-center text-[10px] font-black tracking-wider transition-transform ${style}`}
              style={{
                left: block.x,
                top: block.y,
                width: block.w,
                height: block.h,
              }}
            >
              {label}
            </button>
          );
        })}

        {/* Core Gem Ball */}
        <div
          className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-300 border-2 border-white shadow-lg shadow-cyan-400/50 flex items-center justify-center transition-opacity"
          style={{
            left: state.ball.x,
            top: state.ball.y,
          }}
        >
          <div className="w-2 h-2 rounded-full bg-white animate-ping" />
        </div>
      </div>

      {/* Physics Controls */}
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onUpdateState({ ...state, isSimulating: !state.isSimulating })}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer shadow-sm"
        >
          <Play className="w-3.5 h-3.5" />
          <span>{state.isSimulating ? 'Pause Motion' : 'Start Fall'}</span>
        </button>

        <button
          type="button"
          onClick={handleResetBall}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Gem</span>
        </button>
      </div>

      <p className="mt-2 text-xs text-slate-400 text-center">
        Click wooden beams to remove them and guide the gem into the target
      </p>
    </div>
  );
};
