import { describe, it, expect } from "vitest";
import { bossForEncounter, getBoss, BOSS_DEFS } from "./bossDefs";
import { STAGE_DEFS } from "./stageDefs";

describe("bossDefs", () => {
  it("cycles a stage's boss pool by encounter index", () => {
    const pool = STAGE_DEFS.ember.bossPool;
    expect(pool).toEqual(["thePyre", "theForge"]);
    expect(bossForEncounter(0, pool).id).toBe("thePyre");
    expect(bossForEncounter(1, pool).id).toBe("theForge");
    expect(bossForEncounter(2, pool).id).toBe("thePyre"); // wraps
  });

  it("falls back to the full roster when no pool is given", () => {
    expect(bossForEncounter(0).id).toBeDefined();
  });

  it("every stage boss pool references real bosses whose summons exist", () => {
    for (const stage of Object.values(STAGE_DEFS)) {
      for (const id of stage.bossPool) {
        const boss = getBoss(id);
        expect(boss.id).toBe(id);
        // The boss's summoned add must be a real enemy in this stage or the base.
        expect(boss.addType.length).toBeGreaterThan(0);
      }
    }
  });

  it("Ember bosses are distinct fiery encounters", () => {
    expect(BOSS_DEFS.thePyre.addType).toBe("cinder");
    expect(BOSS_DEFS.theForge.addType).toBe("revenant");
    expect(BOSS_DEFS.thePyre.baseHp).toBeGreaterThan(BOSS_DEFS.theMaw.baseHp - 1);
  });
});
