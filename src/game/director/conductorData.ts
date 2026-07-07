/**
 * Director Conductor vocabulary + tuning (AF-056). AF-017's EnemyDirector is
 * LOCKED and remains byte-for-byte unmodified — AF-056 is fulfilled as a
 * conductor layer over its output. The conductor never touches enemy stats,
 * budgets, or the phase engine: it only shapes WHEN directives land
 * (reactive Recovery Windows + a fair, capped Spawn Queue) — "adaptation
 * adjusts pacing, not hidden difficulty", implemented literally.
 */
import type { DirectorPhase, WaveType } from "./directorTuning";

/** The nine Director responsibilities (AF-056 §Director Responsibilities) —
 * registered; each is discharged by AF-017's engine, the conductor, or a
 * named prior module (see the framework doc's responsibility table). */
export const DIRECTOR_RESPONSIBILITIES = [
  "enemySpawning",
  "eliteFrequency",
  "bossTiming",
  "encounterDensity",
  "eventTiming",
  "recoveryWindows",
  "resourceDrops",
  "environmentalPressure",
  "missionTempo",
] as const;
export type DirectorResponsibility = (typeof DIRECTOR_RESPONSIBILITIES)[number];

/** Encounter Types (AF-056 §Encounter Types) — ten registered; nine realised
 * today through the existing WaveType routing (see the mapping below). */
export const ENCOUNTER_TYPES_AF056 = [
  "patrol",
  "ambush",
  "swarm",
  "eliteHunt",
  "defensiveLine",
  "mixedFactions",
  "roamingThreat",
  "environmentalDefence",
  "ancientActivation",
  "dynamicReinforcements",
] as const;
export type EncounterTypeAF056 = (typeof ENCOUNTER_TYPES_AF056)[number];

/** Every AF-017 WaveType names an AF-056 encounter type — the ten faction
 * routings AF-046 → AF-055 built ARE the encounter catalogue, formalised. */
export const WAVE_TYPE_TO_ENCOUNTER_TYPE: Readonly<Record<WaveType, EncounterTypeAF056>> = {
  AmbientPatrol: "patrol", // AF-052's Nomad convoys
  AmbushEvent: "ambush", // AF-046's Outlaw squads
  SwarmWave: "swarm", // the one remaining generic wave
  EliteSquad: "eliteHunt", // AF-055's Eclipsed expeditions
  ReinforcementWave: "dynamicReinforcements", // AF-047's Machine networks
  HunterPack: "roamingThreat", // AF-051's Xenomorph hives
  MixedEncounter: "mixedFactions", // AF-048's mixed-roster Crystal ecosystems
  MiniBossWave: "ancientActivation", // AF-035's Hollow Sentinel — an ancient guardian
  BossWave: "ancientActivation",
};

/** The six pacing pressures (AF-056 §Pacing System) — derived, never stored. */
export const PACING_PRESSURES = ["lowPressure", "mediumPressure", "highPressure", "recovery", "escalation", "bossPreparation"] as const;
export type PacingPressure = (typeof PACING_PRESSURES)[number];

/** Pure: the current pressure label from the Director's own phase plus the
 * conductor's window state — an open Recovery Window overrides everything. */
export function pressureFor(phase: DirectorPhase, recoveryWindowOpen: boolean): PacingPressure {
  if (recoveryWindowOpen) return "recovery";
  switch (phase) {
    case "Recovery":
    case "Reward":
    case "LightContact":
      return "lowPressure";
    case "Combat":
    case "EnvironmentalEvent":
      return "mediumPressure";
    case "HeavyCombat":
      return "highPressure";
    case "ElitePressure":
      return "escalation";
    case "MiniBoss":
    case "BossHandoff":
      return "bossPreparation";
  }
}

/** The five Recovery Window triggers (AF-056 §Recovery Windows) — all live. */
export const RECOVERY_TRIGGERS = ["eliteBattles", "majorEvents", "bossPhases", "largeEnemyWaves", "resourceDiscoveries"] as const;
export type RecoveryTrigger = (typeof RECOVERY_TRIGGERS)[number];

/** The seven Adaptive Response inputs (AF-056 §Adaptive Response) — two live
 * (playerHealth, damageTaken), five registered analysis surfaces. */
export const ADAPTIVE_RESPONSE_INPUTS = [
  "playerHealth",
  "damageTaken",
  "averageKillSpeed",
  "buildStrength",
  "movementEfficiency",
  "missionTime",
  "resourceEconomy",
] as const;
export type AdaptiveResponseInput = (typeof ADAPTIVE_RESPONSE_INPUTS)[number];

/** Faction Mixing kinds (AF-056 §Faction Mixing) — six registered; single-
 * faction is every AF-046 → AF-055 entrance, and dual-faction moments emerge
 * mechanically when the Spawn Queue flushes two different faction directives
 * in the same tick after a Recovery Window closes. */
export const FACTION_MIX_KINDS = ["singleFaction", "dualFaction", "environmentalCreatures", "corruptedVariants", "specialEvents", "hybridEncounters"] as const;
export type FactionMixKind = (typeof FACTION_MIX_KINDS)[number];

/** Conductor tuning — pacing only; no field here can change an enemy stat. */
export const CONDUCTOR_TUNING = {
  /** Recovery Window duration scales between these with player struggle — never excessive. */
  minWindowMs: 2000,
  maxWindowMs: 9000,
  /** Windows never chain — a fresh trigger inside cooldown is ignored. */
  windowCooldownMs: 10000,
  /** Struggle: a decaying accumulator of recent damage taken, normalised by this reference. */
  struggleReferenceDamage: 40,
  struggleHalfLifeMs: 6000,
  /** A wave landing at least this many enemies is a Large Enemy Wave. */
  largeWaveThreshold: 6,
  /** Soft-lock prevention: the queue never holds more than this; overflow flushes oldest immediately. */
  maxQueuedDirectives: 3,
} as const;
