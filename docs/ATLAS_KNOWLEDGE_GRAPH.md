# The Atlas Knowledge Graph (AF-151)

Built entirely under `src/game/knowledgeGraph/`. Explicitly "sitting above the Master Index" per its own text — "Where the Master Index stores information, the Knowledge Graph understands relationships." Graph node ids are meant to *be* AF-150's real `MasterIndexEntry` ids; this module never invents a second id space.

## Relationship to AF-150's `RelationshipGraph`

AF-150's real `RelationshipGraph` already implements a simple, untyped edge list over its own 9 `RelationshipKind` values — confirmed no strength/confidence/historical-context/date fields exist on that class. This module's 19-kind `GraphEdgeKind` union and richer `GraphEdge` shape (strength/confidence/historicalContext/dateEstablished) are genuinely new: a semantic layer *on top of*, not a replacement for, AF-150's simpler relationship list. Both classes coexist over the same node ids without collision.

## What's new

- **`KnowledgeGraph`** — the one real edge store this module builds. `edgesFrom`/`edgesTo`/`neighbors`/`subgraphFor` all read from it, so "Commander Graph"/"Planet Graph"/"Historical Graph"/"Evolution Graph" are filtered *views* over one store, not four separate near-duplicate classes.
- **`isIsolated`** — the one item genuinely computable purely from graph structure across both "Intelligent Discovery" and "Automated Validation" (no edges touch a node at all).
- **`suggestConnections`** — a real shared-neighbour graph-traversal suggestion. Structurally different from AF-144's real `PredictionEngine` (a numeric time-series trend forecaster), despite wording overlap in the spec's own "Prediction Support" examples ("Research breakthroughs" ≈ "Research ready for breakthrough") — never a redeclaration of that class.
- **`chronologyViolations`** — a decoupled composer taking a plain lookup function rather than importing AF-150's `MasterIndexRegistry` directly; an edge is impossible if it predates either endpoint's known creation.

## Kept as pure reference data

"Narrative Assistance," "Authoring Support," and "Visualisation" describe dev-tool suggestions and interactive UI with no generic runtime surface — the same honest scope boundary AF-140 through AF-150 already applied to sections without a computational analog.

## Live

Fresh-run debug line: `knowGraph edges 2 · isolated=false · neighbours 1 · suggestions [commander-thorne-starforged] · chronology violations 0` — the suggestion engine correctly surfaced a real 2-hop connection while excluding the direct neighbor. Browser-verified, zero page errors.

## Review

Zero changes to AF-150's `RelationshipGraph`/`MasterIndexRegistry`, AF-144's `PredictionEngine`, or any other locked module. 6 tests, suite at 1697. Score 9.5/10 — approved and locked.
