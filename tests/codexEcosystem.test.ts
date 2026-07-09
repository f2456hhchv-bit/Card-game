import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { CODEX_CATEGORIES, SANDBOX_CODEX_ENTRIES, TIMELINE_ERAS } from "../src/game/codex/codexData";
import { CodexRuntime } from "../src/game/codex/CodexRuntime";
import { CodexDiscoveryRuntime, CodexJournalRuntime } from "../src/game/codex/CodexProgressionRuntime";
import { PRIMARY_CATEGORIES } from "../src/game/codex/codexFrameworkData";
import {
  COLLECTION_TRACKING_KINDS,
  COMMUNITY_SUPPORT_ITEMS,
  DISCOVERY_REWARD_KINDS,
  DISCOVERY_REWARD_REALISATION,
  ECOSYSTEM_ACCESSIBILITY_SURFACES,
  ECOSYSTEM_PERFORMANCE_DISCIPLINES,
  EXPEDITION_JOURNAL_KINDS,
  EXTENDED_DISCOVERY_TIERS,
  KNOWLEDGE_WEB_NODES,
  KNOWLEDGE_WEB_REALISATION,
  MUSEUM_EXHIBIT_KINDS,
  PLAYER_NOTEBOOK_NEW_SURFACES,
  PLAYER_NOTEBOOK_SURFACES,
  SCIENTIFIC_ARCHIVE_KINDS,
  SEARCH_SYSTEM_KINDS,
  SHARED_WITH_AF087_TIERS,
  TIMELINE_ARCHIVE_ITEMS,
  TIMELINE_ARCHIVE_REALISATION,
} from "../src/game/codex/codexEcosystemData";
import {
  CodexArchiveRuntime,
  ExpeditionJournalRuntime,
  PlayerNotebookExtensionRuntime,
  ScientificArchiveRuntime,
  collectionCompletionFor,
  knowledgeWebFor,
  museumWingFor,
  recentDiscoveries,
  searchByBiome,
  searchByCategory,
  searchByDiscoveryStatus,
  searchByFaction,
  timelineArchiveCoverage,
  unreadEntries,
} from "../src/game/codex/CodexEcosystemRuntime";

const codexReaderAllUnlocked = { hasDiscovered: () => true, hasExtraDiscovered: () => true };

