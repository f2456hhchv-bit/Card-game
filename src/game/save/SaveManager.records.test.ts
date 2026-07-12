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
    motesCollected: 0,
    affixKills: 0,
    podsCollected: 0,
    level: 1,
    ascension: 0,
    ...over,
  };
}

const NORMAL = {
  stageId: "fade",
  endless: false,
};

describe("SaveManager — per-mode records", () => {
  it("tracks per-stage best time/kills for Story runs", () => {
    const sm = new SaveManager();
    sm.recordRun(stats({ elapsed: 120, kills: 50 }), 0, { ...NORMAL, stageId: "ember" });
    expect(sm.data.stageBest.ember).toEqual({ time: 120, kills: 50 });

    // A worse run doesn't lower either best; a better one raises it.
    sm.recordRun(stats({ elapsed: 90, kills: 80 }), 0, { ...NORMAL, stageId: "ember" });
    expect(sm.data.stageBest.ember).toEqual({ time: 120, kills: 80 });
  });

  it("tracks the Endless best Ascension and does not write a per-stage best", () => {
    const sm = new SaveManager();
    const r1 = sm.recordRun(stats({ ascension: 7, elapsed: 300 }), 0, { ...NORMAL, endless: true });
    expect(r1.newBestEndless).toBe(true);
    expect(sm.data.endlessBest).toBe(7);
    expect(sm.data.stageBest.fade).toBeUndefined();

    const r2 = sm.recordRun(stats({ ascension: 4 }), 0, { ...NORMAL, endless: true });
    expect(r2.newBestEndless).toBe(false);
    expect(sm.data.endlessBest).toBe(7);
  });
});
