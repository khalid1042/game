import React, { useState } from 'react';
import {
  Sparkles,
  BarChart3,
  BookOpen,
  Satellite,
  History,
  ChevronDown,
  ChevronUp,
  Send,
  Plus,
  Trash2,
  ExternalLink,
  Info,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Shield,
  Sprout,
} from 'lucide-react';
import { WorldIndicators, WorldState, InterpretedAction } from '../simulation/types';
import { INDICATOR_METADATA, SUPPORTED_ACTIONS } from '../simulation/catalog';
import { RESEARCH_JOURNAL, getHintGuidance } from '../simulation/research';
import { NASA_DATA_LAYERS } from '../simulation/nasaData';
import { soundFX } from '../audio/soundFX';

interface BottomDockProps {
  worldState: WorldState;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSubmitProposal: (proposalText: string) => Promise<void>;
  isAnalyzing: boolean;
  onSelectActionDirect: (actionId: string) => void;
  selectedHotspotId: string | null;
  onSelectHotspot: (id: string | null) => void;
}

type DockTab = 'propose' | 'indicators' | 'catalog' | 'journal' | 'nasa' | 'history';

export const BottomDock: React.FC<BottomDockProps> = ({
  worldState,
  isCollapsed,
  onToggleCollapse,
  onSubmitProposal,
  isAnalyzing,
  onSelectActionDirect,
  selectedHotspotId,
  onSelectHotspot,
}) => {
  const [activeTab, setActiveTab] = useState<DockTab>('propose');
  const [proposalInput, setProposalInput] = useState('');
  const [hintMode, setHintMode] = useState<'Explorer' | 'Researcher' | 'Strategist'>('Researcher');
  const [journalFilter, setJournalFilter] = useState<string>('all');
  const [advisorQuestion, setAdvisorQuestion] = useState('');
  const [advisorAnswer, setAdvisorAnswer] = useState<string | null>(null);
  const [isAskingAdvisor, setIsAskingAdvisor] = useState(false);

  // Example open-ended proposals players can click to try
  const exampleProposals = [
    'Enforce reserve borders with satellite patrols and fund açaí processing cooperatives',
    'Plant native hardwood corridors along the Tapajós riverbanks and train volunteer fire brigades',
    'Recognize Indigenous territorial titles and transition cattle pasture into syntropic agroforestry',
    'Deploy eddy-covariance carbon flux towers and fund non-timber forest bio-economy jobs',
  ];

  const handleSendProposal = async () => {
    if (!proposalInput.trim() || isAnalyzing) return;
    soundFX.playClick();
    await onSubmitProposal(proposalInput.trim());
  };

  const handleConsultAdvisor = async () => {
    if (isAskingAdvisor) return;
    setIsAskingAdvisor(true);
    soundFX.playClick();
    try {
      const res = await fetch('/api/consult-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: hintMode,
          question: advisorQuestion || 'What intervention package is optimal given our current budget?',
          stateContext: worldState.indicators,
        }),
      });
      const data = await res.json();
      setAdvisorAnswer(data.answer);
    } catch (err) {
      setAdvisorAnswer('Research demonstrates that multi-species native corridors linked with legal land tenure provide the most durable resilience (Brancalion et al., 2019).');
    } finally {
      setIsAskingAdvisor(false);
    }
  };

  const currentHints = getHintGuidance(hintMode, worldState.indicators, worldState.turnNumber);

  return (
    <div
      className={`fixed z-30 left-1/2 -translate-x-1/2 w-[94vw] max-w-[940px] transition-all duration-300 ease-out select-none pointer-events-auto ${
        isCollapsed ? 'bottom-0 translate-y-[calc(100%-38px)]' : 'bottom-3 translate-y-0'
      }`}
    >
      {/* Dock Container */}
      <div className="relative rounded-2xl bg-slate-950/95 border border-slate-800 shadow-[0_12px_45px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col">
        {/* Dock Top Handle / Collapse Bar */}
        <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900/90 border-b border-slate-800 text-xs">
          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => {
                soundFX.playClick();
                setActiveTab('propose');
                if (isCollapsed) onToggleCollapse();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                activeTab === 'propose'
                  ? 'bg-emerald-600 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Propose Action
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                setActiveTab('indicators');
                if (isCollapsed) onToggleCollapse();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                activeTab === 'indicators'
                  ? 'bg-emerald-600 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Indicators
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                setActiveTab('catalog');
                if (isCollapsed) onToggleCollapse();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                activeTab === 'catalog'
                  ? 'bg-emerald-600 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              Supported Catalog
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                setActiveTab('journal');
                if (isCollapsed) onToggleCollapse();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                activeTab === 'journal'
                  ? 'bg-emerald-600 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Researcher's Journal
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                setActiveTab('nasa');
                if (isCollapsed) onToggleCollapse();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                activeTab === 'nasa'
                  ? 'bg-sky-600 text-slate-100 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Satellite className="w-3.5 h-3.5 text-sky-400" />
              NASA Earth Data
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                setActiveTab('history');
                if (isCollapsed) onToggleCollapse();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                activeTab === 'history'
                  ? 'bg-emerald-600 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Timeline ({worldState.actionHistory.length})
            </button>
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => {
              soundFX.playClick();
              onToggleCollapse();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors shrink-0 ml-2 font-mono text-[11px]"
            title={isCollapsed ? 'Expand dock (H)' : 'Collapse dock (H)'}
          >
            {isCollapsed ? (
              <>
                <span>▴ Show Dock</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>▾ Hide Dock</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Tab Content Body (hidden when collapsed) */}
        {!isCollapsed && (
          <div className="p-4 max-h-[360px] overflow-y-auto text-slate-200">
            {/* 1. PROPOSE ACTION TAB */}
            {activeTab === 'propose' && (
              <div className="space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      Propose Your Environmental Strategy (Free Text)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Enter any intervention in your own words. Gemini maps your plan into verified simulation actions without fabricating outcomes.
                    </p>
                  </div>

                  <div className="text-xs font-mono px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 self-start sm:self-auto">
                    Budget Available: <span className="text-emerald-400 font-bold">{worldState.indicators.availableBudget} FRU</span>
                  </div>
                </div>

                {/* Input area */}
                <div className="relative">
                  <textarea
                    value={proposalInput}
                    onChange={(e) => setProposalInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        handleSendProposal();
                      }
                    }}
                    placeholder="Describe your plan... e.g. 'Deploy satellite alerts with ranger patrols, establish native seedling corridors along the river, and fund açaí processing cooperatives for families.'"
                    rows={3}
                    className="w-full p-3 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-100 placeholder:text-slate-500 resize-none outline-none"
                  />
                  <div className="absolute right-3 bottom-3 flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                      Ctrl + Enter to Submit
                    </span>
                    <button
                      onClick={handleSendProposal}
                      disabled={!proposalInput.trim() || isAnalyzing}
                      className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-950"
                    >
                      {isAnalyzing ? (
                        <>
                          <span className="animate-spin text-xs">⏳</span>
                          <span>Interpreting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Analyze & Review</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Sample Idea Chips */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Suggested Strategy Inspirations:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {exampleProposals.map((ex, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          soundFX.playClick();
                          setProposalInput(ex);
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-600/50 text-slate-300 text-left transition-colors"
                      >
                        "{ex}"
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. INDICATORS & SYSTEMS TAB */}
            {activeTab === 'indicators' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-emerald-400">
                    Comprehensive Biosphere & Socio-Economic Indicators (0–100)
                  </h3>
                  <span className="text-xs text-slate-400">
                    Calibrated illustrative game values grounded in Amazonian ecological thresholds
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {Object.entries(INDICATOR_METADATA).map(([key, meta]) => {
                    const val = worldState.indicators[key as keyof WorldIndicators];
                    const baseline = worldState.baselineIndicators[key as keyof WorldIndicators];
                    const delta = Math.round((val - baseline) * 10) / 10;
                    const isGood = meta.goodDirection === 'higher' ? delta >= 0 : delta <= 0;

                    return (
                      <div
                        key={key}
                        className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <span className="text-xs font-semibold text-slate-200 leading-tight">
                              {meta.label}
                            </span>
                            <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                              delta === 0
                                ? 'bg-slate-800 text-slate-400'
                                : isGood
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                                : 'bg-rose-950 text-rose-400 border border-rose-800/50'
                            }`}>
                              {delta > 0 ? `+${delta}` : delta}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-tight line-clamp-2 mb-2">
                            {meta.description}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-baseline justify-between text-xs font-mono mb-1">
                            <span className="text-slate-400">Current</span>
                            <span className="font-bold text-slate-100 text-sm tabular-nums">
                              {Math.round(val)} {meta.unit}
                            </span>
                          </div>
                          {/* Progress bar */}
                          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                meta.category === 'environment'
                                  ? 'bg-emerald-500'
                                  : meta.category === 'society'
                                  ? 'bg-sky-500'
                                  : meta.category === 'economy'
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.min(100, Math.max(0, val))}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. SUPPORTED CATALOG TAB */}
            {activeTab === 'catalog' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-emerald-400">
                      Supported Restoration & Governance Actions
                    </h3>
                    <p className="text-xs text-slate-400">
                      Each action is backed by transparent deterministic formulas and peer-reviewed literature.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    8 Supported Interventions
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SUPPORTED_ACTIONS.map((action) => (
                    <div
                      key={action.id}
                      className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h4 className="text-xs font-bold text-slate-100">
                            {action.name}
                          </h4>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 shrink-0">
                            {action.cost} FRU
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed mb-2">
                          {action.shortDescription}
                        </p>

                        <div className="text-[11px] text-slate-400 mb-2">
                          <span className="font-semibold text-slate-300">Citation: </span>
                          <span className="italic">{action.citation}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-emerald-400/80">
                          {action.evidenceStatus.toUpperCase()}
                        </span>
                        <button
                          onClick={() => {
                            soundFX.playClick();
                            onSelectActionDirect(action.id);
                          }}
                          className="px-3 py-1 rounded bg-slate-800 hover:bg-emerald-600 hover:text-slate-950 text-xs font-semibold text-slate-200 flex items-center gap-1 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          Add to Plan
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. RESEARCHER'S JOURNAL TAB */}
            {activeTab === 'journal' && (
              <div className="space-y-4">
                {/* Mode Selector */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-300">Advisory Mode:</span>
                    <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                      {(['Explorer', 'Researcher', 'Strategist'] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => {
                            soundFX.playClick();
                            setHintMode(m);
                          }}
                          className={`px-2.5 py-1 rounded-md transition-colors ${
                            hintMode === m
                              ? 'bg-emerald-600 text-slate-950 font-bold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <span className="text-xs text-slate-400 hidden sm:inline">
                    {hintMode === 'Explorer' && 'Asks thought-provoking questions to spark discovery.'}
                    {hintMode === 'Researcher' && 'Summarizes documented empirical findings and field trials.'}
                    {hintMode === 'Strategist' && 'Provides tactical trade-off analysis tailored to your current budget.'}
                  </span>
                </div>

                {/* Active Mode Dynamic Hints */}
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-slate-200 space-y-2">
                  <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-emerald-400" />
                    {currentHints.prompt}
                  </div>
                  <ul className="space-y-1 pl-5 list-disc text-slate-300 leading-relaxed">
                    {currentHints.points.map((pt, idx) => (
                      <li key={idx}>{pt}</li>
                    ))}
                  </ul>
                </div>

                {/* Scientific Advisor Query Box */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
                  <h4 className="text-xs font-bold text-sky-400">
                    Ask the Scientific Advisor ({hintMode} Perspective)
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={advisorQuestion}
                      onChange={(e) => setAdvisorQuestion(e.target.value)}
                      placeholder="e.g. 'What are the main risks of relying only on forest protection without agroforestry?'"
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-sky-500"
                    />
                    <button
                      onClick={handleConsultAdvisor}
                      disabled={isAskingAdvisor}
                      className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 text-xs font-bold text-slate-100 shrink-0 flex items-center gap-1"
                    >
                      {isAskingAdvisor ? 'Consulting...' : 'Ask Advisor'}
                    </button>
                  </div>

                  {advisorAnswer && (
                    <div className="mt-2 p-3 rounded-lg bg-slate-950 border border-sky-900/40 text-xs text-slate-300 leading-relaxed">
                      <div className="text-[10px] font-mono text-sky-400 uppercase tracking-wider mb-1">
                        Advisor Synthesis:
                      </div>
                      <p>{advisorAnswer}</p>
                    </div>
                  )}
                </div>

                {/* Verified Peer-Reviewed Case Studies */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Sourced Field Case Studies & Literature
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {RESEARCH_JOURNAL.map((study) => (
                      <div
                        key={study.id}
                        className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h5 className="text-xs font-bold text-slate-100">
                              {study.title}
                            </h5>
                            <span className="text-[10px] font-mono text-slate-400 shrink-0">
                              {study.yearPublished}
                            </span>
                          </div>
                          <div className="text-[11px] text-emerald-400 mb-2">
                            {study.authors} · <span className="italic">{study.journal}</span>
                          </div>
                          <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                            {study.coreProblem}
                          </p>

                          <div className="p-2 rounded bg-slate-950 border border-slate-800/80 mb-2 text-[11px] text-slate-300">
                            <span className="font-semibold text-emerald-300">Key Finding: </span>
                            {study.empiricalFindings[0]}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-slate-400 font-mono">
                            {study.location}
                          </span>
                          <a
                            href={study.doiUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold"
                          >
                            View Source <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. NASA EARTH OBSERVATIONS TAB */}
            {activeTab === 'nasa' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-sky-400 flex items-center gap-1.5">
                      <Satellite className="w-4 h-4 text-sky-400" />
                      NASA Earth Observation Telemetry (Tapajós Study Basin)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Real satellite instruments and calibrated environmental baseline observations.
                    </p>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                    Live Telemetry Ready
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {NASA_DATA_LAYERS.map((layer) => (
                    <div
                      key={layer.id}
                      className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1">
                            {layer.name}
                          </h4>
                          <span className="text-[11px] text-sky-400 font-mono">
                            {layer.satelliteMission} ({layer.sensor})
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {layer.resolution}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {layer.description}
                      </p>

                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Current Reading:</span>
                          <span className="font-bold text-emerald-400">{layer.currentObservedValue}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Temporal Coverage:</span>
                          <span className="text-slate-300">{layer.temporalCoverage}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <span className="text-slate-400 truncate max-w-[200px]">
                          {layer.attribution}
                        </span>
                        <a
                          href={layer.dataUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold"
                        >
                          NASA Portal <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. DECISION HISTORY TAB */}
            {activeTab === 'history' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                    <History className="w-4 h-4 text-emerald-400" />
                    Turn-by-Turn Decision & Consequence Log
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    {worldState.actionHistory.length} Turns Completed
                  </span>
                </div>

                {worldState.actionHistory.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 rounded-xl bg-slate-900 border border-slate-800">
                    No actions committed yet. Advance Year 1 to start recording your restoration trajectory.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {worldState.actionHistory.map((item) => (
                      <div
                        key={item.turn}
                        className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                              Year {item.year} (Turn {item.turn})
                            </span>
                            <span className="text-slate-400 font-mono">
                              Cost: {item.spentFRU} FRU
                            </span>
                          </div>

                          <span className="text-[11px] text-slate-400">
                            Canopy: {Math.round(item.indicatorSnapshots.after.forestCondition)}/100
                          </span>
                        </div>

                        <p className="text-xs text-slate-200 italic">
                          "{item.proposalText}"
                        </p>

                        <div className="flex flex-wrap gap-1 text-[11px]">
                          {item.actionsCommitted.map((a, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium"
                            >
                              {a.name} ({a.cost} FRU)
                            </span>
                          ))}
                        </div>

                        {item.eventsTriggered.length > 0 && (
                          <div className="text-[11px] text-amber-400 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-400" />
                            <span>Events: {item.eventsTriggered.map(e => e.title).join(', ')}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
