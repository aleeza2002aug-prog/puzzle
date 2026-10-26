import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, LevelDefinition } from '../../types/game';
import { GameHeader } from '../ui/GameHeader';
import { GameControlsDock } from '../ui/GameControlsDock';
import { VictoryModal } from '../modals/VictoryModal';
import { GameOverModal } from '../modals/GameOverModal';
import { PauseModal } from '../modals/PauseModal';
import { HintModal } from '../modals/HintModal';
import { RuleDetailModal } from '../modals/RuleDetailModal';

// Board Components
import { NumberLogicBoard } from '../game/NumberLogicBoard';
import { SlidingTileBoard } from '../game/SlidingTileBoard';
import { MatchMergeBoard } from '../game/MatchMergeBoard';
import { PathConnectBoard } from '../game/PathConnectBoard';
import { PictureJigsawBoard } from '../game/PictureJigsawBoard';
import { ColorPatternBoard } from '../game/ColorPatternBoard';
import { PhysicsObjectBoard } from '../game/PhysicsObjectBoard';
import { MemoryPuzzleBoard } from '../game/MemoryPuzzleBoard';

// Logic Handlers
import { checkNumberPuzzleSolved, getNumberPuzzleHint } from '../../game/logic/numberLogic';
import { isSlidingSolved, getSlidingHintMove, isSlidingSolvable } from '../../game/logic/slidingTile';
import { performMergeMove, isMergeWon, Direction } from '../../game/logic/matchMerge';
import { isPathGameWon } from '../../game/logic/pathConnect';
import { isJigsawWon } from '../../game/logic/pictureJigsaw';
import { isColorPatternSolved } from '../../game/logic/colorPattern';
import { checkSequenceStep, checkPairMatch } from '../../game/logic/memoryPuzzle';

import { sound } from '../../utils/sound';

interface Props {
  level: LevelDefinition;
  gameState: GameState;
  onLevelComplete: (levelId: number, stars: number, moves: number, timeSeconds: number, coinsEarned: number) => void;
  onNextLevel: () => void;
  onExit: () => void;
  onOpenSettings: () => void;
  onOpenHowToPlay: () => void;
  onUpdateTokens: (newTokens: number) => void;
}

