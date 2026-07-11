import { describe, expect, it } from "vitest";
import { LONG_TERM_GOAL_TRACKS, longTermGoalsSnapshot, type LongTermGoalProgress, type LongTermGoalTrack } from "../src/game/longTermGoals/LongTermGoalsRuntime";

function allGoals(current: number, target: number): Record<LongTermGoalTrack, LongTermGoalProgress> {
  const out = {} as Record<LongTermGoalTrack, LongTermGoalProgress>;
  for (const track of LONG_TERM_GOAL_TRACKS) out[track] = { current, target };
  return out;
}

describe("GP-003 §Long Term Goals — a unified completionist tracker over nine real goals", () => {
  it("registers exactly the spec's nine named goals", () => {
    expect(LONG_TERM_GOAL_TRACKS.length).toBe(9);
    expect(LONG_TERM_GOAL_TRACKS).toEqual([
      "unlockAllShips",
      "recruitEveryCommander",
      "completeMuseum",
      "restoreEveryPlanet",
      "finishResearchTree",
      "unlockEveryGalaxy",
      "completeEveryMission",
      "collectLegendaryArtifacts",
      "atlasCompletion",
    ]);
  });

  it("zero progress is 0% complete, nothing done", () => {
    const snapshot = longTermGoalsSnapshot(allGoals(0, 10));
    expect(snapshot.overallCompletionPercent).toBe(0);
    expect(snapshot.completedCount).toBe(0);
  });

  it("full progress on every goal is 100% complete, all nine done", () => {
    const snapshot = longTermGoalsSnapshot(allGoals(10, 10));
    expect(snapshot.overallCompletionPercent).toBe(100);
    expect(snapshot.completedCount).toBe(9);
  });

  it("clamps current to target so overshooting a goal never exceeds 100% for that goal", () => {
    const inputs = allGoals(5, 10);
    inputs.atlasCompletion = { current: 999, target: 10 };
    const snapshot = longTermGoalsSnapshot(inputs);
    expect(snapshot.goals.atlasCompletion.current).toBe(10);
    expect(snapshot.goals.atlasCompletion.percent).toBe(100);
    expect(snapshot.goals.atlasCompletion.complete).toBe(true);
  });

  it("a goal exactly at target is complete; one short is not", () => {
    const inputs = allGoals(0, 10);
    inputs.finishResearchTree = { current: 10, target: 10 };
    inputs.unlockEveryGalaxy = { current: 9, target: 10 };
    const snapshot = longTermGoalsSnapshot(inputs);
    expect(snapshot.goals.finishResearchTree.complete).toBe(true);
    expect(snapshot.goals.unlockEveryGalaxy.complete).toBe(false);
  });

  it("a target of zero (nothing to collect) reads as already complete rather than dividing by zero", () => {
    const inputs = allGoals(5, 10);
    inputs.collectLegendaryArtifacts = { current: 0, target: 0 };
    const snapshot = longTermGoalsSnapshot(inputs);
    expect(snapshot.goals.collectLegendaryArtifacts.percent).toBe(100);
    expect(snapshot.goals.collectLegendaryArtifacts.complete).toBe(true);
  });
});
