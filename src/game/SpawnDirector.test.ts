import { describe, it, expect } from "vitest";
import { SpawnDirector } from "./SpawnDirector";
import { Rng } from "../core/math/Rng";

describe("SpawnDirector", () => {
  it("scales enemy HP up over time", () => {
    const d = new SpawnDirector();
    expect(d.hpScale(0)).toBeCloseTo(1, 1);
    expect(d.hpScale(5)).toBeGreaterThan(d.hpScale(0));
    expect(d.hpScale(12)).toBeGreaterThan(d.hpScale(5));
  });

  it("raises the enemy cap with time but bounds it", () => {
    const d = new SpawnDirector();
    expect(d.enemyCap(0)).toBeLessThan(d.enemyCap(5));
    expect(d.enemyCap(100)).toBeLessThanOrEqual(900);
  });

  it("produces spawn requests as time passes", () => {
    const d = new SpawnDirector();
    const rng = new Rng(10);
    let total = 0;
    // Simulate ~10 seconds at 60Hz from the start of a run.
    for (let i = 0; i < 600; i++) {
      total += d.update(1 / 60, i / 60, 0, rng).length;
    }
    expect(total).toBeGreaterThan(0);
  });

  it("suppresses fodder spawns when already at the enemy cap", () => {
    const d = new SpawnDirector();
    const rng = new Rng(11);
    let fodder = 0;
    // Report a live count far above any cap the window can reach.
    for (let i = 0; i < 300; i++) {
      const reqs = d.update(1 / 60, i / 60, 100000, rng);
      fodder += reqs.filter((r) => !r.elite).length;
    }
    expect(fodder).toBe(0);
  });

  it("is deterministic for a fixed seed", () => {
    const run = () => {
      const d = new SpawnDirector();
      const rng = new Rng(777);
      const counts: number[] = [];
      for (let i = 0; i < 200; i++) {
        counts.push(d.update(1 / 60, i / 60, 0, rng).length);
      }
      return counts;
    };
    expect(run()).toEqual(run());
  });
});
