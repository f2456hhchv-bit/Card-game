import { describe, it, expect } from "vitest";
import { SaveManager } from "./SaveManager";
import { SIGNATURE_DEFS, signatureForBoss } from "../data/signatureDefs";

describe("SaveManager — boss signatures", () => {
  it("unlocks a boss's signature on first defeat and auto-equips it", () => {
    const sm = new SaveManager();
    const def = signatureForBoss("theMaw")!;
    const first = sm.unlockSignature("theMaw");
    expect(first).toEqual({ id: def.id, isNew: true });
    expect(sm.data.signatures.owned).toContain(def.id);
    expect(sm.data.signatures.equipped).toBe(def.id); // auto-equipped (slot empty)

    // A second defeat doesn't re-unlock or change the equipped one.
    const again = sm.unlockSignature("theMaw");
    expect(again).toEqual({ id: def.id, isNew: false });
    expect(sm.data.signatures.owned.length).toBe(1);
  });

  it("a second boss unlocks but does not auto-replace the equipped signature", () => {
    const sm = new SaveManager();
    sm.unlockSignature("theMaw");
    const equippedAfterFirst = sm.data.signatures.equipped;
    sm.unlockSignature("theChoir");
    expect(sm.data.signatures.owned.length).toBe(2);
    expect(sm.data.signatures.equipped).toBe(equippedAfterFirst); // unchanged
  });

  it("only owned signatures can be equipped; null clears the slot", () => {
    const sm = new SaveManager();
    const choir = SIGNATURE_DEFS.chorus.id;
    expect(sm.equipSignature(choir)).toBe(false); // not owned yet
    sm.unlockSignature("theChoir");
    expect(sm.equipSignature(choir)).toBe(true);
    expect(sm.data.signatures.equipped).toBe(choir);
    expect(sm.equipSignature(null)).toBe(true);
    expect(sm.data.signatures.equipped).toBeNull();
  });

  it("an unknown boss id yields no signature", () => {
    const sm = new SaveManager();
    expect(sm.unlockSignature("notABoss")).toBeNull();
  });
});
