/**
 * Living Ecospheres biome content (AF-066). The ninth full biome on
 * AF-036's locked engine — the AF-058→065 content-module shape applied to
 * worlds that evolved into single superorganisms, and the deliberate
 * INVERSE of AF-064's stillness: where the Reach is the quietest biome,
 * the Ecosphere is the most ALIVE, asserted — the richest event pool of
 * any authored biome (seven defs; the planet is always doing something)
 * and the fastest hazard tick of any biome (a carnivorous grove snapping
 * at 600ms — the terrain is hungry). Hazards emerge from biology: toxic
 * spores (poison), grasping root traps (slow), and the grove's statusless
 * bite. Everything serves the planetary organism, including the numbers:
 * the highest researchSample weight of any biome (biology IS research),
 * natives the ecosystem does not eat, and the Hive fighting at home.
 */
import type { BiomeDef, BiomeEventKind, WeatherKind } from "./biomeData";

/** Environment locations (AF-066 §Environment) — ten registered; bind as arena/mission content. */
export const ECO_LOCATIONS = [
  "livingForests",
  "rootNetworks",
  "organicMountains",
  "sentientRivers",
  "sporeFields",
  "symbioticValleys",
  "bioengineeredJungles",
  "planetaryHearts",
  "livingCaverns",
  "evolutionGardens",
] as const;
export type EcosphereLocation = (typeof ECO_LOCATIONS)[number];

/** Weather names (AF-066 §Weather) — seven registered, mapped totally onto AF-036's locked shelf. */
export const ECO_WEATHER = [
  "sporeStorms",
  "pollenClouds",
  "bioluminescentRain",
  "livingFog",
  "photosyntheticBloom",
  "seedWinds",
  "organicLightning",
] as const;
export type EcosphereWeather = (typeof ECO_WEATHER)[number];

export const ECO_WEATHER_TO_ENGINE: Readonly<Record<EcosphereWeather, WeatherKind>> = {
  sporeStorms: "nebulaDrift",
  pollenClouds: "nebulaDrift",
  bioluminescentRain: "crystalRain",
  livingFog: "nebulaDrift",
  photosyntheticBloom: "solarStorms",
  seedWinds: "energyWinds",
  organicLightning: "voidLightning",
};

export const ECO_HAZARD_KINDS = [
  "carnivorousFlora",
  "toxicSpores",
  "livingVines",
  "rootTraps",
  "acidSap",
  "sporeBursts",
  "collapsingGrowth",
  "organicAmbushes",
] as const;
export type EcosphereHazardKind = (typeof ECO_HAZARD_KINDS)[number];

/** Mission types (AF-066 §Mission Types) — eight registered; bind to AF-037 MissionDef content. */
export const ECO_MISSION_TYPES = [
  "studyEcosystems",
  "protectResearchers",
  "harvestSamples",
  "destroyParasites",
  "restoreBalance",
  "investigateEvolution",
  "recoverAncientSeeds",
  "rescueExplorers",
] as const;
export type EcosphereMissionType = (typeof ECO_MISSION_TYPES)[number];

export const ECO_RESOURCES = [
  "organicTissue",
  "geneticSamples",
  "livingFibres",
  "biomass",
  "evolutionCatalysts",
  "ancientSeeds",
  "researchSpecimens",
  "rareBiologicalMaterials",
] as const;
export type EcosphereResource = (typeof ECO_RESOURCES)[number];

export const ECO_POI_KINDS = [
  "planetaryHeart",
  "evolutionPools",
  "ancientBioLabs",
  "livingTemples",
  "seedVaults",
  "symbiosisChambers",
  "organicArchives",
  "giganticRootSystems",
] as const;
export type EcospherePoiKind = (typeof ECO_POI_KINDS)[number];

/** Biome event names (AF-066 §Biome Events) — eight registered, mapped totally onto the locked shelf. */
export const ECO_EVENTS = [
  "massBloom",
  "migration",
  "predatorEmergence",
  "planetaryPulse",
  "sporeSeason",
  "evolutionSurge",
  "symbiosisShift",
  "ancientAwakening",
] as const;
export type EcosphereEvent = (typeof ECO_EVENTS)[number];

export const ECO_EVENT_TO_ENGINE: Readonly<Record<EcosphereEvent, BiomeEventKind>> = {
  massBloom: "crystalBloom",
  migration: "lostExpedition",
  predatorEmergence: "factionConflict",
  planetaryPulse: "solarFlare",
  sporeSeason: "crystalBloom",
  evolutionSurge: "prototypeWreckage",
  symbiosisShift: "crystalBloom",
  ancientAwakening: "ancientVault",
};

export const ECO_DISCOVERIES = [
  "unknownSpecies",
  "ancientGeneticRecords",
  "evolutionExperiments",
  "lostResearchTeams",
  "prototypeOrganisms",
  "planetaryMemories",
  "legendarySeeds",
  "livingRelics",
] as const;
export type EcosphereDiscovery = (typeof ECO_DISCOVERIES)[number];

/** Boss encounters (AF-066 §Boss Encounters) — five registered; the Hive
 * Sovereign's faction already fights here as the full AF-051 roster. */
