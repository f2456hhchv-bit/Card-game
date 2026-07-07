/**
 * Human Outlaw faction content (AF-046). Every unit is a plain AF-033
 * `EnemyDef` — same schema, same runtime, same death events; ranged attacks
 * ARE AF-032 WeaponDefs exactly as AF-033 requires. Deployable Mines reuse
 * AF-035's HazardZoneDef/stepHazardZone engine verbatim (the same reuse
 * AF-036's biome hazards already made). Formation Flying gives AF-033's
 * reserved-but-never-used `formation` movement context fields
 * (formationAnchorX/Y, formationOffsetX/Y in stepEnemyMovement) their first
 * live producer. Outlaws are canonically the Mercenary Guild's militant
 * face — AF-039's registered-but-unprofiled faction, profiled by this
 * module (see factionData.ts), not a new lore layer.
 */
import type { EnemyDef } from "./enemyData";
import type { HazardZoneDef } from "../bosses/BossArena";

/** Core Units — fourteen registered; five carry full sandbox defs today. */
export const OUTLAW_UNIT_KINDS = [
  "scout",
  "raider",
  "interceptor",
  "assaultFighter",
  "bomber",
  "droneController",
  "heavyGunship",
  "supportFrigate",
  "engineer",
  "sniper",
  "shieldCarrier",
  "mineLayer",
  "eliteCaptain",
  "flagshipEscort",
] as const;
export type OutlawUnitKind = (typeof OUTLAW_UNIT_KINDS)[number];

export const OUTLAW_TACTICS = [
  "focusFire",
  "missileBarrages",
  "areaDenial",
  "flanking",
  "shieldCoordination",
  "retreat",
  "reinforcements",
  "suppressiveFire",
] as const;
export type OutlawTactic = (typeof OUTLAW_TACTICS)[number];

export const OUTLAW_SPECIAL_MECHANICS = [
  "deployableMines",
  "repairDrones",
  "shieldGenerators",
  "missileSwarms",
  "emergencyBoost",
  "smokeFields",
  "energySuppression",
  "formationFlying",
] as const;
export type OutlawSpecialMechanic = (typeof OUTLAW_SPECIAL_MECHANICS)[number];

export const COMMAND_ORDERS = [
  "attackOrders",
  "retreatOrders",
  "targetPriority",
  "reinforcements",
  "shieldCoordination",
  "supportBehaviour",
] as const;
export type CommandOrder = (typeof COMMAND_ORDERS)[number];

/** Elite Outlaw perks — presentation/reward layers over AF-034's existing Elite pipeline. */
export const OUTLAW_ELITE_PERKS = [
  "improvedTactics",
  "prototypeWeapons",
  "uniquePaint",
  "callsigns",
  "voiceBroadcasts",
  "personalAbilities",
  "enhancedRewards",
] as const;
export type OutlawElitePerk = (typeof OUTLAW_ELITE_PERKS)[number];

export const OUTLAW_MINI_BOSS_KINDS = [
  "gunshipCommander",
  "carrierEscort",
  "experimentalFighter",
  "prototypeDestroyer",
  "mercenaryAce",
  "eliteEngineer",
] as const;
export type OutlawMiniBossKind = (typeof OUTLAW_MINI_BOSS_KINDS)[number];

/** Visual Language (AF-046 §Visual Language) — binds to real art at the AF-002/006 asset pass. */
export const OUTLAW_VISUAL_LANGUAGE = {
  style: "Industrial, angular armour, exposed engines, visible repairs and scrap plating",
  primaryColour: "#1a1c22", // black steel
  warningColour: "#ff8c1a", // orange warning lights
  accentColour: "#7a8296", // AF-007 damaged-grey scrap plating
} as const;

/** Elite callsigns — presentation for AF-034-generated Elite Captains. */
export const OUTLAW_CALLSIGNS = [
  "IRONVEIL",
  "REDSHIFT",
  "HOLLOWPOINT",
  "DEADLIGHT",
  "VULTURE",
  "LONGSHOT",
  "SCRAPKING",
  "GHOSTLANE",
] as const;

export const LORE_MERCENARY_GUILD_CODEX = "LORE_MERCENARY_GUILD_CODEX";

