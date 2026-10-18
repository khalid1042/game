import { ActiveEvent, WorldIndicators } from './types';

export interface EventRule {
  id: string;
  title: string;
  category: 'climate' | 'social' | 'ecological' | 'economic';
  description: string;
  triggerCondition: (state: WorldIndicators, turn: number, history: any[]) => boolean;
  scientificReference: string;
  effects: Partial<Record<keyof WorldIndicators, number>>;
  durationTurns: number;
  triggerReason: string;
}

export const EVENT_RULES: EventRule[] = [
  {
    id: 'el_nino_drought_wave',
    title: 'El Niño Climate Drought Anomaly',
    category: 'climate',
    description: 'An intense dry-season thermal anomaly stalls convection rainfall over the basin. Leaf litter desiccates and river water levels drop to historic lows.',
    triggerCondition: (s, turn) => turn >= 3 && s.droughtStress > 60 && s.waterSecurity < 50,
    scientificReference: 'Marengo et al. (2018) Frontiers in Climate: "The Extreme Drought of 2015/2016 in Amazonia."',
    effects: {
      waterSecurity: -8,
      fireRisk: 15,
      droughtStress: 12,
      foodSecurity: -4,
      forestCondition: -3,
    },
    durationTurns: 1,
    triggerReason: 'Triggered when Drought Stress exceeds 60 and Watershed Security drops below 50 in Year 3+.',
  },
  {
    id: 'catastrophic_wildfire_outbreak',
    title: 'Severe Understory Wildfire Outbreak',
    category: 'climate',
    description: 'Dry conditions combined with agricultural slash-and-burn escapes ignite runaway forest fires across degraded forest margins.',
    triggerCondition: (s) => s.fireRisk > 68 && s.forestCondition < 60,
    scientificReference: 'Barlow et al. (2018) PNAS: "Wildfires in chronically degraded Amazonian forests."',
    effects: {
      forestCondition: -8,
      biodiversityCondition: -7,
      communityWellbeing: -6,
      emissionsPressure: 14,
      fireRisk: 5,
    },
    durationTurns: 1,
    triggerReason: 'Triggered when Fire Risk exceeds 68 while Forest Canopy Condition is below 60.',
  },
  {
    id: 'community_boycott_backlash',
    title: 'Local Livelihood Boycott & Strike',
    category: 'social',
    description: 'Sudden enforcement clampdowns without economic alternatives have cut family incomes. Discontented informal workers protest and block transit roads.',
    triggerCondition: (s) => s.publicTrust < 38 || (s.jobsAndLivelihoods < 45 && s.displacementRisk > 40),
    scientificReference: 'BenYishay et al. (2017) World Development: "Indigenous lands, forest governance and social discontent."',
    effects: {
      publicTrust: -10,
      implementationCapacity: -8,
      localEconomicStability: -6,
      forestCondition: -3, // illegal logging resumes out of desperation
    },
    durationTurns: 1,
    triggerReason: 'Triggered when Civic Trust drops below 38 or Household Livelihoods fall below 45 alongside high displacement risk.',
  },
  {
    id: 'ecological_corridor_connectivity',
    title: 'Wildlife Canopy Corridor Reconnection Milestone',
    category: 'ecological',
    description: 'Success! Multi-year native tree plantings and riparian protection have physically linked two isolated forest reserves. Camera traps record returning jaguars and tapirs.',
    triggerCondition: (s, turn) => turn >= 3 && s.forestCondition >= 65 && s.biodiversityCondition >= 55,
    scientificReference: 'Strassburg et al. (2020) Nature: "Global priority areas for ecosystem restoration."',
    effects: {
      biodiversityCondition: 10,
      ecosystemResilience: 10,
      publicTrust: 6,
      localEconomicStability: 6,
    },
    durationTurns: 1,
    triggerReason: 'Triggered when Forest Condition reaches 65+ and Biodiversity reaches 55+ through continuous corridor stewardship.',
  },
  {
    id: 'bioeconomy_cooperative_boom',
    title: 'Amazonian Bio-Economy Export Boom',
    category: 'economic',
    description: 'Community-processed certified fair-trade açaí and Brazil nut oils receive premium organic certification, attracting European and domestic ethical buyers.',
    triggerCondition: (s) => s.localEconomicStability >= 68 && s.jobsAndLivelihoods >= 68,
    scientificReference: 'Coslovsky (2021) Nature Food: "How a sustainable bio-economy develops in the Amazon."',
    effects: {
      availableBudget: 6, // Financial revenue infusion!
      localEconomicStability: 7,
      communityWellbeing: 6,
      publicTrust: 5,
    },
    durationTurns: 1,
    triggerReason: 'Triggered when Economic Stability and Jobs both exceed 68, unlocking premium bio-product export markets.',
  },
  {
    id: 'carbon_credit_grant_award',
    title: 'Verified Satellite Carbon Reduction Grant',
    category: 'economic',
    description: 'High-resolution telemetry confirms verified reductions in deforestation emissions. An international Earth conservation fund awards a $8M (8 FRU) performance grant.',
    triggerCondition: (s, turn) => turn >= 4 && s.emissionsPressure <= 45 && s.forestCondition >= 60,
    scientificReference: 'West et al. (2020) PNAS: "Overstated carbon emission reductions from voluntary REDD+ projects."',
    effects: {
      availableBudget: 8, // Direct budget replenishment!
      implementationCapacity: 8,
      publicTrust: 5,
    },
    durationTurns: 1,
    triggerReason: 'Triggered in Year 4+ when Emissions Pressure is kept below 45 and Forest Condition exceeds 60.',
  },
  {
    id: 'hydrological_flying_river_renewal',
    title: 'Atmospheric "Flying River" Hydrological Revival',
    category: 'ecological',
    description: 'Expanding native forest evapotranspiration recharges atmospheric moisture plumes, lowering regional heat stress and boosting seasonal agriculture rainfall.',
    triggerCondition: (s) => s.waterSecurity >= 65 && s.forestCondition >= 68,
    scientificReference: 'Lovejoy & Nobre (2018) Science Advances: "Amazon Tipping Point."',
    effects: {
      waterSecurity: 8,
      ecosystemResilience: 8,
      droughtStress: -10,
      foodSecurity: 6,
    },
    durationTurns: 1,
    triggerReason: 'Triggered when Watershed Security reaches 65+ and Forest Canopy reaches 68+, stabilizing regional atmospheric moisture.',
  },
];

export function checkEmergentEvents(
  currentIndicators: WorldIndicators,
  turnNumber: number,
  actionHistory: any[],
  alreadyTriggeredIds: string[]
): ActiveEvent[] {
  const triggered: ActiveEvent[] = [];

  for (const rule of EVENT_RULES) {
    // Prevent repeating the same event in consecutive turns unless it's a chronic condition
    if (alreadyTriggeredIds.includes(rule.id)) {
      continue;
    }

    if (rule.triggerCondition(currentIndicators, turnNumber, actionHistory)) {
      triggered.push({
        id: rule.id,
        title: rule.title,
        category: rule.category,
        description: rule.description,
        triggerReason: rule.triggerReason,
        effectsApplied: rule.effects,
        durationTurns: rule.durationTurns,
        isDeterministic: true,
        scientificReference: rule.scientificReference,
      });
    }
  }

  return triggered;
}
