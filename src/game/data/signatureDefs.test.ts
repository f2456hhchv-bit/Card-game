import { describe, it, expect } from "vitest";
import {
  SIGNATURE_LIST,
  SIGNATURE_DEFS,
  signatureForBoss,
  applySignature,
} from "./signatureDefs";
import { BOSS_DEFS } from "./bossDefs";
import { Player } from "../entities/Player";

describe("signatureDefs", () => {
  it("every signature maps to a real, unique boss", () => {
    const bosses = new Set<string>();
    for (const def of SIGNATURE_LIST) {
      expect(BOSS_DEFS[def.bossId]).toBeDefined();
      expect(bosses.has(def.bossId)).toBe(false);
      bosses.add(def.bossId);
    }
  });

  it("signatureForBoss finds the right relic", () => {
    expect(signatureForBoss("theMaw")?.id).toBe("devourer");
    expect(signatureForBoss("theNadir")?.id).toBe("abyssal");
    expect(signatureForBoss("nope")).toBeUndefined();
  });

  it("applies the equipped signature's stats; null is a no-op", () => {
    const base = new Player().base;
    const before = { ...base };
    applySignature(base, null);
    expect(base.maxHp).toBe(before.maxHp);

    const s = { ...new Player().base };
    applySignature(s, SIGNATURE_DEFS.anvil.id); // +60 HP, +8% armour, +1 revive
    expect(s.maxHp).toBe(before.maxHp + 60);
    expect(s.revive).toBe(before.revive + 1);
  });
});
