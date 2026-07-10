import { describe, it, expect } from "vitest";
import { effectiveHeroStats, heroDps } from "./HeroStats";
import { HERO_BASE } from "../data/heroDefs";
import { createDefaultState } from "../state/GameState";
import type { GearItem } from "../data/gearDefs";

describe("effectiveHeroStats", () => {
  it("matches base hero stats with no upgrades, gear or prestige", () => {
    const state = createDefaultState();
    const eff = effectiveHeroStats(state);
    expect(eff.hp).toBeCloseTo(HERO_BASE.hp, 5);
    expect(eff.atk).toBeCloseTo(HERO_BASE.atk, 5);
    expect(eff.def).toBeCloseTo(HERO_BASE.def, 5);
    expect(eff.critChance).toBeCloseTo(HERO_BASE.critChance, 5);
  });

  it("increases attack with the Fortify Blade upgrade", () => {
    const state = createDefaultState();
    const base = effectiveHeroStats(state).atk;
    state.upgrades.fortifyBlade = 5;
    const boosted = effectiveHeroStats(state).atk;
    expect(boosted).toBeGreaterThan(base);
  });

  it("adds equipped gear's stat bonus", () => {
    const state = createDefaultState();
    const base = effectiveHeroStats(state).atk;
    const weapon: GearItem = {
      id: "test1",
      slot: "weapon",
      rarity: "rare",
      stat: "atk",
      name: "Test Blade",
      baseValue: 10,
      enhanceLevel: 0,
      foundAtStage: 1,
    };
    state.gear.weapon = weapon;
    const boosted = effectiveHeroStats(state).atk;
    expect(boosted).toBeCloseTo(base + 10, 5);
  });

  it("scales all combat power stats with Afterglow (prestige)", () => {
    const state = createDefaultState();
    const base = effectiveHeroStats(state);
    state.afterglow = 50;
    const boosted = effectiveHeroStats(state);
    expect(boosted.atk).toBeGreaterThan(base.atk);
    expect(boosted.def).toBeGreaterThan(base.def);
    expect(boosted.hp).toBeGreaterThan(base.hp);
  });

  it("caps crit chance and attack speed", () => {
    const state = createDefaultState();
    state.upgrades.keenEdge = 1000;
    state.upgrades.thrusterTuning = 1000;
    const eff = effectiveHeroStats(state);
    expect(eff.critChance).toBeLessThanOrEqual(0.75);
    expect(eff.attacksPerSecond).toBeLessThanOrEqual(3);
  });
});

describe("heroDps", () => {
  it("increases with crit chance and crit damage", () => {
    const noCrit = heroDps({ hp: 1, atk: 10, def: 0, critChance: 0, critMulti: 1, attacksPerSecond: 1, goldFind: 0, essenceFind: 0 });
    const withCrit = heroDps({ hp: 1, atk: 10, def: 0, critChance: 0.5, critMulti: 2, attacksPerSecond: 1, goldFind: 0, essenceFind: 0 });
    expect(withCrit).toBeGreaterThan(noCrit);
    expect(noCrit).toBeCloseTo(10, 5);
  });
});
