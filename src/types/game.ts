export type PuzzleMode =
  | 'number-logic'
  | 'sliding-tile'
  | 'match-merge'
  | 'picture-jigsaw'
  | 'path-connect'
  | 'color-pattern'
  | 'physics-object'
  | 'memory-puzzle';

export type DifficultyTier = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type SpecialRuleId =
  | 'standard'
  | 'limited-moves'
  | 'time-challenge'
  | 'locked-tiles'
  | 'hidden-pattern'
  | 'rotating-board'
  | 'color-restriction'
  | 'gravity-mode'
  | 'switch-mechanism'
  | 'teleport-cells'
  | 'frozen-objects'
  | 'sequence-lock'
  | 'no-repeat'
  | 'mirror-mode'
  | 'dark-cells'
  | 'target-collection'
  | 'chain-reaction'
  | 'energy-limit'
  | 'boss-puzzle';

export interface LevelDefinition {
  id: number;
  mode: PuzzleMode;
  tier: DifficultyTier;
  title: string;
  subtitle: string;
  objective: string;
  rule: SpecialRuleId;
  ruleName: string;
  ruleDescription: string;
  maxMoves?: number;
  timeLimitSeconds?: number;
  starMovesTarget: number; // For 3-stars
  starTimeTarget?: number; // For 3-stars
  initialState: any;
  meta?: Record<string, any>;
}

export interface PlayerStats {
  totalPlayed: number;
  totalSolved: number;
  totalMoves: number;
  totalHintsUsed: number;
  winStreak: number;
  bestStreak: number;
  lastDailyDate?: string;
  dailyStreak: number;
  fastestSolveSeconds: number;
}

export interface CompletedLevelData {
  stars: number;
  bestScore: number;
  bestMoves: number;
  bestTime: number;
  completedAt: string;
}

export type ThemeId =
  | 'midnight-dark'
  | 'ocean-blue'
  | 'purple-galaxy'
  | 'forest-green'
  | 'classic-light'
  | 'high-contrast';

export interface PlayerSettings {
  sfxVolume: number; // 0 to 1
  musicVolume: number; // 0 to 1
  soundMuted: boolean;
  theme: ThemeId;
  reducedMotion: boolean;
  colorBlindAssist: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  progress: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface GameState {
  unlockedLevels: number[];
  completedLevels: Record<number, CompletedLevelData>;
  currentLevelId: number;
  coins: number;
  hintTokens: number;
  stats: PlayerStats;
  settings: PlayerSettings;
  achievements: Record<string, Achievement>;
}
