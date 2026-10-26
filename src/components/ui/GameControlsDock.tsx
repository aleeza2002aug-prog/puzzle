import React from 'react';
import { Lightbulb, RotateCcw, RefreshCw, HelpCircle } from 'lucide-react';

interface Props {
  hintTokens: number;
  canUndo: boolean;
  onHint: () => void;
  onUndo: () => void;
  onRestart: () => void;
  onHelp: () => void;
  disabled?: boolean;
}

export const GameControlsDock: React.FC<Props> = ({
  hintTokens,
  canUndo,
  onHint,
  onUndo,
  onRestart,
  onHelp,
  disabled,
}) => {
  return (
    <footer className="w-full max-w-md mx-auto px-4 pb-4 pt-2 flex items-center justify-center gap-3 select-none">
      {/* Hint Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={onHint}
        className="relative flex-1 py-3 px-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 active:bg-amber-500/35 border-2 border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
      >
        <Lightbulb className="w-4 h-4 fill-amber-400/40" />
        <span>Hint</span>
        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
          {hintTokens}
        </span>
      </button>

      {/* Undo Button */}
      <button
        type="button"
        disabled={disabled || !canUndo}
        onClick={onUndo}
        className={`flex-1 py-3 px-3 rounded-2xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
          canUndo
            ? 'bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border-slate-700 text-slate-200 cursor-pointer active:scale-95'
            : 'bg-slate-900/50 border-slate-800/40 text-slate-600 cursor-not-allowed'
        }`}
      >
        <RotateCcw className="w-4 h-4" />
        <span>Undo</span>
      </button>

      {/* Restart Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={onRestart}
        className="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border-2 border-slate-700 text-slate-300 flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
        aria-label="Restart Level"
      >
        <RefreshCw className="w-4 h-4" />
      </button>

      {/* How to Play Shortcut */}
      <button
        type="button"
        onClick={onHelp}
        className="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border-2 border-slate-700 text-slate-300 flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
        aria-label="How to play instructions"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
    </footer>
  );
};
