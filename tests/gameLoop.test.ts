import { describe, expect, it } from "vitest";
import { GameLoop } from "../src/core/time/GameLoop";

describe("GameLoop (fixed timestep)", () => {
  it("always steps the simulation in exact fixed increments", () => {
    const steps: number[] = [];
    const loop = new GameLoop({ update: (dt) => steps.push(dt), fixedDtMs: 10 });

    loop.tick(0); // primes lastTick
    loop.tick(35); // 35ms elapsed → 3 steps of 10, 5ms remains

    expect(steps).toEqual([10, 10, 10]);
    loop.tick(40); // +5ms → accumulator 10 → 1 step
    expect(steps).toEqual([10, 10, 10, 10]);
  });

  it("is deterministic: identical time sequences produce identical step counts", () => {
    const run = (times: number[]): number => {
      let count = 0;
      const loop = new GameLoop({ update: () => (count += 1), fixedDtMs: 16 });
      for (const t of times) loop.tick(t);
      return count;
    };
    const times = [0, 17, 30, 48, 100, 133, 134, 200];
    expect(run(times)).toBe(run(times));
  });

  it("clamps runaway frames instead of spiralling (drops excess sim time)", () => {
    let count = 0;
    const loop = new GameLoop({
      update: () => (count += 1),
      fixedDtMs: 10,
      maxUpdatesPerTick: 5,
    });
    loop.tick(0);
    loop.tick(1000); // 100 steps owed, only 5 allowed

    expect(count).toBe(5);
    expect(loop.droppedTimeMs).toBeGreaterThan(0);
    // Next normal frame recovers instead of catching up.
    loop.tick(1010);
    expect(count).toBeLessThanOrEqual(7);
  });

  it("passes an interpolation alpha in [0,1) to render", () => {
    const alphas: number[] = [];
    const loop = new GameLoop({
      update: () => undefined,
      render: (alpha) => alphas.push(alpha),
      fixedDtMs: 10,
    });
    loop.tick(0);
    loop.tick(15); // one step, 5ms residue → alpha 0.5
    expect(alphas.at(-1)).toBeCloseTo(0.5);
  });
});
