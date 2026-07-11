/**
 * GP-001: enforces the Elite Reward Package (AF-034 EliteGenerator's own
 * `rewardMultiplier`/`rarityFloor` fields) that a killed Elite's loot drop
 * must honour. AF-023's generateDrop() never knows an Elite dropped it —
 * this is a pure post-processing composition layer over its output, never a
 * change to LootGenerator.ts's own rarity-roll or affix-roll algorithms.
 */
import { RARITY_LADDER, type Rarity } from "./lootTuning";
import type { LootDrop } from "./LootGenerator";

/** Raises `drop.rarity` to at least `rarityFloor` (never lowers it) and scales
 * every rolled affix value by `rewardMultiplier` (never below 1×) — the
 * Elite's reward package, guaranteed regardless of what generateDrop rolled. */
export function applyEliteRewardPackage(drop: LootDrop, rarityFloor: Rarity, rewardMultiplier: number): LootDrop {
  const currentIndex = RARITY_LADDER.indexOf(drop.rarity);
  const floorIndex = RARITY_LADDER.indexOf(rarityFloor);
  const rarity = floorIndex > currentIndex ? rarityFloor : drop.rarity;
  const scale = Math.max(1, rewardMultiplier);
  const affixes = drop.affixes.map((affix) => ({ ...affix, value: affix.value * scale }));
  return { ...drop, rarity, affixes };
}
