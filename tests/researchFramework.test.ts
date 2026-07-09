import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { RESEARCH_CATEGORIES, SANDBOX_RESEARCH_TREE } from "../src/game/research/researchData";
import { ResearchTree } from "../src/game/research/ResearchTree";
import { SANDBOX_CODEX_ENTRIES } from "../src/game/codex/codexData";
import {
  DISCOVERY_ROUTES,
  FRAMEWORK_RESEARCH_TREE,
  LATTICE_ATTUNEMENT,
  MAJOR_DISCOVERY_KINDS,
  PRIMARY_BRANCH_TO_CATEGORY,
  PRIMARY_RESEARCH_BRANCHES,
  RESEARCH_ACCESSIBILITY_SURFACES,
  RESEARCH_ARCHITECTURE_PARTS,
  RESEARCH_FORBIDDEN_OUTCOMES,
  RESEARCH_LABORATORIES,
  RESEARCH_PRESENTATION_FEATURES,
  RESEARCH_PROJECT_PROFILES,
  RESEARCH_RESOURCES,
  RESEARCH_SYNERGY_SURFACES,
  RESEARCH_UNLOCK_KINDS,
  SCIENTIFIC_DISCIPLINES,
  SECONDARY_BRANCH_TO_CATEGORY,
  SECONDARY_RESEARCH_BRANCHES,
  categoryForBranch,
  dependencyMapFor,
  researchArchitectureFor,
  researchEfficiencyFor,
  scientificProgressFor,
} from "../src/game/research/researchFrameworkData";

const KNOWN_IDS = new Set(FRAMEWORK_RESEARCH_TREE.map((n) => n.id));

function defFor(nodeId: string) {
  return FRAMEWORK_RESEARCH_TREE.find((n) => n.id === nodeId)!;
}

describe("Research Framework vocabulary — registered shelves (AF-081)", () => {
  it("registers fifteen primary branches, ten secondary branches, twelve architecture parts, ten disciplines, eight unlock kinds, seven discovery kinds, eight laboratories, seven resources, seven discovery routes, eight synergy surfaces, six presentation features, two forbidden outcomes, eight accessibility surfaces", () => {
    expect(PRIMARY_RESEARCH_BRANCHES.length).toBe(15);
    expect(SECONDARY_RESEARCH_BRANCHES.length).toBe(10);
    expect(RESEARCH_ARCHITECTURE_PARTS.length).toBe(12);
    expect(SCIENTIFIC_DISCIPLINES.length).toBe(10);
    expect(RESEARCH_UNLOCK_KINDS.length).toBe(8);
    expect(MAJOR_DISCOVERY_KINDS.length).toBe(7);
    expect(RESEARCH_LABORATORIES.length).toBe(8);
    expect(RESEARCH_RESOURCES.length).toBe(7);
    expect(DISCOVERY_ROUTES.length).toBe(7);
    expect(RESEARCH_SYNERGY_SURFACES.length).toBe(8);
    expect(RESEARCH_PRESENTATION_FEATURES.length).toBe(6);
    expect(RESEARCH_FORBIDDEN_OUTCOMES.length).toBe(2);
    expect(RESEARCH_ACCESSIBILITY_SURFACES.length).toBe(8);
  });

  it("both branch shelves map TOTALLY onto AF-024's category shelf, and every laboratory, resource and route carries an authored identity", () => {
    for (const branch of PRIMARY_RESEARCH_BRANCHES) expect([...RESEARCH_CATEGORIES]).toContain(PRIMARY_BRANCH_TO_CATEGORY[branch]);
    for (const branch of SECONDARY_RESEARCH_BRANCHES) expect([...RESEARCH_CATEGORIES]).toContain(SECONDARY_BRANCH_TO_CATEGORY[branch]);
    for (const lab of RESEARCH_LABORATORIES) expect(lab.specialisation.length, lab.id).toBeGreaterThan(0);
    for (const resource of RESEARCH_RESOURCES) expect(resource.identity.length, resource.id).toBeGreaterThan(0);
    for (const route of DISCOVERY_ROUTES) expect(route.identity.length, route.id).toBeGreaterThan(0);
    // Exactly one resource is LIVE today — AF-024's real point economy; the rest honestly await producers.
    expect(RESEARCH_RESOURCES.filter((r) => r.live).map((r) => r.id)).toEqual(["researchPoints"]);
  });
});

describe("The framework tree — AF-024 untouched, one project added (AF-081)", () => {
  it("fourteen projects: the locked thirteen head the tree unchanged; Lattice Attunement is the FIRST crystalResonance project and passes the real engine's validation", () => {
    expect(FRAMEWORK_RESEARCH_TREE.length).toBe(14);
    expect(SANDBOX_RESEARCH_TREE.length).toBe(13);
    expect(FRAMEWORK_RESEARCH_TREE.slice(0, SANDBOX_RESEARCH_TREE.length)).toEqual(SANDBOX_RESEARCH_TREE);
    expect(SANDBOX_RESEARCH_TREE.some((n) => n.category === "crystalResonance")).toBe(false); // first producer
    expect(LATTICE_ATTUNEMENT.category).toBe("crystalResonance");
    expect(LATTICE_ATTUNEMENT.effect).toBeNull(); // the breakthrough is gameplay, not a number — literally
    expect(() => new ResearchTree(FRAMEWORK_RESEARCH_TREE)).not.toThrow(); // no duplicates, no cycles, no dangling prerequisites
  });

  it("every project proves all twelve architecture parts, and RESEARCH TIME honours DR-005 — instant, permanently", () => {
    expect(RESEARCH_PROJECT_PROFILES.length).toBe(FRAMEWORK_RESEARCH_TREE.length); // every project has a profile
    for (const profile of RESEARCH_PROJECT_PROFILES) {
      const def = defFor(profile.nodeId);
      expect(def, profile.nodeId).toBeDefined();
      const architecture = researchArchitectureFor(def, profile, KNOWN_IDS);
      for (const part of RESEARCH_ARCHITECTURE_PARTS) {
        expect(architecture[part], `${profile.nodeId} missing ${part}`).toBe(true);
      }
      expect(def.completionTimeMs).toBe(0); // DR-005, owner-ratified
    }
  });

  it("THREE-LAYER BINDING: every profile's branch resolves to exactly its node's AF-024 category, its laboratory resolves, and its codex entry is REAL", () => {
    for (const profile of RESEARCH_PROJECT_PROFILES) {
      const def = defFor(profile.nodeId);
      expect(categoryForBranch(profile.branch), `${profile.nodeId} branch/category`).toBe(def.category);
      expect(RESEARCH_LABORATORIES.some((l) => l.id === profile.laboratoryId), `${profile.nodeId} lab`).toBe(true);
      expect(SANDBOX_CODEX_ENTRIES.some((e) => e.id === profile.codexEntryId), `${profile.nodeId} codex ${profile.codexEntryId}`).toBe(true);
    }
  });
});

