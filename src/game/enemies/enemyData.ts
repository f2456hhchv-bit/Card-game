/**
 * Enemy data shapes (AF-033). Ranged attacks ARE AF-032 WeaponDefs fired by
 * the enemy through the same weapon engine the player uses; special
 * abilities reuse AF-028's PassiveTrigger/EquipmentBonus shape; Elite is a
 * modifier over the existing elite:boolean flag every locked system already
 * consumes — no second schema, no new stat pipeline.
 */
import type { EquipmentBonus, PassiveTrigger } from "../equipment/equipmentData";
import type { DamageSchool } from "../combat/combatTuning";
import type { WeaponDef } from "../weapons/weaponData";
import type { XpTier } from "../progression/xpTuning";

export const ENEMY_FAMILIES = [
  "scout",
  "fighter",
  "interceptor",
  "destroyer",
  "drone",
  "swarm",
  "crystalOrganism",
  "voidEntity",
  "machineUnit",
  "ancientGuardian",
  "heavyAssault",
  "supportUnit",
  "summoner",
  "artillery",
  "livingStructure",
] as const;
export type EnemyFamily = (typeof ENEMY_FAMILIES)[number];

export const ENEMY_ROLES = [
  "chaser",
  "flanker",
  "sniper",
  "tank",
  "support",
  "healer",
  "disruptor",
  "summoner",
  "controller",
  "areaDenial",
  "elite",
  "bossSupport",
  // GP-002: seven spec-named roles with no prior tag at all — additive,
  // never renumbering the twelve above. Assigned to existing enemies whose
  // real, already-shipped kit already plays the role (never a new enemy).
  "assassin",
  "commander",
  "charger",
  "ambusher",
  "burrower",
  "exploder",
  "shieldUnit",
] as const;
export type EnemyRole = (typeof ENEMY_ROLES)[number];

export const MOVEMENT_BEHAVIOURS = [
  "directPursuit",
  "orbiting",
  "strafing",
  "kiting",
  "ambush",
  "teleport",
  "burrow",
  "wallCrawling",
  "formation",
  "retreat",
] as const;
export type MovementBehaviour = (typeof MOVEMENT_BEHAVIOURS)[number];

export const ATTACK_TYPES = [
  "projectile",
  "beam",
  "melee",
  "area",
  "charge",
  "missile",
  "droneLaunch",
  "summon",
  "nova",
  "status",
  "environmental",
] as const;
export type AttackType = (typeof ATTACK_TYPES)[number];

export const SPECIAL_ABILITIES = [
  "deployShields",
  "healAllies",
  "boostAllies",
  "spawnReinforcements",
  "createHazards",
  "teleport",
  "cloak",
  "split",
  "merge",
  "enrage",
] as const;
export type SpecialAbilityKind = (typeof SPECIAL_ABILITIES)[number];

export const DEATH_EVENT_KINDS = [
  "xp",
  "loot",
  "statusExplosion",
  "spawnEvent",
  "missionProgress",
  "researchSamples",
  "achievements",
  "specialEvents",
] as const;
export type DeathEventKind = (typeof DEATH_EVENT_KINDS)[number];

/** Melee/Charge reuse AF-021's contact-damage packet pattern (§2). */
export interface MeleeAttackMechanism {
  kind: "melee";
  baseDamage: number;
  damageSchool: DamageSchool;
  contactRangeUnits: number;
  cooldownMs: number;
}

/** Projectile/Beam/Missile/Nova/Area/Status attacks ARE AF-032 weapons (§2). */
export interface RangedAttackMechanism {
  kind: "ranged";
  weapon: WeaponDef;
}

export type AttackMechanism = MeleeAttackMechanism | RangedAttackMechanism;

export interface EnemyAttack {
  attackType: AttackType;
  mechanism: AttackMechanism;
  /** Readable-telegraph requirement, mechanically enforced (§2). */
  telegraphMs: number;
}

/** Reuses AF-028/AF-030/AF-031's exact trigger/bonus shape (§5). */
export interface EnemySpecialAbility {
  kind: SpecialAbilityKind;
  trigger: PassiveTrigger;
  threshold?: number;
  bonus: EquipmentBonus;
  cooldownMs: number;
}

/** A modifier over an EnemyDef, not a second schema (§4). */
export interface EliteModifier {
  hullMultiplier: number;
  damageMultiplier: number;
  speedMultiplier: number;
  bonusAbility: EnemySpecialAbility | null;
  rewardMultiplier: number;
}

export interface EnemyDef {
  id: string;
  name: string;
  family: EnemyFamily;
  roles: readonly EnemyRole[];
  lore: string;
  strengths: readonly string[];
  weaknesses: readonly string[];
  counterplay: string;
  hull: number;
  shield: number;
  movementBehaviour: MovementBehaviour;
  moveSpeed: number;
  attack: EnemyAttack;
  specialAbility: EnemySpecialAbility | null;
  eliteModifier: EliteModifier | null;
  deathEvents: readonly DeathEventKind[];
  xpTier: XpTier;
}

