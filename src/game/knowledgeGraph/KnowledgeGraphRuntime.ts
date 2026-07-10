/**
 * KnowledgeGraphRuntime pieces (AF-151). `KnowledgeGraph` is a real,
 * semantic edge store layered above AF-150's real `RelationshipGraph`
 * (a simpler, untyped edge list) — the two coexist over the same node
 * ids without collision, neither imports the other.
 */
import type { GraphEdge, GraphEdgeKind } from "./knowledgeGraphData";

/**
 * "Every edge stores strength, confidence, historical context, date
 * established." Append-only, and the one real graph store this module
 * builds — `edgesFrom`/`edgesTo`/`neighbors`/`subgraphFor` all read
 * from it, so "Commander Graph"/"Planet Graph"/"Historical Graph"/
 * "Evolution Graph" are filtered views over ONE store, not four
 * separate near-duplicate classes.
 */
export class KnowledgeGraph {
  private readonly edges: GraphEdge[] = [];

  addEdge(edge: GraphEdge): GraphEdge {
    this.edges.push(edge);
    return edge;
  }

  edgesFrom(nodeId: string): readonly GraphEdge[] {
    return this.edges.filter((e) => e.fromId === nodeId);
  }

  edgesTo(nodeId: string): readonly GraphEdge[] {
    return this.edges.filter((e) => e.toId === nodeId);
  }

  edgesTouching(nodeId: string): readonly GraphEdge[] {
    return this.edges.filter((e) => e.fromId === nodeId || e.toId === nodeId);
  }

  neighbors(nodeId: string): readonly string[] {
    const ids = new Set<string>();
    for (const edge of this.edgesTouching(nodeId)) ids.add(edge.fromId === nodeId ? edge.toId : edge.fromId);
    return [...ids];
  }

  /** "Automated Validation... Isolated nodes." The one genuinely
   * computable item across "Intelligent Discovery"/"Automated
   * Validation" — no edges touch this node at all. */
  isIsolated(nodeId: string): boolean {
    return this.edgesTouching(nodeId).length === 0;
  }

  /** "Commander Graph"/"Planet Graph"/etc. — a generic filtered view
   * over real edges, rather than four separate near-duplicate classes. */
  subgraphFor(nodeId: string, kinds?: readonly GraphEdgeKind[]): readonly GraphEdge[] {
    const touching = this.edgesTouching(nodeId);
    return kinds ? touching.filter((e) => kinds.includes(e.kind)) : touching;
  }

  /**
   * "Authoring Support... automatically suggest relationships." A real
   * shared-neighbour graph-traversal suggestion — structurally
   * different from AF-144's real `PredictionEngine` (a numeric
   * time-series trend forecaster), never a redeclaration of it.
   * Ranks candidates by how many shared neighbours they have with
   * `nodeId`, excluding `nodeId`'s own existing neighbours.
   */
  suggestConnections(nodeId: string, limit = 5): readonly string[] {
    const ownNeighbors = new Set(this.neighbors(nodeId));
    const candidateScores = new Map<string, number>();
    for (const neighborId of ownNeighbors) {
      for (const secondHop of this.neighbors(neighborId)) {
        if (secondHop === nodeId || ownNeighbors.has(secondHop)) continue;
        candidateScores.set(secondHop, (candidateScores.get(secondHop) ?? 0) + 1);
      }
    }
    return [...candidateScores.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id);
  }

  all(): readonly GraphEdge[] {
    return this.edges;
  }
}

/**
 * "Automated Validation... Impossible chronology." A decoupled composer
 * — takes a plain lookup function rather than importing AF-150's
 * `MasterIndexRegistry` directly. An edge is impossible if it was
 * established before either endpoint is known to have existed.
 */
export function chronologyViolations(edges: readonly GraphEdge[], creationEpochFor: (nodeId: string) => number | null): readonly GraphEdge[] {
  return edges.filter((edge) => {
    const fromEpoch = creationEpochFor(edge.fromId);
    const toEpoch = creationEpochFor(edge.toId);
    return (fromEpoch !== null && edge.dateEstablished < fromEpoch) || (toEpoch !== null && edge.dateEstablished < toEpoch);
  });
}
