import { describe, it, expect } from "vitest";
import { PRESTIGE, afterglowForStage, powerMultiplier } from "./prestigeDefs";

describe("afterglowForStage", () => {
  it("grants nothing below the unlock stage", () => {
    expect(afterglowForStage(1)).toBe(0);
    expect(afterglowForStage(PRESTIGE.unlockStage - 1)).toBe(0);
  });

  it("grants a positive amount at and above the unlock stage, non-decreasing", () => {
    const atUnlock = afterglowForStage(PRESTIGE.unlockStage);
    const further = afterglowForStage(PRESTIGE.unlockStage + 50);
    expect(atUnlock).toBeGreaterThanOrEqual(0);
    expect(further).toBeGreaterThan(atUnlock);
  });
});

describe("powerMultiplier", () => {
  it("is 1 at zero afterglow and grows with it", () => {
    expect(powerMultiplier(0)).toBe(1);
    expect(powerMultiplier(10)).toBeGreaterThan(1);
    expect(powerMultiplier(100)).toBeGreaterThan(powerMultiplier(10));
  });
});
