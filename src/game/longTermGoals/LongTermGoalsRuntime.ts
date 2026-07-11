/**
 * GP-003 §Long Term Goals: a real, unified completionist tracker over the
 * spec's own nine named goals (Unlock all ships / Recruit every Commander /
 * Complete Museum / Restore every planet / Finish Research Tree / Unlock
 * every Galaxy / Complete every Mission / Collect Legendary Artifacts /
 * 100% Atlas Completion) — previously each system tracked its own state
 * with no unified long-term-goal surface. Pure composition, like
 * AtlasProgressionRuntime: holds no state, reads nothing directly — the
 * caller supplies each goal's real current/target pair from its own
 * already-live tracker.
 */
export const LONG_TERM_GOAL_TRACKS = [
  "unlockAllShips",
  "recruitEveryCommander",
  "completeMuseum",
  "restoreEveryPlanet",
  "finishResearchTree",
  "unlockEveryGalaxy",
  "completeEveryMission",
  "collectLegendaryArtifacts",
  "atlasCompletion",
] as const;
export type LongTermGoalTrack = (typeof LONG_TERM_GOAL_TRACKS)[number];

export interface LongTermGoalProgress {
  current: number;
  target: number;
}

export interface LongTermGoalStatus {
  current: number;
  target: number;
  percent: number;
  complete: boolean;
}

export interface LongTermGoalsSnapshot {
  goals: Readonly<Record<LongTermGoalTrack, LongTermGoalStatus>>;
  completedCount: number;
  overallCompletionPercent: number;
}

export function longTermGoalsSnapshot(inputs: Readonly<Record<LongTermGoalTrack, LongTermGoalProgress>>): LongTermGoalsSnapshot {
  const goals = {} as Record<LongTermGoalTrack, LongTermGoalStatus>;
  let completedCount = 0;
  let percentSum = 0;
  for (const track of LONG_TERM_GOAL_TRACKS) {
    const { current, target } = inputs[track];
    const clampedCurrent = Math.max(0, Math.min(current, target));
    const percent = target > 0 ? (clampedCurrent / target) * 100 : 100;
    const complete = clampedCurrent >= target;
    if (complete) completedCount += 1;
    percentSum += percent;
    goals[track] = { current: clampedCurrent, target, percent, complete };
  }
  return { goals, completedCount, overallCompletionPercent: percentSum / LONG_TERM_GOAL_TRACKS.length };
}
