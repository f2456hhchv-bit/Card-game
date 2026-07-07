/**
 * Biome data shapes (AF-036). Resource Distribution reuses AF-023's exact
 * `DropContext.smartLoot.categoryWeights` hook (reserved, never given a
 * producer until now); Environmental Hazards reuse AF-035's HazardZone
 * engine; Weather reuses AF-020's MovementModifier "force" kind (reserved
 * for "gravity, wind, currents"); Enemy Integration reuses AF-028's
 * EquipmentBonus shape and AF-021's StatusEngine.setImmunity; Biome Events
 * extend AF-017's existing EnvironmentalEventTriggered bus event rather
 * than inventing a second one. No second loot, hazard, movement, bonus, or
 * event system.
 */
import type { EquipmentBonus } from "../equipment/equipmentData";
import type { StatusKind } from "../combat/combatTuning";
import type { LootCategory } from "../loot/lootTuning";
import type { HazardZoneDef } from "../bosses/BossArena";
import type { CollectionCategory } from "../meta/metaData";

export const CORE_BIOMES = [
  "frontierSystems",
  "crystalFields",
  "machineWorlds",
  "solarWastes",
  "frozenNebulae",
  "voidRegions",
  "ancientRuins",
  "derelictFleets",
  "livingEcosystems",
  "blackHoleSystems",
  "quantumStorms",
] as const;
export type CoreBiome = (typeof CORE_BIOMES)[number];

export const ENVIRONMENTAL_CONDITIONS = [
  "solarRadiation",
  "gravityDistortion",
  "crystalGrowth",
  "nebulaFog",
  "ionStorms",
  "empFields",
  "asteroidDrift",
  "voidCorruption",
  "machineActivity",
  "ancientEnergy",
] as const;
export type EnvironmentalCondition = (typeof ENVIRONMENTAL_CONDITIONS)[number];

export const BIOME_EVENT_KINDS = [
  "distressSignal",
  "ancientVault",
  "lostExpedition",
  "machineActivation",
  "crystalBloom",
  "solarFlare",
  "voidBreach",
  "wanderingMerchant",
  "prototypeWreckage",
  "factionConflict",
] as const;
export type BiomeEventKind = (typeof BIOME_EVENT_KINDS)[number];

export const WEATHER_KINDS = [
  "solarStorms",
  "crystalRain",
  "meteorActivity",
  "nebulaDrift",
  "voidLightning",
  "energyWinds",
  "ionClouds",
] as const;
export type WeatherKind = (typeof WEATHER_KINDS)[number];

export const INTERACTION_KINDS = [
  "activateAncientDevice",
  "destroyObstacle",
  "openHiddenArea",
  "triggerEvent",
  "harvestResource",
  "disableHazard",
  "unlockSecret",
] as const;
export type InteractionKind = (typeof INTERACTION_KINDS)[number];

export interface BiomeEventDef {
  kind: BiomeEventKind;
  /** Relative weight for the seeded weighted pick — not a probability on its own. */
  weight: number;
}

/** Reuses AF-020's MovementModifier "force" kind — Weather doesn't reimplement wind/gravity. */
export interface WeatherDef {
  kind: WeatherKind;
  durationMs: number;
  windForceX: number;
  windForceY: number;
  /** Content-authoring flag only — actual reduction is a presentation-layer concern. */
  reducedVisibility: boolean;
}

export interface InteractableDef {
  id: string;
  kind: InteractionKind;
  x: number;
  y: number;
  radius: number;
  discoveryCategory: CollectionCategory | null;
  discoveryId: string | null;
}

export interface BiomeDef {
  id: string;
  name: string;
  lore: string;
  coreBiome: CoreBiome;
  conditions: readonly EnvironmentalCondition[];
  /** AF-035's exact hazard-zone shape — a biome hazard IS a HazardZoneDef. */
  hazards: readonly HazardZoneDef[];
  weather: readonly WeatherDef[];
  events: readonly BiomeEventDef[];
  /** Feeds AF-023's DropContext.smartLoot.categoryWeights directly — no second loot bias system. */
  resourceWeights: Partial<Record<LootCategory, number>>;
  enemyIds: readonly string[];
  eliteChance: number;
  bossId: string | null;
  /** Applied to every enemy spawned in this biome — the same EquipmentBonus shape everything else uses. */
  enemyBuff: EquipmentBonus | null;
  /** Enemies native to this biome ignore these statuses — reuses StatusEngine.setImmunity. */
  hazardImmunities: readonly StatusKind[];
  interactables: readonly InteractableDef[];
  /** Feeds AF-017's existing ThreatInputs.biomeModifier — no Director change. */
  threatModifier: number;
}

/** Sandbox biome — proves the hazard/weather/event/resource-weight/enemy-integration/interaction engine. */
export const SANDBOX_BIOMES: readonly BiomeDef[] = [
  {
    id: "crystal-fields-alpha",
    name: "Crystal Fields",
    lore: "Silicate growths climb toward starlight that hasn't reached this system in a thousand years.",
    coreBiome: "crystalFields",
    conditions: ["crystalGrowth", "solarRadiation"],
    hazards: [
      {
        id: "crystal-fields-shard-cluster",
        x: 20,
        y: 12,
        radius: 3,
        tickIntervalMs: 900,
        damagePerTick: 5,
        statusOnTick: { kind: "shock", strength: 4, durationMs: 1400 },
      },
    ],
    weather: [
      { kind: "crystalRain", durationMs: 12000, windForceX: 0, windForceY: 0, reducedVisibility: false },
      { kind: "ionClouds", durationMs: 9000, windForceX: 0.6, windForceY: -0.3, reducedVisibility: true },
    ],
    events: [
      { kind: "crystalBloom", weight: 5 },
      { kind: "ancientVault", weight: 2 },
      { kind: "wanderingMerchant", weight: 3 },
      { kind: "prototypeWreckage", weight: 1 },
    ],
    resourceWeights: { craftingMaterial: 2, relic: 1.5, ancientArtifact: 1.3 },
    enemyIds: ["wisp-chaser", "flak-orbiter"],
    eliteChance: 0.12,
    bossId: "hollow-sentinel",
    enemyBuff: { kind: "shieldCapacity", value: 8 },
    hazardImmunities: ["shock"],
    interactables: [
      {
        id: "crystal-fields-ancient-console",
        kind: "activateAncientDevice",
        x: 26,
        y: 20,
        radius: 1.5,
        discoveryCategory: "lore",
        discoveryId: "LORE_CRYSTAL_CONSOLE",
      },
      {
        id: "crystal-fields-vein",
        kind: "harvestResource",
        x: 12,
        y: 24,
        radius: 1.2,
        discoveryCategory: null,
        discoveryId: null,
      },
    ],
    threatModifier: 1.1,
  },
];
