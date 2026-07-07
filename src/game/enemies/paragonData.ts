/**
 * Paragon Protocol faction content (AF-053). The eighth enemy faction.
 * Every prior faction's doctrine is a smooth curve — a timer, discrete
 * flags, a recomputed count, a decaying level, an escalating-and-capped
 * ladder, a monotonic ratchet, an earned-and-spent economy. The Paragon
 * Protocol is the first with a single discrete, IRREVERSIBLE threshold
 * event: Reactor Stability depletes from incoming damage and its own
 * inherent instability, and once it hits zero, Containment Collapse fires
 * exactly once — a permanent transformation that INVERTS the unit's
 * character, from defended-but-fragile (Adaptive Shields, degrading as
 * stability falls) to unshielded-but-far-more-dangerous (Energy Overload,
 * a large permanent damage/speed spike). Nothing else in the roster
 * reverses direction like this. A Containment Sentinel actively repairs
 * stability while it lives — killing it is a genuine tactical choice:
 * force the collapse on your own terms, or leave it be and fight a
 * contained (safer, longer) encounter. The Paragon Protocol belongs to no
 * single civilisation — abandoned pre-Collapse military experiments — so,
 * like AF-049's Void Swarm and AF-051's Xenomorph Hive, it gets no AF-039
 * `FactionDef`.
 */
import type { EnemyDef } from "./enemyData";
import type { HazardZoneDef } from "../bosses/BossArena";

/** Core Units — thirteen registered; six carry full sandbox defs today. */
export const PARAGON_UNIT_KINDS = [
  "prototypeDrone",
  "experimentalScout",
  "quantumWalker",
  "containmentSentinel",
  "testPlatform",
  "pulseCannon",
  "singularityEmitter",
  "adaptiveHunter",
  "energyConstruct",
  "prototypeCarrier",
  "containmentCore",
  "experimentalOverseer",
  "omegaPrototype",
] as const;
export type ParagonUnitKind = (typeof PARAGON_UNIT_KINDS)[number];

export const PARAGON_COMBAT_STYLES = [
  "experimentalWeapons",
  "randomisedCombatPatterns",
  "adaptiveDefences",
  "energyManipulation",
  "containmentFields",
  "prototypeTechnology",
  "battlefieldExperiments",
  "controlledInstability",
] as const;
export type ParagonCombatStyle = (typeof PARAGON_COMBAT_STYLES)[number];

export const PARAGON_SPECIAL_MECHANICS = [
  "containmentCollapse",
  "energyOverload",
  "quantumShift",
  "adaptiveShields",
  "experimentalAmmunition",
  "dimensionalPulse",
  "prototypeDrones",
  "unstableReactors",
  "energyFractures",
  "singularityCharges",
] as const;
export type ParagonSpecialMechanic = (typeof PARAGON_SPECIAL_MECHANICS)[number];

/** What Adaptive Technology analyses — seven registered; one mechanically live (Incoming Damage). */
export const ADAPTIVE_TECHNOLOGY_INPUTS = [
  "incomingDamage",
  "weaponTypes",
  "movement",
  "statusEffects",
  "abilityUsage",
  "combatDuration",
  "threatLevel",
] as const;
export type AdaptiveTechnologyInput = (typeof ADAPTIVE_TECHNOLOGY_INPUTS)[number];

export const PARAGON_MINI_BOSS_KINDS = [
  "containmentDirector",
  "omegaPlatform",
  "quantumTitan",
  "experimentalLeviathan",
  "singularityCore",
  "prototypePrime",
] as const;
export type ParagonMiniBossKind = (typeof PARAGON_MINI_BOSS_KINDS)[number];

export const PARAGON_ELITE_GAINS = [
  "uniqueReactorDesigns",
  "experimentalAbilities",
  "adaptiveArmour",
  "quantumWeapons",
  "rareTechnology",
  "exceptionalRewards",
  "uniqueLaboratoryRecords",
] as const;
export type ParagonEliteGain = (typeof PARAGON_ELITE_GAINS)[number];

/** Visual Language (AF-053 §Visual Language) — binds to real art at the AF-002/006 asset pass. */
export const PARAGON_VISUAL_LANGUAGE = {
  style: "White laboratory alloys, orange warning lights, cracked energy cores, quantum distortion, containment fields",
  alloyColour: "#e6ecf0",
  warningColour: "#ff8a1a",
  coreColour: "#4dd0ff",
} as const;

/** Containment/Instability tuning — the eighth doctrine: a depleting
 * Reactor Stability meter that triggers ONE irreversible Containment
 * Collapse on hitting zero, inverting Adaptive Shields into Energy Overload. */
