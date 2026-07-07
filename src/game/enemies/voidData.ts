/**
 * Void Swarm faction content (AF-049). The fourth enemy faction, built like
 * AF-046/047/048: every unit is a plain AF-033 `EnemyDef`, using the
 * dormant `voidEntity` family (registered since AF-033, never used until
 * now) exclusively — no cross-faction fingerprint collision is even
 * possible. Where Outlaw squads SCATTER, Machine networks DEGRADE in
 * discrete steps, and the Crystal Ecosystem WEAKENS continuously from a
 * living count, the Void Swarm CORRUPTS: a level that climbs over time
 * while Beacons live and only falls when they are destroyed or the swarm
 * runs unchecked long enough to be contained — time itself, not just a
 * kill, is part of this doctrine. Corruption Zones reuse AF-035's exact
 * hazard-zone engine a third time, this time carrying a live status effect
 * (AF-036's biome-hazard precedent, not a new status-hazard mechanism).
 */
import type { EnemyDef } from "./enemyData";
import type { HazardZoneDef } from "../bosses/BossArena";

/** Core Units — thirteen registered; six carry full sandbox defs today. */
export const VOID_UNIT_KINDS = [
  "voidWisp",
  "corruptionParasite",
  "shadowHunter",
  "gravityStalker",
  "voidReaper",
  "realityWeaver",
  "phaseWalker",
  "voidBeacon",
  "dimensionalPredator",
  "starDevourer",
  "riftGuardian",
  "corruptionNest",
  "ancientVoidAvatar",
] as const;
export type VoidUnitKind = (typeof VOID_UNIT_KINDS)[number];

export const VOID_COMBAT_STYLES = [
  "ambush",
  "teleportation",
  "spaceDistortion",
  "statusCorruption",
  "areaDenial",
  "summoning",
  "movementManipulation",
  "psychologicalPressure",
] as const;
export type VoidCombatStyle = (typeof VOID_COMBAT_STYLES)[number];

export const VOID_SPECIAL_MECHANICS = [
  "realityTears",
  "gravityWells",
  "teleportation",
  "corruptionZones",
  "dimensionalGates",
  "phaseShifting",
  "darkEnergyPulses",
  "spatialCollapse",
  "temporalDistortion",
  "voidEchoes",
] as const;
export type VoidSpecialMechanic = (typeof VOID_SPECIAL_MECHANICS)[number];

/** What the Void Network shares — six registered; three mechanically live. */
export const VOID_NETWORK_TRAITS = [
  "corruption",
  "healing",
  "teleportAccess",
  "shieldRecovery",
  "damageAmplification",
  "realityStability",
] as const;
export type VoidNetworkTrait = (typeof VOID_NETWORK_TRAITS)[number];

export const REALITY_DISTORTION_ACTIONS = [
  "warpMovement",
  "bendProjectiles",
  "createMirroredEnemies",
  "alterGravity",
  "hidePathways",
  "generateUnstableTerrain",
  "collapseSafeZones",
] as const;
export type RealityDistortionAction = (typeof REALITY_DISTORTION_ACTIONS)[number];

export const VOID_MINI_BOSS_KINDS = [
  "riftMonarch",
  "gravityLeviathan",
  "voidHarvester",
  "realityAnchor",
  "ancientCorruptor",
  "starParasite",
] as const;
export type VoidMiniBossKind = (typeof VOID_MINI_BOSS_KINDS)[number];

export const VOID_ELITE_GAINS = [
  "ancientMutations",
  "greaterDistortion",
  "uniqueRealityEffects",
  "rareForms",
  "impossibleMovement",
  "uniqueAudio",
  "exceptionalRewards",
] as const;
export type VoidEliteGain = (typeof VOID_ELITE_GAINS)[number];

/** Visual Language (AF-049 §Visual Language) — binds to real art at the AF-002/006 asset pass. */
export const VOID_VISUAL_LANGUAGE = {
  style: "Black energy, distorted silhouettes, floating fragments, gravitational lensing, reality tears, dark plasma",
  voidColour: "#0a0612",
  distortionColour: "#5b1a8f", // deep violet, distinct from AF-048's resonance violet (#9b5cff)
  fractureColour: "#c94dff",
} as const;

/** Corruption tuning — the fourth doctrine: a level that climbs with time while
 * Beacons live, decays once contained, and steps down immediately per kill. */
