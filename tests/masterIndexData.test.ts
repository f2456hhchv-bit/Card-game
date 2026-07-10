import { describe, expect, it } from "vitest";
import {
  DEPENDENCY_RELATION_KINDS,
  DEVELOPER_DASHBOARD_CHECKS,
  DOCUMENTATION_LINK_KINDS,
  FAILSAFE_SHIP_GATES,
  MASTER_CATALOGUE_CATEGORIES,
  MASTER_INDEX_ACCESSIBILITY_SURFACES,
  PLAYER_FACING_DERIVATIVES,
  QUALITY_TRACKING_CATEGORIES,
  RELATIONSHIP_KINDS,
  VISUAL_MAP_KINDS,
  shipGatePassed,
  type MasterIndexEntry,
} from "../src/game/masterIndex/masterIndexData";
import { DependencyMap, MasterIndexRegistry, QualityTracker, RelationshipGraph, VersionHistoryLedger } from "../src/game/masterIndex/MasterIndexRuntime";

function makeEntry(overrides: Partial<MasterIndexEntry>): MasterIndexEntry {
  return {
    id: "index-x",
    category: "Commanders",
    moduleOrigin: "AF-030",
    creationEpoch: 0,
    canonStatus: "Core Timeline",
    dependencies: [],
    relatedSystems: [],
    museumLinks: [],
    chronicleLinks: [],
    expansionCompatibility: [],
    ...overrides,
  };
}

describe("The Afterlight Universe Master Index (AF-150)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(MASTER_CATALOGUE_CATEGORIES.length).toBe(34);
    expect(RELATIONSHIP_KINDS.length).toBe(9);
    expect(DEPENDENCY_RELATION_KINDS.length).toBe(6);
    expect(QUALITY_TRACKING_CATEGORIES.length).toBe(8);
    expect(DOCUMENTATION_LINK_KINDS.length).toBe(8);
    expect(VISUAL_MAP_KINDS.length).toBe(8);
    expect(DEVELOPER_DASHBOARD_CHECKS.length).toBe(8);
    expect(PLAYER_FACING_DERIVATIVES.length).toBe(8);
    expect(FAILSAFE_SHIP_GATES.length).toBe(8);
    expect(MASTER_INDEX_ACCESSIBILITY_SURFACES.length).toBe(5);
  });

  it("shipGatePassed requires every one of the 8 gates, the eighth all-must-pass checklist gate in this codebase", () => {
    const partial = new Set(FAILSAFE_SHIP_GATES.slice(0, 7));
    expect(shipGatePassed(partial)).toBe(false);
    expect(shipGatePassed(new Set(FAILSAFE_SHIP_GATES))).toBe(true);
  });

  it("MasterIndexRegistry rejects duplicate ids and self-dependencies without mutating state", () => {
    const registry = new MasterIndexRegistry();
    expect(registry.register(makeEntry({ id: "commander-fen-beastmaster" })).ok).toBe(true);
    expect(registry.register(makeEntry({ id: "commander-fen-beastmaster" })).ok).toBe(false);
    expect(registry.register(makeEntry({ id: "self-dep", dependencies: ["self-dep"] })).ok).toBe(false);
    expect(registry.all().length).toBe(1);
  });

  it("MasterIndexRegistry rejects a registration that would create a dependency cycle", () => {
    const registry = new MasterIndexRegistry();
    registry.register(makeEntry({ id: "x", dependencies: ["y"] }));
    const closesCycle = registry.register(makeEntry({ id: "y", dependencies: ["x"] }));
    expect(closesCycle.ok).toBe(false);
    expect(registry.all().length).toBe(1);
  });

  it("MasterIndexRegistry.search matches by id, category, and related systems", () => {
    const registry = new MasterIndexRegistry();
    registry.register(makeEntry({ id: "commander-fen-beastmaster", category: "Commanders", relatedSystems: ["wildlife"] }));
    registry.register(makeEntry({ id: "planet-lucent-gate", category: "Planets", relatedSystems: ["mining"] }));
    expect(registry.search("wildlife").length).toBe(1);
    expect(registry.search("planet").length).toBe(1);
    expect(registry.byCategory("Commanders").length).toBe(1);
  });

  it("RelationshipGraph is append-only and queryable from either direction", () => {
    const graph = new RelationshipGraph();
    graph.link("commander-fen-beastmaster", "Related Species", "species-wolf");
    expect(graph.relatedTo("commander-fen-beastmaster").length).toBe(1);
    expect(graph.relatedTo("species-wolf").length).toBe(1);
    expect(graph.all().length).toBe(1);
  });

  it("DependencyMap records typed relations distinct from the registry's own cycle check", () => {
    const map = new DependencyMap();
    map.record("expansion-ocean-worlds", "Required systems", "civilisation-engine");
    map.record("expansion-ocean-worlds", "Optional systems", "galactic-creator-engine");
    expect(map.relationsFor("expansion-ocean-worlds").length).toBe(2);
    expect(map.relationsFor("expansion-ocean-worlds", "Required systems").length).toBe(1);
  });

  it("VersionHistoryLedger is append-only — history is never deleted", () => {
    const ledger = new VersionHistoryLedger();
    ledger.recordChange("commander-fen-beastmaster", "dev-1", "Rebalanced ultimate cooldown.", ["combat"], 4);
    ledger.recordChange("commander-fen-beastmaster", "dev-2", "Added new dialogue line.", ["narrative"], 9);
    expect(ledger.historyFor("commander-fen-beastmaster").length).toBe(2);
    expect(ledger.all().length).toBe(2);
  });

  it("QualityTracker averages per-category scores per indexed object, distinct from AF-143/149's per-feature score cards", () => {
    const tracker = new QualityTracker();
    tracker.setScore("commander-fen-beastmaster", "Accessibility score", 8);
    tracker.setScore("commander-fen-beastmaster", "Narrative score", 10);
    expect(tracker.overallFor("commander-fen-beastmaster")).toBe(9);
    tracker.setScore("commander-fen-beastmaster", "Accessibility score", 20);
    expect(tracker.scoreFor("commander-fen-beastmaster", "Accessibility score")).toBe(10);
  });

  it("self-review: stress-tests a graph of 2000 synthetic indexed entries — registration and dependency order stay correct and fast", () => {
    const registry = new MasterIndexRegistry();
    const count = 2000;
    for (let i = 0; i < count; i++) {
      const dependencies = i === 0 ? [] : [`entry-${i - 1}`];
      const result = registry.register(makeEntry({ id: `entry-${i}`, dependencies }));
      expect(result.ok).toBe(true);
    }
    const order = registry.dependencyOrder()!;
    expect(order.length).toBe(count);
    for (let i = 1; i < count; i++) expect(order.indexOf(`entry-${i - 1}`)).toBeLessThan(order.indexOf(`entry-${i}`));
  });
});
