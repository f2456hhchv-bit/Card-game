import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { Inventory, powerRating } from "../src/game/inventory/Inventory";
import { DEFAULT_INVENTORY_TUNING } from "../src/game/inventory/inventoryData";
import { generateDrop, type DropTableEntry, type LootDrop } from "../src/game/loot/LootGenerator";
import { DEFAULT_LOOT_TUNING, type Rarity } from "../src/game/loot/lootTuning";

const makeDrop = (overrides: Partial<LootDrop> = {}): LootDrop => ({
  baseItemId: "TEST_ITEM",
  category: "equipment",
  itemLevel: 5,
  rarity: "rare",
  affixes: [{ id: "power", value: 5 }],
  quality: 50,
  special: null,
  seed: 1,
  ...overrides,
});

describe("Inventory — stacking (AF-027)", () => {
  it("stacks stackable categories by item+rarity; instances stay unique", () => {
    const inventory = new Inventory(DEFAULT_INVENTORY_TUNING);
    inventory.add(makeDrop({ category: "craftingMaterial", baseItemId: "ALLOY" }), 1);
    inventory.add(makeDrop({ category: "craftingMaterial", baseItemId: "ALLOY" }), 2);
    inventory.add(makeDrop({ category: "equipment" }), 3);
    inventory.add(makeDrop({ category: "equipment" }), 4);
    expect(inventory.size).toBe(3); // one stack of 2 + two instances
    const stack = inventory.filter({ category: "craftingMaterial" })[0];
    expect(stack?.stackCount).toBe(2);
  });

  it("respects the stack limit by opening a new stack", () => {
    const inventory = new Inventory({ ...DEFAULT_INVENTORY_TUNING, stackLimit: 2 });
    for (let i = 0; i < 5; i += 1) {
      inventory.add(makeDrop({ category: "resource", baseItemId: "ORE" }), i);
    }
    const stacks = inventory.filter({ category: "resource" });
    expect(stacks.map((s) => s.stackCount).sort()).toEqual([1, 2, 2]);
  });
});

describe("Inventory — protection (AF-027 / AF-003 §8)", () => {
  it("locked items cannot salvage; favourites require confirmation", () => {
    const inventory = new Inventory(DEFAULT_INVENTORY_TUNING);
    const item = inventory.add(makeDrop(), 1);
    expect(inventory.salvageGuard(item.instanceId)).toEqual({ allowed: true, requiresConfirmation: false, reason: null });

    inventory.setFavourite(item.instanceId, true);
    expect(inventory.salvageGuard(item.instanceId)).toEqual({ allowed: true, requiresConfirmation: true, reason: "favourite" });

    inventory.setLocked(item.instanceId, true);
    expect(inventory.salvageGuard(item.instanceId)).toEqual({ allowed: false, requiresConfirmation: false, reason: "locked" });
  });

  it("batch salvage excludes protected items by construction", () => {
    const inventory = new Inventory(DEFAULT_INVENTORY_TUNING);
    const keep = inventory.add(makeDrop({ baseItemId: "KEEP" }), 1);
    const favourite = inventory.add(makeDrop({ baseItemId: "FAV" }), 2);
    inventory.add(makeDrop({ baseItemId: "TRASH" }), 3);
    inventory.setLocked(keep.instanceId, true);
    inventory.setFavourite(favourite.instanceId, true);

    const candidates = inventory.batchSalvageCandidates({ category: "equipment" });
    expect(candidates.map((c) => c.drop.baseItemId)).toEqual(["TRASH"]);
  });
});

describe("Inventory — sorting, filtering, search (AF-027)", () => {
  it("sorts by rarity, power, and recency correctly", () => {
    const inventory = new Inventory(DEFAULT_INVENTORY_TUNING);
    inventory.add(makeDrop({ baseItemId: "COMMON", rarity: "common", affixes: [] }), 1);
    inventory.add(makeDrop({ baseItemId: "MYTHIC", rarity: "mythic" }), 2);
    inventory.add(makeDrop({ baseItemId: "EPIC", rarity: "epic" }), 3);

    expect(inventory.sorted("rarity").map((i) => i.drop.baseItemId)).toEqual(["MYTHIC", "EPIC", "COMMON"]);
    expect(inventory.sorted("newest")[0]?.drop.baseItemId).toBe("EPIC");
    expect(powerRating(makeDrop({ rarity: "mythic" }))).toBeGreaterThan(powerRating(makeDrop({ rarity: "common" })));
  });

  it("combines filters and searches partial matches", () => {
    const inventory = new Inventory(DEFAULT_INVENTORY_TUNING);
    inventory.add(makeDrop({ baseItemId: "PLASMA_LANCE", category: "weapon", rarity: "epic" }), 1);
    inventory.add(makeDrop({ baseItemId: "PLASMA_COIL", category: "equipment", rarity: "epic" }), 2);
    inventory.add(makeDrop({ baseItemId: "HULL_PLATE", category: "equipment", rarity: "rare" }), 3);

    expect(inventory.filter({ category: "equipment", rarity: "epic" })).toHaveLength(1);
    expect(inventory.search("plasma")).toHaveLength(2);
    expect(inventory.search("power")).toHaveLength(3); // affix match
    expect(inventory.search("")).toHaveLength(0);
  });
});