export const PARAGON_INSTABILITY_TUNING = {
  maxStability: 1,
  /** Inherent instability — "technology constantly pushes safe limits", even with no damage taken. */
  passiveDecayPerSecond: 0.01,
  /** Adaptive Technology's live input — every point of incoming damage cracks containment further. */
  stabilityLossPerDamage: 0.002,
  /** Active containment maintenance — offsets decay and damage while a Containment Sentinel lives. */
  sentinelRepairPerSecondPerSentinel: 0.03,
  /** Adaptive Shields — incoming-damage reduction, degrading toward zero as stability falls. Pre-collapse only. */
  preCollapseShieldReductionAtFullStability: 0.2,
  /** Energy Overload — a large, permanent damage spike. Post-collapse only. */
  postCollapseDamageBonus: 0.5,
  /** Unstable Reactors — a permanent speed spike alongside the damage spike. Post-collapse only. */
  postCollapseSpeedBonus: 0.25,
} as const;

/** Singularity Charge — AF-035's exact hazard engine, a fifth reuse; seeded
 * once, at the moment Containment Collapse fires. */
export const SINGULARITY_CHARGE_TUNING = {
  radius: 2.5,
  tickIntervalMs: 600,
  damagePerTick: 6,
} as const;

/** Seeded exactly once, the instant Containment Collapse fires. */
export function createSingularityCharge(id: string, x: number, y: number): HazardZoneDef {
  return {
    id,
    x,
    y,
    radius: SINGULARITY_CHARGE_TUNING.radius,
    tickIntervalMs: SINGULARITY_CHARGE_TUNING.tickIntervalMs,
    damagePerTick: SINGULARITY_CHARGE_TUNING.damagePerTick,
    statusOnTick: null,
  };
}

export const LORE_PARAGON_PROTOCOL_CODEX = "LORE_PARAGON_PROTOCOL_CODEX";

/** Sandbox Paragon roster — six units proving drone/pulse-cannon/hunter/
 * sentinel/construct/omega doctrine over the unchanged AF-033 schema. */
