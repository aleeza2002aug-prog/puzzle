import React from 'react';
import { LevelDefinition } from '../../types/game';
import { Pause, Clock, Move, Star, ShieldAlert } from 'lucide-react';

interface Props {
  level: LevelDefinition;
  moves: number;
  timeSeconds: number;
  starsEarned: number;
  onPause: () => void;
  onShowRuleDetails: () => void;
}

export const GameHeader: React.FC<Props> = ({
  level,
  moves,
  timeSeconds,
  starsEarned,
  onPause,
  onShowRuleDetails,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const remainingTime =
    level.timeLimitSeconds !== undefined
      ? Math.max(0, level.timeLimitSeconds - timeSeconds)
      : null;

  return (
    <header className="w-full max-w-2xl mx-auto px-4 pt-3 pb-2 flex flex-col gap-2 select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPause}
            className="w-10 h-10 rounded-2xl bg-slate-800/90 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 flex items-center justify-center text-slate-200 transition-all cursor-pointer shadow-sm"
            aria-label="Pause Game"
          >
            <Pause className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs uppercase tracking-wider font-extrabold text-indigo-400">
                {level.tier.toUpperCase()} · LVL {level.id}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-black text-slate-100 tracking-tight leading-none">
              {level.title}
            </h1>
          </div>
        </div>

        {/* Stars Progress */}
        <div className="flex items-center gap-1 bg-slate-900/80 px-3 py-1.5 rounded-2xl border border-slate-800">
          {[1, 2, 3].map((starIdx) => (
            <Star
              key={starIdx}
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-all ${
                starIdx <= starsEarned
                  ? 'fill-amber-400 text-amber-400 filter drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]'
                  : 'text-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Objective & Rule Pill */}
      <div className="flex items-center justify-between gap-2 bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800/80">
        <div className="text-xs text-slate-300 font-medium truncate flex-1">
          {level.objective}
        </div>
        <button
          type="button"
          onClick={onShowRuleDetails}
          className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-bold hover:bg-amber-500/25 transition-colors cursor-pointer"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{level.ruleName}</span>
        </button>
      </div>

      {/* Metrics Row (Moves & Timer) */}
      <div className="flex items-center justify-between px-1 text-xs font-semibold text-slate-400">
        <div className="flex items-center gap-1.5">
          <Move className="w-3.5 h-3.5 text-indigo-400" />
          <span>Moves:</span>
          <span className="text-slate-100 font-mono font-bold text-sm">
            {moves}
            {level.maxMoves !== undefined && (
              <span className="text-slate-500 font-normal"> / {level.maxMoves}</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>{remainingTime !== null ? 'Time Left:' : 'Time:'}</span>
          <span
            className={`font-mono font-bold text-sm ${
              remainingTime !== null && remainingTime <= 10
                ? 'text-rose-400 animate-pulse'
                : 'text-slate-100'
            }`}
          >
            {remainingTime !== null ? formatTime(remainingTime) : formatTime(timeSeconds)}
          </span>
        </div>
      </div>
    </header>
  );
};
