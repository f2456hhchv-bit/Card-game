import { describe, expect, it } from "vitest";
import { CodexRuntime, type CodexUnlockReader } from "../src/game/codex/CodexRuntime";
import { CODEX_CATEGORIES, SANDBOX_CODEX_ENTRIES, TIMELINE_ERAS } from "../src/game/codex/codexData";

function makeReader(discovered: Array<[string, string]> = [], extraDiscovered: Array<[string, string]> = []): CodexUnlockReader {
  const set = new Set(discovered.map(([c, id]) => `${c}:${id}`));
  const extraSet = new Set(extraDiscovered.map(([c, id]) => `${c}:${id}`));
  return {
    hasDiscovered: (category, id) => set.has(`${category}:${id}`),
    hasExtraDiscovered: (category, id) => extraSet.has(`${category}:${id}`),
  };
}

describe("CodexRuntime — unlock references introduce zero new mechanism (AF-043 §Discovery Rules)", () => {
  it("alwaysUnlocked entries are unlocked with no discoveries at all", () => {
    const runtime = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const galaxyHistory = runtime.findEntry("codex-galaxy-history")!;
    expect(runtime.isUnlocked(galaxyHistory, makeReader())).toBe(true);
  });

  it("a collection-gated entry is locked until MetaProgression's own discovery is recorded", () => {
    const runtime = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const boss = runtime.findEntry("codex-boss-hollow-sentinel")!;
    expect(runtime.isUnlocked(boss, makeReader())).toBe(false);
    expect(runtime.isUnlocked(boss, makeReader([["bosses", "hollow-sentinel"]]))).toBe(true);
  });

  it("an extraCollection-gated entry reads CollectionLedger's own discovery, not MetaProgression's", () => {
    const runtime = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const resource = runtime.findEntry("codex-resource-crystal-fragments")!;
    expect(runtime.isUnlocked(resource, makeReader())).toBe(false);
    expect(runtime.isUnlocked(resource, makeReader([], [["resources", "crystalFragments"]]))).toBe(true);
  });

  it("every entry with a real reference in the sandbox roster is reachable by a real, plausible id", () => {
    for (const entry of SANDBOX_CODEX_ENTRIES) {
      if (entry.unlock.kind === "alwaysUnlocked") continue;
      expect(entry.unlock.id.length).toBeGreaterThan(0);
    }
  });
});