export const ECO_BOSS_KINDS = ["planetaryHeart", "hiveSovereign", "ancientBloom", "worldRootGuardian", "evolutionColossus"] as const;
export type EcosphereBossKind = (typeof ECO_BOSS_KINDS)[number];

export const LORE_LIVING_ECOSPHERES_ARCHIVE = "LORE_LIVING_ECOSPHERES_ARCHIVE";

/** The Living Ecospheres — a plain AF-036 BiomeDef over the locked engine.
 * Enemy presence follows the spec: the Bio-Engineered Hive primary (the
 * full AF-051 roster, fighting at home), Crystal Ascendancy (the other
 * living doctrine), environmental wildlife (the same organisms — the
 * fauna IS the faction), rare Void corruption, occasional Custodians. */
export const LIVING_ECOSPHERES_BIOME: BiomeDef = {
  id: "living-ecospheres",
  name: "Verdance",
  lore: "The planet noticed you before you made orbit. The forests are its nerves, the rivers its blood, the wildlife its immune system. You are not exploring it. It is examining you.",
  coreBiome: "livingEcosystems",
  conditions: ["nebulaFog", "crystalGrowth", "ancientEnergy"],
  // Hazards emerge naturally from biology — and the terrain is hungry.
  hazards: [
    {
      // Carnivorous Flora — the fastest hazard tick of any authored biome;
      // the grove snaps, and keeps snapping.
      id: "eco-carnivorous-grove",
      x: 20,
      y: 14,
      radius: 2.2,
      tickIntervalMs: 600,
      damagePerTick: 4,
      statusOnTick: null,
    },
    {
      // Toxic Spores — the planet's immune response (AF-021's poison).
      id: "eco-spore-field",
      x: 42,
      y: 22,
      radius: 3.0,
      tickIntervalMs: 900,
      damagePerTick: 3,
      statusOnTick: { kind: "poison", strength: 4, durationMs: 2400 },
    },
    {
      // Root Traps — the undergrowth grasping at engines (AF-021's slow).
      id: "eco-root-trap",
      x: 30,
      y: 34,
      radius: 2.6,
      tickIntervalMs: 1100,
      damagePerTick: 3,
      statusOnTick: { kind: "slow", strength: 2, durationMs: 2000 },
    },
  ],
  weather: [
    { kind: "crystalRain", durationMs: 10000, windForceX: 0, windForceY: 0.2, reducedVisibility: false }, // Bioluminescent Rain
    { kind: "nebulaDrift", durationMs: 11000, windForceX: 0.2, windForceY: 0.1, reducedVisibility: true }, // Living Fog / Spore Storms
    { kind: "energyWinds", durationMs: 9000, windForceX: 0.7, windForceY: -0.2, reducedVisibility: false }, // Seed Winds
  ],
  // The richest event pool of any authored biome — seven defs; a living
  // planet is always doing something.
  events: [
    { kind: "crystalBloom", weight: 5 }, // Mass Bloom / Spore Season / Symbiosis Shift
    { kind: "lostExpedition", weight: 2 }, // Migration — and the research teams that followed it
    { kind: "distressSignal", weight: 2 }, // Rescue Explorers — the planet keeps what wanders
    { kind: "ancientVault", weight: 2 }, // Ancient Awakening — the bio labs beneath the roots
    { kind: "prototypeWreckage", weight: 1 }, // Evolution Surge — prototype organisms
    { kind: "factionConflict", weight: 1 }, // Predator Emergence — the food web at work
    { kind: "solarFlare", weight: 1 }, // Planetary Pulse — the world drinking its star
  ],
  // Genetic samples/evolution catalysts → advanced biological technologies:
  // the highest researchSample weight of any biome — biology IS research.
  resourceWeights: { researchSample: 2.4, craftingMaterial: 1.8, resource: 1.4, ancientArtifact: 1.2, blueprint: 1.0 },
  enemyIds: [
    "hive-drone",
    "spitter",
    "stalker",
    "evolution-node",
    "crusher",
    "living-titan",
    "crystal-drone",
    "crystal-shard-hunter",
    "corruption-parasite",
    "guardian-sphere",
  ],
  eliteChance: 0.14,
  bossId: null, // the five ecosphere boss kinds are registered vocabulary — the Hive Sovereign's court already fights here
  enemyBuff: { kind: "shieldCapacity", value: 11 }, // symbiotic carapace — the planet armours what belongs to it
  hazardImmunities: ["poison", "slow"], // the ecosystem does not eat its own
  interactables: [
    {
      id: "verdance-organic-archive",
      kind: "activateAncientDevice",
      x: 28,
      y: 18,
      radius: 1.5,
      discoveryCategory: "lore",
      discoveryId: LORE_LIVING_ECOSPHERES_ARCHIVE,
    },
    {
      id: "verdance-seed-vault",
      kind: "harvestResource",
      x: 12,
      y: 28,
      radius: 1.2,
      discoveryCategory: null,
      discoveryId: null,
    },
    {
      // Symbiosis Chambers — provoke the planet and see what it answers with.
      id: "verdance-symbiosis-chamber",
      kind: "triggerEvent",
      x: 46,
      y: 12,
      radius: 1.4,
      discoveryCategory: null,
      discoveryId: null,
    },
  ],
  threatModifier: 1.28, // a living world defending itself — between the Forge and the dying suns
};
