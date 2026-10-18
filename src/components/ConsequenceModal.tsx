import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  AlertTriangle,
  Clock,
  ArrowRight,
  Info,
  CheckCircle2,
  Shield,
  Layers,
} from 'lucide-react';
import { ConsequenceReport } from '../simulation/types';
import { INDICATOR_METADATA } from '../simulation/catalog';
import { soundFX } from '../audio/soundFX';

interface ConsequenceModalProps {
  report: ConsequenceReport;
  onContinue: () => void;
}

export const ConsequenceModal: React.FC<ConsequenceModalProps> = ({
  report,
  onContinue,
}) => {
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  const handleContinue = () => {
    soundFX.playClick();
    onContinue();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 select-none">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 text-slate-200 shadow-2xl overflow-y-auto max-h-[92vh] space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                Year {report.year} (Turn {report.turn})
              </span>
              <h3 className="text-base font-bold text-slate-100">
                Consequence & System Feedback Report
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Actions Applied: {report.actionsApplied.map(a => `${a.name} (${a.cost} FRU)`).join(', ') || 'No direct action'} · Remaining Budget: {report.budgetRemaining} FRU
            </p>
          </div>

          <button
            onClick={handleContinue}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-950 shrink-0"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Emergent Event Banner if triggered */}
        {report.activeEvents.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-950/50 border border-amber-600/50 text-amber-200 space-y-2">
            {report.activeEvents.map((evt) => (
              <div key={evt.id} className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>EMERGENT EVENT: {evt.title}</span>
                </div>
                <p className="text-xs text-amber-200 leading-relaxed">
                  {evt.description}
                </p>
                <div className="text-[11px] font-mono text-amber-300/80">
                  <span className="font-semibold">Trigger Condition: </span>
                  {evt.triggerReason}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 1. What Changed? (Indicator Deltas) */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Indicator Deltas This Turn</span>
            <span className="text-[11px] text-slate-400 normal-case font-normal">
              Green = Favorable · Red = Pressure / Hazard
            </span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {report.indicatorChanges.slice(0, 9).map((change) => {
              const meta = INDICATOR_METADATA[change.key];
              const isGood = meta.goodDirection === 'higher' ? change.delta > 0 : change.delta < 0;

              return (
                <div
                  key={change.key}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-xs font-semibold text-slate-200 truncate">
                      {change.label}
                    </span>
                    <span className={`text-xs font-mono font-bold flex items-center gap-0.5 shrink-0 ${
                      isGood ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {change.delta > 0 ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5" />
                      )}
                      <span>{change.delta > 0 ? `+${change.delta}` : change.delta}</span>
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between text-[11px] text-slate-400 font-mono">
                    <span>{change.previousValue} → {change.newValue} {change.unit}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {change.evidenceType}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-tight">
                    {change.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Modeled Benefits & Trade-Offs (Dual Column) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Benefits */}
          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 space-y-2">
            <h5 className="font-bold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Modeled System Benefits
            </h5>
            <ul className="space-y-1 pl-4 list-disc text-slate-300 leading-relaxed text-[11px]">
              {report.benefits.length > 0 ? (
                report.benefits.map((b, i) => <li key={i}>{b}</li>)
              ) : (
                <li>Incremental natural ecological stabilization.</li>
              )}
            </ul>
          </div>

          {/* Trade-Offs & Unintended Consequences */}
          <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/40 space-y-2">
            <h5 className="font-bold text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Trade-Offs & Unintended Risks
            </h5>
            <ul className="space-y-1 pl-4 list-disc text-slate-300 leading-relaxed text-[11px]">
              {report.tradeOffs.length > 0 ? (
                report.tradeOffs.map((t, i) => <li key={i}>{t}</li>)
              ) : (
                <li>Opportunity costs of restricted capital allocation.</li>
              )}
            </ul>
          </div>
        </div>

        {/* 3. Delayed Effects in Pipeline */}
        {report.delayedConsequences.length > 0 && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
            <div className="font-bold text-sky-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-400" />
              Delayed Ecosystem Time-Horizon
            </div>
            <ul className="space-y-1 pl-4 list-disc text-slate-300 text-[11px] leading-relaxed">
              {report.delayedConsequences.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 4. Transparent Simulation Rules Toggle */}
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={() => setShowFormulaDetails(!showFormulaDetails)}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-mono transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-emerald-400" />
            <span>{showFormulaDetails ? 'Hide' : 'Inspect'} Simulation Mechanics & Formulas</span>
          </button>

          {showFormulaDetails && (
            <div className="mt-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 space-y-1.5 leading-relaxed">
              <div className="text-emerald-400 font-bold uppercase text-[10px]">Deterministic Rule Execution:</div>
              <div>• Budget Check: upfront capital deducted; maintenance costs capped at 4 FRU/turn.</div>
              <div>• Immediate Effects: scaled linearly by action intensity [0.2 – 1.0].</div>
              <div>• Delayed Effects: queued in multi-turn array, resolving as saplings mature into canopy.</div>
              <div>• Climate Feedbacks: Drought stress &gt; 50 amplifies Fire Risk (+2/yr) and erodes Water Baseflow (-1.5/yr).</div>
              <div>• Ecological Synergy: Intact Canopy &gt; 65 recharges Water Security (+2/yr) and moderates Fire Risk (-3/yr).</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            Next Turn: Year {report.year + 1}
          </span>
          <button
            onClick={handleContinue}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950 transition-colors"
          >
            <span>Proceed to Next Year</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
