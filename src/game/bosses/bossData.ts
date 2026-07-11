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
    // GP-002: the registered "fourPhase" PHASE_SYSTEM value, completed with
    // two new real phases below — Learning/Pressure/Chaos/Signature, each a
    // genuine attack+movement+mechanic change, never a hull-threshold-only
    // stat bump. phase-2's own hullThreshold moved from 0.5 to 0.7 to make
    // room for the two new phases below it; its attack/movement content is untouched.
    phaseSystem: "fourPhase",
    // GP-002: hull raised from 900 to 3000 alongside the new phases — with
    // four real phase transitions to cross instead of one, each threshold
    // gap needs enough absolute hull headroom to survive a transition's own
    // ~500ms damage-still-applies window without cascading straight through
    // the next phase (and past Enrage) before ever returning to "engaging".
    hull: 3000,
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
        hullThreshold: 0.75,
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
      // GP-002: Phase 3 — "Chaos". The vault's guardian abandons its own
      // patrol logic; a spiral barrage plus wall-crawling movement is a
      // genuinely new pressure shape, not a scaled repeat of phase 1 or 2.
      {
        phaseId: "phase-3-chaos",
        hullThreshold: 0.5,
        attack: {
          attackType: "missile",
          mechanism: {
            kind: "ranged",
            weapon: {
              id: "sentinel-chaos-spiral",
              name: "Chaos Spiral",
              category: "missile",
              manufacturer: "Ancient Guardian Remnant",
              tier: 4,
              rarity: "legendary",
              lore: "It stops choosing where to aim. Everywhere is close enough.",
              damageSchool: "physical",
              damageSourceKind: "boss",
              baseDamage: 7,
              critChance: 0,
              critMultiplier: 1,
              fireIntervalMs: 900,
              firePattern: "spiral",
              projectilesPerShot: 6,
              projectileBehaviour: "straight",
              range: 13,
              projectileSpeed: 11,
              pierceCount: 0,
              explosionRadius: 1,
              statusOnHit: null,
              energyCost: 0,
              evolution: null,
            },
          },
          telegraphMs: 700,
        },
        movementBehaviour: "wallCrawling",
        moveSpeed: 2.1,
        additionalAbility: null,
        mechanic: "areaDenial",
      },
      // GP-002: Phase 4 — "Signature". The Hollow Sentinel's one truly
      // unique attack, saved for the very end — a sustained beam, never used
      // in any earlier phase, timed to land alongside its own existing
      // low-health Enrage bonus for one real final-stand moment.
      {
        phaseId: "phase-4-signature",
        hullThreshold: 0.32,
        attack: {
          attackType: "beam",
          mechanism: {
            kind: "ranged",
            weapon: {
              id: "sentinel-vault-beam",
              name: "Vault Beam",
              category: "beam",
              manufacturer: "Ancient Guardian Remnant",
              tier: 4,
              rarity: "legendary",
              lore: "What it was built to protect the vault from, once. It remembers how.",
              damageSchool: "energy",
              damageSourceKind: "boss",
              baseDamage: 22,
              critChance: 0,
              critMultiplier: 1,
              fireIntervalMs: 1800,
              firePattern: "beam",
              projectilesPerShot: 1,
              projectileBehaviour: "straight",
              range: 18,
              projectileSpeed: 20,
              pierceCount: 3,
              explosionRadius: 0,
              statusOnHit: { kind: "burn", chance: 0.5, strength: 6, durationMs: 2500 },
              energyCost: 0,
              evolution: null,
            },
          },
          telegraphMs: 1300,
        },
        movementBehaviour: "teleport",
        moveSpeed: 1.8,
        additionalAbility: null,
        mechanic: "energyBeams",
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

/**
 * GP-002 §Enemy Hierarchy: "World Boss" as a real, distinct category from a
 * single ordinary Boss — built by scaling an existing BossDef exactly the
 * way AF-034's EliteGenerator already scales a base EnemyDef (hull/threat
 * multipliers over the same phases/weak points/enrage/mastery content), not
 * a second duplicated content block. The composition root triggers this via
 * a deep-extraction "boss chance" roll (GP-002 §Mission End).
 */
export function createWorldBossVariant(base: BossDef, hullMultiplier: number): BossDef {
  return {
    ...base,
    id: `${base.id}-world-boss`,
    name: `World-Ender ${base.name}`,
    title: `${base.title} (Awakened)`,
    threatRating: base.threatRating + 2,
    hull: base.hull * hullMultiplier,
    codexId: `${base.codexId}-world-boss`,
  };
}

/** The one World Boss content actually authored today — a scaled Hollow Sentinel. */
export const WORLD_BOSS: BossDef = createWorldBossVariant(SANDBOX_BOSSES[0]!, 1.75);

/**
 * GP-FINAL §Run Structure: "Mini Boss every 5 waves, Major Boss every 10" —
 * the audit found only one boss tier existed (the ordinary Boss, once per
 * run, on a fixed timer, never wave-count-driven). A Mini Boss reuses this
 * exact scaling pattern INVERTED — fewer phases (a genuinely shorter, less
 * dangerous fight, not a re-skinned identical encounter) and reduced hull —
 * over the same phase/weak-point/enrage/mastery-challenge/reward engine, no
 * second boss-content model.
 */
export function createMiniBossVariant(base: BossDef, hullMultiplier: number, phaseCount: number): BossDef {
  const phases = base.phases.slice(0, Math.max(1, phaseCount));
  return {
    ...base,
    id: `${base.id}-mini-boss`,
    name: `${base.name} Vanguard`,
    title: `Lesser ${base.title}`,
    threatRating: Math.max(1, base.threatRating - 2),
    hull: base.hull * hullMultiplier,
    phaseSystem: phases.length >= 2 ? "twoPhase" : "onePhase",
    phases,
    codexId: `${base.codexId}-mini-boss`,
  };
}

/** The one Mini Boss content authored today — a lighter, two-phase Hollow Sentinel encounter. */
export const MINI_BOSS: BossDef = createMiniBossVariant(SANDBOX_BOSSES[0]!, 0.35, 2);
