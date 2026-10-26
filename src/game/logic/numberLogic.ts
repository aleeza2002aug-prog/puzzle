export interface NumberPuzzleState {
  type: 'sequence' | 'target-sum' | 'grid-sum' | 'odd-one-out';
  question: string;
  items: (number | null)[];
  options?: number[];
  targetValue?: number;
  gridSize?: number;
  ruleHint: string;
  solution: number[];
  userSelection: (number | null)[];
}

export function checkNumberPuzzleSolved(state: NumberPuzzleState): boolean {
  if (state.type === 'sequence') {
    // Check if user has filled all null slots with the corresponding solution
    for (let i = 0; i < state.items.length; i++) {
      if (state.items[i] === null) {
        if (state.userSelection[i] !== state.solution[i]) {
          return false;
        }
      }
    }
    return true;
  }

  if (state.type === 'target-sum') {
    // Sum of chosen items in userSelection must equal targetValue
    const selectedSum = state.userSelection.reduce<number>(
      (acc, val) => (val !== null ? acc + val : acc),
      0
    );
    return selectedSum === state.targetValue;
  }

  if (state.type === 'odd-one-out') {
    return state.userSelection[0] === state.solution[0];
  }

  if (state.type === 'grid-sum') {
    // Every cell must match solution
    for (let i = 0; i < state.solution.length; i++) {
      if (state.userSelection[i] !== state.solution[i]) {
        return false;
      }
    }
    return true;
  }

  return false;
}

export function getNumberPuzzleHint(state: NumberPuzzleState, stage: 1 | 2 | 3): string {
  if (stage === 1) {
    return `Objective: ${state.ruleHint}`;
  }
  if (stage === 2) {
    if (state.type === 'sequence') {
      return `Look at the difference or ratio between consecutive numbers. Notice the progression rate.`;
    }
    if (state.type === 'target-sum') {
      return `Combine higher numbers first to reach closer to ${state.targetValue}, then fill with smaller numbers.`;
    }
    if (state.type === 'odd-one-out') {
      return `Check parity (even/odd), prime numbers, or arithmetic properties.`;
    }
    return `Each row and column follows mathematical sum consistency.`;
  }
  // Stage 3: Direct next action
  if (state.type === 'sequence') {
    const firstMissing = state.items.findIndex((v) => v === null);
    if (firstMissing !== -1) {
      return `Next number in position ${firstMissing + 1} is ${state.solution[firstMissing]}.`;
    }
  }
  if (state.type === 'target-sum') {
    return `Try picking ${state.solution[0]} as your first piece.`;
  }
  if (state.type === 'odd-one-out') {
    return `The answer is ${state.solution[0]}.`;
  }
  return `Try placing ${state.solution[0]} in the first open cell.`;
}
