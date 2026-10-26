import React from 'react';
import { PuzzleMode, LevelDefinition } from '../../types/game';
import { ArrowLeft, Hash, Move, Sparkles, Image, GitCommit, Palette, Atom, Brain } from 'lucide-react';
import { sound } from '../../utils/sound';

interface Props {
  levels: LevelDefinition[];
  onSelectModeLevel: (levelId: number) => void;
  onBack: () => void;
}

const MODES_INFO: {
  id: PuzzleMode;
  name: string;
  category: string;
  desc: string;
  icon: any;
  gradient: string;
}[] = [
  {
    id: 'number-logic',
    name: 'Number Logic',
    category: 'Mode A · Math & Sequences',
    desc: 'Solve arithmetic progressions, target sum combinations, and numerical matrices.',
    icon: Hash,
    gradient: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'sliding-tile',
    name: 'Sliding Tile',
    category: 'Mode B · Spatial Reordering',
    desc: 'Classic 15-puzzle mechanics with mathematical solvability verification and locked tiles.',
    icon: Move,
    gradient: 'from-indigo-600 to-purple-600',
  },
  {
    id: 'match-merge',
    name: 'Match & Merge',
    category: 'Mode C · Synthesis & Cascades',
    desc: 'Slide and combine matching gems to create higher-tier artifacts and melt ice obstacles.',
    icon: Sparkles,
    gradient: 'from-amber-600 to-orange-600',
  },
  {
    id: 'picture-jigsaw',
    name: 'Picture Jigsaw',
    category: 'Mode D · Visual Reassembly',
    desc: 'Piece together artistic vector mosaics with snap positioning and rotation challenges.',
    icon: Image,
    gradient: 'from-emerald-600 to-teal-600',
  },
  {
    id: 'path-connect',
    name: 'Path & Connection',
    category: 'Mode E · Flow & Circuits',
    desc: 'Draw non-crossing circuit paths between matching terminals and activate energy switches.',
    icon: GitCommit,
    gradient: 'from-cyan-600 to-sky-600',
  },
  {
    id: 'color-pattern',
    name: 'Color & Pattern',
    category: 'Mode F · Abstract Logic',
    desc: 'Solve Raven-style visual matrices, rotational symmetry, and geometric oddities.',
    icon: Palette,
    gradient: 'from-pink-600 to-rose-600',
  },
  {
    id: 'physics-object',
    name: 'Physics & Gravity',
    category: 'Mode G · Momentum & Portals',
    desc: 'Remove wooden supports to guide falling cores across trampolines and wormholes into the goal.',
    icon: Atom,
    gradient: 'from-violet-600 to-fuchsia-600',
  },
  {
    id: 'memory-puzzle',
    name: 'Memory Echoes',
    category: 'Mode H · Audio-Visual Recall',
    desc: 'Memorize musical chime sequences and match hidden elemental runes under reverse playback rules.',
    icon: Brain,
    gradient: 'from-teal-600 to-emerald-600',
  },
];

export const ModeSelectScreen: React.FC<Props> = ({ levels, onSelectModeLevel, onBack }) => {
  return (
    <div className="min-h-screen w-full flex flex-col p-4 sm:p-6 max-w-4xl mx-auto select-none">
      <header className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => {
            sound.playTileClick();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <h1 className="text-lg font-black text-white">Puzzle Categories</h1>

        <div className="text-xs text-indigo-400 font-bold">8 Modes Available</div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pb-8">
        {MODES_INFO.map((m) => {
          const Icon = m.icon;
          // Find first level in this mode
          const firstLevel = levels.find((l) => l.mode === m.id);

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                if (firstLevel) {
                  sound.playTileClick();
                  onSelectModeLevel(firstLevel.id);
                }
              }}
              className="p-4 rounded-3xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-left flex items-start gap-3.5 transition-all cursor-pointer shadow-md group hover:scale-[1.01]"
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${m.gradient} flex items-center justify-center text-white shrink-0 shadow-lg group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-6 h-6" />
              </div>

              <div className="flex-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400">
                  {m.category}
                </span>
                <h2 className="text-base font-black text-white group-hover:text-indigo-200 transition-colors">
                  {m.name}
                </h2>
                <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{m.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
