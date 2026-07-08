/**
 * Ancient Core biome content (AF-062). The fifth full biome on AF-036's
 * locked engine — the AF-058→061 content-module shape applied to the
 * birthplace of the civilisation that built the Afterlight Network: a
 * plain `BiomeDef` whose hazards are AF-035 zones that feel INTENTIONAL
 * rather than natural (a shield-stripping security field, a statusless
 * precision defence laser, a stasis temporal lock — the Core defends
 * itself deliberately), whose weather rides AF-020's force kinds with
 * zero visibility reduction (technological perfection never obscures),
 * whose events weight the locked BiomeEventKind shelf, and whose
 * vocabulary is naming layers with total mappings. Civilisation at its
 * absolute peak is numbers: the highest threat modifier and the richest
 * endgame loot weights of any authored biome, and a REAL boss — the
 * same Sentinel class that guards Prismheart's temple guards the Core.
 */
import type { BiomeDef, BiomeEventKind, WeatherKind } from "./biomeData";

/** Environment structures (AF-062 §Environment) — ten registered; bind as arena/mission content. */
export const ACORE_LOCATIONS = [
  "orbitalRings",
  "dysonFragments",
  "planetaryArchives",
  "quantumLibraries",
  "ancientCities",
  "artificialMoons",
  "stellarElevators",
  "guardianTemples",
  "knowledgeVaults",
  "afterlightRelays",
] as const;
export type AncientCoreLocation = (typeof ACORE_LOCATIONS)[number];

/** Weather names (AF-062 §Weather) — seven registered, mapped totally onto AF-036's locked shelf. */
export const ACORE_WEATHER = [
  "solarStreams",
  "energyRain",
  "quantumResonance",
  "gravityHarmony",
  "lightBloom",
  "stellarWinds",
  "ancientEnergyPulses",
] as const;
export type AncientCoreWeather = (typeof ACORE_WEATHER)[number];

export const ACORE_WEATHER_TO_ENGINE: Readonly<Record<AncientCoreWeather, WeatherKind>> = {
  solarStreams: "solarStorms",
  energyRain: "crystalRain",
  quantumResonance: "ionClouds",
  gravityHarmony: "energyWinds",
  lightBloom: "solarStorms",
  stellarWinds: "energyWinds",
  ancientEnergyPulses: "voidLightning",
};

export const ACORE_HAZARD_KINDS = [
  "securityFields",
  "energyBridges",
  "quantumGates",
  "gravityWells",
  "guardianArrays",
  "defenceLasers",
  "collapsingPlatforms",
  "temporalLocks",
] as const;
export type AncientCoreHazardKind = (typeof ACORE_HAZARD_KINDS)[number];

/** Mission types (AF-062 §Mission Types) — eight registered; bind to AF-037 MissionDef content. */
export const ACORE_MISSION_TYPES = [
  "recoverArchives",
  "activateRelays",
  "restoreSystems",
  "decodeAncientLanguage",
  "escortScientists",
  "secureKnowledgeVaults",
  "protectResearchers",
  "unlockCivilisationRecords",
] as const;
export type AncientCoreMissionType = (typeof ACORE_MISSION_TYPES)[number];

export const ACORE_RESOURCES = [
  "ancientAlloys",
  "quantumCrystals",
  "knowledgeFragments",
  "civilisationRecords",
  "prototypeComponents",
  "guardianTechnology",
  "afterlightKeys",
  "legendaryResearchMaterials",
] as const;
export type AncientCoreResource = (typeof ACORE_RESOURCES)[number];

export const ACORE_POI_KINDS = [
  "planetaryLibraries",
  "stellarObservatories",
  "ancientCouncils",
  "knowledgeWells",
  "guardianTemples",
  "quantumBridges",
  "memoryArchives",
  "civilisationMonuments",
] as const;
export type AncientCorePoiKind = (typeof ACORE_POI_KINDS)[number];

/** Biome event names (AF-062 §Biome Events) — eight registered, mapped totally onto the locked shelf. */
export const ACORE_EVENTS = [
  "archiveActivation",
  "guardianAwakening",
  "knowledgeRecovery",
  "energyAlignment",
  "stellarSynchronisation",
  "ancientBroadcast",
  "quantumCascade",
  "relayRestoration",
] as const;
export type AncientCoreEvent = (typeof ACORE_EVENTS)[number];

export const ACORE_EVENT_TO_ENGINE: Readonly<Record<AncientCoreEvent, BiomeEventKind>> = {
  archiveActivation: "ancientVault",
  guardianAwakening: "machineActivation",
  knowledgeRecovery: "ancientVault",
  energyAlignment: "solarFlare",
  stellarSynchronisation: "solarFlare",
  ancientBroadcast: "distressSignal",
  quantumCascade: "voidBreach",
  relayRestoration: "ancientVault",
};

export const ACORE_DISCOVERIES = [
  "civilisationHistory",
  "afterlightOrigins",
  "ancientLanguage",
  "precursorTechnology",
  "hiddenArchives",
  "legendaryBlueprints",
  "lostCommanders",
  "planetaryRecords",
] as const;
export type AncientCoreDiscovery = (typeof ACORE_DISCOVERIES)[number];

