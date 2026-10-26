import React from 'react';
import { GameState } from '../../types/game';
import { ArrowLeft, CheckCircle, Clock, Zap, Star, Flame, Target } from 'lucide-react';
import { sound } from '../../utils/sound';

interface Props {
  gameState: GameState;
  onBack: () => void;
}

export const StatisticsScreen: React.FC<Props> = ({ gameState, onBack }) => {
  const { stats, completedLevels } = gameState;
  const totalCompleted = Object.keys(completedLevels).length;
  const totalStars = Object.values(completedLevels).reduce((acc, lvl) => acc + lvl.stars, 0);

  const accuracy =
    stats.totalPlayed > 0
      ? Math.round((stats.totalSolved / stats.totalPlayed) * 100)
      : 0;

  const formatFastestTime = (secs: number) => {
    if (secs >= 9999) return 'N/A';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="min-h-screen w-full flex flex-col p-4 sm:p-6 max-w-2xl mx-auto select-none">
      <header className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => {
            sound.playTileClick();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <h1 className="text-lg font-black text-white">Player Statistics</h1>

        <div className="w-16" />
      </header>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Total Solved */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl flex flex-col items-center text-center shadow-md">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-2">
            <CheckCircle className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Puzzles Solved
          </span>
          <div className="text-2xl font-black text-white mt-1">{totalCompleted}</div>
        </div>

        {/* Stars Collected */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl flex flex-col items-center text-center shadow-md">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Stars
          </span>
          <div className="text-2xl font-black text-amber-400 mt-1">{totalStars}</div>
        </div>

        {/* Accuracy Rate */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl flex flex-col items-center text-center shadow-md">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
            <Target className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Win Accuracy
          </span>
          <div className="text-2xl font-black text-emerald-400 mt-1">{accuracy}%</div>
        </div>

        {/* Win Streak */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl flex flex-col items-center text-center shadow-md">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-2">
            <Flame className="w-5 h-5 fill-rose-400" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Best Win Streak
          </span>
          <div className="text-2xl font-black text-rose-400 mt-1">{stats.bestStreak}</div>
        </div>
      </div>

      {/* Detailed Metrics List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-3.5 shadow-md">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Fastest Solve Time</span>
          </span>
          <span className="font-mono font-bold text-white">
            {formatFastestTime(stats.fastestSolveSeconds)}
          </span>
        </div>

        <div className="h-[1px] bg-slate-800" />

        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span>Total Move Operations</span>
          </span>
          <span className="font-mono font-bold text-white">{stats.totalMoves}</span>
        </div>

        <div className="h-[1px] bg-slate-800" />

        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span className="flex items-center gap-2">
            <Star className="w-4 h-4 text-indigo-400" />
            <span>Daily Challenges Completed</span>
          </span>
          <span className="font-mono font-bold text-white">{stats.dailyStreak}</span>
        </div>
      </div>
    </div>
  );
};
