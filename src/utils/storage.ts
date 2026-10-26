import { GameState, Achievement, ThemeId } from '../types/game';

const STORAGE_KEY = 'puzzle_world_save_v1';

export const INITIAL_ACHIEVEMENTS: Record<string, Achievement> = {
  first_step: {
    id: 'first_step',
    title: 'First Step',
    description: 'Solve your very first puzzle.',
    icon: 'Sparkles',
    target: 1,
    progress: 0,
    unlocked: false,
  },
  ten_levels: {
    id: 'ten_levels',
    title: 'Tenfold Thinker',
    description: 'Complete 10 puzzle levels.',
    icon: 'Award',
    target: 10,
    progress: 0,
    unlocked: false,
  },
  fifty_levels: {
    id: 'fifty_levels',
    title: 'Puzzle Connoisseur',
    description: 'Complete 50 puzzle levels.',
    icon: 'Trophy',
    target: 50,
    progress: 0,
    unlocked: false,
  },
  perfect_star: {
    id: 'perfect_star',
    title: 'Star Collector',
    description: 'Earn 3 stars on any 5 levels.',
    icon: 'Star',
    target: 5,
    progress: 0,
    unlocked: false,
  },
  no_hint_master: {
    id: 'no_hint_master',
    title: 'Sharp Mind',
    description: 'Solve 3 levels consecutively without using hints.',
    icon: 'Zap',
    target: 3,
    progress: 0,
    unlocked: false,
  },
  speed_solver: {
    id: 'speed_solver',
    title: 'Fast Thinker',
    description: 'Solve any puzzle in under 15 seconds.',
    icon: 'Clock',
    target: 1,
    progress: 0,
    unlocked: false,
  },
  daily_streak: {
    id: 'daily_streak',
    title: 'Daily Devotee',
    description: 'Complete a Daily Challenge.',
    icon: 'Calendar',
    target: 1,
    progress: 0,
    unlocked: false,
  },
  boss_slayer: {
    id: 'boss_slayer',
    title: 'Trial of the Boss',
    description: 'Conquer a Tier Boss Puzzle.',
    icon: 'Crown',
    target: 1,
    progress: 0,
    unlocked: false,
  },
};

export const INITIAL_GAME_STATE: GameState = {
  unlockedLevels: [1],
  completedLevels: {},
  currentLevelId: 1,
  coins: 100,
  hintTokens: 5,
  stats: {
    totalPlayed: 0,
    totalSolved: 0,
    totalMoves: 0,
    totalHintsUsed: 0,
    winStreak: 0,
    bestStreak: 0,
    dailyStreak: 0,
    fastestSolveSeconds: 9999,
  },
  settings: {
    sfxVolume: 0.8,
    musicVolume: 0.5,
    soundMuted: false,
    theme: 'midnight-dark',
    reducedMotion: false,
    colorBlindAssist: false,
  },
  achievements: INITIAL_ACHIEVEMENTS,
};

export function loadSavedGameState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_GAME_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_GAME_STATE,
      ...parsed,
      stats: { ...INITIAL_GAME_STATE.stats, ...(parsed.stats || {}) },
      settings: { ...INITIAL_GAME_STATE.settings, ...(parsed.settings || {}) },
      achievements: { ...INITIAL_ACHIEVEMENTS, ...(parsed.achievements || {}) },
    };
  } catch (e) {
    console.error('Failed to parse save data, using defaults:', e);
    return INITIAL_GAME_STATE;
  }
}

export function saveGameState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save game state:', e);
  }
}

export const THEMES: Record<
  ThemeId,
  {
    name: string;
    bgClass: string;
    panelClass: string;
    primaryBtn: string;
    accentText: string;
    borderClass: string;
  }
> = {
  'midnight-dark': {
    name: 'Midnight Dark',
    bgClass: 'bg-slate-950 text-slate-100',
    panelClass: 'bg-slate-900/90 border-slate-800',
    primaryBtn: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25',
    accentText: 'text-indigo-400',
    borderClass: 'border-slate-800',
  },
  'ocean-blue': {
    name: 'Ocean Blue',
    bgClass: 'bg-sky-950 text-sky-50',
    panelClass: 'bg-sky-900/90 border-sky-800',
    primaryBtn: 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-cyan-500/25',
    accentText: 'text-cyan-400',
    borderClass: 'border-sky-800',
  },
  'purple-galaxy': {
    name: 'Purple Galaxy',
    bgClass: 'bg-[#0f0728] text-purple-100',
    panelClass: 'bg-purple-950/80 border-purple-800/60',
    primaryBtn: 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-fuchsia-500/25',
    accentText: 'text-fuchsia-400',
    borderClass: 'border-purple-800/60',
  },
  'forest-green': {
    name: 'Forest Green',
    bgClass: 'bg-emerald-950 text-emerald-100',
    panelClass: 'bg-emerald-900/80 border-emerald-800',
    primaryBtn: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/25',
    accentText: 'text-emerald-400',
    borderClass: 'border-emerald-800',
  },
  'classic-light': {
    name: 'Classic Light',
    bgClass: 'bg-slate-100 text-slate-900',
    panelClass: 'bg-white border-slate-200 shadow-sm',
    primaryBtn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25',
    accentText: 'text-blue-600',
    borderClass: 'border-slate-200',
  },
  'high-contrast': {
    name: 'High Contrast',
    bgClass: 'bg-black text-white',
    panelClass: 'bg-neutral-900 border-2 border-yellow-400',
    primaryBtn: 'bg-yellow-400 hover:bg-yellow-300 text-black font-bold shadow-none',
    accentText: 'text-yellow-400',
    borderClass: 'border-yellow-400',
  },
};
