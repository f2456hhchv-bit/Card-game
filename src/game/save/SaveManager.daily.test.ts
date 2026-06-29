import { describe, it, expect } from "vitest";
import { SaveManager } from "./SaveManager";
import { World } from "../World";
import { Rng } from "../../core/math/Rng";

const STILL = { moveX: 0, moveY: 0 } as unknown as Parameters<World["step"]>[1];

describe("SaveManager — Daily Run records", () => {
  it("keeps the best time/kills for a date and resets when the date rolls over", () => {
    const sm = new SaveManager(); // node: localStorage absent → in-memory defaults
    sm.recordDaily("2026-06-29", 100, 40);
    expect(sm.data.daily).toEqual({ date: "2026-06-29", bestTime: 100, bestKills: 40 });

    // A worse run on the same day doesn't lower the best.
    sm.recordDaily("2026-06-29", 80, 30);
    expect(sm.data.daily.bestTime).toBe(100);
    expect(sm.data.daily.bestKills).toBe(40);

    // A better run on the same day raises it.
    const r = sm.recordDaily("2026-06-29", 150, 35);
    expect(r.newBestTime).toBe(true);
    expect(sm.data.daily.bestTime).toBe(150);
    expect(sm.data.daily.bestKills).toBe(40); // kills not beaten

    // A new day resets the daily best.
    sm.recordDaily("2026-06-30", 10, 5);
    expect(sm.data.daily).toEqual({ date: "2026-06-30", bestTime: 10, bestKills: 5 });
  });
});

describe("World — daily seed determinism", () => {
  it("re-seeding from the same date yields identical early spawns", () => {
    const seed = Rng.seedFromString("2026-06-29");
    const run = () => {
      const w = new World();
      w.reset();
      w.reseed(seed);
      w.player.stats.maxHp = 1e9;
      w.player.hp = 1e9;
      const counts: number[] = [];
      for (let i = 0; i < 600; i++) {
        w.step(1 / 60, STILL);
        counts.push(w.enemies.length);
      }
      return counts;
    };
    expect(run()).toEqual(run());
  });
});
