/**
 * Solar Wastes biome content (AF-063). The sixth full biome on AF-036's
 * locked engine — the AF-058→062 content-module shape applied to star
 * systems dying in public: a plain `BiomeDef` whose defining statement is
 * that THE ENVIRONMENT ITSELF IS THE GREATEST THREAT — the only authored
 * biome where every hazard zone carries a status effect (radiation as
 * AF-021's poison, plasma as burn, solar shockwaves as AF-053's overload —
 * its first biome-hazard use), whose weather rides AF-020's force kinds,
 * whose events weight the locked BiomeEventKind shelf with solarFlare
 * dominant, and whose vocabulary is naming layers with total mappings.
 * Overwhelming without being unfair: every danger is a readable zone with
 * a tick interval, and survival is positioning — the biome rewards planning.
 */
import type { BiomeDef, BiomeEventKind, WeatherKind } from "./biomeData";

/** Environment locations (AF-063 §Environment) — ten registered; bind as arena/mission content. */
export const WASTES_LOCATIONS = [
  "solarCorona",
  "moltenPlanets",
  "plasmaOceans",
  "stellarForges",
  "solarHarvesters",
  "burningShipyards",
  "heatFractures",
  "volcanicMoons",
  "radiationStations",
  "solarElevators",
] as const;
export type SolarWastesLocation = (typeof WASTES_LOCATIONS)[number];

/** Weather names (AF-063 §Weather) — seven registered, mapped totally onto AF-036's locked shelf. */
export const WASTES_WEATHER = [
  "solarFlares",
  "coronalMassEjections",
  "plasmaRain",
  "radiationStorms",
  "heatWaves",
  "magneticStorms",
  "fireTornadoes",
] as const;
export type SolarWastesWeather = (typeof WASTES_WEATHER)[number];

export const WASTES_WEATHER_TO_ENGINE: Readonly<Record<SolarWastesWeather, WeatherKind>> = {
  solarFlares: "solarStorms",
  coronalMassEjections: "solarStorms",
  plasmaRain: "crystalRain",
  radiationStorms: "ionClouds",
  heatWaves: "energyWinds",
  magneticStorms: "voidLightning",
  fireTornadoes: "energyWinds",
};

export const WASTES_HAZARD_KINDS = [
  "radiationFields",
  "solarBeams",
  "plasmaGeysers",
  "moltenDebris",
  "heatZones",
  "magneticCollapse",
  "explosiveGasClouds",
  "solarShockwaves",
] as const;
export type SolarWastesHazardKind = (typeof WASTES_HAZARD_KINDS)[number];

/** Mission types (AF-063 §Mission Types) — eight registered; bind to AF-037 MissionDef content. */
export const WASTES_MISSION_TYPES = [
  "stabiliseSolarArrays",
  "recoverEnergyTechnology",
  "rescueMiningTeams",
  "harvestStellarEnergy",
  "preventReactorMeltdown",
  "investigateStarCollapse",
  "protectResearchStations",
  "escapeSolarStorms",
] as const;
export type SolarWastesMissionType = (typeof WASTES_MISSION_TYPES)[number];

export const WASTES_RESOURCES = [
  "solarPlasma",
  "fusionCores",
  "thermalCrystals",
  "energyCells",
  "moltenAlloys",
  "radiationSamples",
  "stellarCatalysts",
  "advancedReactorComponents",
] as const;
export type SolarWastesResource = (typeof WASTES_RESOURCES)[number];

export const WASTES_POI_KINDS = [
  "solarHarvesters",
  "ancientForges",
  "heatVaults",
  "plasmaWells",
  "fusionReactors",
  "orbitalMirrors",
  "researchPlatforms",
  "collapsedMiningColonies",
] as const;
export type SolarWastesPoiKind = (typeof WASTES_POI_KINDS)[number];

/** Biome event names (AF-063 §Biome Events) — eight registered, mapped totally onto the locked shelf. */
export const WASTES_EVENTS = [
  "solarSuperflare",
  "reactorFailure",
  "coronalExpansion",
  "heatCascade",
  "radiationSurge",
  "magneticCollapse",
  "energyBloom",
  "starquake",
] as const;
export type SolarWastesEvent = (typeof WASTES_EVENTS)[number];

export const WASTES_EVENT_TO_ENGINE: Readonly<Record<SolarWastesEvent, BiomeEventKind>> = {
  solarSuperflare: "solarFlare",
  reactorFailure: "distressSignal",
  coronalExpansion: "solarFlare",
  heatCascade: "solarFlare",
  radiationSurge: "solarFlare",
  magneticCollapse: "distressSignal",
  energyBloom: "crystalBloom",
  starquake: "solarFlare",
};

export const WASTES_DISCOVERIES = [
  "experimentalReactors",
  "lostMiningFleets",
  "solarResearch",
  "ancientEnergyDevices",
  "fusionArchives",
  "prototypeWeapons",
  "hiddenForges",
  "legendaryComponents",
] as const;
export type SolarWastesDiscovery = (typeof WASTES_DISCOVERIES)[number];

/** Boss encounters (AF-063 §Boss Encounters) — five registered; the Living
 * Supernova is already a playable AF-054 Conclave entity in this very roster. */