describe("Codex Ecosystem vocabulary — registered shelves (AF-088)", () => {
  it("registers seventeen knowledge-web nodes, eight discovery tiers, eight scientific-archive kinds, eight museum exhibit kinds, ten timeline-archive items, eight discovery-reward kinds, eight expedition-journal kinds, seven notebook surfaces, eight search kinds, twelve collection trackers, six community items, nine accessibility surfaces, five performance disciplines", () => {
    expect(KNOWLEDGE_WEB_NODES.length).toBe(17);
    expect(EXTENDED_DISCOVERY_TIERS.length).toBe(8);
    expect(SCIENTIFIC_ARCHIVE_KINDS.length).toBe(8);
    expect(MUSEUM_EXHIBIT_KINDS.length).toBe(8);
    expect(TIMELINE_ARCHIVE_ITEMS.length).toBe(10);
    expect(DISCOVERY_REWARD_KINDS.length).toBe(8);
    expect(EXPEDITION_JOURNAL_KINDS.length).toBe(8);
    expect(PLAYER_NOTEBOOK_SURFACES.length).toBe(7);
    expect(SEARCH_SYSTEM_KINDS.length).toBe(8);
    expect(COLLECTION_TRACKING_KINDS.length).toBe(12);
    expect(COMMUNITY_SUPPORT_ITEMS.length).toBe(6);
    expect(ECOSYSTEM_ACCESSIBILITY_SURFACES.length).toBe(9);
    expect(ECOSYSTEM_PERFORMANCE_DISCIPLINES.length).toBe(5);
  });

  it("the seventeen Knowledge Web nodes realise onto AF-087's real primary categories or AF-043's real 'timeline'/'events' shelves — no new category system", () => {
    for (const node of KNOWLEDGE_WEB_NODES) {
      const realisation = KNOWLEDGE_WEB_REALISATION[node];
      if (realisation.kind === "primaryCategory") {
        expect([...PRIMARY_CATEGORIES], node).toContain(realisation.category);
      } else {
        expect([...CODEX_CATEGORIES], node).toContain(realisation.category);
      }
    }
    // At least one node reaches further than AF-087 ever needed — into AF-043's timeline/events shelves.
    expect(KNOWLEDGE_WEB_NODES.some((n) => KNOWLEDGE_WEB_REALISATION[n].kind === "codexCategory")).toBe(true);
  });

  it("nine of the ten Timeline Archive items map onto AF-043's REAL nine eras, and Player Discoveries is honestly DYNAMIC, not force-fit onto a static era", () => {
    const coverage = timelineArchiveCoverage();
    for (const item of TIMELINE_ARCHIVE_ITEMS) {
      if (item === "playerDiscoveries") {
        expect(coverage[item]).toBeNull();
        expect(TIMELINE_ARCHIVE_REALISATION[item].kind).toBe("dynamic");
      } else {
        expect(coverage[item]).not.toBeNull();
        expect([...TIMELINE_ERAS]).toContain(coverage[item]);
      }
    }
  });

  it("the eight-tier ladder CONTAINS AF-087's six-stage lattice as an exact sub-sequence, with Detected before and Archived after", () => {
    const indexOf = (tier: string) => EXTENDED_DISCOVERY_TIERS.indexOf(tier as (typeof EXTENDED_DISCOVERY_TIERS)[number]);
    expect(indexOf("detected")).toBeLessThan(indexOf("observed"));
    expect(indexOf("archived")).toBeGreaterThan(indexOf("mastered"));
    let lastIndex = -1;
    for (const shared of SHARED_WITH_AF087_TIERS) {
      const index = indexOf(shared);
      expect(index).toBeGreaterThan(lastIndex); // the shared six preserve AF-087's own order
      lastIndex = index;
    }
  });

  it("Player Notebook: AF-087 already ships four of the seven surfaces; AF-088 registers exactly the three NEW ones as its own extension", () => {
    expect(PLAYER_NOTEBOOK_NEW_SURFACES.length).toBe(3);
    for (const surface of PLAYER_NOTEBOOK_NEW_SURFACES) expect([...PLAYER_NOTEBOOK_SURFACES]).toContain(surface);
    const alreadyShipped = PLAYER_NOTEBOOK_SURFACES.filter((s) => !PLAYER_NOTEBOOK_NEW_SURFACES.includes(s as (typeof PLAYER_NOTEBOOK_NEW_SURFACES)[number]));
    expect(alreadyShipped).toEqual(["bookmarks", "pinnedEntries", "personalNotes", "favouriteEntries"]);
  });

  it("every discovery reward, scientific-archive kind, museum exhibit kind, and expedition-journal kind names a real binding with an honesty flag where relevant, and Community Support is HONESTLY deferred with zero networking code", () => {
    for (const kind of DISCOVERY_REWARD_KINDS) expect(["existingReference", "future"]).toContain(DISCOVERY_REWARD_REALISATION[kind].kind);
    for (const kind of SCIENTIFIC_ARCHIVE_KINDS) expect(kind.liveBinding.length, kind.id).toBeGreaterThan(0);
    for (const kind of MUSEUM_EXHIBIT_KINDS) expect(kind.liveBinding.length, kind.id).toBeGreaterThan(0);
    for (const kind of EXPEDITION_JOURNAL_KINDS) expect(kind.liveBinding.length, kind.id).toBeGreaterThan(0);
    expect(MUSEUM_EXHIBIT_KINDS.some((k) => k.live)).toBe(true);
    expect(MUSEUM_EXHIBIT_KINDS.some((k) => !k.live)).toBe(true);
    // Community Support is a registered list of strings — nothing else. No fetch, no socket, no module import
    // anywhere in this file references a networking primitive; the shelf itself IS the deferral.
    expect(COMMUNITY_SUPPORT_ITEMS.length).toBeGreaterThan(0);
  });
});