/** Deployable Mines — AF-035's exact hazard-zone engine, new content values. */
export const OUTLAW_MINE_TUNING = {
  radius: 1.6,
  tickIntervalMs: 600,
  damagePerTick: 5,
  ttlMs: 12000,
  dropIntervalMs: 4500,
  maxLiveMines: 6,
} as const;

export function createOutlawMine(id: string, x: number, y: number): HazardZoneDef {
  return {
    id,
    x,
    y,
    radius: OUTLAW_MINE_TUNING.radius,
    tickIntervalMs: OUTLAW_MINE_TUNING.tickIntervalMs,
    damagePerTick: OUTLAW_MINE_TUNING.damagePerTick,
    statusOnTick: null,
  };
}

/** Sandbox Outlaw roster — five units proving raider/sniper/shield-carrier/
 * mine-layer/captain doctrine over the unchanged AF-033 schema. */
export const OUTLAW_ENEMIES: readonly EnemyDef[] = [
  {
    id: "outlaw-raider",
    name: "Outlaw Raider",
    family: "fighter",
    roles: ["flanker"],
    lore: "A modified civilian hull with a military missile pod bolted where the cargo bay used to be.",
    strengths: ["Missile barrages track the player", "Strafes rather than charging blindly"],
    weaknesses: ["Missiles are slow and loudly telegraphed", "Fragile once its strafing line is read"],
    counterplay: "Move perpendicular to the barrage and cut inside its strafing arc.",
    hull: 34,
    shield: 8,
    movementBehaviour: "strafing",
    moveSpeed: 2.0,
    attack: {
      attackType: "missile",
      mechanism: {
        kind: "ranged",
        weapon: {
          id: "outlaw-swarm-pod",
          name: "Salvaged Swarm Pod",
          category: "missile",
          manufacturer: "Mercenary Guild",
          tier: 1,
          rarity: "common",
          lore: "Three tubes still fire. Nobody has fixed the fourth in a decade.",
          damageSchool: "physical",
          damageSourceKind: "direct",
          baseDamage: 4,
          critChance: 0,
          critMultiplier: 1,
          fireIntervalMs: 2600,
          firePattern: "burst",
          projectilesPerShot: 3,
          projectileBehaviour: "seeking",
          range: 10,
          projectileSpeed: 7,
          pierceCount: 0,
          explosionRadius: 0,
          statusOnHit: null,
          energyCost: 0,
          evolution: null,
        },
      },
      telegraphMs: 650, // readable missiles (AF-046 §Accessibility), mechanically enforced
    },
    specialAbility: null,
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "medium",
  },
  {
    id: "outlaw-sniper",
    name: "Outlaw Sniper",
    family: "artillery",
    roles: ["sniper"],
    lore: "One rail, one shot, one paycheck. Kiting is not cowardice when it works this well.",
    strengths: ["Extreme range", "High single-hit damage"],
    weaknesses: ["Long, visible charge-up", "Helpless once the distance closes"],
    counterplay: "Use the long telegraph to break line or close distance — never trade at its range.",
    hull: 26,
    shield: 0,
    movementBehaviour: "kiting",
    moveSpeed: 1.8,
    attack: {
      attackType: "projectile",
      mechanism: {
        kind: "ranged",
        weapon: {
          id: "outlaw-rail-lance",
          name: "Stripped Rail Lance",
          category: "railgun",
          manufacturer: "Mercenary Guild",
          tier: 1,
          rarity: "improved",
          lore: "Military hardware, serial number filed off.",
          damageSchool: "physical",
          damageSourceKind: "direct",
          baseDamage: 14,
          critChance: 0.1,
          critMultiplier: 1.5,
          fireIntervalMs: 3400,
          firePattern: "singleShot",
          projectilesPerShot: 1,
          projectileBehaviour: "straight",
          range: 14,
          projectileSpeed: 22,
          pierceCount: 0,
          explosionRadius: 0,
          statusOnHit: null,
          energyCost: 0,
          evolution: null,
        },
      },
      telegraphMs: 900,
    },
    specialAbility: null,
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "large",
  },
  {
    id: "outlaw-shield-carrier",
    name: "Outlaw Shield Carrier",
    family: "supportUnit",
    roles: ["support", "tank"],
    lore: "It doesn't shoot. It doesn't have to — everything behind it does.",
    strengths: ["Shield Coordination — a walking barrier for the squad"],
    weaknesses: ["Nearly harmless alone", "Slow"],
    counterplay: "Flank around it or kill it first; shooting through it is the losing play.",
    hull: 55,
    shield: 40,
    movementBehaviour: "formation",
    moveSpeed: 1.3,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 4, damageSchool: "physical", contactRangeUnits: 1.1, cooldownMs: 1200 },
      telegraphMs: 300,
    },
    specialAbility: {
      kind: "deployShields",
      trigger: "onLowHealth",
      threshold: 0.5,
      bonus: { kind: "shieldCapacity", value: 20 },
      cooldownMs: 8000,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "large",
  },
  {
    id: "outlaw-mine-layer",
    name: "Outlaw Mine Layer",
    family: "drone",
    roles: ["areaDenial"],
    lore: "Area denial is the cheapest tactic that still wins wars.",
    strengths: ["Seeds proximity mines behind it while it withdraws"],
    weaknesses: ["Weak direct fire", "Its own mines mark its escape route"],
    counterplay: "Chase it through the gaps it leaves for itself — the field is never sealed.",
    hull: 28,
    shield: 6,
    movementBehaviour: "retreat",
    moveSpeed: 1.9,
    attack: {
      attackType: "projectile",
      mechanism: {
        kind: "ranged",
        weapon: {
          id: "outlaw-scatter-pistol",
          name: "Scatter Pistol",
          category: "flak",
          manufacturer: "Mercenary Guild",
          tier: 1,
          rarity: "common",
          lore: "A sidearm for a ship that would rather not fight you directly.",
          damageSchool: "physical",
          damageSourceKind: "direct",
          baseDamage: 3,
          critChance: 0,
          critMultiplier: 1,
          fireIntervalMs: 2200,
          firePattern: "singleShot",
          projectilesPerShot: 1,
          projectileBehaviour: "straight",
          range: 8,
          projectileSpeed: 9,
          pierceCount: 0,
          explosionRadius: 0,
          statusOnHit: null,
          energyCost: 0,
          evolution: null,
        },
      },
      telegraphMs: 400,
    },
    specialAbility: {
      kind: "createHazards",
      trigger: "onLowHealth",
      threshold: 1, // always eligible — the mine cadence itself is timer-gated at the composition root
      bonus: { kind: "damage", value: 0 },
      cooldownMs: OUTLAW_MINE_TUNING.dropIntervalMs,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "medium",
  },
  {
    id: "outlaw-captain",
    name: "Outlaw Captain",
    family: "heavyAssault",
    roles: ["controller", "elite"],
    lore: "Every broken fleet has one officer who kept their rank by keeping their crew alive.",
    strengths: ["The squad fights coordinated while the Captain lives"],
    weaknesses: ["Kill the Captain and the formation breaks"],
    counterplay: "Focus the Captain first — a scattered squad is half the threat.",
    hull: 70,
    shield: 25,
    movementBehaviour: "formation",
    moveSpeed: 1.6,
    attack: {
      attackType: "projectile",
      mechanism: {
        kind: "ranged",
        weapon: {
          id: "outlaw-command-cannon",
          name: "Command Cannon",
          category: "ballistic",
          manufacturer: "Mercenary Guild",
          tier: 2,
          rarity: "rare",
          lore: "Suppressive fire is an order, not a weapon setting.",
          damageSchool: "physical",
          damageSourceKind: "direct",
          baseDamage: 6,
          critChance: 0.05,
          critMultiplier: 1.5,
          fireIntervalMs: 2000,
          firePattern: "burst",
          projectilesPerShot: 2,
          projectileBehaviour: "straight",
          range: 11,
          projectileSpeed: 12,
          pierceCount: 0,
          explosionRadius: 0,
          statusOnHit: { kind: "slow", chance: 0.25, strength: 3, durationMs: 900 }, // suppressive fire
          energyCost: 0,
          evolution: null,
        },
      },
      telegraphMs: 500,
    },
    specialAbility: {
      kind: "boostAllies",
      trigger: "onLowHealth",
      threshold: 0.4,
      bonus: { kind: "damage", value: 0.3 },
      cooldownMs: 10000,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "elite",
  },
];
