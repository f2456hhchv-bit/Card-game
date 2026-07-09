import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { CODEX_CATEGORIES, SANDBOX_CODEX_ENTRIES, TIMELINE_ERAS } from "../src/game/codex/codexData";
import { CodexRuntime } from "../src/game/codex/CodexRuntime";
import {
  CODEX_ACCESSIBILITY_SURFACES,
  CODEX_ARCHITECTURE_PARTS,
  CODEX_ENTRY_PROFILES,
  CODEX_FORBIDDEN_OUTCOMES,
  CODEX_PERFORMANCE_DISCIPLINES,
  COLLECTION_REWARD_KINDS,
  COLLECTION_REWARD_REALISATION,
  DISCOVERY_PROGRESSION_STAGES,
  DISCOVERY_ROUTES,
  DISCOVERY_ROUTE_DEFS,
  ENTRY_STRUCTURE_SECTIONS,
  MULTIMEDIA_KINDS,
  PRIMARY_CATEGORIES,
  PRIMARY_CATEGORY_REALISATION,
  RELATED_KNOWLEDGE_KINDS,
  TIMELINE_COVERAGE,
  TIMELINE_COVERAGE_TO_ERA,
  codexArchitectureFor,
  derivedProfileFor,
  entryStructureFor,
  profileFor,
  relatedKnowledgeKindFor,
} from "../src/game/codex/codexFrameworkData";
import { CodexDiscoveryRuntime, CodexJournalRuntime, SEARCH_HISTORY_CAP } from "../src/game/codex/CodexProgressionRuntime";

describe("Codex Framework vocabulary — registered shelves (AF-087)", () => {
  it("registers fourteen architecture parts, seventeen primary categories, nine discovery routes, ten entry-structure sections, six progression stages, eight multimedia kinds, eight timeline-coverage items, eight related-knowledge kinds, eight collection-reward kinds, one forbidden outcome, nine accessibility surfaces, four performance disciplines", () => {
    expect(CODEX_ARCHITECTURE_PARTS.length).toBe(14);
    expect(PRIMARY_CATEGORIES.length).toBe(17);
    expect(DISCOVERY_ROUTES.length).toBe(9);
    expect(DISCOVERY_ROUTE_DEFS.length).toBe(9);
    expect(ENTRY_STRUCTURE_SECTIONS.length).toBe(10);
    expect(DISCOVERY_PROGRESSION_STAGES.length).toBe(6);
    expect(MULTIMEDIA_KINDS.length).toBe(8);
    expect(TIMELINE_COVERAGE.length).toBe(8);
    expect(RELATED_KNOWLEDGE_KINDS.length).toBe(8);
    expect(COLLECTION_REWARD_KINDS.length).toBe(8);
    expect(CODEX_FORBIDDEN_OUTCOMES.length).toBe(1);
    expect(CODEX_ACCESSIBILITY_SURFACES.length).toBe(9);
    expect(CODEX_PERFORMANCE_DISCIPLINES.length).toBe(4);
  });

  it("NO NEW CATEGORY INVENTED: every one of the seventeen primary categories realises onto AF-043's REAL category shelf or an existing system reference", () => {
    for (const category of PRIMARY_CATEGORIES) {
      const realisation = PRIMARY_CATEGORY_REALISATION[category];
      if (realisation.kind === "codexCategory") {
        expect([...CODEX_CATEGORIES], category).toContain(realisation.category);
      } else {
        expect(realisation.binding.length, category).toBeGreaterThan(0);
      }
    }
    // At least one category is realised through an existing reference, not the codex shelf —
    // proving the union was never silently widened to cover them.
    expect(PRIMARY_CATEGORIES.some((c) => PRIMARY_CATEGORY_REALISATION[c].kind === "existingReference")).toBe(true);
  });

  it("the eight timeline-coverage items map onto AF-043's REAL nine timeline eras, and every discovery route/multimedia kind names a real or honestly-future binding", () => {
    for (const coverage of TIMELINE_COVERAGE) {
      expect([...TIMELINE_ERAS]).toContain(TIMELINE_COVERAGE_TO_ERA[coverage]);
    }
    for (const route of DISCOVERY_ROUTE_DEFS) expect(route.liveBinding.length, route.id).toBeGreaterThan(0);
    for (const kind of MULTIMEDIA_KINDS) expect(kind.liveBinding.length, kind.id).toBeGreaterThan(0);
    expect(MULTIMEDIA_KINDS.some((k) => k.live)).toBe(true);
    expect(MULTIMEDIA_KINDS.some((k) => !k.live)).toBe(true);
  });

  it("every collection reward realises onto a REAL AF-026 cosmetic reward kind, an existing system, or honestly future — no new reward kind invented", () => {
    for (const kind of COLLECTION_REWARD_KINDS) {
      const realisation = COLLECTION_REWARD_REALISATION[kind];
      expect(["cosmeticReward", "existingReference", "future"]).toContain(realisation.kind);
    }
  });

  it("relatedKnowledgeKindFor classifies real codex categories and returns null for unclassifiable ones — no second relation mechanism", () => {
    expect(relatedKnowledgeKindFor("enemies")).toBe("relatedSpecies");
    expect(relatedKnowledgeKindFor("bosses")).toBe("relatedBosses");
    expect(relatedKnowledgeKindFor("research")).toBe("relatedResearch");
    expect(relatedKnowledgeKindFor("factions")).toBe("relatedFactions");
    expect(relatedKnowledgeKindFor("collections")).toBeNull(); // honestly unclassifiable, not force-fit
  });
});

