/**
 * Crystal Ascendancy faction content (AF-048). The third enemy faction,
 * built like AF-046/047: every unit is a plain AF-033 `EnemyDef`. Where
 * Outlaw squads SCATTER (fear) and Machine networks DEGRADE in discrete
 * steps (logic), the Crystal Ecosystem WEAKENS continuously — resonance
 * strength scales with how many living nodes remain, no state machine at
 * all. The faction IS AF-039's already-profiled Crystal Dominion — zero
 * new lore. Crystal Growth reuses AF-035's exact hazard-zone engine (a
 * growing crystal-forest hazard), the same reuse AF-046's mines and
 * AF-036's biome hazards already made.
 */
import type { EnemyDef } from "./enemyData";
import type { HazardZoneDef } from "../bosses/BossArena";

/** Core Units — thirteen registered; six carry full sandbox defs today. */
export const CRYSTAL_UNIT_KINDS = [
  "crystalDrone",
  "resonanceNode",
  "shardHunter",
  "crystalStalker",
  "crystalGuardian",
  "growthSeeder",
  "energyConduit",
  "crystalTitan",
  "resonancePriest",
  "livingObelisk",
  "shardSwarm",
  "crystalCarrier",
  "ancientResonator",
] as const;
export type CrystalUnitKind = (typeof CRYSTAL_UNIT_KINDS)[number];

export const CRYSTAL_COMBAT_STYLES = [
  "areaControl",
  "growth",
  "defensiveNetworks",
  "healing",
  "resonanceBuffs",
  "environmentalManipulation",
  "delayedAttacks",
  "cooperativeBehaviour",
] as const;
export type CrystalCombatStyle = (typeof CRYSTAL_COMBAT_STYLES)[number];

export const CRYSTAL_SPECIAL_MECHANICS = [
  "crystalGrowth",
  "energyResonance",
  "healingFields",
  "reflectiveCrystals",
  "chainResonance",
  "crystalArmour",
  "terrainExpansion",
  "livingStructures",
  "prismaticShields",
  "crystalNetworks",
] as const;
export type CrystalSpecialMechanic = (typeof CRYSTAL_SPECIAL_MECHANICS)[number];

/** What the Resonance Network shares — six registered; three mechanically live. */
export const RESONANCE_SHARED_TRAITS = [
  "healing",
  "shieldStrength",
  "damageBonus",
  "statusResistance",
  "movementSpeed",
  "abilityCooldowns",
] as const;
export type ResonanceSharedTrait = (typeof RESONANCE_SHARED_TRAITS)[number];

export const ENVIRONMENTAL_CONTROL_ACTIONS = [
  "growBarriers",
  "createHazards",
  "spawnCrystalForests",
  "alterMovementRoutes",
  "generateEnergyFields",
  "revealHiddenOrganisms",
  "transformArenas",
] as const;
export type EnvironmentalControlAction = (typeof ENVIRONMENTAL_CONTROL_ACTIONS)[number];

export const CRYSTAL_MINI_BOSS_KINDS = [
  "crystalMatriarch",
  "livingMonolith",
  "ancientResonanceCore",
  "titanBloom",
  "shardLeviathan",
  "planetaryHeartFragment",
] as const;
export type CrystalMiniBossKind = (typeof CRYSTAL_MINI_BOSS_KINDS)[number];

export const CRYSTAL_ELITE_GAINS = [
  "rareCrystalForms",
  "enhancedResonance",
  "livingArmour",
  "ancientMutations",
  "uniqueColours",
  "specialGrowthPatterns",
  "rareRewards",
] as const;
export type CrystalEliteGain = (typeof CRYSTAL_ELITE_GAINS)[number];

/** Visual Language (AF-048 §Visual Language) — binds to real art at the AF-002/006 asset pass. */
export const CRYSTAL_VISUAL_LANGUAGE = {
  style: "Translucent crystals, growing structures, energy veins, prismatic lighting, floating shards",
  crystalColour: "#4d7cff", // AF-007 rare-blue token, shared with AF-039's Crystal Dominion profile
  resonanceColour: "#9b5cff",
  growthColour: "#5cffa8",
} as const;

/** Resonance tuning — continuous strength, not a state machine. */
export const RESONANCE_TUNING = {
  /** Bonus contributed per living resonance-node unit (Resonance Node, Living Obelisk). */
  perNodeBonus: 0.08,
  maxResonanceStrength: 0.4,
  healPerSecondAtFullResonance: 3,
  speedBonusAtFullResonance: 0.2,
} as const;

