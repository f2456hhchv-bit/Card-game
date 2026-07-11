import { describe, expect, it } from "vitest";
import { SANDBOX_WAVE_REWARDS, WAVE_REWARD_CATEGORIES, pickWaveReward } from "../src/game/progression/waveRewards";

/**
 * GP-FINAL §Wave Rewards — the audit found no per-wave reward system
 * existed at all, distinct from level-ups. These tests guard the new
 * standalone roster: full category coverage, every entry weighted, and
 * the weighted-pick function behaves correctly across the whole roll range.
 */
describe("GP-FINAL §Wave Rewards — standalone per-wave reward roster", () => {
  it("registers all 8 named categories from the spec", () => {
    expect(WAVE_REWARD_CATEGORIES).toHaveLength(8);
    expect(new Set(WAVE_REWARD_CATEGORIES).size).toBe(8);
  });

  it("every category has exactly one real sandbox entry", () => {
    const categories = SANDBOX_WAVE_REWARDS.map((r) => r.category);
    expect(new Set(categories).size).toBe(WAVE_REWARD_CATEGORIES.length);
    for (const category of WAVE_REWARD_CATEGORIES) expect(categories).toContain(category);
  });

  it("every entry has a positive weight and a unique id", () => {
    for (const reward of SANDBOX_WAVE_REWARDS) expect(reward.weight).toBeGreaterThan(0);
    const ids = SANDBOX_WAVE_REWARDS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("pickWaveReward resolves every roll in [0,1) to a real pool entry", () => {
    for (let i = 0; i < 200; i += 1) {
      const picked = pickWaveReward(SANDBOX_WAVE_REWARDS, i / 200);
      expect(SANDBOX_WAVE_REWARDS).toContain(picked);
    }
  });
});
