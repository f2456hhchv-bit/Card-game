/**
 * GP-FINAL §Elite Rewards: "Elite enemies never simply drop gold." The
 * existing rarity/power-boosted drop (eliteRewards.ts, GP-001) stays the
 * guaranteed baseline every Elite kill already honours — this is the
 * spec's own eleven-entry POOL: one extra, weighted-random, kind-based
 * reward per Elite kill, additive on top. Dispatched through a single
 * generic interpreter (applyEliteReward, main.ts) reusing real mechanisms
 * already proven elsewhere in this codebase — no new mechanic invented
 * where one already exists.
 */
export const ELITE_REWARD_KINDS = [
  "largeXpCrystal",
  "xpMagnet",
  "screenClear",
  "screenStun",
  "rareCache",
  "epicUpgrade",
  "legendaryChance",
  "temporaryAlly",
  "repairDrone",
  "atlasFragment",
  "ultraRareEventTrigger",
] as const;

export type EliteRewardKind = (typeof ELITE_REWARD_KINDS)[number];

export interface EliteRewardDef {
  id: string;
  name: string;
  description: string;
  kind: EliteRewardKind;
  /** Relative offer weight — the same weighted-pick shape AF-022's UpgradePool already uses. */
  weight: number;
  /** Meaning depends on kind — see applyEliteReward's interpreter (main.ts). */
  value: number;
}

export const ELITE_REWARD_POOL: readonly EliteRewardDef[] = [
  { id: "elite-reward-xp-crystal", name: "Large XP Crystal", description: "A single, oversized XP pickup.", kind: "largeXpCrystal", weight: 14, value: 60 },
  { id: "elite-reward-xp-magnet", name: "XP Magnet", description: "Every XP gem on the field flies to you at once.", kind: "xpMagnet", weight: 10, value: 0 },
  { id: "elite-reward-screen-clear", name: "Screen Clear", description: "A shockwave scours every enemy nearby.", kind: "screenClear", weight: 6, value: 60 },
  { id: "elite-reward-screen-stun", name: "Screen Stun", description: "Every enemy nearby locks up.", kind: "screenStun", weight: 8, value: 2500 },
  { id: "elite-reward-rare-cache", name: "Rare Cache", description: "A guaranteed Epic-or-better cache.", kind: "rareCache", weight: 14, value: 0 },
  { id: "elite-reward-epic-upgrade", name: "Epic Upgrade", description: "An extra build choice, applied instantly.", kind: "epicUpgrade", weight: 12, value: 0 },
  { id: "elite-reward-legendary-chance", name: "Legendary Chance", description: "A real shot at a Legendary drop.", kind: "legendaryChance", weight: 8, value: 0.35 },
  { id: "elite-reward-temporary-ally", name: "Temporary Ally", description: "An escort strike hits nearby enemies for a few seconds.", kind: "temporaryAlly", weight: 8, value: 18 },
  { id: "elite-reward-repair-drone", name: "Repair Drone", description: "A field repair, ticking hull back for a few seconds.", kind: "repairDrone", weight: 10, value: 6 },
  { id: "elite-reward-atlas-fragment", name: "Atlas Fragment", description: "A fragment of the Atlas, recovered intact.", kind: "atlasFragment", weight: 6, value: 3 },
  { id: "elite-reward-ultra-rare-event", name: "Ultra Rare Event Trigger", description: "Something the galaxy rarely allows fires immediately.", kind: "ultraRareEventTrigger", weight: 4, value: 0 },
];

/** Weighted pick — the exact algorithm AF-022's UpgradePool.offer() already uses, over a fixed 0..1 roll instead of a live Rng, so it stays a pure function. */
export function pickEliteReward(pool: readonly EliteRewardDef[], roll: number): EliteRewardDef {
  const totalWeight = pool.reduce((sum, reward) => sum + reward.weight, 0);
  let remaining = roll * totalWeight;
  for (const reward of pool) {
    remaining -= reward.weight;
    if (remaining <= 0) return reward;
  }
  return pool[pool.length - 1]!;
}
