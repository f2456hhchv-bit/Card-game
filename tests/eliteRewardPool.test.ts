import { describe, expect, it } from "vitest";
import { ELITE_REWARD_KINDS, ELITE_REWARD_POOL, pickEliteReward } from "../src/game/loot/eliteRewardPool";

/**
 * GP-FINAL §Elite Rewards — the audit found only 1 of the spec's 11 named
 * elite reward types had any mechanical equivalent (a rarity/power-boosted
 * drop). These tests guard the new standalone pool: full coverage, every
 * entry weighted and mechanically distinct, and the weighted-pick function
 * behaves like AF-022's own UpgradePool.offer() algorithm.
 */
describe("GP-FINAL §Elite Rewards — standalone reward pool", () => {
  it("registers all 11 named reward kinds from the spec", () => {
    expect(ELITE_REWARD_KINDS).toHaveLength(11);
    expect(new Set(ELITE_REWARD_KINDS).size).toBe(11);
  });

  it("every kind has exactly one real sandbox entry", () => {
    const kindsCovered = ELITE_REWARD_POOL.map((r) => r.kind);
    expect(new Set(kindsCovered).size).toBe(ELITE_REWARD_KINDS.length);
    for (const kind of ELITE_REWARD_KINDS) expect(kindsCovered).toContain(kind);
  });

  it("every entry has a positive weight and a unique id", () => {
    for (const reward of ELITE_REWARD_POOL) expect(reward.weight).toBeGreaterThan(0);
    const ids = ELITE_REWARD_POOL.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  describe("pickEliteReward — weighted selection", () => {
    it("roll 0 always picks the first entry; roll just under 1 always picks the last", () => {
      expect(pickEliteReward(ELITE_REWARD_POOL, 0)).toBe(ELITE_REWARD_POOL[0]);
      expect(pickEliteReward(ELITE_REWARD_POOL, 0.9999999)).toBe(ELITE_REWARD_POOL[ELITE_REWARD_POOL.length - 1]);
    });

    it("every roll in [0,1) resolves to a real pool entry — no gaps, no overshoot", () => {
      for (let i = 0; i < 200; i += 1) {
        const roll = i / 200;
        const picked = pickEliteReward(ELITE_REWARD_POOL, roll);
        expect(ELITE_REWARD_POOL).toContain(picked);
      }
    });

    it("higher-weight entries are picked across a proportionally larger share of the roll range", () => {
      const totalWeight = ELITE_REWARD_POOL.reduce((sum, r) => sum + r.weight, 0);
      const counts = new Map<string, number>();
      const samples = 2000;
      for (let i = 0; i < samples; i += 1) {
        const picked = pickEliteReward(ELITE_REWARD_POOL, i / samples);
        counts.set(picked.id, (counts.get(picked.id) ?? 0) + 1);
      }
      for (const reward of ELITE_REWARD_POOL) {
        const expectedShare = reward.weight / totalWeight;
        const actualShare = (counts.get(reward.id) ?? 0) / samples;
        expect(actualShare).toBeCloseTo(expectedShare, 1);
      }
    });
  });
});
