import { describe, it, expect } from "vitest";
import { WEAPON_DEFS, WEAPON_LIST, DRAFTABLE_WEAPONS } from "./weaponDefs";
import { WARDEN_LIST } from "./wardenDefs";
import { PASSIVE_DEFS } from "./passiveDefs";

describe("weaponDefs — integrity", () => {
  it("every evolution targets a real, evolved weapon and a real relic", () => {
    for (const w of WEAPON_LIST) {
      if (!w.evolution) continue;
      const into = WEAPON_DEFS[w.evolution.into];
      expect(into, `${w.id} → ${w.evolution.into}`).toBeDefined();
      expect(into.evolved).toBe(true);
      expect(PASSIVE_DEFS[w.evolution.relic], `relic ${w.evolution.relic}`).toBeDefined();
    }
  });

  it("evolved forms are excluded from the draft pool", () => {
    for (const w of DRAFTABLE_WEAPONS) expect(w.evolved).not.toBe(true);
    expect(DRAFTABLE_WEAPONS.length).toBe(WEAPON_LIST.filter((w) => !w.evolved).length);
  });

  it("each level table is non-empty and matches maxLevel", () => {
    for (const w of WEAPON_LIST) {
      expect(w.levels.length).toBe(w.maxLevel);
      for (const lvl of w.levels) expect(lvl.damage).toBeGreaterThan(0);
    }
  });

  it("every Warden's starter weapon exists", () => {
    for (const wd of WARDEN_LIST) {
      expect(WEAPON_DEFS[wd.starterWeapon], `${wd.id} → ${wd.starterWeapon}`).toBeDefined();
    }
  });
});
