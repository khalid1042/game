export interface WorldIndicators {
  // Environmental (0-100)
  forestCondition: number;
  biodiversityCondition: number;
  waterSecurity: number;
  soilHealth: number;
  ecosystemResilience: number;

  // Social (0-100)
  communityWellbeing: number;
  foodSecurity: number;
  publicTrust: number;
  displacementRisk: number;

  // Economic & Capacity (0-100 or units)
  localEconomicStability: number;
  jobsAndLivelihoods: number;
  implementationCapacity: number;
  availableBudget: number; // in FRU (Fictional Resource Units, e.g. 50 = $50M equivalent)

  // Climate & Disturbance (0-100)
  fireRisk: number;
  droughtStress: number;
  emissionsPressure: number;
}

export type IndicatorKey = keyof WorldIndicators;

export interface DelayedEffect {
  id: string;
  sourceActionId: string;
  actionName: string;
  turnsRemaining: number;
  effects: Partial<Record<IndicatorKey, number>>;
  description: string;
}

export interface ActiveEvent {
  id: string;
  title: string;
  category: 'climate' | 'social' | 'ecological' | 'economic';
  description: string;
  triggerReason: string;
  effectsApplied: Partial<Record<IndicatorKey, number>>;
  durationTurns: number;
  isDeterministic: boolean;
  scientificReference?: string;
}

export interface ActionDefinition {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  cost: number; // in FRU
  maintenanceCost: number; // annual cost
  category: 'conservation' | 'restoration' | 'agriculture' | 'community' | 'hazard' | 'governance';
  prerequisites?: string[];
  immediateEffects: Partial<Record<IndicatorKey, number>>;
  delayedEffects?: {
    turnsDelay: number;
    effects: Partial<Record<IndicatorKey, number>>;
    description: string;
  };
  risks: string[];
  benefits: string[];
  evidenceStatus: 'documented' | 'simplified-model' | 'hypothetical-outcome';
  uncertaintyNote: string;
  citation: string;
  nasaDataRelevance?: string;
}

export interface InterpretedAction {
  actionId: string;
  intensity: number; // 0.1 to 1.0
  customNote?: string;
}

export interface InterpretedProposal {
  understood: boolean;
  summary: string;
  actions: InterpretedAction[];
  assumptions: string[];
  unsupportedParts: string[];
  clarificationQuestion: string | null;
  source: 'gemini-3.8-flash' | 'local-fallback';
}

export interface TurnHistoryEntry {
  turn: number;
  year: number;
  proposalText: string;
  interpretedSummary: string;
  actionsCommitted: Array<{ id: string; name: string; cost: number; intensity: number }>;
  spentFRU: number;
  indicatorSnapshots: {
    before: WorldIndicators;
    after: WorldIndicators;
  };
  deltaSummary: Record<string, number>;
  eventsTriggered: ActiveEvent[];
  consequenceNotes: {
    benefits: string[];
    tradeOffs: string[];
    delayedQueued: string[];
  };
}

export interface WorldState {
  simulationYear: number; // starts e.g. 2025
  turnNumber: number; // starts 1, max 10-12
  maxTurns: number;
  indicators: WorldIndicators;
  baselineIndicators: WorldIndicators;
  delayedQueue: DelayedEffect[];
  activeEvents: ActiveEvent[];
  eventHistory: ActiveEvent[];
  actionHistory: TurnHistoryEntry[];
  unlockedResearchIds: string[];
  scenarioSeed: number;
  isGameOver: boolean;
  ending: EndingEvaluation | null;
}

export interface IndicatorDelta {
  key: IndicatorKey;
  label: string;
  category: 'environment' | 'society' | 'economy' | 'climate';
  previousValue: number;
  newValue: number;
  delta: number;
  unit?: string;
  explanation: string;
  evidenceType: 'Observed Data' | 'Research Finding' | 'Simplified Simulation' | 'Hypothetical Outcome';
}

export interface ConsequenceReport {
  turn: number;
  year: number;
  actionsApplied: Array<{ name: string; cost: number }>;
  totalCost: number;
  indicatorChanges: IndicatorDelta[];
  benefits: string[];
  tradeOffs: string[];
  delayedConsequences: string[];
  unresolvedRisks: string[];
  activeEvents: ActiveEvent[];
  budgetRemaining: number;
}

export interface EndingEvaluation {
  id: string;
  title: string;
  tagline: string;
  category: 'triumph' | 'balanced' | 'fragile' | 'collapse' | 'mastery';
  badgeIcon: string;
  description: string;
  keyDrivers: string[];
  unresolvedDilemmas: string[];
  scientificCritique: string;
  scorePercentage: number;
}
