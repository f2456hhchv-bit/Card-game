/**
 * Derelict Expanse biome content (AF-065). The eighth full biome on
 * AF-036's locked engine — the AF-058→064 content-module shape applied to
 * the galaxy's largest starship graveyard, and the first biome whose
 * identity is EXPLORATION OVER COMBAT, made structural: the most
 * interactables of any authored biome (four — every wreck tells a story
 * you can touch), the first biome to weight shipComponent loot (salvage
 * IS the reward), the first with TWO visibility-reducing weathers (radio
 * interference and sensor ghosts — quiet abandonment you can't see
 * through), and hazards that emerge from destruction itself: a statusless
 * hull explosion, a burning reactor leak, and a grinding debris field
 * giving AF-021's armourBreak status its FIRST biome-hazard producer.
 * The event pool is led by distressSignal — some ships still transmit.
 */
import type { BiomeDef, BiomeEventKind, WeatherKind } from "./biomeData";

/** Environment locations (AF-065 §Environment) — ten registered; bind as arena/mission content. */
export const WRECK_LOCATIONS = [
  "fleetGraveyards",
  "carrierWrecks",
  "derelictStations",
  "destroyedColonies",
  "cargoFields",
  "salvageZones",
  "brokenShipyards",
  "battleDebris",
  "communicationsArrays",
  "forgottenConvoys",
] as const;
export type DerelictExpanseLocation = (typeof WRECK_LOCATIONS)[number];

/** Weather names (AF-065 §Weather) — seven registered, mapped totally onto AF-036's locked shelf. */
export const WRECK_WEATHER = [
  "debrisStorms",
  "electromagneticClouds",
  "microMeteorFields",
  "staticDisturbance",
  "sensorInterference",
  "powerFluctuations",
  "ionDust",
] as const;
export type DerelictExpanseWeather = (typeof WRECK_WEATHER)[number];

export const WRECK_WEATHER_TO_ENGINE: Readonly<Record<DerelictExpanseWeather, WeatherKind>> = {
  debrisStorms: "meteorActivity",
  electromagneticClouds: "ionClouds",
  microMeteorFields: "meteorActivity",
  staticDisturbance: "voidLightning",
  sensorInterference: "nebulaDrift",
  powerFluctuations: "voidLightning",
  ionDust: "ionClouds",
} as const;

export const WRECK_HAZARD_KINDS = [
  "hullExplosions",
  "reactorLeaks",
  "electricalDischarge",
  "floatingDebris",
  "brokenGravityFields",
  "radiationPockets",
  "fuelFires",
  "unstableWreckage",
] as const;
export type DerelictExpanseHazardKind = (typeof WRECK_HAZARD_KINDS)[number];

/** Mission types (AF-065 §Mission Types) — eight registered; bind to AF-037 MissionDef content. */
export const WRECK_MISSION_TYPES = [
  "recoverBlackBoxes",
  "rescueSurvivors",
  "salvageTechnology",
  "investigateDistressCalls",
  "recoverFleetRecords",
  "escortSalvageTeams",
  "exploreWrecks",
  "recoverAncientCargo",
] as const;
export type DerelictExpanseMissionType = (typeof WRECK_MISSION_TYPES)[number];

export const WRECK_RESOURCES = [
  "salvagedAlloys",
  "shipComponents",
  "recoveredAiCores",
  "militaryEquipment",
  "prototypeParts",
  "ancientTechnology",
  "fleetRecords",
  "rareRelics",
] as const;
export type DerelictExpanseResource = (typeof WRECK_RESOURCES)[number];

export const WRECK_POI_KINDS = [
  "ghostCarriers",
  "abandonedBridges",
  "cryoEscapePods",
  "fleetCommandShips",
  "prototypeHangars",
  "researchVessels",
  "cargoVaults",
  "emergencyBeacons",
] as const;
export type DerelictExpansePoiKind = (typeof WRECK_POI_KINDS)[number];

/** Biome event names (AF-065 §Biome Events) — eight registered, mapped totally onto the locked shelf. */
export const WRECK_EVENTS = [
  "emergencyBroadcast",
  "powerRestoration",
  "ghostSignal",
  "reactorDetonation",
  "fleetAwakening",
  "salvageRace",
  "distressResponse",
  "derelictCollapse",
] as const;
export type DerelictExpanseEvent = (typeof WRECK_EVENTS)[number];

export const WRECK_EVENT_TO_ENGINE: Readonly<Record<DerelictExpanseEvent, BiomeEventKind>> = {
  emergencyBroadcast: "distressSignal",
  powerRestoration: "machineActivation",
  ghostSignal: "distressSignal",
  reactorDetonation: "distressSignal",
  fleetAwakening: "machineActivation",
  salvageRace: "factionConflict",
  distressResponse: "distressSignal",
  derelictCollapse: "prototypeWreckage",
};

export const WRECK_DISCOVERIES = [
  "captainsLogs",
  "crewDiaries",
  "battleReports",
  "ancientFleetOrders",
  "prototypeExperiments",
  "legendaryWeapons",
  "hiddenHangars",
  "lostExpeditions",
] as const;
export type DerelictExpanseDiscovery = (typeof WRECK_DISCOVERIES)[number];

/** Boss encounters (AF-065 §Boss Encounters) — five registered; bind as BossDefs when authored. */
export const WRECK_BOSS_KINDS = ["ghostDreadnought", "corruptedCarrier", "fleetIntelligence", "salvageWarlord", "ancientFlagship"] as const;
export type DerelictExpanseBossKind = (typeof WRECK_BOSS_KINDS)[number];

