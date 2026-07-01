import { describe, it, expect } from "vitest";
import {
  getGalaxy,
  galaxyOf,
  sectorOf,
  levelDifficulty,
  levelDuration,
  isBossSector,
  isFinalLevel,
  levelLabel,
  GALAXIES,
  SECTORS_PER_GALAXY,
  GALAXY_COUNT,
  TOTAL_SECTORS,
  MAX_LEVEL,
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

  it("difficulty climbs monotonically and stays in a fair band to Galaxy 100", () => {
    expect(levelDifficulty(0)).toBeCloseTo(1);
    // Strictly increasing across the whole run.
    expect(levelDifficulty(10)).toBeGreaterThan(levelDifficulty(0));
    expect(levelDifficulty(99)).toBeGreaterThan(levelDifficulty(10));
    expect(levelDifficulty(MAX_LEVEL)).toBeGreaterThan(levelDifficulty(499));
    // Gentle early (first Galaxy stays approachable).
    expect(levelDifficulty(9)).toBeLessThan(1.4);
    // Demanding but not an unkillable wall at the finale (player power is bounded).
    expect(levelDifficulty(MAX_LEVEL)).toBeGreaterThan(20);
    expect(levelDifficulty(MAX_LEVEL)).toBeLessThan(45);
  });

  it("is a finite campaign of 100 Galaxies (1000 Sectors)", () => {
    expect(GALAXY_COUNT).toBe(100);
    expect(TOTAL_SECTORS).toBe(1000);
    expect(MAX_LEVEL).toBe(999);
    expect(isFinalLevel(MAX_LEVEL)).toBe(true);
    expect(isFinalLevel(MAX_LEVEL - 1)).toBe(false);
    expect(levelLabel(MAX_LEVEL)).toBe("Galaxy 100 · Sector 10");
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

  it("Galaxies generate procedurally beyond the authored list (up to Galaxy 100)", () => {
    const far = getGalaxy(GALAXIES.length + 20);
    expect(far.name.length).toBeGreaterThan(0);
    expect(far.enemyPool.length).toBeGreaterThan(0);
    expect(far.bossPool.length).toBeGreaterThan(0);
    expect(SECTORS_PER_GALAXY).toBe(10);
  });
});
