import { describe, expect, it } from "vitest";
import {
  AUTOMATED_VALIDATION_CHECKS,
  AUTHORING_SUPPORT_SUGGESTIONS,
  COMMANDER_GRAPH_CONNECTION_KINDS,
  EVOLUTION_GRAPH_TRACK_KINDS,
  GRAPH_EDGE_KINDS,
  GRAPH_NODE_KIND_EXAMPLES,
  HISTORICAL_GRAPH_CONNECTION_KINDS,
  INTELLIGENT_DISCOVERY_KINDS,
  KNOWLEDGE_GRAPH_ACCESSIBILITY_SURFACES,
  NARRATIVE_ASSISTANCE_SUGGESTIONS,
  PLANET_GRAPH_CONNECTION_KINDS,
  PREDICTION_SUPPORT_EXAMPLES,
  VISUALISATION_KINDS,
  type GraphEdge,
} from "../src/game/knowledgeGraph/knowledgeGraphData";
import { KnowledgeGraph, chronologyViolations } from "../src/game/knowledgeGraph/KnowledgeGraphRuntime";

function makeEdge(overrides: Partial<GraphEdge>): GraphEdge {
  return {
    fromId: "a",
    toId: "b",
    kind: "Influenced",
    strength: 50,
    confidence: 80,
    historicalContext: "",
    dateEstablished: 0,
    ...overrides,
  };
}

describe("The Atlas Knowledge Graph (AF-151)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(GRAPH_NODE_KIND_EXAMPLES.length).toBe(20);
    expect(GRAPH_EDGE_KINDS.length).toBe(19);
    expect(INTELLIGENT_DISCOVERY_KINDS.length).toBe(7);
    expect(AUTOMATED_VALIDATION_CHECKS.length).toBe(7);
    expect(COMMANDER_GRAPH_CONNECTION_KINDS.length).toBe(10);
    expect(PLANET_GRAPH_CONNECTION_KINDS.length).toBe(10);
    expect(HISTORICAL_GRAPH_CONNECTION_KINDS.length).toBe(9);
    expect(EVOLUTION_GRAPH_TRACK_KINDS.length).toBe(8);
    expect(PREDICTION_SUPPORT_EXAMPLES.length).toBe(6);
    expect(NARRATIVE_ASSISTANCE_SUGGESTIONS.length).toBe(6);
    expect(AUTHORING_SUPPORT_SUGGESTIONS.length).toBe(7);
    expect(VISUALISATION_KINDS.length).toBe(8);
    expect(KNOWLEDGE_GRAPH_ACCESSIBILITY_SURFACES.length).toBe(5);
  });

  it("KnowledgeGraph is append-only and queryable from either direction, a semantic layer distinct from AF-150's real untyped RelationshipGraph", () => {
    const graph = new KnowledgeGraph();
    graph.addEdge(makeEdge({ fromId: "commander-fen-beastmaster", toId: "species-wolf", kind: "Protected", strength: 90 }));
    expect(graph.edgesFrom("commander-fen-beastmaster").length).toBe(1);
    expect(graph.edgesTo("species-wolf").length).toBe(1);
    expect(graph.all().length).toBe(1);
  });

  it("isIsolated is true only when zero edges touch a node — the one genuinely computable Intelligent Discovery/Automated Validation item", () => {
    const graph = new KnowledgeGraph();
    graph.addEdge(makeEdge({ fromId: "a", toId: "b" }));
    expect(graph.isIsolated("a")).toBe(false);
    expect(graph.isIsolated("z")).toBe(true);
  });

  it("subgraphFor filters edges by kind, generically covering Commander/Planet/Historical/Evolution Graph views over one real store", () => {
    const graph = new KnowledgeGraph();
    graph.addEdge(makeEdge({ fromId: "commander-fen-beastmaster", toId: "species-wolf", kind: "Protected" }));
    graph.addEdge(makeEdge({ fromId: "commander-fen-beastmaster", toId: "planet-lucent-gate", kind: "Visited" }));
    expect(graph.subgraphFor("commander-fen-beastmaster").length).toBe(2);
    expect(graph.subgraphFor("commander-fen-beastmaster", ["Protected"]).length).toBe(1);
  });

  it("suggestConnections ranks shared-neighbour candidates, a structurally different mechanic from AF-144's real PredictionEngine trend forecaster", () => {
    const graph = new KnowledgeGraph();
    graph.addEdge(makeEdge({ fromId: "commander-fen-beastmaster", toId: "commander-voss-pathfinder", kind: "Influenced" }));
    graph.addEdge(makeEdge({ fromId: "commander-voss-pathfinder", toId: "commander-thorne-starforged", kind: "Mentored" }));
    graph.addEdge(makeEdge({ fromId: "commander-atlas-prime", toId: "commander-thorne-starforged", kind: "Mentored" }));
    const suggestions = graph.suggestConnections("commander-fen-beastmaster");
    expect(suggestions).toContain("commander-thorne-starforged");
    expect(suggestions).not.toContain("commander-voss-pathfinder");
  });

  it("chronologyViolations flags an edge established before either endpoint existed, composed via a decoupled lookup function", () => {
    const edges = [makeEdge({ fromId: "commander-a", toId: "planet-b", dateEstablished: 2 }), makeEdge({ fromId: "commander-a", toId: "planet-c", dateEstablished: 20 })];
    const creationEpochFor = (id: string) => (id === "planet-b" ? 10 : id === "commander-a" ? 0 : 5);
    const violations = chronologyViolations(edges, creationEpochFor);
    expect(violations.length).toBe(1);
    expect(violations[0]?.toId).toBe("planet-b");
  });
});