export const LORE_DERELICT_EXPANSE_ARCHIVE = "LORE_DERELICT_EXPANSE_ARCHIVE";

/** The Derelict Expanse — a plain AF-036 BiomeDef over the locked engine.
 * Enemy presence follows the spec: the Eclipsed primary (these may be
 * their own fleets), Human Outlaws and Stellar Nomads working the salvage,
 * Machine Collective reclamation, rare Void Swarm. Enemies exploit
 * abandoned infrastructure; the wrecks themselves out-story all of them. */
export const DERELICT_EXPANSE_BIOME: BiomeDef = {
  id: "derelict-expanse",
  name: "Gravewake",
  lore: "Millions of ships, thousands of years of losing. Some still transmit. Some are still sealed. Nothing here was ever salvaged, and nobody who studies the Expanse can agree on why.",
  coreBiome: "derelictFleets",
  conditions: ["asteroidDrift", "empFields", "ionStorms"],
  // Hazards emerge naturally from destruction — the wrecks are still dying.
  hazards: [
    {
      // Hull Explosions — pressurised compartments letting go; the heaviest
      // single tick of any biome hazard, statusless and slow.
      id: "wreck-hull-explosion",
      x: 20,
      y: 12,
      radius: 2.4,
      tickIntervalMs: 1500,
      damagePerTick: 11,
      statusOnTick: null,
    },
    {
      // Reactor Leaks — drive cores that never fully died.
      id: "wreck-reactor-leak",
      x: 42,
      y: 24,
      radius: 2.6,
      tickIntervalMs: 900,
      damagePerTick: 4,
      statusOnTick: { kind: "burn", strength: 4, durationMs: 1800 },
    },
    {
      // Unstable Wreckage — grinding debris stripping plating (AF-021's
      // armourBreak status, its FIRST biome-hazard producer).
      id: "wreck-debris-grinder",
      x: 30,
      y: 34,
      radius: 2.8,
      tickIntervalMs: 1000,
      damagePerTick: 3,
      statusOnTick: { kind: "armourBreak", strength: 4, durationMs: 2200 },
    },
  ],
  // The first biome with TWO visibility-reducing weathers — radio
  // interference and sensor ghosts; quiet abandonment you can't see through.
  weather: [
    { kind: "meteorActivity", durationMs: 9000, windForceX: 0.3, windForceY: 0.2, reducedVisibility: false }, // Debris Storms
    { kind: "nebulaDrift", durationMs: 11000, windForceX: 0.1, windForceY: 0, reducedVisibility: true }, // Sensor Interference
    { kind: "ionClouds", durationMs: 10000, windForceX: -0.2, windForceY: 0.1, reducedVisibility: true }, // Electromagnetic Clouds
  ],
  events: [
    { kind: "distressSignal", weight: 5 }, // Emergency Broadcast / Ghost Signal / Distress Response — some ships still transmit
    { kind: "factionConflict", weight: 2 }, // Salvage Race — Outlaws and Nomads racing for the same hulk
    { kind: "prototypeWreckage", weight: 2 }, // Derelict Collapse — the wrecks keep breaking open
    { kind: "wanderingMerchant", weight: 1 }, // a Nomad trader working the graveyard
  ],
  // Ship components/salvaged alloys/recovered AI cores → exploration over
  // combat (§Resource Distribution): the first biome to weight shipComponent.
  resourceWeights: { shipComponent: 2.4, equipment: 1.8, craftingMaterial: 1.6, relic: 1.4, blueprint: 1.2 },
  enemyIds: [
    "lost-scout",
    "broken-pilot",
    "echo-drone",
    "fallen-guardian",
    "outlaw-raider",
    "outlaw-sniper",
    "junker-gunship",
    "repair-frigate",
    "machine-repair-drone",
    "machine-sniper-unit",
    "void-wisp",
  ],
  eliteChance: 0.13,
  bossId: null, // the five wreck boss kinds are registered vocabulary — they bind as AF-035 BossDefs when authored
  enemyBuff: { kind: "shieldCapacity", value: 8 }, // scavenged plating — everything here wears the dead fleets' armour
  hazardImmunities: ["armourBreak", "burn"], // the wrecks already took everything the Expanse could break
  // Exploration over combat, structurally: the most interactables of any
  // authored biome — every wreck tells a story you can touch.
  interactables: [
    {
      id: "gravewake-black-box-archive",
      kind: "activateAncientDevice",
      x: 28,
      y: 18,
      radius: 1.5,
      discoveryCategory: "lore",
      discoveryId: LORE_DERELICT_EXPANSE_ARCHIVE,
    },
    {
      id: "gravewake-salvage-cache",
      kind: "harvestResource",
      x: 12,
      y: 26,
      radius: 1.2,
      discoveryCategory: null,
      discoveryId: null,
    },
    {
      // Hidden Hangars — sealed since the battle ended.
      id: "gravewake-sealed-hangar",
      kind: "openHiddenArea",
      x: 46,
      y: 12,
      radius: 1.4,
      discoveryCategory: null,
      discoveryId: null,
    },
    {
      // Unstable Wreckage — sometimes the only way through is through.
      id: "gravewake-blocking-hulk",
      kind: "destroyObstacle",
      x: 36,
      y: 40,
      radius: 1.4,
      discoveryCategory: null,
      discoveryId: null,
    },
  ],
  threatModifier: 1.1, // the graveyard is quiet — between the Frontier and the Crystal Expanse; the danger is what you wake up
};
