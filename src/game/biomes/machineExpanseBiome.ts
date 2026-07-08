/**
 * Machine Expanse biome content (AF-060). The third full biome on AF-036's
 * locked engine — AF-058/059's exact content-module shape applied to the
 * Machine Collective's industrial heart: a plain `BiomeDef` whose hazards
 * ARE AF-035 zones (the foundry's own machinery), whose weather rides
 * AF-020's force kinds, whose events weight the locked BiomeEventKind
 * shelf, and whose vocabulary is naming layers with total mappings.
 * Nothing here exists naturally: the natives are buffed and immune to
 * their own foundry, the threat modifier is the highest of the three
 * authored biomes, and the loot weights bias toward engineering
 * progression (blueprints, crafting material, research).
 */
import type { BiomeDef, BiomeEventKind, WeatherKind } from "./biomeData";

/** Environment locations (AF-060 §Environment) — ten registered; bind as arena/mission content. */
export const FORGE_LOCATIONS = [
  "assemblyLines",
  "planetaryFoundries",
  "orbitalDrydocks",
  "machineCities",
  "energyReactors",
  "miningArrays",
  "fusionPlants",
  "droneFactories",
  "powerRelays",
  "aiControlCentres",
] as const;
export type ForgeLocation = (typeof FORGE_LOCATIONS)[number];

/** Weather names (AF-060 §Weather) — seven registered, mapped totally onto AF-036's locked shelf. */
export const FORGE_WEATHER = [
  "electricalStorms",
  "plasmaRain",
  "steamClouds",
  "empWaves",
  "magneticWinds",
  "coolingVents",
  "ionDischarge",
] as const;
export type ForgeWeather = (typeof FORGE_WEATHER)[number];

export const FORGE_WEATHER_TO_ENGINE: Readonly<Record<ForgeWeather, WeatherKind>> = {
  electricalStorms: "voidLightning",
  plasmaRain: "solarStorms",
  steamClouds: "nebulaDrift",
  empWaves: "ionClouds",
  magneticWinds: "energyWinds",
  coolingVents: "nebulaDrift",
  ionDischarge: "ionClouds",
};

export const FORGE_HAZARD_KINDS = [
  "movingMachinery",
  "laserGrids",
  "crushingPresses",
  "moltenMetal",
  "electrifiedFloors",
  "assemblyArms",
  "powerSurges",
  "securityTurrets",
] as const;
export type ForgeHazardKind = (typeof FORGE_HAZARD_KINDS)[number];

/** Mission types (AF-060 §Mission Types) — eight registered; bind to AF-037 MissionDef content. */
export const FORGE_MISSION_TYPES = [
  "destroyFactories",
  "disableAI",
  "recoverPrototypeData",
  "sabotageProduction",
  "escortEngineers",
  "protectResearchers",
  "captureControlNodes",
  "deactivateReactors",
] as const;
export type ForgeMissionType = (typeof FORGE_MISSION_TYPES)[number];

export const FORGE_RESOURCES = [
  "machineComponents",
  "alloys",
  "quantumCircuits",
  "fusionCells",
  "aiCores",
  "prototypeParts",
  "industrialMaterials",
  "researchSamples",
] as const;
export type ForgeResource = (typeof FORGE_RESOURCES)[number];

export const FORGE_POI_KINDS = [
  "prototypeLaboratories",
  "aiArchives",
  "machineTemples",
  "manufacturingVaults",
  "orbitalShipyards",
  "controlSpires",
  "energyWells",
  "lostResearchFacilities",
] as const;
export type ForgePoiKind = (typeof FORGE_POI_KINDS)[number];

/** Biome event names (AF-060 §Biome Events) — eight registered, mapped totally onto the locked shelf. */
export const FORGE_EVENTS = [
  "factoryOverload",
  "productionSurge",
  "aiUprising",
  "reactorFailure",
  "prototypeActivation",
  "orbitalConstruction",
  "machineReinforcements",
  "emergencyShutdown",
] as const;
export type ForgeEvent = (typeof FORGE_EVENTS)[number];

export const FORGE_EVENT_TO_ENGINE: Readonly<Record<ForgeEvent, BiomeEventKind>> = {
  factoryOverload: "machineActivation",
  productionSurge: "machineActivation",
  aiUprising: "machineActivation",
  reactorFailure: "distressSignal",
  prototypeActivation: "prototypeWreckage",
  orbitalConstruction: "prototypeWreckage",
  machineReinforcements: "machineActivation",
  emergencyShutdown: "distressSignal",
};

export const FORGE_DISCOVERIES = [
  "hiddenBlueprints",
  "prototypeWeapons",
  "experimentalShips",
  "machineArchives",
  "lostScientists",
  "ancientFacilities",
  "secretAssemblyLines",
  "aiMemories",
] as const;
export type ForgeDiscovery = (typeof FORGE_DISCOVERIES)[number];

