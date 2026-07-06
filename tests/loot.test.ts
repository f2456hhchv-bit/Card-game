import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import {
  generateDrop,
  rollRarity,
  type DropContext,
  type DropTableEntry,
} from "../src/game/loot/LootGenerator";
import { GroundLoot } from "../src/game/loot/GroundLoot";
import {
  DEFAULT_LOOT_TUNING,
  RARITY_LADDER,
  RARITY_TABLE,
  type Rarity,
} from "../src/game/loot/lootTuning";

const baseContext: DropContext = {
  itemLevel: 10,
  difficulty: 1,
  ascension: 0,
  mutatorBonus: 0,
  researchBonus: 0,
};

const table: DropTableEntry[] = [
  { baseItemId: "TEST_CANNON", category: "weapon", weight: 10 },
  { baseItemId: "TEST_PLATING", category: "equipment", weight: 10 },
  { baseItemId: "TEST_RELIC", category: "relic", weight: 4 },
  { baseItemId: "TEST_ALLOY", category: "craftingMaterial", weight: 8 },
];

describe("LootGenerator — 500k-drop distribution (AF-023 self-review at scale)", () => {
  const counts = new Map<Rarity, number>();
  const rng = new Rng(2026).fork("loot");
  const total = 500_000;
  for (let i = 0; i < total; i += 1) {
    const rarity = rollRarity(baseContext, DEFAULT_LOOT_TUNING, rng);
    counts.set(rarity, (counts.get(rarity) ?? 0) + 1);
  }

  it("frequency decreases monotonically up the ladder (common is the bulk)", () => {
    // From common upward, each tier is rarer than the one below.
    for (let i = 2; i < RARITY_LADDER.length; i += 1) {
      const below = counts.get(RARITY_LADDER[i - 1] as Rarity) ?? 0;
      const tier = counts.get(RARITY_LADDER[i] as Rarity) ?? 0;
      expect(tier).toBeLessThan(below);
    }
  });

  it("top tiers stay lottery-rare but reachable", () => {
    const singularity = counts.get("singularity") ?? 0;
    const mythic = counts.get("mythic") ?? 0;
    expect(singularity).toBeGreaterThan(0); // always possible
    expect(singularity / total).toBeLessThan(0.001); // memorably rare
    expect(mythic).toBeGreaterThan(singularity);
  });

  it("matches configured weights within tolerance", () => {
    const totalWeight = RARITY_LADDER.reduce((sum, r) => sum + RARITY_TABLE[r].weight, 0);
    const expectedCommon = RARITY_TABLE.common.weight / totalWeight;
    const observedCommon = (counts.get("common") ?? 0) / total;
    expect(Math.abs(observedCommon - expectedCommon)).toBeLessThan(0.01);
  });
});

describe("LootGenerator — context shifts (AF-023 §3)", () => {
  const rareOrBetterShare = (context: DropContext, seed: number): number => {
    const rng = new Rng(seed).fork("loot");
    let rareUp = 0;
    const samples = 40_000;
    for (let i = 0; i < samples; i += 1) {
      const rarity = rollRarity(context, DEFAULT_LOOT_TUNING, rng);
      if (RARITY_LADDER.indexOf(rarity) >= RARITY_LADDER.indexOf("rare")) rareUp += 1;
    }
    return rareUp / samples;
  };

  it("difficulty and ascension shift weight up the ladder without erasing commons", () => {
    const base = rareOrBetterShare(baseContext, 7);
    const hard = rareOrBetterShare({ ...baseContext, difficulty: 4, ascension: 3 }, 7);
    expect(hard).toBeGreaterThan(base * 1.4);

    const rng = new Rng(7).fork("loot");
    let commons = 0;
    for (let i = 0; i < 20_000; i += 1) {
      if (rollRarity({ ...baseContext, difficulty: 4, ascension: 3 }, DEFAULT_LOOT_TUNING, rng) === "common") commons += 1;
    }
    expect(commons).toBeGreaterThan(0); // commons never vanish
  });
});

