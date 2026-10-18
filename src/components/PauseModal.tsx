import React from 'react';
import { Play, RotateCcw, Volume2, VolumeX, BookOpen, X } from 'lucide-react';
import { soundFX } from '../audio/soundFX';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 select-none">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-6 text-slate-200 shadow-2xl text-center space-y-4">
        <h3 className="text-xl font-black text-slate-100 tracking-tight">
          SIMULATION PAUSED
        </h3>
        <p className="text-xs text-slate-400">
          The ecological state clock is paused. Review your strategy or adjust settings.
        </p>

        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              soundFX.playClick();
              onResume();
            }}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Resume Simulation (Esc)</span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              onToggleMute();
            }}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>{isMuted ? 'Unmute Audio' : 'Mute Audio'}</span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              onRestart();
            }}
            className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-800 text-rose-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Mission from Year 1</span>
          </button>
        </div>
      </div>
    </div>
  );
};
