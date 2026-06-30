import { describe, it, expect } from "vitest";
import {
  applyGear,
  mergeCost,
  setCounts,
  emptyEquip,
  itemId,
  GEAR_ITEMS,
  ITEM_LIST,
  SET_LIST,
  SLOTS,
} from "./gearDefs";
import { Player } from "../entities/Player";

/** Build an inventory that owns the given item ids at the given grade. */
function inv(ids: string[], grade = 1) {
  const out: Record<string, { grade: number; dupes: number }> = {};
  for (const id of ids) out[id] = { grade, dupes: 0 };
  return out;
}

describe("gearDefs — items", () => {
  it("there are 4 sets × 4 slots = 16 items", () => {
    expect(SET_LIST.length).toBe(4);
    expect(ITEM_LIST.length).toBe(16);
    for (const set of SET_LIST) {
      for (const slot of SLOTS) {
        expect(GEAR_ITEMS[itemId(set.id, slot)]).toBeDefined();
      }
    }
  });

  it("applies an equipped item's slot stats, scaled by grade", () => {
    const s = { ...new Player().base };
    const baseHp = s.maxHp;
    const equipped = { ...emptyEquip(), hull: itemId("salvager", "hull") };
    applyGear(s, equipped, inv([itemId("salvager", "hull")], 3));
    expect(s.maxHp).toBe(baseHp + 18); // hull: +6 HP/grade × 3
  });

  it("ignores an equipped slot whose item isn't actually owned", () => {
    const s = { ...new Player().base };
    const before = { ...s };
    const equipped = { ...emptyEquip(), core: itemId("solaris", "core") };
    applyGear(s, equipped, {}); // not in inventory
    expect(s.damageMult).toBe(before.damageMult);
  });

  it("merge cost equals current grade (10 dupes to fully max one item)", () => {
    let total = 0;
    for (let g = 1; g < 5; g++) total += mergeCost(g);
    expect(total).toBe(10);
  });
});

describe("gearDefs — set bonuses", () => {
  it("2 pieces of a set grant the 2-piece bonus, 4 grant the 4-piece too", () => {
    const base = new Player().base;

    // Two Solaris pieces → +8% damage (2pc), no Overdrive yet.
    const two = { ...base };
    const twoIds = [itemId("solaris", "hull"), itemId("solaris", "core")];
    const twoEquip = { ...emptyEquip(), hull: twoIds[0], core: twoIds[1] };
    applyGear(two, twoEquip, inv(twoIds));
    expect(two.pulseDamage).toBe(0);

    // Full Solaris set → Overdrive pulse unlocked (4pc).
    const four = { ...base };
    const fourIds = SLOTS.map((slot) => itemId("solaris", slot));
    const fourEquip = emptyEquip();
    for (const slot of SLOTS) fourEquip[slot] = itemId("solaris", slot);
    applyGear(four, fourEquip, inv(fourIds));
    expect(four.pulseDamage).toBeGreaterThan(0);
    // 4pc damage must exceed the 2pc-only damage.
    expect(four.damageMult).toBeGreaterThan(two.damageMult);
  });

  it("a mixed loadout (no 2 of a kind) grants no set bonus", () => {
    const s = { ...new Player().base };
    const equipped = emptyEquip();
    const ids: string[] = [];
    // One piece from each different set → counts are all 1.
    equipped.hull = itemId("salvager", "hull");
    equipped.core = itemId("solaris", "core");
    equipped.engines = itemId("bastion", "engines");
    equipped.wings = itemId("zephyr", "wings");
    ids.push(equipped.hull, equipped.core, equipped.engines, equipped.wings);
    const counts = setCounts(equipped, inv(ids));
    expect(Math.max(...Object.values(counts))).toBe(1);

    const before = { ...s };
    applyGear(s, equipped, inv(ids));
    // Pieces still apply their own slot stats, but no XP/move set bonus.
    expect(s.xpMult).toBe(before.xpMult);
    expect(s.moveSpeed).toBeGreaterThan(before.moveSpeed); // engines slot stat only
  });

  it("Bastion 4-piece grants a revive charge; Zephyr 4-piece grants +1 projectile", () => {
    const base = new Player().base;

    const bastion = { ...base };
    const bEquip = emptyEquip();
    for (const slot of SLOTS) bEquip[slot] = itemId("bastion", slot);
    applyGear(bastion, bEquip, inv(SLOTS.map((s) => itemId("bastion", s))));
    expect(bastion.revive).toBe(1);

    const zephyr = { ...base };
    const zEquip = emptyEquip();
    for (const slot of SLOTS) zEquip[slot] = itemId("zephyr", slot);
    applyGear(zephyr, zEquip, inv(SLOTS.map((s) => itemId("zephyr", s))));
    expect(zephyr.extraProjectiles).toBe(base.extraProjectiles + 1);
    expect(zephyr.iframes).toBeGreaterThan(base.iframes);
  });
});
