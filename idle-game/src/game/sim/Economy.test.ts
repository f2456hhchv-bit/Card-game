import { describe, it, expect } from "vitest";
import { enemyHpFor, enemyAtkFor, goldRewardFor, essenceRewardFor, damageMitigation } from "./Economy";

describe("Economy", () => {
  it("grows enemy HP monotonically with stage", () => {
    expect(enemyHpFor(2, false)).toBeGreaterThan(enemyHpFor(1, false));
    expect(enemyHpFor(50, false)).toBeGreaterThan(enemyHpFor(10, false));
  });

  it("boss stats are stronger than regular enemies at the same stage", () => {
    expect(enemyHpFor(15, true)).toBeGreaterThan(enemyHpFor(15, false));
    expect(enemyAtkFor(15, true)).toBeGreaterThan(enemyAtkFor(15, false));
    expect(goldRewardFor(15, true)).toBeGreaterThan(goldRewardFor(15, false));
    expect(essenceRewardFor(15, true)).toBeGreaterThan(essenceRewardFor(15, false));
  });

  it("stage 1 matches the configured base values", () => {
    expect(enemyHpFor(1, false)).toBeCloseTo(20, 5);
    expect(enemyAtkFor(1, false)).toBeCloseTo(3, 5);
  });

  it("defense mitigation approaches but never reaches zero damage taken", () => {
    expect(damageMitigation(0)).toBe(1);
    expect(damageMitigation(100)).toBeCloseTo(0.5, 5);
    expect(damageMitigation(1_000_000)).toBeGreaterThan(0);
    expect(damageMitigation(1_000_000)).toBeLessThan(0.01);
  });
});
