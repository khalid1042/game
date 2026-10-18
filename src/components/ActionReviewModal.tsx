import React, { useState } from 'react';
import { Sparkles, DollarSign, AlertCircle, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { InterpretedProposal } from '../simulation/types';
import { SUPPORTED_ACTIONS } from '../simulation/catalog';
import { soundFX } from '../audio/soundFX';

interface ActionReviewModalProps {
  proposal: InterpretedProposal;
  availableBudget: number;
  onConfirm: (actions: Array<{ actionId: string; intensity: number; customNote?: string }>) => void;
  onCancel: () => void;
}

export const ActionReviewModal: React.FC<ActionReviewModalProps> = ({
  proposal,
  availableBudget,
  onConfirm,
  onCancel,
}) => {
  const [actionList, setActionList] = useState(proposal.actions);

  // Compute total cost
  const totalCost = actionList.reduce((sum, item) => {
    const def = SUPPORTED_ACTIONS.find(a => a.id === item.actionId);
    if (!def) return sum;
    return sum + Math.round(def.cost * item.intensity);
  }, 0);

  const isAffordable = totalCost <= availableBudget;

  const handleIntensityChange = (index: number, newIntensity: number) => {
    const updated = [...actionList];
    updated[index] = { ...updated[index], intensity: newIntensity };
    setActionList(updated);
  };

  const handleRemoveAction = (index: number) => {
    soundFX.playClick();
    const updated = actionList.filter((_, i) => i !== index);
    setActionList(updated);
  };

  const handleCommit = () => {
    soundFX.playClick();
    onConfirm(actionList);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 select-none">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 text-slate-200 shadow-2xl overflow-y-auto max-h-[90vh] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">
              AI Action Interpretation & Validation
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Executive Summary */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center justify-between">
            <span>Interpreted Plan Overview</span>
            <span className="text-slate-500 font-mono text-[10px]">
              Engine: {proposal.source === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'Semantic Fallback Engine'}
            </span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            "{proposal.summary}"
          </p>
        </div>

        {/* Ambiguity or Clarifying Question */}
        {proposal.clarificationQuestion && (
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-600/40 text-xs text-amber-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Clarification Notice: </span>
              {proposal.clarificationQuestion}
            </div>
          </div>
        )}

        {/* Mapped Supported Actions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Mapped Supported Interventions ({actionList.length})</span>
            <span className="font-mono">
              Total Cost: <span className={isAffordable ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{totalCost} FRU</span>
              <span className="text-slate-500"> / {availableBudget} FRU Available</span>
            </span>
          </div>

          {actionList.length === 0 ? (
            <div className="p-4 text-center text-xs text-rose-300 rounded-lg bg-rose-950/30 border border-rose-800/40">
              No supported actions could be extracted from this proposal. Please revise or choose actions directly from the Catalog.
            </div>
          ) : (
            <div className="space-y-2">
              {actionList.map((item, idx) => {
                const def = SUPPORTED_ACTIONS.find(a => a.id === item.actionId);
                if (!def) return null;
                const cost = Math.round(def.cost * item.intensity);

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100">{def.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {cost} FRU
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.customNote || def.shortDescription}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-400">Scale:</span>
                        <input
                          type="range"
                          min="0.3"
                          max="1.0"
                          step="0.1"
                          value={item.intensity}
                          onChange={(e) => handleIntensityChange(idx, parseFloat(e.target.value))}
                          className="w-20 accent-emerald-500"
                        />
                        <span className="font-mono font-bold text-slate-200 w-8 text-right">
                          {Math.round(item.intensity * 100)}%
                        </span>
                      </div>

                      <button
                        onClick={() => handleRemoveAction(idx)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/50 transition-colors"
                        title="Remove action"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Stated Assumptions & Unsupported Parts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="font-bold text-slate-300 block mb-1">Underlying Assumptions:</span>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-400 text-[11px]">
              {proposal.assumptions.length > 0 ? (
                proposal.assumptions.map((asm, i) => <li key={i}>{asm}</li>)
              ) : (
                <li>Baseline community consent and local authority access assumed.</li>
              )}
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="font-bold text-slate-300 block mb-1">Outside Simulation Scope:</span>
            {proposal.unsupportedParts.length > 0 ? (
              <ul className="list-disc pl-4 space-y-0.5 text-slate-400 text-[11px]">
                {proposal.unsupportedParts.map((un, i) => <li key={i}>{un}</li>)}
              </ul>
            ) : (
              <span className="text-[11px] text-emerald-400/80">All proposed elements map directly to supported models.</span>
            )}
          </div>
        </div>

        {/* Budget Warning if Over */}
        {!isAffordable && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-600/50 text-xs text-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              Insufficient Budget: Plan exceeds available resources by {totalCost - availableBudget} FRU. Reduce scale intensity or remove an action.
            </span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Edit Proposal
          </button>

          <button
            onClick={handleCommit}
            disabled={!isAffordable || actionList.length === 0}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Advance Simulation ({totalCost} FRU)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