/** Boss encounters (AF-060 §Boss Encounters) — five registered; Adaptive War
 * Platform was already registered mini-boss vocabulary in AF-047. */
export const FORGE_BOSS_KINDS = ["factoryOverseer", "planetaryConstructor", "adaptiveWarPlatform", "orbitalForge", "machineIntelligenceCore"] as const;
export type ForgeBossKind = (typeof FORGE_BOSS_KINDS)[number];

export const LORE_MACHINE_EXPANSE_ARCHIVE = "LORE_MACHINE_EXPANSE_ARCHIVE";

/** The Machine Expanse — a plain AF-036 BiomeDef over the locked engine.
 * Enemy presence follows the spec: Machine Collective primary, Paragon
 * Protocol, Ancient Custodians, occasional Outlaws, rare Void corruption. */
export const MACHINE_EXPANSE_BIOME: BiomeDef = {
  id: "machine-expanse",
  name: "Forge Primus",
  lore: "The factory noticed you eleven minutes ago. It has not stopped working. It has never stopped working. You are simply not yet a scheduled task.",
  coreBiome: "machineWorlds",
  conditions: ["machineActivity", "empFields", "ionStorms"],
  hazards: [
    {
      // Laser Grids — the foundry's security lattice (AF-035's exact engine).
      id: "forge-laser-grid",
      x: 18,
      y: 12,
      radius: 2.6,
      tickIntervalMs: 750,
      damagePerTick: 5,
      statusOnTick: { kind: "shock", strength: 4, durationMs: 1400 },
    },
    {
      // Molten Metal — a refining channel that never cooled.
      id: "forge-molten-channel",
      x: 40,
      y: 22,
      radius: 2.8,
      tickIntervalMs: 900,
      damagePerTick: 6,
      statusOnTick: { kind: "burn", strength: 4, durationMs: 1800 },
    },
    {
      // Crushing Presses — the assembly line does not check for visitors.
      id: "forge-press-line",
      x: 30,
      y: 30,
      radius: 2.2,
      tickIntervalMs: 1100,
      damagePerTick: 9,
      statusOnTick: null,
    },
  ],
  weather: [
    { kind: "voidLightning", durationMs: 9000, windForceX: 0, windForceY: 0, reducedVisibility: false }, // Electrical Storms
    { kind: "ionClouds", durationMs: 10000, windForceX: -0.3, windForceY: 0.2, reducedVisibility: true }, // EMP Waves
    { kind: "energyWinds", durationMs: 11000, windForceX: 0.8, windForceY: 0, reducedVisibility: false }, // Magnetic Winds
  ],
  events: [
    { kind: "machineActivation", weight: 5 }, // Factory Overload / Production Surge / AI Uprising / Reinforcements
    { kind: "prototypeWreckage", weight: 3 }, // Prototype Activation / Orbital Construction
    { kind: "distressSignal", weight: 2 }, // Reactor Failure / Emergency Shutdown
    { kind: "factionConflict", weight: 1 }, // occasional Outlaw salvage raids
  ],
  // Machine components/alloys/AI cores/prototype parts → engineering progression (§Resource Distribution).
  resourceWeights: { craftingMaterial: 2.2, blueprint: 1.8, researchSample: 1.5, equipment: 1.2, weapon: 1.1 },
  enemyIds: [
    "machine-combat-drone",
    "machine-sniper-unit",
    "machine-shield-generator",
    "machine-repair-drone",
    "machine-swarm-constructor",
    "machine-command-core",
    "prototype-drone",
    "pulse-cannon",
    "defence-drone",
    "outlaw-raider",
    "void-wisp",
  ],
  eliteChance: 0.16,
  bossId: null, // the five forge boss kinds are registered vocabulary — they bind as AF-035 BossDefs when authored
  enemyBuff: { kind: "shieldCapacity", value: 12 }, // factory-maintained hulls — the live AF-036 buff hook
  hazardImmunities: ["shock", "burn"], // the foundry does not harm its own machines
  interactables: [
    {
      id: "forge-primus-ai-archive",
      kind: "activateAncientDevice",
      x: 26,
      y: 18,
      radius: 1.5,
      discoveryCategory: "lore",
      discoveryId: LORE_MACHINE_EXPANSE_ARCHIVE,
    },
    {
      id: "forge-primus-assembly-cache",
      kind: "harvestResource",
      x: 12,
      y: 26,
      radius: 1.2,
      discoveryCategory: null,
      discoveryId: null,
    },
    {
      id: "forge-primus-security-node",
      kind: "disableHazard",
      x: 46,
      y: 10,
      radius: 1.4,
      discoveryCategory: null,
      discoveryId: null,
    },
  ],
  threatModifier: 1.25, // the deepest of the three authored biomes — infiltration, not tourism
};
