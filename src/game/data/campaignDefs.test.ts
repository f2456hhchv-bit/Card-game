import { describe, it, expect } from "vitest";
import {
  getGalaxy,
  galaxyOf,
  sectorOf,
  levelDifficulty,
  levelDuration,
  isBossSector,
  levelLabel,
  GALAXIES,
  SECTORS_PER_GALAXY,
} from "./campaignDefs";
import { ENEMY_DEFS } from "./enemyDefs";
import { BOSS_DEFS } from "./bossDefs";

describe("campaignDefs", () => {
  it("maps global levels to Galaxy/Sector coordinates", () => {
    expect(galaxyOf(0)).toBe(0);
    expect(sectorOf(0)).toBe(0);
    expect(galaxyOf(10)).toBe(1);
    expect(sectorOf(13)).toBe(3);
    expect(levelLabel(13)).toBe("Galaxy 2 · Sector 4");
  });

  it("difficulty climbs slowly and monotonically per Sector", () => {
    expect(levelDifficulty(0)).toBeCloseTo(1);
    expect(levelDifficulty(10)).toBeGreaterThan(levelDifficulty(0));
    expect(levelDifficulty(25)).toBeGreaterThan(levelDifficulty(10));
    // "slow": one Galaxy (10 Sectors) is roughly +60% enemy strength.
    expect(levelDifficulty(10)).toBeCloseTo(1.6, 1);
  });

  it("boss Sectors are the 5th and 10th of each Galaxy", () => {
    expect(isBossSector(4)).toBe(true); // Sector 5
    expect(isBossSector(9)).toBe(true); // Sector 10
    expect(isBossSector(0)).toBe(false);
    expect(isBossSector(14)).toBe(true); // Galaxy 2 · Sector 5
    expect(levelDuration(0)).toBeGreaterThan(0);
  });

  it("hand-authored Galaxies reference only real enemies and bosses", () => {
    for (const g of GALAXIES) {
      for (const id of g.enemyPool) expect(ENEMY_DEFS[id], id).toBeDefined();
      for (const id of g.bossPool) expect(BOSS_DEFS[id], id).toBeDefined();
    }
  });

  it("the campaign is endless — Galaxies generate beyond the authored list", () => {
    const far = getGalaxy(GALAXIES.length + 20);
    expect(far.name.length).toBeGreaterThan(0);
    expect(far.enemyPool.length).toBeGreaterThan(0);
    expect(far.bossPool.length).toBeGreaterThan(0);
    expect(SECTORS_PER_GALAXY).toBe(10);
  });
});
