export interface MatchMergeState {
  size: number;
  grid: number[]; // 0 for empty, >0 for values (2, 4, 8, 16, 32, 64, 128, etc.), -1 for obstacle
  score: number;
  targetValue: number;
  targetScore: number;
  obstaclesRemaining: number;
  maxMoves?: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export function slideRowOrCol(line: number[]): { newLine: number[]; points: number; merged: boolean } {
  // Filter non-zeros
  const filtered = line.filter((v) => v !== 0 && v !== -1);
  const newLine: number[] = [];
  let points = 0;
  let merged = false;

  for (let i = 0; i < filtered.length; i++) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      const combined = filtered[i] * 2;
      newLine.push(combined);
      points += combined;
      merged = true;
      i++; // skip next since merged
    } else {
      newLine.push(filtered[i]);
    }
  }

  while (newLine.length < line.length) {
    newLine.push(0);
  }

  return { newLine, points, merged };
}

export function performMergeMove(
  state: MatchMergeState,
  dir: Direction
): { nextGrid: number[]; addedScore: number; changed: boolean; clearedObstacles: number } {
  const { size, grid } = state;
  const newGrid = [...grid];
  let totalPoints = 0;
  let changed = false;
  let clearedObstacles = 0;

  if (dir === 'left' || dir === 'right') {
    for (let r = 0; r < size; r++) {
      const row: number[] = [];
      for (let c = 0; c < size; c++) {
        row.push(grid[r * size + c]);
      }
      if (dir === 'right') row.reverse();
      const res = slideRowOrCol(row);
      if (dir === 'right') res.newLine.reverse();

      for (let c = 0; c < size; c++) {
        const idx = r * size + c;
        if (newGrid[idx] !== res.newLine[c]) {
          changed = true;
        }
        newGrid[idx] = res.newLine[c];
      }
      totalPoints += res.points;
    }
  } else {
    for (let c = 0; c < size; c++) {
      const col: number[] = [];
      for (let r = 0; r < size; r++) {
        col.push(grid[r * size + c]);
      }
      if (dir === 'down') col.reverse();
      const res = slideRowOrCol(col);
      if (dir === 'down') res.newLine.reverse();

      for (let r = 0; r < size; r++) {
        const idx = r * size + c;
        if (newGrid[idx] !== res.newLine[r]) {
          changed = true;
        }
        newGrid[idx] = res.newLine[r];
      }
      totalPoints += res.points;
    }
  }

  // Clear obstacle if adjacent cell merged
  if (totalPoints > 0) {
    for (let i = 0; i < newGrid.length; i++) {
      if (newGrid[i] === -1 && Math.random() < 0.4) {
        newGrid[i] = 0;
        clearedObstacles++;
      }
    }
  }

  // Spawn new random tile (2 or 4) on an empty slot if changed
  if (changed) {
    const emptyIndices: number[] = [];
    for (let i = 0; i < newGrid.length; i++) {
      if (newGrid[i] === 0) emptyIndices.push(i);
    }
    if (emptyIndices.length > 0) {
      const randIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      newGrid[randIdx] = Math.random() < 0.85 ? 2 : 4;
    }
  }

  return { nextGrid: newGrid, addedScore: totalPoints, changed, clearedObstacles };
}

export function isMergeWon(state: MatchMergeState): boolean {
  if (state.targetScore > 0 && state.score >= state.targetScore) {
    return true;
  }
  if (state.targetValue > 0) {
    return state.grid.some((v) => v >= state.targetValue);
  }
  if (state.obstaclesRemaining > 0) {
    return state.grid.filter((v) => v === -1).length === 0;
  }
  return false;
}
