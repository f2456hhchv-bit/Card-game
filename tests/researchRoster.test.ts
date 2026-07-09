import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { ResearchTree } from "../src/game/research/ResearchTree";
import {
  FRAMEWORK_RESEARCH_TREE,
  RESEARCH_ARCHITECTURE_PARTS,
  RESEARCH_LABORATORIES,
  RESEARCH_PROJECT_PROFILES,
  SCIENTIFIC_DISCIPLINES,
  researchArchitectureFor,
} from "../src/game/research/researchFrameworkData";
import { researchNodeCostFor } from "../src/game/endgame/endgameData";
import {
  ANCIENT_RESEARCH_UNLOCKS,
  DISCOVERY_NETWORK_SOURCES,
  EXPERIMENTAL_RESEARCH_TRAITS,
  GALACTIC_SCIENCE_SURFACES,
  INFINITE_RESEARCH_KINDS,
  RESEARCH_ROSTER_COLLECTION_KINDS,
  RESEARCH_ROSTER_DISCIPLINES,
  RESEARCH_ROSTER_ENTRIES,
  RESEARCH_TIERS,
  ROSTER_DISCIPLINE_TO_AF081,
  ROSTER_LABORATORIES,
  ROSTER_LAB_TO_AF081_LAB,
  ROSTER_RESEARCH_FORBIDDEN_OUTCOMES,
  ROSTER_RESEARCH_PROFILES,
  ROSTER_RESEARCH_TREE,
  SCIENTIFIC_ARCHIVE_FEATURES,
  SCIENTIFIC_PHILOSOPHY_SURFACES,
  infiniteResearchProjectFor,
  scientificArchiveFor,
} from "../src/game/research/researchRosterData";

const KNOWN_IDS = new Set(ROSTER_RESEARCH_TREE.map((n) => n.id));

function defFor(nodeId: string) {
  return ROSTER_RESEARCH_TREE.find((n) => n.id === nodeId)!;
}
function profileFor(nodeId: string) {
  return ROSTER_RESEARCH_PROFILES.find((p) => p.nodeId === nodeId)!;
}

describe("Research Roster vocabulary — registered shelves (AF-082)", () => {
  it("registers fifteen disciplines, eight tiers, eight philosophy surfaces, nine network sources, nine laboratories, seven galactic surfaces, six experimental traits, seven ancient unlocks, seven infinite kinds, eight collection kinds, seven archive features, two forbidden outcomes", () => {
    expect(RESEARCH_ROSTER_DISCIPLINES.length).toBe(15);
    expect(RESEARCH_TIERS.length).toBe(8);
    expect(SCIENTIFIC_PHILOSOPHY_SURFACES.length).toBe(8);
    expect(DISCOVERY_NETWORK_SOURCES.length).toBe(9);
    expect(ROSTER_LABORATORIES.length).toBe(9);
    expect(GALACTIC_SCIENCE_SURFACES.length).toBe(7);
    expect(EXPERIMENTAL_RESEARCH_TRAITS.length).toBe(6);
    expect(ANCIENT_RESEARCH_UNLOCKS.length).toBe(7);
    expect(INFINITE_RESEARCH_KINDS.length).toBe(7);
    expect(RESEARCH_ROSTER_COLLECTION_KINDS.length).toBe(8);
    expect(SCIENTIFIC_ARCHIVE_FEATURES.length).toBe(7);
    expect(ROSTER_RESEARCH_FORBIDDEN_OUTCOMES.length).toBe(2);
  });

  it("the fifteen disciplines map TOTALLY onto AF-081's ten, and the nine laboratories onto AF-081's eight-lab register — no second register", () => {
    for (const discipline of RESEARCH_ROSTER_DISCIPLINES) {
      expect([...SCIENTIFIC_DISCIPLINES]).toContain(ROSTER_DISCIPLINE_TO_AF081[discipline]);
    }
    for (const lab of ROSTER_LABORATORIES) {
      expect(RESEARCH_LABORATORIES.some((l) => l.id === ROSTER_LAB_TO_AF081_LAB[lab]), lab).toBe(true);
    }
  });
});

