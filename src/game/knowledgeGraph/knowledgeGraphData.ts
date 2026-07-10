/**
 * The Atlas Knowledge Graph (AF-151). Explicitly "sitting above the
 * Master Index" per its own text — "Where the Master Index stores
 * information, the Knowledge Graph understands relationships." Graph
 * node ids are meant to BE AF-150's real `MasterIndexEntry` ids (this
 * module never invents a second id space); this module's genuinely new
 * contribution is the EDGE layer AF-150's `RelationshipGraph` doesn't
 * have.
 *
 * AF-150's real `RelationshipGraph` already implements a simple,
 * untyped edge list over its own 9 `RelationshipKind` values
 * (`link(fromId, kind, toId)`, `relatedTo(id)`) — confirmed no
 * strength/confidence/historical-context/date fields exist on that
 * class. AF-151's own 19-kind `GraphEdgeKind` union and richer
 * `GraphEdge` shape (strength/confidence/historicalContext/
 * dateEstablished) are genuinely new — a semantic layer on top of, not
 * a replacement for, AF-150's simpler relationship list. Both classes
 * can coexist over the same node ids without collision.
 *
 * "Intelligent Discovery" (7 items) and "Automated Validation" (7
 * items) both overlap heavily with AF-150's real
 * `DEVELOPER_DASHBOARD_CHECKS` (8 items) and AF-148's canon-checking
 * functions — "Isolated nodes" is the one item genuinely computable
 * purely from graph structure (no edges in or out), so
 * `KnowledgeGraph.isIsolated` implements exactly that, while the
 * remaining items across all three lists stay pure reference data,
 * the same honest scope boundary AF-140 through AF-150 already applied
 * to sections with no generic computational analog.
 *
 * "Prediction Support" (6 examples) overlaps in wording with AF-144's
 * real `PREDICTION_KINDS`/`PredictionEngine` ("Research breakthroughs"
 * ≈ "Research ready for breakthrough"; "Festival scheduling" ≈
 * "Festival becoming tradition") — but AF-144's engine is a numeric
 * time-series trend forecaster, a structurally different mechanic from
 * graph-based connection suggestion. This module's own
 * `suggestConnections` (shared-neighbour graph traversal) is the
 * genuinely new, distinct mechanic — never a redeclaration of
 * `PredictionEngine`.
 *
 * "Commander Graph"/"Planet Graph"/"Historical Graph"/"Evolution
 * Graph" are all just FILTERED VIEWS over the one real edge store —
 * `KnowledgeGraph.subgraphFor` implements that generically once,
 * rather than four separate near-duplicate view classes.
 */
export const GRAPH_NODE_KIND_EXAMPLES = [
  "Commander",
  "Planet",
  "Galaxy",
  "Species",
  "Faction",
  "Ship",
  "Technology",
  "Research",
  "Quest",
  "Museum Artifact",
  "Historic Event",
  "Relationship",
  "Weather Pattern",
  "Biome",
  "Settlement",
  "Megaproject",
  "Building",
  "Book",
  "Photograph",
  "Conversation",
] as const;

export const GRAPH_EDGE_KINDS = ["Created", "Discovered", "Mentored", "Built", "Protected", "Destroyed", "Recovered", "Inspired", "Researched", "Visited", "Commanded", "Restored", "Founded", "Evolved Into", "Member Of", "Adjacent To", "Parent Of", "Child Of", "Influenced"] as const;
export type GraphEdgeKind = (typeof GRAPH_EDGE_KINDS)[number];

export interface GraphEdge {
  fromId: string;
  toId: string;
  kind: GraphEdgeKind;
  strength: number;
  confidence: number;
  historicalContext: string;
  dateEstablished: number;
}

export const INTELLIGENT_DISCOVERY_KINDS = ["Missing relationships", "Unused lore", "Forgotten locations", "Disconnected systems", "Duplicate mechanics", "Timeline inconsistencies", "Potential story hooks"] as const;

export const AUTOMATED_VALIDATION_CHECKS = ["Broken links", "Isolated nodes", "Impossible chronology", "Missing museum references", "Unused dialogue", "Redundant systems", "Canon violations"] as const;

export const COMMANDER_GRAPH_CONNECTION_KINDS = ["Friendships", "Mentorships", "Operations", "Research", "Ships", "Planets", "Expeditions", "Museum contributions", "Chronicle entries", "Legacy"] as const;

export const PLANET_GRAPH_CONNECTION_KINDS = ["Species", "Weather", "Settlements", "History", "Architecture", "Economy", "Research", "Commanders", "Exploration", "Trade"] as const;

export const HISTORICAL_GRAPH_CONNECTION_KINDS = ["Cause", "Effect", "Participants", "Evidence", "Museum exhibits", "Books", "News", "Commander memories", "Future consequences"] as const;

export const EVOLUTION_GRAPH_TRACK_KINDS = ["Technology", "Architecture", "Civilisation", "Language", "Wildlife", "Research", "Player legacy", "Generations"] as const;

/** Overlaps in wording with AF-144's real `PREDICTION_KINDS` (see
 * module doc comment) — kept as reference only; the real new mechanic
 * is `KnowledgeGraph.suggestConnections`, a structurally different
 * graph-traversal approach, never a redeclaration of AF-144's
 * `PredictionEngine`. */
export const PREDICTION_SUPPORT_EXAMPLES = ["Commander likely to collaborate", "Research ready for breakthrough", "Planet nearing Capital status", "Species likely to migrate", "Economy approaching surplus", "Festival becoming tradition"] as const;

export const NARRATIVE_ASSISTANCE_SUGGESTIONS = ["Shared history", "Existing friendships", "Planet references", "Relevant discoveries", "Previous jokes", "Historical callbacks"] as const;

export const AUTHORING_SUPPORT_SUGGESTIONS = ["Dialogue", "Relationships", "Museum placement", "Chronicle entries", "Faction reactions", "Commander interactions", "Potential conflicts"] as const;

export const VISUALISATION_KINDS = ["Galaxy network", "Commander relationships", "Timeline", "Faction influence", "Research dependencies", "Civilisation growth", "Museum knowledge", "Story connections"] as const;

export const KNOWLEDGE_GRAPH_ACCESSIBILITY_SURFACES = ["Search by concept", "Search by relationship", "Visual graph filters", "Narration ready", "Colour-safe graph themes"] as const;