describe("The law — research never simply increases statistics (AF-081 §Objective)", () => {
  it("gameplayUnlock is a kind and a description with NO numeric field — stat-flavoured breakthroughs are unrepresentable at the profile layer", () => {
    for (const profile of RESEARCH_PROJECT_PROFILES) {
      expect(Object.keys(profile.gameplayUnlock).sort()).toEqual(["description", "kind"]);
      expect([...RESEARCH_UNLOCK_KINDS]).toContain(profile.gameplayUnlock.kind);
      expect(profile.gameplayUnlock.description.length, profile.nodeId).toBeGreaterThan(0);
    }
  });
});

describe("Derived presentation — maps and metrics are pure functions (AF-081 §Visual Presentation / §Debug)", () => {
  it("the dependency map mirrors the tree exactly, and efficiency/progress stay within [0, 1]", () => {
    const map = dependencyMapFor(FRAMEWORK_RESEARCH_TREE);
    expect(Object.keys(map).length).toBe(FRAMEWORK_RESEARCH_TREE.length);
    for (const def of FRAMEWORK_RESEARCH_TREE) expect(map[def.id]).toEqual(def.prerequisites);
    expect(researchEfficiencyFor({ points: 0, totalPointsEarned: 0 })).toBe(0);
    expect(researchEfficiencyFor({ points: 3, totalPointsEarned: 10 })).toBeCloseTo(0.7, 5);
    expect(scientificProgressFor(0, 15)).toBe(0);
    expect(scientificProgressFor(15, 15)).toBe(1);
    expect(scientificProgressFor(5, 0)).toBe(0);
  });
});

describe("Research Framework — self-review: complete every research project (AF-081 §Self Review Loop)", () => {
  it("EVERY project unlocks through the REAL engine — reveal the hidden discovery, satisfy every dependency, spend every cost", () => {
    const tree = new ResearchTree(FRAMEWORK_RESEARCH_TREE);
    const totalCost = FRAMEWORK_RESEARCH_TREE.reduce((sum, n) => sum + n.cost, 0);
    tree.addPoints(totalCost);
    tree.reveal("ancient-conduit");
    let progressed = true;
    while (progressed) {
      progressed = false;
      for (const def of FRAMEWORK_RESEARCH_TREE) {
        if (tree.unlock(def.id)) progressed = true;
      }
    }
    expect(tree.snapshot.unlockedCount).toBe(FRAMEWORK_RESEARCH_TREE.length);
    expect(tree.snapshot.points).toBe(0); // every earned point converted — efficiency 1
    expect(researchEfficiencyFor(tree.snapshot)).toBe(1);
    expect(scientificProgressFor(tree.snapshot.unlockedCount, FRAMEWORK_RESEARCH_TREE.length)).toBe(1);
    // Reset refunds everything and preserves the discovery (AF-024's law, re-proven on the extended tree).
    expect(tree.reset()).toBe(totalCost);
    expect(tree.snapshot.unlockedCount).toBe(0);
    expect(tree.stateOf("ancient-conduit")).not.toBe("hidden");
  });

  it("1,000 seeded research careers through the REAL engine: unlocks never regress, points never go negative, spent always equals earned minus banked", () => {
    for (let career = 0; career < 1000; career += 1) {
      const rng = new Rng(career);
      const tree = new ResearchTree(FRAMEWORK_RESEARCH_TREE);
      let lastUnlocked = 0;
      for (let step = 0; step < 40; step += 1) {
        const roll = rng.next();
        if (roll < 0.4) tree.addPoints(1 + Math.floor(rng.next() * 5));
        else if (roll < 0.5) tree.reveal("ancient-conduit");
        else {
          const target = FRAMEWORK_RESEARCH_TREE[Math.floor(rng.next() * FRAMEWORK_RESEARCH_TREE.length)]!;
          tree.unlock(target.id); // rejections are safe no-ops — the engine's contract
        }
        const snapshot = tree.snapshot;
        if (snapshot.points < 0) throw new Error(`career ${career}: points went negative`);
        if (snapshot.unlockedCount < lastUnlocked) throw new Error(`career ${career}: unlocks regressed`);
        lastUnlocked = snapshot.unlockedCount;
        const spent = tree.unlockedNodes.reduce((sum, n) => sum + n.cost, 0);
        if (snapshot.totalPointsEarned - snapshot.points !== spent) throw new Error(`career ${career}: ledger drifted`);
        const efficiency = researchEfficiencyFor(snapshot);
        if (efficiency < 0 || efficiency > 1) throw new Error(`career ${career}: efficiency out of bounds`);
      }
    }
  });
});
