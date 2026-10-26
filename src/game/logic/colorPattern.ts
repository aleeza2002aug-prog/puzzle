export interface PatternItem {
  shape: 'circle' | 'square' | 'triangle' | 'diamond' | 'star' | 'hexagon';
  color: string;
  rotation?: number;
  count?: number;
  label?: string;
}

export interface ColorPatternState {
  type: 'matrix' | 'sequence' | 'odd-one-out' | 'symmetry';
  instruction: string;
  grid: (PatternItem | null)[];
  options: PatternItem[];
  solutionIndex: number;
  selectedOption: number | null;
  ruleExplanation: string;
}

export function isColorPatternSolved(state: ColorPatternState): boolean {
  return state.selectedOption === state.solutionIndex;
}
