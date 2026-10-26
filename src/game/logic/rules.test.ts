import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isSlidingSolvable,
  isSlidingSolved,
  getInversionCount,
  getValidSlideMoves,
} from './slidingTile';
import { slideRowOrCol } from './matchMerge';
import { isPathComplete, isPathGameWon, PathConnectState } from './pathConnect';
import { checkNumberPuzzleSolved, NumberPuzzleState } from './numberLogic';
import { isJigsawWon, JigsawState } from './pictureJigsaw';
import { buildLevelCatalog, getDailyChallengeLevel } from './levelCatalog';

test('sliding puzzle: solvability and win detection', () => {
  // Solved 3x3 state
  const solved = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  assert.equal(isSlidingSolved(solved), true);
  assert.equal(isSlidingSolvable(3, solved), true);

  // One tile swap (unsolvable)
  const unsolvable = [2, 1, 3, 4, 5, 6, 7, 8, 0];
  assert.equal(getInversionCount(unsolvable), 1);
  assert.equal(isSlidingSolvable(3, unsolvable), false);

  // 1 move away (solvable)
  const oneMoveAway = [1, 2, 3, 4, 5, 0, 7, 8, 6];
  assert.equal(isSlidingSolved(oneMoveAway), false);
  assert.equal(isSlidingSolvable(3, oneMoveAway), true);

  // Check valid slide moves from empty position 5 in 3x3
  const moves = getValidSlideMoves(3, 5);
  // row 1 col 2: above is index 2, below is index 8, left is index 4
  assert.ok(moves.includes(2));
  assert.ok(moves.includes(8));
  assert.ok(moves.includes(4));
  assert.equal(moves.length, 3);
});

test('match & merge: row sliding and combination math', () => {
  // Simple combination
  const { newLine, points, merged } = slideRowOrCol([2, 2, 4, 8]);
  assert.deepEqual(newLine, [4, 4, 8, 0]);
  assert.equal(points, 4);
  assert.equal(merged, true);

  // Double combination
  const res2 = slideRowOrCol([4, 4, 4, 4]);
  assert.deepEqual(res2.newLine, [8, 8, 0, 0]);
  assert.equal(res2.points, 16);
});

test('path connect: valid non-intersecting circuits', () => {
  const state: PathConnectState = {
    rows: 3,
    cols: 3,
    pairs: [
      {
        id: 'p1',
        color: '#ff0000',
        symbol: 'A',
        start: { r: 0, c: 0 },
        end: { r: 0, c: 2 },
      },
    ],
    barriers: [],
    paths: {
      p1: [
        { r: 0, c: 0 },
        { r: 0, c: 1 },
        { r: 0, c: 2 },
      ],
    },
  };

  assert.equal(isPathComplete(state.pairs[0], state.paths.p1), true);
  assert.equal(isPathGameWon(state), true);
});

test('number logic: sequence and target sum solving', () => {
  const seqState: NumberPuzzleState = {
    type: 'sequence',
    question: 'Missing number',
    items: [2, 4, null, 8],
    ruleHint: '+2',
    solution: [2, 4, 6, 8],
    userSelection: [2, 4, 6, 8],
  };
  assert.equal(checkNumberPuzzleSolved(seqState), true);

  const targetState: NumberPuzzleState = {
    type: 'target-sum',
    question: 'Sum to 20',
    items: [5, 10, 5, 8],
    targetValue: 20,
    ruleHint: 'Pick to make 20',
    solution: [5, 10, 5],
    userSelection: [10, 5, 5],
  };
  assert.equal(checkNumberPuzzleSolved(targetState), true);
});

test('jigsaw puzzle: placement and rotation evaluation', () => {
  const state: JigsawState = {
    size: 2,
    theme: 'Test',
    allowRotation: true,
    pieces: [
      { id: 0, correctSlot: 0, currentSlot: 0, rotation: 0 },
      { id: 1, correctSlot: 1, currentSlot: 1, rotation: 0 },
      { id: 2, correctSlot: 2, currentSlot: 2, rotation: 0 },
      { id: 3, correctSlot: 3, currentSlot: 3, rotation: 90 }, // wrong rotation!
    ],
    boardSlots: [0, 1, 2, 3],
  };
  assert.equal(isJigsawWon(state), false);

  state.pieces[3].rotation = 0;
  assert.equal(isJigsawWon(state), true);
});

test('level catalog: generates 100 levels with 4 difficulty tiers', () => {
  const catalog = buildLevelCatalog();
  assert.equal(catalog.length, 100);

  const beginner = catalog.filter((l) => l.tier === 'beginner');
  const intermediate = catalog.filter((l) => l.tier === 'intermediate');
  const advanced = catalog.filter((l) => l.tier === 'advanced');
  const expert = catalog.filter((l) => l.tier === 'expert');

  assert.equal(beginner.length, 25);
  assert.equal(intermediate.length, 25);
  assert.equal(advanced.length, 25);
  assert.equal(expert.length, 25);

  // Daily challenge returns valid level definition
  const daily = getDailyChallengeLevel('2026-10-26');
  assert.ok(daily);
  assert.equal(daily.id, 999);
  assert.ok(daily.title.includes('Daily Challenge'));
});
