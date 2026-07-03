import { describe, it, expect } from "vitest";
import { SaveManager } from "../save/SaveManager";
import { DIRECTIVE_DEFS } from "./directiveDefs";
import type { RunStats } from "../World";

const at = (iso: string): Date => new Date(`${iso}T12:00:00`);
const run = (o: Partial<RunStats>): RunStats =>
  ({
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
    stagesCleared: 0,
    ...o,
  }) as RunStats;

describe("Directives", () => {
  it("hands out 3 daily + 1 weekly, deterministic per date", () => {
    const a = new SaveManager();
    const b = new SaveManager();
    const list = a.activeDirectives(at("2026-07-03"));
    expect(list).toHaveLength(4);
    expect(list.filter((d) => d.def.period === "daily")).toHaveLength(3);
    expect(list.filter((d) => d.def.period === "weekly")).toHaveLength(1);
    // Same date → identical board on a second profile.
    const list2 = b.activeDirectives(at("2026-07-03"));
    expect(list2.map((d) => d.def.id)).toEqual(list.map((d) => d.def.id));
  });

  it("accumulates run-mode as a best and cumulative-mode as a sum", () => {
    const sm = new SaveManager();
    // Force a known board with one of each mode.
    const runId = Object.values(DIRECTIVE_DEFS).find((d) => d.mode === "run" && d.metric === "kills")!.id;
    const cumId = Object.values(DIRECTIVE_DEFS).find((d) => d.mode === "cumulative" && d.metric === "kills")!.id;
    sm.data.directives = {
      day: "x",
      week: "y",
      daily: [runId],
      weekly: [cumId],
      progress: {},
      claimed: [],
    };
    const now = at("2026-07-03");
    // stub refresh so our forced board isn't rolled away
    sm.refreshDirectives = () => {};
    sm.recordDirectiveProgress(run({ kills: 100 }), now);
    sm.recordDirectiveProgress(run({ kills: 60 }), now);
    expect(sm.data.directives.progress[runId]).toBe(100); // best of the two
    expect(sm.data.directives.progress[cumId]).toBe(160); // summed
  });

  it("only claims a completed, unclaimed directive and grants its reward", () => {
    const sm = new SaveManager();
    const def = Object.values(DIRECTIVE_DEFS).find((d) => d.metric === "bossKills" && d.mode === "run")!;
    sm.data.directives = {
      day: "x",
      week: "y",
      daily: [def.id],
      weekly: [],
      progress: {},
      claimed: [],
    };
    sm.refreshDirectives = () => {};
    // Not complete yet → no claim.
    expect(sm.claimDirective(def.id)).toBeNull();
    sm.recordDirectiveProgress(run({ bossKills: def.target }));
    const motes0 = sm.data.motes;
    const r = sm.claimDirective(def.id);
    expect(r?.motes).toBe(def.reward.motes);
    expect(sm.data.motes).toBe(motes0 + def.reward.motes);
    // No double claim.
    expect(sm.claimDirective(def.id)).toBeNull();
  });

  it("rolls the daily board over on a new day, clearing old progress", () => {
    const sm = new SaveManager();
    const day1 = sm.activeDirectives(at("2026-07-03")).map((d) => d.def.id);
    // record some progress on day 1's dailies
    sm.recordDirectiveProgress(run({ kills: 50 }), at("2026-07-03"));
    // jump a week+day so both boards roll
    const day2 = sm.activeDirectives(at("2026-07-13")).map((d) => d.def.id);
    // progress for any daily that left the board is gone
    for (const id of day1) {
      if (!day2.includes(id)) expect(sm.data.directives.progress[id]).toBeUndefined();
    }
  });
});
