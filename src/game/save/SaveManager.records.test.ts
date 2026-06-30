import { describe, it, expect } from "vitest";
import { SaveManager } from "./SaveManager";
import type { RunStats } from "../World";

function stats(over: Partial<RunStats> = {}): RunStats {
  return {
    elapsed: 0,
    kills: 0,
    eliteKills: 0,
    bossKills: 0,
    damageDealt: 0,
    xpCollected: 0,
    level: 1,
    ...over,
  };
}

describe("SaveManager — per-mode records", () => {
  it("tracks per-stage best time/kills for normal runs", () => {
    const sm = new SaveManager();
    sm.recordRun(stats({ elapsed: 120, kills: 50 }), 0, {
      stageId: "ember",
      bossRush: false,
      daily: false,
    });
    expect(sm.data.stageBest.ember).toEqual({ time: 120, kills: 50 });

    // A worse run doesn't lower either best; a better one raises it.
    sm.recordRun(stats({ elapsed: 90, kills: 80 }), 0, {
      stageId: "ember",
      bossRush: false,
      daily: false,
    });
    expect(sm.data.stageBest.ember).toEqual({ time: 120, kills: 80 });
  });

  it("tracks the Boss Rush best (most bosses felled) and reports the record", () => {
    const sm = new SaveManager();
    const r1 = sm.recordRun(stats({ bossKills: 5 }), 0, {
      stageId: "fade",
      bossRush: true,
      daily: false,
    });
    expect(r1.newBestRush).toBe(true);
    expect(sm.data.bossRushBest).toBe(5);

    const r2 = sm.recordRun(stats({ bossKills: 3 }), 0, {
      stageId: "fade",
      bossRush: true,
      daily: false,
    });
    expect(r2.newBestRush).toBe(false);
    expect(sm.data.bossRushBest).toBe(5);
  });

  it("a Boss Rush run does not write a per-stage best", () => {
    const sm = new SaveManager();
    sm.recordRun(stats({ elapsed: 200, bossKills: 4 }), 0, {
      stageId: "deep",
      bossRush: true,
      daily: false,
    });
    expect(sm.data.stageBest.deep).toBeUndefined();
    expect(sm.data.bossRushBest).toBe(4);
  });
});