export const PARAGON_ENEMIES: readonly EnemyDef[] = [
  {
    id: "prototype-drone",
    name: "Prototype Drone",
    family: "drone",
    roles: ["chaser"],
    lore: "Nobody signed off on this design. Nobody was going to argue with what it could already do.",
    strengths: ["Blinks across short distances without warning — genuinely erratic, still fully readable"],
    weaknesses: ["Thin construction; the lab prioritised the trick over the armour"],
    counterplay: "Track the blink interval, not the position — it always reappears near you.",
    hull: 20,
    shield: 4,
    movementBehaviour: "teleport",
    moveSpeed: 1.8,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 5, damageSchool: "energy", contactRangeUnits: 1.0, cooldownMs: 750 },
      telegraphMs: 220,
    },
    specialAbility: null,
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "small",
  },
  {
    id: "pulse-cannon",
    name: "Pulse Cannon",
    family: "artillery",
    roles: ["disruptor"],
    lore: "The lab's own notes call it unsafe for extended firing. It has been firing extended for years.",
    strengths: ["Overload pulses disrupt equipment as much as flesh"],
    weaknesses: ["Slow, telegraphed charge-up between shots"],
    counterplay: "Close distance during the charge; it has no answer up close.",
    hull: 24,
    shield: 6,
    movementBehaviour: "kiting",
    moveSpeed: 1.6,
    attack: {
      attackType: "projectile",
      mechanism: {
        kind: "ranged",
        weapon: {
          id: "pulse-emitter",
          name: "Pulse Emitter",
          category: "singularity",
          manufacturer: "Paragon Protocol",
          tier: 1,
          rarity: "common",
          lore: "Every safety interlock on this weapon has been bypassed, deliberately, more than once.",
          damageSchool: "energy",
          damageSourceKind: "direct",
          baseDamage: 6,
          critChance: 0.05,
          critMultiplier: 1.5,
          fireIntervalMs: 2300,
          firePattern: "singleShot",
          projectilesPerShot: 1,
          projectileBehaviour: "straight",
          range: 9,
          projectileSpeed: 11,
          pierceCount: 0,
          explosionRadius: 0,
          statusOnHit: { kind: "overload", chance: 0.55, strength: 3, durationMs: 2500 }, // first producer — AF-021's dormant overload status
          energyCost: 0,
          evolution: null,
        },
      },
      telegraphMs: 500,
    },
    specialAbility: null,
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "medium",
  },
  {
    id: "adaptive-hunter",
    name: "Adaptive Hunter",
    family: "interceptor",
    roles: ["flanker"],
    lore: "Every pass it makes is a little different from the last. It is still learning, even now.",
    strengths: ["Erratic strafing reads differently every encounter"],
    weaknesses: ["Light frame; the adaptation never extended to survivability"],
    counterplay: "Its variance is bounded — the pattern still repeats within a few passes.",
    hull: 26,
    shield: 6,
    movementBehaviour: "strafing",
    moveSpeed: 2.1,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 6, damageSchool: "energy", contactRangeUnits: 1.0, cooldownMs: 750 },
      telegraphMs: 220,
    },
    specialAbility: null,
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "medium",
  },
  {
    id: "containment-sentinel",
    name: "Containment Sentinel",
    family: "supportUnit",
    roles: ["support"],
    lore: "It was the last safety system installed, and the only one still doing its job.",
    strengths: ["Actively repairs Reactor Stability for everything nearby, holding off Containment Collapse"],
    weaknesses: ["No offence, low hull — the whole reason the fight has stayed contained this long"],
    counterplay: "Killing it doesn't trigger collapse by itself, but it removes the only thing holding it back.",
    hull: 26,
    shield: 10,
    movementBehaviour: "formation",
    moveSpeed: 1.0,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 2, damageSchool: "energy", contactRangeUnits: 0.7, cooldownMs: 1800 },
      telegraphMs: 300,
    },
    specialAbility: {
      kind: "deployShields",
      trigger: "onLowHealth",
      threshold: 1, // always eligible — the real stability repair is computed at the composition root
      bonus: { kind: "shieldCapacity", value: 0 },
      cooldownMs: 0,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "medium",
  },
  {
    id: "energy-construct",
    name: "Energy Construct",
    family: "heavyAssault",
    roles: ["tank"],
    lore: "Not built. Grown, inside a containment field, from a specification nobody kept a copy of.",
    strengths: ["Heavy, stable hull — the one part of this project that worked as intended"],
    weaknesses: ["Slow; it was never meant to manoeuvre"],
    counterplay: "It hits harder as the fight drags on. Don't let the fight drag on.",
    hull: 66,
    shield: 20,
    movementBehaviour: "formation",
    moveSpeed: 1.1,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 10, damageSchool: "energy", contactRangeUnits: 1.2, cooldownMs: 1150 },
      telegraphMs: 350,
    },
    specialAbility: {
      kind: "enrage",
      trigger: "onLowHealth",
      threshold: 0.5,
      bonus: { kind: "damage", value: 0.2 },
      cooldownMs: 8000,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "large",
  },
  {
    id: "omega-prototype",
    name: "Omega Prototype",
    family: "machineUnit",
    roles: ["elite", "tank"],
    lore: "The programme's final iteration, and the reason the programme was ended. Nobody ended it in time.",
    strengths: ["Everything the Protocol learned, running with every safety limit already bypassed"],
    weaknesses: ["Its true danger is Containment Collapse — meeting it before Stability breaks is a hard fight, not an unfair one"],
    counterplay: "Force the collapse on your own terms, or grind it down slowly while it's still contained — both are valid, neither is safe.",
    hull: 120,
    shield: 40,
    movementBehaviour: "formation",
    moveSpeed: 1.0,
    attack: {
      attackType: "area",
      mechanism: {
        kind: "ranged",
        weapon: {
          id: "singularity-charge-launcher",
          name: "Singularity Charge Launcher",
          category: "singularity",
          manufacturer: "Paragon Protocol",
          tier: 2,
          rarity: "rare",
          lore: "It fires a fragment of the same instability it's built from.",
          damageSchool: "energy",
          damageSourceKind: "area",
          baseDamage: 9,
          critChance: 0.05,
          critMultiplier: 1.5,
          fireIntervalMs: 2600,
          firePattern: "nova",
          projectilesPerShot: 6,
          projectileBehaviour: "gravityAffected", // first producer — AF-032's dormant gravity-affected projectile behaviour
          range: 8,
          projectileSpeed: 8,
          pierceCount: 0,
          explosionRadius: 1.2,
          statusOnHit: { kind: "overload", chance: 0.4, strength: 3, durationMs: 2500 },
          energyCost: 0,
          evolution: null,
        },
      },
      telegraphMs: 700,
    },
    specialAbility: {
      kind: "cloak",
      trigger: "onLowHealth",
      threshold: 0.35,
      bonus: { kind: "movementSpeed", value: 0.25 },
      cooldownMs: 9000,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "elite",
  },
];
