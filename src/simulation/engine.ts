import {
  ActionDefinition,
  ActiveEvent,
  ConsequenceReport,
  DelayedEffect,
  IndicatorDelta,
  IndicatorKey,
  InterpretedAction,
  TurnHistoryEntry,
  WorldIndicators,
  WorldState,
} from './types';
import { INITIAL_INDICATORS, INDICATOR_METADATA, SUPPORTED_ACTIONS } from './catalog';
import { checkEmergentEvents } from './events';
import { evaluateEnding } from './endings';

export const MAX_TURNS = 10;
export const START_YEAR = 2025;

export function createInitialWorldState(seed: number = 42): WorldState {
  const clonedInitial: WorldIndicators = { ...INITIAL_INDICATORS };
  return {
    simulationYear: START_YEAR,
    turnNumber: 1,
    maxTurns: MAX_TURNS,
    indicators: clonedInitial,
    baselineIndicators: { ...clonedInitial },
    delayedQueue: [],
    activeEvents: [],
    eventHistory: [],
    actionHistory: [],
    unlockedResearchIds: ['case_barlow_2018', 'case_nepstad_2014'],
    scenarioSeed: seed,
    isGameOver: false,
    ending: null,
  };
}

export interface SimulationStepResult {
  nextState: WorldState;
  report: ConsequenceReport;
  error?: string;
}

