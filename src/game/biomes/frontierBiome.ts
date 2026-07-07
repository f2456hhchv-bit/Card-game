/**
 * Human Frontier biome content (AF-058). The first full biome authored on
 * AF-036's locked engine — a CONTENT module: `HUMAN_FRONTIER_BIOME` is a
 * plain `BiomeDef`, its hazards ARE AF-035 hazard zones, its weather uses
 * AF-020's force kinds through AF-036's WeatherDef, its events weight
 * AF-036's locked BiomeEventKind shelf, and its resource bias feeds
 * AF-023's smart-loot hook. The module's own vocabulary (locations,
 * weather names, mission types, resources, POIs, discoveries, bosses) is
 * registered here as naming layers with explicit total mappings onto the
 * locked shelves — the same Nth-naming-layer discipline every faction
 * module used over EnvironmentalEventTriggered. AF-058 also gives AF-038's
 * `StarSystemDef.biomeId` field its FIRST CONSUMER: the run's biome now
 * follows the galaxy, and a new humanFrontier region + system carry this
 * biome reachably.
 */
import type { BiomeDef, BiomeEventKind, WeatherKind } from "./biomeData";

/** Environment locations (AF-058 §Environment) — ten registered; bind as arena/mission content. */
export const FRONTIER_LOCATIONS = [
  "tradeStations",
  "miningColonies",
  "cargoConvoys",
  "shipyards",
  "researchOutposts",
  "asteroidFields",
  "communicationArrays",
  "orbitalHabitats",
  "solarFarms",
  "frontierGates",
] as const;
export type FrontierLocation = (typeof FRONTIER_LOCATIONS)[number];

/** Weather names (AF-058 §Weather) — seven registered, each mapped totally onto AF-036's locked WeatherKind shelf. */
export const FRONTIER_WEATHER = [
  "solarWinds",
  "debrisFields",
  "ionStorms",
  "microMeteorShowers",
  "radiationClouds",
  "engineExhaustFields",
  "electricalStorms",
] as const;
export type FrontierWeather = (typeof FRONTIER_WEATHER)[number];

export const FRONTIER_WEATHER_TO_ENGINE: Readonly<Record<FrontierWeather, WeatherKind>> = {
  solarWinds: "energyWinds",
  debrisFields: "nebulaDrift",
  ionStorms: "ionClouds",
  microMeteorShowers: "meteorActivity",
  radiationClouds: "solarStorms",
  engineExhaustFields: "nebulaDrift",
  electricalStorms: "voidLightning",
};

export const FRONTIER_HAZARD_KINDS = [
  "damagedStations",
  "explosiveFuelTanks",
  "minefields",
  "debrisBelts",
  "electricalArcs",
  "reactorLeaks",
  "navigationHazards",
] as const;
export type FrontierHazardKind = (typeof FRONTIER_HAZARD_KINDS)[number];

/** Mission types (AF-058 §Mission Types) — eight registered; bind to AF-037 MissionDef content. */
export const FRONTIER_MISSION_TYPES = [
  "escortConvoys",
  "protectColonies",
  "repairInfrastructure",
  "rescueSurvivors",
  "recoverTechnology",
  "eliminatePirates",
  "surveySystems",
  "restoreCommunications",
] as const;
export type FrontierMissionType = (typeof FRONTIER_MISSION_TYPES)[number];

export const FRONTIER_RESOURCES = [
  "ironAlloys",
  "energyCells",
  "electronics",
  "constructionMaterials",
  "fuel",
  "researchSamples",
  "civilianTechnology",
  "basicBlueprints",
] as const;
export type FrontierResource = (typeof FRONTIER_RESOURCES)[number];

export const FRONTIER_POI_KINDS = [
  "distressSignals",
  "abandonedStations",
  "miningOperations",
  "civilianSettlements",
  "prototypeWorkshops",
  "blackMarketOutposts",
  "navigationBeacons",
  "historicWrecks",
] as const;
export type FrontierPoiKind = (typeof FRONTIER_POI_KINDS)[number];

/** Biome event names (AF-058 §Biome Events) — eight registered, each mapped totally onto AF-036's locked BiomeEventKind shelf. */
export const FRONTIER_EVENTS = [
  "pirateRaids",
  "tradeConvoys",
  "civilianRescue",
  "stationRepairs",
  "miningAccidents",
  "solarActivity",
  "prototypeDeliveries",
  "factionPatrols",
] as const;
export type FrontierEvent = (typeof FRONTIER_EVENTS)[number];

export const FRONTIER_EVENT_TO_ENGINE: Readonly<Record<FrontierEvent, BiomeEventKind>> = {
  pirateRaids: "factionConflict",
  tradeConvoys: "wanderingMerchant",
  civilianRescue: "distressSignal",
  stationRepairs: "distressSignal",
  miningAccidents: "lostExpedition",
  solarActivity: "solarFlare",
  prototypeDeliveries: "prototypeWreckage",
  factionPatrols: "factionConflict",
};

