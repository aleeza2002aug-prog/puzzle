export interface SlidingTileState {
  size: number; // 3 for 3x3 (8-puzzle), 4 for 4x4 (15-puzzle)
  tiles: number[]; // 0 represents the empty cell, 1..N-1 are numbers
  lockedTileIndices?: number[]; // tiles that cannot move
  imagePreviewUrl?: string;
  isImageMode?: boolean;
}

// Inversion count calculation
export function getInversionCount(arr: number[]): number {
  let invCount = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] !== 0 && arr[j] !== 0 && arr[i] > arr[j]) {
        invCount++;
      }
    }
  }
  return invCount;
}

// Check if a sliding puzzle configuration is mathematically solvable
export function isSlidingSolvable(size: number, tiles: number[]): boolean {
  const invCount = getInversionCount(tiles);
  if (size % 2 !== 0) {
    // Odd grid (3x3): solvable iff inversions is even
    return invCount % 2 === 0;
  } else {
    // Even grid (4x4): find row of empty tile from bottom (1-indexed)
    const emptyIndex = tiles.indexOf(0);
    const rowFromBottom = size - Math.floor(emptyIndex / size);
    if (rowFromBottom % 2 === 0) {
      return invCount % 2 !== 0;
    } else {
      return invCount % 2 === 0;
    }
  }
}

// Check if solved
export function isSlidingSolved(tiles: number[]): boolean {
  const n = tiles.length;
  for (let i = 0; i < n - 1; i++) {
    if (tiles[i] !== i + 1) return false;
  }
  return tiles[n - 1] === 0;
}

// Get valid adjacent moves for empty tile
export function getValidSlideMoves(size: number, emptyIndex: number): number[] {
  const moves: number[] = [];
  const row = Math.floor(emptyIndex / size);
  const col = emptyIndex % size;

  if (row > 0) moves.push(emptyIndex - size); // tile above can slide down
  if (row < size - 1) moves.push(emptyIndex + size); // tile below can slide up
  if (col > 0) moves.push(emptyIndex - 1); // tile left can slide right
  if (col < size - 1) moves.push(emptyIndex + 1); // tile right can slide left

  return moves;
}

// Generate a guaranteed solvable puzzle via random walk
export function generateSolvableSliding(size: number, steps: number = 30): number[] {
  const total = size * size;
  const tiles: number[] = [];
  for (let i = 1; i < total; i++) tiles.push(i);
  tiles.push(0);

  let emptyIndex = total - 1;
  let lastMove = -1;

  for (let s = 0; s < steps; s++) {
    const valid = getValidSlideMoves(size, emptyIndex).filter((idx) => idx !== lastMove);
    if (valid.length === 0) continue;
    const choice = valid[Math.floor(Math.random() * valid.length)];
    // swap
    tiles[emptyIndex] = tiles[choice];
    tiles[choice] = 0;
    lastMove = emptyIndex;
    emptyIndex = choice;
  }

  // Ensure it's not already solved
  if (isSlidingSolved(tiles)) {
    const moves = getValidSlideMoves(size, emptyIndex);
    const c = moves[0];
    tiles[emptyIndex] = tiles[c];
    tiles[c] = 0;
  }

  return tiles;
}

// Manhattan distance of board to target solved state
export function getManhattanDistance(size: number, tiles: number[]): number {
  let dist = 0;
  for (let i = 0; i < tiles.length; i++) {
    const val = tiles[i];
    if (val === 0) continue;
    const targetIdx = val - 1;
    const currRow = Math.floor(i / size);
    const currCol = i % size;
    const targetRow = Math.floor(targetIdx / size);
    const targetCol = targetIdx % size;
    dist += Math.abs(currRow - targetRow) + Math.abs(currCol - targetCol);
  }
  return dist;
}

// Intelligent next move recommendation
export function getSlidingHintMove(size: number, tiles: number[]): number | null {
  if (!tiles || !Array.isArray(tiles)) return null;
  const emptyIndex = tiles.indexOf(0);
  if (emptyIndex === -1) return null;
  const validMoves = getValidSlideMoves(size, emptyIndex);
  let bestMove: number | null = null;
  let minDistance = Infinity;

  for (const move of validMoves) {
    const nextTiles = [...tiles];
    nextTiles[emptyIndex] = nextTiles[move];
    nextTiles[move] = 0;

    const d = getManhattanDistance(size, nextTiles);
    if (d < minDistance) {
      minDistance = d;
      bestMove = move;
    }
  }

  return bestMove;
}