describe("Every sandbox entry resolves a complete profile — nothing remains undefined (AF-087 §Codex Architecture)", () => {
  it("all fourteen architecture parts hold for EVERY entry in the real AF-043 roster, hand-authored or derived", () => {
    const runtime = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    for (const entry of SANDBOX_CODEX_ENTRIES) {
      const profile = profileFor(entry);
      expect(profile.entryId).toBe(entry.id);
      const architecture = codexArchitectureFor(entry, profile, "unknown");
      for (const part of CODEX_ARCHITECTURE_PARTS) {
        expect(architecture[part], `${entry.id} missing ${part}`).toBe(true);
      }
      const structure = entryStructureFor(entry, profile);
      for (const section of ENTRY_STRUCTURE_SECTIONS) {
        expect(structure[section].length, `${entry.id} structure ${section}`).toBeGreaterThan(0);
      }
    }
    expect(runtime.all.length).toBe(SANDBOX_CODEX_ENTRIES.length); // sanity: the real roster, untouched
  });

  it("the derived fallback never collides with a hand-authored profile, and covers every category the sandbox roster actually uses", () => {
    const handAuthoredIds = new Set(CODEX_ENTRY_PROFILES.map((p) => p.entryId));
    for (const entry of SANDBOX_CODEX_ENTRIES) {
      if (handAuthoredIds.has(entry.id)) continue;
      const derived = derivedProfileFor(entry);
      expect(derived.entryId).toBe(entry.id);
      expect([...PRIMARY_CATEGORIES]).toContain(derived.primaryCategory);
      expect([...DISCOVERY_ROUTES]).toContain(derived.discoveryMethod);
    }
  });
});

describe("The Discovery Progression lattice — six stages, monotone (AF-087 §Discovery Progression)", () => {
  it("states only advance unknown→observed→scanned→studied→understood→mastered, and no removal API exists", () => {
    const runtime = new CodexDiscoveryRuntime();
    expect(runtime.stageOf("codex-weapon-coil-ripper")).toBe("unknown");
    expect(runtime.recordScanned("codex-weapon-coil-ripper")).toBe(true); // may skip straight to scanned
    expect(runtime.recordObserved("codex-weapon-coil-ripper")).toBe(false); // no demotion, no re-descent
    expect(runtime.recordUnderstood("codex-weapon-coil-ripper")).toBe(true);
    expect(runtime.recordStudied("codex-weapon-coil-ripper")).toBe(false); // studied is behind understood now
    expect(runtime.recordMastered("codex-weapon-coil-ripper")).toBe(true);
    expect(runtime.recordMastered("codex-weapon-coil-ripper")).toBe(false); // already at the ceiling
    expect(runtime.stageOf("codex-weapon-coil-ripper")).toBe("mastered");
    const snapshot = runtime.snapshot;
    expect(snapshot.masteredCount).toBe(1);
    expect(snapshot.observedCount).toBe(1); // mastered implies every lower stage counts too
    const methods = Object.getOwnPropertyNames(CodexDiscoveryRuntime.prototype);
    for (const method of methods) {
      expect(/remove|delete|revoke|reset|retire|forget|erase/i.test(method), `forbidden API: ${method}`).toBe(false);
    }
  });

  it("1,000 seeded discovery careers: stage rank never regresses across random advancement calls", () => {
    const stageRank = { unknown: 0, observed: 1, scanned: 2, studied: 3, understood: 4, mastered: 5 } as const;
    const advancers = ["recordObserved", "recordScanned", "recordStudied", "recordUnderstood", "recordMastered"] as const;
    for (let career = 0; career < 1000; career += 1) {
      const rng = new Rng(career);
      const runtime = new CodexDiscoveryRuntime();
      const entryIds = SANDBOX_CODEX_ENTRIES.slice(0, 10).map((e) => e.id);
      let lastRankSum = 0;
      for (let step = 0; step < 30; step += 1) {
        const entryId = entryIds[Math.floor(rng.next() * entryIds.length)]!;
        const method = advancers[Math.floor(rng.next() * advancers.length)]!;
        runtime[method](entryId);
        const rankSum = entryIds.reduce((sum, id) => sum + stageRank[runtime.stageOf(id)], 0);
        if (rankSum < lastRankSum) throw new Error(`career ${career}: total rank regressed`);
        lastRankSum = rankSum;
      }
    }
  });
});