/** Crystal Growth tuning — AF-035's exact hazard engine, new content values; the hazard's radius grows over its life. */
export const CRYSTAL_GROWTH_TUNING = {
  initialRadius: 0.8,
  maxRadius: 2.4,
  growthPerSecond: 0.12,
  tickIntervalMs: 700,
  damagePerTick: 4,
  seedIntervalMs: 5000,
  maxLiveGrowths: 6,
} as const;

export function createCrystalGrowth(id: string, x: number, y: number): HazardZoneDef {
  return {
    id,
    x,
    y,
    radius: CRYSTAL_GROWTH_TUNING.initialRadius,
    tickIntervalMs: CRYSTAL_GROWTH_TUNING.tickIntervalMs,
    damagePerTick: CRYSTAL_GROWTH_TUNING.damagePerTick,
    statusOnTick: null,
  };
}

/** Pure — the ecosystem's environment grows continuously (AF-048 §Special Mechanics: Crystal Growth). */
export function growCrystalZone(zone: HazardZoneDef, dtSeconds: number): HazardZoneDef {
  return { ...zone, radius: Math.min(CRYSTAL_GROWTH_TUNING.maxRadius, zone.radius + CRYSTAL_GROWTH_TUNING.growthPerSecond * dtSeconds) };
}

export const LORE_CRYSTAL_RESONANCE_ARCHIVE = "LORE_CRYSTAL_RESONANCE_ARCHIVE";

/** Sandbox Crystal roster — six units proving drone/hunter/node/seeder/
 * guardian/titan doctrine over the unchanged AF-033 schema. */
