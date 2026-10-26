import React, { useState, useEffect, useMemo } from 'react';
import { GameState, LevelDefinition, ThemeId } from './types/game';
import {
  loadSavedGameState,
  saveGameState,
  INITIAL_GAME_STATE,
  THEMES,
} from './utils/storage';
import { buildLevelCatalog, getDailyChallengeLevel } from './game/logic/levelCatalog';
import { sound } from './utils/sound';

// Screens
import { HomeScreen } from './components/screens/HomeScreen';
import { GameplayScreen } from './components/screens/GameplayScreen';
import { LevelSelectScreen } from './components/screens/LevelSelectScreen';
import { ModeSelectScreen } from './components/screens/ModeSelectScreen';
import { AchievementsScreen } from './components/screens/AchievementsScreen';
import { StatisticsScreen } from './components/screens/StatisticsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { HowToPlayScreen } from './components/screens/HowToPlayScreen';

type Screen =
  | 'home'
  | 'game'
  | 'level-select'
  | 'modes'
  | 'achievements'
  | 'stats'
  | 'settings'
  | 'how-to-play';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => loadSavedGameState());
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [activeLevelId, setActiveLevelId] = useState<number>(1);
  const [isDailyActive, setIsDailyActive] = useState<boolean>(false);

  // All 100 levels
  const levelCatalog = useMemo(() => buildLevelCatalog(), []);

  // Today's daily level
  const dailyLevel = useMemo(() => getDailyChallengeLevel(), []);

  // Check URL parameters for autostart
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setActiveLevelId(1);
      setActiveScreen('game');
      document.body.dataset.state = 'playing';
    }
  }, []);

  // Initialize sound settings
  useEffect(() => {
    sound.updateVolumes(
      gameState.settings.sfxVolume,
      gameState.settings.musicVolume,
      gameState.settings.soundMuted
    );
  }, [gameState.settings]);

  // Persist game state whenever updated
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  // Find current active level definition
  const currentLevel: LevelDefinition = useMemo(() => {
    if (isDailyActive) {
      return dailyLevel;
    }
    const found = levelCatalog.find((l) => l.id === activeLevelId);
    return found || levelCatalog[0];
  }, [isDailyActive, dailyLevel, levelCatalog, activeLevelId]);

  // Start game handler
  const handlePlayLevel = (levelId?: number) => {
    const targetId = levelId || gameState.currentLevelId || 1;
    setIsDailyActive(false);
    setActiveLevelId(targetId);
    setActiveScreen('game');
    document.body.dataset.state = 'playing';
    if (!gameState.settings.soundMuted) {
      sound.startAmbientMusic();
    }
  };

  const handlePlayDaily = () => {
    setIsDailyActive(true);
    setActiveScreen('game');
    document.body.dataset.state = 'playing';
    if (!gameState.settings.soundMuted) {
      sound.startAmbientMusic();
    }
  };

  // Level completion evaluator & achievement checker
  const handleLevelComplete = (
    levelId: number,
    stars: number,
    moves: number,
    timeSeconds: number,
    coinsEarned: number
  ) => {
    setGameState((prev) => {
      const nextUnlocked = [...prev.unlockedLevels];
      const nextLevelId = isDailyActive ? prev.currentLevelId : levelId + 1;

      if (!isDailyActive && nextLevelId <= 100 && !nextUnlocked.includes(nextLevelId)) {
        nextUnlocked.push(nextLevelId);
      }

      // Record best completed level stats
      const prevData = prev.completedLevels[levelId];
      const bestStars = prevData ? Math.max(prevData.stars, stars) : stars;
      const bestMoves = prevData ? Math.min(prevData.bestMoves, moves) : moves;
      const bestTime = prevData ? Math.min(prevData.bestTime, timeSeconds) : timeSeconds;

      const newCompleted = {
        ...prev.completedLevels,
        [levelId]: {
          stars: bestStars,
          bestScore: (prevData?.bestScore || 0) + 100 * stars,
          bestMoves,
          bestTime,
          completedAt: new Date().toISOString(),
        },
      };

      const newTotalSolved = Object.keys(newCompleted).length;
      const newWinStreak = prev.stats.winStreak + 1;
      const newBestStreak = Math.max(prev.stats.bestStreak, newWinStreak);
      const newFastestTime = Math.min(prev.stats.fastestSolveSeconds, timeSeconds);

      // Check daily streak
      const todayStr = new Date().toISOString().split('T')[0];
      const newDailyStreak = isDailyActive
        ? prev.stats.dailyStreak + 1
        : prev.stats.dailyStreak;

      // Update achievements
      const updatedAchievements = { ...prev.achievements };

      // 1. First Step
      if (updatedAchievements.first_step) {
        updatedAchievements.first_step = {
          ...updatedAchievements.first_step,
          progress: 1,
          unlocked: true,
        };
      }

      // 2. Tenfold Thinker
      if (updatedAchievements.ten_levels) {
        const prog = Math.min(10, newTotalSolved);
        updatedAchievements.ten_levels = {
          ...updatedAchievements.ten_levels,
          progress: prog,
          unlocked: prog >= 10,
        };
      }

      // 3. Fifty Levels
      if (updatedAchievements.fifty_levels) {
        const prog = Math.min(50, newTotalSolved);
        updatedAchievements.fifty_levels = {
          ...updatedAchievements.fifty_levels,
          progress: prog,
          unlocked: prog >= 50,
        };
      }

      // 4. Perfect Star (5 levels with 3 stars)
      if (updatedAchievements.perfect_star) {
        const threeStarCount = Object.values(newCompleted).filter((l) => l.stars >= 3).length;
        updatedAchievements.perfect_star = {
          ...updatedAchievements.perfect_star,
          progress: Math.min(5, threeStarCount),
          unlocked: threeStarCount >= 5,
        };
      }

      // 5. Fast Thinker (< 15 seconds)
      if (updatedAchievements.speed_solver && timeSeconds < 15) {
        updatedAchievements.speed_solver = {
          ...updatedAchievements.speed_solver,
          progress: 1,
          unlocked: true,
        };
      }

      // 6. Daily Devotee
      if (isDailyActive && updatedAchievements.daily_streak) {
        updatedAchievements.daily_streak = {
          ...updatedAchievements.daily_streak,
          progress: 1,
          unlocked: true,
        };
      }

      // 7. Boss Slayer
      if (currentLevel.rule === 'boss-puzzle' && updatedAchievements.boss_slayer) {
        updatedAchievements.boss_slayer = {
          ...updatedAchievements.boss_slayer,
          progress: 1,
          unlocked: true,
        };
      }

      return {
        ...prev,
        coins: prev.coins + coinsEarned,
        unlockedLevels: nextUnlocked,
        currentLevelId: isDailyActive ? prev.currentLevelId : nextLevelId,
        completedLevels: newCompleted,
        stats: {
          ...prev.stats,
          totalPlayed: prev.stats.totalPlayed + 1,
          totalSolved: newTotalSolved,
          totalMoves: prev.stats.totalMoves + moves,
          winStreak: newWinStreak,
          bestStreak: newBestStreak,
          dailyStreak: newDailyStreak,
          lastDailyDate: isDailyActive ? todayStr : prev.stats.lastDailyDate,
          fastestSolveSeconds: newFastestTime,
        },
        achievements: updatedAchievements,
      };
    });
  };

  const handleNextLevel = () => {
    if (activeLevelId < 100) {
      setActiveLevelId((prev) => prev + 1);
    } else {
      setActiveScreen('home');
      document.body.dataset.state = 'home';
    }
  };

  const handleExitToHome = () => {
    setActiveScreen('home');
    document.body.dataset.state = 'home';
  };

  // Current active theme styles
  const activeTheme = THEMES[gameState.settings.theme] || THEMES['midnight-dark'];

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-200 ${activeTheme.bgClass}`}
    >
      {activeScreen === 'home' && (
        <HomeScreen
          gameState={gameState}
          onPlay={handlePlayLevel}
          onOpenDaily={handlePlayDaily}
          onOpenModes={() => setActiveScreen('modes')}
          onOpenLevelSelect={() => setActiveScreen('level-select')}
          onOpenAchievements={() => setActiveScreen('achievements')}
          onOpenStatistics={() => setActiveScreen('stats')}
          onOpenSettings={() => setActiveScreen('settings')}
          onOpenHowToPlay={() => setActiveScreen('how-to-play')}
        />
      )}

      {activeScreen === 'game' && (
        <GameplayScreen
          key={currentLevel.id}
          level={currentLevel}
          gameState={gameState}
          onLevelComplete={handleLevelComplete}
          onNextLevel={handleNextLevel}
          onExit={handleExitToHome}
          onOpenSettings={() => setActiveScreen('settings')}
          onOpenHowToPlay={() => setActiveScreen('how-to-play')}
          onUpdateTokens={(newTokens) =>
            setGameState((prev) => ({ ...prev, hintTokens: newTokens }))
          }
        />
      )}

      {activeScreen === 'level-select' && (
        <LevelSelectScreen
          levels={levelCatalog}
          gameState={gameState}
          onSelectLevel={(id) => {
            handlePlayLevel(id);
          }}
          onBack={handleExitToHome}
        />
      )}

      {activeScreen === 'modes' && (
        <ModeSelectScreen
          levels={levelCatalog}
          onSelectModeLevel={(id) => {
            handlePlayLevel(id);
          }}
          onBack={handleExitToHome}
        />
      )}

      {activeScreen === 'achievements' && (
        <AchievementsScreen
          gameState={gameState}
          onBack={handleExitToHome}
        />
      )}

      {activeScreen === 'stats' && (
        <StatisticsScreen
          gameState={gameState}
          onBack={handleExitToHome}
        />
      )}

      {activeScreen === 'settings' && (
        <SettingsScreen
          gameState={gameState}
          onUpdateSettings={(newSettings) =>
            setGameState((prev) => ({ ...prev, settings: newSettings }))
          }
          onResetProgress={() => {
            setGameState(INITIAL_GAME_STATE);
            saveGameState(INITIAL_GAME_STATE);
            setActiveScreen('home');
          }}
          onBack={handleExitToHome}
        />
      )}

      {activeScreen === 'how-to-play' && (
        <HowToPlayScreen onBack={handleExitToHome} />
      )}
    </div>
  );
}
