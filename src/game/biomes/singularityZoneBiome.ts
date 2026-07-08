/**
 * Singularity Zone biome content (AF-067). The tenth full biome on
 * AF-036's locked engine — the AF-058→066 content-module shape applied to
 * the rarest and most dangerous region in the galaxy, and the ENDGAME
 * APEX, asserted against all nine prior authored biomes: the highest
 * threat modifier (1.55, above even the Ancient Core), the highest elite
 * chance, the MOST hazard zones of any biome (four — physics itself is
 * hostile), the strongest weather winds anywhere (gravity storms), and
 * the richest ancientArtifact loot weight (the pinnacle of technological
 * progression). "Fully readable" is the spec's own constraint and it is
 * asserted: no Zone weather reduces visibility — like the Ancient Core,
 * whose builders went in. With AF-067, every region on AF-038's locked
 * GALAXY_REGIONS shelf has a definition — the galaxy map is complete.
 */
import type { BiomeDef, BiomeEventKind, WeatherKind } from "./biomeData";

/** Environment locations (AF-067 §Environment) — ten registered; bind as arena/mission content. */
export const ZONE_LOCATIONS = [
  "quantumOceans",
  "eventHorizonBridges",
  "collapsedUniverses",
  "gravitySeas",
  "fractalCities",
  "singularityWells",
  "infiniteTowers",
  "realityChambers",
  "timeRivers",
  "mathematicalForests",
] as const;
export type SingularityZoneLocation = (typeof ZONE_LOCATIONS)[number];

/** Weather names (AF-067 §Weather) — seven registered, mapped totally onto AF-036's locked shelf. */
export const ZONE_WEATHER = [
  "gravityStorms",
  "quantumRain",
  "realityCascades",
  "timeEchoes",
  "lightInversions",
  "particleCollapse",
  "probabilityWaves",
] as const;
export type SingularityZoneWeather = (typeof ZONE_WEATHER)[number];

export const ZONE_WEATHER_TO_ENGINE: Readonly<Record<SingularityZoneWeather, WeatherKind>> = {
  gravityStorms: "energyWinds",
  quantumRain: "crystalRain",
  realityCascades: "voidLightning",
  timeEchoes: "ionClouds",
  lightInversions: "solarStorms",
  particleCollapse: "meteorActivity",
  probabilityWaves: "nebulaDrift",
};

export const ZONE_HAZARD_KINDS = [
  "microSingularities",
  "gravityCollapse",
  "timeDilationFields",
  "probabilityZones",
  "realityFractures",
  "quantumLightning",
  "phaseInstability",
  "eventHorizonSurges",
] as const;
export type SingularityZoneHazardKind = (typeof ZONE_HAZARD_KINDS)[number];

/** Mission types (AF-067 §Mission Types) — eight registered; bind to AF-037 MissionDef content. */
export const ZONE_MISSION_TYPES = [
  "stabiliseSingularities",
  "recoverQuantumArchives",
  "investigateImpossibleSignals",
  "mapRealityTears",
  "recoverLostExpeditions",
  "containGravityCollapse",
  "protectScientificTeams",
  "unlockAncientCalculations",
] as const;
export type SingularityZoneMissionType = (typeof ZONE_MISSION_TYPES)[number];

export const ZONE_RESOURCES = [
  "singularityCores",
  "quantumMatter",
  "probabilityCrystals",
  "realityFragments",
  "gravitonAlloys",
  "chronoParticles",
  "ancientAlgorithms",
  "legendaryScientificData",
] as const;
export type SingularityZoneResource = (typeof ZONE_RESOURCES)[number];

export const ZONE_POI_KINDS = [
  "realityWells",
  "infiniteLibraries",
  "collapsedObservatories",
  "quantumArchives",
  "singularityTemples",
  "mathematicalEngines",
  "timeVaults",
  "impossibleMonuments",
] as const;
export type SingularityZonePoiKind = (typeof ZONE_POI_KINDS)[number];

/** Biome event names (AF-067 §Biome Events) — eight registered, mapped totally onto the locked shelf. */
export const ZONE_EVENTS = [
  "realityCascade",
  "gravityCollapse",
  "quantumBloom",
  "timeConvergence",
  "probabilityShift",
  "singularityPulse",
  "dimensionalAlignment",
  "universalEcho",
] as const;
export type SingularityZoneEvent = (typeof ZONE_EVENTS)[number];

export const ZONE_EVENT_TO_ENGINE: Readonly<Record<SingularityZoneEvent, BiomeEventKind>> = {
  realityCascade: "voidBreach",
  gravityCollapse: "solarFlare",
  quantumBloom: "crystalBloom",
  timeConvergence: "lostExpedition",
  probabilityShift: "solarFlare",
  singularityPulse: "voidBreach",
  dimensionalAlignment: "ancientVault",
  universalEcho: "ancientVault",
};

export const ZONE_DISCOVERIES = [
  "impossibleMathematics",
  "ancientScientificRecords",
  "lostCivilisations",
  "quantumLifeforms",
  "experimentalTechnologies",
  "realityMaps",
  "legendaryArtifacts",
  "hiddenDimensions",
] as const;
export type SingularityZoneDiscovery = (typeof ZONE_DISCOVERIES)[number];

/** Boss encounters (AF-067 §Boss Encounters) — five registered; bind as BossDefs when authored. */
export const ZONE_BOSS_KINDS = ["realityEngine", "quantumLeviathan", "singularityArchitect", "chronoSovereign", "eventHorizonIntelligence"] as const;
export type SingularityZoneBossKind = (typeof ZONE_BOSS_KINDS)[number];