describe("CodexRuntime — Codex Structure & content coverage (AF-043 §Codex Structure)", () => {
  it("registers all twenty Codex categories", () => {
    expect(CODEX_CATEGORIES.length).toBe(20);
  });

  it("registers all nine Timeline eras in spec order", () => {
    expect(TIMELINE_ERAS).toEqual([
      "ancientCivilisations",
      "theCollapse",
      "theAfterlightEvent",
      "humanExpansion",
      "machineEvolution",
      "crystalAscension",
      "voidIncursions",
      "modernEra",
      "futureDiscoveries",
    ]);
  });

  it("every registered category has at least one sandbox entry", () => {
    const runtime = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    for (const category of CODEX_CATEGORIES) {
      expect(runtime.entriesByCategory(category).length).toBeGreaterThan(0);
    }
  });

  it("no two entries share an id", () => {
    const ids = SANDBOX_CODEX_ENTRIES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("CodexRuntime — Timeline (AF-043 §Timeline)", () => {
  it("returns unlocked Timeline entries ordered by timelinePosition", () => {
    const runtime = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const entries = runtime.timeline(makeReader());
    expect(entries.length).toBe(TIMELINE_ERAS.length);
    for (let i = 1; i < entries.length; i += 1) {
      expect(entries[i]!.timelinePosition!).toBeGreaterThan(entries[i - 1]!.timelinePosition!);
    }
  });
});

describe("CodexRuntime — Interconnected Knowledge & Missing Links (AF-043 §Interconnected Knowledge / §DEBUG)", () => {
  it("has zero Missing Links across the sandbox roster", () => {
    const runtime = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    expect(runtime.missingLinkCount()).toBe(0);
  });

  it("detects a Missing Link when one is deliberately introduced", () => {
    const broken = [...SANDBOX_CODEX_ENTRIES, {
      ...SANDBOX_CODEX_ENTRIES[0]!,
      id: "codex-test-broken",
      relatedEntryIds: ["codex-does-not-exist"],
    }];
    const runtime = new CodexRuntime(broken);
    expect(runtime.missingLinkCount()).toBe(1);
  });

  it("relatedEntries resolves only entries that actually exist", () => {
    const runtime = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const boss = runtime.findEntry("codex-boss-hollow-sentinel")!;
    const related = runtime.relatedEntries(boss);
    expect(related.length).toBe(boss.relatedEntryIds.length);
  });
});

describe("CodexRuntime — Discovery % (AF-043 §DEBUG)", () => {
  it("is 0% with no discoveries beyond alwaysUnlocked entries counted proportionally", () => {
    const runtime = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const percent = runtime.discoveryPercent(makeReader());
    const alwaysUnlockedCount = SANDBOX_CODEX_ENTRIES.filter((e) => e.unlock.kind === "alwaysUnlocked").length;
    expect(percent).toBeCloseTo((alwaysUnlockedCount / SANDBOX_CODEX_ENTRIES.length) * 100, 5);
  });

  it("reaches 100% once every entry's discovery is satisfied", () => {
    const runtime = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const discovered: Array<[string, string]> = [];
    const extraDiscovered: Array<[string, string]> = [];
    for (const entry of SANDBOX_CODEX_ENTRIES) {
      if (entry.unlock.kind === "collection") discovered.push([entry.unlock.category, entry.unlock.id]);
      if (entry.unlock.kind === "extraCollection") extraDiscovered.push([entry.unlock.category, entry.unlock.id]);
    }
    expect(runtime.discoveryPercent(makeReader(discovered, extraDiscovered))).toBe(100);
  });
});

describe("CodexRuntime — Search (AF-043 §Search)", () => {
  it("returns nothing for an empty query", () => {
    const runtime = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    expect(runtime.search("", makeReader())).toEqual([]);
  });

  it("matches by partial, case-insensitive title", () => {
    const runtime = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const results = runtime.search("SENTINEL", makeReader([["bosses", "hollow-sentinel"]]));
    expect(results.map((e) => e.id)).toContain("codex-boss-hollow-sentinel");
  });

  it("never returns a locked entry, even on an exact title match", () => {
    const runtime = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const results = runtime.search("hollow sentinel", makeReader());
    expect(results.map((e) => e.id)).not.toContain("codex-boss-hollow-sentinel");
  });
});

describe("CodexRuntime — Section Completion (AF-043 §Discovery Rewards)", () => {
  it("does not report a section complete until every entry in it is unlocked", () => {
    const runtime = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const completions = runtime.checkSectionCompletions(makeReader(), () => false);
    expect(completions).not.toContain("factions");
  });

  it("reports a section complete once every entry in it is unlocked", () => {
    const runtime = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const discovered: Array<[string, string]> = [
      ["lore", "LORE_CRYSTAL_DOMINION_CODEX"],
      ["lore", "LORE_MACHINE_COLLECTIVE_CODEX"],
      ["lore", "LORE_HUMAN_ALLIANCE_CODEX"],
      ["lore", "LORE_MERCENARY_GUILD_CODEX"], // AF-046 added a fourth faction entry
    ];
    const completions = runtime.checkSectionCompletions(makeReader(discovered), () => false);
    expect(completions).toContain("factions");
  });

  it("never re-reports a section the caller has already recorded as complete", () => {
    const runtime = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const completions = runtime.checkSectionCompletions(makeReader(), (category) => category === "galaxyHistory");
    expect(completions).not.toContain("galaxyHistory");
  });
});

describe("Codex — self-review: unlocking every entry stays consistent", () => {
  it("survives unlocking every entry one at a time without ever double-reporting a section complete", () => {
    const runtime = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const discovered: Array<[string, string]> = [];
    const extraDiscovered: Array<[string, string]> = [];
    const completedSections = new Set<string>();
    const gatedEntries = SANDBOX_CODEX_ENTRIES.filter((e) => e.unlock.kind !== "alwaysUnlocked");
    for (const entry of gatedEntries) {
      if (entry.unlock.kind === "collection") discovered.push([entry.unlock.category, entry.unlock.id]);
      if (entry.unlock.kind === "extraCollection") extraDiscovered.push([entry.unlock.category, entry.unlock.id]);
      const reader = makeReader(discovered, extraDiscovered);
      for (const category of runtime.checkSectionCompletions(reader, (c) => completedSections.has(c))) {
        expect(completedSections.has(category)).toBe(false);
        completedSections.add(category);
      }
    }
    const finalReader = makeReader(discovered, extraDiscovered);
    expect(runtime.discoveryPercent(finalReader)).toBe(100);
    expect(runtime.missingLinkCount()).toBe(0);
  });
});
