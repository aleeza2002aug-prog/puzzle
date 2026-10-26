export interface PathNode {
  id: string;
  color: string;
  symbol: string;
  start: { r: number; c: number };
  end: { r: number; c: number };
}

export interface PathConnectState {
  rows: number;
  cols: number;
  pairs: PathNode[];
  barriers: { r: number; c: number }[];
  switches?: { r: number; c: number; active: boolean; label: string }[];
  paths: Record<string, { r: number; c: number }[]>; // nodeId -> array of cells
}

export function isSameCell(a: { r: number; c: number }, b: { r: number; c: number }): boolean {
  return a.r === b.r && a.c === b.c;
}

export function isAdjacent(a: { r: number; c: number }, b: { r: number; c: number }): boolean {
  const dr = Math.abs(a.r - b.r);
  const dc = Math.abs(a.c - b.c);
  return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
}

// Check if cell is barrier
export function isBarrier(state: PathConnectState, r: number, c: number): boolean {
  return state.barriers.some((b) => b.r === r && b.c === c);
}

// Check if path is valid and complete from start to end
export function isPathComplete(pair: PathNode, path: { r: number; c: number }[]): boolean {
  if (path.length < 2) return false;
  const first = path[0];
  const last = path[path.length - 1];

  const startsAtStart = isSameCell(first, pair.start) && isSameCell(last, pair.end);
  const startsAtEnd = isSameCell(first, pair.end) && isSameCell(last, pair.start);

  if (!startsAtStart && !startsAtEnd) return false;

  // Check continuity
  for (let i = 0; i < path.length - 1; i++) {
    if (!isAdjacent(path[i], path[i + 1])) return false;
  }
  return true;
}

// Check if all pairs are successfully connected without intersection
export function isPathGameWon(state: PathConnectState): boolean {
  const cellOccupancy = new Map<string, string>();

  for (const pair of state.pairs) {
    const path = state.paths[pair.id] || [];
    if (!isPathComplete(pair, path)) return false;

    for (const cell of path) {
      const key = `${cell.r},${cell.c}`;
      if (cellOccupancy.has(key)) {
        return false; // overlap / intersection!
      }
      cellOccupancy.set(key, pair.id);
    }
  }

  // If switches exist, ensure active
  if (state.switches && state.switches.length > 0) {
    for (const sw of state.switches) {
      const isCrossed = Object.values(state.paths).some((path) =>
        path.some((cell) => cell.r === sw.r && cell.c === sw.c)
      );
      if (!isCrossed) return false;
    }
  }

  return true;
}
