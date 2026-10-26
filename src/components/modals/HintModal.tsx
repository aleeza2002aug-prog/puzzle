import React, { useState } from 'react';
import { Lightbulb, ChevronRight, X, Sparkles } from 'lucide-react';
import { sound } from '../../utils/sound';

interface Props {
  hintStage1: string;
  hintStage2: string;
  hintStage3: string;
  hintTokens: number;
  onUseHintToken: () => void;
  onClose: () => void;
}

export const HintModal: React.FC<Props> = ({
  hintStage1,
  hintStage2,
  hintStage3,
  hintTokens,
  onUseHintToken,
  onClose,
}) => {
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1);

  const handleNextStage = () => {
    if (currentStage < 3) {
      if (hintTokens > 0) {
        onUseHintToken();
        sound.playHint();
        setCurrentStage((prev) => (prev + 1) as 2 | 3);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-amber-500/40 shadow-2xl p-6 flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Lightbulb className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Puzzle Hint</h2>
            <div className="text-xs text-amber-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{hintTokens} Hint Tokens Remaining</span>
            </div>
          </div>
        </div>

        {/* 3 Stage Tabs */}
        <div className="flex gap-1.5 p-1 bg-slate-950 rounded-xl mb-4">
          {[1, 2, 3].map((stageNum) => (
            <div
              key={stageNum}
              className={`flex-1 py-1.5 rounded-lg text-center text-xs font-bold transition-all ${
                stageNum === currentStage
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : stageNum < currentStage
                  ? 'bg-slate-800 text-slate-300'
                  : 'text-slate-600'
              }`}
            >
              Stage {stageNum}
            </div>
          ))}
        </div>

        {/* Hint Content Card */}
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 mb-5 min-h-[90px] flex flex-col justify-center">
          <span className="text-[10px] uppercase font-bold text-amber-400 mb-1 tracking-wider">
            {currentStage === 1
              ? 'Stage 1: Understand Objective'
              : currentStage === 2
              ? 'Stage 2: Discover Pattern Clue'
              : 'Stage 3: Direct Move Action'}
          </span>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {currentStage === 1
              ? hintStage1
              : currentStage === 2
              ? hintStage2
              : hintStage3}
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {currentStage < 3 && (
            <button
              type="button"
              disabled={hintTokens <= 0}
              onClick={handleNextStage}
              className={`flex-1 py-3 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                hintTokens > 0
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer shadow-amber-500/20 active:scale-98'
                  : 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <span>Unlock Stage {currentStage + 1} (1 Token)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
