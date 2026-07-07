import { describe, expect, it } from "vitest";
import { AchievementRuntime, type AchievementProgressReader } from "../src/game/achievements/AchievementRuntime";
import { CollectionLedger } from "../src/game/achievements/CollectionLedger";
import {
  ACHIEVEMENT_CATEGORIES,
  ACHIEVEMENT_DIFFICULTIES,
  CHALLENGE_CADENCE_KINDS,
  EXTRA_COLLECTION_CATEGORIES,
  SANDBOX_ACHIEVEMENTS,
} from "../src/game/achievements/achievementData";

function makeReader(overrides: Partial<{ stats: Record<string, number>; collections: Record<string, number>; completed: string[] }> = {}): AchievementProgressReader {
  const stats = overrides.stats ?? {};
  const collections = overrides.collections ?? {};
  const completed = new Set(overrides.completed ?? []);
  return {
    stat: (key) => stats[key] ?? 0,
    collectionCount: (category) => collections[category] ?? 0,
    isCompleted: (id) => completed.has(id),
  };
}

describe("AchievementRuntime — Completion Criteria (AF-042 §Achievement Structure)", () => {
  it("registers all fifteen Achievement Categories", () => {
    expect(ACHIEVEMENT_CATEGORIES.length).toBe(15);
  });

  it("registers four difficulty tiers", () => {
    expect(ACHIEVEMENT_DIFFICULTIES).toEqual(["bronze", "silver", "gold", "platinum"]);
  });

  it("a statThreshold criterion is unsatisfied below target and satisfied at/above it", () => {
    const runtime = new AchievementRuntime(SANDBOX_ACHIEVEMENTS);
    const veteran = SANDBOX_ACHIEVEMENTS.find((a) => a.id === "ach-veteran")!;
    expect(runtime.isSatisfied(veteran, makeReader({ stats: { enemiesDestroyed: 49 } }))).toBe(false);
    expect(runtime.isSatisfied(veteran, makeReader({ stats: { enemiesDestroyed: 50 } }))).toBe(true);
  });

  it("a collectionCount criterion is unsatisfied below target and satisfied at/above it", () => {
    const runtime = new AchievementRuntime(SANDBOX_ACHIEVEMENTS);
    const curator = SANDBOX_ACHIEVEMENTS.find((a) => a.id === "ach-curator")!;
    expect(runtime.isSatisfied(curator, makeReader({ collections: { lore: 1 } }))).toBe(false);
    expect(runtime.isSatisfied(curator, makeReader({ collections: { lore: 2 } }))).toBe(true);
  });

  it("progress never exceeds target even when the underlying stat overshoots", () => {
    const runtime = new AchievementRuntime(SANDBOX_ACHIEVEMENTS);
    const veteran = SANDBOX_ACHIEVEMENTS.find((a) => a.id === "ach-veteran")!;
    const progress = runtime.progress(veteran, makeReader({ stats: { enemiesDestroyed: 9000 } }));
    expect(progress.current).toBe(progress.target);
  });

  it("checkCompletions never returns an already-completed achievement", () => {
    const runtime = new AchievementRuntime(SANDBOX_ACHIEVEMENTS);
    const reader = makeReader({ stats: { enemiesDestroyed: 50 }, completed: ["ach-veteran"] });
    const newlyCompleted = runtime.checkCompletions(reader);
    expect(newlyCompleted.find((a) => a.id === "ach-veteran")).toBeUndefined();
  });

  it("checkCompletions returns a satisfied, not-yet-completed achievement", () => {
    const runtime = new AchievementRuntime(SANDBOX_ACHIEVEMENTS);
    const reader = makeReader({ stats: { enemiesDestroyed: 50 } });
    const newlyCompleted = runtime.checkCompletions(reader);
    expect(newlyCompleted.map((a) => a.id)).toContain("ach-veteran");
  });

  it("every sandbox achievement's reward is a real AF-026 CosmeticRewardKind", () => {
    const validKinds = ["commanderSkin", "shipPaint", "portraitFrame", "title", "codexEntry", "music", "engineTrail", "visualEffect", "bannerCustomisation"];
    for (const achievement of SANDBOX_ACHIEVEMENTS) {
      expect(validKinds).toContain(achievement.reward.kind);
    }
  });

  it("hidden achievements are flagged and carry lore explaining the mystery", () => {
    const hidden = SANDBOX_ACHIEVEMENTS.filter((a) => a.hidden);
    expect(hidden.length).toBeGreaterThan(0);
    for (const achievement of hidden) expect(achievement.lore).not.toBeNull();
  });
});

