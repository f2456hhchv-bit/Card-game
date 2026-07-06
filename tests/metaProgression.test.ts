import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { MetaProgression } from "../src/game/meta/MetaProgression";
import {
  ACCOUNT_XP_AWARDS,
  SANDBOX_CHALLENGES,
  type ChallengeDef,
} from "../src/game/meta/metaData";

describe("MetaProgression — account level (AF-026 §2)", () => {
  it("levels up from XP and reports each level", () => {
    const levels: number[] = [];
    const meta = new MetaProgression(SANDBOX_CHALLENGES, undefined, (l) => levels.push(l));
    meta.addAccountXp(500);
    expect(meta.snapshot.accountLevel).toBeGreaterThan(1);
    expect(levels.length).toBe(meta.snapshot.accountLevel - 1);
  });

  it("has no reset operation — never-resets is structural", () => {
    const meta = new MetaProgression(SANDBOX_CHALLENGES) as unknown as Record<string, unknown>;
    expect(meta["reset"]).toBeUndefined();
  });
});

describe("MetaProgression — mastery (AF-026 §3)", () => {
  it("tracks XP and ranks per track independently", () => {
    const meta = new MetaProgression(SANDBOX_CHALLENGES);
    meta.addMasteryXp("weapon:test-cannon", 120);
    meta.addMasteryXp("ship:placeholder", 400);
    expect(meta.masteryRank("weapon:test-cannon")).toBe(1); // past 100
    expect(meta.masteryRank("ship:placeholder")).toBe(2); // past 100+250
    expect(meta.masteryRank("commander:nobody")).toBe(0);
  });

  it("accumulates named counters per track", () => {
    const meta = new MetaProgression(SANDBOX_CHALLENGES);
    meta.addMasteryCounter("weapon:test-cannon", "kills", 5);
    meta.addMasteryCounter("weapon:test-cannon", "kills", 3);
    meta.addMasteryCounter("weapon:test-cannon", "criticalHits");
    const save = meta.toSave();
    expect(save.mastery["weapon:test-cannon"]?.counters["kills"]).toBe(8);
    expect(save.mastery["weapon:test-cannon"]?.counters["criticalHits"]).toBe(1);
  });
});

describe("MetaProgression — collections & statistics (AF-026 §4)", () => {
  it("discovery is idempotent and counted once", () => {
    const meta = new MetaProgression(SANDBOX_CHALLENGES);
    expect(meta.discover("enemies", "ENEMY_DRONE")).toBe(true);
    expect(meta.discover("enemies", "ENEMY_DRONE")).toBe(false);
    expect(meta.snapshot.collectionCounts.enemies).toBe(1);
  });

  it("statistics accumulate and max-track correctly", () => {
    const meta = new MetaProgression(SANDBOX_CHALLENGES);
    meta.recordStat("damageDealt", 100.5);
    meta.recordStat("damageDealt", 49.5);
    meta.recordStatMax("highestDifficulty", 3);
    meta.recordStatMax("highestDifficulty", 2); // lower — ignored
    expect(meta.stat("damageDealt")).toBe(150);
    expect(meta.stat("highestDifficulty")).toBe(3);
  });
});

describe("MetaProgression — challenges (AF-026 §6)", () => {
  it("completes exactly once at target and grants the cosmetic", () => {
    const completed: string[] = [];
    const meta = new MetaProgression(SANDBOX_CHALLENGES, (c) => completed.push(c.id));
    for (let i = 0; i < 30; i += 1) meta.recordStat("enemiesDestroyed");
    expect(completed).toEqual(["drone-reaper"]); // once, despite passing target repeatedly
    expect(meta.isChallengeCompleted("drone-reaper")).toBe(true);
    expect(meta.toSave().unlockedCosmetics).toContain("title:TITLE_DRONE_REAPER");
    expect(meta.hasDiscovered("achievements", "TITLE_DRONE_REAPER")).toBe(true);
  });

  it("reports progress toward incomplete challenges", () => {
    const meta = new MetaProgression(SANDBOX_CHALLENGES);
    meta.recordStat("itemsCollected", 3);
    expect(meta.challengeProgress("field-harvester")).toEqual({ current: 3, target: 5 });
  });
});

describe("MetaProgression — persistence (AF-026 §8)", () => {
  it("round-trips the full ledger", () => {
    const meta = new MetaProgression(SANDBOX_CHALLENGES);
    meta.addAccountXp(300);
    meta.addMasteryXp("weapon:test-cannon", 150);
    meta.discover("bosses", "BOSS_FIRST");
    meta.recordStat("runs", 7);

    const restored = new MetaProgression(SANDBOX_CHALLENGES);
    restored.loadSave(meta.toSave());
    expect(restored.snapshot.accountLevel).toBe(meta.snapshot.accountLevel);
    expect(restored.masteryRank("weapon:test-cannon")).toBe(1);
    expect(restored.hasDiscovered("bosses", "BOSS_FIRST")).toBe(true);
    expect(restored.stat("runs")).toBe(7);
  });
});

describe("MetaProgression — 300 simulated expeditions (AF-026 self-review)", () => {
  it("holds every ledger invariant across simulated careers", () => {
    const challenges: ChallengeDef[] = [
      ...SANDBOX_CHALLENGES,
      { id: "century", category: "general", name: "Century", description: "100 runs", counterKey: "runs", target: 100, reward: { kind: "title", id: "TITLE_CENTURY" } },
    ];
    const meta = new MetaProgression(challenges);
    const rng = new Rng(2026).fork("expeditions");
    let expectedKills = 0;
    let lastLevel = 1;

    for (let run = 1; run <= 300; run += 1) {
      const victory = rng.next() < 0.6;
      const kills = rng.int(5, 40);
      expectedKills += kills;
      meta.recordStat("runs");
      meta.recordStat(victory ? "victories" : "defeats");
      meta.recordStat("enemiesDestroyed", kills);
      meta.addAccountXp(victory ? ACCOUNT_XP_AWARDS.missionCompleted : ACCOUNT_XP_AWARDS.missionFailed);
      meta.addMasteryXp("weapon:test-cannon", kills);
      meta.discover("enemies", `ENEMY_${rng.int(1, 10)}`);

      const level = meta.snapshot.accountLevel;
      expect(level).toBeGreaterThanOrEqual(lastLevel); // monotonic — never resets
      lastLevel = level;
    }

    expect(meta.stat("enemiesDestroyed")).toBe(expectedKills); // exact sums
    expect(meta.stat("runs")).toBe(300);
    expect(meta.stat("victories") + meta.stat("defeats")).toBe(300);
    expect(meta.snapshot.collectionCounts.enemies).toBeLessThanOrEqual(10); // idempotent
    expect(meta.isChallengeCompleted("century")).toBe(true);
    expect(meta.snapshot.accountLevel).toBeGreaterThan(5); // defeats paid too

    // Full persistence fidelity after a long career.
    const restored = new MetaProgression(challenges);
    restored.loadSave(meta.toSave());
    expect(restored.toSave()).toEqual(meta.toSave());
  });
});
