/**
 * Boss Director vocabulary + tuning (AF-057). AF-035's BossRuntime is LOCKED
 * and remains byte-for-byte unmodified — AF-057 is fulfilled the same way
 * AF-056 was: as a director layer that DECORATES the locked runtime rather
 * than replacing it. The BossRuntime keeps owning phases, enrage, weak
 * points, and the intro/death/ceremony state machine; the director owns
 * everything BETWEEN those facts — transition breathing room, the summon
 * queue, arena escalation, cinematic one-shots, paced ceremony lines, and
 * persistent Boss Memory through AF-026's existing stats.
 */

/** The twelve encounter beats (AF-057 §Boss Encounter Flow) — registered;
 * eight are live-derived from the BossRuntime's own state plus the
 * director's transition window (see `beatFor`); Mission Progress, Arena
 * Activation, Boss Arrival, and Mission Continuation are owned by AF-017's
 * MiniBoss phase, `spawnBoss`, and AF-037's mission flow respectively. */
export const BOSS_ENCOUNTER_BEATS = [
  "missionProgress",
  "arenaActivation",
  "bossArrival",
  "introductionSequence",
  "phaseOne",
  "arenaEvolution",
  "phaseTwo",
  "environmentalEscalation",
  "finalPhase",
  "defeatSequence",
  "rewardCeremony",
  "missionContinuation",
] as const;
export type BossEncounterBeat = (typeof BOSS_ENCOUNTER_BEATS)[number];

/** Pure: the live beat from the BossRuntime's state, the phase position, and
 * the director's transition window. Later phases escalate the transition
 * beat itself — arena evolution first, environmental escalation after. */
export function beatFor(
  bossState: "introduction" | "fighting" | "deathSequence" | "rewardCeremony" | string,
  phaseIndex: number,
  phaseCount: number,
  transitionActive: boolean,
): BossEncounterBeat {
  if (bossState === "introduction") return "introductionSequence";
  if (bossState === "deathSequence") return "defeatSequence";
  if (bossState === "rewardCeremony") return "rewardCeremony";
  if (transitionActive) return phaseIndex >= phaseCount - 1 ? "environmentalEscalation" : "arenaEvolution";
  if (phaseIndex <= 0) return "phaseOne";
  if (phaseIndex >= phaseCount - 1) return "finalPhase";
  return "phaseTwo";
}

/** What a phase may alter (AF-057 §Phase Management) — nine registered;
 * attack patterns/movement are AF-035 phase defs, summons and arena layout
 * (hazard escalation) go live here, the rest bind at asset/audio passes. */
export const PHASE_ALTERATIONS = [
  "attackPatterns",
  "movement",
  "arenaLayout",
  "environmentalHazards",
  "summons",
  "music",
  "lighting",
  "dialogue",
  "bossPersonality",
] as const;
export type PhaseAlteration = (typeof PHASE_ALTERATIONS)[number];

export const ARENA_CONTROL_FEATURES = [
  "dynamicWalls",
  "energyBarriers",
  "gravityFields",
  "movingStructures",
  "environmentalHazards",
  "safeZones",
  "interactiveObjects",
] as const;
export type ArenaControlFeature = (typeof ARENA_CONTROL_FEATURES)[number];

export const BOSS_SUMMON_KINDS = [
  "factionReinforcements",
  "eliteGuards",
  "environmentalHazards",
  "constructs",
  "livingStructures",
  "droneWaves",
  "temporaryAllies",
] as const;
export type BossSummonKind = (typeof BOSS_SUMMON_KINDS)[number];

export const CINEMATIC_BEATS = [
  "bossArrival",
  "cameraEvents",
  "lightingChanges",
  "environmentalAnimation",
  "musicTransition",
  "dialogue",
  "victorySequence",
] as const;
export type CinematicBeat = (typeof CINEMATIC_BEATS)[number];

export const LEGENDARY_MOMENT_KINDS = [
  "planetaryCollapse",
  "solarFlares",
  "ancientWeaponActivation",
  "realityFracture",
  "fleetArrival",
  "environmentalTransformation",
  "civilisationDiscovery",
] as const;
export type LegendaryMomentKind = (typeof LEGENDARY_MOMENT_KINDS)[number];

/** Boss Memory keys (AF-057 §Boss Memory) — eight registered; attempts,
 * victories, and fastest kill are live AF-026 stats, mastery challenges have
 * been live since AF-035; the loadout keys bind when the Hangar records runs. */
export const BOSS_MEMORY_KEYS = [
  "attempts",
  "victories",
  "fastestKill",
  "difficulty",
  "commanderUsed",
  "shipUsed",
  "weaponUsed",
  "masteryChallenges",
] as const;
export type BossMemoryKey = (typeof BOSS_MEMORY_KEYS)[number];

export const MULTI_BOSS_KINDS = [
  "dualBosses",
  "sequentialBosses",
  "environmentalBosses",
  "factionBosses",
  "ancientGuardians",
  "worldEvents",
  "raidEncounters",
] as const;
export type MultiBossKind = (typeof MULTI_BOSS_KINDS)[number];

/** A queued summon — materialised by the composition root through the same
 * shared spawn path every enemy already uses. */
export interface BossSummonSpec {
  enemyId: string;
  count: number;
  elite: boolean;
  kind: BossSummonKind;
}

/** The Hollow Sentinel's summon plan, keyed by the phase index being ENTERED —
 * entering the Collapse phase wakes the vault's last guards. Data, not code. */
export const SANDBOX_BOSS_SUMMON_PLAN: Readonly<Record<number, readonly BossSummonSpec[]>> = {
  1: [
    { enemyId: "wisp-chaser", count: 2, elite: false, kind: "droneWaves" },
    { enemyId: "wisp-chaser", count: 1, elite: true, kind: "eliteGuards" },
  ],
};

/** Director tuning — pacing and presentation only; nothing here can change a boss stat. */
export const BOSS_DIRECTOR_TUNING = {
  /** Between-phase breathing room: the boss holds fire while the arena evolves. */
  phaseTransitionRecoveryMs: 2500,
  /** Summons drain one spec per cadence tick, after the transition ends — never a dump. */
  summonCadenceMs: 1200,
  maxQueuedSummons: 6,
  /** Arena escalation: the existing AF-035 hazard zone grows per phase reached. */
  hazardRadiusGrowthPerPhase: 0.3,
  /** Reward Ceremony lines land one at a time — presentation, paced. */
  ceremonyLineCadenceMs: 900,
} as const;
