import { describe, expect, it } from "vitest";
import { ATLAS_PROGRESSION_AXES, atlasProgressionSnapshot, type AtlasProgressionAxis } from "../src/game/atlasProgression/AtlasProgressionRuntime";

function allAxes(value: number): Record<AtlasProgressionAxis, number> {
  const out = {} as Record<AtlasProgressionAxis, number>;
  for (const axis of ATLAS_PROGRESSION_AXES) out[axis] = value;
  return out;
}

describe("GP-003 §Atlas Progression — a single unified score over ten real axes", () => {
  it("registers exactly the spec's ten named axes", () => {
    expect(ATLAS_PROGRESSION_AXES.length).toBe(10);
    expect(ATLAS_PROGRESSION_AXES).toEqual([
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
    ]);
  });

  it("overallScore is the plain average of every axis", () => {
    const snapshot = atlasProgressionSnapshot(allAxes(50));
    expect(snapshot.overallScore).toBe(50);
  });

  it("clamps every axis to [0, 100] so a runaway input can never corrupt the score", () => {
    const inputs = allAxes(50);
    inputs.museum = 500;
    inputs.hope = -20;
    const snapshot = atlasProgressionSnapshot(inputs);
    expect(snapshot.axisScores.museum).toBe(100);
    expect(snapshot.axisScores.hope).toBe(0);
  });

  it("identifies the strongest and weakest axis", () => {
    const inputs = allAxes(50);
    inputs.research = 90;
    inputs.speciesRecovery = 10;
    const snapshot = atlasProgressionSnapshot(inputs);
    expect(snapshot.strongestAxis).toBe("research");
    expect(snapshot.weakestAxis).toBe("speciesRecovery");
  });

  it("real gameplay never goes backward: a snapshot fed monotonically-increasing axis inputs never decreases", () => {
    let previous = atlasProgressionSnapshot(allAxes(0)).overallScore;
    for (let i = 10; i <= 100; i += 10) {
      const next = atlasProgressionSnapshot(allAxes(i)).overallScore;
      expect(next).toBeGreaterThanOrEqual(previous);
      previous = next;
    }
  });
});