describe("Inventory — storage limits & loadouts (AF-027)", () => {
  it("refuses moves into full storage with the reason", () => {
    const inventory = new Inventory({
      ...DEFAULT_INVENTORY_TUNING,
      storageLimits: { ...DEFAULT_INVENTORY_TUNING.storageLimits, craftingQueue: 1 },
    });
    const a = inventory.add(makeDrop({ baseItemId: "A" }), 1);
    const b = inventory.add(makeDrop({ baseItemId: "B" }), 2);
    expect(inventory.move(a.instanceId, "craftingQueue")).toEqual({ ok: true });
    expect(inventory.move(b.instanceId, "craftingQueue")).toEqual({ ok: false, reason: "storageFull" });
  });

  it("saves, renames, and duplicates loadouts within the cap", () => {
    const inventory = new Inventory({ ...DEFAULT_INVENTORY_TUNING, maxLoadouts: 2 });
    expect(inventory.saveLoadout({ name: "Alpha", favourite: false, commanderId: null, shipId: null, slots: {} })).toBe(true);
    expect(inventory.duplicateLoadout("Alpha", "Beta")).toBe(true);
    expect(inventory.saveLoadout({ name: "Gamma", favourite: false, commanderId: null, shipId: null, slots: {} })).toBe(false); // cap
    expect(inventory.renameLoadout("Beta", "Alpha")).toBe(false); // name collision
    expect(inventory.renameLoadout("Beta", "Delta")).toBe(true);
  });
});

describe("Inventory — persistence & 20k scale (AF-027 self-review)", () => {
  it("round-trips through save data", () => {
    const inventory = new Inventory(DEFAULT_INVENTORY_TUNING);
    const item = inventory.add(makeDrop(), 42);
    inventory.setFavourite(item.instanceId, true);
    inventory.saveLoadout({ name: "Main", favourite: true, commanderId: "c1", shipId: "s1", slots: { primaryWeapon: item.instanceId } });

    const restored = new Inventory(DEFAULT_INVENTORY_TUNING);
    restored.loadSave(inventory.toSave());
    expect(restored.size).toBe(1);
    expect(restored.get(item.instanceId)?.favourite).toBe(true);
    expect(restored.getLoadout("Main")?.slots["primaryWeapon"]).toBe(item.instanceId);
  });

  it("handles 20,000 items with fast sort/filter/search and a valid cache", () => {
    const inventory = new Inventory({
      ...DEFAULT_INVENTORY_TUNING,
      storageLimits: { player: null, galaxyStorage: null, archive: null, craftingQueue: null },
    });
    const table: DropTableEntry[] = [
      { baseItemId: "GEN_WEAPON", category: "weapon", weight: 5 },
      { baseItemId: "GEN_EQUIP", category: "equipment", weight: 5 },
      { baseItemId: "GEN_MAT", category: "craftingMaterial", weight: 5 },
    ];
    const rng = new Rng(7).fork("loot");
    for (let i = 0; i < 20_000; i += 1) {
      const drop = generateDrop(
        table,
        { itemLevel: 1 + (i % 60), difficulty: 1, ascension: 0, mutatorBonus: 0, researchBonus: 0 },
        DEFAULT_LOOT_TUNING,
        rng,
      );
      inventory.add(drop, i);
    }
    expect(inventory.size).toBeGreaterThan(10_000); // materials stacked, instances kept

    const sortStart = performance.now();
    const sorted = inventory.sorted("power");
    const sortMs = performance.now() - sortStart;
    expect(sorted.length).toBe(inventory.size);
    expect(sortMs).toBeLessThan(250);

    const cachedStart = performance.now();
    inventory.sorted("power"); // cache hit
    expect(performance.now() - cachedStart).toBeLessThan(5);

    const searchStart = performance.now();
    const hits = inventory.search("gen_w");
    expect(hits.length).toBeGreaterThan(0);
    expect(performance.now() - searchStart).toBeLessThan(100);

    const rarities = new Set<Rarity>(sorted.map((i) => i.drop.rarity));
    expect(rarities.size).toBeGreaterThan(4); // populated across the ladder
  });
});