export const VOID_CORRUPTION_TUNING = {
  maxCorruption: 1,
  /** Growth per second, per live Beacon — the swarm corrupts faster the longer Beacons survive. */
  growthPerSecondPerBeacon: 0.03,
  /** Decay per second once every Beacon is destroyed — containment, not an instant reset. */
  decayPerSecondWhenContained: 0.05,
  /** Immediate step-down on any single Beacon kill — "destroying Beacons weakens surrounding corruption". */
  beaconDestroyedStep: 0.15,
  healPerSecondAtFullCorruption: 4,
  damageBonusAtFullCorruption: 0.3,
  /** Reality Stability — incoming damage reduction at full corruption; the Swarm's own "hard to hit" trait. */
  incomingDamageReductionAtFullCorruption: 0.2,
} as const;

/** Corruption Zone tuning — AF-035's exact hazard engine, seeded once corruption is high enough. */
export const VOID_ZONE_TUNING = {
  radius: 2.0,
  tickIntervalMs: 800,
  damagePerTick: 5,
  statusStrength: 3,
  statusDurationMs: 4000,
  /** Corruption level (0..1) that must be reached before a zone can seed. */
  seedThreshold: 0.5,
  seedIntervalMs: 6000,
  maxLiveZones: 4,
} as const;

export function createCorruptionZone(id: string, x: number, y: number): HazardZoneDef {
  return {
    id,
    x,
    y,
    radius: VOID_ZONE_TUNING.radius,
    tickIntervalMs: VOID_ZONE_TUNING.tickIntervalMs,
    damagePerTick: VOID_ZONE_TUNING.damagePerTick,
    statusOnTick: { kind: "corruption", strength: VOID_ZONE_TUNING.statusStrength, durationMs: VOID_ZONE_TUNING.statusDurationMs },
  };
}

export const LORE_VOID_CORRUPTION_ARCHIVE = "LORE_VOID_CORRUPTION_ARCHIVE";

/** Sandbox Void roster — six units proving wisp/parasite/hunter/beacon/
 * guardian/avatar doctrine over the unchanged AF-033 schema. Every def uses
 * the dormant `voidEntity` family — first use since AF-033 registered it. */