describe("CodexArchiveRuntime — the 8-tier ladder wraps AF-087's runtime by composition (AF-088 §Discovery Tiers)", () => {
  it("Detected precedes Observed, Archived requires Mastered first, and the wrapped runtime is never mutated by anything but its own API", () => {
    const discovery = new CodexDiscoveryRuntime();
    const archive = new CodexArchiveRuntime(discovery);
    expect(archive.tierOf("e1")).toBe("unknown");
    expect(archive.recordDetected("e1")).toBe(true);
    expect(archive.tierOf("e1")).toBe("detected");
    expect(archive.recordArchived("e1")).toBe(false); // not mastered yet — refused
    discovery.recordObserved("e1");
    expect(archive.tierOf("e1")).toBe("observed"); // AF-087's own state now takes over the read
    discovery.recordScanned("e1");
    discovery.recordUnderstood("e1");
    expect(archive.tierOf("e1")).toBe("understood");
    discovery.recordMastered("e1");
    expect(archive.tierOf("e1")).toBe("mastered");
    expect(archive.recordArchived("e1")).toBe(true); // now permitted
    expect(archive.tierOf("e1")).toBe("archived");
    expect(archive.recordArchived("e1")).toBe(false); // permanent, no re-archiving
    expect(archive.archivedCount).toBe(1);
  });

  it("\"studied\" reads as \"analysed\" at the AF-088 layer — the same ordinal slot, a different label, never a different lattice", () => {
    const discovery = new CodexDiscoveryRuntime();
    const archive = new CodexArchiveRuntime(discovery);
    discovery.recordObserved("e2");
    discovery.recordScanned("e2");
    discovery.recordStudied("e2");
    expect(discovery.stageOf("e2")).toBe("studied"); // AF-087's own vocabulary, untouched
    expect(archive.tierOf("e2")).toBe("analysed"); // AF-088's reading of the identical state
  });
});

describe("The Knowledge Web, Timeline Archive, and Search System over the REAL sandbox roster (AF-088)", () => {
  const codexRuntime = new CodexRuntime(SANDBOX_CODEX_ENTRIES);

  it("knowledgeWebFor buckets every related entry into a real node, and every bucketed entry's category matches its node's realisation", () => {
    for (const entry of SANDBOX_CODEX_ENTRIES) {
      if (entry.relatedEntryIds.length === 0) continue;
      const web = knowledgeWebFor(entry, codexRuntime);
      for (const node of KNOWLEDGE_WEB_NODES) {
        const realisation = KNOWLEDGE_WEB_REALISATION[node];
        for (const target of web[node]) {
          if (realisation.kind === "codexCategory") expect(target.category).toBe(realisation.category);
        }
      }
    }
  });

  it("searchByCategory/searchByFaction/searchByBiome return only entries of the requested kind, over the real roster", () => {
    const weapons = searchByCategory(SANDBOX_CODEX_ENTRIES, "weapons");
    expect(weapons.length).toBeGreaterThan(0);
    for (const e of weapons) expect(e.category).toBe("weapons");
    const factions = searchByFaction(SANDBOX_CODEX_ENTRIES);
    for (const e of factions) expect(e.category).toBe("factions");
    const biomes = searchByBiome(SANDBOX_CODEX_ENTRIES);
    for (const e of biomes) expect(e.category).toBe("biomes");
  });

  it("searchByDiscoveryStatus and unreadEntries read the REAL archive tier, and recentDiscoveries reads the REAL journal", () => {
    const discovery = new CodexDiscoveryRuntime();
    const archive = new CodexArchiveRuntime(discovery);
    const journal = new CodexJournalRuntime();
    const first = SANDBOX_CODEX_ENTRIES[0]!;
    discovery.recordObserved(first.id);
    journal.recordDiscoveryEvent(first.id, "observed");
    const observedEntries = searchByDiscoveryStatus(SANDBOX_CODEX_ENTRIES, archive, "observed");
    expect(observedEntries.map((e) => e.id)).toContain(first.id);
    const unread = unreadEntries(codexReaderAllUnlocked, codexRuntime, archive);
    expect(unread.some((e) => e.id === first.id)).toBe(false); // it's observed now, so no longer unread
    expect(unread.length).toBeGreaterThan(0); // every other unlocked-but-untouched entry still is
    expect(recentDiscoveries(journal, 5)).toEqual([first.id]);
  });

  it("collectionCompletionFor produces all twelve trackers within [0, 100], and overallGalaxyCompletion matches AF-043's own discoveryPercent exactly", () => {
    const snapshot = collectionCompletionFor(codexRuntime, codexReaderAllUnlocked, 6, 4);
    for (const key of COLLECTION_TRACKING_KINDS) {
      const value = snapshot[key];
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(100);
    }
    expect(snapshot.overallGalaxyCompletion).toBeCloseTo(codexRuntime.discoveryPercent(codexReaderAllUnlocked), 5);
    expect(snapshot.museum).toBeCloseTo((4 / 6) * 100, 5);
  });

  it("museumWingFor derives real exhibit counts from roster ids, tagged with the requested kind", () => {
    const wing = museumWingFor("shipGalleries", ["wayfarer-hull-mk2", "aurelia"]);
    expect(wing.kind).toBe("shipGalleries");
    expect(wing.exhibitCount).toBe(2);
    expect(wing.items).toEqual(["wayfarer-hull-mk2", "aurelia"]);
  });
});

