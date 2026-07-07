/**
 * Crystal Expanse biome content (AF-059). The second full biome on AF-036's
 * locked engine — a CONTENT module in AF-058's exact shape: a plain
 * `BiomeDef` whose hazards ARE AF-035 zones, whose weather rides AF-020's
 * force kinds, whose events weight the locked BiomeEventKind shelf, and
 * whose vocabulary is naming layers with total mappings. The Expanse is the
 * Crystal Ascendancy's birthplace: peaceful-looking, highly dangerous —
 * resonance-hardened natives, shock-immune, under a threat modifier above
 * one. In-combat crystal GROWTH is already live through AF-048's Growth
 * Seeder and `growCrystalZone`; the biome's static formations are the
 * terrain those mechanics grow from.
 */
import type { BiomeDef, BiomeEventKind, WeatherKind } from "./biomeData";

/** Environment locations (AF-059 §Environment) — ten registered; bind as arena/mission content. */
export const EXPANSE_LOCATIONS = [
  "crystalForests",
  "resonanceFields",
  "prismaticCanyons",
  "floatingCrystalIslands",
  "livingCaverns",
  "energyRivers",
  "ancientCrystalTemples",
  "resonanceTowers",
  "crystalGardens",
  "planetaryHearts",
] as const;
export type ExpanseLocation = (typeof EXPANSE_LOCATIONS)[number];

/** Weather names (AF-059 §Weather) — seven registered, mapped totally onto AF-036's locked shelf. */
export const EXPANSE_WEATHER = [
  "crystalRain",
  "prismaticStorms",
  "energyWinds",
  "resonancePulses",
  "lightBloom",
  "crystalMist",
  "solarRefraction",
] as const;
export type ExpanseWeather = (typeof EXPANSE_WEATHER)[number];

export const EXPANSE_WEATHER_TO_ENGINE: Readonly<Record<ExpanseWeather, WeatherKind>> = {
  crystalRain: "crystalRain",
  prismaticStorms: "solarStorms",
  energyWinds: "energyWinds",
  resonancePulses: "voidLightning",
  lightBloom: "solarStorms",
  crystalMist: "nebulaDrift",
  solarRefraction: "solarStorms",
};

export const EXPANSE_HAZARD_KINDS = [
  "growingCrystalWalls",
  "reflectiveShards",
  "energyEruptions",
  "resonanceFields",
  "crystalExplosions",
  "collapsingFormations",
  "prismaticLasers",
  "livingTerrain",
] as const;
export type ExpanseHazardKind = (typeof EXPANSE_HAZARD_KINDS)[number];

/** Mission types (AF-059 §Mission Types) — eight registered; bind to AF-037 MissionDef content. */
export const EXPANSE_MISSION_TYPES = [
  "studyResonance",
  "recoverCrystalCores",
  "destroyGrowthNodes",
  "escortScientists",
  "stabiliseResonance",
  "exploreAncientTemples",
  "harvestResources",
  "defeatCrystalGuardians",
] as const;
export type ExpanseMissionType = (typeof EXPANSE_MISSION_TYPES)[number];

export const EXPANSE_RESOURCES = [
  "crystalEssence",
  "resonanceShards",
  "livingMinerals",
  "prismaticDust",
  "energyCrystals",
  "ancientComponents",
  "researchSamples",
  "rareEvolutionMaterials",
] as const;
export type ExpanseResource = (typeof EXPANSE_RESOURCES)[number];

export const EXPANSE_POI_KINDS = [
  "resonanceWells",
  "livingMonoliths",
  "ancientCrystalArchives",
  "energyBridges",
  "crystalBloomSites",
  "hiddenCaverns",
  "planetaryHeartChambers",
  "prismaticSanctuaries",
] as const;
export type ExpansePoiKind = (typeof EXPANSE_POI_KINDS)[number];

/** Biome event names (AF-059 §Biome Events) — eight registered, mapped totally onto the locked shelf. */
export const EXPANSE_EVENTS = [
  "crystalBloom",
  "planetaryResonance",
  "energySurge",
  "livingForestExpansion",
  "ancientTempleActivation",
  "resonanceCascade",
  "prismaticEclipse",
  "crystalMigration",
] as const;
export type ExpanseEvent = (typeof EXPANSE_EVENTS)[number];

export const EXPANSE_EVENT_TO_ENGINE: Readonly<Record<ExpanseEvent, BiomeEventKind>> = {
  crystalBloom: "crystalBloom",
  planetaryResonance: "solarFlare",
  energySurge: "solarFlare",
  livingForestExpansion: "crystalBloom",
  ancientTempleActivation: "ancientVault",
  resonanceCascade: "crystalBloom",
  prismaticEclipse: "solarFlare",
  crystalMigration: "lostExpedition",
};

