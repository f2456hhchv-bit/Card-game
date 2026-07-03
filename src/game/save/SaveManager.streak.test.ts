import { describe, it, expect } from "vitest";
import { SaveManager } from "./SaveManager";

const at = (iso: string): Date => new Date(`${iso}T12:00:00`);

describe("SaveManager — daily cache streak", () => {
  it("starts claimable at streak 1 for a fresh profile", () => {
    const sm = new SaveManager();
    const s = sm.dailyCacheStatus(at("2026-07-03"));
    expect(s.available).toBe(true);
    expect(s.streak).toBe(1);
    expect(s.reward.motes).toBeGreaterThan(0);
  });

  it("claims once per day and blocks a second same-day claim", () => {
    const sm = new SaveManager();
    const r = sm.claimDailyCache(at("2026-07-03"));
    expect(r?.streak).toBe(1);
    expect(sm.data.motes).toBe(r!.motes);
    // A second claim the same day is refused.
    expect(sm.claimDailyCache(at("2026-07-03"))).toBeNull();
    expect(sm.dailyCacheStatus(at("2026-07-03")).available).toBe(false);
  });

  it("advances the streak on consecutive days", () => {
    const sm = new SaveManager();
    expect(sm.claimDailyCache(at("2026-07-03"))?.streak).toBe(1);
    expect(sm.claimDailyCache(at("2026-07-04"))?.streak).toBe(2);
    expect(sm.claimDailyCache(at("2026-07-05"))?.streak).toBe(3);
    expect(sm.data.streak.count).toBe(3);
  });

  it("resets the streak to 1 after a missed day", () => {
    const sm = new SaveManager();
    sm.claimDailyCache(at("2026-07-03"));
    sm.claimDailyCache(at("2026-07-04"));
    // Skip the 5th — claim on the 6th.
    expect(sm.claimDailyCache(at("2026-07-06"))?.streak).toBe(1);
  });

  it("scales the reward with the streak and drops gear every fifth day", () => {
    expect(SaveManager.dailyCacheReward(1).gear).toBe(false);
    expect(SaveManager.dailyCacheReward(5).gear).toBe(true);
    expect(SaveManager.dailyCacheReward(10).gear).toBe(true);
    expect(SaveManager.dailyCacheReward(5).motes).toBeGreaterThan(
      SaveManager.dailyCacheReward(1).motes,
    );
    expect(SaveManager.dailyCacheReward(1).alloy).toBe(0);
    expect(SaveManager.dailyCacheReward(3).alloy).toBeGreaterThan(0);
  });

  it("crosses a month boundary as a continuous streak", () => {
    const sm = new SaveManager();
    expect(sm.claimDailyCache(at("2026-07-31"))?.streak).toBe(1);
    expect(sm.claimDailyCache(at("2026-08-01"))?.streak).toBe(2);
  });
});
