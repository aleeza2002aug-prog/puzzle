import React from 'react';
import { Play, RotateCcw, HelpCircle, Settings, Home, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../../utils/sound';

interface Props {
  levelTitle: string;
  levelNumber: number;
  soundMuted: boolean;
  onToggleMute: () => void;
  onResume: () => void;
  onRestart: () => void;
  onHowToPlay: () => void;
  onSettings: () => void;
  onHome: () => void;
}

export const PauseModal: React.FC<Props> = ({
  levelTitle,
  levelNumber,
  soundMuted,
  onToggleMute,
  onResume,
  onRestart,
  onHowToPlay,
  onSettings,
  onHome,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-2xl p-6 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
        <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-400">
          Game Paused · Level {levelNumber}
        </span>
        <h2 className="text-xl font-black text-white mt-1 mb-6">{levelTitle}</h2>

        <div className="flex flex-col gap-2.5 w-full">
          {/* Resume */}
          <button
            type="button"
            onClick={onResume}
            className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer transition-all active:scale-98"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Resume Game</span>
          </button>

          {/* Restart */}
          <button
            type="button"
            onClick={onRestart}
            className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Level</span>
          </button>

          {/* Quick Sound Toggle */}
          <button
            type="button"
            onClick={() => {
              sound.playTileClick();
              onToggleMute();
            }}
            className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>Sound & Music: {soundMuted ? 'Muted' : 'Enabled'}</span>
          </button>

          {/* How to Play */}
          <button
            type="button"
            onClick={onHowToPlay}
            className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <HelpCircle className="w-4 h-4" />
            <span>How to Play & Rules</span>
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={onSettings}
            className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Settings className="w-4 h-4" />
            <span>Settings & Themes</span>
          </button>

          {/* Return Home */}
          <button
            type="button"
            onClick={onHome}
            className="w-full py-2.5 px-4 rounded-2xl text-slate-400 hover:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all mt-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Exit to Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
