import React from 'react';
import { NumberPuzzleState } from '../../game/logic/numberLogic';

interface Props {
  state: NumberPuzzleState;
  onUpdateSelection: (newSelection: (number | null)[]) => void;
  disabled?: boolean;
}

export const NumberLogicBoard: React.FC<Props> = ({ state, onUpdateSelection, disabled }) => {
  if (state.type === 'sequence') {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-6 w-full max-w-lg mx-auto">
        <p className="text-sm font-medium text-slate-400 text-center px-4">{state.question}</p>

        {/* Sequence row */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {state.items.map((item, idx) => {
            const isTarget = item === null;
            const userVal = state.userSelection[idx];

            return (
              <div
                key={idx}
                className={`w-14 h-16 sm:w-16 sm:h-20 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold border-2 transition-all shadow-sm ${
                  isTarget
                    ? userVal !== null
                      ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200'
                      : 'bg-slate-800/60 border-dashed border-indigo-500/50 text-indigo-400 animate-pulse'
                    : 'bg-slate-800 border-slate-700 text-white'
                }`}
              >
                {isTarget ? (userVal !== null ? userVal : '?') : item}
              </div>
            );
          })}
        </div>

        {/* Option choices */}
        {state.options && (
          <div className="mt-4 flex flex-col items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Select Missing Value
            </span>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {state.options.map((opt, i) => {
                const isSelected = state.userSelection.includes(opt);
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      const firstNullIdx = state.items.findIndex((v) => v === null);
                      if (firstNullIdx !== -1) {
                        const newSel = [...state.userSelection];
                        newSel[firstNullIdx] = opt;
                        onUpdateSelection(newSel);
                      }
                    }}
                    className={`px-5 py-3 rounded-xl font-bold text-lg sm:text-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/30 scale-105'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 hover:border-slate-500 active:scale-95'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (state.type === 'target-sum') {
    const currentSum = state.userSelection.reduce<number>(
      (acc, val) => (val !== null ? acc + val : acc),
      0
    );

    return (
      <div className="flex flex-col items-center justify-center gap-6 py-6 w-full max-w-lg mx-auto">
        <div className="flex items-center gap-4 bg-slate-800/80 px-5 py-3 rounded-2xl border border-slate-700">
          <div className="text-center">
            <div className="text-xs text-slate-400 uppercase font-semibold">Target Sum</div>
            <div className="text-2xl font-black text-amber-400">{state.targetValue}</div>
          </div>
          <div className="h-8 w-[1px] bg-slate-700" />
          <div className="text-center">
            <div className="text-xs text-slate-400 uppercase font-semibold">Current Sum</div>
            <div
              className={`text-2xl font-black ${
                currentSum === state.targetValue
                  ? 'text-emerald-400'
                  : currentSum > (state.targetValue || 0)
                  ? 'text-rose-400'
                  : 'text-sky-400'
              }`}
            >
              {currentSum}
            </div>
          </div>
        </div>

        <p className="text-sm font-medium text-slate-300 text-center px-4">{state.question}</p>

        {/* Number cards to toggle */}
        <div className="grid grid-cols-3 gap-3 w-full px-4">
          {state.items.map((item, idx) => {
            if (item === null) return null;
            const isSelected = state.userSelection.includes(item);

            return (
              <button
                key={idx}
                type="button"
                disabled={disabled}
                onClick={() => {
                  let newSel: (number | null)[] = [];
                  if (isSelected) {
                    newSel = state.userSelection.filter((v) => v !== item);
                  } else {
                    newSel = [...state.userSelection, item];
                  }
                  onUpdateSelection(newSel);
                }}
                className={`h-16 rounded-xl font-bold text-xl sm:text-2xl flex items-center justify-center border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 border-amber-300 text-slate-950 font-black shadow-lg shadow-amber-500/30 scale-105'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 hover:border-slate-500 active:scale-95'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-6 text-slate-400">
      <p>{state.question}</p>
    </div>
  );
};
