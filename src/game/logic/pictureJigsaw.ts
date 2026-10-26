export interface JigsawPiece {
  id: number;
  correctSlot: number;
  currentSlot: number | null; // null if in piece tray
  rotation: number; // 0, 90, 180, 270 degrees
  previewContent?: string;
}

export interface JigsawState {
  size: number; // 3 for 3x3 (9 pieces), 4 for 4x4 (16 pieces)
  theme: string;
  allowRotation: boolean;
  pieces: JigsawPiece[];
  boardSlots: (number | null)[]; // pieceId or null
}

export function isJigsawWon(state: JigsawState): boolean {
  for (let slot = 0; slot < state.size * state.size; slot++) {
    const pieceId = state.boardSlots[slot];
    if (pieceId === null) return false;
    const piece = state.pieces.find((p) => p.id === pieceId);
    if (!piece || piece.correctSlot !== slot) return false;
    if (state.allowRotation && (piece.rotation % 360 !== 0)) return false;
  }
  return true;
}

export function rotatePiece(piece: JigsawPiece): JigsawPiece {
  return {
    ...piece,
    rotation: (piece.rotation + 90) % 360,
  };
}
