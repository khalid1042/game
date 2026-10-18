export interface EarthObservationLayer {
  id: string;
  name: string;
  satelliteMission: string;
  sensor: string;
  resolution: string;
  temporalCoverage: string;
  units: string;
  description: string;
  currentObservedValue: string;
  trend: 'improving' | 'stable' | 'deteriorating';
  dataUrl: string;
  attribution: string;
  hotspotsCount?: number;
  samplePoints: Array<{
    lat: number;
    lng: number;
    name: string;
    value: number | string;
    status: 'good' | 'warning' | 'alert';
    notes: string;
  }>;
}

export const NASA_DATA_LAYERS: EarthObservationLayer[] = [
  {
    id: 'nasa_firms_thermal',
    name: 'Active Fire & Thermal Anomalies',
    satelliteMission: 'NASA EOS / Suomi NPP / NOAA-20',
    sensor: 'VIIRS (375m) & MODIS (1km)',
    resolution: '375m spatial resolution',
    temporalCoverage: 'Daily near-real-time updates (2012-Present)',
    units: 'Fire Radiative Power (MW) & Count',
    description: 'Detects active thermal anomalies produced by flaming biomass combustion, illegal agricultural fires, and understory canopy burns.',
    currentObservedValue: '142 thermal alerts detected in 30-day window (Tapajós Basin)',
    trend: 'deteriorating',
    dataUrl: 'https://firms.modaps.eosdis.nasa.gov/',
    attribution: 'NASA Land, Atmosphere Near real-time Capability for EOS (LANCE) / FIRMS',
    hotspotsCount: 142,
    samplePoints: [
      { lat: -3.42, lng: -54.95, name: 'BR-163 Highway Clearcut Front', value: '48.2 MW', status: 'alert', notes: 'Active pasture conversion burn adjacent to primary forest border' },
      { lat: -3.85, lng: -55.20, name: 'Tapajós National Forest Periphery', value: '18.4 MW', status: 'warning', notes: 'Understory encroachment fire creeping along logged logging tracks' },
      { lat: -2.95, lng: -54.72, name: 'Belterra Agroforestry Zone', value: '0.0 MW', status: 'good', notes: 'Zero thermal anomalies detected in community managed agroforestry reserve' },
    ],
  },
  {
    id: 'landsat_ndvi_canopy',
    name: 'Vegetation Greenness Index (NDVI)',
    satelliteMission: 'USGS / NASA Landsat 8/9 & Copernicus Sentinel-2',
    sensor: 'Operational Land Imager (OLI) / MSI',
    resolution: '30m multispectral',
    temporalCoverage: '16-day repeat cycle (1984-Present continuous record)',
    units: 'NDVI (-0.2 to +0.9)',
    description: 'Calculates the ratio of near-infrared reflectance to visible red absorption, measuring photosynthetic biomass density and chlorophyll activity.',
    currentObservedValue: 'Mean NDVI: 0.68 (Historical intact: 0.84, Cleared pasture: 0.32)',
    trend: 'stable',
    dataUrl: 'https://earthobservatory.nasa.gov/',
    attribution: 'USGS / NASA Earthdata / ESA Copernicus',
    samplePoints: [
      { lat: -3.10, lng: -55.10, name: 'Intact Primary Rainforest Core', value: '0.86 NDVI', status: 'good', notes: 'Dense multi-layered canopy with near-complete sunlight interception' },
      { lat: -3.65, lng: -54.80, name: 'Degraded Edge Corridor (1km buffer)', value: '0.54 NDVI', status: 'warning', notes: 'Selective logging canopy gaps with dry microclimatic understory' },
      { lat: -3.50, lng: -54.60, name: 'Exhausted Cattle Pasture', value: '0.28 NDVI', status: 'alert', notes: 'Severe topsoil erosion and invasive Brachiaria grass dieback' },
    ],
  },
  {
    id: 'nasa_gedi_biomass',
    name: 'Canopy Height & Aboveground Biomass',
    satelliteMission: 'NASA International Space Station (ISS)',
    sensor: 'GEDI (Global Ecosystem Dynamics Investigation Lidar)',
    resolution: '25m laser footprint profile',
    temporalCoverage: '2019-Present',
    units: 'Canopy Top Height RH98 (meters) & Mg/ha Biomass',
    description: 'High-resolution spaceborne lidar full-waveform measurements that penetrate the canopy to ground level, precisely quantifying vertical structural diversity.',
    currentObservedValue: 'Average Canopy Height: 24.6m (Intact: 38.2m, Regrowth: 14.1m)',
    trend: 'stable',
    dataUrl: 'https://gedi.umd.edu/',
    attribution: 'NASA Goddard Space Flight Center / University of Maryland',
    samplePoints: [
      { lat: -3.25, lng: -55.05, name: 'Old-Growth Emergent Bertholletia Grove', value: '44.8m height', status: 'good', notes: 'Centuries-old giant emergent Brazil nut trees storing >320 Mg C/ha' },
      { lat: -3.45, lng: -55.15, name: 'Secondary Regrowth Plot (Year 8)', value: '16.2m height', status: 'good', notes: 'Pioneer Cecropia and Vismia forming rapid protective shade' },
      { lat: -3.72, lng: -54.90, name: 'Recent Clearcut Zone', value: '1.2m height', status: 'alert', notes: 'Total structural collapse of vertical ecological strata' },
    ],
  },
  {
    id: 'nasa_power_climate',
    name: 'Precipitation Anomaly & Soil Moisture',
    satelliteMission: 'NASA Prediction Of Worldwide Energy Resources (POWER)',
    sensor: 'MERRA-2 Atmospheric Reanalysis & Satellite Microwave',
    resolution: '0.5° × 0.5° grid (~50km)',
    temporalCoverage: 'Monthly & Daily climatology (1981-Present)',
    units: 'Precipitation (mm/month) & Vapor Pressure Deficit (kPa)',
    description: 'Derived meteorological indicators tracking regional water balance, seasonal dry-spell duration, and atmospheric evaporative demand.',
    currentObservedValue: 'Dry-Season Precipitation Anomaly: -28% vs 30-Year Normal',
    trend: 'deteriorating',
    dataUrl: 'https://power.larc.nasa.gov/',
    attribution: 'NASA Langley Research Center / POWER Project',
    samplePoints: [
      { lat: -3.00, lng: -55.00, name: 'Tapajós River Basin Airshed', value: '84 mm/mo (-32mm)', status: 'warning', notes: 'Extended 4.5 month dry spell with elevated vapor pressure deficit' },
    ],
  },
];