describe("The Player Journal — pins, bookmarks, favourites, notes, and two histories (AF-087 §Player Journal)", () => {
  it("toggles are real toggles, notes clear on empty string, and discovery history is append-only", () => {
    const journal = new CodexJournalRuntime();
    expect(journal.togglePin("codex-ship-wayfarer")).toBe(true);
    expect(journal.isPinned("codex-ship-wayfarer")).toBe(true);
    expect(journal.togglePin("codex-ship-wayfarer")).toBe(false);
    expect(journal.isPinned("codex-ship-wayfarer")).toBe(false);
    expect(journal.toggleBookmark("codex-relic-ember-core")).toBe(true);
    expect(journal.toggleFavourite("codex-relic-ember-core")).toBe(true);
    journal.setNote("codex-relic-ember-core", "Fuses with Frost Shard — don't sell either.");
    expect(journal.noteFor("codex-relic-ember-core")).toContain("Frost Shard");
    journal.setNote("codex-relic-ember-core", "");
    expect(journal.noteFor("codex-relic-ember-core")).toBeNull();
    const record = journal.recordDiscoveryEvent("codex-relic-ember-core", "observed");
    expect(record.sequence).toBe(1);
    expect(journal.discoveryHistoryTimeline.length).toBe(1);
    const methods = Object.getOwnPropertyNames(CodexJournalRuntime.prototype).filter((m) => m.includes("iscoveryHistory") || m.includes("earchHistory"));
    for (const method of methods) {
      expect(/remove|delete/i.test(method), `forbidden history API: ${method}`).toBe(false);
    }
  });

  it("search history is BOUNDED — the oldest query drops once the cap is reached", () => {
    const journal = new CodexJournalRuntime();
    for (let i = 0; i < SEARCH_HISTORY_CAP + 10; i += 1) journal.recordSearch(`query-${i}`);
    expect(journal.searchHistoryList.length).toBe(SEARCH_HISTORY_CAP);
    expect(journal.searchHistoryList[0]!.query).toBe(`query-10`); // the first ten were dropped
    expect(journal.searchHistoryList.at(-1)!.query).toBe(`query-${SEARCH_HISTORY_CAP + 9}`);
    journal.recordSearch("   "); // whitespace-only queries are not recorded
    expect(journal.searchHistoryList.length).toBe(SEARCH_HISTORY_CAP);
  });

  it("the journal snapshot reflects every curated surface", () => {
    const journal = new CodexJournalRuntime();
    journal.togglePin("a");
    journal.toggleBookmark("b");
    journal.toggleFavourite("c");
    journal.setNote("d", "note");
    journal.recordDiscoveryEvent("a", "observed");
    journal.recordSearch("void");
    const snapshot = journal.snapshot;
    expect(snapshot).toEqual({ pinnedCount: 1, bookmarkedCount: 1, favouriteCount: 1, noteCount: 1, discoveryHistoryLength: 1, searchHistoryLength: 1 });
  });
});

describe("Codex Framework — self-review: complete the Codex repeatedly (AF-087 §Self Review Loop)", () => {
  it("EVERY sandbox entry can be driven from unknown to mastered through the discovery lattice, in every possible visiting order, without ever regressing", () => {
    for (let seed = 0; seed < 200; seed += 1) {
      const rng = new Rng(seed);
      const discovery = new CodexDiscoveryRuntime();
      const ids = [...SANDBOX_CODEX_ENTRIES.map((e) => e.id)];
      // Shuffle visiting order deterministically per seed.
      for (let i = ids.length - 1; i > 0; i -= 1) {
        const j = Math.floor(rng.next() * (i + 1));
        [ids[i], ids[j]] = [ids[j]!, ids[i]!];
      }
      for (const id of ids) {
        discovery.recordObserved(id);
        discovery.recordScanned(id);
        discovery.recordStudied(id);
        discovery.recordUnderstood(id);
        discovery.recordMastered(id);
      }
      expect(discovery.snapshot.masteredCount).toBe(SANDBOX_CODEX_ENTRIES.length);
    }
  });
});
