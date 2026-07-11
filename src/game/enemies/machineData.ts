/**
 * Machine Collective faction content (AF-047). The second enemy faction,
 * built exactly like AF-046's first: every unit is a plain AF-033
 * `EnemyDef` (ranged attacks ARE AF-032 WeaponDefs — the Collective already
 * manufactured the flak-orbiter's cannon back in AF-033), and the faction
 * itself is AF-039's already-profiled Machine Collective — zero new lore.
 * Where Outlaw squads SCATTER when their Captain dies (fear), machine
 * networks DEGRADE when their Command Core dies (logic): units keep
 * fighting but lose Target Synchronisation, Shared Shields, Self Repair,
 * and Drone Factory support. This module gives AF-033's dormant
 * `healAllies` and `spawnReinforcements` special-ability kinds their first
 * producers.
 */
import type { EnemyDef } from "./enemyData";

/** Core Units — fourteen registered; six carry full sandbox defs today. */
export const MACHINE_UNIT_KINDS = [
  "reconDrone",
  "combatDrone",
  "interceptor",
  "heavyWalker",
  "shieldGenerator",
  "repairDrone",
  "siegePlatform",
  "sniperUnit",
  "missilePlatform",
  "swarmConstructor",
  "energyHarvester",
  "guardian",
  "heavyDestroyer",
  "commandCore",
] as const;
export type MachineUnitKind = (typeof MACHINE_UNIT_KINDS)[number];

export const MACHINE_COMBAT_STYLES = [
  "formationCombat",
  "crossfire",
  "shieldNetworks",
  "areaControl",
  "targetPriority",
  "calculatedRetreats",
  "automatedReinforcements",
  "resourcePreservation",
] as const;
export type MachineCombatStyle = (typeof MACHINE_COMBAT_STYLES)[number];

export const MACHINE_SPECIAL_MECHANICS = [
  "sharedShields",
  "distributedProcessing",
  "selfRepair",
  "energyRelay",
  "defensiveNetworks",
  "droneFactories",
  "adaptiveArmour",
  "targetSynchronisation",
] as const;
export type MachineSpecialMechanic = (typeof MACHINE_SPECIAL_MECHANICS)[number];

/** Adaptive AI inputs — seven registered; damageTypes is mechanically live today. */
export const ADAPTIVE_AI_INPUTS = [
  "playerMovement",
  "weaponUsage",
  "abilityUsage",
  "damageTypes",
  "statusEffects",
  "threatLevel",
  "encounterDuration",
] as const;
export type AdaptiveAiInput = (typeof ADAPTIVE_AI_INPUTS)[number];

export const NETWORK_COMMANDS = [
  "movement",
  "firePriority",
  "shieldRouting",
  "droneDeployment",
  "repairAllocation",
  "retreatOrders",
] as const;
export type NetworkCommand = (typeof NETWORK_COMMANDS)[number];

export const MACHINE_MINI_BOSS_KINDS = [
  "commandWalker",
  "factoryCore",
  "siegeEngine",
  "prototypeAI",
  "orbitalDefenceNode",
  "adaptiveWarPlatform",
] as const;
export type MachineMiniBossKind = (typeof MACHINE_MINI_BOSS_KINDS)[number];

export const MACHINE_ELITE_GAINS = [
  "prototypeHardware",
  "adaptiveShields",
  "experimentalWeapons",
  "uniqueChassis",
  "advancedAI",
  "rareComponents",
  "uniqueCodexEntries",
] as const;
export type MachineEliteGain = (typeof MACHINE_ELITE_GAINS)[number];

/** Visual Language (AF-047 §Visual Language) — binds to real art at the AF-002/006 asset pass. */
export const MACHINE_VISUAL_LANGUAGE = {
  style: "Dark alloy armour, mechanical precision, hexagonal shielding, rotating machinery, exposed servos",
  primaryColour: "#12141a", // dark alloy
  illuminationColour: "#f2f6ff", // white illumination
  coreColour: "#4d7cff", // blue energy cores (AF-007 rare-blue token)
} as const;

export const LORE_MACHINE_NETWORK_DOCTRINE = "LORE_MACHINE_NETWORK_DOCTRINE";

/** Adaptive AI tuning — capped so adaptation never becomes unfair (§Adaptive AI). */
export const MACHINE_ADAPTATION_TUNING = {
  /** Damage events of one school before adaptation starts building. */
  hitsPerStep: 12,
  /** Reduction gained per completed step. */
  reductionPerStep: 0.05,
  /** Hard fairness cap on adapted reduction. */
  maxReduction: 0.25,
} as const;

