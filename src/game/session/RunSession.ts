/**
 * Run session record (AF-016 §4): everything needed to describe — and with
 * the deterministic sim, reproduce — a run. Persisted in the `run` save
 * slice while active; results feed the statistics slice at Results.
 */
export const RUN_PHASES = [
  "Spawn",
  "EarlyExploration",
  "EnemyEscalation",
  "EliteEncounters",
  "EnvironmentalEvents",
  "MiniBoss",
  "MidgameScaling",
  "BossEncounter",
  "RewardPhase",
  "Extraction",
  "Results",
] as const;

export type RunPhase = (typeof RUN_PHASES)[number];

export type RunResult = "victory" | "defeat";

export interface RunConfig {
  missionId: string;
  commanderId: string;
  shipId: string;
  weaponIds: readonly string[];
  equipmentIds: readonly string[];
  difficulty: string;
  ascension: number;
  biomeId: string;
}

export interface RunSessionRecord extends RunConfig {
  seed: number;
  startedAt: number;
  playTimeMs: number;
  phase: RunPhase;
  result: RunResult | null;
  /** Named counters (kills, damage, pickups, …) filled in by AF-021+. */
  stats: Record<string, number>;
}

export function createRunSession(
  config: RunConfig,
  seed: number,
  startedAt: number,
): RunSessionRecord {
  return {
    ...config,
    seed,
    startedAt,
    playTimeMs: 0,
    phase: "Spawn",
    result: null,
    stats: {},
  };
}

/**
 * Advance to the next lifecycle phase. Returns the new phase, or null when
 * already at Results. Defeat may jump straight to Results from any phase —
 * failure is a valid outcome routed through the same flow (AF-016 §7).
 */
export function advancePhase(session: RunSessionRecord): RunPhase | null {
  const index = RUN_PHASES.indexOf(session.phase);
  const next = RUN_PHASES[index + 1];
  if (next === undefined) return null;
  session.phase = next;
  return next;
}
