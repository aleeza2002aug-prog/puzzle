import { LevelDefinition, PuzzleMode, DifficultyTier, SpecialRuleId } from '../../types/game';

// Helper to construct level definition
function createLevel(
  id: number,
  mode: PuzzleMode,
  tier: DifficultyTier,
  title: string,
  subtitle: string,
  objective: string,
  rule: SpecialRuleId,
  ruleName: string,
  ruleDescription: string,
  starMovesTarget: number,
  starTimeTarget: number,
  initialState: any,
  maxMoves?: number,
  timeLimitSeconds?: number,
  meta?: Record<string, any>
): LevelDefinition {
  return {
    id,
    mode,
    tier,
    title,
    subtitle,
    objective,
    rule,
    ruleName,
    ruleDescription,
    starMovesTarget,
    starTimeTarget,
    initialState,
    maxMoves,
    timeLimitSeconds,
    meta,
  };
}

// Generate the 100 designed & structured levels
export function buildLevelCatalog(): LevelDefinition[] {
  const levels: LevelDefinition[] = [];

  // --- BEGINNER TIER (Levels 1 to 25) ---
  // Level 1: Number Logic (Tutorial)
  levels.push(
    createLevel(
      1,
      'number-logic',
      'beginner',
      'Number Steps',
      'Tutorial: Arithmetic Sequences',
      'Identify the missing number in the increasing sequence.',
      'standard',
      'Pure Logic',
      'Observe the pattern step between consecutive numbers.',
      1,
      20,
      {
        type: 'sequence',
        question: 'Find the missing number in the sequence:',
        items: [3, 6, 9, null, 15],
        options: [10, 11, 12, 14],
        ruleHint: 'Each number increases by +3.',
        solution: [3, 6, 9, 12, 15],
        userSelection: [3, 6, 9, null, 15],
      }
    )
  );

  // Level 2: Sliding Tile
  levels.push(
    createLevel(
      2,
      'sliding-tile',
      'beginner',
      'Tile Shuffle 3x3',
      'Sliding Basics',
      'Slide the numbered tiles into numerical order (1 through 8).',
      'standard',
      'Standard Shuffle',
      'Click or tap an adjacent tile to slide it into the empty space.',
      12,
      40,
      {
        size: 3,
        // Guaranteed solvable configuration (few steps away)
        tiles: [1, 2, 3, 4, 0, 6, 7, 5, 8],
      }
    )
  );

  // Level 3: Match & Merge
  levels.push(
    createLevel(
      3,
      'match-merge',
      'beginner',
      'Gem Synthesis',
      'Merge Basics',
      'Combine matching tiles to forge a tile with value 16.',
      'limited-moves',
      'Limited Moves (15)',
      'Reach the target tile value within 15 moves.',
      10,
      45,
      {
        size: 4,
        grid: [
          2, 2, 0, 0,
          0, 4, 4, 0,
          0, 0, 0, 0,
          0, 0, 0, 0,
        ],
        score: 0,
        targetValue: 16,
        targetScore: 0,
        obstaclesRemaining: 0,
        maxMoves: 15,
      },
      15
    )
  );

  // Level 4: Path Connect
  levels.push(
    createLevel(
      4,
      'path-connect',
      'beginner',
      'Neon Lines',
      'Connecting Endpoints',
      'Connect matching colored terminals without crossing paths.',
      'standard',
      'Clean Circuits',
      'Drag from a colored node to its matching pair.',
      2,
      30,
      {
        rows: 4,
        cols: 4,
        pairs: [
          { id: 'p1', color: '#38bdf8', symbol: 'A', start: { r: 0, c: 0 }, end: { r: 0, c: 3 } },
          { id: 'p2', color: '#f43f5e', symbol: 'B', start: { r: 3, c: 0 }, end: { r: 3, c: 3 } },
        ],
        barriers: [],
        paths: {},
      }
    )
  );

  // Level 5: Picture Jigsaw
  levels.push(
    createLevel(
      5,
      'picture-jigsaw',
      'beginner',
      'Cosmic Mosaic',
      'Jigsaw Assembly',
      'Drag and place all 9 pieces into their corresponding image slots.',
      'standard',
      'Snap Placement',
      'Place each piece onto its correct slot on the grid.',
      9,
      45,
      {
        size: 3,
        theme: 'Cosmic Nebula',
        allowRotation: false,
        pieces: [
          { id: 0, correctSlot: 0, currentSlot: null, rotation: 0 },
          { id: 1, correctSlot: 1, currentSlot: null, rotation: 0 },
          { id: 2, correctSlot: 2, currentSlot: null, rotation: 0 },
          { id: 3, correctSlot: 3, currentSlot: null, rotation: 0 },
          { id: 4, correctSlot: 4, currentSlot: null, rotation: 0 },
          { id: 5, correctSlot: 5, currentSlot: null, rotation: 0 },
          { id: 6, correctSlot: 6, currentSlot: null, rotation: 0 },
          { id: 7, correctSlot: 7, currentSlot: null, rotation: 0 },
          { id: 8, correctSlot: 8, currentSlot: null, rotation: 0 },
        ],
        boardSlots: [null, null, null, null, null, null, null, null, null],
      }
    )
  );

  // Level 6: Color Pattern
  levels.push(
    createLevel(
      6,
      'color-pattern',
      'beginner',
      'Geometric Oddity',
      'Visual Odd-One-Out',
      'Find the shape that does NOT belong with the others.',
      'standard',
      'Visual Deduction',
      'Inspect sides, vertices, and symmetry.',
      1,
      15,
      {
        type: 'odd-one-out',
        instruction: 'Which shape is the odd one out?',
        grid: [],
        options: [
          { shape: 'square', color: '#38bdf8', label: 'Square (4 sides)' },
          { shape: 'triangle', color: '#38bdf8', label: 'Triangle (3 sides)' },
          { shape: 'circle', color: '#f43f5e', label: 'Circle (0 sides)' },
          { shape: 'hexagon', color: '#38bdf8', label: 'Hexagon (6 sides)' },
        ],
        solutionIndex: 2, // Circle has no straight sides and different color
        selectedOption: null,
        ruleExplanation: 'The circle is curved and colored rose, unlike the blue polygons.',
      }
    )
  );

  // Level 7: Memory Puzzle
  levels.push(
    createLevel(
      7,
      'memory-puzzle',
      'beginner',
      'Chime Echoes',
      'Sequence Recall',
      'Watch and repeat the 3-step musical chime sequence.',
      'standard',
      'Echo Playback',
      'Repeat the illuminated tiles in the exact order shown.',
      3,
      25,
      {
        type: 'sequence',
        sequence: [0, 2, 1],
        playerSequence: [],
        round: 1,
        maxRounds: 1,
        showingSequence: false,
      }
    )
  );

  // Level 8: Physics Object
  levels.push(
    createLevel(
      8,
      'physics-object',
      'beginner',
      'Gravity Drop',
      'Target Basket',
      'Remove the wooden support beam so the core gem drops into the goal.',
      'gravity-mode',
      'Gravity Fall',
      'Click a wood block to dissolve it and let gravity do the work.',
      1,
      20,
      {
        worldWidth: 320,
        worldHeight: 380,
        ball: { x: 160, y: 50, vx: 0, vy: 0, settled: false },
        initialBall: { x: 160, y: 50 },
        goal: { x: 120, y: 320, w: 80, h: 40 },
        blocks: [
          { id: 'b1', x: 100, y: 150, w: 120, h: 20, type: 'wood', active: true },
          { id: 'b2', x: 70, y: 240, w: 80, h: 20, type: 'stone', active: true },
          { id: 'b3', x: 170, y: 240, w: 80, h: 20, type: 'stone', active: true },
        ],
        won: false,
        failed: false,
        isSimulating: false,
      }
    )
  );

  // Level 9: Number Logic (Target Sum)
  levels.push(
    createLevel(
      9,
      'number-logic',
      'beginner',
      'Target Sum: 24',
      'Mathematical Combination',
      'Select numbers that sum exactly to 24.',
      'limited-moves',
      'Move Limit (3)',
      'Choose at most 3 numbers to reach 24.',
      3,
      30,
      {
        type: 'target-sum',
        question: 'Select numbers that sum up to 24:',
        items: [7, 9, 8, 12, 15, 6],
        targetValue: 24,
        ruleHint: 'Look for two or three numbers whose sum is 24 (e.g. 9 + 8 + 7).',
        solution: [9, 8, 7],
        userSelection: [],
      },
      3
    )
  );

  // Level 10: Sliding Tile (Rule: Locked Tile)
  levels.push(
    createLevel(
      10,
      'sliding-tile',
      'beginner',
      'Locked Citadel',
      'Obstacle Rule',
      'Arrange tiles 1-8. Tile #8 is locked in place and cannot move!',
      'locked-tiles',
      'Locked Tile #8',
      'Tile 8 is anchored at bottom-left and cannot be shifted.',
      14,
      50,
      {
        size: 3,
        tiles: [1, 2, 3, 5, 0, 6, 8, 4, 7], // 8 is locked at index 6
        lockedTileIndices: [6],
      }
    )
  );

  // Level 11: Match & Merge (Time Challenge)
  levels.push(
    createLevel(
      11,
      'match-merge',
      'beginner',
      'Quick Catalyst',
      'Timed Synthesis',
      'Reach a score of 300 points before the 45-second timer runs out!',
      'time-challenge',
      'Time Rush (45s)',
      'Quickly slide and merge pairs to accumulate points.',
      15,
      35,
      {
        size: 4,
        grid: [
          2, 4, 2, 0,
          4, 8, 4, 0,
          0, 2, 2, 0,
          0, 0, 0, 0,
        ],
        score: 0,
        targetValue: 0,
        targetScore: 300,
        obstaclesRemaining: 0,
      },
      undefined,
      45
    )
  );

  // Level 12: Path Connect (Central Barrier)
  levels.push(
    createLevel(
      12,
      'path-connect',
      'beginner',
      'Island Circuit',
      'Navigating Obstacles',
      'Connect 3 terminal pairs around the central barrier island.',
      'standard',
      'Barrier Avoidance',
      'Paths cannot enter the dark barrier tiles in the middle.',
      3,
      45,
      {
        rows: 5,
        cols: 5,
        pairs: [
          { id: 'p1', color: '#38bdf8', symbol: 'A', start: { r: 0, c: 0 }, end: { r: 4, c: 0 } },
          { id: 'p2', color: '#10b981', symbol: 'B', start: { r: 0, c: 4 }, end: { r: 4, c: 4 } },
          { id: 'p3', color: '#f59e0b', symbol: 'C', start: { r: 0, c: 2 }, end: { r: 4, c: 2 } },
        ],
        barriers: [
          { r: 2, c: 1 },
          { r: 2, c: 2 },
          { r: 2, c: 3 },
        ],
        paths: {},
      }
    )
  );

  // Level 13: Memory Puzzle (Card Pairs)
  levels.push(
    createLevel(
      13,
      'memory-puzzle',
      'beginner',
      'Hidden Runes',
      'Pairs Memory',
      'Flip and match all 3 pairs of elemental runes.',
      'standard',
      'Dual Flip',
      'Remember card positions when flipping unmatched pairs.',
      6,
      40,
      {
        type: 'pairs',
        sequence: [],
        playerSequence: [],
        round: 1,
        maxRounds: 1,
        showingSequence: false,
        cards: [
          { id: 1, symbol: '🔥', iconName: 'Flame', matched: false, flipped: false },
          { id: 2, symbol: '💧', iconName: 'Water', matched: false, flipped: false },
          { id: 3, symbol: '⚡', iconName: 'Volt', matched: false, flipped: false },
          { id: 4, symbol: '🔥', iconName: 'Flame', matched: false, flipped: false },
          { id: 5, symbol: '💧', iconName: 'Water', matched: false, flipped: false },
          { id: 6, symbol: '⚡', iconName: 'Volt', matched: false, flipped: false },
        ],
        matchesFound: 0,
      }
    )
  );

  // Level 14: Color Pattern (Matrix 3x3)
  levels.push(
    createLevel(
      14,
      'color-pattern',
      'beginner',
      'Prism Matrix',
      '3x3 Logic Matrix',
      'Complete the bottom-right cell according to row color progression.',
      'standard',
      'Row Consistency',
      'Each row contains one cyan, one amber, and one emerald shape.',
      1,
      25,
      {
        type: 'matrix',
        instruction: 'Which shape and color completes the matrix pattern?',
        grid: [
          { shape: 'circle', color: '#38bdf8' },
          { shape: 'circle', color: '#f59e0b' },
          { shape: 'circle', color: '#10b981' },
          { shape: 'square', color: '#38bdf8' },
          { shape: 'square', color: '#f59e0b' },
          { shape: 'square', color: '#10b981' },
          { shape: 'triangle', color: '#38bdf8' },
          { shape: 'triangle', color: '#f59e0b' },
          null, // Target
        ],
        options: [
          { shape: 'triangle', color: '#10b981', label: 'Emerald Triangle' },
          { shape: 'circle', color: '#38bdf8', label: 'Cyan Circle' },
          { shape: 'hexagon', color: '#f59e0b', label: 'Amber Hexagon' },
          { shape: 'square', color: '#10b981', label: 'Emerald Square' },
        ],
        solutionIndex: 0,
        selectedOption: null,
        ruleExplanation: 'The 3rd row contains triangles, and requires the emerald color to complete the palette.',
      }
    )
  );

  // Level 15: Physics Object (Bouncy Pad)
  levels.push(
    createLevel(
      15,
      'physics-object',
      'beginner',
      'Kinetic Trampoline',
      'Bouncy Physics',
      'Remove the blocking stone so the gem bounces across into the basket.',
      'gravity-mode',
      'Trampoline Rebound',
      'Bouncy green pads boost vertical momentum.',
      1,
      20,
      {
        worldWidth: 320,
        worldHeight: 380,
        ball: { x: 80, y: 40, vx: 1, vy: 0, settled: false },
        initialBall: { x: 80, y: 40 },
        goal: { x: 220, y: 280, w: 70, h: 40 },
        blocks: [
          { id: 'b1', x: 60, y: 120, w: 100, h: 20, type: 'wood', active: true },
          { id: 'b2', x: 120, y: 220, w: 80, h: 20, type: 'bouncy', active: true },
          { id: 'b3', x: 210, y: 190, w: 60, h: 15, type: 'stone', active: true },
        ],
        won: false,
        failed: false,
        isSimulating: false,
      }
    )
  );

  // Level 16-24: Beginner progression with specific rule mechanics
  levels.push(
    createLevel(
      16,
      'number-logic',
      'beginner',
      'Binary Double',
      'Exponential Sequence',
      'Complete the sequence: 2, 4, 8, 16, ?',
      'standard',
      'Power of 2',
      'Each subsequent number is multiplied by 2.',
      1,
      20,
      {
        type: 'sequence',
        question: 'Identify the next number in this doubling sequence:',
        items: [2, 4, 8, 16, null],
        options: [24, 30, 32, 64],
        ruleHint: 'Each term is twice the previous term (16 * 2).',
        solution: [2, 4, 8, 16, 32],
        userSelection: [2, 4, 8, 16, null],
      }
    )
  );

  levels.push(
    createLevel(
      17,
      'sliding-tile',
      'beginner',
      'Precision Move',
      'Move Constraint',
      'Solve the sliding board in 10 moves or fewer.',
      'limited-moves',
      'Move Cap (10)',
      'Carefully plan your tile sliding path without wasted moves.',
      8,
      40,
      {
        size: 3,
        tiles: [1, 2, 3, 4, 5, 0, 7, 8, 6], // 2 moves away
      },
      10
    )
  );

  levels.push(
    createLevel(
      18,
      'picture-jigsaw',
      'beginner',
      'Angle Shift',
      'Rotation Rule',
      'Assemble the picture. One tile needs to be rotated 90 degrees!',
      'rotating-board',
      'Piece Orientation',
      'Click or tap a placed piece to rotate it into alignment.',
      10,
      50,
      {
        size: 3,
        theme: 'Emerald Valley',
        allowRotation: true,
        pieces: [
          { id: 0, correctSlot: 0, currentSlot: null, rotation: 0 },
          { id: 1, correctSlot: 1, currentSlot: null, rotation: 90 }, // needs rotate
          { id: 2, correctSlot: 2, currentSlot: null, rotation: 0 },
          { id: 3, correctSlot: 3, currentSlot: null, rotation: 0 },
          { id: 4, correctSlot: 4, currentSlot: null, rotation: 0 },
          { id: 5, correctSlot: 5, currentSlot: null, rotation: 0 },
          { id: 6, correctSlot: 6, currentSlot: null, rotation: 0 },
          { id: 7, correctSlot: 7, currentSlot: null, rotation: 0 },
          { id: 8, correctSlot: 8, currentSlot: null, rotation: 0 },
        ],
        boardSlots: [null, null, null, null, null, null, null, null, null],
      }
    )
  );

  levels.push(
    createLevel(
      19,
      'path-connect',
      'beginner',
      'Switch Conductor',
      'Interactive Switch',
      'Connect both pairs while routing path A through the yellow switch node.',
      'switch-mechanism',
      'Switch Activator',
      'The path must traverse the switch tile to open the energy grid.',
      2,
      45,
      {
        rows: 4,
        cols: 4,
        pairs: [
          { id: 'p1', color: '#f59e0b', symbol: 'A', start: { r: 0, c: 0 }, end: { r: 3, c: 3 } },
          { id: 'p2', color: '#8b5cf6', symbol: 'B', start: { r: 0, c: 3 }, end: { r: 3, c: 0 } },
        ],
        barriers: [],
        switches: [{ r: 1, c: 1, active: false, label: '⚡' }],
        paths: {},
      }
    )
  );

  levels.push(
    createLevel(
      20,
      'memory-puzzle',
      'beginner',
      'Reverse Echo',
      'Reverse Sequence Rule',
      'Memorize the sequence, then enter the sequence in REVERSE order!',
      'mirror-mode',
      'Reverse Memory',
      'Input the tones starting from the last played to the first.',
      3,
      30,
      {
        type: 'sequence',
        sequence: [1, 3, 0],
        playerSequence: [],
        round: 1,
        maxRounds: 1,
        showingSequence: false,
        reverseRule: true,
      }
    )
  );

  levels.push(
    createLevel(
      21,
      'match-merge',
      'beginner',
      'Glacier Meltdown',
      'Obstacle Melting',
      'Merge adjacent tiles next to the frozen rock to shatter it.',
      'frozen-objects',
      'Frozen Obstacle',
      'Merges occurring near frozen ice dissolve the obstacle.',
      12,
      50,
      {
        size: 4,
        grid: [
          4, 4, 0, 0,
          0, -1, 2, 2,
          0, 0, 0, 0,
          0, 0, 0, 0,
        ],
        score: 0,
        targetValue: 32,
        targetScore: 0,
        obstaclesRemaining: 1,
        maxMoves: 20,
      },
      20
    )
  );

  levels.push(
    createLevel(
      22,
      'physics-object',
      'beginner',
      'Quantum Wormhole',
      'Teleport Mechanic',
      'Drop the gem into the blue portal to emerge from the purple exit!',
      'teleport-cells',
      'Wormhole Transit',
      'Objects entering the cyan portal immediately exit from purple.',
      1,
      25,
      {
        worldWidth: 320,
        worldHeight: 380,
        ball: { x: 100, y: 40, vx: 0, vy: 0, settled: false },
        initialBall: { x: 100, y: 40 },
        goal: { x: 180, y: 320, w: 80, h: 40 },
        blocks: [
          { id: 'b1', x: 80, y: 120, w: 80, h: 20, type: 'wood', active: true },
          { id: 'p_in', x: 90, y: 180, w: 60, h: 20, type: 'portal-in', active: true },
          { id: 'p_out', x: 190, y: 220, w: 60, h: 20, type: 'portal-out', active: true },
        ],
        won: false,
        failed: false,
        isSimulating: false,
      }
    )
  );

  levels.push(
    createLevel(
      23,
      'number-logic',
      'beginner',
      'Fibonacci Spark',
      'Mathematical Growth',
      'Identify the missing number: 1, 1, 2, 3, 5, 8, ?',
      'standard',
      'Sum of Previous Two',
      'Each term is the sum of the preceding two numbers (5 + 8).',
      1,
      25,
      {
        type: 'sequence',
        question: 'What is the next number in the Fibonacci sequence?',
        items: [1, 1, 2, 3, 5, 8, null],
        options: [11, 12, 13, 15],
        ruleHint: '5 + 8 = 13',
        solution: [1, 1, 2, 3, 5, 8, 13],
        userSelection: [1, 1, 2, 3, 5, 8, null],
      }
    )
  );

  levels.push(
    createLevel(
      24,
      'color-pattern',
      'beginner',
      'Radial Symmetry',
      'Symmetry Logic',
      'Select the missing tile that maintains rotational symmetry across diagonals.',
      'standard',
      'Diagonal Reflection',
      'Symmetric pairs mirror across the center line.',
      1,
      25,
      {
        type: 'matrix',
        instruction: 'Find the tile that maintains diagonal symmetry:',
        grid: [
          { shape: 'diamond', color: '#ec4899' },
          { shape: 'star', color: '#f59e0b' },
          { shape: 'star', color: '#f59e0b' },
          null,
        ],
        options: [
          { shape: 'diamond', color: '#ec4899', label: 'Pink Diamond' },
          { shape: 'circle', color: '#38bdf8', label: 'Cyan Circle' },
          { shape: 'square', color: '#10b981', label: 'Green Square' },
          { shape: 'triangle', color: '#f59e0b', label: 'Amber Triangle' },
        ],
        solutionIndex: 0,
        selectedOption: null,
        ruleExplanation: 'The main diagonal features Pink Diamonds.',
      }
    )
  );

  // Level 25: BOSS PUZZLE (Beginner Grand Trial)
  levels.push(
    createLevel(
      25,
      'sliding-tile',
      'beginner',
      'Guardian Gateway',
      'Beginner Tier Boss Puzzle',
      'Solve this 3x3 challenge in 22 moves. Two frozen tiles unlock after 5 moves!',
      'boss-puzzle',
      'Tier 1 Boss: Phase Shift',
      'Master the sliding grid while respecting frozen anchors.',
      16,
      60,
      {
        size: 3,
        tiles: [1, 3, 2, 4, 0, 6, 7, 5, 8],
      },
      22
    )
  );

  // --- INTERMEDIATE TIER (Levels 26 to 50) ---
  // Intermediate levels expand grid size, add tighter move limits, switches, 4x4 boards
  for (let i = 26; i <= 50; i++) {
    const modeIndex = (i - 26) % 8;
    const modes: PuzzleMode[] = [
      'number-logic',
      'sliding-tile',
      'match-merge',
      'path-connect',
      'picture-jigsaw',
      'color-pattern',
      'physics-object',
      'memory-puzzle',
    ];
    const mode = modes[modeIndex];

    const ruleTypes: SpecialRuleId[] = [
      'limited-moves',
      'time-challenge',
      'locked-tiles',
      'switch-mechanism',
      'teleport-cells',
      'frozen-objects',
      'no-repeat',
      'dark-cells',
    ];
    const rule = ruleTypes[(i - 26) % ruleTypes.length];

    if (mode === 'number-logic') {
      const base = (i * 3) % 20 + 10;
      const step = (i % 4) + 3;
      levels.push(
        createLevel(
          i,
          mode,
          'intermediate',
          `Arithmetic Matrix ${i}`,
          'Target & Progression',
          `Find the number that completes the row progression (+${step}).`,
          rule,
          `Rule: ${rule.replace('-', ' ').toUpperCase()}`,
          `Solve within ${Math.max(2, 6 - (i % 3))} choices.`,
          1,
          25,
          {
            type: 'sequence',
            question: `Find the missing element: ${base}, ${base + step}, ${base + step * 2}, ?`,
            items: [base, base + step, base + step * 2, null],
            options: [base + step * 3 - 2, base + step * 3, base + step * 3 + 2, base + step * 4],
            ruleHint: `Add ${step} to previous term.`,
            solution: [base, base + step, base + step * 2, base + step * 3],
            userSelection: [base, base + step, base + step * 2, null],
          }
        )
      );
    } else if (mode === 'sliding-tile') {
      levels.push(
        createLevel(
          i,
          mode,
          'intermediate',
          `Crystal Slide ${i}`,
          'Intermediate 3x3',
          'Align tiles into numeric sequence.',
          rule,
          `Rule: ${rule.replace('-', ' ').toUpperCase()}`,
          'Tighter move allowances test your foresight.',
          16,
          50,
          {
            size: 3,
            tiles: [2, 1, 3, 4, 5, 6, 0, 7, 8],
          },
          25
        )
      );
    } else if (mode === 'match-merge') {
      levels.push(
        createLevel(
          i,
          mode,
          'intermediate',
          `Synthesis Grid ${i}`,
          'Merge to 64',
          'Merge gems to produce a tier 64 gemstone.',
          rule,
          `Rule: ${rule.replace('-', ' ').toUpperCase()}`,
          'Plan mergers to clear space and avoid board lockup.',
          20,
          60,
          {
            size: 4,
            grid: [
              4, 8, 4, 0,
              8, 16, 8, 0,
              0, 2, 4, 0,
              0, 0, 0, 0,
            ],
            score: 0,
            targetValue: 64,
            targetScore: 0,
            obstaclesRemaining: 0,
            maxMoves: 30,
          },
          30
        )
      );
    } else if (mode === 'path-connect') {
      levels.push(
        createLevel(
          i,
          mode,
          'intermediate',
          `Labyrinth ${i}`,
          '5x5 Multi-Node Flow',
          'Route all 4 terminal pairs without collisions.',
          rule,
          `Rule: ${rule.replace('-', ' ').toUpperCase()}`,
          'Barriers force non-obvious detours.',
          4,
          50,
          {
            rows: 5,
            cols: 5,
            pairs: [
              { id: 'p1', color: '#38bdf8', symbol: 'A', start: { r: 0, c: 0 }, end: { r: 0, c: 4 } },
              { id: 'p2', color: '#f43f5e', symbol: 'B', start: { r: 4, c: 0 }, end: { r: 4, c: 4 } },
              { id: 'p3', color: '#10b981', symbol: 'C', start: { r: 2, c: 0 }, end: { r: 2, c: 4 } },
            ],
            barriers: [{ r: 1, c: 2 }, { r: 3, c: 2 }],
            paths: {},
          }
        )
      );
    } else if (mode === 'picture-jigsaw') {
      levels.push(
        createLevel(
          i,
          mode,
          'intermediate',
          `Artisan Puzzle ${i}`,
          'Oriented Mosaic',
          'Fit all 9 pieces into place, rotating skewed elements.',
          rule,
          `Rule: ${rule.replace('-', ' ').toUpperCase()}`,
          'Rotate pieces to match correct landscape angles.',
          12,
          60,
          {
            size: 3,
            theme: `Realm of Wonders ${i}`,
            allowRotation: true,
            pieces: [
              { id: 0, correctSlot: 0, currentSlot: null, rotation: 0 },
              { id: 1, correctSlot: 1, currentSlot: null, rotation: 180 },
              { id: 2, correctSlot: 2, currentSlot: null, rotation: 0 },
              { id: 3, correctSlot: 3, currentSlot: null, rotation: 90 },
              { id: 4, correctSlot: 4, currentSlot: null, rotation: 0 },
              { id: 5, correctSlot: 5, currentSlot: null, rotation: 270 },
              { id: 6, correctSlot: 6, currentSlot: null, rotation: 0 },
              { id: 7, correctSlot: 7, currentSlot: null, rotation: 0 },
              { id: 8, correctSlot: 8, currentSlot: null, rotation: 0 },
            ],
            boardSlots: [null, null, null, null, null, null, null, null, null],
          }
        )
      );
    } else if (mode === 'color-pattern') {
      levels.push(
        createLevel(
          i,
          mode,
          'intermediate',
          `Color Matrix ${i}`,
          'Dual Variable Logic',
          'Find the missing shape accounting for both shape and color cycle.',
          rule,
          `Rule: ${rule.replace('-', ' ').toUpperCase()}`,
          'Columns alter colors while rows alter geometric sides.',
          1,
          25,
          {
            type: 'matrix',
            instruction: 'Determine the missing element:',
            grid: [
              { shape: 'circle', color: '#ec4899' },
              { shape: 'triangle', color: '#f59e0b' },
              { shape: 'square', color: '#10b981' },
              { shape: 'triangle', color: '#ec4899' },
              { shape: 'square', color: '#f59e0b' },
              { shape: 'circle', color: '#10b981' },
              { shape: 'square', color: '#ec4899' },
              { shape: 'circle', color: '#f59e0b' },
              null,
            ],
            options: [
              { shape: 'triangle', color: '#10b981', label: 'Green Triangle' },
              { shape: 'diamond', color: '#ec4899', label: 'Pink Diamond' },
              { shape: 'circle', color: '#38bdf8', label: 'Blue Circle' },
              { shape: 'hexagon', color: '#f59e0b', label: 'Amber Hex' },
            ],
            solutionIndex: 0,
            selectedOption: null,
            ruleExplanation: 'The 3rd row needs a triangle, and the 3rd column requires green.',
          }
        )
      );
    } else if (mode === 'physics-object') {
      levels.push(
        createLevel(
          i,
          mode,
          'intermediate',
          `Deflector Pin ${i}`,
          'Physics Momentum',
          'Direct the core gem into the basket via angled bounces.',
          rule,
          `Rule: ${rule.replace('-', ' ').toUpperCase()}`,
          'Timing the removal of wood supports sets the trajectory.',
          2,
          30,
          {
            worldWidth: 320,
            worldHeight: 380,
            ball: { x: 90, y: 30, vx: 0.5, vy: 0, settled: false },
            initialBall: { x: 90, y: 30 },
            goal: { x: 190, y: 330, w: 75, h: 40 },
            blocks: [
              { id: 'b1', x: 70, y: 100, w: 90, h: 20, type: 'wood', active: true },
              { id: 'b2', x: 150, y: 200, w: 90, h: 20, type: 'bouncy', active: true },
              { id: 'b3', x: 60, y: 270, w: 60, h: 20, type: 'wood', active: true },
            ],
            won: false,
            failed: false,
            isSimulating: false,
          }
        )
      );
    } else {
      // memory
      levels.push(
        createLevel(
          i,
          mode,
          'intermediate',
          `Rune Echo ${i}`,
          'Extended Recall',
          'Recall a 4-step sequence under reverse playback.',
          rule,
          `Rule: ${rule.replace('-', ' ').toUpperCase()}`,
          'Maintain mental map of audio-visual cues.',
          4,
          35,
          {
            type: 'sequence',
            sequence: [2, 0, 3, 1],
            playerSequence: [],
            round: 1,
            maxRounds: 1,
            showingSequence: false,
            reverseRule: i % 2 === 0,
          }
        )
      );
    }
  }

  // Level 50: INTERMEDIATE TIER BOSS
  levels[49] = createLevel(
    50,
    'sliding-tile',
    'intermediate',
    'Chamber of Eternity',
    'Tier 2 Boss Challenge',
    'Solve this complex 3x3 layout in under 50 seconds.',
    'boss-puzzle',
    'Tier 2 Boss: Chrono Lock',
    'Master swift decision making before the portal collapses.',
    18,
    45,
    {
      size: 3,
      tiles: [3, 1, 2, 4, 5, 0, 7, 8, 6],
    },
    28,
    50
  );

  // --- ADVANCED TIER (Levels 51 to 75) ---
  for (let i = 51; i <= 75; i++) {
    const modeIndex = (i - 51) % 8;
    const modes: PuzzleMode[] = [
      'sliding-tile',
      'match-merge',
      'path-connect',
      'number-logic',
      'physics-object',
      'picture-jigsaw',
      'color-pattern',
      'memory-puzzle',
    ];
    const mode = modes[modeIndex];

    const ruleTypes: SpecialRuleId[] = [
      'energy-limit',
      'dark-cells',
      'mirror-mode',
      'chain-reaction',
      'frozen-objects',
      'sequence-lock',
      'target-collection',
      'time-challenge',
    ];
    const rule = ruleTypes[(i - 51) % ruleTypes.length];

    if (mode === 'number-logic') {
      levels.push(
        createLevel(
          i,
          mode,
          'advanced',
          `Cipher Grid ${i}`,
          'Target Sum Matrix',
          'Select four numbers that combine to 36.',
          rule,
          `Rule: ${rule.replace('-', ' ').toUpperCase()}`,
          'Precision arithmetic with negative and positive values.',
          4,
          30,
          {
            type: 'target-sum',
            question: 'Pick numbers that sum to 36:',
            items: [14, 8, 12, 10, 6, 18, 5],
            targetValue: 36,
            ruleHint: '14 + 12 + 10 = 36 or 18 + 12 + 6 = 36',
            solution: [18, 12, 6],
            userSelection: [],
          },
          4
        )
      );
    } else if (mode === 'match-merge') {
      levels.push(
        createLevel(
          i,
          mode,
          'advanced',
          `Gem Singularity ${i}`,
          'Merge to 128',
          'Synthesize a 128 gemstone before running out of moves!',
          rule,
          `Rule: ${rule.replace('-', ' ').toUpperCase()}`,
          'Chain reactions unlock bonus space.',
          25,
          60,
          {
            size: 4,
            grid: [
              16, 16, 8, 0,
              32, 32, 4, 0,
              0, 2, 4, 0,
              0, 0, 0, 0,
            ],
            score: 0,
            targetValue: 128,
            targetScore: 0,
            obstaclesRemaining: 0,
            maxMoves: 35,
          },
          35
        )
      );
    } else if (mode === 'path-connect') {
      levels.push(
        createLevel(
          i,
          mode,
          'advanced',
          `Subway Nexus ${i}`,
          '6x6 Mega Grid',
          'Connect 4 distinct colored rail lines through tight switch points.',
          rule,
          `Rule: ${rule.replace('-', ' ').toUpperCase()}`,
          'Paths must navigate around three obstacles and touch switches.',
          4,
          55,
          {
            rows: 6,
            cols: 6,
            pairs: [
              { id: 'p1', color: '#38bdf8', symbol: 'A', start: { r: 0, c: 0 }, end: { r: 5, c: 5 } },
              { id: 'p2', color: '#f43f5e', symbol: 'B', start: { r: 0, c: 5 }, end: { r: 5, c: 0 } },
              { id: 'p3', color: '#10b981', symbol: 'C', start: { r: 1, c: 2 }, end: { r: 4, c: 2 } },
            ],
            barriers: [{ r: 2, c: 3 }, { r: 3, c: 3 }],
            switches: [{ r: 3, c: 1, active: false, label: '★' }],
            paths: {},
          }
        )
      );
    } else {
      levels.push(
        createLevel(
          i,
          mode,
          'advanced',
          `Master Challenge ${i}`,
          'High Complexity',
          'Solve the puzzle using multi-tiered logical deduction.',
          rule,
          `Rule: ${rule.replace('-', ' ').toUpperCase()}`,
          'Interact methodically to conquer all constraints.',
          15,
          60,
          {
            size: 3,
            tiles: [1, 2, 0, 4, 5, 3, 7, 8, 6],
          },
          26
        )
      );
    }
  }

  // Level 75: ADVANCED TIER BOSS
  levels[74] = createLevel(
    75,
    'match-merge',
    'advanced',
    'The Forge of Titans',
    'Tier 3 Boss Challenge',
    'Merge gems to forge a 256 artifact within 30 moves!',
    'boss-puzzle',
    'Tier 3 Boss: Forge Trial',
    'Every move consumes heat. Conserve momentum to forge the relic.',
    28,
    70,
    {
      size: 4,
      grid: [
        32, 32, 16, 0,
        64, 64, 8, 0,
        4, 8, 2, 0,
        0, 0, 0, 0,
      ],
      score: 0,
      targetValue: 256,
      targetScore: 0,
      obstaclesRemaining: 0,
      maxMoves: 30,
    },
    30
  );

  // --- EXPERT TIER (Levels 76 to 100) ---
  for (let i = 76; i <= 100; i++) {
    const modeIndex = (i - 76) % 8;
    const modes: PuzzleMode[] = [
      'sliding-tile',
      'path-connect',
      'number-logic',
      'match-merge',
      'picture-jigsaw',
      'physics-object',
      'color-pattern',
      'memory-puzzle',
    ];
    const mode = modes[modeIndex];

    const rule: SpecialRuleId = i === 100 ? 'boss-puzzle' : 'chain-reaction';

    levels.push(
      createLevel(
        i,
        mode,
        'expert',
        i === 100 ? 'The Ultimate Mind Core' : `Grandmaster Trial ${i}`,
        i === 100 ? 'The Grand Finale' : 'Expert Tier Mastery',
        i === 100
          ? 'Conquer the final 15-puzzle sliding core to claim Puzzle Master status!'
          : 'Solve this expert-tier challenge under pinnacle constraints.',
        rule,
        i === 100 ? 'Ultimate Boss: Grand Convergence' : 'Grandmaster Protocol',
        'Pinnacle test of your spatial, mathematical, and logical mastery.',
        i === 100 ? 30 : 20,
        i === 100 ? 120 : 60,
        i === 100
          ? {
              size: 4,
              // 4x4 15-puzzle solvable configuration
              tiles: [
                1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 0, 15,
              ],
            }
          : {
              size: 3,
              tiles: [1, 3, 2, 4, 5, 6, 7, 0, 8],
            },
        i === 100 ? 45 : 30
      )
    );
  }

  return levels;
}

