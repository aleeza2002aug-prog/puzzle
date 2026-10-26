import React from 'react';
import { GameState, ThemeId } from '../../types/game';
import { THEMES } from '../../utils/storage';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Palette,
  Eye,
  Sliders,
  RotateCcw,
  Check,
} from 'lucide-react';
import { sound } from '../../utils/sound';

interface Props {
  gameState: GameState;
  onUpdateSettings: (newSettings: GameState['settings']) => void;
  onResetProgress: () => void;
  onBack: () => void;
}

export const SettingsScreen: React.FC<Props> = ({
  gameState,
  onUpdateSettings,
  onResetProgress,
  onBack,
}) => {
  const { settings } = gameState;

  const handleMuteToggle = () => {
    const nextMuted = !settings.soundMuted;
    const updated = { ...settings, soundMuted: nextMuted };
    onUpdateSettings(updated);
    sound.updateVolumes(updated.sfxVolume, updated.musicVolume, updated.soundMuted);
    if (!nextMuted) sound.playTileClick();
  };

  const handleSfxChange = (val: number) => {
    const updated = { ...settings, sfxVolume: val };
    onUpdateSettings(updated);
    sound.updateVolumes(updated.sfxVolume, updated.musicVolume, updated.soundMuted);
    sound.playTileClick();
  };

  const handleMusicChange = (val: number) => {
    const updated = { ...settings, musicVolume: val };
    onUpdateSettings(updated);
    sound.updateVolumes(updated.sfxVolume, updated.musicVolume, updated.soundMuted);
  };

  const handleThemeChange = (themeId: ThemeId) => {
    sound.playTileClick();
    onUpdateSettings({ ...settings, theme: themeId });
  };

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

        <h1 className="text-lg font-black text-white">Settings</h1>

        <div className="w-16" />
      </header>

      <div className="space-y-5 pb-8">
        {/* Themes Selector */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4 text-indigo-400" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-200">
              Visual Theme
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {(Object.keys(THEMES) as ThemeId[]).map((themeKey) => {
              const th = THEMES[themeKey];
              const isSelected = settings.theme === themeKey;

              return (
                <button
                  key={themeKey}
                  type="button"
                  onClick={() => handleThemeChange(themeKey)}
                  className={`p-3 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-400 bg-indigo-600/20 text-white shadow-md'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold">{th.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                </button>
              );
            })}
          </div>
        </section>

        {/* Audio Controls */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-200">
                Audio & Sound
              </h2>
            </div>

            <button
              type="button"
              onClick={handleMuteToggle}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                settings.soundMuted
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              }`}
            >
              {settings.soundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{settings.soundMuted ? 'Muted' : 'Enabled'}</span>
            </button>
          </div>

          {/* SFX Volume */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-400">
              <span>Sound Effects</span>
              <span className="font-mono text-slate-200">
                {Math.round(settings.sfxVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.sfxVolume}
              disabled={settings.soundMuted}
              onChange={(e) => handleSfxChange(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Music Volume */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-400">
              <span>Ambient Relaxing Music</span>
              <span className="font-mono text-slate-200">
                {Math.round(settings.musicVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.musicVolume}
              disabled={settings.soundMuted}
              onChange={(e) => handleMusicChange(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </section>

        {/* Accessibility */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-4 h-4 text-indigo-400" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-200">
              Accessibility
            </h2>
          </div>

          <label className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/60 border border-slate-850 cursor-pointer">
            <div>
              <div className="text-xs font-bold text-slate-200">Color-Blind Assist Indicators</div>
              <div className="text-[10px] text-slate-400">
                Adds distinct alphanumeric symbols and geometric labels to colored elements
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.colorBlindAssist}
              onChange={(e) =>
                onUpdateSettings({ ...settings, colorBlindAssist: e.target.checked })
              }
              className="w-5 h-5 accent-indigo-500 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/60 border border-slate-850 cursor-pointer">
            <div>
              <div className="text-xs font-bold text-slate-200">Reduced Motion</div>
              <div className="text-[10px] text-slate-400">
                Reduces intensive animations and particle transitions
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) =>
                onUpdateSettings({ ...settings, reducedMotion: e.target.checked })
              }
              className="w-5 h-5 accent-indigo-500 rounded cursor-pointer"
            />
          </label>
        </section>

        {/* Reset Progress */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all game levels and stars progress?')) {
                onResetProgress();
              }
            }}
            className="w-full py-3 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Progress & Save Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
