import React from 'react';
import { ShieldAlert, X, CheckCircle2 } from 'lucide-react';

interface Props {
  ruleName: string;
  ruleDescription: string;
  objective: string;
  onClose: () => void;
}

export const RuleDetailModal: React.FC<Props> = ({
  ruleName,
  ruleDescription,
  objective,
  onClose,
}) => {
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
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-400">
              Active Special Rule
            </span>
            <h2 className="text-lg font-black text-white">{ruleName}</h2>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Level Objective
            </span>
            <p className="text-xs text-slate-200 font-medium">{objective}</p>
          </div>

          <div className="bg-amber-500/10 p-3.5 rounded-2xl border border-amber-500/30">
            <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">
              Active Restriction / Modifier
            </span>
            <p className="text-xs text-amber-200/90 font-medium leading-relaxed">
              {ruleDescription}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/30 transition-all active:scale-98"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>I Understand</span>
        </button>
      </div>
    </div>
  );
};