export const CRYSTAL_ENEMIES: readonly EnemyDef[] = [
  {
    id: "crystal-drone",
    name: "Crystal Drone",
    family: "crystalOrganism",
    roles: ["chaser"],
    lore: "A shard grown to a single purpose, discarded the moment it succeeds or fails.",
    strengths: ["Cheap, regrown from any nearby resonance"],
    weaknesses: ["Brittle — one good hit ends it"],
    counterplay: "Ignore individually; it exists to soak attention while the network heals.",
    hull: 18,
    shield: 0,
    movementBehaviour: "directPursuit",
    moveSpeed: 2.1,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 4, damageSchool: "physical", contactRangeUnits: 1.0, cooldownMs: 750 },
      telegraphMs: 200,
    },
    specialAbility: null,
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "small",
  },
  {
    id: "crystal-shard-hunter",
    name: "Shard Hunter",
    family: "crystalOrganism",
    roles: ["flanker"],
    lore: "Fires the fragments it sheds as it moves — every attack costs it a little of itself.",
    strengths: ["Ranged shard barrage, keeps distance"],
    weaknesses: ["Its own shedding slows it under sustained fire"],
    counterplay: "Pressure it continuously; each hit degrades its next volley.",
    hull: 26,
    shield: 6,
    movementBehaviour: "strafing",
    moveSpeed: 2.0,
    attack: {
      attackType: "projectile",
      mechanism: {
        kind: "ranged",
        weapon: {
          id: "crystal-shard-launcher",
          name: "Shard Launcher",
          category: "crystal",
          manufacturer: "Crystal Dominion",
          tier: 1,
          rarity: "common",
          lore: "Grown, not built — every launcher is a slightly different shape.",
          damageSchool: "energy",
          damageSourceKind: "direct",
          baseDamage: 5,
          critChance: 0,
          critMultiplier: 1,
          fireIntervalMs: 2000,
          firePattern: "spread",
          projectilesPerShot: 2,
          projectileBehaviour: "straight",
          range: 9,
          projectileSpeed: 10,
          pierceCount: 0,
          explosionRadius: 0,
          statusOnHit: null,
          energyCost: 0,
          evolution: null,
        },
      },
      telegraphMs: 450,
    },
    specialAbility: null,
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "medium",
  },
  {
    id: "crystal-resonance-node",
    name: "Resonance Node",
    family: "crystalOrganism",
    roles: ["support"],
    lore: "It does not fight. It tunes — every crystal within reach grows a little stronger for its presence.",
    strengths: ["Amplifies every living crystal's healing, damage, and speed while it stands"],
    weaknesses: ["No offence, low hull — the ecosystem's whole strength is a target"],
    counterplay: "Destroying a node visibly weakens everything near it — hunt them first.",
    hull: 24,
    shield: 8,
    movementBehaviour: "formation",
    moveSpeed: 1.1,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 2, damageSchool: "energy", contactRangeUnits: 0.8, cooldownMs: 1600 },
      telegraphMs: 300,
    },
    specialAbility: {
      kind: "boostAllies",
      trigger: "onLowHealth",
      threshold: 1, // always eligible — resonance strength itself is continuous, computed at the composition root
      bonus: { kind: "damage", value: 0 },
      cooldownMs: 0,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "medium",
  },
  {
    id: "crystal-growth-seeder",
    name: "Growth Seeder",
    family: "crystalOrganism",
    roles: ["areaDenial"],
    lore: "Terrain expansion, in person. It doesn't attack the player. It attacks the arena.",
    strengths: ["Seeds growing crystal-forest hazards that expand while it lives"],
    weaknesses: ["Low hull, no meaningful weapon"],
    counterplay: "Kill it fast — every second alive is more battlefield lost to the ecosystem.",
    hull: 22,
    shield: 4,
    movementBehaviour: "retreat",
    moveSpeed: 1.6,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 2, damageSchool: "physical", contactRangeUnits: 0.8, cooldownMs: 2000 },
      telegraphMs: 300,
    },
    specialAbility: {
      kind: "createHazards",
      trigger: "onLowHealth",
      threshold: 1, // always eligible — the growth cadence is network-gated at the composition root
      bonus: { kind: "damage", value: 0 },
      cooldownMs: CRYSTAL_GROWTH_TUNING.seedIntervalMs,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "medium",
  },
  {
    id: "crystal-guardian",
    name: "Crystal Guardian",
    family: "crystalOrganism",
    roles: ["tank"],
    lore: "Living armour grown thick enough to matter. It stands where the network needs standing.",
    strengths: ["Reflective Crystals — heavy hull and shield, resonance-buffed"],
    weaknesses: ["Slow"],
    counterplay: "Its threat scales with the network around it; break its support first.",
    hull: 60,
    shield: 25,
    movementBehaviour: "formation",
    moveSpeed: 1.2,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 9, damageSchool: "physical", contactRangeUnits: 1.2, cooldownMs: 1100 },
      telegraphMs: 350,
    },
    specialAbility: {
      kind: "deployShields",
      trigger: "onLowHealth",
      threshold: 0.5,
      bonus: { kind: "shieldCapacity", value: 18 },
      cooldownMs: 8000,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "large",
  },
  {
    id: "crystal-titan",
    name: "Crystal Titan",
    family: "ancientGuardian",
    roles: ["elite", "tank"],
    lore: "Not grown to fight. Grown to outlast everything that tries.",
    strengths: ["Massive hull, resonance-amplified to its full potential"],
    weaknesses: ["Alone, it is only large — the ecosystem is what makes it dangerous"],
    counterplay: "Collapse the resonance network before committing; a Titan with no support is a slow tank.",
    hull: 95,
    shield: 30,
    movementBehaviour: "formation",
    moveSpeed: 1.0,
    attack: {
      attackType: "area",
      mechanism: {
        kind: "ranged",
        weapon: {
          id: "crystal-prismatic-burst",
          name: "Prismatic Burst",
          category: "crystal",
          manufacturer: "Crystal Dominion",
          tier: 2,
          rarity: "rare",
          lore: "Refracted light with enough mass behind it to matter.",
          damageSchool: "energy",
          damageSourceKind: "area",
          baseDamage: 7,
          critChance: 0.05,
          critMultiplier: 1.5,
          fireIntervalMs: 2400,
          firePattern: "nova",
          projectilesPerShot: 6,
          projectileBehaviour: "straight",
          range: 8,
          projectileSpeed: 8,
          pierceCount: 0,
          explosionRadius: 1.2,
          statusOnHit: null,
          energyCost: 0,
          evolution: null,
        },
      },
      telegraphMs: 700,
    },
    specialAbility: {
      kind: "healAllies",
      trigger: "onLowHealth",
      threshold: 1,
      bonus: { kind: "shieldRegeneration", value: RESONANCE_TUNING.healPerSecondAtFullResonance },
      cooldownMs: 1000,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "elite",
  },
];
