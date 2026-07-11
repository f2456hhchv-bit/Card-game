/**
 * GP-003 §Atlas Progression: a single unified Atlas number composed from
 * ten already-registered trackers (Museum/Research/Knowledge/Hope/
 * Civilisation/Planet Restoration/Species Recovery/Education/History/
 * Exploration) — the audit found dozens of independently-named atlas*
 * runtimes riding on the same generic meta.recordStat/discover primitives,
 * but no single composed score. Pure composition: this module holds no
 * state of its own and reads nothing directly — the caller gathers each
 * axis's real 0-100 value from its own already-live tracker.
 */
export const ATLAS_PROGRESSION_AXES = [
  "museum",
  "research",
  "knowledge",
  "hope",
  "civilisation",
  "planetRestoration",
  "speciesRecovery",
  "education",
  "history",
  "exploration",
] as const;
export type AtlasProgressionAxis = (typeof ATLAS_PROGRESSION_AXES)[number];

export interface AtlasProgressionSnapshot {
  axisScores: Readonly<Record<AtlasProgressionAxis, number>>;
  overallScore: number;
  strongestAxis: AtlasProgressionAxis;
  weakestAxis: AtlasProgressionAxis;
}

/** Every axis clamps to [0, 100] — a caller passing a raw, unbounded count
 * (e.g. "species adaptations recorded") is expected to have already scaled
 * it, but clamping here means a runaway input can never corrupt the overall score. */
export function atlasProgressionSnapshot(axisScores: Readonly<Record<AtlasProgressionAxis, number>>): AtlasProgressionSnapshot {
  const clamped = {} as Record<AtlasProgressionAxis, number>;
  for (const axis of ATLAS_PROGRESSION_AXES) clamped[axis] = Math.max(0, Math.min(100, axisScores[axis]));
  const overallScore = ATLAS_PROGRESSION_AXES.reduce((sum, axis) => sum + clamped[axis], 0) / ATLAS_PROGRESSION_AXES.length;
  let strongestAxis: AtlasProgressionAxis = ATLAS_PROGRESSION_AXES[0]!;
  let weakestAxis: AtlasProgressionAxis = ATLAS_PROGRESSION_AXES[0]!;
  for (const axis of ATLAS_PROGRESSION_AXES) {
    if (clamped[axis] > clamped[strongestAxis]) strongestAxis = axis;
    if (clamped[axis] < clamped[weakestAxis]) weakestAxis = axis;
  }
  return { axisScores: clamped, overallScore, strongestAxis, weakestAxis };
}
