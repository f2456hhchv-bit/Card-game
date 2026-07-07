/**
 * Boss data shapes (AF-035). A Boss's per-phase attack/movement reuse
 * AF-033's exact EnemyAttack/MovementBehaviour vocabulary; Armour reuses
 * AF-021's DefenceState.damageReduction; rewards reuse AF-022/23/24/25/29's
 * existing systems via the same elite:boolean-style AF-021 "boss" damage
 * kind/resistance and AF-022's "boss" XpTier every prior module already
 * reserved. No second combat, reward, or movement model.
 */
import type { EnemyAttack, EnemyFamily, EnemySpecialAbility, MovementBehaviour } from "../enemies/enemyData";
import type { LootCategory } from "../loot/lootTuning";
import type { MasteryReward } from "../meta/metaData";

export const PHASE_SYSTEMS = [
  "onePhase",
  "twoPhase",
  "threePhase",
  "fourPhase",
  "dynamicPhase",
  "hiddenPhase",
  "mythicPhase",
] as const;
export type PhaseSystem = (typeof PHASE_SYSTEMS)[number];

export const BOSS_MECHANICS = [
  "projectilePatterns",
  "laserSystems",
  "areaDenial",
  "summons",
  "environmentalHazards",
  "shieldPhases",
  "weakPoints",
  "rotatingArmour",
  "gravityFields",
  "energyBeams",
  "teleportation",
  "arenaManipulation",
] as const;
export type BossMechanic = (typeof BOSS_MECHANICS)[number];

export const ENRAGE_TRIGGERS = ["lowHealth", "missionModifier", "ascension", "timeLimit", "specialEvent"] as const;
export type EnrageTrigger = (typeof ENRAGE_TRIGGERS)[number];

export const MASTERY_CHALLENGE_KINDS = [
  "noDamage",
  "timeLimit",
  "specificCommander",
  "specificShip",
  "difficultyModifier",
  "specialConditions",
] as const;
export type MasteryChallengeKind = (typeof MASTERY_CHALLENGE_KINDS)[number];

export interface WeakPointDef {
  id: string;
  name: string;
  /** Fraction of the boss's total hull this weak point starts with. */
  hullFraction: number;
  damageMultiplier: number;
}

export interface BossPhaseDef {
  phaseId: string;
  /** This phase begins once boss hull fraction drops to or below this value. Phase 0 is always 1. */
  hullThreshold: number;
  attack: EnemyAttack;
  movementBehaviour: MovementBehaviour;
  moveSpeed: number;
  additionalAbility: EnemySpecialAbility | null;
  /** Content label — which BOSS_MECHANICS this phase is built around. */
  mechanic: BossMechanic;
}

export interface BossEnrageDef {
  trigger: EnrageTrigger;
  /** onLowHealth-style threshold (hull fraction) for the "lowHealth" trigger. */
  hullThreshold?: number;
  timeLimitMs?: number;
  ascensionThreshold?: number;
  damageMultiplier: number;
  speedMultiplier: number;
}

export interface BossMasteryChallengeDef {
  id: string;
  kind: MasteryChallengeKind;
  description: string;
  reward: MasteryReward;
}

export interface BossRewards {
  xpTier: "boss";
  dropCategories: readonly LootCategory[];
  guaranteedRelic: boolean;
  guaranteedBlueprint: boolean;
}

export interface BossDef {
  id: string;
  name: string;
  title: string;
  faction: string;
  threatRating: number;
  lore: string;
  family: EnemyFamily;
  phaseSystem: PhaseSystem;
  hull: number;
  shield: number;
  /** AF-021's DefenceState.damageReduction — Armour is not a second mitigation model. */
  armour: number;
  weakPoints: readonly WeakPointDef[];
  /** Ordered by descending hullThreshold; phases[0].hullThreshold is always 1. */
  phases: readonly BossPhaseDef[];
  enrage: BossEnrageDef | null;
  rewards: BossRewards;
  masteryChallenges: readonly BossMasteryChallengeDef[];
  codexId: string;
}

