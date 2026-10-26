import React from 'react';
import { GameState } from '../../types/game';
import {
  Play,
  Calendar,
  Grid,
  Layers,
  Award,
  BarChart2,
  Settings,
  HelpCircle,
  Star,
  Sparkles,
  Lightbulb,
  Zap,
} from 'lucide-react';
import { sound } from '../../utils/sound';

interface Props {
  gameState: GameState;
  onPlay: (levelId?: number) => void;
  onOpenDaily: () => void;
  onOpenModes: () => void;
  onOpenLevelSelect: () => void;
  onOpenAchievements: () => void;
  onOpenStatistics: () => void;
  onOpenSettings: () => void;
  onOpenHowToPlay: () => void;
}

export const HomeScreen: React.FC<Props> = ({
  gameState,
  onPlay,
  onOpenDaily,
  onOpenModes,
  onOpenLevelSelect,
  onOpenAchievements,
  onOpenStatistics,
  onOpenSettings,
  onOpenHowToPlay,
}) => {
  const totalStars = Object.values(gameState.completedLevels).reduce(
    (acc, lvl) => acc + lvl.stars,
    0
  );
  const nextLevelId = gameState.currentLevelId || 1;
  const isDailyCompletedToday =
    gameState.stats.lastDailyDate === new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-6 max-w-4xl mx-auto select-none">
      {/* Top Currency & Stats Bar */}
      <header className="w-full flex items-center justify-between bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-3xl border border-slate-800 shadow-lg">
        <div className="flex items-center gap-1.5 font-black text-amber-400 text-sm">
          <Star className="w-4 h-4 fill-amber-400" />
          <span>{totalStars}</span>
          <span className="text-[10px] text-slate-500 font-normal">/ 300</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{gameState.coins}</span>
          </div>

          <div className="flex items-center gap-1.5 font-bold text-indigo-300 text-xs sm:text-sm">
            <Lightbulb className="w-4 h-4 text-indigo-400 fill-indigo-400/40" />
            <span>{gameState.hintTokens}</span>
          </div>
        </div>
      </header>

      {/* Hero Title Lockup */}
      <main className="my-auto py-6 flex flex-col items-center text-center">
        {/* Custom SVG World Emblem */}
        <div className="relative mb-4 group cursor-pointer" onClick={() => sound.playTileClick()}>
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-1 shadow-2xl shadow-indigo-500/30 flex items-center justify-center transform group-hover:scale-105 transition-all">
            <div className="w-full h-full rounded-[22px] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center relative overflow-hidden">
              <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="38" stroke="url(#logo_grad)" strokeWidth="8" strokeDasharray="6 4" />
                <rect x="35" y="35" width="30" height="30" rx="8" fill="url(#core_grad)" />
                <path d="M50 20 L50 80 M20 50 L80 50" stroke="#38bdf8" strokeWidth="3" opacity="0.6" />
                <defs>
                  <linearGradient id="logo_grad" x1="0" y1="0" x2="100" y2="100">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                  <linearGradient id="core_grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-1.5 rounded-xl font-black text-xs shadow-md flex items-center gap-0.5">
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 tracking-tight mb-2">
          PUZZLE WORLD
        </h1>
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-indigo-400 mb-6">
          BRAIN CHALLENGE · 8 MODES · 100+ LEVELS
        </p>

        {/* Primary Play Button */}
        <div className="w-full max-w-xs flex flex-col gap-3">
          <button
            type="button"
            data-start="true"
            onClick={() => {
              sound.playTileClick();
              onPlay(nextLevelId);
            }}
            className="w-full py-4 px-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:from-indigo-700 active:to-purple-700 text-white font-black text-lg sm:text-xl flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/40 cursor-pointer transition-all active:scale-98 transform hover:scale-[1.02]"
          >
            <Play className="w-6 h-6 fill-white" />
            <span>PLAY GAME</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 font-bold">
              LVL {nextLevelId}
            </span>
          </button>

          {/* Daily Challenge Special Banner */}
          <button
            type="button"
            onClick={() => {
              sound.playTileClick();
              onOpenDaily();
            }}
            className={`w-full py-3 px-4 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer shadow-md ${
              isDailyCompletedToday
                ? 'bg-slate-900/80 border-emerald-500/40 text-emerald-300'
                : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border-amber-500/40 text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-amber-400" />
              <div className="text-left">
                <div className="text-xs font-black uppercase tracking-wider">Daily Challenge</div>
                <div className="text-[10px] text-slate-400">
                  {isDailyCompletedToday ? 'Completed today! Streak active' : 'Solve today’s unique puzzle'}
                </div>
              </div>
            </div>
            <div className="text-xs font-extrabold px-2.5 py-1 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40">
              {isDailyCompletedToday ? '✓ Done' : '+50 Coins'}
            </div>
          </button>
        </div>
      </main>

      {/* Menu Cards Navigation Grid */}
      <footer className="w-full max-w-xl">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playTileClick();
              onOpenLevelSelect();
            }}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Layers className="w-5 h-5 mb-1 text-indigo-400" />
            <span className="text-[11px] font-bold">Levels</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTileClick();
              onOpenModes();
            }}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Grid className="w-5 h-5 mb-1 text-sky-400" />
            <span className="text-[11px] font-bold">Modes</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTileClick();
              onOpenAchievements();
            }}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Award className="w-5 h-5 mb-1 text-amber-400" />
            <span className="text-[11px] font-bold">Badges</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTileClick();
              onOpenStatistics();
            }}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <BarChart2 className="w-5 h-5 mb-1 text-emerald-400" />
            <span className="text-[11px] font-bold">Stats</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTileClick();
              onOpenSettings();
            }}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Settings className="w-5 h-5 mb-1 text-purple-400" />
            <span className="text-[11px] font-bold">Settings</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTileClick();
              onOpenHowToPlay();
            }}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <HelpCircle className="w-5 h-5 mb-1 text-rose-400" />
            <span className="text-[11px] font-bold">Rules</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
