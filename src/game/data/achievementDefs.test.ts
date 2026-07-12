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
    runMotes: 0,
    runAffixKills: 0,
    runPods: 0,
    runAscension: 0,
    runModifierCleared: false,
    lifetimeBosses: 0,
    metaPurchases: 0,
    runsPlayed: 0,
    campaignProgress: 0,
    wardensUnlocked: 1,
    wardensTotal: 4,
    chassisUnlocked: 1,
    chassisTotal: 9,
    fullSetsOwned: 0,
    setsTotal: 6,
    maxedGearItems: 0,
    signaturesOwned: 0,
    signaturesTotal: 6,
    wardenMaxLevel: 0,
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

  it("the evolution flag drives its achievement", () => {
    expect(check("transcendent", ctx({ runEvolved: true }))).toBe(true);
  });

  it("gear achievements track set completion and maxed items", () => {
    expect(check("quartermaster", ctx({ fullSetsOwned: 0 }))).toBe(false);
    expect(check("quartermaster", ctx({ fullSetsOwned: 1 }))).toBe(true);
    expect(check("outfitter", ctx({ fullSetsOwned: 5, setsTotal: 6 }))).toBe(false);
    expect(check("outfitter", ctx({ fullSetsOwned: 6, setsTotal: 6 }))).toBe(true);
    expect(check("master-smith", ctx({ maxedGearItems: 0 }))).toBe(false);
    expect(check("master-smith", ctx({ maxedGearItems: 1 }))).toBe(true);
    expect(check("warlord", ctx({ signaturesOwned: 5, signaturesTotal: 6 }))).toBe(false);
    expect(check("warlord", ctx({ signaturesOwned: 6, signaturesTotal: 6 }))).toBe(true);
  });

  it("economy and run-event achievements track motes, affixes and pods", () => {
    expect(check("prospector", ctx({ runMotes: 49 }))).toBe(false);
    expect(check("prospector", ctx({ runMotes: 50 }))).toBe(true);
    expect(check("golden-wake", ctx({ runMotes: 150 }))).toBe(true);
    expect(check("ringbreaker", ctx({ runAffixKills: 5 }))).toBe(true);
    expect(check("salvager", ctx({ runPods: 1 }))).toBe(true);
    expect(check("pod-runner", ctx({ runPods: 2 }))).toBe(false);
    expect(check("pod-runner", ctx({ runPods: 3 }))).toBe(true);
  });

  it("campaign journey achievements track galaxy progress and modifiers", () => {
    expect(check("trailblazer", ctx({ campaignProgress: 9 }))).toBe(false);
    expect(check("trailblazer", ctx({ campaignProgress: 10 }))).toBe(true);
    expect(check("voidfarer", ctx({ campaignProgress: 40 }))).toBe(true);
    expect(check("deeplight", ctx({ campaignProgress: 90 }))).toBe(true);
    expect(check("conqueror", ctx({ campaignProgress: 999 }))).toBe(false);
    expect(check("conqueror", ctx({ campaignProgress: 1000 }))).toBe(true);
    expect(check("storm-rider", ctx({ runModifierCleared: true }))).toBe(true);
  });

  it("alt-mode and fleet achievements", () => {
    expect(check("starclimber", ctx({ runAscension: 5 }))).toBe(true);
    expect(check("bossbreaker", ctx({ runBossKills: 3 }))).toBe(true);
    expect(check("fleet-admiral", ctx({ chassisUnlocked: 9, chassisTotal: 9 }))).toBe(true);
    expect(check("fleet-admiral", ctx({ chassisUnlocked: 8, chassisTotal: 9 }))).toBe(false);
    expect(check("centennial", ctx({ runsPlayed: 100 }))).toBe(true);
    expect(check("dreadbane", ctx({ lifetimeBosses: 25 }))).toBe(true);
  });

  it("all achievements have unique ids and non-empty copy", () => {
    const ids = ACHIEVEMENT_DEFS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ACHIEVEMENT_DEFS.length).toBeGreaterThanOrEqual(35);
    for (const a of ACHIEVEMENT_DEFS) {
      expect(a.name.length).toBeGreaterThan(0);
      expect(a.description.length).toBeGreaterThan(0);
      expect(a.icon.length).toBeGreaterThan(0);
    }
  });
});
