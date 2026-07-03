import { describe, it, expect } from "vitest";
import { applyMeta, metaMoteMultiplier, META_DEFS } from "./metaDefs";
import { Player } from "../entities/Player";

describe("metaDefs", () => {
  it("applies meta upgrades onto a stat block", () => {
    const s = { ...new Player().base };
    const baseDmg = s.damageMult;
    const baseHp = s.maxHp;
    applyMeta(s, { might: 5, vigor: 3 });
    expect(s.damageMult).toBeCloseTo(baseDmg * 1.25); // +5%/lvl × 5
    expect(s.maxHp).toBe(baseHp + 24); // +8/lvl × 3
  });

  it("ignores zero/unknown levels", () => {
    const s = { ...new Player().base };
    const before = { ...s };
    applyMeta(s, { might: 0, nonexistent: 9 });
    expect(s.damageMult).toBe(before.damageMult);
  });

  it("Fortune raises the mote multiplier", () => {
    expect(metaMoteMultiplier({})).toBe(1);
    expect(metaMoteMultiplier({ fortune: 5 })).toBeCloseTo(1.4);
  });

  it("cost curves rise with level", () => {
    const def = META_DEFS.might;
    expect(def.cost(0)).toBeLessThan(def.cost(1));
    expect(def.cost(1)).toBeLessThan(def.cost(4));
  });

  it("Ascendancy is an endless, ever-rising prestige sink", () => {
    const def = META_DEFS.ascendant;
    expect(def.maxLevel).toBeGreaterThan(100); // effectively infinite
    expect(def.cost(0)).toBeLessThan(def.cost(20));
    expect(def.cost(20)).toBeLessThan(def.cost(50));
    // Each tier grants a small permanent edge that stacks.
    const s = { ...new Player().base };
    const d0 = s.damageMult;
    const h0 = s.maxHp;
    applyMeta(s, { ascendant: 10 });
    expect(s.damageMult).toBeCloseTo(d0 * 1.05); // +0.5%/tier × 10
    expect(s.maxHp).toBe(h0 + 30); // +3/tier × 10
  });
});
