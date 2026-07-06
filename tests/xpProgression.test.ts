import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { XpSystem } from "../src/game/progression/XpSystem";
import { XpPickups } from "../src/game/progression/XpPickups";
import { UpgradePool } from "../src/game/progression/UpgradePool";
import {
  DEFAULT_XP_TUNING,
  type UpgradeDefinition,
} from "../src/game/progression/xpTuning";

const STEP = 1000 / 60;

describe("XpSystem — level curve (AF-022 §3)", () => {
  it("thresholds rise monotonically: early fast, late slower", () => {
    const system = new XpSystem(DEFAULT_XP_TUNING);
    for (let level = 1; level < 60; level += 1) {
      expect(system.thresholdFor(level + 1)).toBeGreaterThan(system.thresholdFor(level));
    }
  });

  it("anti-grind guarantee: growth ratio never exceeds the cap", () => {
    const system = new XpSystem(DEFAULT_XP_TUNING);
    for (let level = 2; level < 100; level += 1) {
      const ratio = system.thresholdFor(level) / system.thresholdFor(level - 1);
      expect(ratio).toBeLessThanOrEqual(DEFAULT_XP_TUNING.maxThresholdGrowthRatio + 1e-9);
    }
  });

  it("levels up at thresholds and queues multi-level grants", () => {
    const levels: number[] = [];
    const system = new XpSystem(DEFAULT_XP_TUNING, null, (level) => levels.push(level));
    const bigGrant =
      system.thresholdFor(1) + system.thresholdFor(2) + system.thresholdFor(3) + 1e-6;
    system.addXp(bigGrant); // one boss-sized grant = three levels
    expect(levels).toEqual([2, 3, 4]);
    expect(system.snapshot.pendingLevels).toBe(3);
    expect(system.consumePendingLevel()).toBe(true);
    expect(system.snapshot.pendingLevels).toBe(2);
  });

  it("respects a mission level cap; null cap scales endlessly", () => {
    const capped = new XpSystem(DEFAULT_XP_TUNING, 3);
    capped.addXp(100_000);
    expect(capped.snapshot.level).toBe(3);

    const endless = new XpSystem(DEFAULT_XP_TUNING, null);
    endless.addXp(100_000);
    expect(endless.snapshot.level).toBeGreaterThan(20);
  });
});

describe("XpPickups (AF-022 §2)", () => {
  const radii = { pickupRadius: 1.1, magnetRadius: 4 };

  it("collects on contact and reports value + tier", () => {
    const collected: Array<[number, string]> = [];
    const pickups = new XpPickups(DEFAULT_XP_TUNING, (value, tier) => collected.push([value, tier]));
    pickups.spawn("elite", 0.5, 0);
    pickups.update(STEP, 0, 0, radii);
    expect(collected).toEqual([[15, "elite"]]);
    expect(pickups.live).toHaveLength(0);
  });

  it("magnet accelerates gems inside the radius until collected", () => {
    const collected: number[] = [];
    const pickups = new XpPickups(DEFAULT_XP_TUNING, (value) => collected.push(value));
    pickups.spawn("small", 3.5, 0); // inside magnet, outside pickup radius
    for (let i = 0; i < 60 && collected.length === 0; i += 1) pickups.update(STEP, 0, 0, radii);
    expect(collected).toEqual([1]); // vacuumed in within a second
  });

  it("gems outside the magnet radius stay put", () => {
    const pickups = new XpPickups(DEFAULT_XP_TUNING, () => undefined);
    pickups.spawn("small", 10, 0);
    for (let i = 0; i < 60; i += 1) pickups.update(STEP, 0, 0, radii);
    expect(pickups.live[0]?.x).toBe(10);
  });

  it("coalesces beyond the density cap — value is never lost", () => {
    const pickups = new XpPickups(DEFAULT_XP_TUNING, () => undefined);
    const cap = DEFAULT_XP_TUNING.maxLivePickups;
    for (let i = 0; i < cap + 50; i += 1) pickups.spawn("small", 100 + i, 100);
    expect(pickups.live.length).toBeLessThanOrEqual(cap);
    const totalValue = pickups.live.reduce((sum, p) => sum + p.value, 0);
    expect(totalValue).toBe((cap + 50) * DEFAULT_XP_TUNING.tierValues.small);
  });
});

describe("UpgradePool (AF-022 §5)", () => {
  const definitions: UpgradeDefinition[] = [
    { id: "damage", category: "weaponUpgrade", name: "D", description: "", weight: 10, maxStacks: 5 },
    { id: "firerate", category: "weaponUpgrade", name: "F", description: "", weight: 10, maxStacks: 5 },
    { id: "crit", category: "critical", name: "C", description: "", weight: 5, maxStacks: 3 },
    { id: "speed", category: "movement", name: "S", description: "", weight: 5, maxStacks: null },
    { id: "barrier", category: "shield", name: "B", description: "", weight: 3, maxStacks: null },
    { id: "rare", category: "specialEvent", name: "R", description: "", weight: 1, maxStacks: 1 },
  ];

  it("offers distinct choices", () => {
    const pool = new UpgradePool(definitions, new Rng(1).fork("upgrades"));
    const offer = pool.offer(3);
    expect(offer.choices).toHaveLength(3);
    expect(new Set(offer.choices.map((c) => c.id)).size).toBe(3);
  });

  it("is deterministic per seed", () => {
    const ids = (seed: number): string =>
      new UpgradePool(definitions, new Rng(seed).fork("upgrades")).offer(3).choices.map((c) => c.id).join(",");
    expect(ids(7)).toBe(ids(7));
    expect(ids(7)).not.toBe(ids(8));
  });

  it("excludes maxed upgrades", () => {
    const pool = new UpgradePool(definitions, new Rng(1).fork("upgrades"));
    pool.recordTaken("rare"); // maxStacks 1 → gone forever
    for (let i = 0; i < 50; i += 1) {
      expect(pool.offer(3).choices.some((c) => c.id === "rare")).toBe(false);
    }
  });

  it("respects weights statistically", () => {
    const pool = new UpgradePool(definitions, new Rng(99).fork("upgrades"));
    let damageCount = 0;
    let rareCount = 0;
    for (let i = 0; i < 2000; i += 1) {
      const offer = pool.offer(1);
      if (offer.choices[0]?.id === "damage") damageCount += 1;
      if (offer.choices[0]?.id === "rare") rareCount += 1;
    }
    expect(damageCount).toBeGreaterThan(rareCount * 4); // weight 10 vs 1
  });

  it("locked choices reappear in the next offer", () => {
    const pool = new UpgradePool(definitions, new Rng(1).fork("upgrades"));
    const locked = definitions[4] as UpgradeDefinition; // barrier
    pool.lockChoice(locked);
    expect(pool.offer(3).choices[0]?.id).toBe("barrier");
  });

  it("shrinks the offer gracefully when the pool runs dry", () => {
    const tiny: UpgradeDefinition[] = [
      { id: "only", category: "passive", name: "O", description: "", weight: 1, maxStacks: 1 },
    ];
    const pool = new UpgradePool(tiny, new Rng(1));
    expect(pool.offer(3).choices).toHaveLength(1);
    pool.recordTaken("only");
    expect(pool.offer(3).choices).toHaveLength(0);
  });
});
