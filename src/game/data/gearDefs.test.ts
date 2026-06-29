import { describe, it, expect } from "vitest";
import { applyGear, mergeCost, GEAR_DEFS, GEAR_LIST } from "./gearDefs";
import { Player } from "../entities/Player";

describe("gearDefs", () => {
  it("applies module stats that scale with grade", () => {
    const s = { ...new Player().base };
    const baseHp = s.maxHp;
    const baseArmor = s.armor;
    applyGear(s, { plating: { grade: 3, dupes: 0 } });
    expect(s.maxHp).toBe(baseHp + 21); // +7/grade × 3
    expect(s.armor).toBeCloseTo(baseArmor + 0.06); // +0.02/grade × 3
  });

  it("ignores unowned (grade 0) modules", () => {
    const s = { ...new Player().base };
    const before = { ...s };
    applyGear(s, { reactor: { grade: 0, dupes: 4 } });
    expect(s.damageMult).toBe(before.damageMult);
  });

  it("unlocks the signature perk only at max grade", () => {
    const below = { ...new Player().base };
    applyGear(below, { plating: { grade: 4, dupes: 0 } });
    expect(below.revive).toBe(0);

    const maxed = { ...new Player().base };
    applyGear(maxed, { plating: { grade: 5, dupes: 0 } });
    expect(maxed.revive).toBe(1);
  });

  it("each module unlocks a distinct max-grade perk effect", () => {
    const base = new Player().base;

    const reactor = { ...base };
    applyGear(reactor, { reactor: { grade: 5, dupes: 0 } });
    expect(reactor.pulseDamage).toBeGreaterThan(0);

    const thrusters = { ...base };
    applyGear(thrusters, { thrusters: { grade: 5, dupes: 0 } });
    expect(thrusters.iframes).toBeGreaterThan(base.iframes);

    const wings = { ...base };
    applyGear(wings, { wings: { grade: 5, dupes: 0 } });
    expect(wings.extraProjectiles).toBe(base.extraProjectiles + 1);
  });

  it("clamps applied grade to the module's max", () => {
    const over = { ...new Player().base };
    const exact = { ...new Player().base };
    applyGear(over, { plating: { grade: 99, dupes: 0 } });
    applyGear(exact, { plating: { grade: 5, dupes: 0 } });
    expect(over.maxHp).toBe(exact.maxHp);
  });

  it("merge cost equals the current grade (10 dupes to fully max)", () => {
    let total = 0;
    for (let g = 1; g < 5; g++) total += mergeCost(g);
    expect(total).toBe(10);
  });

  it("every module has a perk and a positive max grade", () => {
    for (const def of GEAR_LIST) {
      expect(def.maxGrade).toBeGreaterThan(0);
      expect(def.perk.name.length).toBeGreaterThan(0);
      expect(GEAR_DEFS[def.id]).toBe(def);
    }
  });
});
