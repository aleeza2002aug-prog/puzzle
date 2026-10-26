import React, { useEffect } from 'react';
import { AlertCircle, RotateCcw, Lightbulb, Home } from 'lucide-react';
import { sound } from '../../utils/sound';

interface Props {
  reason: 'moves' | 'time' | 'invalid';
  onRetry: () => void;
  onUseHint: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<Props> = ({ reason, onRetry, onUseHint, onHome }) => {
  useEffect(() => {
    sound.playInvalid();
  }, []);

  const titles = {
    moves: 'Out of Moves!',
    time: 'Time Expired!',
    invalid: 'Level Failed!',
  };

  const descriptions = {
    moves: 'You ran out of permitted moves for this level. Plan ahead and try again!',
    time: 'The clock ran down to zero. Take a deep breath and give it another shot.',
    invalid: 'The challenge conditions were not met. Check the rules and try again!',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-rose-500/40 shadow-2xl p-6 flex flex-col items-center text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border-2 border-rose-500/40 flex items-center justify-center text-rose-400 mb-3">
          <AlertCircle className="w-9 h-9" />
        </div>

        <h2 className="text-2xl font-black text-white mt-1 mb-2">{titles[reason]}</h2>
        <p className="text-xs text-slate-400 mb-6 px-2">{descriptions[reason]}</p>

        <div className="flex flex-col gap-2.5 w-full">
          <button
            type="button"
            onClick={onRetry}
            className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer transition-all active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <button
            type="button"
            onClick={onUseHint}
            className="w-full py-3 px-4 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Lightbulb className="w-4 h-4 fill-amber-400/40" />
            <span>Get a Helpful Hint</span>
          </button>

          <button
            type="button"
            onClick={onHome}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