export const VOID_ENEMIES: readonly EnemyDef[] = [
  {
    id: "void-wisp",
    name: "Void Wisp",
    family: "voidEntity",
    roles: ["chaser"],
    lore: "A fragment of the dark given just enough shape to close distance. It does not think. It only closes.",
    strengths: ["Fast, expendable — the Swarm never runs short of them"],
    weaknesses: ["No defences worth the name"],
    counterplay: "Ignore individually; it exists to keep you from watching the Beacon.",
    hull: 16,
    shield: 0,
    movementBehaviour: "directPursuit",
    moveSpeed: 2.3,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 4, damageSchool: "energy", contactRangeUnits: 1.0, cooldownMs: 700 },
      telegraphMs: 200,
    },
    specialAbility: null,
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "small",
  },
  {
    id: "corruption-parasite",
    name: "Corruption Parasite",
    family: "voidEntity",
    roles: ["disruptor"],
    lore: "It does not want to kill you. It wants you to carry a little of the dark home.",
    strengths: ["Spore volleys apply Corruption — a status this civilisation is named for"],
    weaknesses: ["Splits its own strength defending itself, not you"],
    counterplay: "Cleanse or outlast the stacks; the Parasite itself is fragile.",
    hull: 24,
    shield: 4,
    movementBehaviour: "strafing",
    moveSpeed: 1.9,
    attack: {
      attackType: "projectile",
      mechanism: {
        kind: "ranged",
        weapon: {
          id: "corruption-spore-launcher",
          name: "Corruption Spore Launcher",
          category: "void",
          manufacturer: "Void Swarm",
          tier: 1,
          rarity: "common",
          lore: "Not built. Extruded, once, by something that no longer needs to repeat the process.",
          damageSchool: "energy",
          damageSourceKind: "direct",
          baseDamage: 4,
          critChance: 0,
          critMultiplier: 1,
          fireIntervalMs: 2200,
          firePattern: "spread",
          projectilesPerShot: 2,
          projectileBehaviour: "seeking",
          range: 8,
          projectileSpeed: 8,
          pierceCount: 0,
          explosionRadius: 0,
          statusOnHit: { kind: "corruption", chance: 0.6, strength: 2, durationMs: 3000 },
          energyCost: 0,
          evolution: null,
        },
      },
      telegraphMs: 450,
    },
    specialAbility: {
      kind: "split", // first producer — AF-033's dormant split ability kind
      trigger: "onLowHealth",
      threshold: 0.4,
      bonus: { kind: "damage", value: 0.1 },
      cooldownMs: 6000,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "medium",
  },
  {
    id: "shadow-hunter",
    name: "Shadow Hunter",
    family: "voidEntity",
    roles: ["flanker"],
    lore: "It is not fast. It is simply not where you last checked.",
    strengths: ["Teleports on a fixed interval — genuinely impossible movement, still fully readable"],
    weaknesses: ["Predictable cadence once you know the interval"],
    counterplay: "Track the interval, not the entity — it always reappears near you, never behind cover.",
    hull: 28,
    shield: 6,
    movementBehaviour: "teleport", // first producer among the enemy roster — a boss already used it (AF-035), this is the first EnemyDef
    moveSpeed: 1.6,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 8, damageSchool: "physical", contactRangeUnits: 1.1, cooldownMs: 900 },
      telegraphMs: 250,
    },
    specialAbility: null,
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "medium",
  },
  {
    id: "void-beacon",
    name: "Void Beacon",
    family: "voidEntity",
    roles: ["support"],
    lore: "A wound in space that the Swarm keeps open on purpose. Everything nearby drinks from it.",
    strengths: ["Corruption climbs the longer it survives — every second alive is ground lost"],
    weaknesses: ["No offence, low hull — the whole doctrine's single point of containment"],
    counterplay: "Destroying it doesn't just stop the growth — it visibly rolls corruption back. Prioritise it.",
    hull: 22,
    shield: 10,
    movementBehaviour: "orbiting",
    moveSpeed: 0.9,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 2, damageSchool: "energy", contactRangeUnits: 0.7, cooldownMs: 1800 },
      telegraphMs: 300,
    },
    specialAbility: {
      kind: "boostAllies",
      trigger: "onLowHealth",
      threshold: 1, // always eligible — corruption's real strength is computed at the composition root
      bonus: { kind: "damage", value: 0 },
      cooldownMs: 0,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "medium",
  },
  {
    id: "rift-guardian",
    name: "Rift Guardian",
    family: "voidEntity",
    roles: ["tank"],
    lore: "Reality closed around it wrong, and it simply kept the shape. Nothing since has convinced it to let go.",
    strengths: ["Merges with local distortion for heavy, absorbing hull"],
    weaknesses: ["Slow — it never needed to chase anything"],
    counterplay: "Its resilience is real, not a trick — commit the damage or disengage.",
    hull: 65,
    shield: 20,
    movementBehaviour: "formation",
    moveSpeed: 1.1,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 10, damageSchool: "physical", contactRangeUnits: 1.2, cooldownMs: 1200 },
      telegraphMs: 350,
    },
    specialAbility: {
      kind: "merge", // first producer — AF-033's dormant merge ability kind
      trigger: "onLowHealth",
      threshold: 0.5,
      bonus: { kind: "shieldCapacity", value: 16 },
      cooldownMs: 8000,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "large",
  },
  {
    id: "ancient-void-avatar",
    name: "Ancient Void Avatar",
    family: "voidEntity",
    roles: ["elite", "tank"],
    lore: "Older than the sector it now stands in. It does not lead the Swarm. It simply outlasts everything sent against it.",
    strengths: ["Every trait the Swarm claims for itself, at its worst"],
    weaknesses: ["Its threat is corruption-scaled — arriving before a Beacon has done its work leaves it merely large"],
    counterplay: "Contain the corruption first; the Avatar alone is a slow, heavy fight, not an unfair one.",
    hull: 100,
    shield: 35,
    movementBehaviour: "formation",
    moveSpeed: 1.0,
    attack: {
      attackType: "area",
      mechanism: {
        kind: "ranged",
        weapon: {
          id: "void-rift-cannon",
          name: "Void Rift Cannon",
          category: "void",
          manufacturer: "Void Swarm",
          tier: 2,
          rarity: "rare",
          lore: "It does not fire. It opens somewhere else, briefly, in your direction.",
          damageSchool: "energy",
          damageSourceKind: "area",
          baseDamage: 8,
          critChance: 0.05,
          critMultiplier: 1.5,
          fireIntervalMs: 2600,
          firePattern: "nova",
          projectilesPerShot: 6,
          projectileBehaviour: "straight",
          range: 8,
          projectileSpeed: 9,
          pierceCount: 0,
          explosionRadius: 1.3,
          statusOnHit: { kind: "corruption", chance: 0.4, strength: 2, durationMs: 3000 },
          energyCost: 0,
          evolution: null,
        },
      },
      telegraphMs: 700,
    },
    specialAbility: {
      kind: "cloak", // first producer — AF-033's dormant cloak ability kind
      trigger: "onLowHealth",
      threshold: 0.35,
      bonus: { kind: "movementSpeed", value: 0.25 },
      cooldownMs: 7000,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "elite",
  },
];