export const WASTES_BOSS_KINDS = ["solarLeviathan", "fusionTitan", "livingSupernova", "forgeGuardian", "radiantColossus"] as const;
export type SolarWastesBossKind = (typeof WASTES_BOSS_KINDS)[number];

export const LORE_SOLAR_WASTES_ARCHIVE = "LORE_SOLAR_WASTES_ARCHIVE";

/** The Solar Wastes — a plain AF-036 BiomeDef over the locked engine.
 * Enemy presence follows the spec: Machine Collective and Human Outlaws
 * primary (salvage wars under a dying sun), Celestial Conclave, Paragon
 * Protocol, rare Void entities. Environmental danger remains constant. */
export const SOLAR_WASTES_BIOME: BiomeDef = {
  id: "solar-wastes",
  name: "Cinderfall",
  lore: "The star has perhaps ten thousand years left, which is nothing. Everyone who could leave, left. Everyone still here is fighting over what the leavers couldn't carry.",
  coreBiome: "solarWastes",
  conditions: ["solarRadiation", "ionStorms", "asteroidDrift"],
  // The environment itself is the greatest threat: the only authored biome
  // where EVERY hazard zone carries a status effect.
  hazards: [
    {
      // Radiation Fields — sickness that follows you out of the zone (AF-021's poison).
      id: "waste-radiation-field",
      x: 18,
      y: 14,
      radius: 3.0,
      tickIntervalMs: 850,
      damagePerTick: 4,
      statusOnTick: { kind: "poison", strength: 4, durationMs: 2400 },
    },
    {
      // Plasma Geysers — the planet venting its own mantle (heavy burn).
      id: "waste-plasma-geyser",
      x: 42,
      y: 22,
      radius: 2.4,
      tickIntervalMs: 900,
      damagePerTick: 7,
      statusOnTick: { kind: "burn", strength: 5, durationMs: 2000 },
    },
    {
      // Solar Shockwaves — the dying star scrambling ship systems (AF-053's
      // overload status, its first use as a biome hazard).
      id: "waste-solar-shockwave",
      x: 30,
      y: 34,
      radius: 2.8,
      tickIntervalMs: 1000,
      damagePerTick: 5,
      statusOnTick: { kind: "overload", strength: 3, durationMs: 1600 },
    },
  ],
  weather: [
    { kind: "solarStorms", durationMs: 10000, windForceX: 0, windForceY: 0, reducedVisibility: false }, // Solar Flares / CMEs
    { kind: "ionClouds", durationMs: 9000, windForceX: 0.2, windForceY: 0.3, reducedVisibility: true }, // Radiation Storms (ash clouds)
    { kind: "energyWinds", durationMs: 11000, windForceX: 1.0, windForceY: 0.2, reducedVisibility: false }, // Heat Waves / Fire Tornadoes
  ],
  events: [
    { kind: "solarFlare", weight: 5 }, // Superflare / Coronal Expansion / Heat Cascade / Radiation Surge / Starquake
    { kind: "distressSignal", weight: 2 }, // Reactor Failure / Magnetic Collapse — someone always needs rescuing
    { kind: "factionConflict", weight: 2 }, // Machines and Outlaws fighting over the salvage
    { kind: "crystalBloom", weight: 1 }, // Energy Bloom — the star gives as well as takes
  ],
  // Solar plasma/fusion cores/energy cells → high-tier technology fuel (§Resource Distribution).
  resourceWeights: { resource: 2.2, craftingMaterial: 1.8, equipment: 1.6, researchSample: 1.4, blueprint: 1.2 },
  enemyIds: [
    "machine-combat-drone",
    "machine-sniper-unit",
    "machine-repair-drone",
    "outlaw-raider",
    "outlaw-sniper",
    "outlaw-mine-layer",
    "solar-spark",
    "corona-guardian",
    "living-supernova",
    "energy-construct",
    "void-wisp",
  ],
  eliteChance: 0.15,
  bossId: null, // the five waste boss kinds are registered vocabulary — the Living Supernova already fights here as an AF-054 entity
  enemyBuff: { kind: "shieldCapacity", value: 12 }, // thermal shielding — nothing survives Cinderfall unhardened
  hazardImmunities: ["burn", "poison"], // the natives were forged under this sun
  interactables: [
    {
      id: "cinderfall-ancient-forge",
      kind: "activateAncientDevice",
      x: 26,
      y: 18,
      radius: 1.5,
      discoveryCategory: "lore",
      discoveryId: LORE_SOLAR_WASTES_ARCHIVE,
    },
    {
      id: "cinderfall-plasma-well",
      kind: "harvestResource",
      x: 12,
      y: 28,
      radius: 1.2,
      discoveryCategory: null,
      discoveryId: null,
    },
    {
      // Orbital Mirrors — redirect the harvester's focus and the beam goes out.
      id: "cinderfall-orbital-mirror",
      kind: "disableHazard",
      x: 46,
      y: 10,
      radius: 1.4,
      discoveryCategory: null,
      discoveryId: null,
    },
  ],
  threatModifier: 1.3, // between the Forge and the Void — the star is the enemy here, not the factions
};
