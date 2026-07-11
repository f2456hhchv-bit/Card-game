import { describe, expect, it } from "vitest";
import { applyEliteRewardPackage } from "../src/game/loot/eliteRewards";
import type { LootDrop } from "../src/game/loot/LootGenerator";

const baseDrop: LootDrop = {
  baseItemId: "item-a",
  category: "weapon",
  itemLevel: 5,
  rarity: "common",
  affixes: [{ id: "affix-a", value: 10 }],
  quality: 50,
  special: null,
  seed: 1,
};

describe("GP-001 — Guaranteed Elite Rewards", () => {
  it("raises rarity to the floor when the roll landed below it", () => {
    const upgraded = applyEliteRewardPackage(baseDrop, "epic", 1);
    expect(upgraded.rarity).toBe("epic");
  });

  it("never lowers rarity when the roll already exceeded the floor", () => {
    const alreadyHigh: LootDrop = { ...baseDrop, rarity: "legendary" };
    const result = applyEliteRewardPackage(alreadyHigh, "rare", 1);
    expect(result.rarity).toBe("legendary");
  });

  it("scales every affix value by the reward multiplier", () => {
    const boosted = applyEliteRewardPackage(baseDrop, "common", 2.5);
    expect(boosted.affixes[0]!.value).toBeCloseTo(25);
  });

  it("never scales affixes below 1x even if given a sub-1 multiplier", () => {
    const result = applyEliteRewardPackage(baseDrop, "common", 0.2);
    expect(result.affixes[0]!.value).toBeCloseTo(10);
  });

  it("does not mutate the original drop", () => {
    const original = { ...baseDrop, affixes: [{ ...baseDrop.affixes[0]! }] };
    applyEliteRewardPackage(original, "legendary", 3);
    expect(original.rarity).toBe("common");
    expect(original.affixes[0]!.value).toBe(10);
  });
});
