/**
 * Hit-stop (hitstop/hit-pause) tuning surface — GP-001 §Game Feel. Mirrors
 * cameraTuning.ts's own shape/discipline exactly (data edit, never a code
 * edit): per-source impulse durations plus a clarity cap so stacked
 * impulses (e.g. several crits in one tick) never compound into something
 * disruptive or seizure-risk.
 */
export type HitStopSource = "criticalHit" | "eliteKill" | "bossPhaseChange" | "bossDefeated" | "playerDefeated";

export interface HitStopTuning {
  /** Per-source freeze duration in ms (AF-018 §5's shakeAmplitudes, same idea). */
  durations: Readonly<Record<HitStopSource, number>>;
  /** Clarity cap: stacked impulses never push the freeze past this. */
  maxStopMs: number;
}

export const DEFAULT_HITSTOP_TUNING: HitStopTuning = {
  durations: {
    criticalHit: 40,
    eliteKill: 90,
    bossPhaseChange: 150,
    bossDefeated: 220,
    playerDefeated: 260,
  },
  maxStopMs: 260,
};