describe("CollectionLedger — Resources & Ancient Artefacts (AF-042 §Collections)", () => {
  it("registers exactly the two extra collection categories", () => {
    expect(EXTRA_COLLECTION_CATEGORIES).toEqual(["resources", "ancientArtefacts"]);
  });

  it("discover() is idempotent — true only on first discovery", () => {
    const ledger = new CollectionLedger();
    expect(ledger.discover("resources", "crystalFragments")).toBe(true);
    expect(ledger.discover("resources", "crystalFragments")).toBe(false);
    expect(ledger.collectionCount("resources")).toBe(1);
  });

  it("hasDiscovered reflects discovery state per category independently", () => {
    const ledger = new CollectionLedger();
    ledger.discover("resources", "crystalFragments");
    expect(ledger.hasDiscovered("resources", "crystalFragments")).toBe(true);
    expect(ledger.hasDiscovered("ancientArtefacts", "crystalFragments")).toBe(false);
  });

  it("caps the Discovery Log at 50 entries, dropping the oldest", () => {
    const ledger = new CollectionLedger();
    for (let i = 0; i < 60; i += 1) {
      ledger.recordDiscovery({ id: `item-${i}`, category: "lore", atMs: i, missionId: null, biomeId: null, galaxySectorId: null, commanderId: null, shipId: null });
    }
    expect(ledger.recentDiscoveries.length).toBe(50);
    expect(ledger.recentDiscoveries[0]!.id).toBe("item-10");
    expect(ledger.recentDiscoveries.at(-1)!.id).toBe("item-59");
  });

  it("round-trips through toSave/loadSave without losing state", () => {
    const ledger = new CollectionLedger();
    ledger.discover("resources", "crystalFragments");
    ledger.discover("ancientArtefacts", "LORE_LUCENT_GATE_VAULT");
    ledger.recordDiscovery({ id: "x", category: "lore", atMs: 1, missionId: null, biomeId: null, galaxySectorId: null, commanderId: null, shipId: null });
    const saved = ledger.toSave();
    const restored = new CollectionLedger();
    restored.loadSave(saved);
    expect(restored.hasDiscovered("resources", "crystalFragments")).toBe(true);
    expect(restored.hasDiscovered("ancientArtefacts", "LORE_LUCENT_GATE_VAULT")).toBe(true);
    expect(restored.recentDiscoveries.length).toBe(1);
  });
});

describe("Challenge Cadence — registered, optional (AF-042 §Challenge System)", () => {
  it("registers all four cadence kinds", () => {
    expect(CHALLENGE_CADENCE_KINDS).toEqual(["permanent", "daily", "weekly", "seasonal"]);
  });
});

describe("Achievement and Collection Framework — self-review: completing every achievement stays consistent", () => {
  it("every sandbox achievement completes exactly once when its criteria is driven to and past target, across a long randomised sweep", () => {
    const runtime = new AchievementRuntime(SANDBOX_ACHIEVEMENTS);
    const stats: Record<string, number> = {};
    const collections: Record<string, number> = {};
    const completed = new Set<string>();
    const reader: AchievementProgressReader = {
      stat: (key) => stats[key] ?? 0,
      collectionCount: (category) => collections[category] ?? 0,
      isCompleted: (id) => completed.has(id),
    };
    for (let cycle = 0; cycle < 2000; cycle += 1) {
      for (const achievement of SANDBOX_ACHIEVEMENTS) {
        if (achievement.criteria.kind === "statThreshold") {
          stats[achievement.criteria.counterKey] = (stats[achievement.criteria.counterKey] ?? 0) + 1;
        } else {
          collections[achievement.criteria.category] = (collections[achievement.criteria.category] ?? 0) + 1;
        }
      }
      for (const achievement of runtime.checkCompletions(reader)) {
        expect(completed.has(achievement.id)).toBe(false);
        completed.add(achievement.id);
      }
    }
    expect(completed.size).toBe(SANDBOX_ACHIEVEMENTS.length);
  });
});