// Generate deterministic daily challenge level
export function getDailyChallengeLevel(dateString?: string): LevelDefinition {
  const dateKey = dateString || new Date().toISOString().split('T')[0];
  let seed = 0;
  for (let i = 0; i < dateKey.length; i++) {
    seed = (seed * 31 + dateKey.charCodeAt(i)) % 100000;
  }

  const modes: PuzzleMode[] = [
    'number-logic',
    'sliding-tile',
    'match-merge',
    'path-connect',
    'color-pattern',
    'memory-puzzle',
  ];
  const mode = modes[seed % modes.length];

  if (mode === 'number-logic') {
    const mult = (seed % 5) + 3;
    const start = (seed % 10) + 2;
    return createLevel(
      999,
      mode,
      'intermediate',
      `Daily Challenge: ${dateKey}`,
      'Daily Brain Workout',
      `Identify the missing term in today's pattern (*${mult}).`,
      'time-challenge',
      'Daily Blitz (45s)',
      'Earn double coins and a daily streak star by completing today’s puzzle!',
      1,
      45,
      {
        type: 'sequence',
        question: `Find the missing term: ${start}, ${start * mult}, ${start * mult * mult}, ?`,
        items: [start, start * mult, start * mult * mult, null],
        options: [
          start * mult * mult * mult - 5,
          start * mult * mult * mult,
          start * mult * mult * mult + 12,
          start * mult * mult * 2,
        ],
        ruleHint: `Multiply each term by ${mult}.`,
        solution: [start, start * mult, start * mult * mult, start * mult * mult * mult],
        userSelection: [start, start * mult, start * mult * mult, null],
      },
      undefined,
      45,
      { isDaily: true, date: dateKey }
    );
  } else if (mode === 'match-merge') {
    return createLevel(
      999,
      mode,
      'intermediate',
      `Daily Challenge: ${dateKey}`,
      'Daily Gem Synthesis',
      'Synthesize a 64 gemstone within 25 moves!',
      'limited-moves',
      'Move Limit (25)',
      'Double coin reward for today’s daily challenge!',
      18,
      50,
      {
        size: 4,
        grid: [
          4, 4, 2, 0,
          8, 8, 4, 0,
          0, 2, 2, 0,
          0, 0, 0, 0,
        ],
        score: 0,
        targetValue: 64,
        targetScore: 0,
        obstaclesRemaining: 0,
        maxMoves: 25,
      },
      25,
      undefined,
      { isDaily: true, date: dateKey }
    );
  } else {
    // Default sliding tile
    return createLevel(
      999,
      'sliding-tile',
      'intermediate',
      `Daily Challenge: ${dateKey}`,
      'Daily Sliding Matrix',
      'Solve the daily 3x3 sliding puzzle in under 20 moves.',
      'limited-moves',
      'Move Constraint (20)',
      'Double stars & 50 coins reward!',
      14,
      50,
      {
        size: 3,
        tiles: [1, 2, 3, 5, 0, 6, 4, 7, 8],
      },
      20,
      undefined,
      { isDaily: true, date: dateKey }
    );
  }
}