export const EXPANSE_DISCOVERIES = [
  "hiddenCrystalSpecies",
  "ancientRecords",
  "prototypeTechnology",
  "resonanceExperiments",
  "livingRelics",
  "rareOrganisms",
  "planetaryMemories",
  "secretPathways",
] as const;
export type ExpanseDiscovery = (typeof EXPANSE_DISCOVERIES)[number];

/** Boss encounters (AF-059 §Boss Encounters) — five registered; the Crystal
 * Matriarch et al. were already registered mini-boss vocabulary in AF-048. */
export const EXPANSE_BOSS_KINDS = ["crystalMatriarch", "livingMonolith", "prismaticLeviathan", "planetaryHeartGuardian", "ancientResonator"] as const;
export type ExpanseBossKind = (typeof EXPANSE_BOSS_KINDS)[number];

export const LORE_CRYSTAL_EXPANSE_ARCHIVE = "LORE_CRYSTAL_EXPANSE_ARCHIVE";

/** The Crystal Expanse — a plain AF-036 BiomeDef over the locked engine.
 * Enemy presence follows the spec: Crystal Ascendancy primary, Ancient
 * Custodians, occasional Void corruption, rare Machine expeditions. */
export const CRYSTAL_EXPANSE_BIOME: BiomeDef = {
  id: "crystal-expanse",
  name: "Prismheart",
  lore: "The valley refracts your own running lights back at you in colours they never had. Nothing here is hostile until you forget it's all one organism.",
  coreBiome: "crystalFields",
  conditions: ["crystalGrowth", "solarRadiation", "ancientEnergy"],
  hazards: [
    {
      // Resonance Fields — the ecosystem's ambient charge (AF-035's exact engine).
      id: "expanse-resonance-field",
      x: 22,
      y: 14,
      radius: 3,
      tickIntervalMs: 800,
      damagePerTick: 5,
      statusOnTick: { kind: "shock", strength: 4, durationMs: 1500 },
    },
    {
      // Collapsing Formations — a canyon of shard-fall; in-combat GROWTH is
      // AF-048's Growth Seeder + growCrystalZone, already live over this terrain.
      id: "expanse-shardfall-canyon",
      x: 44,
      y: 26,
      radius: 2.6,
      tickIntervalMs: 950,
      damagePerTick: 6,
      statusOnTick: null,
    },
  ],
  weather: [
    { kind: "crystalRain", durationMs: 12000, windForceX: 0, windForceY: 0.3, reducedVisibility: false }, // Crystal Rain
    { kind: "solarStorms", durationMs: 9000, windForceX: 0, windForceY: 0, reducedVisibility: false }, // Prismatic Storms / Solar Refraction
    { kind: "nebulaDrift", durationMs: 10000, windForceX: 0.4, windForceY: -0.2, reducedVisibility: true }, // Crystal Mist
  ],
  events: [
    { kind: "crystalBloom", weight: 5 }, // Crystal Bloom / Living Forest Expansion / Resonance Cascade
    { kind: "ancientVault", weight: 3 }, // Ancient Temple Activation
    { kind: "solarFlare", weight: 2 }, // Planetary Resonance / Energy Surge / Prismatic Eclipse
    { kind: "lostExpedition", weight: 2 }, // Crystal Migration
    { kind: "voidBreach", weight: 1 }, // Occasional Void Corruption
    { kind: "machineActivation", weight: 1 }, // Rare Machine Expeditions
  ],
  // Crystal essence/resonance shards/living minerals → advanced progression (§Resource Distribution).
  resourceWeights: { craftingMaterial: 2, relic: 1.6, ancientArtifact: 1.5, researchSample: 1.3, resource: 1.2 },
  enemyIds: [
    "crystal-drone",
    "crystal-shard-hunter",
    "crystal-resonance-node",
    "crystal-growth-seeder",
    "crystal-guardian",
    "crystal-titan",
    "sentinel",
    "defence-drone",
    "void-wisp",
    "machine-sniper-unit",
  ],
  eliteChance: 0.14,
  bossId: "hollow-sentinel", // the one authored BossDef — an ancient guardian in a temple; the five Expanse boss kinds are registered
  enemyBuff: { kind: "shieldCapacity", value: 10 }, // resonance-hardened natives — the live AF-036 buff hook
  hazardImmunities: ["shock"], // the ecosystem does not shock itself
  interactables: [
    {
      id: "prismheart-resonance-well",
      kind: "activateAncientDevice",
      x: 28,
      y: 20,
      radius: 1.5,
      discoveryCategory: "lore",
      discoveryId: LORE_CRYSTAL_EXPANSE_ARCHIVE,
    },
    {
      id: "prismheart-bloom-site",
      kind: "harvestResource",
      x: 14,
      y: 26,
      radius: 1.2,
      discoveryCategory: null,
      discoveryId: null,
    },
    {
      id: "prismheart-hidden-cavern",
      kind: "openHiddenArea",
      x: 50,
      y: 12,
      radius: 1.4,
      discoveryCategory: null,
      discoveryId: null,
    },
  ],
  threatModifier: 1.15, // beautiful, and not safe
};
