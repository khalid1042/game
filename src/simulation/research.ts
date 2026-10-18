export interface JournalCaseStudy {
  id: string;
  title: string;
  location: string;
  yearPublished: number;
  authors: string;
  journal: string;
  doiUrl: string;
  coreProblem: string;
  interventionTested: string;
  empiricalFindings: string[];
  unintendedTradeOffs: string[];
  unresolvedQuestions: string[];
  simulationLesson: string;
  tags: string[];
}

export const RESEARCH_JOURNAL: JournalCaseStudy[] = [
  {
    id: 'case_barlow_2018',
    title: 'Wildfires in chronically degraded Amazonian forests',
    location: 'Santarém & Tapajós Basin, Pará, Brazil',
    yearPublished: 2018,
    authors: 'Barlow, J., França, F., Gardner, T.A., et al.',
    journal: 'Proceedings of the National Academy of Sciences (PNAS)',
    doiUrl: 'https://doi.org/10.1073/pnas.1802333115',
    coreProblem: 'Undisturbed primary Amazonian rainforests rarely burn naturally because deep canopy humidity blocks sunlight from drying ground leaf litter. However, selective logging and edge fragmentation create gaps that desiccate the understory.',
    interventionTested: 'Comparing unburned primary forests, logged forests, and secondary regrowth across extreme El Niño drought years with and without community firebreaks.',
    empiricalFindings: [
      'Understory fires in fragmented forests killed over 50% of large canopy trees (>30cm diameter).',
      'Burned forests lost up to 73% of bird species specialized in dense understory foliage.',
      'Active firebreaks cut around forest edges reduced accidental burn escapes from pasture by 64%.',
    ],
    unintendedTradeOffs: [
      'Cutting firebreaks requires recurring dry-season labor from farming families during peak harvest periods.',
      'Without satellite telemetry, volunteers often discover creeping understory burns too late to halt them.',
    ],
    unresolvedQuestions: [
      'How many consecutive years of fire-free recovery are needed before a burned forest regains its original microclimatic resistance?',
    ],
    simulationLesson: 'Investing in low-cost community fire brigades and FIRMS alerts yields massive avoided carbon losses, protecting expensive reforestation plantings.',
    tags: ['Wildfire', 'NASA FIRMS', 'Forest Degradation', 'Biodiversity'],
  },
  {
    id: 'case_nepstad_2014',
    title: 'Slowing Amazon deforestation through public policy and supply-chain governance',
    location: 'Brazilian Legal Amazon',
    yearPublished: 2014,
    authors: 'Nepstad, D., McGrath, D., Stickler, C., et al.',
    journal: 'Science (Vol 344, Issue 6188)',
    doiUrl: 'https://doi.org/10.1126/science.1248525',
    coreProblem: 'Between 1995 and 2004, Amazon deforestation exceeded 20,000 km² annually due to rapid soy and cattle pasture expansion.',
    interventionTested: 'A multi-pronged policy suite combining INPE satellite monitoring (DETER), expansion of Indigenous and protected reserves, restricted rural credit for non-compliant municipalities, and the Soy Moratorium.',
    empiricalFindings: [
      'Annual Amazon deforestation dropped by ~70% between 2004 and 2012, avoiding 3.2 billion metric tons of CO₂ emissions.',
      'Brazil increased beef and soy production simultaneously on existing cleared lands through agricultural intensification.',
      'Over 50% of the deforestation drop occurred on newly demarcated Indigenous territories and conservation units.',
    ],
    unintendedTradeOffs: [
      'Strict credit blacklists paralyzed smallholder farmers who lacked formal cadastral land titles (CAR).',
      'Enforcement without alternative livelihood investments created severe local economic resentment, fueling political pushback.',
    ],
    unresolvedQuestions: [
      'Can supply-chain moratoria remain effective when enforcement budgets fluctuate under changing political administrations?',
    ],
    simulationLesson: 'Command-and-control protection works rapidly to halt industrial clearcutting, but will trigger social backlash unless paired with livelihood support.',
    tags: ['Policy', 'Satellite Monitoring', 'Enforcement', 'Economics'],
  },
  {
    id: 'case_brancalion_2019',
    title: 'Global restoration opportunities in tropical rainforest landscapes',
    location: 'Global Tropical Forest Biomes (including Amazonian Basin)',
    yearPublished: 2019,
    authors: 'Brancalion, P.H.S., Niamir, A., Broadbent, E., et al.',
    journal: 'Science Advances',
    doiUrl: 'https://doi.org/10.1126/sciadv.aav3223',
    coreProblem: 'Over 100 million hectares of degraded tropical lands need restoration, but funding is limited. Planting the wrong trees in the wrong places leads to high mortality or minimal biodiversity value.',
    interventionTested: 'Multi-criteria spatial optimization analyzing biodiversity return, carbon sequestration capacity, water yield, and opportunity cost of land.',
    empiricalFindings: [
      'Restoring critical riparian strips and wildlife corridors delivers 300% more biodiversity connectivity per dollar than random block planting.',
      'Natural assisted regeneration on low-opportunity-cost land costs 60-70% less than mechanical tree planting.',
      'Multi-species native planting exhibits 4x higher drought survival than single-species timber plantations during dry spells.',
    ],
    unintendedTradeOffs: [
      'High upfront seed sourcing logistics; Amazonian native trees exhibit recalcitrant seeds that cannot be stored long in seedbanks.',
      'Requires fencing off cattle for at least 3 years, incurring upfront capital costs.',
    ],
    unresolvedQuestions: [
      'What minimum corridor width is required for large apex predators (e.g. jaguars) to cross between fragmented forest reserves?',
    ],
    simulationLesson: 'Restoration takes multi-turn patience: delayed ecological effects are realistic, and planting along river corridors maximizes water and biodiversity benefits simultaneously.',
    tags: ['Reforestation', 'Corridors', 'Carbon', 'Ecosystem Modeling'],
  },
  {
    id: 'case_fa_2020',
    title: 'Co-occurrence of intact forests and indigenous peoples in Amazonia',
    location: 'Pan-Amazonian Indigenous Territories',
    yearPublished: 2020,
    authors: 'Fa, J.E., Watson, J.E.M., Leiper, I., et al.',
    journal: 'Frontiers in Ecology and the Environment',
    doiUrl: 'https://doi.org/10.1002/fee.2148',
    coreProblem: 'Debate over whether formally recognized Indigenous lands provide durable protection compared to state-run national parks.',
    interventionTested: 'Spatial GIS overlay of 30 years of satellite forest loss across 2.1 million km² of Indigenous lands vs state reserves vs unprotected private land.',
    empiricalFindings: [
      'Deforestation rates inside demarcated Indigenous lands were 2.8 times lower than outside, and matched or outperformed strict biological reserves.',
      'Indigenous lands store over 27% of all aboveground carbon in the Amazon basin.',
      'Equipping communities with GPS telemetry and legal aid accelerated eviction of illegal wildcat mining camps.',
    ],
    unintendedTradeOffs: [
      'Indigenous rangers face violent retaliation from organized criminal land syndicates without continuous federal security protection.',
    ],
    unresolvedQuestions: [
      'How to best support indigenous youth wanting access to modern university education while retaining traditional forest ecological stewardship?',
    ],
    simulationLesson: 'Indigenous land titling and co-management is the single most cost-effective and ethically grounded conservation intervention.',
    tags: ['Indigenous Rights', 'Land Titling', 'Carbon Storage', 'Governance'],
  },
  {
    id: 'case_miccolis_2016',
    title: 'Restoration Through Agroforestry in the Amazon',
    location: 'Tomé-Açu & Paragominas, Pará, Brazil',
    yearPublished: 2016,
    authors: 'Miccolis, A., Peneireiro, F., Marques, H., et al.',
    journal: 'World Agroforestry Centre (ICRAF) Technical Report',
    doiUrl: 'https://worldagroforestry.org/output/restoration-through-agroforestry-options-brazilian-amazon',
    coreProblem: 'Extensive cattle ranching in the Amazon yields less than 1 cow per hectare, degrading topsoil in 7-10 years and driving further forest clearing.',
    interventionTested: 'Syntropic agroforestry systems integrating short-cycle annuals (corn, manioc), medium-cycle perennials (banana, cupuaçu, açaí), and valuable canopy timber trees (mahogany, ipê).',
    empiricalFindings: [
      'Smallholder gross household income increased by 280% within 4 years of syntropic conversion.',
      'Agroforestry plots maintained 42% higher topsoil moisture during drought compared to adjacent open pastures.',
      'Microbiological soil diversity rebounded to 75% of primary forest baseline within 6 years.',
    ],
    unintendedTradeOffs: [
      'Requires substantial technical extension training in tree pruning and canopy stratification.',
      'Commercial viability requires cold-chain transport for perishable fruit pulp.',
    ],
    unresolvedQuestions: [
      'How to scale regional processing cooperatives to compete against industrial monoculture supply chains?',
    ],
    simulationLesson: 'Agroforestry solves the core economic driver of deforestation: it makes standing, productive trees far more lucrative than cleared cattle pasture.',
    tags: ['Agroforestry', 'Livelihoods', 'Soil Health', 'Food Sovereignty'],
  },
  {
    id: 'case_castello_2016',
    title: 'Large-scale degradation of Amazonian freshwater ecosystems',
    location: 'Amazon Mainstem and Major Tributaries',
    yearPublished: 2016,
    authors: 'Castello, L. & Macedo, M.N.',
    journal: 'Conservation Biology',
    doiUrl: 'https://doi.org/10.1111/cobi.12708',
    coreProblem: 'Terrestrial conservation plans frequently ignore freshwater hydrology. Deforestation of headwaters causes siltation, river water temperature spikes, and commercial fish stock collapse.',
    interventionTested: 'Co-managed floodplain lake reserves and riparian vegetation buffer enforcement along tributary streams.',
    empiricalFindings: [
      'Clear-felling riparian vegetation increased stream water temperatures by up to 3.5°C, causing lethal oxygen depletion for sensitive fish fry.',
      'Fencing riparian buffers reduced sediment runoff into streams by 68% within two wet seasons.',
      'Community-managed lake zoning increased pirarucu (Arapaima gigas) giant fish stocks by over 400% in 10 years.',
    ],
    unintendedTradeOffs: [
      'Ranchers must drill off-stream solar-powered livestock watering wells to replace stream bank access.',
    ],
    unresolvedQuestions: [
      'How to coordinate upstream headwater protection with downstream fishing communities across municipal boundaries?',
    ],
    simulationLesson: 'Water security and river health are the lifeblood of both local community nutrition and regional climate moisture.',
    tags: ['Water Security', 'Freshwater', 'Riparian Buffers', 'Fisheries'],
  },
];

