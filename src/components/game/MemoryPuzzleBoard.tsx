import React, { useState, useEffect } from 'react';
import { MemorySequenceState, MemoryCard } from '../../game/logic/memoryPuzzle';
import { sound } from '../../utils/sound';

interface Props {
  state: MemorySequenceState;
  onStepInput?: (stepIdx: number) => void;
  onCardFlip?: (cardId: number) => void;
  disabled?: boolean;
}

export const MemoryPuzzleBoard: React.FC<Props> = ({
  state,
  onStepInput,
  onCardFlip,
  disabled,
}) => {
  const [activePad, setActivePad] = useState<number | null>(null);

  // Auto-play sequence preview for Simon
  useEffect(() => {
    if (state.type !== 'sequence') return;

    let timeoutId: any;
    const playSeq = async () => {
      for (let i = 0; i < state.sequence.length; i++) {
        await new Promise((r) => setTimeout(r, 600));
        const padIdx = state.sequence[i];
        setActivePad(padIdx);
        sound.playTileClick();
        await new Promise((r) => setTimeout(r, 450));
        setActivePad(null);
      }
    };

    timeoutId = setTimeout(() => {
      playSeq();
    }, 400);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [state.sequence, state.round]);

  if (state.type === 'pairs') {
    return (
      <div className="flex flex-col items-center justify-center py-4 w-full max-w-sm mx-auto">
        <div className="grid grid-cols-3 gap-3 w-full">
          {state.cards?.map((card: MemoryCard) => (
            <button
              key={card.id}
              type="button"
              disabled={disabled || card.matched || card.flipped}
              onClick={() => onCardFlip?.(card.id)}
              className={`h-24 rounded-2xl border-2 flex flex-col items-center justify-center text-3xl font-bold transition-all cursor-pointer ${
                card.matched
                  ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300 shadow-sm opacity-80 cursor-default'
                  : card.flipped
                  ? 'bg-indigo-900 border-indigo-400 text-white shadow-lg shadow-indigo-500/30 scale-102'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-500 hover:border-slate-500 active:scale-95'
              }`}
            >
              {card.flipped || card.matched ? card.symbol : '❓'}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Simon 4-pad sequence
  const pads = [
    { id: 0, color: 'bg-emerald-500 border-emerald-400', activeGlow: 'bg-emerald-300 ring-4 ring-emerald-300' },
    { id: 1, color: 'bg-sky-500 border-sky-400', activeGlow: 'bg-sky-300 ring-4 ring-sky-300' },
    { id: 2, color: 'bg-amber-500 border-amber-400', activeGlow: 'bg-amber-300 ring-4 ring-amber-300' },
    { id: 3, color: 'bg-rose-500 border-rose-400', activeGlow: 'bg-rose-300 ring-4 ring-rose-300' },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-4 w-full max-w-xs mx-auto">
      {state.reverseRule && (
        <div className="mb-3 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
          ⚠️ Reverse Playback Rule
        </div>
      )}

      <div className="p-4 rounded-3xl bg-slate-900 border-2 border-slate-800 shadow-2xl w-64 h-64 grid grid-cols-2 gap-3">
        {pads.map((pad) => {
          const isGlowing = activePad === pad.id;

          return (
            <button
              key={pad.id}
              type="button"
              disabled={disabled}
              onClick={() => {
                sound.playTileClick();
                onStepInput?.(pad.id);
              }}
              className={`rounded-2xl border-2 transition-all cursor-pointer shadow-md active:scale-95 ${
                isGlowing ? `${pad.activeGlow} scale-105 shadow-xl` : `${pad.color} opacity-85 hover:opacity-100`
              }`}
            />
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
          Progress:
        </span>
        <div className="flex gap-1.5">
          {state.sequence.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < state.playerSequence.length ? 'bg-indigo-400 ring-2 ring-indigo-400/40' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
