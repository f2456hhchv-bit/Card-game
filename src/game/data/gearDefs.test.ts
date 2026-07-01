import { describe, it, expect } from "vitest";
import {
  applyGear,
  mergeCost,
  setCounts,
  completedSets,
  maxedItems,
  emptyEquip,
  itemId,
  rarityMult,
  rollRarity,
  RARITIES,
  affixCount,
  rollAffixes,
  applyAffixes,
  AFFIX_LIST,
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
  it("builds one item per set × slot, all defined", () => {
    expect(SET_LIST.length).toBe(12);
    expect(ITEM_LIST.length).toBe(SET_LIST.length * SLOTS.length);
    for (const set of SET_LIST) {
      for (const slot of SLOTS) {
        expect(GEAR_ITEMS[itemId(set.id, slot)]).toBeDefined();
      }
    }
  });

  it("every set's 2pc and 4pc bonuses apply without error", () => {
    for (const set of SET_LIST) {
      const s = { ...new Player().base };
      expect(() => set.bonus2(s)).not.toThrow();
      expect(() => set.bonus4(s)).not.toThrow();
      expect(set.bonus2Note.length).toBeGreaterThan(0);
      expect(set.bonus4Note.length).toBeGreaterThan(0);
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

  it("completedSets counts only sets with all 4 pieces owned", () => {
    const partial = inv([itemId("solaris", "hull"), itemId("solaris", "core")]);
    expect(completedSets(partial)).toBe(0);
    const full = inv(SLOTS.map((s) => itemId("solaris", s)));
    expect(completedSets(full)).toBe(1);
  });

  it("maxedItems counts items at their max grade", () => {
    const one = inv([itemId("bastion", "wings")], 5);
    one[itemId("bastion", "core")] = { grade: 3, dupes: 0 }; // not maxed
    expect(maxedItems(one)).toBe(1);
  });
});

describe("gearDefs — rarity", () => {
  it("rarity multipliers strictly increase by tier", () => {
    for (let i = 1; i < RARITIES.length; i++) {
      expect(rarityMult(i)).toBeGreaterThan(rarityMult(i - 1));
    }
    expect(rarityMult(0)).toBe(1);
  });

  it("a higher-rarity item grants more stats at the same grade", () => {
    const id = itemId("solaris", "hull");
    const common = { ...new Player().base };
    const legendary = { ...new Player().base };
    applyGear(common, { ...emptyEquip(), hull: id }, { [id]: { grade: 3, dupes: 0, rarity: 0 } });
    applyGear(legendary, { ...emptyEquip(), hull: id }, { [id]: { grade: 3, dupes: 0, rarity: 3 } });
    expect(legendary.maxHp).toBeGreaterThan(common.maxHp);
  });

  it("rollRarity returns a valid tier index and favours Common", () => {
    const counts = [0, 0, 0, 0];
    let seq = 0;
    const rand = () => ((seq = (seq + 0.123) % 1), seq);
    for (let i = 0; i < 2000; i++) counts[rollRarity(rand)]++;
    for (const c of counts) expect(c).toBeGreaterThanOrEqual(0);
    expect(counts.reduce((a, b) => a + b)).toBe(2000);
    expect(counts[0]).toBeGreaterThan(counts[3]); // Common far more frequent
  });
});

describe("gearDefs — affixes", () => {
  it("affix count scales with rarity (Common 0 → Legendary 3)", () => {
    expect(affixCount(0)).toBe(0);
    expect(affixCount(1)).toBe(1);
    expect(affixCount(2)).toBe(2);
    expect(affixCount(3)).toBe(3);
  });

  it("rolls the right number of distinct affixes for a rarity", () => {
    const a = rollAffixes(3); // Legendary → 3 affixes
    expect(a.length).toBe(3);
    expect(new Set(a.map((x) => x.id)).size).toBe(3); // all distinct
    for (const af of a) expect(AFFIX_LIST.some((d) => d.id === af.id)).toBe(true);
  });

  it("a rarity upgrade keeps existing affixes and only adds", () => {
    const rare = rollAffixes(1); // 1 affix
    const upgraded = rollAffixes(3, rare); // keep the 1, add to reach 3
    expect(upgraded.length).toBe(3);
    expect(upgraded.slice(0, 1)).toEqual(rare);
    expect(new Set(upgraded.map((x) => x.id)).size).toBe(3);
  });

  it("applyAffixes adds the rolled bonuses onto a stat block", () => {
    const s = { ...new Player().base };
    const before = s.maxHp;
    applyAffixes(s, [{ id: "hp", value: 12 }]);
    expect(s.maxHp).toBe(before + 12);
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
