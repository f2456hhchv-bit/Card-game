import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { UpgradePool } from "../src/game/progression/UpgradePool";
import type { UpgradeDefinition } from "../src/game/progression/xpTuning";
import {
  BUILD_PATHS,
  BuildPathRuntime,
  offerBiasedUpgrades,
  offerBuildPaths,
  shouldOfferBuildPath,
} from "../src/game/progression/buildPaths";

const DEFS: readonly UpgradeDefinition[] = [
  { id: "weapon-a", category: "weaponUpgrade", name: "Weapon A", description: "", weight: 10, maxStacks: null },
  { id: "drone-a", category: "drone", name: "Drone A", description: "", weight: 10, maxStacks: null },
  { id: "shield-a", category: "shield", name: "Shield A", description: "", weight: 10, maxStacks: 1 },
];

describe("GP-001 — Build-Defining Paths", () => {
  it("registers nine distinct paths with distinct category biases", () => {
    expect(BUILD_PATHS.length).toBe(9);
    expect(new Set(BUILD_PATHS.map((p) => p.id)).size).toBe(9);
  });

  it("shouldOfferBuildPath fires exactly on every 5th wave, once each", () => {
    expect(shouldOfferBuildPath(0, 0)).toBe(false);
    expect(shouldOfferBuildPath(4, 0)).toBe(false);
    expect(shouldOfferBuildPath(5, 0)).toBe(true);
    expect(shouldOfferBuildPath(5, 5)).toBe(false); // already offered at wave 5
    expect(shouldOfferBuildPath(10, 5)).toBe(true);
  });

  it("BuildPathRuntime.choose is idempotent per path and compounds multipliers across distinct paths", () => {
    const runtime = new BuildPathRuntime();
    expect(runtime.multiplierFor("drone")).toBe(1);
    expect(runtime.choose("droneCommander")).toBe(true);
    expect(runtime.choose("droneCommander")).toBe(false); // already chosen
    expect(runtime.multiplierFor("drone")).toBe(4);
    expect(runtime.chosenIds).toEqual(["droneCommander"]);

    // A second, different path compounds (multiplies) rather than replaces.
    const shieldPath = BUILD_PATHS.find((p) => p.id === "guardian")!;
    runtime.choose("guardian");
    expect(runtime.multiplierFor("shield")).toBe(shieldPath.categoryWeightMultipliers.shield);
    expect(runtime.multiplierFor("drone")).toBe(4); // unaffected by the unrelated category
  });

  it("offerBuildPaths returns distinct paths, deterministic per seed, excluding already-chosen ids", () => {
    const rng = new Rng(42);
    const offer = offerBuildPaths([], 3, rng);
    expect(offer.length).toBe(3);
    expect(new Set(offer.map((p) => p.id)).size).toBe(3);

    const chosenIds = BUILD_PATHS.slice(0, 7).map((p) => p.id);
    const rng2 = new Rng(42);
    const offer2 = offerBuildPaths(chosenIds, 2, rng2);
    expect(offer2.length).toBe(2);
    for (const path of offer2) expect(chosenIds).not.toContain(path.id);
  });

  it("offerBiasedUpgrades never offers more than the count and respects maxStacks exclusion via pool.stacksOf", () => {
    const pool = new UpgradePool(DEFS, new Rng(7));
    pool.recordTaken("shield-a"); // hits its maxStacks of 1
    const offer = offerBiasedUpgrades(DEFS, pool, 3, () => 1, new Rng(7));
    expect(offer.choices.length).toBe(2); // only weapon-a and drone-a remain available
    expect(offer.choices.some((c) => c.id === "shield-a")).toBe(false);
  });

  it("offerBiasedUpgrades is heavily biased toward a category with a large multiplier over many trials", () => {
    const multiplierFor = (category: string) => (category === "drone" ? 50 : 1);
    let droneFirstCount = 0;
    const trials = 200;
    for (let i = 0; i < trials; i += 1) {
      const pool = new UpgradePool(DEFS, new Rng(i + 1));
      const offer = offerBiasedUpgrades(DEFS, pool, 1, multiplierFor as any, new Rng(i + 1));
      if (offer.choices[0]?.id === "drone-a") droneFirstCount += 1;
    }
    expect(droneFirstCount).toBeGreaterThan(trials * 0.8);
  });

  it("with a neutral multiplier, offerBiasedUpgrades matches UpgradePool.offer()'s own distribution shape", () => {
    const rngA = new Rng(99);
    const rngB = new Rng(99);
    const poolA = new UpgradePool(DEFS, rngA);
    const poolB = new UpgradePool(DEFS, rngB);
    const direct = poolA.offer(2);
    const biased = offerBiasedUpgrades(DEFS, poolB, 2, () => 1, rngB);
    expect(biased.choices.map((c) => c.id)).toEqual(direct.choices.map((c) => c.id));
  });
});
