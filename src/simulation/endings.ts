import { EndingEvaluation, WorldIndicators, WorldState } from './types';

export function evaluateEnding(state: WorldState): EndingEvaluation {
  const ind = state.indicators;

  // 1. Check for Collapse condition
  if (ind.availableBudget <= 0 && ind.localEconomicStability < 35 && ind.forestCondition < 40) {
    return {
      id: 'silent_collapse',
      title: 'The Silent Collapse',
      tagline: 'Short-term exhaustion leaves both forest and society depleted.',
      category: 'collapse',
      badgeIcon: 'skull',
      description: 'Funds were rapidly exhausted while underlying socioeconomic pressures remained unaddressed. Enforcement proved unenforceable in the long run, and deforestation resumed aggressively under severe economic hardship.',
      keyDrivers: [
        `Budget reached zero while economic stability stagnated at ${Math.round(ind.localEconomicStability)}/100.`,
        `Forest condition declined to ${Math.round(ind.forestCondition)}/100 as communities had no alternative to subsistence extraction.`,
      ],
      unresolvedDilemmas: [
        'Without durable local economic diversification, conservation collapses as soon as external funding runs dry.',
      ],
      scientificCritique: 'Consistent with empirical studies showing that unfunded top-down conservation decrees trigger rapid rebound clearing (Nepstad et al., 2014).',
      scorePercentage: Math.max(15, Math.round((ind.forestCondition + ind.communityWellbeing + ind.localEconomicStability) / 3)),
    };
  }

  // 2. Mastery: Planetary Harmony
  // Requires outstanding results across ecology, society, economy, and resilience
  if (
    ind.forestCondition >= 75 &&
    ind.biodiversityCondition >= 70 &&
    ind.communityWellbeing >= 70 &&
    ind.localEconomicStability >= 65 &&
    ind.ecosystemResilience >= 75 &&
    ind.waterSecurity >= 65
  ) {
    return {
      id: 'planetary_harmony',
      title: 'Planetary Harmony (Mastery)',
      tagline: 'An exemplary synthesis of indigenous rights, bio-economy, and ecological renewal.',
      category: 'mastery',
      badgeIcon: 'award',
      description: 'A model for tropical conservation globally. By synchronizing indigenous territorial sovereignty, native multi-species corridor planting, and high-value syntropic agroforestry, the region transformed from a deforestation frontier into a thriving regenerative bio-economy.',
      keyDrivers: [
        `Forest Canopy restored to a vibrant ${Math.round(ind.forestCondition)}/100 with active wildlife corridors.`,
        `Community Well-Being reached ${Math.round(ind.communityWellbeing)}/100, powered by sustainable non-timber harvesting cooperatives.`,
        `Regional Resilience scored ${Math.round(ind.ecosystemResilience)}/100, insulating the basin from climate tipping points.`,
      ],
      unresolvedDilemmas: [
        'Sustaining generational leadership among youth in rural bio-economy cooperatives against urban migration pull.',
      ],
      scientificCritique: 'Empirically aligns with the findings of Strassburg et al. (Nature 2020) and Fa et al. (2020), demonstrating that multi-benefit spatial planning optimizes carbon sequestration and human welfare simultaneously.',
      scorePercentage: 96,
    };
  }

  // 3. The Balanced Civilization
  if (
    ind.forestCondition >= 65 &&
    ind.communityWellbeing >= 65 &&
    ind.localEconomicStability >= 58 &&
    ind.ecosystemResilience >= 60
  ) {
    return {
      id: 'balanced_civilization',
      title: 'The Balanced Civilization',
      tagline: 'Sustainable human development living in equilibrium with restored Amazonian nature.',
      category: 'balanced',
      badgeIcon: 'scale',
      description: 'You proved that conservation and economic viability are not zero-sum enemies. While not every hectare is a virgin wilderness, agricultural production shifted to sustainable agroforestry, smallholders enjoy stable incomes, and forest corridors remain connected.',
      keyDrivers: [
        `Forest condition stands at a healthy ${Math.round(ind.forestCondition)}/100.`,
        `Local economic stability stabilized at ${Math.round(ind.localEconomicStability)}/100 through diversified crops and green jobs.`,
        `Civic trust preserved at ${Math.round(ind.publicTrust)}/100 with participatory conservation agreements.`,
      ],
      unresolvedDilemmas: [
        'Maintaining fire management vigilance during intensifying global climate dry spells.',
      ],
      scientificCritique: 'Corresponds to the "Sustainable Landscapes" paradigm advocated by the Amazonian Science Panel (SPA 2021).',
      scorePercentage: Math.round((ind.forestCondition * 0.4) + (ind.communityWellbeing * 0.3) + (ind.localEconomicStability * 0.3)),
    };
  }

  // 4. The Green Renaissance (High ecological gains, but social or economic trade-offs)
  if (ind.forestCondition >= 75 && ind.biodiversityCondition >= 70) {
    return {
      id: 'green_renaissance',
      title: 'The Green Renaissance',
      tagline: 'Massive ecological revival achieved, though social transitions remain delicate.',
      category: 'triumph',
      badgeIcon: 'sprout',
      description: 'The forest landscape has staged a remarkable recovery. Native tree canopies have closed, river baseflows are replenished, and endangered species have repopulated corridors. However, local economic stability or household incomes felt the strain of strict protection.',
      keyDrivers: [
        `Forest Canopy reached an exceptional ${Math.round(ind.forestCondition)}/100.`,
        `Biodiversity connectivity surged to ${Math.round(ind.biodiversityCondition)}/100.`,
        `Economic stability sits at ${Math.round(ind.localEconomicStability)}/100, requiring ongoing transition support.`,
      ],
      unresolvedDilemmas: [
        'Ensuring downstream communities share equitably in conservation benefits to prevent long-term political friction.',
      ],
      scientificCritique: 'Exemplifies biological success where rigorous spatial protection halts degradation, as demonstrated in Brazil\'s 2004-2012 policy phase (Soares-Filho et al., PNAS).',
      scorePercentage: Math.round((ind.forestCondition * 0.5) + (ind.biodiversityCondition * 0.3) + (ind.communityWellbeing * 0.2)),
    };
  }

  // 5. The Fragile Recovery (Default / Mixed outcome)
  return {
    id: 'fragile_recovery',
    title: 'The Fragile Recovery',
    tagline: 'Meaningful gains made, but lingering structural vulnerabilities persist.',
    category: 'fragile',
    badgeIcon: 'shield-alert',
    description: 'Catastrophic deforestation was halted and key pilot programs succeeded, but the regional ecosystem remains vulnerable to drought shocks, fire flare-ups, or economic downturns. Continued adaptive management is essential.',
    keyDrivers: [
      `Forest condition held at ${Math.round(ind.forestCondition)}/100 (Baseline: ${state.baselineIndicators.forestCondition}).`,
      `Fire risk index stands at ${Math.round(ind.fireRisk)}/100.`,
      `Civic trust and capacity remain at moderate levels (${Math.round(ind.publicTrust)}/100).`,
    ],
    unresolvedDilemmas: [
      'Scaling pilot agroforestry and fire brigades into permanently funded municipal programs.',
      'Underlying drought stress remains elevated under ongoing continental climate shifts.',
    ],
    scientificCritique: 'Accurately reflects real-world Amazonian realities: stabilization is achievable, but permanent durability demands ongoing regional governance (Barlow et al., 2018).',
    scorePercentage: Math.round(
      (ind.forestCondition + ind.communityWellbeing + ind.localEconomicStability + ind.ecosystemResilience) / 4
    ),
  };
}
