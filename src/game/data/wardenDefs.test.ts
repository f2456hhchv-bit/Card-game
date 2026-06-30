import { describe, it, expect } from "vitest";
import { getWarden, WARDEN_DEFS } from "./wardenDefs";
import { bossForEncounter, BOSS_DEFS } from "./bossDefs";
import { Loadout } from "../Loadout";
import { Player } from "../entities/Player";

describe("wardenDefs", () => {
  it("the default Warden is free and starts with Lumen Bolt", () => {
    expect(WARDEN_DEFS.lumen.unlockCost).toBe(0);
    expect(WARDEN_DEFS.lumen.starterWeapon).toBe("lumenBolt");
  });

  it("Vesper's perk widens area but lowers max HP", () => {
    const s = { ...new Player().base };
    const baseArea = s.areaMult;
    const baseHp = s.maxHp;
    getWarden("vesper").applyPerk?.(s);
    expect(s.areaMult).toBeCloseTo(baseArea * 1.15);
    expect(s.maxHp).toBe(baseHp - 10);
  });

  it("unknown Warden ids fall back to Lumen", () => {
    expect(getWarden("nope").id).toBe("lumen");
  });

  it("selecting a Warden changes the run's starting weapon and applies the perk", () => {
    const loadout = new Loadout();
    const player = new Player();
    loadout.wardenId = "surge";
    loadout.reset();
    expect(loadout.weapons[0].def.id).toBe("arcCoil");
    const baseAtk = player.base.attackSpeedMult;
    loadout.recomputeStats(player);
    expect(player.stats.attackSpeedMult).toBeCloseTo(baseAtk * 1.12);
  });
});

describe("bossDefs", () => {
  it("alternates The Fade's bosses across encounters", () => {
    const pool = ["theMaw", "theChoir"];
    expect(bossForEncounter(0, pool).id).toBe(BOSS_DEFS.theMaw.id);
    expect(bossForEncounter(1, pool).id).toBe(BOSS_DEFS.theChoir.id);
    expect(bossForEncounter(2, pool).id).toBe(BOSS_DEFS.theMaw.id);
  });

  it("the base bosses summon different add types", () => {
    expect(BOSS_DEFS.theMaw.addType).toBe("husk");
    expect(BOSS_DEFS.theChoir.addType).toBe("caster");
  });
});
