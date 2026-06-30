import { describe, it, expect } from "vitest";
import { SaveManager } from "./SaveManager";
import { GEAR_ITEMS, itemId } from "../data/gearDefs";

describe("SaveManager — gear inventory & equip", () => {
  it("a first drop owns the item at grade 1 and auto-equips an empty slot", () => {
    const sm = new SaveManager();
    const first = sm.grantItemDrop();
    expect(first.isNew).toBe(true);
    const item = GEAR_ITEMS[first.id];
    const m = sm.data.gear.inventory[first.id];
    expect(m.grade).toBe(1);
    // The matching slot should now hold this item (it was empty).
    expect(sm.data.gear.equipped[item.slot]).toBe(first.id);
  });

  it("a drop rolls a rarity, and a luckier later roll upgrades it", () => {
    const sm = new SaveManager();
    const real = Math.random;
    try {
      // grantItemDrop() calls Math.random twice: item pick, then rarity roll.
      // Force item index 0 (→0) and a Common rarity roll (→0).
      Math.random = () => 0;
      const first = sm.grantItemDrop();
      const id = first.id;
      expect(first.isNew).toBe(true);
      expect(first.rarity).toBe(0); // Common

      // Same item (index 0), but a Legendary rarity roll (0.99 → top tier).
      let c = 0;
      Math.random = () => (c++ % 2 === 0 ? 0 : 0.99);
      const second = sm.grantItemDrop();
      expect(second.id).toBe(id);
      expect(second.rarityUp).toBe(true);
      expect(sm.data.gear.inventory[id].rarity).toBe(3); // Legendary
    } finally {
      Math.random = real;
    }
  });

  it("further drops of an owned item bank duplicate cores", () => {
    const sm = new SaveManager();
    const first = sm.grantItemDrop();
    let banked = false;
    for (let i = 0; i < 300 && !banked; i++) {
      const d = sm.grantItemDrop();
      if (!d.isNew && d.id === first.id) banked = true;
    }
    expect(banked).toBe(true);
    expect(sm.data.gear.inventory[first.id].dupes).toBeGreaterThan(0);
  });

  it("merging consumes dupes equal to the current grade and raises grade", () => {
    const sm = new SaveManager();
    const id = itemId("salvager", "hull");
    sm.data.gear.inventory[id] = { grade: 1, dupes: 0 };
    expect(sm.mergeItem(id)).toBeNull(); // grade 1 needs 1 dupe

    sm.data.gear.inventory[id].dupes = 1;
    expect(sm.mergeItem(id)).toBe(2);
    expect(sm.data.gear.inventory[id].dupes).toBe(0);

    sm.data.gear.inventory[id].dupes = 5;
    expect(sm.mergeItem(id)).toBe(3); // grade 2 → 3 costs 2
    expect(sm.data.gear.inventory[id].dupes).toBe(3);
  });

  it("cannot merge past max grade", () => {
    const sm = new SaveManager();
    const id = itemId("solaris", "core");
    const max = GEAR_ITEMS[id].maxGrade;
    sm.data.gear.inventory[id] = { grade: max, dupes: 99 };
    expect(sm.mergeItem(id)).toBeNull();
  });

  it("equip swaps the item in its slot; only owned items can be equipped", () => {
    const sm = new SaveManager();
    const hullA = itemId("salvager", "hull");
    const hullB = itemId("bastion", "hull");
    sm.data.gear.inventory[hullA] = { grade: 1, dupes: 0 };
    sm.data.gear.inventory[hullB] = { grade: 1, dupes: 0 };

    expect(sm.equipItem(hullA)).toBe(true);
    expect(sm.data.gear.equipped.hull).toBe(hullA);
    expect(sm.equipItem(hullB)).toBe(true);
    expect(sm.data.gear.equipped.hull).toBe(hullB); // swapped, same slot

    // Unowned item cannot be equipped.
    expect(sm.equipItem(itemId("zephyr", "hull"))).toBe(false);
  });

  it("migrates the legacy single-module save into Salvager items and equips them", () => {
    // Simulate an old save with the previous `modules` shape.
    const legacy = {
      version: 1,
      modules: {
        plating: { grade: 3, dupes: 1 },
        reactor: { grade: 2, dupes: 0 },
      },
    };
    const sm = new SaveManager();
    const migrated = (sm as unknown as {
      migrate(p: unknown): typeof sm.data;
    }).migrate(legacy);
    expect(migrated.gear.inventory[itemId("salvager", "hull")]).toEqual({ grade: 3, dupes: 1, rarity: 0 });
    expect(migrated.gear.inventory[itemId("salvager", "core")]).toEqual({ grade: 2, dupes: 0, rarity: 0 });
    expect(migrated.gear.equipped.hull).toBe(itemId("salvager", "hull"));
    expect(migrated.gear.equipped.core).toBe(itemId("salvager", "core"));
    expect(migrated.gear.equipped.engines).toBeNull();
  });
});