/** Network tuning — Shared Shields / Self Repair / Drone Factory cadences. */
export const MACHINE_NETWORK_TUNING = {
  sharedShieldDamageFactor: 0.85,
  repairHullPerSecond: 1.5,
  /** Tuned down from 7000 in the self-review loop: at 7s the Constructor was
   * reliably focused down before its first build ever mattered (§ "adjust
   * encounter pacing"). */
  factoryIntervalMs: 4000,
  maxFactorySpawnsPerNetwork: 4,
  targetSyncDamageBonus: 0.15,
} as const;

/** Sandbox Machine roster — six units proving combat-drone/sniper/shield-
 * generator/repair-drone/swarm-constructor/command-core doctrine over the
 * unchanged AF-033 schema. */
export const MACHINE_ENEMIES: readonly EnemyDef[] = [
  {
    id: "machine-combat-drone",
    name: "Machine Combat Drone",
    family: "machineUnit",
    roles: ["chaser"],
    lore: "The Collective's unit of account: a fuselage, a blade, and a solution.",
    strengths: ["Cheap, replaceable, and manufactured mid-battle"],
    weaknesses: ["Individually trivial — its value is the network behind it"],
    counterplay: "Cut the network first; drones without support are cleanup.",
    hull: 22,
    shield: 0,
    movementBehaviour: "directPursuit",
    moveSpeed: 2.2,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 5, damageSchool: "physical", contactRangeUnits: 1.0, cooldownMs: 800 },
      telegraphMs: 200,
    },
    specialAbility: null,
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "small",
  },
  {
    id: "machine-sniper-unit",
    name: "Machine Sniper Unit",
    family: "machineUnit",
    roles: ["sniper"],
    lore: "It does not lead its target. It computes where the target will stop existing.",
    strengths: ["Precision beam at extreme range"],
    weaknesses: ["Long, luminous charge cycle", "Defenceless up close"],
    counterplay: "The white charge-glow is the timer — break line of sight before it completes.",
    hull: 24,
    shield: 8,
    movementBehaviour: "kiting",
    moveSpeed: 1.7,
    attack: {
      attackType: "beam",
      mechanism: {
        kind: "ranged",
        weapon: {
          id: "machine-precision-lance",
          name: "Precision Lance",
          category: "laser",
          manufacturer: "Machine Collective",
          tier: 1,
          rarity: "improved",
          lore: "A firing solution, weaponised.",
          damageSchool: "energy",
          damageSourceKind: "direct",
          baseDamage: 12,
          critChance: 0.15,
          critMultiplier: 1.5,
          fireIntervalMs: 3200,
          firePattern: "singleShot",
          projectilesPerShot: 1,
          projectileBehaviour: "straight",
          range: 13,
          projectileSpeed: 24,
          pierceCount: 0,
          explosionRadius: 0,
          statusOnHit: null,
          energyCost: 0,
          evolution: null,
        },
      },
      telegraphMs: 850,
    },
    specialAbility: null,
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "large",
  },
  {
    id: "machine-shield-generator",
    name: "Machine Shield Generator",
    family: "supportUnit",
    roles: ["support", "shieldUnit"], // GP-002: projecting the network's own shield lattice IS the shieldUnit role, already real
    lore: "A hexagonal lattice projected across the whole formation — the network wears one armour.",
    strengths: ["Shared Shields — networked machines take reduced damage while it operates"],
    weaknesses: ["No meaningful weapon of its own", "The lattice dies with it"],
    counterplay: "Kill the generator and the whole network softens at once.",
    hull: 48,
    shield: 30,
    movementBehaviour: "formation",
    moveSpeed: 1.2,
    attack: {
      attackType: "projectile",
      mechanism: {
        kind: "ranged",
        weapon: {
          id: "machine-point-defence",
          name: "Point Defence Emitter",
          category: "arc",
          manufacturer: "Machine Collective",
          tier: 1,
          rarity: "common",
          lore: "Strictly a deterrent. The lattice is the weapon.",
          damageSchool: "energy",
          damageSourceKind: "direct",
          baseDamage: 3,
          critChance: 0,
          critMultiplier: 1,
          fireIntervalMs: 2400,
          firePattern: "singleShot",
          projectilesPerShot: 1,
          projectileBehaviour: "straight",
          range: 7,
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
    specialAbility: {
      kind: "deployShields",
      trigger: "onLowHealth",
      threshold: 0.5,
      bonus: { kind: "shieldCapacity", value: 25 },
      cooldownMs: 9000,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "large",
  },
  {
    id: "machine-repair-drone",
    name: "Machine Repair Drone",
    family: "drone",
    roles: ["healer", "support"],
    lore: "The Collective does not mourn losses. It amortises them.",
    strengths: ["Self Repair — networked machines regenerate while it orbits"],
    weaknesses: ["Harmless alone", "Repair stops the instant it's destroyed"],
    counterplay: "Standard doctrine: healers first.",
    hull: 20,
    shield: 10,
    movementBehaviour: "orbiting",
    moveSpeed: 2.0,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 2, damageSchool: "energy", contactRangeUnits: 0.9, cooldownMs: 1500 },
      telegraphMs: 300,
    },
    specialAbility: {
      // AF-033's healAllies kind, registered since AF-033 with no producer until now.
      kind: "healAllies",
      trigger: "onLowHealth",
      threshold: 1, // always eligible — the repair cadence is network-gated at the composition root
      bonus: { kind: "shieldRegeneration", value: MACHINE_NETWORK_TUNING.repairHullPerSecond },
      cooldownMs: 1000,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "medium",
  },
  {
    id: "machine-swarm-constructor",
    name: "Machine Swarm Constructor",
    family: "summoner",
    roles: ["summoner"],
    lore: "An autonomous factory that decided the front line was the most efficient place to stand.",
    strengths: ["Drone Factory — manufactures Combat Drones mid-battle"],
    weaknesses: ["Every drone it builds is hull it didn't keep for itself"],
    counterplay: "It out-produces slow play; commit and break it early.",
    hull: 40,
    shield: 12,
    // Self-review tuning: was "kiting" (hold preferred range), which made the
    // factory chase into auto-fire range and die before its first build every
    // time. A factory withdraws while producing — Resource Preservation.
    movementBehaviour: "retreat",
    moveSpeed: 1.4,
    attack: {
      attackType: "projectile",
      mechanism: {
        kind: "ranged",
        weapon: {
          id: "machine-fabricator-bolt",
          name: "Fabricator Bolt",
          category: "plasma",
          manufacturer: "Machine Collective",
          tier: 1,
          rarity: "common",
          lore: "Waste heat from the assembly line, aimed.",
          damageSchool: "energy",
          damageSourceKind: "direct",
          baseDamage: 4,
          critChance: 0,
          critMultiplier: 1,
          fireIntervalMs: 2600,
          firePattern: "singleShot",
          projectilesPerShot: 1,
          projectileBehaviour: "straight",
          range: 9,
          projectileSpeed: 9,
          pierceCount: 0,
          explosionRadius: 0,
          statusOnHit: null,
          energyCost: 0,
          evolution: null,
        },
      },
      telegraphMs: 500,
    },
    specialAbility: {
      // AF-033's spawnReinforcements kind, registered since AF-033 with no producer until now.
      kind: "spawnReinforcements",
      trigger: "onLowHealth",
      threshold: 1, // always eligible — the factory cadence is network-gated at the composition root
      bonus: { kind: "damage", value: 0 },
      cooldownMs: MACHINE_NETWORK_TUNING.factoryIntervalMs,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "large",
  },
  {
    id: "machine-command-core",
    name: "Machine Command Core",
    family: "livingStructure",
    roles: ["controller"],
    lore: "Not a leader — a router. The network does not follow it; the network flows through it.",
    strengths: ["Target Synchronisation, shield routing, repair allocation, drone deployment — while it runs"],
    weaknesses: ["Destroying it degrades every networked machine at once"],
    counterplay: "The core is the objective. Everything else is its output.",
    hull: 85,
    shield: 30,
    movementBehaviour: "formation",
    moveSpeed: 1.1,
    attack: {
      attackType: "projectile",
      mechanism: {
        kind: "ranged",
        weapon: {
          id: "machine-synchronised-array",
          name: "Synchronised Array",
          category: "arc",
          manufacturer: "Machine Collective",
          tier: 2,
          rarity: "rare",
          lore: "Every barrel in the network, one firing solution.",
          damageSchool: "energy",
          damageSourceKind: "direct",
          baseDamage: 5,
          critChance: 0.05,
          critMultiplier: 1.5,
          fireIntervalMs: 1800,
          firePattern: "spread",
          projectilesPerShot: 3,
          projectileBehaviour: "straight",
          range: 10,
          projectileSpeed: 11,
          pierceCount: 0,
          explosionRadius: 0,
          statusOnHit: null,
          energyCost: 0,
          evolution: null,
        },
      },
      telegraphMs: 550,
    },
    specialAbility: {
      kind: "boostAllies",
      trigger: "onLowHealth",
      threshold: 0.4,
      bonus: { kind: "damage", value: 0.25 },
      cooldownMs: 12000,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "elite",
  },
];
