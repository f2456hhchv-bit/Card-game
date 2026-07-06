import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { CraftingSystem, type CraftedItem } from "../src/game/crafting/CraftingSystem";
import {
  DEFAULT_CRAFTING_TUNING,
  SANDBOX_RECIPES,
  STARTING_BLUEPRINTS,
} from "../src/game/crafting/craftingData";
import { RARITY_TABLE } from "../src/game/loot/lootTuning";

function makeSystem(researchUnlocked: string[] = []): CraftingSystem {
  const system = new CraftingSystem(
    SANDBOX_RECIPES,
    DEFAULT_CRAFTING_TUNING,
    (nodeId) => researchUnlocked.includes(nodeId),
  );
  for (const bp of STARTING_BLUEPRINTS) system.unlockBlueprint(bp);
  return system;
}

describe("CraftingSystem — gating (AF-025 §3)", () => {
  it("requires blueprint, research, and materials — with reasons", () => {
    const system = makeSystem();
    expect(system.canCraft("nope")).toEqual({ ok: false, reason: "unknownRecipe" });
    expect(system.canCraft("prototype-lance")).toEqual({ ok: false, reason: "blueprintUnknown" });

    system.unlockBlueprint("bp-prototype-lance");
    expect(system.canCraft("prototype-lance")).toEqual({ ok: false, reason: "researchLocked" });

    const gated = new CraftingSystem(SANDBOX_RECIPES, DEFAULT_CRAFTING_TUNING, () => true);
    gated.unlockBlueprint("bp-prototype-lance");
    expect(gated.canCraft("prototype-lance")).toEqual({ ok: false, reason: "insufficientMaterials" });
  });

  it("blueprint unlocks are permanent and idempotent", () => {
    const system = makeSystem();
    expect(system.unlockBlueprint("bp-prototype-lance")).toBe(true);
    expect(system.unlockBlueprint("bp-prototype-lance")).toBe(false);
    expect(system.knowsBlueprint("bp-prototype-lance")).toBe(true);
  });
});

describe("CraftingSystem — crafting (AF-025 §3)", () => {
  it("consumes materials and produces a deterministic AF-023-shaped item", () => {
    const craftOnce = (): CraftedItem => {
      const system = makeSystem();
      system.addMaterial("commonMaterials", 10);
      const result = system.craft("refit-cannon", 5, new Rng(42).fork("craft"));
      if (!result.ok || !result.item) throw new Error("craft failed");
      return result.item;
    };
    const a = craftOnce();
    const b = craftOnce();
    expect(a).toEqual(b); // deterministic
    expect(a.rarity).toBe("improved");
    expect(a.affixes).toHaveLength(RARITY_TABLE.improved.affixCount);
    expect(a.quality).toBeGreaterThanOrEqual(30);
    expect(a.quality).toBeLessThanOrEqual(90);
    expect(a.crafted).toBe(true);
  });

  it("spends exactly the recipe cost", () => {
    const system = makeSystem();
    system.addMaterial("commonMaterials", 7);
    system.craft("refit-cannon", 1, new Rng(1));
    expect(system.materialCount("commonMaterials")).toBe(2);
    expect(system.craft("refit-cannon", 1, new Rng(1))).toEqual({
      ok: false,
      reason: "insufficientMaterials",
    });
  });
});

describe("CraftingSystem — salvage (AF-025 §4)", () => {
  it("returns floor-guaranteed materials scaled by rarity", () => {
    const system = makeSystem();
    const common = system.salvage({
      baseItemId: "X", category: "equipment", itemLevel: 1, rarity: "common",
      affixes: [], quality: 10, special: null, seed: 1,
    });
    expect(common.commonMaterials).toBeGreaterThanOrEqual(1); // never punitive

    const ancient = system.salvage({
      baseItemId: "Y", category: "equipment", itemLevel: 1, rarity: "ancient",
      affixes: [], quality: 90, special: null, seed: 2,
    });
    expect(ancient.rareAlloys).toBeGreaterThanOrEqual(1);
    expect(ancient.ancientComponents).toBe(1);
  });

  it("anti-exploit: craft→salvage never profits (100 seeds)", () => {
    for (let seed = 1; seed <= 100; seed += 1) {
      const system = makeSystem();
      system.addMaterial("commonMaterials", 5);
      const result = system.craft("refit-cannon", 1, new Rng(seed).fork("craft"));
      expect(result.ok).toBe(true);
      if (!result.ok || !result.item) continue;
      const returned = system.salvageFromHangar(0);
      expect(returned).not.toBeNull();
      // Spent 5 common; got back strictly less.
      expect(system.materialCount("commonMaterials")).toBeLessThan(5);
    }
  });
});

describe("CraftingSystem — reforge (AF-025 §5)", () => {
  it("rerolls affixes at escalating cost, deterministically, without pity", () => {
    const system = makeSystem();
    system.addMaterial("commonMaterials", 100);
    system.addMaterial("rareAlloys", 50);
    const crafted = system.craft("refit-cannon", 5, new Rng(3).fork("craft"));
    if (!crafted.ok || !crafted.item) throw new Error("craft failed");
    const item = crafted.item;

    const before = JSON.stringify(item.affixes);
    const firstCost = system.reforgeCost(item);
    expect(system.reforge(item, new Rng(3).fork("r"))).toBe(true);
    expect(JSON.stringify(item.affixes)).not.toBe(before);
    expect(item.reforgeCount).toBe(1);

    const secondCost = system.reforgeCost(item);
    expect(secondCost.commonMaterials ?? 0).toBeGreaterThan(firstCost.commonMaterials ?? 0);
  });

  it("refuses reforge without materials", () => {
    const system = makeSystem();
    system.addMaterial("commonMaterials", 10);
    const crafted = system.craft("refit-cannon", 1, new Rng(1));
    if (!crafted.ok || !crafted.item) throw new Error("craft failed");
    expect(system.reforge(crafted.item, new Rng(1))).toBe(false); // no alloys
  });
});

describe("CraftingSystem — persistence (AF-024 slice)", () => {
  it("round-trips materials, blueprints, and hangar", () => {
    const system = makeSystem();
    system.addMaterial("commonMaterials", 20);
    system.addMaterial("voidEssence", 3);
    system.unlockBlueprint("bp-prototype-lance");
    system.craft("refit-cannon", 2, new Rng(9).fork("craft"));

    const restored = makeSystem();
    restored.loadSave(system.toSave());
    expect(restored.materialCount("commonMaterials")).toBe(15); // 20 - 5 crafted
    expect(restored.materialCount("voidEssence")).toBe(3);
    expect(restored.knowsBlueprint("bp-prototype-lance")).toBe(true);
    expect(restored.hangarItems).toHaveLength(1);
    expect(restored.hangarItems[0]?.baseItemId).toBe("REFIT_CANNON");
  });
});