describe("The roster tree — AF-024/081 untouched, four projects added (AF-082)", () => {
  it("eighteen projects: the locked fourteen head the tree unchanged; the additions produce THREE first-producer categories and pass the real engine's validation", () => {
    expect(ROSTER_RESEARCH_TREE.length).toBe(18);
    expect(ROSTER_RESEARCH_TREE.slice(0, FRAMEWORK_RESEARCH_TREE.length)).toEqual(FRAMEWORK_RESEARCH_TREE);
    for (const category of ["droneEngineering", "commanderDevelopment", "voidResearch"] as const) {
      expect(FRAMEWORK_RESEARCH_TREE.some((n) => n.category === category), `${category} already produced`).toBe(false);
      expect(ROSTER_RESEARCH_TREE.some((n) => n.category === category), `${category} still empty`).toBe(true);
    }
    expect(() => new ResearchTree(ROSTER_RESEARCH_TREE)).not.toThrow();
  });

  it("SCIENCE CREATES GAMEPLAY, NOT NUMBERS: every AF-082 project is pure gameplay, and the tree's numeric-effect count is UNCHANGED by this module", () => {
    const additions = ROSTER_RESEARCH_TREE.slice(FRAMEWORK_RESEARCH_TREE.length);
    expect(additions.length).toBe(4);
    for (const def of additions) {
      expect(def.effect === null || def.effect.kind === "unlockFlag", `${def.id} added a number`).toBe(true);
      expect(def.completionTimeMs).toBe(0); // DR-005 holds for every future project too
    }
    const numericCount = (defs: readonly (typeof additions)[number][]) =>
      defs.filter((d) => d.effect !== null && d.effect.kind !== "unlockFlag").length;
    expect(numericCount([...ROSTER_RESEARCH_TREE])).toBe(numericCount([...FRAMEWORK_RESEARCH_TREE]));
  });

  it("every addition carries a complete AF-081 profile through the unchanged twelve-part architecture", () => {
    expect(ROSTER_RESEARCH_PROFILES.length).toBe(18);
    expect(ROSTER_RESEARCH_PROFILES.slice(0, RESEARCH_PROJECT_PROFILES.length)).toEqual(RESEARCH_PROJECT_PROFILES);
    for (const profile of ROSTER_RESEARCH_PROFILES) {
      const architecture = researchArchitectureFor(defFor(profile.nodeId), profile, KNOWN_IDS);
      for (const part of RESEARCH_ARCHITECTURE_PARTS) {
        expect(architecture[part], `${profile.nodeId} missing ${part}`).toBe(true);
      }
    }
  });
});

describe("Roster entries — identity only, bound three layers deep (AF-082)", () => {
  it("every project has an entry; the laboratory equality law holds (spec lab → AF-081 lab === the profile's lab); tiers and sources resolve; no stat field exists", () => {
    expect(RESEARCH_ROSTER_ENTRIES.length).toBe(ROSTER_RESEARCH_TREE.length);
    for (const entry of RESEARCH_ROSTER_ENTRIES) {
      const profile = profileFor(entry.nodeId);
      expect(profile, entry.nodeId).toBeDefined();
      expect(ROSTER_LAB_TO_AF081_LAB[entry.laboratory], `${entry.nodeId} lab equality`).toBe(profile.laboratoryId);
      expect([...RESEARCH_ROSTER_DISCIPLINES]).toContain(entry.discipline);
      expect([...RESEARCH_TIERS]).toContain(entry.tier);
      expect([...DISCOVERY_NETWORK_SOURCES]).toContain(entry.networkSource);
      expect([...SCIENTIFIC_PHILOSOPHY_SURFACES]).toContain(entry.philosophySurface);
      expect(Object.keys(entry).sort()).toEqual(["discipline", "laboratory", "networkSource", "nodeId", "philosophySurface", "tier"]);
    }
    // Knowledge comes from PLAYING the game — the network draws on many sources, not one.
    expect(new Set(RESEARCH_ROSTER_ENTRIES.map((e) => e.networkSource)).size).toBeGreaterThanOrEqual(6);
  });

  it("TIER AFFECTS OPPORTUNITY, NEVER NUMBERS: six tiers carry projects; legendary and transcendent are honestly registered-empty", () => {
    const used = new Set(RESEARCH_ROSTER_ENTRIES.map((e) => e.tier));
    for (const tier of ["foundation", "applied", "advanced", "experimental", "prototype", "ancient"] as const) {
      expect(used.has(tier), `${tier} unused`).toBe(true);
    }
    expect(used.has("legendary")).toBe(false); // awaiting content — registered, never faked
    expect(used.has("transcendent")).toBe(false);
  });
});

