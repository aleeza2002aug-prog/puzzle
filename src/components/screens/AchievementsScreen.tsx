import React from 'react';
import { GameState } from '../../types/game';
import { ArrowLeft, Award, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { sound } from '../../utils/sound';

interface Props {
  gameState: GameState;
  onBack: () => void;
}

export const AchievementsScreen: React.FC<Props> = ({ gameState, onBack }) => {
  const achievementsList = Object.values(gameState.achievements);
  const unlockedCount = achievementsList.filter((a) => a.unlocked).length;

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

        <h1 className="text-lg font-black text-white">Achievements</h1>

        <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-2xl border border-slate-800 text-amber-400 font-black text-xs">
          <Award className="w-4 h-4" />
          <span>
            {unlockedCount} / {achievementsList.length}
          </span>
        </div>
      </header>

      <div className="space-y-3 pb-8">
        {achievementsList.map((ach) => {
          const progressPercent = Math.min(100, Math.round((ach.progress / ach.target) * 100));

          return (
            <div
              key={ach.id}
              className={`p-4 rounded-3xl border-2 flex items-center gap-4 transition-all ${
                ach.unlocked
                  ? 'bg-slate-900/90 border-amber-500/40 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-950/60 border-slate-850 opacity-75'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                  ach.unlocked
                    ? 'bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 border-amber-300 shadow-md'
                    : 'bg-slate-800 text-slate-600 border-slate-700'
                }`}
              >
                {ach.unlocked ? <Sparkles className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-black text-slate-100">{ach.title}</h2>
                  {ach.unlocked && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Unlocked</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{ach.description}</p>

                {/* Progress Bar */}
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">
                    {ach.progress} / {ach.target}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
