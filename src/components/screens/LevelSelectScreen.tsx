import React, { useState } from 'react';
import { GameState, LevelDefinition, DifficultyTier } from '../../types/game';
import { ArrowLeft, Lock, Star, Crown } from 'lucide-react';
import { sound } from '../../utils/sound';

interface Props {
  levels: LevelDefinition[];
  gameState: GameState;
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
}

export const LevelSelectScreen: React.FC<Props> = ({
  levels,
  gameState,
  onSelectLevel,
  onBack,
}) => {
  const [selectedTier, setSelectedTier] = useState<DifficultyTier>('beginner');

  const tiersRecord: Record<DifficultyTier, { id: DifficultyTier; label: string; range: string; minLevel: number }> = {
    beginner: { id: 'beginner', label: 'Beginner', range: 'Lv 1-25', minLevel: 1 },
    intermediate: { id: 'intermediate', label: 'Intermediate', range: 'Lv 26-50', minLevel: 26 },
    advanced: { id: 'advanced', label: 'Advanced', range: 'Lv 51-75', minLevel: 51 },
    expert: { id: 'expert', label: 'Expert', range: 'Lv 76-100', minLevel: 76 },
  };
  const currentTierInfo = tiersRecord[selectedTier];

  const currentTierLevels = levels.filter((l) => l.tier === selectedTier);

  // Total stars in current tier
  const tierStars = currentTierLevels.reduce((acc, lvl) => {
    return acc + (gameState.completedLevels[lvl.id]?.stars || 0);
  }, 0);

  return (
    <div className="min-h-screen w-full flex flex-col p-4 sm:p-6 max-w-4xl mx-auto select-none">
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
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

        <h1 className="text-lg font-black text-white">Level Selection</h1>

        <div className="flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-2xl border border-slate-800 text-amber-400 font-black text-xs">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{tierStars} / 75</span>
        </div>
      </header>

      {/* Tier Switcher Tabs */}
      <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-900 rounded-2xl border border-slate-800 mb-6">
        {(['beginner', 'intermediate', 'advanced', 'expert'] as DifficultyTier[]).map((t) => {
          const isActive = selectedTier === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => {
                sound.playTileClick();
                setSelectedTier(t);
              }}
              className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.slice(0, 3)}
            </button>
          );
        })}
      </div>

      {/* Level Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-5 gap-2.5 sm:gap-3 flex-1 pb-8">
        {currentTierLevels.map((lvl) => {
          const isUnlocked = gameState.unlockedLevels.includes(lvl.id);
          const completedData = gameState.completedLevels[lvl.id];
          const isBoss = lvl.rule === 'boss-puzzle';

          return (
            <button
              key={lvl.id}
              type="button"
              disabled={!isUnlocked}
              onClick={() => {
                if (isUnlocked) {
                  sound.playTileClick();
                  onSelectLevel(lvl.id);
                }
              }}
              className={`relative aspect-square rounded-2xl border-2 flex flex-col items-center justify-between p-2 transition-all cursor-pointer ${
                !isUnlocked
                  ? 'bg-slate-950/40 border-slate-900 text-slate-700 cursor-not-allowed'
                  : completedData
                  ? 'bg-slate-900/90 border-indigo-500/50 text-white hover:border-indigo-400 shadow-sm'
                  : 'bg-indigo-950/80 border-indigo-500 text-indigo-100 shadow-md ring-2 ring-indigo-500/30 animate-pulse'
              }`}
            >
              {/* Level Number or Lock */}
              <div className="w-full flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-400">
                  {lvl.id}
                </span>
                {isBoss && (
                  <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/40" />
                )}
                {!isUnlocked && <Lock className="w-3 h-3 text-slate-600" />}
              </div>

              {/* Mode Icon or Symbol */}
              <div className="text-xs font-black truncate max-w-full text-slate-200">
                {isUnlocked ? lvl.title.split(' ')[0] : ''}
              </div>

              {/* Stars Earned */}
              <div className="flex gap-0.5">
                {[1, 2, 3].map((starIdx) => (
                  <Star
                    key={starIdx}
                    className={`w-2.5 h-2.5 ${
                      completedData && starIdx <= completedData.stars
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-800'
                    }`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
