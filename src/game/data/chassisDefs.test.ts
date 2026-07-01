import { describe, it, expect } from "vitest";
import { CHASSIS_DEFS, CHASSIS_LIST, getChassis } from "./chassisDefs";
import { Player } from "../entities/Player";
import { Loadout } from "../Loadout";

describe("chassisDefs", () => {
  it("has a free default Skiff and all others cost motes", () => {
    expect(CHASSIS_DEFS.skiff).toBeDefined();
    expect(CHASSIS_DEFS.skiff.unlockCost).toBe(0);
    for (const c of CHASSIS_LIST) {
      if (c.id !== "skiff") expect(c.unlockCost).toBeGreaterThan(0);
      expect(c.passiveNote.length).toBeGreaterThan(0);
    }
  });

  it("getChassis falls back to Skiff for unknown ids", () => {
    expect(getChassis("nope").id).toBe("skiff");
  });

  it("the selected chassis's stat tilt flows through recomputeStats", () => {
    const player = new Player();

    const skiff = new Loadout();
    skiff.chassisId = "skiff";
    skiff.reset();
    skiff.recomputeStats(player);
    const baseHp = player.stats.maxHp;
    const baseProj = player.stats.extraProjectiles;

    const dread = new Loadout();
    dread.chassisId = "dreadnought";
    dread.reset();
    dread.recomputeStats(player);
    expect(player.stats.maxHp).toBeGreaterThan(baseHp); // +80 HP hull

    const gun = new Loadout();
    gun.chassisId = "gunship";
    gun.reset();
    gun.recomputeStats(player);
    expect(player.stats.extraProjectiles).toBe(baseProj + 1); // +1 projectile
  });
});
