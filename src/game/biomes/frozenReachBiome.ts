/**
 * Frozen Reach biome content (AF-064). The seventh full biome on AF-036's
 * locked engine — the AF-058→063 content-module shape applied to the
 * galaxy's frozen edge, and the first biome whose identity is RESTRAINT:
 * where every prior region escalated, the Reach contrasts through calm.
 * Stillness is mechanical, not mood — the slowest hazard ticks of any
 * biome (planning, not reflexes), the sparsest event pool (three defs,
 * silence between them), the lowest elite chance, and winds that never
 * rise above a drift. Two AF-021 status kinds dormant since their
 * registration get their FIRST producers here: freeze (the cryogenic
 * field roots what it catches) and slow (the frozen gas clouds drag at
 * engines). Quiet is not safe: the Reach still sits mid-ladder on threat.
 */
import type { BiomeDef, BiomeEventKind, WeatherKind } from "./biomeData";

/** Environment locations (AF-064 §Environment) — ten registered; bind as arena/mission content. */
export const REACH_LOCATIONS = [
  "frozenPlanets",
  "cryogenicOceans",
  "iceCanyons",
  "glacialStations",
  "abandonedResearchLabs",
  "cryoVaults",
  "subsurfaceCaverns",
  "frozenForests",
  "iceMoons",
  "deadStarSystems",
] as const;
export type FrozenReachLocation = (typeof REACH_LOCATIONS)[number];

/** Weather names (AF-064 §Weather) — seven registered, mapped totally onto AF-036's locked shelf. */
export const REACH_WEATHER = [
  "cryoStorms",
  "auroraActivity",
  "iceFog",
  "frozenDust",
  "electrostaticSnow",
  "crystalHail",
  "thermalCollapse",
] as const;
export type FrozenReachWeather = (typeof REACH_WEATHER)[number];

export const REACH_WEATHER_TO_ENGINE: Readonly<Record<FrozenReachWeather, WeatherKind>> = {
  cryoStorms: "nebulaDrift",
  auroraActivity: "solarStorms",
  iceFog: "nebulaDrift",
  frozenDust: "nebulaDrift",
  electrostaticSnow: "ionClouds",
  crystalHail: "meteorActivity",
  thermalCollapse: "energyWinds",
};

export const REACH_HAZARD_KINDS = [
  "iceCracks",
  "cryogenicFields",
  "frozenGasClouds",
  "slipperySurfaces",
  "thermalShock",
  "cryoExplosions",
  "fallingIce",
  "frozenDebris",
] as const;
export type FrozenReachHazardKind = (typeof REACH_HAZARD_KINDS)[number];

/** Mission types (AF-064 §Mission Types) — eight registered; bind to AF-037 MissionDef content. */
export const REACH_MISSION_TYPES = [
  "recoverCryogenicArchives",
  "rescueFrozenSurvivors",
  "repairHeatingSystems",
  "exploreAncientLaboratories",
  "harvestCryoMaterials",
  "investigateSilentColonies",
  "restoreCommunications",
  "studyFrozenLife",
] as const;
export type FrozenReachMissionType = (typeof REACH_MISSION_TYPES)[number];

export const REACH_RESOURCES = [
  "cryoCrystals",
  "frozenAlloys",
  "thermalCells",
  "preservedSamples",
  "quantumIce",
  "ancientData",
  "cryogenicFluids",
  "researchMaterials",
] as const;
export type FrozenReachResource = (typeof REACH_RESOURCES)[number];

export const REACH_POI_KINDS = [
  "cryoVaults",
  "frozenFleets",
  "ancientLaboratories",
  "iceTemples",
  "subsurfaceCities",
  "auroraObservatories",
  "preservationChambers",
  "deepIceArchives",
] as const;
export type FrozenReachPoiKind = (typeof REACH_POI_KINDS)[number];

/** Biome event names (AF-064 §Biome Events) — eight registered, mapped totally onto the locked shelf. */
export const REACH_EVENTS = [
  "cryoCollapse",
  "auroraSurge",
  "thermalFailure",
  "frozenAwakening",
  "icequake",
  "researchDiscovery",
  "ancientBroadcast",
  "subsurfaceBreach",
] as const;
export type FrozenReachEvent = (typeof REACH_EVENTS)[number];

export const REACH_EVENT_TO_ENGINE: Readonly<Record<FrozenReachEvent, BiomeEventKind>> = {
  cryoCollapse: "distressSignal",
  auroraSurge: "solarFlare",
  thermalFailure: "distressSignal",
  frozenAwakening: "lostExpedition",
  icequake: "distressSignal",
  researchDiscovery: "ancientVault",
  ancientBroadcast: "ancientVault",
  subsurfaceBreach: "voidBreach",
};

export const REACH_DISCOVERIES = [
  "perfectlyPreservedTechnology",
  "ancientExpeditionRecords",
  "cryogenicOrganisms",
  "lostCivilisations",
  "prototypeResearch",
  "legendaryEquipment",
  "hiddenArchives",
  "frozenRelics",
] as const;
export type FrozenReachDiscovery = (typeof REACH_DISCOVERIES)[number];