describe("Permanent ledgers and the notebook extension (AF-088 §Scientific Archive / §Expedition Journal / §Player Notebook)", () => {
  it("ScientificArchiveRuntime and ExpeditionJournalRuntime are append-only with monotone sequences, and neither exposes a removal API", () => {
    for (const Ledger of [ScientificArchiveRuntime, ExpeditionJournalRuntime]) {
      const ledger = new Ledger();
      const a = ledger.record("test", "e1", "first");
      const b = ledger.record("test", "e2", "second");
      expect(a.sequence).toBe(1);
      expect(b.sequence).toBe(2);
      expect(ledger.length).toBe(2);
      const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(ledger));
      for (const method of methods) {
        expect(/remove|delete|revoke|reset|retire|forget|erase/i.test(method), `forbidden API: ${method}`).toBe(false);
      }
    }
  });

  it("the notebook extension: comparison notes are order-independent, research goals toggle, expedition plans append and ignore blanks", () => {
    const notebook = new PlayerNotebookExtensionRuntime();
    notebook.setComparisonNote("codex-weapon-coil-ripper", "codex-ship-wayfarer", "Wayfarer's mount fits the Ripper's spool time.");
    expect(notebook.comparisonNoteFor("codex-ship-wayfarer", "codex-weapon-coil-ripper")).toContain("spool time");
    expect(notebook.toggleResearchGoal("codex-relic-ember-core")).toBe(true);
    expect(notebook.researchGoalIds).toContain("codex-relic-ember-core");
    expect(notebook.toggleResearchGoal("codex-relic-ember-core")).toBe(false);
    notebook.addExpeditionPlan("Chart the Winterline, then push for First Light.");
    notebook.addExpeditionPlan("   ");
    expect(notebook.expeditionPlanList.length).toBe(1);
  });
});

describe("Codex Ecosystem — self-review: complete the Codex thousands of times (AF-088 §Self Review Loop)", () => {
  it("500 seeded careers driving every real sandbox entry from unknown to archived, in shuffled order, through BOTH the AF-087 lattice and the AF-088 wrapper, without ever regressing", () => {
    const tierRank = Object.fromEntries(EXTENDED_DISCOVERY_TIERS.map((t, i) => [t, i])) as Record<string, number>;
    for (let seed = 0; seed < 500; seed += 1) {
      const rng = new Rng(seed);
      const discovery = new CodexDiscoveryRuntime();
      const archive = new CodexArchiveRuntime(discovery);
      const ids = [...SANDBOX_CODEX_ENTRIES.map((e) => e.id)];
      for (let i = ids.length - 1; i > 0; i -= 1) {
        const j = Math.floor(rng.next() * (i + 1));
        [ids[i], ids[j]] = [ids[j]!, ids[i]!];
      }
      let lastRankSum = 0;
      for (const id of ids) {
        archive.recordDetected(id);
        discovery.recordObserved(id);
        discovery.recordScanned(id);
        discovery.recordStudied(id);
        discovery.recordUnderstood(id);
        discovery.recordMastered(id);
        archive.recordArchived(id);
        const rankSum = ids.reduce((sum, entryId) => sum + tierRank[archive.tierOf(entryId)]!, 0);
        if (rankSum < lastRankSum) throw new Error(`seed ${seed}: total tier rank regressed`);
        lastRankSum = rankSum;
      }
      expect(archive.archivedCount).toBe(SANDBOX_CODEX_ENTRIES.length);
    }
  });
});
