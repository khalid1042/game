import React from 'react';
import { Volume2, VolumeX, Pause, Play, Flame, Trees, HeartHandshake, DollarSign, Layers } from 'lucide-react';
import { WorldIndicators } from '../simulation/types';
import { soundFX } from '../audio/soundFX';

interface TopStatusBarProps {
  simulationYear: number;
  turnNumber: number;
  maxTurns: number;
  indicators: WorldIndicators;
  isMuted: boolean;
  onToggleMute: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  activeLayer: 'standard' | 'firms' | 'ndvi' | 'hydrology' | 'indigenous';
  onChangeLayer: (layer: 'standard' | 'firms' | 'ndvi' | 'hydrology' | 'indigenous') => void;
}

export const TopStatusBar: React.FC<TopStatusBarProps> = ({
  simulationYear,
  turnNumber,
  maxTurns,
  indicators,
  isMuted,
  onToggleMute,
  isPaused,
  onTogglePause,
  activeLayer,
  onChangeLayer,
}) => {
  return (
    <header className="relative z-20 w-full px-4 py-2.5 text-slate-200 select-none bg-slate-950/75 border-b border-emerald-950/80 pointer-events-auto">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left cluster: Mission badge & Year / Turn */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="font-bold text-sm tracking-wide text-slate-100 hidden sm:inline">
              PLANET REPAIR SHOP
            </span>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono">
            <span className="text-emerald-400 font-semibold">{simulationYear}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">Turn {turnNumber}/{maxTurns}</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/50 border border-emerald-600/40 text-xs font-mono">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300">Budget:</span>
            <span className="font-bold text-emerald-300 tabular-nums">{indicators.availableBudget} FRU</span>
          </div>
        </div>

        {/* Center: Key Headline Indicators with Tabular Nums */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-medium">
          {/* Forest */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/80 border border-slate-800/80">
            <Trees className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Canopy:</span>
            <span className="font-mono font-bold text-emerald-300 tabular-nums">
              {Math.round(indicators.forestCondition)}
            </span>
            <span className="text-slate-500 text-[10px]">/100</span>
          </div>

          {/* Biodiversity */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/80 border border-slate-800/80">
            <span className="text-xs">🐾</span>
            <span className="text-slate-400">Bio:</span>
            <span className="font-mono font-bold text-emerald-300 tabular-nums">
              {Math.round(indicators.biodiversityCondition)}
            </span>
            <span className="text-slate-500 text-[10px]">/100</span>
          </div>

          {/* Community */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/80 border border-slate-800/80">
            <HeartHandshake className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-400">Social:</span>
            <span className="font-mono font-bold text-sky-300 tabular-nums">
              {Math.round(indicators.communityWellbeing)}
            </span>
            <span className="text-slate-500 text-[10px]">/100</span>
          </div>

          {/* Fire Risk */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded border ${
            indicators.fireRisk > 60
              ? 'bg-rose-950/60 border-rose-500/50 text-rose-300'
              : 'bg-slate-900/80 border-slate-800/80 text-slate-300'
          }`}>
            <Flame className={`w-3.5 h-3.5 ${indicators.fireRisk > 60 ? 'text-rose-400' : 'text-amber-400'}`} />
            <span className="text-slate-400">Fire Hazard:</span>
            <span className="font-mono font-bold tabular-nums">
              {Math.round(indicators.fireRisk)}
            </span>
          </div>
        </div>

        {/* Right cluster: Map Layer selector & sound/pause buttons */}
        <div className="flex items-center gap-2">
          {/* Layer Selector */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <button
              onClick={() => {
                soundFX.playClick();
                onChangeLayer('standard');
              }}
              className={`px-2 py-1 rounded transition-colors ${
                activeLayer === 'standard' ? 'bg-emerald-600 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3D Biosphere
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                onChangeLayer('firms');
              }}
              className={`px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                activeLayer === 'firms' ? 'bg-rose-600 text-slate-100 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-3 h-3 text-rose-300" />
              FIRMS
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                onChangeLayer('ndvi');
              }}
              className={`px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                activeLayer === 'ndvi' ? 'bg-teal-600 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3 h-3" />
              NDVI
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              soundFX.playClick();
              onToggleMute();
            }}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            title={isMuted ? 'Unmute procedural audio' : 'Mute audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Pause Toggle */}
          <button
            onClick={() => {
              soundFX.playClick();
              onTogglePause();
            }}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            title={isPaused ? 'Resume Game' : 'Pause Game'}
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