export const LORE_SINGULARITY_ZONE_ARCHIVE = "LORE_SINGULARITY_ZONE_ARCHIVE";

/** The Singularity Zone — a plain AF-036 BiomeDef over the locked engine.
 * Enemy presence follows the spec: Void Swarm, Celestial Conclave,
 * Ancient Custodians, Paragon Protocol — and "rare Reality Constructs"
 * resolved as the entities already made of the Zone's own substance
 * (the Conclave's constellation avatar, the Protocol's energy construct).
 * Every encounter feels like reality defending itself. */
export const SINGULARITY_ZONE_BIOME: BiomeDef = {
  id: "singularity-zone",
  name: "Axiom",
  lore: "Past the precursors' last light, physics stops being a description and becomes a negotiation. The Zone is not breaking the laws of reality. It is drafting new ones, continuously, and you are standing inside the draft.",
  coreBiome: "blackHoleSystems",
  conditions: ["gravityDistortion", "voidCorruption", "ancientEnergy"],
  // Physics itself is hostile: the MOST hazard zones of any authored biome.
  hazards: [
    {
      // Micro Singularities — gravity as a crush, heavy and statusless.
      id: "zone-micro-singularity",
      x: 18,
      y: 12,
      radius: 2.4,
      tickIntervalMs: 800,
      damagePerTick: 8,
      statusOnTick: null,
    },
    {
      // Time Dilation Fields — seconds that belong to someone else (AF-052's stasis root).
      id: "zone-time-dilation-field",
      x: 42,
      y: 20,
      radius: 2.6,
      tickIntervalMs: 1000,
      damagePerTick: 3,
      statusOnTick: { kind: "stasis", strength: 1, durationMs: 1000 },
    },
    {
      // Quantum Lightning — probability discharging through whatever is most likely to be hit.
      id: "zone-quantum-lightning",
      x: 28,
      y: 32,
      radius: 2.2,
      tickIntervalMs: 700,
      damagePerTick: 5,
      statusOnTick: { kind: "shock", strength: 4, durationMs: 1400 },
    },
    {
      // Event Horizon Surges — the Zone redrafting local physics; ship systems object.
      id: "zone-event-horizon-surge",
      x: 12,
      y: 38,
      radius: 2.8,
      tickIntervalMs: 1100,
      damagePerTick: 4,
      statusOnTick: { kind: "overload", strength: 3, durationMs: 1600 },
    },
  ],
  // "Weather alters the battlefield while remaining fully readable" — asserted:
  // no Zone weather reduces visibility, and the gravity storms carry the
  // strongest wind force of any authored biome.
  weather: [
    { kind: "energyWinds", durationMs: 9000, windForceX: 1.2, windForceY: -0.5, reducedVisibility: false }, // Gravity Storms
    { kind: "crystalRain", durationMs: 10000, windForceX: 0, windForceY: 0.3, reducedVisibility: false }, // Quantum Rain
    { kind: "voidLightning", durationMs: 8000, windForceX: 0, windForceY: 0, reducedVisibility: false }, // Reality Cascades
  ],
  events: [
    { kind: "voidBreach", weight: 4 }, // Reality Cascade / Singularity Pulse
    { kind: "ancientVault", weight: 3 }, // Dimensional Alignment / Universal Echo — the precursors' calculations
    { kind: "solarFlare", weight: 2 }, // Gravity Collapse / Probability Shift
    { kind: "lostExpedition", weight: 2 }, // Time Convergence — expeditions arriving from other whens
    { kind: "crystalBloom", weight: 1 }, // Quantum Bloom
  ],
  // Singularity cores/ancient algorithms/legendary data → the pinnacle of
  // technological progression: the richest ancientArtifact weight of any biome.
  resourceWeights: { ancientArtifact: 2.6, relic: 2.4, researchSample: 2.2, blueprint: 1.6 },
  enemyIds: [
    "void-wisp",
    "shadow-hunter",
    "rift-guardian",
    "ancient-void-avatar",
    "pulsar-hunter",
    "gravity-oracle",
    "constellation-avatar",
    "sentinel",
    "ancient-executor",
    "energy-construct",
    "omega-prototype",
  ],
  eliteChance: 0.2, // the highest of any authored biome — nothing ordinary survives here
  bossId: null, // the five zone boss kinds are registered vocabulary — they bind as AF-035 BossDefs when authored
  enemyBuff: { kind: "shieldCapacity", value: 18 }, // reality armours what it accepts — the strongest buff of any biome
  hazardImmunities: ["stasis", "overload"], // the Zone's own do not object to its redrafting
  interactables: [
    {
      id: "axiom-quantum-archive",
      kind: "activateAncientDevice",
      x: 26,
      y: 16,
      radius: 1.5,
      discoveryCategory: "lore",
      discoveryId: LORE_SINGULARITY_ZONE_ARCHIVE,
    },
    {
      // Mathematical Engines — ancient calculations still running; solve for entry.
      id: "axiom-mathematical-engine",
      kind: "unlockSecret",
      x: 46,
      y: 30,
      radius: 1.4,
      discoveryCategory: null,
      discoveryId: null,
    },
    {
      // Time Vaults — rooms that open onto earlier versions of themselves.
      id: "axiom-time-vault",
      kind: "openHiddenArea",
      x: 14,
      y: 26,
      radius: 1.3,
      discoveryCategory: null,
      discoveryId: null,
    },
  ],
  threatModifier: 1.55, // the endgame apex — strictly above every authored biome, including the Ancient Core
};
