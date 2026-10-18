import React from 'react';
import { Award, RotateCcw, Scale, Sprout, ShieldAlert, Skull, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { EndingEvaluation, WorldState } from '../simulation/types';
import { soundFX } from '../audio/soundFX';

interface EndingModalProps {
  ending: EndingEvaluation;
  worldState: WorldState;
  onRestart: () => void;
}

export const EndingModal: React.FC<EndingModalProps> = ({
  ending,
  worldState,
  onRestart,
}) => {
  const handleRestart = () => {
    soundFX.playStartMission();
    onRestart();
  };

  const getBadgeIcon = () => {
    switch (ending.category) {
      case 'mastery':
        return <Award className="w-10 h-10 text-amber-400" />;
      case 'balanced':
        return <Scale className="w-10 h-10 text-emerald-400" />;
      case 'triumph':
        return <Sprout className="w-10 h-10 text-teal-400" />;
      case 'fragile':
        return <ShieldAlert className="w-10 h-10 text-sky-400" />;
      case 'collapse':
      default:
        return <Skull className="w-10 h-10 text-rose-400" />;
    }
  };

  const getBorderColor = () => {
    switch (ending.category) {
      case 'mastery':
        return 'border-amber-500/60 bg-amber-950/20';
      case 'balanced':
        return 'border-emerald-500/60 bg-emerald-950/20';
      case 'triumph':
        return 'border-teal-500/60 bg-teal-950/20';
      case 'fragile':
        return 'border-sky-500/60 bg-sky-950/20';
      case 'collapse':
      default:
        return 'border-rose-500/60 bg-rose-950/20';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 select-none">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-6 md:p-8 text-slate-200 shadow-2xl overflow-y-auto max-h-[92vh] space-y-6">
        {/* Top Ending Lockup */}
        <div className={`p-6 rounded-2xl border ${getBorderColor()} flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left`}>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 shrink-0">
            {getBadgeIcon()}
          </div>
          <div>
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Mission 001 Concluded · 10-Year Trajectory Evaluation
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight">
              {ending.title}
            </h2>
            <p className="text-sm font-medium text-emerald-300 mt-1">
              "{ending.tagline}"
            </p>
          </div>
        </div>

        {/* Narrative Description */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-sm text-slate-300 leading-relaxed">
          <p>{ending.description}</p>
        </div>

        {/* Final Indicator Scorecard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Forest Canopy</span>
            <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
              {Math.round(worldState.indicators.forestCondition)}/100
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Biodiversity</span>
            <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
              {Math.round(worldState.indicators.biodiversityCondition)}/100
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Community Well-Being</span>
            <span className="text-xl font-bold font-mono text-sky-400 tabular-nums">
              {Math.round(worldState.indicators.communityWellbeing)}/100
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Economic Stability</span>
            <span className="text-xl font-bold font-mono text-amber-400 tabular-nums">
              {Math.round(worldState.indicators.localEconomicStability)}/100
            </span>
          </div>
        </div>

        {/* Key Drivers & Unresolved Dilemmas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Decisive Trajectory Drivers
            </h4>
            <ul className="space-y-1.5 pl-4 list-disc text-slate-300 leading-relaxed">
              {ending.keyDrivers.map((driver, i) => (
                <li key={i}>{driver}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Unresolved Long-Term Dilemmas
            </h4>
            <ul className="space-y-1.5 pl-4 list-disc text-slate-300 leading-relaxed">
              {ending.unresolvedDilemmas.map((dil, i) => (
                <li key={i}>{dil}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Scientific Critique */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs text-slate-400 space-y-1">
          <div className="font-mono text-emerald-400 text-[10px] uppercase tracking-wider font-semibold">
            Scientific Context & Empirical Reflection:
          </div>
          <p className="italic leading-relaxed">{ending.scientificCritique}</p>
        </div>

        {/* Replay CTA */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-400">
            No single "correct" answer exists. Every strategy reveals alternate trade-offs.
          </span>

          <button
            onClick={handleRestart}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay with a Different Strategy</span>
          </button>
        </div>
      </div>
    </div>
  );
};