/** Boss encounters (AF-064 §Boss Encounters) — five registered; bind as BossDefs when authored. */
export const REACH_BOSS_KINDS = ["cryoLeviathan", "frozenGuardian", "absoluteZeroCore", "ancientPreservationIntelligence", "glacialColossus"] as const;
export type FrozenReachBossKind = (typeof REACH_BOSS_KINDS)[number];

export const LORE_FROZEN_REACH_ARCHIVE = "LORE_FROZEN_REACH_ARCHIVE";

/** The Frozen Reach — a plain AF-036 BiomeDef over the locked engine.
 * Enemy presence follows the spec: the Eclipsed primary (frozen former
 * humans in a frozen former colony), Ancient Custodians, Machine
 * Collective, cryogenic wildlife (AF-051 organisms adapted to the ice),
 * rare Void entities. Encounters are deliberate, never overwhelming. */
export const FROZEN_REACH_BIOME: BiomeDef = {
  id: "frozen-reach",
  name: "Winterline",
  lore: "The colonies here saw the Collapse coming and chose suspension over escape. Kilometres under the ice, the lights are still on, the instruments still recording. They are all still waiting.",
  coreBiome: "frozenNebulae",
  conditions: ["nebulaFog", "asteroidDrift", "ancientEnergy"],
  // Stillness is mechanical: the slowest hazard ticks of any authored biome.
  // Every zone telegraphs, punishes carelessness, and rewards planning.
  hazards: [
    {
      // Cryogenic Fields — the preservation system does not distinguish
      // visitors from specimens (AF-021's freeze status, its FIRST producer).
      id: "reach-cryogenic-field",
      x: 20,
      y: 14,
      radius: 2.8,
      tickIntervalMs: 1400,
      damagePerTick: 3,
      statusOnTick: { kind: "freeze", strength: 1, durationMs: 1100 },
    },
    {
      // Ice Cracks — the crust gives way all at once; heavy, statusless, slow.
      id: "reach-ice-crack",
      x: 42,
      y: 24,
      radius: 2.4,
      tickIntervalMs: 1600,
      damagePerTick: 10,
      statusOnTick: null,
    },
    {
      // Frozen Gas Clouds — supercooled vapour dragging at engines
      // (AF-021's slow status, its FIRST producer).
      id: "reach-frozen-gas-cloud",
      x: 30,
      y: 34,
      radius: 3.0,
      tickIntervalMs: 1300,
      damagePerTick: 4,
      statusOnTick: { kind: "slow", strength: 2, durationMs: 2000 },
    },
  ],
  // Winds never rise above a drift — the stillest weather of any biome.
  weather: [
    { kind: "nebulaDrift", durationMs: 13000, windForceX: 0.1, windForceY: 0, reducedVisibility: true }, // Ice Fog / Cryo Storms
    { kind: "meteorActivity", durationMs: 8000, windForceX: 0, windForceY: 0.3, reducedVisibility: false }, // Crystal Hail
    { kind: "solarStorms", durationMs: 12000, windForceX: 0, windForceY: 0, reducedVisibility: false }, // Aurora Activity
  ],
  // The sparsest event pool of any authored biome — three defs, and silence between them.
  events: [
    { kind: "lostExpedition", weight: 4 }, // Frozen Awakening — the expeditions are still here, perfectly preserved
    { kind: "ancientVault", weight: 2 }, // Research Discovery / Ancient Broadcast
    { kind: "distressSignal", weight: 2 }, // Cryo Collapse / Thermal Failure / Icequake
  ],
  // Preserved samples/quantum ice/ancient data → advanced research and crafting (§Resource Distribution).
  resourceWeights: { researchSample: 2.0, craftingMaterial: 1.8, relic: 1.4, ancientArtifact: 1.3, blueprint: 1.2 },
  enemyIds: [
    "lost-scout",
    "broken-pilot",
    "echo-drone",
    "memory-warden",
    "sentinel",
    "guardian-sphere",
    "machine-combat-drone",
    "machine-repair-drone",
    "stalker",
    "hive-drone",
    "void-wisp",
  ],
  eliteChance: 0.06, // the lowest of any authored biome — encounters are deliberate, never overwhelming
  bossId: null, // the five reach boss kinds are registered vocabulary — they bind as AF-035 BossDefs when authored
  enemyBuff: { kind: "shieldCapacity", value: 10 }, // preservation plating — what survives here was built to endure
  hazardImmunities: ["freeze", "slow"], // the natives froze a long time ago; the cold has nothing left to take
  interactables: [
    {
      id: "winterline-cryo-vault",
      kind: "activateAncientDevice",
      x: 28,
      y: 18,
      radius: 1.5,
      discoveryCategory: "lore",
      discoveryId: LORE_FROZEN_REACH_ARCHIVE,
    },
    {
      // Subsurface Cities — kilometres of ice between you and the lights below.
      id: "winterline-subsurface-passage",
      kind: "openHiddenArea",
      x: 14,
      y: 30,
      radius: 1.4,
      discoveryCategory: null,
      discoveryId: null,
    },
    {
      id: "winterline-cryo-vein",
      kind: "harvestResource",
      x: 46,
      y: 12,
      radius: 1.2,
      discoveryCategory: null,
      discoveryId: null,
    },
  ],
  threatModifier: 1.2, // quiet is not safe — mid-ladder, between the Crystal Expanse and the Forge
};