export function executeSimulationStep(
  currentState: WorldState,
  actionsToApply: InterpretedAction[],
  proposalText: string,
  summary: string
): SimulationStepResult {
  if (currentState.isGameOver) {
    return {
      nextState: currentState,
      report: createEmptyReport(currentState),
      error: 'Simulation has concluded. Please restart to try an alternate strategy.',
    };
  }

  // 1. Resolve and validate action definitions
  const resolvedActions: Array<{ def: ActionDefinition; intensity: number; customNote?: string }> = [];
  let totalCost = 0;

  for (const item of actionsToApply) {
    const def = SUPPORTED_ACTIONS.find(a => a.id === item.actionId);
    if (!def) {
      continue; // Skip unsupported or unknown IDs
    }
    const intensity = Math.max(0.2, Math.min(1.0, item.intensity || 1.0));
    const effectiveCost = Math.round(def.cost * intensity);
    totalCost += effectiveCost;
    resolvedActions.push({ def, intensity, customNote: item.customNote });
  }

  // 2. Budget validation check
  if (totalCost > currentState.indicators.availableBudget) {
    return {
      nextState: currentState,
      report: createEmptyReport(currentState),
      error: `Insufficient budget! Selected plan requires ${totalCost} FRU, but only ${currentState.indicators.availableBudget} FRU is available. Please scale back intensity or select fewer interventions.`,
    };
  }

  // Snapshot before state
  const beforeIndicators: WorldIndicators = { ...currentState.indicators };
  const workingIndicators: WorldIndicators = { ...currentState.indicators };

  // Deduct upfront budget
  workingIndicators.availableBudget -= totalCost;

  const appliedBenefits: string[] = [];
  const appliedTradeOffs: string[] = [];
  const appliedActionsList: Array<{ name: string; cost: number }> = [];

  // 3. Apply immediate effects
  for (const { def, intensity } of resolvedActions) {
    const cost = Math.round(def.cost * intensity);
    appliedActionsList.push({ name: def.name, cost });

    appliedBenefits.push(...def.benefits.map(b => `[${def.name}] ${b}`));
    appliedTradeOffs.push(...def.risks.map(r => `[${def.name}] ${r}`));

    // Apply immediate effects
    for (const [key, value] of Object.entries(def.immediateEffects)) {
      const indKey = key as IndicatorKey;
      if (indKey === 'availableBudget') continue;
      const scaledVal = (value as number) * intensity;
      workingIndicators[indKey] = (workingIndicators[indKey] || 0) + scaledVal;
    }
  }

  // 4. Queue new delayed effects
  const newDelayedQueue: DelayedEffect[] = [...currentState.delayedQueue];
  const queuedDelayedNotes: string[] = [];

  for (const { def, intensity } of resolvedActions) {
    if (def.delayedEffects) {
      const scaledDelayed: Partial<Record<IndicatorKey, number>> = {};
      for (const [k, v] of Object.entries(def.delayedEffects.effects)) {
        scaledDelayed[k as IndicatorKey] = (v as number) * intensity;
      }

      newDelayedQueue.push({
        id: `${def.id}_turn_${currentState.turnNumber}`,
        sourceActionId: def.id,
        actionName: def.name,
        turnsRemaining: def.delayedEffects.turnsDelay,
        effects: scaledDelayed,
        description: def.delayedEffects.description,
      });

      queuedDelayedNotes.push(`[${def.name}] ${def.delayedEffects.description} (Matures in ${def.delayedEffects.turnsDelay} year${def.delayedEffects.turnsDelay > 1 ? 's' : ''})`);
    }
  }

  // 5. Mature existing delayed effects due this turn
  const survivingDelayedQueue: DelayedEffect[] = [];
  const maturedNotes: string[] = [];

  for (const delayed of newDelayedQueue) {
    delayed.turnsRemaining -= 1;
    if (delayed.turnsRemaining <= 0) {
      // Apply matured effects
      for (const [k, v] of Object.entries(delayed.effects)) {
        const indKey = k as IndicatorKey;
        workingIndicators[indKey] = (workingIndicators[indKey] || 0) + (v as number);
      }
      maturedNotes.push(`Matured: ${delayed.actionName} - ${delayed.description}`);
    } else {
      survivingDelayedQueue.push(delayed);
    }
  }

  // 6. Deduct recurring maintenance costs for active ongoing programs
  // (e.g. maintaining ranger patrols, fire equipment, nurseries)
  let totalMaintenance = 0;
  for (const { def } of resolvedActions) {
    if (def.maintenanceCost > 0) {
      totalMaintenance += def.maintenanceCost;
    }
  }
  // Cap maintenance so it doesn't drain more than 4 FRU per turn
  const effectiveMaintenance = Math.min(4, totalMaintenance);
  if (workingIndicators.availableBudget >= effectiveMaintenance) {
    workingIndicators.availableBudget -= effectiveMaintenance;
  } else {
    // Under-maintained programs degrade slightly
    workingIndicators.implementationCapacity = Math.max(0, workingIndicators.implementationCapacity - 3);
  }

  // 7. Background environmental & socio-economic drift
  // If no forest protection is in place, illegal deforestation pressure continues at background rate
  const hasForestProtection = resolvedActions.some(a => a.def.id === 'forest_protection' || a.def.id === 'indigenous_stewardship');
  if (!hasForestProtection) {
    workingIndicators.forestCondition -= 2.0;
    workingIndicators.emissionsPressure += 2.0;
    workingIndicators.fireRisk += 2.0;
  } else {
    workingIndicators.emissionsPressure -= 1.0;
  }

  // Climate teleconnections: High drought stress slowly erodes water security and inflates fire risk
  if (workingIndicators.droughtStress > 50) {
    workingIndicators.waterSecurity -= 1.5;
    workingIndicators.fireRisk += 2.0;
  }

  // Ecological synergy: High canopy forest condition helps buffer local temperature and recharge hydrology
  if (workingIndicators.forestCondition > 65) {
    workingIndicators.waterSecurity += 2.0;
    workingIndicators.ecosystemResilience += 2.0;
    workingIndicators.fireRisk = Math.max(10, workingIndicators.fireRisk - 3.0);
  }

  // Clamp all indicators to valid [0, 100] bounds, and budget to [0, Infinity]
  for (const k of Object.keys(INDICATOR_METADATA) as IndicatorKey[]) {
    if (k === 'availableBudget') {
      workingIndicators[k] = Math.max(0, Math.round(workingIndicators[k] * 10) / 10);
    } else {
      workingIndicators[k] = Math.max(0, Math.min(100, Math.round(workingIndicators[k] * 10) / 10));
    }
  }

  // 8. Trigger emergent events based on state thresholds
  const alreadyTriggeredIds = currentState.eventHistory.map(e => e.id);
  const newEvents = checkEmergentEvents(workingIndicators, currentState.turnNumber, currentState.actionHistory, alreadyTriggeredIds);

  for (const event of newEvents) {
    for (const [k, v] of Object.entries(event.effectsApplied)) {
      const indKey = k as IndicatorKey;
      if (indKey === 'availableBudget') {
        workingIndicators[indKey] = Math.max(0, workingIndicators[indKey] + (v as number));
      } else {
        workingIndicators[indKey] = Math.max(0, Math.min(100, (workingIndicators[indKey] || 0) + (v as number)));
      }
    }
  }

  // 9. Compute detailed Indicator Deltas for consequence reporting
  const indicatorChanges: IndicatorDelta[] = [];
  const deltaSummary: Record<string, number> = {};

  for (const k of Object.keys(INDICATOR_METADATA) as IndicatorKey[]) {
    const prev = beforeIndicators[k];
    const curr = workingIndicators[k];
    const diff = Math.round((curr - prev) * 10) / 10;
    deltaSummary[k] = diff;

    if (diff !== 0) {
      const meta = INDICATOR_METADATA[k];
      let explanation = '';
      if (diff > 0) {
        explanation = meta.goodDirection === 'higher'
          ? `Improved by ${diff} ${meta.unit} due to restorative interventions and ecological recovery.`
          : `Increased by ${diff} ${meta.unit} (negative pressure).`;
      } else {
        explanation = meta.goodDirection === 'higher'
          ? `Decreased by ${Math.abs(diff)} ${meta.unit} from economic displacement or background climate stress.`
          : `Reduced by ${Math.abs(diff)} ${meta.unit} (favorable reduction in environmental hazard).`;
      }

      let evidenceType: 'Observed Data' | 'Research Finding' | 'Simplified Simulation' | 'Hypothetical Outcome' = 'Simplified Simulation';
      if (k === 'fireRisk' || k === 'forestCondition') {
        evidenceType = 'Research Finding';
      } else if (k === 'availableBudget') {
        evidenceType = 'Simplified Simulation';
      }

      indicatorChanges.push({
        key: k,
        label: meta.label,
        category: meta.category,
        previousValue: Math.round(prev),
        newValue: Math.round(curr),
        delta: diff,
        unit: meta.unit,
        explanation,
        evidenceType,
      });
    }
  }

  // Sort indicator changes: headlines first, then by absolute delta
  indicatorChanges.sort((a, b) => {
    const aMeta = INDICATOR_METADATA[a.key];
    const bMeta = INDICATOR_METADATA[b.key];
    if (aMeta.isHeadline && !bMeta.isHeadline) return -1;
    if (!aMeta.isHeadline && bMeta.isHeadline) return 1;
    return Math.abs(b.delta) - Math.abs(a.delta);
  });

  // Construct history entry
  const historyEntry: TurnHistoryEntry = {
    turn: currentState.turnNumber,
    year: currentState.simulationYear,
    proposalText,
    interpretedSummary: summary,
    actionsCommitted: resolvedActions.map(r => ({
      id: r.def.id,
      name: r.def.name,
      cost: Math.round(r.def.cost * r.intensity),
      intensity: r.intensity,
    })),
    spentFRU: totalCost,
    indicatorSnapshots: {
      before: beforeIndicators,
      after: { ...workingIndicators },
    },
    deltaSummary,
    eventsTriggered: newEvents,
    consequenceNotes: {
      benefits: appliedBenefits.slice(0, 4),
      tradeOffs: appliedTradeOffs.slice(0, 3),
      delayedQueued: queuedDelayedNotes,
    },
  };

  const nextTurnNumber = currentState.turnNumber + 1;
  const nextYear = currentState.simulationYear + 1;
  const isGameOver = nextTurnNumber > currentState.maxTurns || (workingIndicators.availableBudget <= 0 && workingIndicators.forestCondition < 30);

  // Construct interim next state
  const nextState: WorldState = {
    ...currentState,
    simulationYear: nextYear,
    turnNumber: nextTurnNumber,
    indicators: workingIndicators,
    delayedQueue: survivingDelayedQueue,
    activeEvents: newEvents,
    eventHistory: [...currentState.eventHistory, ...newEvents],
    actionHistory: [...currentState.actionHistory, historyEntry],
    isGameOver,
    ending: null,
  };

  // If game over, evaluate ending
  if (isGameOver) {
    nextState.ending = evaluateEnding(nextState);
  }

  // Construct consequence report
  const report: ConsequenceReport = {
    turn: currentState.turnNumber,
    year: currentState.simulationYear,
    actionsApplied: appliedActionsList,
    totalCost,
    indicatorChanges,
    benefits: appliedBenefits.slice(0, 5),
    tradeOffs: appliedTradeOffs.slice(0, 4),
    delayedConsequences: [...maturedNotes, ...queuedDelayedNotes],
    unresolvedRisks: workingIndicators.fireRisk > 60
      ? ['Elevated dry-season understory wildfire hazard remains acute (FIRMS thermal alerts).']
      : workingIndicators.publicTrust < 45
      ? ['Civic resistance is growing; local smallholders demand revenue-sharing.']
      : ['Climate variability poses ongoing risks to young restoration plantings.'],
    activeEvents: newEvents,
    budgetRemaining: workingIndicators.availableBudget,
  };

  return { nextState, report };
}

function createEmptyReport(state: WorldState): ConsequenceReport {
  return {
    turn: state.turnNumber,
    year: state.simulationYear,
    actionsApplied: [],
    totalCost: 0,
    indicatorChanges: [],
    benefits: [],
    tradeOffs: [],
    delayedConsequences: [],
    unresolvedRisks: [],
    activeEvents: [],
    budgetRemaining: state.indicators.availableBudget,
  };
}
