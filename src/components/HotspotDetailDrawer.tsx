import React from 'react';
import { X, Satellite, Radio, ExternalLink } from 'lucide-react';
import { BIOME_HOTSPOTS } from './BiomeCanvas3D';
import { soundFX } from '../audio/soundFX';

interface HotspotDetailDrawerProps {
  hotspotId: string;
  onClose: () => void;
  onDirectAction?: (actionId: string) => void;
}

export const HotspotDetailDrawer: React.FC<HotspotDetailDrawerProps> = ({
  hotspotId,
  onClose,
  onDirectAction,
}) => {
  const spot = BIOME_HOTSPOTS.find(h => h.id === hotspotId);
  if (!spot) return null;

  return (
    <div className="fixed z-40 top-16 right-4 w-96 max-w-[90vw] p-4 rounded-2xl bg-slate-950/95 border border-slate-800 shadow-2xl text-slate-200 select-none animate-in fade-in slide-in-from-right duration-200">
      <div className="flex items-start justify-between pb-2 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
            {spot.category}
          </span>
          <h4 className="text-sm font-bold text-slate-100">
            {spot.name}
          </h4>
        </div>
        <button
          onClick={() => {
            soundFX.playClick();
            onClose();
          }}
          className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="py-3 space-y-2.5 text-xs">
        <p className="text-slate-300 leading-relaxed">
          {spot.description}
        </p>

        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1 font-mono">
          <div className="flex items-center gap-1.5 text-sky-400 text-[11px] font-bold">
            <Satellite className="w-3.5 h-3.5" />
            <span>Satellite Observation Feed:</span>
          </div>
          <p className="text-[11px] text-slate-300">{spot.satelliteData}</p>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1 font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-bold">
            <Radio className="w-3.5 h-3.5" />
            <span>Ground Telemetry Reality:</span>
          </div>
          <p className="text-[11px] text-slate-300">{spot.groundStatus}</p>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
        <span className="text-[10px] font-mono text-slate-500">
          Coords: {spot.position[0].toFixed(1)}°E, {spot.position[2].toFixed(1)}°N
        </span>
        <button
          onClick={() => {
            soundFX.playClick();
            onClose();
          }}
          className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
