/**
 * Void Expanse biome content (AF-061). The fourth full biome on AF-036's
 * locked engine — the AF-058/059/060 content-module shape applied to the
 * edge of existence: a plain `BiomeDef` whose hazards are AF-035 zones
 * (a gravity well, a corrupting reality tear, a stasis-rooting temporal
 * field — physics misbehaving through engines the game already owns),
 * whose weather rides AF-020's force kinds, whose events weight the locked
 * BiomeEventKind shelf, and whose vocabulary is naming layers with total
 * mappings. Mysterious rather than horrifying: the danger is instability,
 * not gore — and the numbers say it plainly (the highest threat modifier
 * of any authored biome, endgame loot weights, corruption-immune natives).
 */
import type { BiomeDef, BiomeEventKind, WeatherKind } from "./biomeData";

/** Environment locations (AF-061 §Environment) — ten registered; bind as arena/mission content. */
export const VOIDX_LOCATIONS = [
  "collapsedStars",
  "realityTears",
  "gravitationalFields",
  "darkNebulae",
  "blackHoleSystems",
  "voidTemples",
  "dimensionalBridges",
  "collapsedCivilisations",
  "silentPlanets",
  "singularityWells",
] as const;
export type VoidExpanseLocation = (typeof VOIDX_LOCATIONS)[number];

/** Weather names (AF-061 §Weather) — seven registered, mapped totally onto AF-036's locked shelf. */
export const VOIDX_WEATHER = [
  "voidStorms",
  "realityPulses",
  "gravitationalWaves",
  "darkMatterClouds",
  "temporalEchoes",
  "spatialDistortion",
  "quantumRain",
] as const;
export type VoidExpanseWeather = (typeof VOIDX_WEATHER)[number];

export const VOIDX_WEATHER_TO_ENGINE: Readonly<Record<VoidExpanseWeather, WeatherKind>> = {
  voidStorms: "voidLightning",
  realityPulses: "energyWinds",
  gravitationalWaves: "energyWinds",
  darkMatterClouds: "nebulaDrift",
  temporalEchoes: "ionClouds",
  spatialDistortion: "energyWinds",
  quantumRain: "crystalRain",
};

export const VOIDX_HAZARD_KINDS = [
  "gravityWells",
  "realityTears",
  "temporalFields",
  "voidZones",
  "darkEnergyBursts",
  "movingSingularities",
  "collapsingSpace",
  "phaseHazards",
] as const;
export type VoidExpanseHazardKind = (typeof VOIDX_HAZARD_KINDS)[number];

/** Mission types (AF-061 §Mission Types) — eight registered; bind to AF-037 MissionDef content. */
export const VOIDX_MISSION_TYPES = [
  "sealRealityBreaches",
  "investigateAnomalies",
  "recoverLostExpeditions",
  "destroyVoidBeacons",
  "rescueSurvivors",
  "studySingularities",
  "retrieveAncientTechnology",
  "stabiliseReality",
] as const;
export type VoidExpanseMissionType = (typeof VOIDX_MISSION_TYPES)[number];

export const VOIDX_RESOURCES = [
  "voidMatter",
  "realityFragments",
  "singularityCores",
  "darkPlasma",
  "ancientRelics",
  "quantumDust",
  "dimensionalSamples",
  "legendaryResearchMaterials",
] as const;
export type VoidExpanseResource = (typeof VOIDX_RESOURCES)[number];

export const VOIDX_POI_KINDS = [
  "realityAnchors",
  "collapsedGateways",
  "voidArchives",
  "ancientMonoliths",
  "singularityChambers",
  "dimensionalBridges",
  "lostFleets",
  "quantumBeacons",
] as const;
export type VoidExpansePoiKind = (typeof VOIDX_POI_KINDS)[number];

/** Biome event names (AF-061 §Biome Events) — eight registered, mapped totally onto the locked shelf. */
export const VOIDX_EVENTS = [
  "realityCollapse",
  "voidExpansion",
  "temporalEcho",
  "darkEnergySurge",
  "blackHoleAwakening",
  "dimensionalConvergence",
  "ancientSignal",
  "gravitationalCascade",
] as const;
export type VoidExpanseEvent = (typeof VOIDX_EVENTS)[number];

export const VOIDX_EVENT_TO_ENGINE: Readonly<Record<VoidExpanseEvent, BiomeEventKind>> = {
  realityCollapse: "voidBreach",
  voidExpansion: "voidBreach",
  temporalEcho: "lostExpedition",
  darkEnergySurge: "solarFlare",
  blackHoleAwakening: "voidBreach",
  dimensionalConvergence: "ancientVault",
  ancientSignal: "ancientVault",
  gravitationalCascade: "solarFlare",
};

export const VOIDX_DISCOVERIES = [
  "lostCivilisations",
  "ancientWarnings",
  "prototypeResearch",
  "impossibleStructures",
  "realityArchives",
  "legendaryRelics",
  "unknownSpecies",
  "hiddenGateways",
] as const;
export type VoidExpanseDiscovery = (typeof VOIDX_DISCOVERIES)[number];