export const FRONTIER_DISCOVERIES = [
  "hiddenCargo",
  "researchArchives",
  "lostExpeditions",
  "ancientRelays",
  "prototypeParts",
  "hiddenRoutes",
  "civilianStories",
  "loreObjects",
] as const;
export type FrontierDiscovery = (typeof FRONTIER_DISCOVERIES)[number];

/** Boss encounters (AF-058 §Boss Encounters) — five registered; bind to AF-035 BossDef content when authored. */
export const FRONTIER_BOSS_KINDS = ["pirateFlagship", "prototypeGunship", "mercenaryWarlord", "machineSiegePlatform", "corruptedCarrier"] as const;
export type FrontierBossKind = (typeof FRONTIER_BOSS_KINDS)[number];

export const LORE_HUMAN_FRONTIER_ARCHIVE = "LORE_HUMAN_FRONTIER_ARCHIVE";

/** The Human Frontier — a plain AF-036 BiomeDef over the locked engine.
 * Enemy presence follows the spec: Outlaws and Nomads primary, light
 * Machine activity, occasional Eclipsed, rare Ancient Guardians. */
export const HUMAN_FRONTIER_BIOME: BiomeDef = {
  id: "meridian-rest-frontier",
  name: "Meridian Rest",
  lore: "Half the station lights still work, and every one of them is on. The frontier rebuilds in public, so the dark can see it hasn't won.",
  coreBiome: "frontierSystems",
  conditions: ["asteroidDrift", "ionStorms", "solarRadiation"],
  hazards: [
    {
      // Debris Belts — industrial space's ambient danger (AF-035's exact engine).
      id: "frontier-debris-belt",
      x: 16,
      y: 10,
      radius: 3.2,
      tickIntervalMs: 850,
      damagePerTick: 4,
      statusOnTick: null,
    },
    {
      // Reactor Leaks — a damaged station bleeding heat.
      id: "frontier-reactor-leak",
      x: 42,
      y: 24,
      radius: 2.4,
      tickIntervalMs: 900,
      damagePerTick: 5,
      statusOnTick: { kind: "burn", strength: 3, durationMs: 1600 },
    },
  ],
  weather: [
    { kind: "energyWinds", durationMs: 11000, windForceX: 0.7, windForceY: 0.2, reducedVisibility: false }, // Solar Winds
    { kind: "meteorActivity", durationMs: 8000, windForceX: 0, windForceY: 0, reducedVisibility: false }, // Micro Meteor Showers
    { kind: "ionClouds", durationMs: 9000, windForceX: -0.4, windForceY: 0.3, reducedVisibility: true }, // Ion Storms
  ],
  events: [
    { kind: "distressSignal", weight: 5 }, // Civilian Rescue / Station Repairs
    { kind: "factionConflict", weight: 4 }, // Pirate Raids / Faction Patrols
    { kind: "wanderingMerchant", weight: 3 }, // Trade Convoys
    { kind: "lostExpedition", weight: 2 }, // Mining Accidents
    { kind: "solarFlare", weight: 2 }, // Solar Activity
    { kind: "prototypeWreckage", weight: 1 }, // Prototype Deliveries
  ],
  // Iron alloys/energy cells/construction/fuel → resource+craftingMaterial;
  // basic blueprints and research samples establish early progression (§Resource Distribution).
  resourceWeights: { resource: 2, craftingMaterial: 1.8, blueprint: 1.4, currency: 1.3, researchSample: 1.2 },
  enemyIds: [
    "outlaw-raider",
    "outlaw-sniper",
    "outlaw-captain",
    "scout-skiff",
    "hunter",
    "nomad-flagship",
    "machine-combat-drone",
    "lost-scout",
    "sentinel",
  ],
  eliteChance: 0.08,
  bossId: null, // the five frontier boss kinds are registered vocabulary — they bind as AF-035 BossDefs when authored
  enemyBuff: null, // the frontier's threat is composition and desperation, never a stat buff
  hazardImmunities: [], // nobody is native to a reactor leak — the frontier's dangers are honest
  interactables: [
    {
      id: "meridian-rest-archive",
      kind: "unlockSecret",
      x: 24,
      y: 18,
      radius: 1.5,
      discoveryCategory: "lore",
      discoveryId: LORE_HUMAN_FRONTIER_ARCHIVE,
    },
    {
      id: "meridian-rest-salvage-cache",
      kind: "harvestResource",
      x: 38,
      y: 8,
      radius: 1.2,
      discoveryCategory: null,
      discoveryId: null,
    },
    {
      id: "meridian-rest-nav-beacon",
      kind: "triggerEvent",
      x: 10,
      y: 28,
      radius: 1.4,
      discoveryCategory: null,
      discoveryId: null,
    },
  ],
  threatModifier: 0.9, // the introduction biome — dangerous, never punishing
};