describe("LootGenerator — full drops (AF-023 §3)", () => {
  it("is deterministic: same stream, same drops", () => {
    const play = (): string => {
      const rng = new Rng(99).fork("loot");
      return JSON.stringify(
        Array.from({ length: 20 }, () => generateDrop(table, baseContext, DEFAULT_LOOT_TUNING, rng)),
      );
    };
    expect(play()).toBe(play());
  });

  it("affix count matches rarity exactly; quality within bounds", () => {
    const rng = new Rng(5).fork("loot");
    for (let i = 0; i < 5000; i += 1) {
      const drop = generateDrop(table, baseContext, DEFAULT_LOOT_TUNING, rng);
      expect(drop.affixes).toHaveLength(Math.min(RARITY_TABLE[drop.rarity].affixCount, 6));
      expect(new Set(drop.affixes.map((a) => a.id)).size).toBe(drop.affixes.length); // distinct
      expect(drop.quality).toBeGreaterThanOrEqual(0);
      expect(drop.quality).toBeLessThanOrEqual(100);
      expect(drop.seed).toBeGreaterThanOrEqual(0);
    }
  });

  it("smart loot biases categories within the clamp, never guarantees", () => {
    const smartContext: DropContext = {
      ...baseContext,
      smartLoot: { categoryWeights: { weapon: 100, relic: 0.001 } }, // absurd requests
    };
    const rng = new Rng(31).fork("loot");
    let weapons = 0;
    let relics = 0;
    const samples = 20_000;
    for (let i = 0; i < samples; i += 1) {
      const drop = generateDrop(table, smartContext, DEFAULT_LOOT_TUNING, rng);
      if (drop.category === "weapon") weapons += 1;
      if (drop.category === "relic") relics += 1;
    }
    expect(weapons / samples).toBeGreaterThan(0.4); // biased up (clamped ×3)
    expect(relics).toBeGreaterThan(0); // never zero — clamp floor ×0.5
  });
});

describe("GroundLoot — value-preserving cap (AF-023 §6)", () => {
  const makeDrop = (rarity: Rarity): ReturnType<typeof generateDrop> => ({
    baseItemId: "X",
    category: "resource",
    itemLevel: 1,
    rarity,
    affixes: [],
    quality: 50,
    special: null,
    seed: 1,
  });

  it("collects by proximity", () => {
    const collected: string[] = [];
    const ground = new GroundLoot(DEFAULT_LOOT_TUNING, (d) => collected.push(d.rarity), () => undefined);
    ground.place(makeDrop("rare"), 1, 0);
    ground.update(0, 0, 1.5);
    expect(collected).toEqual(["rare"]);
    expect(ground.live).toHaveLength(0);
  });

  it("banks the oldest lowest rarity beyond the cap — value never deleted", () => {
    const banked: Rarity[] = [];
    const ground = new GroundLoot(DEFAULT_LOOT_TUNING, () => undefined, (d) => banked.push(d.rarity));
    for (let i = 0; i < DEFAULT_LOOT_TUNING.maxGroundLoot; i += 1) {
      ground.place(makeDrop(i % 2 === 0 ? "common" : "rare"), i, 100);
    }
    ground.place(makeDrop("epic"), 999, 100); // overflow
    expect(banked).toEqual(["common"]);
    expect(ground.live.length).toBe(DEFAULT_LOOT_TUNING.maxGroundLoot);
  });

  it("Legendary and above never bank — the cap yields to the moment", () => {
    const banked: Rarity[] = [];
    const ground = new GroundLoot(DEFAULT_LOOT_TUNING, () => undefined, (d) => banked.push(d.rarity));
    for (let i = 0; i < DEFAULT_LOOT_TUNING.maxGroundLoot + 10; i += 1) {
      ground.place(makeDrop("legendary"), i, 100);
    }
    expect(banked).toHaveLength(0);
    expect(ground.live.length).toBe(DEFAULT_LOOT_TUNING.maxGroundLoot + 10);
  });
});