/** Boss encounters (AF-061 §Boss Encounters) — five registered; Rift Guardian
 * and the Void Avatar were already AF-049 roster vocabulary. */
export const VOIDX_BOSS_KINDS = ["realityDevourer", "voidLeviathan", "singularityMonarch", "ancientRiftGuardian", "dimensionalIntelligence"] as const;
export type VoidExpanseBossKind = (typeof VOIDX_BOSS_KINDS)[number];

export const LORE_VOID_EXPANSE_ARCHIVE = "LORE_VOID_EXPANSE_ARCHIVE";

/** The Void Expanse — a plain AF-036 BiomeDef over the locked engine.
 * Enemy presence follows the spec: Void Swarm primary, the Eclipsed,
 * Ancient Custodians, rare Celestial entities, occasional Machine
 * expeditions. The Void dominates every encounter. */
export const VOID_EXPANSE_BIOME: BiomeDef = {
  id: "void-expanse",
  name: "Hollow Crown",
  lore: "The stars here did not go out. They went elsewhere. What is left keeps their shapes the way a footprint keeps a foot.",
  coreBiome: "voidRegions",
  conditions: ["voidCorruption", "gravityDistortion", "ancientEnergy"],
  hazards: [
    {
      // Gravity Wells — heavy, statusless crush; positioning is the counterplay.
      id: "void-gravity-well",
      x: 22,
      y: 14,
      radius: 3.2,
      tickIntervalMs: 850,
      damagePerTick: 7,
      statusOnTick: null,
    },
    {
      // Reality Tears — the Void leaking through (AF-021's corruption status, AF-049's signature).
      id: "void-reality-tear",
      x: 42,
      y: 24,
      radius: 2.4,
      tickIntervalMs: 900,
      damagePerTick: 4,
      statusOnTick: { kind: "corruption", strength: 5, durationMs: 2200 },
    },
    {
      // Temporal Fields — time misbehaving as AF-052's stasis root: gentle damage, stolen seconds.
      id: "void-temporal-field",
      x: 30,
      y: 34,
      radius: 2.6,
      tickIntervalMs: 1000,
      damagePerTick: 3,
      statusOnTick: { kind: "stasis", strength: 1, durationMs: 900 },
    },
  ],
  weather: [
    { kind: "voidLightning", durationMs: 9000, windForceX: 0, windForceY: 0, reducedVisibility: false }, // Void Storms
    { kind: "nebulaDrift", durationMs: 12000, windForceX: 0.2, windForceY: 0.1, reducedVisibility: true }, // Dark Matter Clouds
    { kind: "energyWinds", durationMs: 10000, windForceX: -0.9, windForceY: 0.4, reducedVisibility: false }, // Gravitational Waves
  ],
  events: [
    { kind: "voidBreach", weight: 5 }, // Reality Collapse / Void Expansion / Black Hole Awakening
    { kind: "ancientVault", weight: 2 }, // Dimensional Convergence / Ancient Signal
    { kind: "lostExpedition", weight: 2 }, // Temporal Echo — someone else was here once
    { kind: "solarFlare", weight: 1 }, // Dark Energy Surge / Gravitational Cascade
  ],
  // Void matter/reality fragments/legendary research → endgame progression (§Resource Distribution).
  resourceWeights: { researchSample: 2.2, relic: 2.0, ancientArtifact: 1.8, blueprint: 1.2, craftingMaterial: 1.0 },
  enemyIds: [
    "void-wisp",
    "corruption-parasite",
    "shadow-hunter",
    "void-beacon",
    "rift-guardian",
    "ancient-void-avatar",
    "lost-scout",
    "broken-pilot",
    "memory-warden",
    "sentinel",
    "defence-drone",
    "solar-spark",
    "machine-sniper-unit",
  ],
  eliteChance: 0.18,
  bossId: null, // the five void boss kinds are registered vocabulary — they bind as AF-035 BossDefs when authored
  enemyBuff: { kind: "shieldCapacity", value: 14 }, // reality bends around the natives — the live AF-036 buff hook
  hazardImmunities: ["corruption"], // the Void does not corrupt what is already its own
  interactables: [
    {
      id: "hollow-crown-void-archive",
      kind: "activateAncientDevice",
      x: 28,
      y: 20,
      radius: 1.5,
      discoveryCategory: "lore",
      discoveryId: LORE_VOID_EXPANSE_ARCHIVE,
    },
    {
      id: "hollow-crown-reality-anchor",
      kind: "triggerEvent",
      x: 14,
      y: 28,
      radius: 1.4,
      discoveryCategory: null,
      discoveryId: null,
    },
    {
      id: "hollow-crown-hidden-gateway",
      kind: "unlockSecret",
      x: 48,
      y: 12,
      radius: 1.3,
      discoveryCategory: null,
      discoveryId: null,
    },
  ],
  threatModifier: 1.35, // the edge of existence — the deepest authored biome, strictly above Forge Primus
};