/** Fingerprint for the no-overlap law (AF-033 — mirrors AF-030/031/032). */
export function enemyFingerprint(enemy: EnemyDef): string {
  return [
    enemy.family,
    [...enemy.roles].sort().join(","),
    enemy.movementBehaviour,
    enemy.attack.mechanism.kind,
    enemy.specialAbility?.kind ?? "none",
  ].join("|");
}

export function findEnemyOverlap(
  candidate: EnemyDef,
  existing: readonly EnemyDef[],
): string | null {
  const candidateFingerprint = enemyFingerprint(candidate);
  for (const other of existing) {
    if (other.id === candidate.id) continue;
    if (enemyFingerprint(other) === candidateFingerprint) return other.id;
  }
  return null;
}

/** Pure: an elite-adjusted view of a def. Does not mutate the base def. */
export function applyEliteModifier(def: EnemyDef): EnemyDef {
  if (!def.eliteModifier) return def;
  const modifier = def.eliteModifier;
  return {
    ...def,
    hull: def.hull * modifier.hullMultiplier,
    moveSpeed: def.moveSpeed * modifier.speedMultiplier,
    specialAbility: modifier.bonusAbility ?? def.specialAbility,
  };
}

/** Sandbox roster — proves the family/role/movement/attack/elite/death-event engine. */
export const SANDBOX_ENEMIES: readonly EnemyDef[] = [
  {
    id: "wisp-chaser",
    name: "Wisp Chaser",
    family: "scout",
    roles: ["chaser", "charger"], // GP-002: fast direct-pursuit melee rush IS the charger role, already real
    lore: "Cheap, disposable, and everywhere. The galaxy's most successful design is the one nobody remembers dying.",
    strengths: ["Fast to close distance"],
    weaknesses: ["No ranged threat — dies the instant it's caught"],
    counterplay: "Kill it before it reaches contact range, or ignore it and out-position it.",
    hull: 24,
    shield: 0,
    movementBehaviour: "directPursuit",
    moveSpeed: 2.4,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 6, damageSchool: "physical", contactRangeUnits: 1.0, cooldownMs: 700 },
      telegraphMs: 0,
    },
    specialAbility: null,
    eliteModifier: {
      hullMultiplier: 3,
      damageMultiplier: 1.5,
      speedMultiplier: 0.9,
      rewardMultiplier: 3,
      bonusAbility: {
        kind: "enrage",
        trigger: "onLowHealth",
        threshold: 0.3,
        bonus: { kind: "movementSpeed", value: 0.5 },
        cooldownMs: 0,
      },
    },
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "medium",
  },
  {
    id: "flak-orbiter",
    name: "Flak Orbiter",
    family: "drone",
    roles: ["flanker", "sniper", "exploder"], // GP-002: its own statusExplosion death event IS the exploder role, already real
    lore: "It never gets close. It doesn't need to.",
    strengths: ["Keeps range, hard to punish while it's orbiting"],
    weaknesses: ["Slow projectiles — easy to dodge if you're not standing still"],
    counterplay: "Break line of sight or close the distance fast; it has no answer at melee range.",
    hull: 30,
    shield: 10,
    movementBehaviour: "orbiting",
    moveSpeed: 1.6,
    attack: {
      attackType: "projectile",
      mechanism: {
        kind: "ranged",
        weapon: {
          id: "flak-orbiter-cannon",
          name: "Flak Orbiter Cannon",
          category: "flak",
          manufacturer: "Machine Collective",
          tier: 1,
          rarity: "common",
          lore: "Ordnance salvaged from a hundred wrecks, none of them its own.",
          damageSchool: "physical",
          damageSourceKind: "direct",
          baseDamage: 5,
          critChance: 0,
          critMultiplier: 1,
          fireIntervalMs: 1800,
          firePattern: "singleShot",
          projectilesPerShot: 1,
          projectileBehaviour: "straight",
          range: 9,
          projectileSpeed: 10,
          pierceCount: 0,
          explosionRadius: 0,
          statusOnHit: { kind: "slow", chance: 0.35, strength: 4, durationMs: 1200 },
          energyCost: 0,
          evolution: null,
        },
      },
      telegraphMs: 450,
    },
    specialAbility: null,
    eliteModifier: {
      hullMultiplier: 2.5,
      damageMultiplier: 1.4,
      speedMultiplier: 1.1,
      rewardMultiplier: 3,
      bonusAbility: {
        kind: "enrage",
        trigger: "onLowHealth",
        threshold: 0.3,
        bonus: { kind: "damage", value: 0.4 },
        cooldownMs: 0,
      },
    },
    deathEvents: ["xp", "loot", "statusExplosion", "missionProgress", "achievements"],
    xpTier: "large",
  },
];
