import React, { useState } from 'react';
import { JigsawState, rotatePiece } from '../../game/logic/pictureJigsaw';
import { RotateCw, Eye } from 'lucide-react';

interface Props {
  state: JigsawState;
  onUpdateState: (newState: JigsawState) => void;
  disabled?: boolean;
}

export const PictureJigsawBoard: React.FC<Props> = ({ state, onUpdateState, disabled }) => {
  const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Artistic vector palette for piece tiles
  const getPieceGradient = (pieceId: number) => {
    const gradients = [
      'from-rose-500 to-amber-500',
      'from-amber-500 to-emerald-500',
      'from-emerald-500 to-teal-500',
      'from-teal-500 to-cyan-500',
      'from-cyan-500 to-blue-500',
      'from-blue-500 to-indigo-500',
      'from-indigo-500 to-purple-500',
      'from-purple-500 to-pink-500',
      'from-pink-500 to-rose-600',
    ];
    return gradients[pieceId % gradients.length];
  };

  const handleSlotClick = (slotIdx: number) => {
    if (disabled) return;

    // If a piece is already in this slot, select or rotate it
    const existingPieceId = state.boardSlots[slotIdx];
    if (existingPieceId !== null) {
      if (selectedPieceId === existingPieceId && state.allowRotation) {
        // Rotate
        const updatedPieces = state.pieces.map((p) =>
          p.id === existingPieceId ? rotatePiece(p) : p
        );
        onUpdateState({ ...state, pieces: updatedPieces });
      } else {
        setSelectedPieceId(existingPieceId);
      }
      return;
    }

    // If we have a selected piece, place it in this slot
    if (selectedPieceId !== null) {
      const piece = state.pieces.find((p) => p.id === selectedPieceId);
      if (!piece) return;

      const newSlots = [...state.boardSlots];
      // remove from previous slot if any
      if (piece.currentSlot !== null) {
        newSlots[piece.currentSlot] = null;
      }
      newSlots[slotIdx] = piece.id;

      const updatedPieces = state.pieces.map((p) =>
        p.id === piece.id ? { ...p, currentSlot: slotIdx } : p
      );

      setSelectedPieceId(null);
      onUpdateState({
        ...state,
        boardSlots: newSlots,
        pieces: updatedPieces,
      });
    }
  };

  const handleTrayPieceClick = (pieceId: number) => {
    if (disabled) return;
    if (selectedPieceId === pieceId && state.allowRotation) {
      // rotate while in tray
      const updatedPieces = state.pieces.map((p) =>
        p.id === pieceId ? rotatePiece(p) : p
      );
      onUpdateState({ ...state, pieces: updatedPieces });
    } else {
      setSelectedPieceId(pieceId);
    }
  };

  const piecesInTray = state.pieces.filter((p) => p.currentSlot === null);

  return (
    <div className="flex flex-col items-center justify-center py-2 w-full max-w-md mx-auto">
      {/* Top Preview Bar */}
      <div className="flex items-center justify-between w-full px-2 mb-2">
        <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
          Theme: {state.theme}
        </span>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{showPreview ? 'Hide Target' : 'View Target'}</span>
        </button>
      </div>

      {showPreview && (
        <div className="mb-3 p-3 bg-slate-900 border border-slate-700 rounded-2xl flex flex-col items-center">
          <span className="text-xs text-amber-400 font-bold mb-2">Completed Target Preview</span>
          <div
            className="grid gap-1 w-36 h-36"
            style={{
              gridTemplateColumns: `repeat(${state.size}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: state.size * state.size }).map((_, i) => (
              <div
                key={i}
                className={`rounded bg-gradient-to-br ${getPieceGradient(
                  i
                )} flex items-center justify-center text-[10px] text-white font-black`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Target Grid Slots */}
      <div
        className="p-3 rounded-3xl bg-slate-900 border-2 border-slate-800 shadow-2xl max-w-[320px] w-full aspect-square"
      >
        <div
          className="grid gap-2 w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${state.size}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${state.size}, minmax(0, 1fr))`,
          }}
        >
          {state.boardSlots.map((pieceId, slotIdx) => {
            const piece = pieceId !== null ? state.pieces.find((p) => p.id === pieceId) : null;
            const isSelected = piece && selectedPieceId === piece.id;

            return (
              <button
                key={slotIdx}
                type="button"
                disabled={disabled}
                onClick={() => handleSlotClick(slotIdx)}
                className={`rounded-2xl border-2 transition-all flex flex-col items-center justify-center relative cursor-pointer ${
                  piece
                    ? `bg-gradient-to-br ${getPieceGradient(
                        piece.id
                      )} border-white/40 text-white shadow-md`
                    : 'bg-slate-950/70 border-dashed border-slate-700 hover:border-indigo-500'
                } ${isSelected ? 'ring-4 ring-amber-400 scale-105' : ''}`}
                style={{
                  transform: piece ? `rotate(${piece.rotation}deg)` : undefined,
                }}
              >
                {piece ? (
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-black drop-shadow">{piece.id + 1}</span>
                    {state.allowRotation && piece.rotation !== 0 && (
                      <span className="text-[9px] uppercase tracking-wider bg-black/40 px-1 rounded">
                        {piece.rotation}°
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-slate-600 font-bold">{slotIdx + 1}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Piece Tray */}
      <div className="mt-4 w-full bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Piece Tray ({piecesInTray.length} remaining)
          </span>
          {state.allowRotation && selectedPieceId !== null && (
            <button
              type="button"
              onClick={() => {
                const updated = state.pieces.map((p) =>
                  p.id === selectedPieceId ? rotatePiece(p) : p
                );
                onUpdateState({ ...state, pieces: updated });
              }}
              className="flex items-center gap-1 text-xs text-amber-400 font-bold hover:underline cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Rotate Selected</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-2">
          {piecesInTray.length === 0 ? (
            <div className="text-xs text-slate-500 py-3 w-full text-center">
              All pieces placed on board! Check rotations if not solved.
            </div>
          ) : (
            piecesInTray.map((piece) => {
              const isSelected = selectedPieceId === piece.id;
              return (
                <button
                  key={piece.id}
                  type="button"
                  onClick={() => handleTrayPieceClick(piece.id)}
                  className={`w-14 h-14 shrink-0 rounded-xl bg-gradient-to-br ${getPieceGradient(
                    piece.id
                  )} border-2 text-white font-black text-lg flex flex-col items-center justify-center transition-all cursor-pointer shadow-sm ${
                    isSelected
                      ? 'border-amber-400 ring-4 ring-amber-400/50 scale-105'
                      : 'border-white/20 hover:scale-102'
                  }`}
                  style={{
                    transform: `rotate(${piece.rotation}deg)`,
                  }}
                >
                  <span>{piece.id + 1}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