export interface HintGuidance {
  mode: 'Explorer' | 'Researcher' | 'Strategist';
  prompt: string;
  points: string[];
}

export function getHintGuidance(
  mode: 'Explorer' | 'Researcher' | 'Strategist',
  indicators: any,
  turn: number
): HintGuidance {
  if (mode === 'Explorer') {
    return {
      mode: 'Explorer',
      prompt: 'Observe patterns across connected ecological layers:',
      points: [
        'Notice how Fire Risk correlates inversely with Forest Canopy Condition and Water Security.',
        'What happens to Community Well-Being if you restrict logging without boosting Livelihoods first?',
        'Look at the NASA FIRMS active fire hotspots: where are the ignition fronts clustered?',
        'Check the delayed effects pipeline: which seeds planted in earlier turns will bear fruit next year?',
      ],
    };
  }

  if (mode === 'Researcher') {
    return {
      mode: 'Researcher',
      prompt: 'Empirical research findings from documented field trials:',
      points: [
        'Barlow et al. (2018) proved that understory fire kills over 50% of canopy trees in fragmented forests. Early-warning fire brigades are 10x cheaper than replanting.',
        'Nepstad et al. (2014) documented that satellite surveillance cut Amazon forest loss by 70%, but caused economic friction when farmers lacked green finance.',
        'Fa et al. (2020) demonstrated Indigenous territories suffer 2.8x less deforestation than unprotected lands—land titling is one of the highest-leverage interventions.',
        'Brancalion et al. (2019) emphasized that multi-species native corridors yield far higher drought survival than monoculture tree plantings.',
      ],
    };
  }

  return {
    mode: 'Strategist',
    prompt: 'Tactical guidance based on your current budget and indicators:',
    points: [
      indicators.fireRisk > 60
        ? 'ALERT: Your Fire Risk is dangerous (' + Math.round(indicators.fireRisk) + '/100). Consider "Integrated Fire Management" (6 FRU) immediately to prevent a catastrophic wildfire event.'
        : 'Fire vulnerability is currently stable. You have breathing room for capital-intensive corridor plantings.',
      indicators.availableBudget < 20
        ? 'CRITICAL BUDGET: You only have ' + indicators.availableBudget + ' FRU left. Prioritize "Bio-Economy Cooperatives" (8 FRU) or "Syntropic Agroforestry" (10 FRU) to trigger economic revenue events.'
        : 'Budget is healthy (' + indicators.availableBudget + ' FRU). You can afford a combined ecological and social package.',
      indicators.publicTrust < 45
        ? 'CIVIC WARNING: Civic Trust is low (' + Math.round(indicators.publicTrust) + '/100). Avoid unilateral enforcement; fund "Alternative Livelihoods" or "Indigenous Stewardship" to prevent community boycott.'
        : 'Civic trust is solid (' + Math.round(indicators.publicTrust) + '/100). Community co-management agreements will have strong local participation.',
    ],
  };
}