describe("The Scientific Archive — derivation, not a system (AF-082 §Scientific Archive)", () => {
  it("scientificArchiveFor yields a non-empty exhibit for every project across all seven features", () => {
    for (const entry of RESEARCH_ROSTER_ENTRIES) {
      const archive = scientificArchiveFor(defFor(entry.nodeId), profileFor(entry.nodeId), entry);
      for (const feature of SCIENTIFIC_ARCHIVE_FEATURES) {
        expect(archive[feature].length, `${entry.nodeId} archive ${feature}`).toBeGreaterThan(0);
      }
    }
  });
});

describe("Infinite research — AF-069's real cost engine (AF-082 §Infinite Research)", () => {
  it("one hundred infinite projects: distinct ids, all seven kinds cycling, costs riding the REAL geometric ladder and never flattening", () => {
    const ids = new Set<string>();
    const kinds = new Set<string>();
    for (let n = 0; n < 100; n += 1) {
      const project = infiniteResearchProjectFor(n);
      ids.add(project.id);
      kinds.add(project.kind);
      expect(project.cost).toBe(researchNodeCostFor(n)); // AF-069's engine, exactly
      expect(project.description.length).toBeGreaterThan(0);
      if (n > 0) expect(project.cost).toBeGreaterThanOrEqual(infiniteResearchProjectFor(n - 1).cost);
    }
    expect(ids.size).toBe(100);
    expect(kinds.size).toBe(INFINITE_RESEARCH_KINDS.length);
    expect(infiniteResearchProjectFor(99).cost).toBeGreaterThan(infiniteResearchProjectFor(0).cost); // the ladder climbs
  });
});

describe("Research Roster — self-review: complete every research path (AF-082 §Self Review Loop)", () => {
  it("EVERY path completes through the REAL engine — all eighteen projects, the hidden conduit chain included", () => {
    const tree = new ResearchTree(ROSTER_RESEARCH_TREE);
    const totalCost = ROSTER_RESEARCH_TREE.reduce((sum, n) => sum + n.cost, 0);
    tree.addPoints(totalCost);
    tree.reveal("ancient-conduit");
    let progressed = true;
    while (progressed) {
      progressed = false;
      for (const def of ROSTER_RESEARCH_TREE) if (tree.unlock(def.id)) progressed = true;
    }
    expect(tree.snapshot.unlockedCount).toBe(18);
    expect(tree.isUnlocked("afterlight-network")).toBe(true); // the ancient chain resolves end-to-end
    expect(tree.snapshot.points).toBe(0);
  });

  it("1,000 seeded scientific careers through the REAL engine on the full roster tree: unlocks never regress, the ledger never drifts, gated projects never fire early", () => {
    for (let career = 0; career < 1000; career += 1) {
      const rng = new Rng(career);
      const tree = new ResearchTree(ROSTER_RESEARCH_TREE);
      let lastUnlocked = 0;
      for (let step = 0; step < 50; step += 1) {
        const roll = rng.next();
        if (roll < 0.4) tree.addPoints(1 + Math.floor(rng.next() * 6));
        else if (roll < 0.5) tree.reveal("ancient-conduit");
        else {
          const target = ROSTER_RESEARCH_TREE[Math.floor(rng.next() * ROSTER_RESEARCH_TREE.length)]!;
          tree.unlock(target.id);
        }
        const snapshot = tree.snapshot;
        if (snapshot.points < 0) throw new Error(`career ${career}: points negative`);
        if (snapshot.unlockedCount < lastUnlocked) throw new Error(`career ${career}: unlocks regressed`);
        lastUnlocked = snapshot.unlockedCount;
        if (tree.isUnlocked("afterlight-network") && !tree.isUnlocked("ancient-conduit")) {
          throw new Error(`career ${career}: the Network fired before the conduit`);
        }
        const spent = tree.unlockedNodes.reduce((sum, n) => sum + n.cost, 0);
        if (snapshot.totalPointsEarned - snapshot.points !== spent) throw new Error(`career ${career}: ledger drifted`);
      }
    }
  });
});