/** Boss encounters (AF-062 §Boss Encounters) — five registered; Guardian
 * Prime's class is already playable through the authored Hollow Sentinel. */
export const ACORE_BOSS_KINDS = ["archiveIntelligence", "guardianPrime", "ancientArchitect", "planetaryCustodian", "afterlightOverseer"] as const;
export type AncientCoreBossKind = (typeof ACORE_BOSS_KINDS)[number];

export const LORE_ANCIENT_CORE_ARCHIVE = "LORE_ANCIENT_CORE_ARCHIVE";

/** The Ancient Core — a plain AF-036 BiomeDef over the locked engine.
 * Enemy presence follows the spec: Ancient Custodians primary, Celestial
 * Conclave, rare Void corruption, Paragon Protocol, occasional Eclipsed.
 * Every battle protects ancient knowledge. */
export const ANCIENT_CORE_BIOME: BiomeDef = {
  id: "ancient-core",
  name: "First Light",
  lore: "They built a civilisation the size of a sky, wrote down everything they learned, and left the lights on. The library is still open. The librarians never stood down.",
  coreBiome: "ancientRuins",
  conditions: ["ancientEnergy", "gravityDistortion", "solarRadiation"],
  hazards: [
    {
      // Security Fields — the Core strips intruders' shields before it harms them (AF-054's shieldBreak status).
      id: "core-security-field",
      x: 20,
      y: 12,
      radius: 2.8,
      tickIntervalMs: 800,
      damagePerTick: 3,
      statusOnTick: { kind: "shieldBreak", strength: 4, durationMs: 2000 },
    },
    {
      // Defence Lasers — precise, heavy, statusless; the hazard is intentional, not weather.
      id: "core-defence-laser",
      x: 44,
      y: 22,
      radius: 2.2,
      tickIntervalMs: 950,
      damagePerTick: 9,
      statusOnTick: null,
    },
    {
      // Temporal Locks — the archive freezes what it cannot identify (AF-052's stasis root).
      id: "core-temporal-lock",
      x: 32,
      y: 34,
      radius: 2.4,
      tickIntervalMs: 1050,
      damagePerTick: 2,
      statusOnTick: { kind: "stasis", strength: 1, durationMs: 1000 },
    },
  ],
  // Technological perfection never obscures: no Ancient Core weather reduces visibility.
  weather: [
    { kind: "solarStorms", durationMs: 10000, windForceX: 0, windForceY: 0, reducedVisibility: false }, // Solar Streams
    { kind: "crystalRain", durationMs: 11000, windForceX: 0, windForceY: 0.2, reducedVisibility: false }, // Energy Rain
    { kind: "energyWinds", durationMs: 9000, windForceX: 0.5, windForceY: -0.5, reducedVisibility: false }, // Stellar Winds
  ],
  events: [
    { kind: "ancientVault", weight: 5 }, // Archive Activation / Knowledge Recovery / Relay Restoration
    { kind: "machineActivation", weight: 2 }, // Guardian Awakening
    { kind: "solarFlare", weight: 2 }, // Energy Alignment / Stellar Synchronisation
    { kind: "voidBreach", weight: 1 }, // Quantum Cascade — their relationship with the Void, still leaking
  ],
  // Ancient alloys/knowledge fragments/Afterlight keys → accelerated endgame progression (§Resource Distribution).
  resourceWeights: { ancientArtifact: 2.5, relic: 2.2, researchSample: 2.0, blueprint: 1.4, loreObject: 1.2 },
  enemyIds: [
    "sentinel",
    "defence-drone",
    "guardian-sphere",
    "shield-architect",
    "custodian-walker",
    "ancient-executor",
    "solar-spark",
    "pulsar-hunter",
    "void-wisp",
    "prototype-drone",
    "lost-scout",
  ],
  eliteChance: 0.17,
  // The one authored BossDef IS an ancient guardian — the Sentinel class that
  // guards Prismheart's temple guards its makers' home. The five Core boss
  // kinds are registered vocabulary and bind as further BossDefs when authored.
  bossId: "hollow-sentinel",
  enemyBuff: { kind: "shieldCapacity", value: 16 }, // precursor-maintained defences — the live AF-036 buff hook
  hazardImmunities: ["shieldBreak", "stasis"], // the security recognises its keepers
  interactables: [
    {
      id: "first-light-knowledge-vault",
      kind: "activateAncientDevice",
      x: 28,
      y: 18,
      radius: 1.5,
      discoveryCategory: "lore",
      discoveryId: LORE_ANCIENT_CORE_ARCHIVE,
    },
    {
      id: "first-light-collapsed-gate",
      kind: "destroyObstacle",
      x: 14,
      y: 30,
      radius: 1.4,
      discoveryCategory: null,
      discoveryId: null,
    },
    {
      id: "first-light-energy-well",
      kind: "harvestResource",
      x: 48,
      y: 12,
      radius: 1.2,
      discoveryCategory: null,
      discoveryId: null,
    },
  ],
  threatModifier: 1.45, // civilisation at its absolute peak — the deepest authored biome, strictly above Hollow Crown
};
