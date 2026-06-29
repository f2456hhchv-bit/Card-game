import { describe, it, expect } from "vitest";
import { ACHIEVEMENT_DEFS, type AchievementContext } from "./achievementDefs";

function ctx(over: Partial<AchievementContext> = {}): AchievementContext {
  return {
    runTime: 0,
    runKills: 0,
    runEliteKills: 0,
    runBossKills: 0,
    runLevel: 1,
    runEvolved: false,
    runDaily: false,
    lifetimeBosses: 0,
    metaPurchases: 0,
    wardensUnlocked: 1,
    wardensTotal: 4,
    ...over,
  };
}

function check(id: string, c: AchievementContext): boolean {
  return ACHIEVEMENT_DEFS.find((a) => a.id === id)!.check(c);
}

describe("achievementDefs", () => {
  it("First Light triggers on the first kill", () => {
    expect(check("first-light", ctx({ runKills: 0 }))).toBe(false);
    expect(check("first-light", ctx({ runKills: 1 }))).toBe(true);
  });

  it("time-based achievements use run time thresholds", () => {
    expect(check("keeper", ctx({ runTime: 299 }))).toBe(false);
    expect(check("keeper", ctx({ runTime: 300 }))).toBe(true);
    expect(check("lightwarden", ctx({ runTime: 600 }))).toBe(true);
  });

  it("boss achievements use run + lifetime counts", () => {
    expect(check("boss-slayer", ctx({ runBossKills: 1 }))).toBe(true);
    expect(check("hollowbane", ctx({ lifetimeBosses: 4 }))).toBe(false);
    expect(check("hollowbane", ctx({ lifetimeBosses: 5 }))).toBe(true);
  });

  it("collector requires unlocking every Warden", () => {
    expect(check("collector", ctx({ wardensUnlocked: 3, wardensTotal: 4 }))).toBe(false);
    expect(check("collector", ctx({ wardensUnlocked: 4, wardensTotal: 4 }))).toBe(true);
  });

  it("evolution and daily flags drive their achievements", () => {
    expect(check("transcendent", ctx({ runEvolved: true }))).toBe(true);
    expect(check("devotee", ctx({ runDaily: true }))).toBe(true);
  });

  it("all achievements have unique ids", () => {
    const ids = ACHIEVEMENT_DEFS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
