import React from 'react';
import { ColorPatternState, PatternItem } from '../../game/logic/colorPattern';

interface Props {
  state: ColorPatternState;
  onSelectOption: (optionIndex: number) => void;
  disabled?: boolean;
}

export const renderPatternShape = (item: PatternItem, size: number = 32) => {
  const { shape, color } = item;

  switch (shape) {
    case 'circle':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="16" fill={color} />
        </svg>
      );
    case 'square':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <rect x="6" y="6" width="28" height="28" rx="4" fill={color} />
        </svg>
      );
    case 'triangle':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <polygon points="20,6 36,34 4,34" fill={color} />
        </svg>
      );
    case 'diamond':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <polygon points="20,4 36,20 20,36 4,20" fill={color} />
        </svg>
      );
    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <polygon
            points="20,4 24,15 36,15 26,22 30,34 20,26 10,34 14,22 4,15 16,15"
            fill={color}
          />
        </svg>
      );
    case 'hexagon':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <polygon points="20,4 35,12 35,28 20,36 5,28 5,12" fill={color} />
        </svg>
      );
    default:
      return null;
  }
};

export const ColorPatternBoard: React.FC<Props> = ({ state, onSelectOption, disabled }) => {
  return (
    <div className="flex flex-col items-center justify-center py-2 w-full max-w-md mx-auto">
      <p className="text-sm font-semibold text-slate-300 text-center mb-4 px-3">
        {state.instruction}
      </p>

      {/* Grid Matrix if type is matrix */}
      {state.type === 'matrix' && (
        <div className="p-3 rounded-3xl bg-slate-900 border-2 border-slate-800 shadow-xl w-64 h-64 mb-6">
          <div className="grid grid-cols-3 grid-rows-3 gap-2 w-full h-full">
            {state.grid.map((cell, idx) => {
              const isTarget = cell === null;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl flex items-center justify-center transition-all ${
                    isTarget
                      ? 'bg-slate-950/80 border-2 border-dashed border-indigo-400/80 text-indigo-300 font-black text-xl animate-pulse'
                      : 'bg-slate-800/80 border border-slate-700/60'
                  }`}
                >
                  {cell ? renderPatternShape(cell, 36) : '?'}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Options List */}
      <div className="w-full flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold text-center mb-1">
          Choose the Correct Shape
        </span>
        <div className="grid grid-cols-2 gap-3">
          {state.options.map((opt, idx) => {
            const isSelected = state.selectedOption === idx;

            return (
              <button
                key={idx}
                type="button"
                disabled={disabled}
                onClick={() => onSelectOption(idx)}
                className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-lg shadow-indigo-500/20 scale-102 ring-2 ring-indigo-400'
                    : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 hover:border-slate-600 text-slate-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-center shrink-0">
                  {renderPatternShape(opt, 28)}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-200">
                    {opt.label || `${opt.shape.toUpperCase()}`}
                  </div>
                  <div className="text-[10px] text-slate-400">Option {idx + 1}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