export const GameplayScreen: React.FC<Props> = ({
  level,
  gameState,
  onLevelComplete,
  onNextLevel,
  onExit,
  onOpenSettings,
  onOpenHowToPlay,
  onUpdateTokens,
}) => {
  // Puzzle state initialized from level
  const [boardState, setBoardState] = useState<any>(() => JSON.parse(JSON.stringify(level.initialState)));
  const [undoStack, setUndoStack] = useState<any[]>([]);

  // Gameplay metrics
  const [moves, setMoves] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState<'moves' | 'time' | 'invalid'>('moves');
  const [isVictory, setIsVictory] = useState(false);
  const [victoryStars, setVictoryStars] = useState(1);

  // Modals
  const [showHintModal, setShowHintModal] = useState(false);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [hintHighlightIdx, setHintHighlightIdx] = useState<number | null>(null);
  const [hintsUsedThisLevel, setHintsUsedThisLevel] = useState(0);

  const timerRef = useRef<any>(null);

  // Reset or initialize on level change
  useEffect(() => {
    setBoardState(JSON.parse(JSON.stringify(level.initialState)));
    setUndoStack([]);
    setMoves(0);
    setTimeSeconds(0);
    setIsPaused(false);
    setIsGameOver(false);
    setIsVictory(false);
    setShowHintModal(false);
    setShowRuleModal(false);
    setHintHighlightIdx(null);
    setHintsUsedThisLevel(0);
  }, [level.id]);

  // Timer loop
  useEffect(() => {
    if (isPaused || isVictory || isGameOver) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeSeconds((prev) => {
        const next = prev + 1;
        // Check time limit
        if (level.timeLimitSeconds && next >= level.timeLimitSeconds) {
          setIsGameOver(true);
          setGameOverReason('time');
        }
        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isVictory, isGameOver, level.timeLimitSeconds]);

  // Keyboard shortcut for Escape -> Pause
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showHintModal) setShowHintModal(false);
        else if (showRuleModal) setShowRuleModal(false);
        else setIsPaused((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showHintModal, showRuleModal]);

  // Push state to undo stack before a move
  const pushUndo = useCallback(() => {
    setUndoStack((prev) => [...prev.slice(-15), JSON.parse(JSON.stringify(boardState))]);
  }, [boardState]);

  // Perform Undo
  const handleUndo = () => {
    if (undoStack.length === 0 || isVictory || isGameOver) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setBoardState(previous);
    setMoves((m) => Math.max(0, m - 1));
    sound.playUndo();
  };

  // Perform Restart
  const handleRestart = () => {
    sound.playTileClick();
    setBoardState(JSON.parse(JSON.stringify(level.initialState)));
    setUndoStack([]);
    setMoves(0);
    setTimeSeconds(0);
    setIsGameOver(false);
    setIsVictory(false);
    setHintHighlightIdx(null);
  };

  // Evaluate Victory
  const triggerVictory = (finalMoves: number) => {
    setIsVictory(true);

    // Calculate stars: 1 to 3
    let stars = 1;
    const metMoveTarget = finalMoves <= level.starMovesTarget;
    const metTimeTarget = level.starTimeTarget ? timeSeconds <= level.starTimeTarget : true;

    if (metMoveTarget && metTimeTarget) {
      stars = 3;
    } else if (metMoveTarget || metTimeTarget || hintsUsedThisLevel === 0) {
      stars = 2;
    }

    setVictoryStars(stars);
    const coins = level.meta?.isDaily ? 50 : 20 + stars * 5;
    onLevelComplete(level.id, stars, finalMoves, timeSeconds, coins);
  };

  // Check moves limit
  const checkMoveLimit = (newMoves: number) => {
    if (level.maxMoves && newMoves >= level.maxMoves) {
      setIsGameOver(true);
      setGameOverReason('moves');
      return true;
    }
    return false;
  };

  // Handlers for specific game modes
  // 1. Number Logic
  const handleNumberSelection = (newSelection: (number | null)[]) => {
    pushUndo();
    const nextState = { ...boardState, userSelection: newSelection };
    setBoardState(nextState);
    const nextMoves = moves + 1;
    setMoves(nextMoves);
    sound.playMove();

    if (checkNumberPuzzleSolved(nextState)) {
      triggerVictory(nextMoves);
    } else {
      checkMoveLimit(nextMoves);
    }
  };

  // 2. Sliding Tile
  const handleSlidingMove = (tileIndex: number) => {
    const emptyIdx = boardState.tiles.indexOf(0);
    if (emptyIdx === -1) return;

    pushUndo();
    const newTiles = [...boardState.tiles];
    newTiles[emptyIdx] = newTiles[tileIndex];
    newTiles[tileIndex] = 0;

    const nextState = { ...boardState, tiles: newTiles };
    setBoardState(nextState);
    const nextMoves = moves + 1;
    setMoves(nextMoves);
    sound.playMove();

    if (hintHighlightIdx !== null) setHintHighlightIdx(null);

    if (isSlidingSolved(newTiles)) {
      triggerVictory(nextMoves);
    } else {
      checkMoveLimit(nextMoves);
    }
  };

  // 3. Match & Merge
  const handleMergeSlide = (dir: Direction) => {
    const res = performMergeMove(boardState, dir);
    if (!res.changed) return;

    pushUndo();
    const nextState = {
      ...boardState,
      grid: res.nextGrid,
      score: boardState.score + res.addedScore,
      obstaclesRemaining: Math.max(0, boardState.obstaclesRemaining - res.clearedObstacles),
    };
    setBoardState(nextState);
    const nextMoves = moves + 1;
    setMoves(nextMoves);
    if (res.addedScore > 0) {
      sound.playMatch();
    } else {
      sound.playMove();
    }

    if (isMergeWon(nextState)) {
      triggerVictory(nextMoves);
    } else {
      checkMoveLimit(nextMoves);
    }
  };

  // 4. Path Connect
  const handlePathUpdate = (newPaths: Record<string, { r: number; c: number }[]>) => {
    const nextState = { ...boardState, paths: newPaths };
    setBoardState(nextState);
    sound.playMove();

    if (isPathGameWon(nextState)) {
      triggerVictory(moves + 1);
    }
  };

  // 5. Picture Jigsaw
  const handleJigsawUpdate = (newState: any) => {
    pushUndo();
    setBoardState(newState);
    const nextMoves = moves + 1;
    setMoves(nextMoves);
    sound.playMove();

    if (isJigsawWon(newState)) {
      triggerVictory(nextMoves);
    } else {
      checkMoveLimit(nextMoves);
    }
  };

  // 6. Color Pattern
  const handleColorPatternSelect = (optionIdx: number) => {
    pushUndo();
    const nextState = { ...boardState, selectedOption: optionIdx };
    setBoardState(nextState);
    const nextMoves = moves + 1;
    setMoves(nextMoves);

    if (isColorPatternSolved(nextState)) {
      sound.playMatch();
      triggerVictory(nextMoves);
    } else {
      sound.playInvalid();
      checkMoveLimit(nextMoves);
    }
  };

  // 7. Physics Object
  const handlePhysicsUpdate = (newState: any) => {
    setBoardState(newState);
    if (newState.won && !isVictory) {
      triggerVictory(moves + 1);
    } else if (newState.failed && !isGameOver) {
      setIsGameOver(true);
      setGameOverReason('invalid');
    }
  };

  // 8. Memory Puzzle
  const handleMemoryStepInput = (stepIdx: number) => {
    const res = checkSequenceStep(boardState, stepIdx);
    if (!res.correct) {
      sound.playInvalid();
      // Reset player sequence for this round
      setBoardState({ ...boardState, playerSequence: [] });
      return;
    }

    const nextPlayerSeq = [...boardState.playerSequence, stepIdx];
    const nextMoves = moves + 1;
    setMoves(nextMoves);

    if (res.completedAll) {
      sound.playMatch();
      setBoardState({ ...boardState, playerSequence: nextPlayerSeq });
      triggerVictory(nextMoves);
    } else if (res.completedRound) {
      sound.playMatch();
      setBoardState({
        ...boardState,
        playerSequence: [],
        round: boardState.round + 1,
      });
    } else {
      setBoardState({ ...boardState, playerSequence: nextPlayerSeq });
    }
  };

  const handleCardFlip = (cardId: number) => {
    pushUndo();
    const currentFlipped = boardState.cards.filter((c: any) => c.flipped && !c.matched);

    if (currentFlipped.length === 0) {
      // First card flip
      sound.playTileClick();
      const updated = boardState.cards.map((c: any) =>
        c.id === cardId ? { ...c, flipped: true } : c
      );
      setBoardState({ ...boardState, cards: updated });
    } else if (currentFlipped.length === 1) {
      // Second card flip
      const firstId = currentFlipped[0].id;
      const nextMoves = moves + 1;
      setMoves(nextMoves);

      const res = checkPairMatch(boardState.cards, firstId, cardId);
      if (res.matched) {
        sound.playMatch();
        const nextMatches = (boardState.matchesFound || 0) + 1;
        const nextState = {
          ...boardState,
          cards: res.updatedCards,
          matchesFound: nextMatches,
        };
        setBoardState(nextState);
        if (nextMatches >= (boardState.cards.length / 2)) {
          triggerVictory(nextMoves);
        }
      } else {
        sound.playInvalid();
        // Temporarily reveal both cards, then flip back after 700ms
        const revealedCards = boardState.cards.map((c: any) =>
          c.id === cardId ? { ...c, flipped: true } : c
        );
        setBoardState({ ...boardState, cards: revealedCards });
        setTimeout(() => {
          const resetCards = boardState.cards.map((c: any) =>
            c.id === firstId || c.id === cardId ? { ...c, flipped: false } : c
          );
          setBoardState({ ...boardState, cards: resetCards });
        }, 700);
      }
    }
  };

  // Generate Hints
  const getHints = () => {
    let s1 = `Goal: ${level.objective}. Check the special rule '${level.ruleName}'.`;
    let s2 = `Pay close attention to symmetries, differences, or paths.`;
    let s3 = `Try making an exploratory move towards the primary target.`;

    if (level.mode === 'number-logic' && boardState?.items) {
      s1 = getNumberPuzzleHint(boardState, 1);
      s2 = getNumberPuzzleHint(boardState, 2);
      s3 = getNumberPuzzleHint(boardState, 3);
    } else if (level.mode === 'sliding-tile' && Array.isArray(boardState?.tiles)) {
      s1 = `Arrange the numbered tiles in sequential order from top-left to bottom-right.`;
      s2 = `Work on placing the top row first (1, 2, 3), then the remaining rows.`;
      const bestMove = getSlidingHintMove(boardState.size, boardState.tiles);
      if (bestMove !== null && boardState.tiles[bestMove] !== undefined) {
        const val = boardState.tiles[bestMove];
        s3 = `Recommended next move: slide tile #${val} into the open space.`;
      }
    } else if (level.mode === 'match-merge' && Array.isArray(boardState?.grid)) {
      s1 = `Combine pairs of matching numbers or gems by sliding rows and columns.`;
      s2 = `Keep your highest value tile near a corner to prevent board clumping.`;
      s3 = `Slide in the direction that pairs up the most matching numbers.`;
    } else if (level.mode === 'path-connect' && boardState?.paths) {
      s1 = `Draw a continuous line between each pair of matching letters without crossing.`;
      s2 = `Route the outer connections along the borders to leave space for inner lines.`;
      s3 = `Begin with the connection that has the fewest possible detour routes.`;
    }

    return { s1, s2, s3 };
  };

  const handleUseHintToken = () => {
    if (gameState.hintTokens > 0) {
      onUpdateTokens(gameState.hintTokens - 1);
      setHintsUsedThisLevel((h) => h + 1);

      // If sliding puzzle, highlight tile
      if (level.mode === 'sliding-tile') {
        const best = getSlidingHintMove(boardState.size, boardState.tiles);
        setHintHighlightIdx(best);
      }
    }
  };

  const { s1, s2, s3 } = getHints();

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-slate-950 text-slate-100 select-none overflow-x-hidden">
      {/* Top HUD */}
      <GameHeader
        level={level}
        moves={moves}
        timeSeconds={timeSeconds}
        starsEarned={victoryStars}
        onPause={() => setIsPaused(true)}
        onShowRuleDetails={() => setShowRuleModal(true)}
      />

      {/* Main Interactive Board Arena */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 w-full max-w-2xl mx-auto">
        {level.mode === 'number-logic' && (
          <NumberLogicBoard
            state={boardState}
            onUpdateSelection={handleNumberSelection}
            disabled={isVictory || isGameOver}
          />
        )}

        {level.mode === 'sliding-tile' && (
          <SlidingTileBoard
            size={boardState.size}
            tiles={boardState.tiles}
            lockedTileIndices={boardState.lockedTileIndices || level.initialState.lockedTileIndices}
            hintHighlightIdx={hintHighlightIdx}
            onMoveTile={handleSlidingMove}
            disabled={isVictory || isGameOver}
          />
        )}

        {level.mode === 'match-merge' && (
          <MatchMergeBoard
            state={boardState}
            onSlide={handleMergeSlide}
            disabled={isVictory || isGameOver}
          />
        )}

        {level.mode === 'path-connect' && (
          <PathConnectBoard
            state={boardState}
            onUpdatePaths={handlePathUpdate}
            disabled={isVictory || isGameOver}
          />
        )}

        {level.mode === 'picture-jigsaw' && (
          <PictureJigsawBoard
            state={boardState}
            onUpdateState={handleJigsawUpdate}
            disabled={isVictory || isGameOver}
          />
        )}

        {level.mode === 'color-pattern' && (
          <ColorPatternBoard
            state={boardState}
            onSelectOption={handleColorPatternSelect}
            disabled={isVictory || isGameOver}
          />
        )}

        {level.mode === 'physics-object' && (
          <PhysicsObjectBoard
            state={boardState}
            onUpdateState={handlePhysicsUpdate}
            disabled={isVictory || isGameOver}
          />
        )}

        {level.mode === 'memory-puzzle' && (
          <MemoryPuzzleBoard
            state={boardState}
            onStepInput={handleMemoryStepInput}
            onCardFlip={handleCardFlip}
            disabled={isVictory || isGameOver}
          />
        )}
      </main>

      {/* Bottom Controls Dock */}
      <GameControlsDock
        hintTokens={gameState.hintTokens}
        canUndo={undoStack.length > 0}
        onHint={() => {
          sound.playTileClick();
          setShowHintModal(true);
        }}
        onUndo={handleUndo}
        onRestart={handleRestart}
        onHelp={onOpenHowToPlay}
        disabled={isVictory || isGameOver}
      />

      {/* Modals */}
      {isVictory && (
        <VictoryModal
          levelTitle={level.title}
          levelNumber={level.id}
          stars={victoryStars}
          moves={moves}
          timeSeconds={timeSeconds}
          coinsEarned={level.meta?.isDaily ? 50 : 20 + victoryStars * 5}
          hasNextLevel={level.id < 100}
          onNextLevel={onNextLevel}
          onReplay={handleRestart}
          onHome={onExit}
        />
      )}

      {isGameOver && (
        <GameOverModal
          reason={gameOverReason}
          onRetry={handleRestart}
          onUseHint={() => {
            setIsGameOver(false);
            setShowHintModal(true);
          }}
          onHome={onExit}
        />
      )}

      {isPaused && (
        <PauseModal
          levelTitle={level.title}
          levelNumber={level.id}
          soundMuted={gameState.settings.soundMuted}
          onToggleMute={() => {
            const nextMuted = !gameState.settings.soundMuted;
            sound.updateVolumes(gameState.settings.sfxVolume, gameState.settings.musicVolume, nextMuted);
          }}
          onResume={() => setIsPaused(false)}
          onRestart={() => {
            setIsPaused(false);
            handleRestart();
          }}
          onHowToPlay={() => {
            setIsPaused(false);
            onOpenHowToPlay();
          }}
          onSettings={() => {
            setIsPaused(false);
            onOpenSettings();
          }}
          onHome={() => {
            setIsPaused(false);
            onExit();
          }}
        />
      )}

      {showHintModal && (
        <HintModal
          hintStage1={s1}
          hintStage2={s2}
          hintStage3={s3}
          hintTokens={gameState.hintTokens}
          onUseHintToken={handleUseHintToken}
          onClose={() => setShowHintModal(false)}
        />
      )}

      {showRuleModal && (
        <RuleDetailModal
          ruleName={level.ruleName}
          ruleDescription={level.ruleDescription}
          objective={level.objective}
          onClose={() => setShowRuleModal(false)}
        />
      )}
    </div>
  );
};
