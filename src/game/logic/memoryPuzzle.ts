export interface MemoryCard {
  id: number;
  symbol: string;
  iconName: string;
  matched: boolean;
  flipped: boolean;
}

export interface MemorySequenceState {
  type: 'sequence' | 'pairs';
  sequence: number[]; // button indexes
  playerSequence: number[];
  round: number;
  maxRounds: number;
  showingSequence: boolean;
  reverseRule?: boolean; // special rule
  cards?: MemoryCard[];
  selectedCardIds?: number[];
  matchesFound?: number;
}

export function checkSequenceStep(
  state: MemorySequenceState,
  stepInput: number
): { correct: boolean; completedRound: boolean; completedAll: boolean } {
  const currentStepIndex = state.playerSequence.length;
  let expected = state.sequence[currentStepIndex];

  if (state.reverseRule) {
    // If reverse rule is active, player must enter sequence backwards!
    expected = state.sequence[state.sequence.length - 1 - currentStepIndex];
  }

  if (stepInput !== expected) {
    return { correct: false, completedRound: false, completedAll: false };
  }

  const newLength = currentStepIndex + 1;
  const completedRound = newLength === state.sequence.length;
  const completedAll = completedRound && state.round >= state.maxRounds;

  return { correct: true, completedRound, completedAll };
}

export function checkPairMatch(
  cards: MemoryCard[],
  firstId: number,
  secondId: number
): { matched: boolean; updatedCards: MemoryCard[] } {
  const cardA = cards.find((c) => c.id === firstId);
  const cardB = cards.find((c) => c.id === secondId);

  const matched = cardA !== undefined && cardB !== undefined && cardA.symbol === cardB.symbol;

  const updatedCards = cards.map((c) => {
    if (c.id === firstId || c.id === secondId) {
      return {
        ...c,
        matched: matched ? true : c.matched,
        flipped: matched ? true : false,
      };
    }
    return c;
  });

  return { matched, updatedCards };
}