/** Sandbox boss — proves the phase/weak-point/enrage/mastery-challenge/reward engine. */
export const SANDBOX_BOSSES: readonly BossDef[] = [
  {
    id: "hollow-sentinel",
    name: "The Hollow Sentinel",
    title: "Last Watcher of the Drift",
    faction: "Ancient Guardian Remnant",
    threatRating: 8,
    lore: "It has guarded an empty vault for ten thousand years. It no longer remembers what was inside.",
    family: "ancientGuardian",
    phaseSystem: "twoPhase",
    hull: 900,
    shield: 200,
    armour: 0.15,
    weakPoints: [{ id: "core-eye", name: "Core Eye", hullFraction: 0.2, damageMultiplier: 2.5 }],
    phases: [
      {
        phaseId: "phase-1-siege",
        hullThreshold: 1,
        attack: {
          attackType: "projectile",
          mechanism: {
            kind: "ranged",
            weapon: {
              id: "sentinel-siege-cannon",
              name: "Siege Cannon",
              category: "railgun",
              manufacturer: "Ancient Guardian Remnant",
              tier: 4,
              rarity: "legendary",
              lore: "A single shot that once cracked a moon.",
              damageSchool: "physical",
              damageSourceKind: "boss",
              baseDamage: 16,
              critChance: 0,
              critMultiplier: 1,
              fireIntervalMs: 1400,
              firePattern: "singleShot",
              projectilesPerShot: 1,
              projectileBehaviour: "straight",
              range: 16,
              projectileSpeed: 14,
              pierceCount: 1,
              explosionRadius: 1.5,
              statusOnHit: null,
              energyCost: 0,
              evolution: null,
            },
          },
          telegraphMs: 900,
        },
        movementBehaviour: "orbiting",
        moveSpeed: 1.4,
        additionalAbility: null,
        mechanic: "projectilePatterns",
      },
      {
        phaseId: "phase-2-collapse",
        hullThreshold: 0.5,
        attack: {
          attackType: "nova",
          mechanism: {
            kind: "ranged",
            weapon: {
              id: "sentinel-collapse-nova",
              name: "Collapse Nova",
              category: "void",
              manufacturer: "Ancient Guardian Remnant",
              tier: 4,
              rarity: "legendary",
              lore: "The vault's last defence: deny the intruder everywhere at once.",
              damageSchool: "energy",
              damageSourceKind: "boss",
              baseDamage: 9,
              critChance: 0,
              critMultiplier: 1,
              fireIntervalMs: 2200,
              firePattern: "nova",
              projectilesPerShot: 10,
              projectileBehaviour: "straight",
              range: 11,
              projectileSpeed: 9,
              pierceCount: 0,
              explosionRadius: 0,
              statusOnHit: { kind: "corruption", chance: 0.4, strength: 4, durationMs: 2000 },
              energyCost: 0,
              evolution: null,
            },
          },
          telegraphMs: 1100,
        },
        movementBehaviour: "teleport",
        moveSpeed: 1.6,
        additionalAbility: null,
        mechanic: "arenaManipulation",
      },
    ],
    enrage: {
      trigger: "lowHealth",
      hullThreshold: 0.15,
      damageMultiplier: 0.5,
      speedMultiplier: 0.3,
    },
    rewards: {
      xpTier: "boss",
      dropCategories: ["equipment", "craftingMaterial", "researchSample"],
      guaranteedRelic: true,
      guaranteedBlueprint: true,
    },
    masteryChallenges: [
      {
        id: "hollow-sentinel-flawless",
        kind: "noDamage",
        description: "Defeat the Hollow Sentinel without taking damage.",
        reward: { kind: "title", id: "TITLE_UNSCARRED" },
      },
    ],
    codexId: "hollow-sentinel",
  },
];
