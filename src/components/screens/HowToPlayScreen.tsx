import React, { useState } from 'react';
import { ArrowLeft, BookOpen, ShieldAlert, MousePointer, Smartphone } from 'lucide-react';
import { sound } from '../../utils/sound';

interface Props {
  onBack: () => void;
}

export const HowToPlayScreen: React.FC<Props> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'modes' | 'rules' | 'controls'>('modes');

  return (
    <div className="min-h-screen w-full flex flex-col p-4 sm:p-6 max-w-2xl mx-auto select-none">
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

        <h1 className="text-lg font-black text-white">How to Play</h1>

        <div className="w-16" />
      </header>

      {/* Navigation Tabs */}
      <div className="flex gap-1.5 p-1 bg-slate-900 rounded-2xl border border-slate-800 mb-6">
        <button
          type="button"
          onClick={() => {
            sound.playTileClick();
            setActiveTab('modes');
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'modes'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Puzzle Modes
        </button>
        <button
          type="button"
          onClick={() => {
            sound.playTileClick();
            setActiveTab('rules');
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'rules'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Special Rules
        </button>
        <button
          type="button"
          onClick={() => {
            sound.playTileClick();
            setActiveTab('controls');
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'controls'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Controls
        </button>
      </div>

      <div className="space-y-3.5 pb-8 flex-1">
        {activeTab === 'modes' && (
          <>
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-indigo-400">Mode A</span>
              <h2 className="text-sm font-black text-white">Number Logic</h2>
              <p className="text-xs text-slate-300">
                Identify arithmetic progressions, complete sequences, or combine number chips to match a target sum.
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-indigo-400">Mode B</span>
              <h2 className="text-sm font-black text-white">Sliding Tile</h2>
              <p className="text-xs text-slate-300">
                Slide adjacent numbered tiles into the empty space to arrange them from 1 to 8 (or 15). Every layout is mathematically guaranteed solvable!
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-indigo-400">Mode C</span>
              <h2 className="text-sm font-black text-white">Match & Merge</h2>
              <p className="text-xs text-slate-300">
                Swipe or use arrow keys to slide tiles across the board. Identical adjacent gems merge into the next tier.
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-indigo-400">Mode D</span>
              <h2 className="text-sm font-black text-white">Picture Jigsaw</h2>
              <p className="text-xs text-slate-300">
                Select mosaic fragments from the tray and place them into the correct grid slots. Rotate skewed pieces to fit!
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-indigo-400">Mode E</span>
              <h2 className="text-sm font-black text-white">Path & Connection</h2>
              <p className="text-xs text-slate-300">
                Draw non-crossing circuit paths between matching terminals. Respect barriers and route through required switches.
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-indigo-400">Mode F</span>
              <h2 className="text-sm font-black text-white">Color & Pattern</h2>
              <p className="text-xs text-slate-300">
                Deduce missing matrix shapes based on geometric sides, rotational symmetry, and color palettes.
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-indigo-400">Mode G</span>
              <h2 className="text-sm font-black text-white">Physics & Gravity</h2>
              <p className="text-xs text-slate-300">
                Click wooden support beams to dissolve them and drop the core gem through bouncy pads and portals safely into the target.
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-indigo-400">Mode H</span>
              <h2 className="text-sm font-black text-white">Memory Echoes</h2>
              <p className="text-xs text-slate-300">
                Watch the sequence of glowing chime pads and repeat them accurately. Watch out for reverse-order rules!
              </p>
            </div>
          </>
        )}

        {activeTab === 'rules' && (
          <>
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-amber-400">Rule 1</span>
              <h2 className="text-sm font-black text-white">Limited Moves</h2>
              <p className="text-xs text-slate-300">
                You only have a fixed number of operations to solve the level. Plan every move carefully!
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-amber-400">Rule 2</span>
              <h2 className="text-sm font-black text-white">Time Challenge</h2>
              <p className="text-xs text-slate-300">
                The clock is ticking. Complete the objective before the countdown runs down to zero.
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-amber-400">Rule 3</span>
              <h2 className="text-sm font-black text-white">Locked Tiles</h2>
              <p className="text-xs text-slate-300">
                Specific tiles are anchored with red locks and cannot be shifted into empty spaces.
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-amber-400">Rule 4</span>
              <h2 className="text-sm font-black text-white">Switch Mechanisms</h2>
              <p className="text-xs text-slate-300">
                Paths or movements must trigger special switch nodes to activate the grid.
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-amber-400">Rule 5</span>
              <h2 className="text-sm font-black text-white">Teleport Cells & Wormholes</h2>
              <p className="text-xs text-slate-300">
                Entering a cyan portal instantly teleports objects to the linked purple exit.
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-amber-400">Rule 6</span>
              <h2 className="text-sm font-black text-white">Tier Boss Puzzles</h2>
              <p className="text-xs text-slate-300">
                End-of-tier grand trials combining multiple mechanics and strict star conditions.
              </p>
            </div>
          </>
        )}

        {activeTab === 'controls' && (
          <>
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400">
                <MousePointer className="w-5 h-5" />
                <h2 className="text-sm font-black text-white">Desktop Controls</h2>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li><strong className="text-white">Mouse:</strong> Click or drag puzzle pieces, path lines, or blocks.</li>
                <li><strong className="text-white">Arrow Keys / WASD:</strong> Slide tiles in Sliding Tile & Match-Merge modes.</li>
                <li><strong className="text-white">Escape (Esc):</strong> Pause the active puzzle or close modals.</li>
                <li><strong className="text-white">Enter / Space:</strong> Confirm selections and start buttons.</li>
              </ul>
            </div>

            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400">
                <Smartphone className="w-5 h-5" />
                <h2 className="text-sm font-black text-white">Mobile Touch Controls</h2>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li><strong className="text-white">Tap:</strong> Select tiles, options, and trigger buttons.</li>
                <li><strong className="text-white">Swipe:</strong> Swipe horizontally or vertically to slide tiles.</li>
                <li><strong className="text-white">Drag & Connect:</strong> Press down on a colored node and drag across the screen to draw circuits.</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
