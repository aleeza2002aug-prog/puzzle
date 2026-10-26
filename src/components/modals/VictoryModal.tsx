import React, { useEffect } from 'react';
import { Star, Trophy, ArrowRight, RotateCcw, Home, Sparkles } from 'lucide-react';
import { sound } from '../../utils/sound';

interface Props {
  levelTitle: string;
  levelNumber: number;
  stars: number;
  moves: number;
  timeSeconds: number;
  coinsEarned: number;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onHome: () => void;
}

export const VictoryModal: React.FC<Props> = ({
  levelTitle,
  levelNumber,
  stars,
  moves,
  timeSeconds,
  coinsEarned,
  hasNextLevel,
  onNextLevel,
  onReplay,
  onHome,
}) => {
  useEffect(() => {
    sound.playVictory();
    // Play sequential stars
    for (let i = 0; i < stars; i++) {
      setTimeout(() => {
        sound.playStar(i);
      }, 400 + i * 250);
    }
  }, [stars]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-indigo-500/50 shadow-2xl p-6 flex flex-col items-center text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Glow backdrop */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Trophy icon */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30 mb-3">
          <Trophy className="w-9 h-9" />
        </div>

        <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
          Level {levelNumber} Completed!
        </span>
        <h2 className="text-2xl font-black text-white mt-1 mb-4">{levelTitle}</h2>

        {/* 3 Stars Display */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {[1, 2, 3].map((starIdx) => {
            const hasStar = starIdx <= stars;
            return (
              <div
                key={starIdx}
                className={`transition-all duration-300 transform ${
                  hasStar ? 'scale-110 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]' : 'scale-90 opacity-30'
                }`}
              >
                <Star
                  className={`w-10 h-10 ${
                    hasStar ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 w-full mb-6">
          <div className="bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400">Moves</span>
            <div className="text-lg font-black text-slate-100">{moves}</div>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400">Time</span>
            <div className="text-lg font-black text-slate-100">{formatTime(timeSeconds)}</div>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400">Coins</span>
            <div className="text-lg font-black text-amber-400 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>+{coinsEarned}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full">
          {hasNextLevel && (
            <button
              type="button"
              onClick={onNextLevel}
              className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer transition-all active:scale-98"
            >
              <span>Next Level</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <div className="flex gap-2 w-full">
            <button
              type="button"
              onClick={onReplay}
              className="flex-1 py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay</span>
            </button>
            <button
              type="button"
              onClick={onHome}
              className="flex-1 py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Menu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
